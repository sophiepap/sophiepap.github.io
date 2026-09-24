"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

type Props = {
  activeTarget: string | null;
  onTargetChange: (target: string | null) => void;
};

type CameraTarget = "room" | "computer" | "board" | "cv";

/*
  ΠΡΟΣΩΡΙΝΕΣ camera positions.

  Αυτές θα τις ρυθμίσουμε αφού δούμε το πραγματικό δωμάτιο
  και τη θέση των αντικειμένων μέσα στο Blender.
*/
// const cameraPositions: Record<CameraTarget, THREE.Vector3> = {
//   room: new THREE.Vector3(6, 4, 8),
//   computer: new THREE.Vector3(2, 2.5, 3),
//   board: new THREE.Vector3(-3, 3, 3),
//   cv: new THREE.Vector3(0, 2, 3),
// };

// const cameraLookAts: Record<CameraTarget, THREE.Vector3> = {
//   room: new THREE.Vector3(0, 1.5, 0),
//   computer: new THREE.Vector3(0, 1.8, 0),
//   board: new THREE.Vector3(-2, 2, 0),
//   cv: new THREE.Vector3(0, 1, 0),
// };


/* --------------------------------------------------
   CAMERA
-------------------------------------------------- */

// function CameraRig({ target }: { target: CameraTarget }) {
//   const { camera } = useThree();

//   const currentLook = useRef(
//     cameraLookAts.room.clone()
//   );

//   useFrame((_, delta) => {
//     const speed = 1 - Math.pow(0.001, delta);

//     camera.position.lerp(
//       cameraPositions[target],
//       speed
//     );

//     currentLook.current.lerp(
//       cameraLookAts[target],
//       speed
//     );

//     camera.lookAt(currentLook.current);
//   });

//   return null;
// }

function CameraRig({
  target,
  scene,
}: {
  target: CameraTarget;
  scene: THREE.Object3D;
}) {
  const { camera } = useThree();
  const initialized = useRef(false);

  const cameraName =
    target === "computer"
      ? "Camera_Computer"
      : target === "board"
      ? "Camera_Board"
      : target === "cv"
      ? "Camera_CV"
      : "Camera_Room";

  useFrame((_, delta) => {
    const blenderCamera = scene.getObjectByName(cameraName);

    if (!blenderCamera) {
      console.warn(`Camera not found: ${cameraName}`);
      return;
    }

    const targetPosition = new THREE.Vector3();
    const targetQuaternion = new THREE.Quaternion();

    blenderCamera.getWorldPosition(targetPosition);
    blenderCamera.getWorldQuaternion(targetQuaternion);

    // Στην πρώτη φόρτωση: πήγαινε κατευθείαν στην Camera_Room
    if (!initialized.current) {
      camera.position.copy(targetPosition);
      camera.quaternion.copy(targetQuaternion);

      if ((blenderCamera as THREE.Camera).type === "PerspectiveCamera") {
        const sourceCamera = blenderCamera as THREE.PerspectiveCamera;
        const targetCamera = camera as THREE.PerspectiveCamera;

        targetCamera.fov = sourceCamera.fov;
        targetCamera.near = sourceCamera.near;
        targetCamera.far = sourceCamera.far;
        targetCamera.updateProjectionMatrix();
      }

      initialized.current = true;
      return;
    }

    // Μετά την αρχική φόρτωση: cinematic transition
    const speed = 1 - Math.pow(0.001, delta);

    camera.position.lerp(targetPosition, speed);
    camera.quaternion.slerp(targetQuaternion, speed);
  });

  return null;
}

/* --------------------------------------------------
   ROOM MODEL
-------------------------------------------------- */

function RoomModel({
  scene,
  onTargetChange,
}: {
  scene: THREE.Object3D;
  onTargetChange: (target: string | null) => void;
}) {
  const router = useRouter();

  const [hovered, setHovered] = useState<string | null>(
    null
  );

  /*
    Ενεργοποιούμε shadows σε όλα τα meshes
    που ήρθαν από το Blender.
  */
  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [scene]);


  /*
    Ψάχνουμε προς τα πάνω στο hierarchy
    μέχρι να βρούμε ένα από τα αντικείμενα
    που μας ενδιαφέρουν.

    Άρα:

    Computer
       └ Monitor
           └ Screen

    Αν πατήσεις Screen,
    θα καταλάβει ότι ανήκει στο Computer.
  */
  function findInteractiveObject(
    object: THREE.Object3D
  ): string | null {
    const interactables = [
      "Computer",
      "Bookshelf",
      "Board",
      "CV",
    ];

    let current: THREE.Object3D | null = object;

    while (current) {
      if (interactables.includes(current.name)) {
        return current.name;
      }

      current = current.parent;
    }

    return null;
  }


  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    const target = findInteractiveObject(
      event.object
    );

    if (!target) return;

    switch (target) {
      case "Computer":
        onTargetChange("computer");
        break;

      case "Board":
        onTargetChange("board");
        break;

      case "CV":
        onTargetChange("cv");
        break;

      case "Bookshelf":
        router.push("/library");
        break;
    }
  }


  function handlePointerMove(
    event: ThreeEvent<PointerEvent>
  ) {
    const target = findInteractiveObject(
      event.object
    );

    setHovered(target);

    document.body.style.cursor =
      target ? "pointer" : "default";
  }


  function handlePointerOut() {
    setHovered(null);

    document.body.style.cursor = "default";
  }


  return (
    <group
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}

      /*
        ΕΔΩ μπορείς να διορθώσεις scale /
        position / rotation του Blender scene
        αν χρειαστεί.
      */
      scale={1}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      <primitive object={scene} />

      {/*
        Αργότερα μπορούμε εδώ να βάλουμε
        outline/glow στο hovered object.
      */}
    </group>
  );
}


/* --------------------------------------------------
   SCENE
-------------------------------------------------- */

function Scene({ activeTarget, onTargetChange, }: Props) {
  const { scene } = useGLTF("/models/room.glb");

  const hour = new Date().getHours();
  const night = hour >= 20 || hour < 7;

  const cameraTarget: CameraTarget =
    activeTarget === "computer"
      ? "computer"
      : activeTarget === "board"
        ? "board"
        : activeTarget === "cv"
          ? "cv"
          : "room";

  return (
    <>
      <CameraRig
        target={cameraTarget}
        scene={scene}
      />

      <color
        attach="background"
        args={[night ? "#101725" : "#9ea8ad"]}
      />

      <ambientLight intensity={night ? 0.6 : 1.5} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={night ? 0.5 : 2}
        castShadow
      />

      {night && (
        <pointLight
          position={[0, 3, 1]}
          intensity={4}
          distance={8}
          color="#ffad68"
          castShadow
        />
      )}

      <RoomModel
        scene={scene}
        onTargetChange={onTargetChange}
      />

      <Environment preset="apartment" />
    </>
  );
}

/* --------------------------------------------------
   CANVAS
-------------------------------------------------- */

function RoomLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div
        style={{
          color: "white",
          fontFamily: "sans-serif",
          textAlign: "center",
          letterSpacing: "0.12em",
        }}
      >
        <div>LOADING ROOM</div>
        <strong>{Math.round(progress)}%</strong>
      </div>
    </Html>
  );
}

export default function RoomScene(
  props: Props
) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0, 5],
        fov: 45,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
      }}
    >
      <Suspense fallback={<RoomLoader />}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
/*
  Preload ώστε το GLB να αρχίζει
  να φορτώνει νωρίτερα.
*/
useGLTF.preload("/models/room.glb");
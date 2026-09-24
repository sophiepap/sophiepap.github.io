"use client";
import { Canvas, ThreeEvent, useFrame, useThree, } from "@react-three/fiber";
import { Environment, Html, useGLTF, useProgress, useTexture, } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

type Props = {
  activeTarget: string | null;
  onTargetChange: (target: string | null) => void;
};

type CameraTarget =
  | "room"
  | "computer"
  | "board"
  | "cv";

const INTERACTABLES = [
  "Computer",
  "Bookshelf",
  "Board",
  "CV",
];

/* --------------------------------------------------
   CAMERA
-------------------------------------------------- */

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

    // Πρώτη φόρτωση:
    // πήγαινε αμέσως στην Camera_Room
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

    // Cinematic transition
    const speed = 1 - Math.pow(0.001, delta);
    camera.position.lerp(targetPosition, speed);
    camera.quaternion.slerp(targetQuaternion, speed);
  });

  return null;
}

/* --------------------------------------------------
   ROOM MODEL
-------------------------------------------------- */

function RoomModel({ scene, onTargetChange, }: {
  scene: THREE.Object3D;
  onTargetChange: (target: string | null) => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredObject = useRef<THREE.Object3D | null>(null);

  /* --------------------------------------------------
     TEXTURES
  -------------------------------------------------- */

  const deskTextures = useTexture({
    map: "/textures/Desk/TexturesCom_BleachedOakVeneer_M.png",
  });

  deskTextures.map.colorSpace =
    THREE.SRGBColorSpace;

  /* --------------------------------------------------
     HELPERS
  -------------------------------------------------- */

  function getInteractiveRoot(object: THREE.Object3D): THREE.Object3D | null {
    let current: | THREE.Object3D | null = object;

    while (current) {
      if (INTERACTABLES.includes(current.name)) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  function findInteractiveObject(object: THREE.Object3D): string | null {
    return (getInteractiveRoot(object)?.name ?? null
    );
  }

  /* --------------------------------------------------
     MATERIALS + SHADOWS
  -------------------------------------------------- */

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.name === "Desk") {
        object.material = new THREE.MeshStandardMaterial(
          {
            map: deskTextures.map,
            roughness: 0.65,
          }
        );
      }
    });
  }, [
    scene,
    deskTextures,
  ]);

  /* --------------------------------------------------
     HOVER ANIMATION
  -------------------------------------------------- */

  useFrame((_, delta) => {
    const speed =
      1 - Math.pow(0.001, delta);

    scene.traverse((object) => {
      if (!INTERACTABLES.includes(object.name)
      ) {
        return;
      }
      const isHovered = hoveredObject.current === object;
      const targetScale = isHovered ? 1.005 : 1;
      object.scale.x = THREE.MathUtils.lerp(object.scale.x, targetScale, speed);

      object.scale.y = THREE.MathUtils.lerp(object.scale.y, targetScale, speed);

      object.scale.z = THREE.MathUtils.lerp(object.scale.z, targetScale, speed);
    });
  });

  /* --------------------------------------------------
     INTERACTION EVENTS
  -------------------------------------------------- */

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    const target = findInteractiveObject(event.object);

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

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    const interactiveObject = getInteractiveRoot(event.object);
    hoveredObject.current = interactiveObject;
    setHovered(interactiveObject?.name ?? null);
    document.body.style.cursor = interactiveObject ? "pointer" : "default";
  }

  function handlePointerOut() {
    hoveredObject.current = null;
    setHovered(null);
    document.body.style.cursor = "default";
  }

  /* --------------------------------------------------
     MODEL
  -------------------------------------------------- */

  return (
    <group
      onClick={handleClick}
      onPointerMove={
        handlePointerMove
      }
      onPointerOut={
        handlePointerOut
      }
      scale={1}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      <primitive
        object={scene}
      />

      {/*
        hovered υπάρχει ήδη διαθέσιμο
        αν αργότερα θέλουμε labels,
        glow ή άλλο interaction.
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
  const cameraTarget:
    CameraTarget =
    activeTarget ===
      "computer"
      ? "computer"
      : activeTarget ===
        "board"
        ? "board"
        : activeTarget ===
          "cv"
          ? "cv"
          : "room";

  return (
    <>
      <CameraRig
        target={
          cameraTarget
        }
        scene={scene}
      />

      <color
        attach="background"
        args={[
          night
            ? "#101725"
            : "#9ea8ad",
        ]}
      />

      <ambientLight
        intensity={
          night
            ? 0.6
            : 1.5
        }
      />

      <directionalLight
        position={[
          5,
          8,
          5,
        ]}
        intensity={
          night
            ? 0.5
            : 2
        }
        castShadow
      />

      {night && (
        <pointLight
          position={[
            0,
            3,
            1,
          ]}
          intensity={4}
          distance={8}
          color="#ffad68"
          castShadow
        />
      )}

      <RoomModel
        scene={scene}
        onTargetChange={
          onTargetChange
        }
      />

      <Environment
        preset="apartment"
      />
    </>
  );
}

/* --------------------------------------------------
   LOADER
-------------------------------------------------- */

function RoomLoader() {
  const { progress } =
    useProgress();

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
        <div>
          LOADING ROOM
        </div>

        <strong>
          {Math.round(
            progress
          )}
          %
        </strong>
      </div>
    </Html>
  );
}

/* --------------------------------------------------
   CANVAS
-------------------------------------------------- */

export default function RoomScene(props: Props) {
  return (
    <Canvas
      shadows camera={{
        position: [0, 0, 5,],
        fov: 45,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
      }}
    >
      <Suspense
        fallback={
          <RoomLoader />
        }
      >
        <Scene
          {...props}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/room.glb");
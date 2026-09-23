"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Html,
  RoundedBox,
} from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

type Props = {
  activeTarget: string | null;
  onTargetChange: (target: string | null) => void;
};

type CameraTarget = "room" | "computer" | "board" | "cv";

const cameraPositions: Record<CameraTarget, THREE.Vector3> = {
  room: new THREE.Vector3(6.2, 4.6, 8.2),
  computer: new THREE.Vector3(1.3, 2.65, 3.15),
  board: new THREE.Vector3(-2.9, 3.0, 2.75),
  cv: new THREE.Vector3(0.25, 2.15, 2.8),
};

const cameraLookAts: Record<CameraTarget, THREE.Vector3> = {
  room: new THREE.Vector3(0, 1.8, 0),
  computer: new THREE.Vector3(0.75, 2.15, 0.8),
  board: new THREE.Vector3(-2.7, 2.7, 0.3),
  cv: new THREE.Vector3(0.2, 1.15, 0.6),
};

function CameraRig({ target }: { target: CameraTarget }) {
  const { camera } = useThree();
  const currentLook = useRef(new THREE.Vector3(0, 1.8, 0));

  useFrame((_, delta) => {
    const speed = 1 - Math.pow(0.001, delta);
    camera.position.lerp(cameraPositions[target], speed);
    currentLook.current.lerp(cameraLookAts[target], speed);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function Clickable({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label?: string;
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "default";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [hovered]);

  return (
    <group
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      scale={hovered ? 1.035 : 1}
    >
      {children}
      {hovered && label ? (
        <Html center position={[0, 0.8, 0]}>
          <div className="object-label">{label}</div>
        </Html>
      ) : null}
    </group>
  );
}

function StylizedRoom({
  activeTarget,
  onTargetChange,
}: Props) {
  const router = useRouter();

  const season = useMemo(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
  }, []);

  const timeOfDay = useMemo(() => {
    const h = new Date().getHours();
    if (h < 6 || h >= 21) return "night";
    if (h < 12) return "morning";
    if (h < 18) return "afternoon";
    return "evening";
  }, []);

  const night = timeOfDay === "night" || timeOfDay === "evening";

  return (
    <>
      <CameraRig
        target={
          activeTarget === "computer"
            ? "computer"
            : activeTarget === "board"
            ? "board"
            : activeTarget === "cv"
            ? "cv"
            : "room"
        }
      />

      <color
        attach="background"
        args={[night ? "#0d1324" : "#8aa0b8"]}
      />

      <ambientLight intensity={night ? 0.45 : 1.1} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={night ? 0.4 : 1.7}
      />
      <pointLight
        position={[0.2, 3.0, 1.2]}
        intensity={night ? 9 : 1.5}
        distance={8}
        color="#ffb76a"
      />

      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#604c43" roughness={0.95} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 3, -2.8]}>
        <boxGeometry args={[10, 6, 0.25]} />
        <meshStandardMaterial color="#c8b9a8" roughness={1} />
      </mesh>

      {/* left wall */}
      <mesh position={[-4.9, 3, 0]} rotation-y={Math.PI / 2}>
        <boxGeometry args={[5.8, 6, 0.25]} />
        <meshStandardMaterial color="#b7a696" roughness={1} />
      </mesh>

      {/* desk */}
      <RoundedBox args={[5.1, 0.22, 2]} radius={0.08} position={[0.1, 1.2, 0.7]}>
        <meshStandardMaterial color="#6a4933" roughness={0.7} />
      </RoundedBox>

      <mesh position={[-1.9, 0.55, 0.7]}>
        <boxGeometry args={[0.22, 1.2, 1.55]} />
        <meshStandardMaterial color="#4b3326" />
      </mesh>
      <mesh position={[2.1, 0.55, 0.7]}>
        <boxGeometry args={[0.22, 1.2, 1.55]} />
        <meshStandardMaterial color="#4b3326" />
      </mesh>

      {/* PC */}
      <Clickable
        label="Development"
        onClick={() => onTargetChange("computer")}
      >
        <group position={[0.8, 2.05, 0.55]}>
          <RoundedBox args={[1.65, 1.05, 0.12]} radius={0.08}>
            <meshStandardMaterial color="#2b2928" />
          </RoundedBox>
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[1.42, 0.82]} />
            <meshStandardMaterial
              emissive="#7db2bd"
              emissiveIntensity={night ? 1.8 : 0.7}
              color="#305a64"
            />
          </mesh>
          <mesh position={[0, -0.76, 0]}>
            <boxGeometry args={[0.13, 0.45, 0.13]} />
            <meshStandardMaterial color="#252525" />
          </mesh>
          <mesh position={[0, -0.98, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.38]} />
            <meshStandardMaterial color="#252525" />
          </mesh>
        </group>
      </Clickable>

      {/* board */}
      <Clickable
        label="Game Dev / AR"
        onClick={() => onTargetChange("board")}
      >
        <group position={[-2.7, 2.8, -2.55]}>
          <RoundedBox args={[2.2, 1.5, 0.12]} radius={0.06}>
            <meshStandardMaterial color="#6f4a2f" />
          </RoundedBox>
          {[
            [-0.62, 0.25, "#d8c78e"],
            [0.1, 0.4, "#c48c76"],
            [0.55, -0.15, "#94a997"],
            [-0.25, -0.32, "#c9b2a1"],
          ].map(([x, y, c], i) => (
            <mesh key={i} position={[x as number, y as number, 0.08]}>
              <planeGeometry args={[0.48, 0.36]} />
              <meshStandardMaterial color={c as string} />
            </mesh>
          ))}
        </group>
      </Clickable>

      {/* bookshelf */}
      <Clickable
        label="Library / Influences"
        onClick={() => router.push("/library")}
      >
        <group position={[3.45, 2.0, -1.35]}>
          <RoundedBox args={[1.8, 3.7, 0.8]} radius={0.08}>
            <meshStandardMaterial color="#4f3528" />
          </RoundedBox>

          {[0.95, 0.15, -0.65].map((y) => (
            <mesh key={y} position={[0, y, 0.43]}>
              <boxGeometry args={[1.55, 0.08, 0.08]} />
              <meshStandardMaterial color="#2e211b" />
            </mesh>
          ))}

          {[
            [-0.55, 1.25, "#667b78"],
            [-0.35, 1.18, "#8d5e4a"],
            [-0.15, 1.2, "#50656f"],
            [0.08, 1.23, "#9b8b68"],
            [0.3, 1.15, "#765a63"],
            [-0.45, 0.45, "#8e6a47"],
            [-0.2, 0.42, "#5c6e86"],
            [0.07, 0.4, "#6f7d52"],
            [0.34, 0.44, "#8d4d4d"],
          ].map(([x, y, c], i) => (
            <mesh key={i} position={[x as number, y as number, 0.5]}>
              <boxGeometry args={[0.18, 0.62 + (i % 2) * 0.1, 0.34]} />
              <meshStandardMaterial color={c as string} />
            </mesh>
          ))}
        </group>
      </Clickable>

      {/* CV on desk */}
      <Clickable
        label="CV"
        onClick={() => onTargetChange("cv")}
      >
        <group position={[0.15, 1.35, 1.0]} rotation-x={-Math.PI / 2.1}>
          <mesh>
            <planeGeometry args={[0.8, 1.0]} />
            <meshStandardMaterial color="#eee7dc" />
          </mesh>
          <Html center transform position={[0, 0.02, 0.01]}>
            <div className="paper-cv">CV</div>
          </Html>
        </group>
      </Clickable>

      {/* lamp */}
      <group position={[-0.7, 2.0, 0.7]}>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.9, 12]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.4, 0.55, 16]} />
          <meshStandardMaterial
            color="#3e3730"
            emissive={night ? "#6c3f1b" : "#000000"}
            emissiveIntensity={night ? 0.6 : 0}
          />
        </mesh>
      </group>

      {/* window */}
      <group position={[-1.9, 3.25, -2.63]}>
        <mesh>
          <planeGeometry args={[2.1, 2.2]} />
          <meshStandardMaterial
            color={season === "autumn" ? "#4c5a6d" : "#5e7c9d"}
            emissive={night ? "#20334d" : "#688aaa"}
            emissiveIntensity={night ? 0.8 : 0.2}
          />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <meshStandardMaterial color="#2a211f" />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation-z={Math.PI / 2}>
          <boxGeometry args={[0.08, 2.1, 0.08]} />
          <meshStandardMaterial color="#2a211f" />
        </mesh>
      </group>

      {/* floating cozy dust */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float
          key={i}
          speed={0.4 + (i % 4) * 0.1}
          floatIntensity={0.3}
          rotationIntensity={0}
        >
          <mesh
            position={[
              -3 + (i % 7) * 0.9,
              1.2 + ((i * 7) % 10) * 0.28,
              -1.6 + ((i * 3) % 8) * 0.5,
            ]}
          >
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshBasicMaterial color="#f4dfba" />
          </mesh>
        </Float>
      ))}

      <Environment preset="apartment" />
    </>
  );
}

export default function RoomScene(props: Props) {
  return (
    <Canvas
      camera={{
        position: [6.2, 4.6, 8.2],
        fov: 44,
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
    >
      <StylizedRoom {...props} />
    </Canvas>
  );
}

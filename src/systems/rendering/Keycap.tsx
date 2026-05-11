import { memo, useEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeKeycapGeometry } from './keycap-geometry';

interface KeycapProps {
  cx: number;
  /** Bottom Y of the keycap at rest (= plate top Y). */
  restY: number;
  cz: number;
  width: number;       // scene units, already accounts for inter-key gap
  depth: number;
  height: number;
  topShrinkX: number;
  topShrinkZ: number;
  dishDepth: number;
  topSegments: number;
  /** X-axis rotation applied around the keycap's bottom edge (radians). */
  tilt: number;
  label: string;
  pressed: boolean;
  capColor: string;
  labelColor: string;
}

const PRESS_DEPTH = 0.08;
const PRESS_DAMP = 30;
const RELEASE_DAMP = 12;
const EMISSIVE_DAMP = 25;
const PRESSED_EMISSIVE_INTENSITY = 0.7;
const PRESSED_EMISSIVE = '#5a8cff';

export const Keycap = memo(function Keycap({
  cx, restY, cz, width, depth, height,
  topShrinkX, topShrinkZ, dishDepth, topSegments,
  tilt, label, pressed, capColor, labelColor,
}: KeycapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => makeKeycapGeometry({ width, depth, height, topShrinkX, topShrinkZ, dishDepth, topSegments }),
    [width, depth, height, topShrinkX, topShrinkZ, dishDepth, topSegments],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    groupRef.current?.position.set(cx, restY, cz);
  }, [cx, restY, cz]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (g) {
      const targetY = pressed ? restY - PRESS_DEPTH : restY;
      const damp = pressed ? PRESS_DAMP : RELEASE_DAMP;
      g.position.y = THREE.MathUtils.damp(g.position.y, targetY, damp, delta);
    }
    const m = meshRef.current;
    if (m) {
      const mat = m.material as THREE.MeshStandardMaterial;
      const target = pressed ? PRESSED_EMISSIVE_INTENSITY : 0;
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity, target, EMISSIVE_DAMP, delta,
      );
    }
  });

  return (
    // Outer group: positioned at the keycap's BOTTOM edge (= plate top).
    // Press animation lerps this group's Y down by PRESS_DEPTH.
    <group ref={groupRef}>
      {/* Tilt around bottom edge. Sculpted profiles use this; uniform = 0. */}
      <group rotation={[tilt, 0, 0]}>
        {/* Lift the mesh so its geometric center sits at +height/2 above the
            rotation point — i.e. the mesh's bottom face sits on the plate. */}
        <group position={[0, height / 2, 0]}>
          <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={capColor}
              roughness={0.55}
              metalness={0.05}
              emissive={PRESSED_EMISSIVE}
              emissiveIntensity={0}
            />
          </mesh>
          {label && (
            <Text
              font="/fonts/Inter-Regular.woff"
              position={[0, height / 2 + 0.005, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={Math.min(0.26, width * 0.36, depth * 0.5)}
              color={labelColor}
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
          )}
        </group>
      </group>
    </group>
  );
});

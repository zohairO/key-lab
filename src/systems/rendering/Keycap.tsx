import { memo, useEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeKeycapGeometry } from './keycap-geometry';

interface KeycapProps {
  cx: number;
  cy: number;          // rest Y (center of keycap)
  cz: number;
  width: number;       // scene units (already accounts for inter-key gap)
  depth: number;
  height: number;
  topShrinkX: number;
  topShrinkZ: number;
  dishDepth: number;
  topSegments: number;
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
  cx, cy, cz,
  width, depth, height,
  topShrinkX, topShrinkZ, dishDepth, topSegments,
  label, pressed, capColor, labelColor,
}: KeycapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => makeKeycapGeometry({ width, depth, height, topShrinkX, topShrinkZ, dishDepth, topSegments }),
    [width, depth, height, topShrinkX, topShrinkZ, dishDepth, topSegments],
  );

  // Dispose old geometry when replaced or unmounted (Three.js doesn't auto-free).
  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    groupRef.current?.position.set(cx, cy, cz);
  }, [cx, cy, cz]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (g) {
      const targetY = pressed ? cy - PRESS_DEPTH : cy;
      const damp = pressed ? PRESS_DAMP : RELEASE_DAMP;
      g.position.y = THREE.MathUtils.damp(g.position.y, targetY, damp, delta);
    }
    const m = meshRef.current;
    if (m) {
      const mat = m.material as THREE.MeshStandardMaterial;
      const target = pressed ? PRESSED_EMISSIVE_INTENSITY : 0;
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        target,
        EMISSIVE_DAMP,
        delta,
      );
    }
  });

  return (
    <group ref={groupRef}>
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
          position={[0, height / 2 - dishDepth + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={Math.min(0.22, width * 0.32, depth * 0.45)}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
});

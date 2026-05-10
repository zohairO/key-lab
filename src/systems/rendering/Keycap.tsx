import { memo, useEffect, useRef } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KeycapProps {
  cx: number;
  cy: number;          // rest Y (center of keycap)
  cz: number;
  width: number;       // scene units, already accounts for inter-key gap
  depth: number;
  height: number;
  label: string;
  pressed: boolean;
}

const PRESS_DEPTH = 0.08;
const PRESS_DAMP = 30;          // higher = snappier press
const RELEASE_DAMP = 12;        // lower = weightier release
const EMISSIVE_DAMP = 25;
const PRESSED_EMISSIVE_INTENSITY = 0.7;

const CAP_COLOR = '#2a2a2e';
const LABEL_COLOR = '#dcdcdc';
const PRESSED_EMISSIVE = '#5a8cff';

export const Keycap = memo(function Keycap({
  cx, cy, cz, width, depth, height, label, pressed,
}: KeycapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Set rest position once, then useFrame owns position.y. We only re-apply
  // if the rest coords change (layout switch).
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
      <RoundedBox
        ref={meshRef}
        args={[width, height, depth]}
        radius={0.04}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={CAP_COLOR}
          roughness={0.55}
          metalness={0.05}
          emissive={PRESSED_EMISSIVE}
          emissiveIntensity={0}
        />
      </RoundedBox>
      {label && (
        <Text
          position={[0, height / 2 + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={Math.min(0.22, width * 0.32, depth * 0.45)}
          color={LABEL_COLOR}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
});

import { RoundedBox, Text } from '@react-three/drei';

interface KeycapProps {
  position: [number, number, number];
  width: number;   // scene units (already accounts for inter-key gap)
  depth: number;
  height: number;
  label: string;
}

const CAP_COLOR = '#2a2a2e';
const LABEL_COLOR = '#dcdcdc';

export function Keycap({ position, width, depth, height, label }: KeycapProps) {
  return (
    <group position={position}>
      <RoundedBox args={[width, height, depth]} radius={0.04} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={CAP_COLOR} roughness={0.55} metalness={0.05} />
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
}

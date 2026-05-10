import { RoundedBox } from '@react-three/drei';
import { sixtyPercent } from '../../data/sixty-percent';
import { Keycap } from './Keycap';

const KEY_GAP = 0.06;
const KEY_HEIGHT = 0.5;
const CASE_HEIGHT = 0.45;
const CASE_PADDING = 0.4;

const CASE_COLOR = '#141417';

interface KeyboardProps {
  pressedKeys: Set<string>;
}

export function Keyboard({ pressedKeys }: KeyboardProps) {
  const layout = sixtyPercent;

  // Center the key field on the origin (XZ plane). Row 0 = back (-Z).
  const offsetX = -layout.width / 2;
  const offsetZ = -layout.height / 2;

  const caseW = layout.width + CASE_PADDING * 2;
  const caseD = layout.height + CASE_PADDING * 2;

  return (
    <group>
      {/* Case */}
      <RoundedBox
        args={[caseW, CASE_HEIGHT, caseD]}
        radius={0.18}
        smoothness={4}
        position={[0, -CASE_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={CASE_COLOR} roughness={0.7} metalness={0.15} />
      </RoundedBox>

      {/* Keycaps */}
      {layout.keys.map((k) => {
        const cx = offsetX + k.x + k.w / 2;
        const cy = KEY_HEIGHT / 2;
        const cz = offsetZ + k.y + 0.5;
        const w = k.w - KEY_GAP;
        const d = 1 - KEY_GAP;
        return (
          <Keycap
            key={`${k.code}-${k.x}-${k.y}`}
            cx={cx}
            cy={cy}
            cz={cz}
            width={w}
            depth={d}
            height={KEY_HEIGHT}
            label={k.label}
            pressed={pressedKeys.has(k.code)}
          />
        );
      })}
    </group>
  );
}

import { ContactShadows, RoundedBox } from '@react-three/drei';
import { KEYCAP_VISUAL } from '../../data/keycap-profiles';
import { BOARD_CONFIG } from '../../data/board-types';
import { PLATE_VISUAL } from '../../data/plate-materials';
import { KEYCAP_SHAPES, sculptForRow } from '../../data/keycap-shapes';
import type {
  BoardType,
  KeycapProfile,
  KeycapShape,
  Layout,
  PlateMaterial,
  Zone,
} from '../../types';
import { Keycap } from './Keycap';

export interface KeyboardVisualOverrides {
  caseColor?: string;
  capColor?: string;
  labelColor?: string;
  zoneColors?: Partial<Record<Zone, { cap?: string; label?: string }>>;
  keyColors?: Record<string, { cap?: string; label?: string }>;
}

interface KeyboardProps {
  pressedKeys: Set<string>;
  keycap: KeycapProfile;
  keycapShape: KeycapShape;
  boardType: BoardType;
  plateMaterial: PlateMaterial;
  layout: Layout;
  overrides?: KeyboardVisualOverrides;
}

export function Keyboard({
  pressedKeys, keycap, keycapShape, boardType, plateMaterial, layout, overrides,
}: KeyboardProps) {
  const visual = KEYCAP_VISUAL[keycap];
  const board = BOARD_CONFIG[boardType];
  const plate = PLATE_VISUAL[plateMaterial];

  // Board can force a shape (chiclet for flat, low-profile-mech for low).
  // Otherwise the user's selection wins.
  const effectiveShape: KeycapShape = board.forceKeycapShape ?? keycapShape;
  const shape = KEYCAP_SHAPES[effectiveShape];

  const caseColor = overrides?.caseColor ?? visual.caseColor;
  const capColor = overrides?.capColor ?? visual.capColor;
  const labelColor = overrides?.labelColor ?? visual.labelColor;

  const offsetX = -layout.width / 2;
  const offsetZ = -layout.height / 2;

  const caseW = layout.width + board.casePadding * 2;
  const caseD = layout.height + board.casePadding * 2;

  // Case top sits at y=0. Plate (if visible) sits on top of it. Keycaps sit
  // on top of the plate (or directly on the case if no plate). restY is the
  // BOTTOM of each keycap — the rotation pivot for sculpt tilts.
  const restY = board.plateVisible ? board.plateHeight : 0;
  const plateW = caseW - board.plateInset * 2;
  const plateD = caseD - board.plateInset * 2;

  return (
    <group>
      <ContactShadows
        position={[0, -board.caseHeight - 0.005, 0]}
        opacity={0.55}
        blur={2}
        far={6}
        resolution={512}
      />

      {/* Case */}
      <RoundedBox
        args={[caseW, board.caseHeight, caseD]}
        radius={board.caseRadius}
        smoothness={4}
        position={[0, -board.caseHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={caseColor} roughness={0.7} metalness={0.15} />
      </RoundedBox>

      {/* Plate */}
      {board.plateVisible && (
        <mesh position={[0, board.plateHeight / 2, 0]} receiveShadow>
          <boxGeometry args={[plateW, board.plateHeight, plateD]} />
          <meshStandardMaterial
            color={plate.color}
            roughness={plate.roughness}
            metalness={plate.metalness}
          />
        </mesh>
      )}

      {/* Keycaps */}
      {layout.keys.map((k) => {
        const cxPos = offsetX + k.x + k.w / 2;
        const czPos = offsetZ + k.y + 0.5;
        const w = k.w - board.keyGap;
        const d = 1 - board.keyGap;

        const keyOverride = overrides?.keyColors?.[k.code];
        const zoneOverride = overrides?.zoneColors?.[k.zone];
        const finalCapColor = keyOverride?.cap ?? zoneOverride?.cap ?? capColor;
        const finalLabelColor = keyOverride?.label ?? zoneOverride?.label ?? labelColor;

        const tilt = sculptForRow(effectiveShape, k.y);

        return (
          <Keycap
            key={`${k.code}-${k.x}-${k.y}`}
            cx={cxPos}
            restY={restY}
            cz={czPos}
            width={w}
            depth={d}
            height={shape.height}
            topShrinkX={w * shape.topShrinkFactor}
            topShrinkZ={d * shape.topShrinkFactor}
            dishDepth={shape.dishDepth}
            topSegments={shape.topSegments}
            tilt={tilt}
            label={k.label}
            pressed={pressedKeys.has(k.code)}
            capColor={finalCapColor}
            labelColor={finalLabelColor}
          />
        );
      })}
    </group>
  );
}

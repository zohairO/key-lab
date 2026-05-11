import { ContactShadows, RoundedBox } from '@react-three/drei';
import { KEYCAP_VISUAL } from '../../data/keycap-profiles';
import { BOARD_CONFIG } from '../../data/board-types';
import { PLATE_VISUAL } from '../../data/plate-materials';
import type { BoardType, KeycapProfile, Layout, PlateMaterial, Zone } from '../../types';
import { Keycap } from './Keycap';

export interface KeyboardVisualOverrides {
  caseColor?: string;
  /** Default cap color — used when no zone or key override matches. */
  capColor?: string;
  /** Default label color. */
  labelColor?: string;
  /** Per-zone overrides — applied to all keys in that zone (e.g. 'mod' = dark). */
  zoneColors?: Partial<Record<Zone, { cap?: string; label?: string }>>;
  /** Per-KeyboardEvent.code overrides — highest priority, e.g. Esc = orange. */
  keyColors?: Record<string, { cap?: string; label?: string }>;
}

interface KeyboardProps {
  pressedKeys: Set<string>;
  keycap: KeycapProfile;
  boardType: BoardType;
  plateMaterial: PlateMaterial;
  layout: Layout;
  overrides?: KeyboardVisualOverrides;
}

export function Keyboard({
  pressedKeys, keycap, boardType, plateMaterial, layout, overrides,
}: KeyboardProps) {
  const visual = KEYCAP_VISUAL[keycap];
  const board = BOARD_CONFIG[boardType];
  const plate = PLATE_VISUAL[plateMaterial];

  const keycapHeight = board.keycapHeightOverride ?? visual.height;

  const caseColor = overrides?.caseColor ?? visual.caseColor;
  const capColor = overrides?.capColor ?? visual.capColor;
  const labelColor = overrides?.labelColor ?? visual.labelColor;

  // Centre the key field on the origin (XZ plane). Row 0 = back (-Z).
  const offsetX = -layout.width / 2;
  const offsetZ = -layout.height / 2;

  const caseW = layout.width + board.casePadding * 2;
  const caseD = layout.height + board.casePadding * 2;

  // Vertical stacking. Case top sits at y=0. Plate sits on top of the case
  // (when visible). Keycaps sit on top of the plate (or directly on the case
  // top when there is no plate). cy is the keycap *centre*.
  const plateBottomY = 0;
  const plateTopY = board.plateVisible ? plateBottomY + board.plateHeight : 0;
  const cy = plateTopY + keycapHeight / 2;

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

      {/* Plate (only on mechanical / low-profile) */}
      {board.plateVisible && (
        <mesh
          position={[0, plateBottomY + board.plateHeight / 2, 0]}
          receiveShadow
        >
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

        // Resolution order: key-specific > zone-specific > default
        const keyOverride = overrides?.keyColors?.[k.code];
        const zoneOverride = overrides?.zoneColors?.[k.zone];
        const finalCapColor = keyOverride?.cap ?? zoneOverride?.cap ?? capColor;
        const finalLabelColor = keyOverride?.label ?? zoneOverride?.label ?? labelColor;

        return (
          <Keycap
            key={`${k.code}-${k.x}-${k.y}`}
            cx={cxPos}
            cy={cy}
            cz={czPos}
            width={w}
            depth={d}
            height={keycapHeight}
            topShrinkX={w * board.keycapShrinkFactor}
            topShrinkZ={d * board.keycapShrinkFactor}
            dishDepth={board.keycapDishDepth}
            topSegments={board.keycapTopSegments}
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

export function getCaseBottomY(boardType: BoardType): number {
  return -BOARD_CONFIG[boardType].caseHeight;
}

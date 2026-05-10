import type { BoardType } from '../types';

export interface BoardConfig {
  id: BoardType;
  name: string;
  description: string;

  // Keycap shape — drives keycap-geometry params.
  // If keycapHeightOverride is set, it wins over the keycap material's height.
  keycapHeightOverride: number | null;
  keycapShrinkFactor: number; // fraction of half-width that the top shrinks (per side average)
  keycapDishDepth: number;
  keycapTopSegments: number;

  // Plate (visible "deck" the keys are mounted to)
  plateVisible: boolean;
  plateHeight: number;
  plateColor: string;
  plateInset: number; // how much smaller than the case footprint

  // Case
  caseHeight: number;
  casePadding: number; // extra space around the key field
  caseRadius: number;  // rounded-box corner radius

  // Spacing
  keyGap: number;
}

export const BOARD_CONFIG: Record<BoardType, BoardConfig> = {
  flat: {
    id: 'flat',
    name: 'Flat',
    description: 'Magic Keyboard / MX Keys style — chiclet, very thin caps',
    keycapHeightOverride: 0.16,
    keycapShrinkFactor: 0.06,
    keycapDishDepth: 0.005,
    keycapTopSegments: 4,
    plateVisible: false,
    plateHeight: 0,
    plateColor: '#1a1a1c',
    plateInset: 0.15,
    caseHeight: 0.28,
    casePadding: 0.25,
    caseRadius: 0.14,
    keyGap: 0.05,
  },
  'low-profile': {
    id: 'low-profile',
    name: 'Low Profile',
    description: 'Semi-mechanical — short-travel mechanical (Keychron K LP, NuPhy Air)',
    keycapHeightOverride: 0.30,
    keycapShrinkFactor: 0.10,
    keycapDishDepth: 0.012,
    keycapTopSegments: 5,
    plateVisible: true,
    plateHeight: 0.04,
    plateColor: '#1a1a1c',
    plateInset: 0.12,
    caseHeight: 0.34,
    casePadding: 0.3,
    caseRadius: 0.12,
    keyGap: 0.06,
  },
  mechanical: {
    id: 'mechanical',
    name: 'Mechanical',
    description: 'Standard Cherry MX — sculpted caps on a visible plate',
    keycapHeightOverride: null, // use keycap material profile height
    keycapShrinkFactor: 0.16,
    keycapDishDepth: 0.030,
    keycapTopSegments: 6,
    plateVisible: true,
    plateHeight: 0.08,
    plateColor: '#161618',
    plateInset: 0.12,
    caseHeight: 0.45,
    casePadding: 0.4,
    caseRadius: 0.18,
    keyGap: 0.07,
  },
};

export const BOARD_TYPE_OPTIONS: BoardType[] = ['flat', 'low-profile', 'mechanical'];

import type { KeycapShape } from '../types';

export interface KeycapShapeSpec {
  name: string;
  description: string;
  height: number;
  topShrinkFactor: number;
  dishDepth: number;
  topSegments: number;
  sculpt: number[];
}

/**
 * Real Cherry-profile keycap proportions: ~28% smaller at the top vs the
 * bottom (per side). The previous 20% was too gentle and the caps read as
 * boxy. Combined with the steeper chamfer in keycap-geometry.ts, swapping
 * shapes should now produce a clearly different silhouette.
 */
export const KEYCAP_SHAPES: Record<KeycapShape, KeycapShapeSpec> = {
  cherry: {
    name: 'Cherry',
    description: 'Standard sculpted — short, comfortable, most common',
    height: 0.50,
    topShrinkFactor: 0.35,
    dishDepth: 0.085,
    topSegments: 6,
    sculpt: [+0.14, +0.07, +0.02, -0.06, -0.10, -0.10],
  },
  oem: {
    name: 'OEM',
    description: 'Slightly taller Cherry — most stock keyboards',
    height: 0.56,
    topShrinkFactor: 0.33,
    dishDepth: 0.080,
    topSegments: 6,
    sculpt: [+0.12, +0.06, +0.02, -0.06, -0.10, -0.10],
  },
  sa: {
    name: 'SA',
    description: 'Tall sculpted, spherical bowl — classic "thocky" enthusiast',
    height: 0.82,
    topShrinkFactor: 0.38,
    dishDepth: 0.130,
    topSegments: 7,
    sculpt: [+0.22, +0.12, +0.0, -0.13, -0.18, -0.18],
  },
  mt3: {
    name: 'MT3',
    description: 'Tallest sculpted — deep ergonomic spherical bowl',
    height: 0.90,
    topShrinkFactor: 0.36,
    dishDepth: 0.150,
    topSegments: 7,
    sculpt: [+0.24, +0.14, +0.0, -0.13, -0.19, -0.19],
  },
  dsa: {
    name: 'DSA',
    description: 'Uniform short — same shape every row, shallow dish',
    height: 0.40,
    topShrinkFactor: 0.18,
    dishDepth: 0.050,
    topSegments: 6,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  xda: {
    name: 'XDA',
    description: 'Uniform medium — wider top face than DSA',
    height: 0.46,
    topShrinkFactor: 0.14,
    dishDepth: 0.045,
    topSegments: 6,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  chiclet: {
    name: 'Chiclet',
    description: 'Magic Keyboard / MX Keys — flat, almost no taper or dish',
    height: 0.16,
    topShrinkFactor: 0.08,
    dishDepth: 0.018,
    topSegments: 4,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  'low-profile-mech': {
    name: 'Low-profile mech',
    description: 'Gateron LP / Kailh Choc — short mechanical with slight sculpt',
    height: 0.30,
    topShrinkFactor: 0.18,
    dishDepth: 0.030,
    topSegments: 5,
    sculpt: [+0.06, +0.04, 0, -0.03, -0.05, -0.05],
  },
};

export const KEYCAP_SHAPE_OPTIONS: KeycapShape[] = ['cherry', 'oem', 'sa', 'mt3', 'dsa', 'xda'];

export function sculptForRow(shape: KeycapShape, row: number): number {
  const arr = KEYCAP_SHAPES[shape].sculpt;
  return arr[Math.min(row, arr.length - 1)] ?? 0;
}

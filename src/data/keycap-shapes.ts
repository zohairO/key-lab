import type { KeycapShape } from '../types';

export interface KeycapShapeSpec {
  name: string;
  description: string;
  /** Height in scene units (1u ≈ 19.05mm in real life). */
  height: number;
  /** Fraction of width/depth that the top shrinks vs the bottom (per side avg). */
  topShrinkFactor: number;
  /** Concave bowl depth at top center. */
  dishDepth: number;
  /** Top-face tessellation — higher = smoother dish, more triangles. */
  topSegments: number;
  /**
   * Per-row X-axis rotation (radians) applied around the keycap's bottom edge.
   * Positive = top tilts toward the user (camera at +Z). Row 0 is the back of
   * the keyboard (number row in 60%/65%). Sculpted profiles tilt back rows
   * forward and front rows back so the legends stay readable. Uniform
   * profiles return 0 for all rows. Length supports up to 6 rows (TKL).
   */
  sculpt: number[];
}

export const KEYCAP_SHAPES: Record<KeycapShape, KeycapShapeSpec> = {
  cherry: {
    name: 'Cherry',
    description: 'Short sculpted — comfortable, most common',
    height: 0.50,
    topShrinkFactor: 0.20,
    dishDepth: 0.060,
    topSegments: 6,
    sculpt: [+0.14, +0.07, +0.02, -0.06, -0.10, -0.10],
  },
  oem: {
    name: 'OEM',
    description: 'Slightly taller Cherry — most stock keyboards',
    height: 0.56,
    topShrinkFactor: 0.18,
    dishDepth: 0.055,
    topSegments: 6,
    sculpt: [+0.12, +0.06, +0.02, -0.06, -0.10, -0.10],
  },
  sa: {
    name: 'SA',
    description: 'Tall sculpted, spherical bowl — classic "thocky" enthusiast',
    height: 0.82,
    topShrinkFactor: 0.24,
    dishDepth: 0.090,
    topSegments: 7,
    sculpt: [+0.22, +0.12, +0.0, -0.13, -0.18, -0.18],
  },
  mt3: {
    name: 'MT3',
    description: 'Tallest sculpted — deep ergonomic spherical bowl',
    height: 0.90,
    topShrinkFactor: 0.22,
    dishDepth: 0.105,
    topSegments: 7,
    sculpt: [+0.24, +0.14, +0.0, -0.13, -0.19, -0.19],
  },
  dsa: {
    name: 'DSA',
    description: 'Uniform short — same shape every row, shallow dish',
    height: 0.40,
    topShrinkFactor: 0.13,
    dishDepth: 0.040,
    topSegments: 6,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  xda: {
    name: 'XDA',
    description: 'Uniform medium — wider top face than DSA',
    height: 0.46,
    topShrinkFactor: 0.10,
    dishDepth: 0.035,
    topSegments: 6,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  // Board-forced profiles
  chiclet: {
    name: 'Chiclet',
    description: 'Magic Keyboard / MX Keys — flat, almost no taper or dish',
    height: 0.16,
    topShrinkFactor: 0.06,
    dishDepth: 0.012,
    topSegments: 4,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  'low-profile-mech': {
    name: 'Low-profile mech',
    description: 'Gateron LP / Kailh Choc — short mechanical with slight sculpt',
    height: 0.30,
    topShrinkFactor: 0.12,
    dishDepth: 0.024,
    topSegments: 5,
    sculpt: [+0.06, +0.04, 0, -0.03, -0.05, -0.05],
  },
};

export const KEYCAP_SHAPE_OPTIONS: KeycapShape[] = ['cherry', 'oem', 'sa', 'mt3', 'dsa', 'xda'];

export function sculptForRow(shape: KeycapShape, row: number): number {
  const arr = KEYCAP_SHAPES[shape].sculpt;
  return arr[Math.min(row, arr.length - 1)] ?? 0;
}

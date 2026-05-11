import type { KeycapShape } from '../types';

export interface KeycapShapeSpec {
  name: string;
  description: string;
  /** Height in scene units (1u = 19.05mm in real life). */
  height: number;
  /** Fraction of width/depth that the top shrinks vs the bottom (per side avg). */
  topShrinkFactor: number;
  /** Concave bowl depth at top center. */
  dishDepth: number;
  /** Top-face tessellation — higher = smoother dish, more triangles. */
  topSegments: number;
  /**
   * Per-row X-axis rotation (radians) applied around the keycap's bottom edge.
   * Positive = top tilts toward the user (camera at +Z). Negative = away.
   * Row 0 is the back of the keyboard (number row in 60%/65%). Sculpted
   * profiles tilt the back rows forward and the front rows back so the
   * legends stay readable. Uniform profiles return 0 for all rows.
   * Array length supports up to 6 rows (TKL); excess rows clamp to the last.
   */
  sculpt: number[];
}

export const KEYCAP_SHAPES: Record<KeycapShape, KeycapShapeSpec> = {
  cherry: {
    name: 'Cherry',
    description: 'Standard sculpted — short, comfortable, most common',
    height: 0.46,
    topShrinkFactor: 0.16,
    dishDepth: 0.030,
    topSegments: 6,
    sculpt: [+0.12, +0.06, +0.02, -0.05, -0.08, -0.08],
  },
  oem: {
    name: 'OEM',
    description: 'Slightly taller Cherry — most stock keyboards',
    height: 0.52,
    topShrinkFactor: 0.15,
    dishDepth: 0.028,
    topSegments: 6,
    sculpt: [+0.10, +0.05, +0.02, -0.05, -0.08, -0.08],
  },
  sa: {
    name: 'SA',
    description: 'Tall sculpted, spherical bowl — classic "thocky" enthusiast',
    height: 0.72,
    topShrinkFactor: 0.20,
    dishDepth: 0.045,
    topSegments: 7,
    sculpt: [+0.18, +0.10, +0.0, -0.10, -0.15, -0.15],
  },
  mt3: {
    name: 'MT3',
    description: 'Tallest sculpted — deep ergonomic spherical bowl',
    height: 0.78,
    topShrinkFactor: 0.18,
    dishDepth: 0.055,
    topSegments: 7,
    sculpt: [+0.20, +0.12, +0.0, -0.10, -0.16, -0.16],
  },
  dsa: {
    name: 'DSA',
    description: 'Uniform short — same shape every row, shallow dish',
    height: 0.38,
    topShrinkFactor: 0.10,
    dishDepth: 0.020,
    topSegments: 6,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  xda: {
    name: 'XDA',
    description: 'Uniform medium — wider top face than DSA',
    height: 0.42,
    topShrinkFactor: 0.08,
    dishDepth: 0.018,
    topSegments: 6,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  // Board-forced profiles (not user-selectable)
  chiclet: {
    name: 'Chiclet',
    description: 'Magic Keyboard / MX Keys — flat, almost no taper or dish',
    height: 0.16,
    topShrinkFactor: 0.06,
    dishDepth: 0.005,
    topSegments: 4,
    sculpt: [0, 0, 0, 0, 0, 0],
  },
  'low-profile-mech': {
    name: 'Low-profile mech',
    description: 'Gateron LP / Kailh Choc — short mechanical with slight sculpt',
    height: 0.28,
    topShrinkFactor: 0.10,
    dishDepth: 0.012,
    topSegments: 5,
    sculpt: [+0.05, +0.03, 0, -0.02, -0.04, -0.04],
  },
};

/** Shapes the user can pick from in the UI (mechanical boards only). */
export const KEYCAP_SHAPE_OPTIONS: KeycapShape[] = ['cherry', 'oem', 'sa', 'mt3', 'dsa', 'xda'];

export function sculptForRow(shape: KeycapShape, row: number): number {
  const arr = KEYCAP_SHAPES[shape].sculpt;
  return arr[Math.min(row, arr.length - 1)] ?? 0;
}

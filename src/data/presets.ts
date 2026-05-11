import type {
  BoardType,
  KeyboardStyle,
  KeycapProfile,
  KeycapShape,
  LayoutFamily,
  PlateMaterial,
  Zone,
} from '../types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  build: {
    boardType: BoardType;
    packId: string;
    keycap: KeycapProfile;
    keycapShape: KeycapShape;
    plateMaterial: PlateMaterial;
    layoutFamily: LayoutFamily;
    keyboardStyle: KeyboardStyle;
    // Optional visual overrides. When the active build matches a preset,
    // these win over the defaults from KEYCAP_VISUAL. Used for authentic
    // colorways of specific real keyboards.
    caseColorOverride?: string;
    capColorOverride?: string;
    labelColorOverride?: string;
    /** Per-zone color overrides — e.g. K2 has dark mods + cream alphas. */
    zoneColors?: Partial<Record<Zone, { cap?: string; label?: string }>>;
    /** Per-key overrides — e.g. orange Esc on K2. */
    keyColors?: Record<string, { cap?: string; label?: string }>;
  };
  /** Notes on remaining authenticity gaps (visual or audio). */
  authenticityNotes?: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'magic-keyboard',
    name: 'Magic Keyboard',
    description: 'Apple chiclet — flat, quiet, neutral (approx.)',
    build: {
      boardType: 'flat',
      packId: 'cherrymx-brown-pbt',
      keycap: 'thin-abs',
      keycapShape: 'chiclet',
      plateMaterial: 'aluminum',
      layoutFamily: 'tkl',
      keyboardStyle: 'mac',
    },
  },
  {
    id: 'nuphy-air75',
    name: 'NuPhy Air75',
    description: 'Low-profile mechanical, soft & balanced (approx.)',
    build: {
      boardType: 'low-profile',
      packId: 'cherrymx-brown-pbt',
      keycap: 'thin-abs',
      keycapShape: 'low-profile-mech',
      plateMaterial: 'polycarbonate',
      layoutFamily: 'seventy-five-percent',
      keyboardStyle: 'mac',
    },
  },
  {
    id: 'keychron-k2',
    name: 'Keychron K2 / Brown',
    description: 'Two-tone PBT caps, dark aluminum frame, orange Esc accent',
    build: {
      boardType: 'mechanical',
      packId: 'cherrymx-brown-pbt',
      keycap: 'thick-pbt',
      keycapShape: 'oem',
      plateMaterial: 'fr4',
      layoutFamily: 'seventy-five-percent',
      keyboardStyle: 'windows',
      // K2 authentic colorway — two-tone PBT on dark aluminum
      caseColorOverride: '#1d1f23',
      capColorOverride: '#e8e4d8',
      labelColorOverride: '#2a2d33',
      zoneColors: {
        mod: { cap: '#3d4045', label: '#dcdcdc' },
        largekey: { cap: '#3d4045', label: '#dcdcdc' },
      },
      keyColors: {
        // K2's signature orange Esc accent on the actual Esc key now that
        // we have a 75% layout with a real F-row.
        Escape: { cap: '#ff6b3d', label: '#ffffff' },
      },
    },
    authenticityNotes:
      'Layout matches the real K2: 75% with F-row ending in PrtSc / Del / Light Effect, and right-column nav cycling PgUp → PgDn → Home → End. Two-tone caps, dark aluminum frame, and orange Esc accent are accurate. The remaining gap is audio — currently a generic Cherry Brown pack rather than a K2-specific recording.',
  },
  {
    id: 'gmmk-pro-pandas',
    name: 'GMMK Pro / Holy Pandas',
    description: 'Tactile premium — alu plate, deep thock',
    build: {
      boardType: 'mechanical',
      packId: 'holy-pandas',
      keycap: 'thick-pbt',
      keycapShape: 'cherry',
      plateMaterial: 'aluminum',
      layoutFamily: 'seventy-five-percent',
      keyboardStyle: 'windows',
    },
  },
  {
    id: 'clicky-budget',
    name: 'Budget Clicky',
    description: 'Cherry Blue on FR4 — sharp & loud',
    build: {
      boardType: 'mechanical',
      packId: 'cherrymx-blue-pbt',
      keycap: 'thick-pbt',
      keycapShape: 'oem',
      plateMaterial: 'fr4',
      layoutFamily: 'sixty-percent',
      keyboardStyle: 'windows',
    },
  },
  {
    id: 'drop-ctrl-boxwhite',
    name: 'Drop CTRL / Box White',
    description: 'Aluminum TKL, Kailh Box Whites — crisp clicky',
    build: {
      boardType: 'mechanical',
      packId: 'kalih-box-white',
      keycap: 'thick-pbt',
      keycapShape: 'cherry',
      plateMaterial: 'aluminum',
      layoutFamily: 'tkl',
      keyboardStyle: 'windows',
    },
  },
  {
    id: 'sa-vintage',
    name: 'Vintage SA',
    description: 'Cream tall caps, brass plate, deep keystrokes',
    build: {
      boardType: 'mechanical',
      packId: 'holy-pandas',
      keycap: 'tall-pbt',
      keycapShape: 'sa',
      plateMaterial: 'brass',
      layoutFamily: 'sixty-percent',
      keyboardStyle: 'windows',
    },
  },
];

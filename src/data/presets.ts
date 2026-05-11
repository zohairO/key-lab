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
      layoutFamily: 'sixty-five-percent',
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
      layoutFamily: 'sixty-five-percent',
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
      layoutFamily: 'sixty-five-percent',
      keyboardStyle: 'windows',
      // K2 authentic colorway — two-tone PBT on dark aluminum
      caseColorOverride: '#1d1f23',     // near-black aluminum frame
      capColorOverride: '#e8e4d8',      // cream alphas (default)
      labelColorOverride: '#2a2d33',    // dark legends on cream
      zoneColors: {
        // Mods + large keys (Tab/Caps/Shift/Enter/Backspace/Ctrl/Win/Alt/nav cluster)
        // are charcoal grey with light legends.
        mod: { cap: '#3d4045', label: '#dcdcdc' },
        largekey: { cap: '#3d4045', label: '#dcdcdc' },
        // Spacebar stays the cream default — matches the real K2.
      },
      keyColors: {
        // K2's signature orange Esc accent. In 65% we don't have a dedicated
        // Esc key (Esc lives behind Fn+`), so the orange sits on Backquote
        // (top-left corner) until 75% lands and gives us a real Esc row.
        Backquote: { cap: '#ff6b3d', label: '#ffffff' },
      },
    },
    authenticityNotes:
      'Real K2 is 75% (F-row across the top). Currently rendered as 65%, so the F-row is missing and the orange accent sits on ` instead of Esc. Two-tone caps and dark aluminum frame are accurate. Audio is still generic Cherry Brown — a K2-specific recording would close the last gap.',
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
      layoutFamily: 'sixty-five-percent',
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

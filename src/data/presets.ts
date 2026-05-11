import type {
  BoardType,
  KeyboardStyle,
  KeycapProfile,
  LayoutFamily,
  PlateMaterial,
} from '../types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  build: {
    boardType: BoardType;
    packId: string;
    keycap: KeycapProfile;
    plateMaterial: PlateMaterial;
    layoutFamily: LayoutFamily;
    keyboardStyle: KeyboardStyle;
    // Optional visual overrides. When the active build matches a preset,
    // these win over the defaults from KEYCAP_VISUAL. Used for authentic
    // colorways of specific real keyboards.
    caseColorOverride?: string;
    capColorOverride?: string;
    labelColorOverride?: string;
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
      plateMaterial: 'polycarbonate',
      layoutFamily: 'sixty-five-percent',
      keyboardStyle: 'mac',
    },
  },
  {
    id: 'keychron-k2',
    name: 'Keychron K2 Pro / Brown',
    description: 'Stock K2 Pro — dark aluminum case, cream PBT caps',
    build: {
      boardType: 'mechanical',
      packId: 'cherrymx-brown-pbt',
      keycap: 'thick-pbt',
      plateMaterial: 'fr4',
      layoutFamily: 'sixty-five-percent',
      keyboardStyle: 'windows',
      // K2 Pro authentic colorway
      caseColorOverride: '#3a3d42',   // dark gray aluminum top frame
      capColorOverride: '#dcd8c8',    // cream PBT
      labelColorOverride: '#3a3a3a',  // dark legends
    },
    authenticityNotes:
      'Closest preset to authentic. Gaps: real K2 is 75% (currently rendered as 65% until 75% layout lands), real caps are two-tone (cream alphas + dark mods — currently single tone), audio is generic Cherry Brown rather than a K2-specific recording.',
  },
  {
    id: 'gmmk-pro-pandas',
    name: 'GMMK Pro / Holy Pandas',
    description: 'Tactile premium — alu plate, deep thock',
    build: {
      boardType: 'mechanical',
      packId: 'holy-pandas',
      keycap: 'thick-pbt',
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
      plateMaterial: 'brass',
      layoutFamily: 'sixty-percent',
      keyboardStyle: 'windows',
    },
  },
];

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
  };
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
    name: 'Keychron K2 / Brown',
    description: 'Stock mechanical with PBT caps',
    build: {
      boardType: 'mechanical',
      packId: 'cherrymx-brown-pbt',
      keycap: 'thick-pbt',
      plateMaterial: 'fr4',
      layoutFamily: 'sixty-five-percent',
      keyboardStyle: 'windows',
    },
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

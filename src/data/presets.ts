import type { BoardType, KeycapProfile, PlateMaterial } from '../types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  build: {
    boardType: BoardType;
    packId: string;
    keycap: KeycapProfile;
    plateMaterial: PlateMaterial;
    layoutId: string;
  };
}

/**
 * Curated starter builds. Click one and the whole rig reconfigures.
 * Real "browse mode" with photos / search / affiliate links is Phase 2;
 * these are the v0.5 shortcut so users can jump straight to a known sound.
 *
 * Note: still approximations until per-keyboard authentic recordings land.
 * Layouts are best-effort given what we currently support (60% / 65%).
 */
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
      layoutId: 'sixty-five-percent',
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
      layoutId: 'sixty-five-percent',
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
      layoutId: 'sixty-five-percent',
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
      layoutId: 'sixty-five-percent',
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
      layoutId: 'sixty-percent',
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
      layoutId: 'sixty-percent',
    },
  },
];

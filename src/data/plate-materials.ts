import type { FilterPreset } from '../systems/audio/keycap-eq';
import type { PlateMaterial } from '../types';

export interface PlateVisual {
  name: string;
  description: string;
  swatch: string;     // small color chip shown in the option list
  color: string;      // mesh color for the plate
  metalness: number;
  roughness: number;
}

export const PLATE_VISUAL: Record<PlateMaterial, PlateVisual> = {
  fr4: {
    name: 'FR4',
    description: 'Fiberglass — soft, warm, common stock',
    swatch: '#3a4f30',
    color: '#3a4f30',
    metalness: 0.2,
    roughness: 0.7,
  },
  polycarbonate: {
    name: 'Polycarbonate',
    description: 'Plastic — softest, deepest sound',
    swatch: '#a8a8b0',
    color: '#a8a8b0',
    metalness: 0.0,
    roughness: 0.45,
  },
  aluminum: {
    name: 'Aluminum',
    description: 'Metal — neutral, balanced (reference)',
    swatch: '#a4a8ad',
    color: '#9ca3a8',
    metalness: 0.7,
    roughness: 0.35,
  },
  brass: {
    name: 'Brass',
    description: 'Metal — bright, sharper top end, heavy',
    swatch: '#c8a86a',
    color: '#c8a86a',
    metalness: 0.85,
    roughness: 0.3,
  },
};

// Plate EQ stacks AFTER the keycap EQ in the audio chain.
// Aluminum is the reference (no shaping). The other three nudge the spectrum
// in the direction the material is known for. Tune by ear.
export const PLATE_EQ: Record<PlateMaterial, FilterPreset[]> = {
  fr4: [
    { type: 'lowshelf', frequency: 280, gain: 1.5 },
    { type: 'peaking', frequency: 800, gain: 1, Q: 1.0 },
  ],
  polycarbonate: [
    { type: 'highshelf', frequency: 4500, gain: -2.5 },
    { type: 'peaking', frequency: 350, gain: 1, Q: 0.7 },
  ],
  aluminum: [],
  brass: [
    { type: 'highshelf', frequency: 3500, gain: 2.5 },
    { type: 'peaking', frequency: 2500, gain: 1.5, Q: 1.4 },
  ],
};

export const PLATE_OPTIONS: PlateMaterial[] = ['fr4', 'polycarbonate', 'aluminum', 'brass'];

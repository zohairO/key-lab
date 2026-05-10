import type { KeycapProfile } from '../types';

export interface KeycapVisual {
  capColor: string;
  labelColor: string;
  height: number;     // scene units
  caseColor: string;  // hint for paired case color (case follows the build's "vibe")
}

export const KEYCAP_VISUAL: Record<KeycapProfile, KeycapVisual> = {
  // Thin ABS — off-white, dark legends, shorter cap. "Stock keyboard" look.
  'thin-abs':  { capColor: '#e8e4d8', labelColor: '#2a2a2a', height: 0.42, caseColor: '#1c1c20' },
  // Thick PBT, Cherry profile — dark gray, light legends, standard height.
  'thick-pbt': { capColor: '#2c2c30', labelColor: '#dcdcdc', height: 0.50, caseColor: '#141417' },
  // Thick PBT, SA/MT3 profile — vintage cream, brown legends, tall.
  'tall-pbt':  { capColor: '#d8c8a8', labelColor: '#4a3a28', height: 0.62, caseColor: '#2a2017' },
};

export const KEYCAP_LABEL: Record<KeycapProfile, string> = {
  'thin-abs':  'Thin ABS',
  'thick-pbt': 'Thick PBT',
  'tall-pbt':  'Tall PBT (SA)',
};

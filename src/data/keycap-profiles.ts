import type { KeycapProfile } from '../types';

export interface KeycapVisual {
  capColor: string;
  labelColor: string;
  caseColor: string;  // paired case color (case follows the build's "vibe")
}

export const KEYCAP_VISUAL: Record<KeycapProfile, KeycapVisual> = {
  // Cream / off-white (was "Thin ABS")
  'thin-abs':  { capColor: '#e8e4d8', labelColor: '#2a2a2a', caseColor: '#1c1c20' },
  // Dark gray (was "Thick PBT")
  'thick-pbt': { capColor: '#2c2c30', labelColor: '#dcdcdc', caseColor: '#141417' },
  // Vintage cream (was "Tall PBT") — kept as a colorway distinct from cream.
  'tall-pbt':  { capColor: '#d8c8a8', labelColor: '#4a3a28', caseColor: '#2a2017' },
};

export const KEYCAP_LABEL: Record<KeycapProfile, string> = {
  'thin-abs':  'Cream',
  'thick-pbt': 'Dark',
  'tall-pbt':  'Vintage',
};

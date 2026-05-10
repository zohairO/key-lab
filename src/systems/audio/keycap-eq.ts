export type KeycapProfile = 'thin-abs' | 'thick-pbt' | 'tall-pbt';

export interface FilterPreset {
  type: BiquadFilterType;
  frequency: number;
  gain?: number;
  Q?: number;
}

// EQ chains applied on top of every switch sample. Tune by ear once we have
// more pack variety; these are starting points based on subjective keycap
// material/profile sound character.
export const KEYCAP_EQ: Record<KeycapProfile, FilterPreset[]> = {
  // Thin ABS, Cherry profile — bright, clacky.
  'thin-abs': [
    { type: 'highshelf', frequency: 4000, gain: 4 },
    { type: 'peaking', frequency: 6000, gain: 2, Q: 1.2 },
  ],
  // Thick PBT, Cherry profile — neutral, thocky. Reference / "do nothing much".
  'thick-pbt': [
    { type: 'lowshelf', frequency: 200, gain: 2 },
    { type: 'highshelf', frequency: 5000, gain: -3 },
  ],
  // Thick PBT, tall profile (SA / MT3) — deep, vintage thock.
  'tall-pbt': [
    { type: 'lowshelf', frequency: 150, gain: 4 },
    { type: 'highshelf', frequency: 5000, gain: -6 },
    { type: 'lowpass', frequency: 8000 },
  ],
};

export const KEYCAP_LABEL: Record<KeycapProfile, string> = {
  'thin-abs': 'Thin ABS',
  'thick-pbt': 'Thick PBT',
  'tall-pbt': 'Tall PBT (SA)',
};

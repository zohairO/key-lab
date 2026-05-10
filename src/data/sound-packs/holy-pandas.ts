import type { MultiFilePack } from '../../systems/audio/sound-pack';

const BASE = '/audio/holy-pandas';

export const holyPandas: MultiFilePack = {
  format: 'multi-file',
  id: 'holy-pandas',
  name: 'Holy Pandas',
  source: 'https://github.com/tplai/kbsim',
  rows: [
    `${BASE}/GENERIC_R0.mp3`,
    `${BASE}/GENERIC_R1.mp3`,
    `${BASE}/GENERIC_R2.mp3`,
    `${BASE}/GENERIC_R3.mp3`,
    `${BASE}/GENERIC_R4.mp3`,
  ],
  overrides: {
    Space: `${BASE}/SPACE.mp3`,
    Enter: `${BASE}/ENTER.mp3`,
    Backspace: `${BASE}/BACKSPACE.mp3`,
  },
};

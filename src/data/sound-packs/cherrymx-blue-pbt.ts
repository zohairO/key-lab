import { buildSpritePack, type MechvibesConfig } from '../../systems/audio/mechvibes';
import config from './cherrymx-blue-pbt.json';

export const cherryMxBluePbt = buildSpritePack({
  id: 'cherrymx-blue-pbt',
  name: 'Cherry MX Blue (PBT)',
  audioUrl: '/audio/cherrymx-blue-pbt/sound.ogg',
  source: 'Mechvibes',
  config: config as MechvibesConfig,
});

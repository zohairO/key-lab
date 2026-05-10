import { buildSpritePack, type MechvibesConfig } from '../../systems/audio/mechvibes';
import config from './cherrymx-brown-pbt.json';

export const cherryMxBrownPbt = buildSpritePack({
  id: 'cherrymx-brown-pbt',
  name: 'Cherry MX Brown (PBT)',
  audioUrl: '/audio/cherrymx-brown-pbt/sound.ogg',
  source: 'Mechvibes',
  config: config as MechvibesConfig,
});

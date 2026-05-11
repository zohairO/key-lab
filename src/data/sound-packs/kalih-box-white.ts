import {
  buildMechvibesMultiPack,
  type MechvibesMultiConfig,
} from '../../systems/audio/mechvibes';
import config from './kalih-box-white.json';

export const kalihBoxWhite = buildMechvibesMultiPack({
  id: 'kalih-box-white',
  name: 'Kailh Box White',
  audioBase: '/audio/kalih-box-white',
  source: 'Mechvibes',
  config: config as MechvibesMultiConfig,
});

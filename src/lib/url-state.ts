import type { BoardType, KeycapProfile, PlateMaterial } from '../types';

export interface BuildState {
  packId: string;
  keycap: KeycapProfile;
  boardType: BoardType;
  plateMaterial: PlateMaterial;
}

const KEYCAP_VALUES: KeycapProfile[] = ['thin-abs', 'thick-pbt', 'tall-pbt'];
const BOARD_VALUES: BoardType[] = ['flat', 'low-profile', 'mechanical'];
const PLATE_VALUES: PlateMaterial[] = ['fr4', 'polycarbonate', 'aluminum', 'brass'];

const isKeycapProfile = (v: string): v is KeycapProfile => (KEYCAP_VALUES as string[]).includes(v);
const isBoardType = (v: string): v is BoardType => (BOARD_VALUES as string[]).includes(v);
const isPlateMaterial = (v: string): v is PlateMaterial => (PLATE_VALUES as string[]).includes(v);

export function readBuildHash(): Partial<BuildState> {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  const out: Partial<BuildState> = {};
  const pack = params.get('pack');
  if (pack) out.packId = pack;
  const keycap = params.get('keycap');
  if (keycap && isKeycapProfile(keycap)) out.keycap = keycap;
  const board = params.get('board');
  if (board && isBoardType(board)) out.boardType = board;
  const plate = params.get('plate');
  if (plate && isPlateMaterial(plate)) out.plateMaterial = plate;
  return out;
}

export function writeBuildHash(state: BuildState): void {
  const params = new URLSearchParams();
  params.set('board', state.boardType);
  params.set('pack', state.packId);
  params.set('keycap', state.keycap);
  params.set('plate', state.plateMaterial);
  const next = `#${params.toString()}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next);
  }
}

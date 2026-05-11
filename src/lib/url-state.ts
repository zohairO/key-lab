import type {
  BoardType,
  KeyboardStyle,
  KeycapProfile,
  KeycapShape,
  LayoutFamily,
  PlateMaterial,
  Theme,
} from '../types';

export interface BuildState {
  packId: string;
  keycap: KeycapProfile;
  keycapShape: KeycapShape;
  boardType: BoardType;
  plateMaterial: PlateMaterial;
  layoutFamily: LayoutFamily;
  keyboardStyle: KeyboardStyle;
  theme: Theme;
}

const KEYCAP_VALUES: KeycapProfile[] = ['thin-abs', 'thick-pbt', 'tall-pbt'];
const SHAPE_VALUES: KeycapShape[] = ['cherry', 'oem', 'sa', 'mt3', 'dsa', 'xda', 'chiclet', 'low-profile-mech'];
const BOARD_VALUES: BoardType[] = ['flat', 'low-profile', 'mechanical'];
const PLATE_VALUES: PlateMaterial[] = ['fr4', 'polycarbonate', 'aluminum', 'brass'];
const FAMILY_VALUES: LayoutFamily[] = ['sixty-percent', 'sixty-five-percent', 'tkl'];
const STYLE_VALUES: KeyboardStyle[] = ['windows', 'mac'];
const THEME_VALUES: Theme[] = ['dark', 'light'];

const isKeycapProfile = (v: string): v is KeycapProfile => (KEYCAP_VALUES as string[]).includes(v);
const isKeycapShape = (v: string): v is KeycapShape => (SHAPE_VALUES as string[]).includes(v);
const isBoardType = (v: string): v is BoardType => (BOARD_VALUES as string[]).includes(v);
const isPlateMaterial = (v: string): v is PlateMaterial => (PLATE_VALUES as string[]).includes(v);
const isLayoutFamily = (v: string): v is LayoutFamily => (FAMILY_VALUES as string[]).includes(v);
const isKeyboardStyle = (v: string): v is KeyboardStyle => (STYLE_VALUES as string[]).includes(v);
const isTheme = (v: string): v is Theme => (THEME_VALUES as string[]).includes(v);

export function readBuildHash(): Partial<BuildState> {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  const out: Partial<BuildState> = {};
  const pack = params.get('pack');
  if (pack) out.packId = pack;
  const keycap = params.get('keycap');
  if (keycap && isKeycapProfile(keycap)) out.keycap = keycap;
  const shape = params.get('shape');
  if (shape && isKeycapShape(shape)) out.keycapShape = shape;
  const board = params.get('board');
  if (board && isBoardType(board)) out.boardType = board;
  const plate = params.get('plate');
  if (plate && isPlateMaterial(plate)) out.plateMaterial = plate;
  const layout = params.get('layout');
  if (layout && isLayoutFamily(layout)) out.layoutFamily = layout;
  const style = params.get('style');
  if (style && isKeyboardStyle(style)) out.keyboardStyle = style;
  const theme = params.get('theme');
  if (theme && isTheme(theme)) out.theme = theme;
  return out;
}

export function writeBuildHash(state: BuildState): void {
  const params = new URLSearchParams();
  params.set('layout', state.layoutFamily);
  params.set('style', state.keyboardStyle);
  params.set('board', state.boardType);
  params.set('pack', state.packId);
  params.set('keycap', state.keycap);
  params.set('shape', state.keycapShape);
  params.set('plate', state.plateMaterial);
  params.set('theme', state.theme);
  const next = `#${params.toString()}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next);
  }
}

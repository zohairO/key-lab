import type { KeyboardStyle, Layout, LayoutFamily } from '../../types';
import { sixtyPercentWin, sixtyPercentMac } from './sixty-percent';
import { sixtyFivePercentWin, sixtyFivePercentMac } from './sixty-five-percent';
import { tklWin, tklMac } from './tkl';

export const LAYOUTS: Layout[] = [
  sixtyPercentWin,
  sixtyPercentMac,
  sixtyFivePercentWin,
  sixtyFivePercentMac,
  tklWin,
  tklMac,
];

export const LAYOUT_FAMILIES: { id: LayoutFamily; name: string }[] = [
  { id: 'sixty-percent', name: '60% ANSI' },
  { id: 'sixty-five-percent', name: '65% ANSI' },
  { id: 'tkl', name: 'TKL ANSI' },
];

export const KEYBOARD_STYLES: { id: KeyboardStyle; name: string }[] = [
  { id: 'windows', name: 'Windows' },
  { id: 'mac', name: 'Mac' },
];

export const DEFAULT_LAYOUT_FAMILY: LayoutFamily = 'sixty-percent';
export const DEFAULT_KEYBOARD_STYLE: KeyboardStyle = 'windows';

/** Resolve (family, style) → the concrete Layout. */
export function resolveLayout(family: LayoutFamily, style: KeyboardStyle): Layout {
  const id = `${family}-${style}`;
  return LAYOUTS.find((l) => l.id === id) ?? sixtyPercentWin;
}

export {
  sixtyPercentWin,
  sixtyPercentMac,
  sixtyFivePercentWin,
  sixtyFivePercentMac,
  tklWin,
  tklMac,
};

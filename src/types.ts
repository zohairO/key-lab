export type Zone = 'alpha' | 'space' | 'mod' | 'largekey';

export type KeycapProfile = 'thin-abs' | 'thick-pbt' | 'tall-pbt';

export type BoardType = 'flat' | 'low-profile' | 'mechanical';

export type PlateMaterial = 'fr4' | 'polycarbonate' | 'aluminum' | 'brass';

export type KeyboardStyle = 'windows' | 'mac';

export type LayoutFamily = 'sixty-percent' | 'sixty-five-percent' | 'seventy-five-percent' | 'tkl';

export type Theme = 'dark' | 'light';

export type KeycapShape =
  | 'cherry'
  | 'oem'
  | 'sa'
  | 'mt3'
  | 'dsa'
  | 'xda'
  | 'chiclet'           // forced by flat boards
  | 'low-profile-mech'; // forced by low-profile boards

export interface KeyDef {
  code: string;     // KeyboardEvent.code, e.g. "KeyA", "Space"
  label: string;
  x: number;        // column origin in units (left edge of the key)
  y: number;        // row index, 0 = top
  w: number;        // width in units
  zone: Zone;
}

export interface Layout {
  id: string;
  name: string;
  width: number;    // total width in units
  height: number;   // total rows
  keys: KeyDef[];
}

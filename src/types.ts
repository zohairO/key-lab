export type Zone = 'alpha' | 'space' | 'mod' | 'largekey';

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

import type { KeyDef, Layout, Zone } from '../../types';

export type RowEntry = [w: number, code: string, label: string, zone?: Zone];

export interface LayoutSpec {
  id: string;
  name: string;
  rows: RowEntry[][];
}

/**
 * Turn a row-based spec into a complete Layout (computed x positions,
 * key list, layout width = max row width).
 */
export function buildLayout({ id, name, rows }: LayoutSpec): Layout {
  const keys: KeyDef[] = [];
  let maxRowWidth = 0;

  rows.forEach((row, y) => {
    let x = 0;
    for (const [w, code, label, zone] of row) {
      if (!code) {
        // Spacer: occupies width but emits no key. Used for F-row group gaps,
        // the gap between the main block and the nav cluster on TKL, etc.
        x += w;
        continue;
      }
      keys.push({
        code,
        label,
        x,
        y,
        w,
        zone: zone ?? 'alpha',
      });
      x += w;
    }
    if (x > maxRowWidth) maxRowWidth = x;
  });

  return {
    id,
    name,
    width: maxRowWidth,
    height: rows.length,
    keys,
  };
}

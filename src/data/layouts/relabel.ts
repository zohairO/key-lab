import type { RowEntry } from './build-layout';

/**
 * Apply Mac-style labels to a row spec. Affects keys that look different on
 * a Mac keyboard but live in the same physical position (Caps Lock, Shift,
 * Backspace, Enter, Tab). The bottom row needs a separate spec because the
 * order of modifiers is genuinely different on Mac (fn/⌃/⌥/⌘ vs Ctrl/Win/Alt).
 */
const MAC_RELABEL: Record<string, string> = {
  CapsLock: '⇪ caps lock',
  ShiftLeft: '⇧ shift',
  ShiftRight: 'shift ⇧',
  Backspace: 'delete',
  Enter: 'return',
};

export function applyMacLabels(rows: RowEntry[][]): RowEntry[][] {
  return rows.map((row) =>
    row.map(([w, code, label, zone]) => {
      const newLabel = MAC_RELABEL[code] ?? label;
      return [w, code, newLabel, zone] as RowEntry;
    }),
  );
}

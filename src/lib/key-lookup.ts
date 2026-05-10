import type { KeyDef, Layout } from '../types';

/**
 * Build an O(1) map from KeyboardEvent.code -> KeyDef for a layout.
 * Some codes (e.g. ShiftLeft + ShiftRight) are both present in our layout;
 * the first occurrence wins, which is fine for audio dispatch.
 */
export function buildCodeIndex(layout: Layout): Map<string, KeyDef> {
  const map = new Map<string, KeyDef>();
  for (const k of layout.keys) {
    if (!map.has(k.code)) map.set(k.code, k);
  }
  return map;
}

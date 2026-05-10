import type { KeyDef } from '../../types';

/**
 * Two pack formats supported:
 *  - 'multi-file' (kbsim Holy Pandas style): one sample per keyboard row,
 *    plus per-key overrides (KeyboardEvent.code -> URL).
 *  - 'sprite' (Mechvibes single-file style): one audio file with a
 *    sprite map (KeyboardEvent.code -> [offsetMs, durationMs]).
 */
export type SoundPack = MultiFilePack | SpritePack;

interface SoundPackBase {
  id: string;
  name: string;
  source?: string; // attribution / origin URL
}

export interface MultiFilePack extends SoundPackBase {
  format: 'multi-file';
  rows: string[]; // sample URL per row index (row 0 = top)
  overrides?: Record<string, string>; // KeyboardEvent.code -> URL
}

export interface SpritePack extends SoundPackBase {
  format: 'sprite';
  audioUrl: string;
  /** KeyboardEvent.code -> [offsetMs, durationMs] */
  defines: Record<string, [number, number]>;
}

export interface ResolvedSlice {
  url: string;
  offsetSec?: number;
  durationSec?: number;
}

export function resolveSlice(pack: SoundPack, key: KeyDef): ResolvedSlice | null {
  if (pack.format === 'multi-file') {
    const url = pack.overrides?.[key.code] ?? pack.rows[key.y];
    return url ? { url } : null;
  }
  const slice = pack.defines[key.code];
  if (!slice) return null;
  return {
    url: pack.audioUrl,
    offsetSec: slice[0] / 1000,
    durationSec: slice[1] / 1000,
  };
}

/** Every URL the pack can ever request — used by preload(). */
export function packUrls(pack: SoundPack): string[] {
  if (pack.format === 'multi-file') {
    return [...pack.rows, ...Object.values(pack.overrides ?? {})];
  }
  return [pack.audioUrl];
}

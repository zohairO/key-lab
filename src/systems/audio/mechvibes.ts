import type { MultiFilePack, SpritePack } from './sound-pack';

/**
 * iohook scancode -> KeyboardEvent.code.
 * Mechvibes packs key their sprites by iohook (Linux KEY_*) scancodes.
 * We translate them into the strings the browser actually fires.
 * Codes not listed here are dropped silently.
 */
const IOHOOK_TO_CODE: Record<number, string> = {
  1: 'Escape',
  2: 'Digit1', 3: 'Digit2', 4: 'Digit3', 5: 'Digit4', 6: 'Digit5',
  7: 'Digit6', 8: 'Digit7', 9: 'Digit8', 10: 'Digit9', 11: 'Digit0',
  12: 'Minus', 13: 'Equal', 14: 'Backspace', 15: 'Tab',
  16: 'KeyQ', 17: 'KeyW', 18: 'KeyE', 19: 'KeyR', 20: 'KeyT',
  21: 'KeyY', 22: 'KeyU', 23: 'KeyI', 24: 'KeyO', 25: 'KeyP',
  26: 'BracketLeft', 27: 'BracketRight',
  28: 'Enter',
  29: 'ControlLeft',
  30: 'KeyA', 31: 'KeyS', 32: 'KeyD', 33: 'KeyF', 34: 'KeyG',
  35: 'KeyH', 36: 'KeyJ', 37: 'KeyK', 38: 'KeyL',
  39: 'Semicolon', 40: 'Quote', 41: 'Backquote',
  42: 'ShiftLeft', 43: 'Backslash',
  44: 'KeyZ', 45: 'KeyX', 46: 'KeyC', 47: 'KeyV', 48: 'KeyB',
  49: 'KeyN', 50: 'KeyM',
  51: 'Comma', 52: 'Period', 53: 'Slash',
  54: 'ShiftRight',
  56: 'AltLeft',
  57: 'Space',
  58: 'CapsLock',
  59: 'F1', 60: 'F2', 61: 'F3', 62: 'F4', 63: 'F5', 64: 'F6',
  65: 'F7', 66: 'F8', 67: 'F9', 68: 'F10',
  87: 'F11', 88: 'F12',
  // Extended keys, "14*256 + scancode" encoding (3584+)
  3613: 'ControlRight',     // 0x1D
  3640: 'AltRight',         // 0x38
  3653: 'NumLock',          // 0x45
  3655: 'Home',             // 0x47
  3657: 'PageUp',           // 0x49
  3663: 'End',              // 0x4F
  3665: 'PageDown',         // 0x51
  3666: 'Insert',           // 0x52
  3667: 'Delete',           // 0x53
  3675: 'MetaLeft',         // 0x5B
  3676: 'MetaRight',        // 0x5C
  3677: 'ContextMenu',      // 0x5D
  // 0xE000 + scancode encoding (57344+)
  57415: 'Home',
  57416: 'ArrowUp',
  57417: 'PageUp',
  57419: 'ArrowLeft',
  57421: 'ArrowRight',
  57423: 'End',
  57424: 'ArrowDown',
  57425: 'PageDown',
  57426: 'Insert',
  57427: 'Delete',
  // 0xEE00 + scancode encoding (alternate, 60928+)
  60999: 'Home',
  61000: 'ArrowUp',
  61001: 'PageUp',
  61003: 'ArrowLeft',
  61005: 'ArrowRight',
  61007: 'End',
  61008: 'ArrowDown',
  61009: 'PageDown',
  61010: 'Insert',
  61011: 'Delete',
};

/** Source-of-truth shape for raw Mechvibes config.json files. */
export interface MechvibesConfig {
  id: string;
  name: string;
  sound?: string;
  defines: Record<string, unknown>;
}

interface BuildOpts {
  id: string;
  name: string;
  audioUrl: string;
  source?: string;
  config: MechvibesConfig;
}

/** Mechvibes "multi" config format — each scancode maps to its own filename. */
export interface MechvibesMultiConfig {
  id: string;
  name: string;
  defines: Record<string, unknown>;  // scancode → file basename
}

interface BuildMultiOpts {
  id: string;
  name: string;
  /** Base URL where the per-key audio files live, e.g. '/audio/kalih-box-white'. */
  audioBase: string;
  source?: string;
  config: MechvibesMultiConfig;
}

/**
 * Convert a Mechvibes "multi" config (per-scancode filenames) into a
 * MultiFilePack. Every key lands in `overrides` keyed by event.code; rows
 * stays empty (no per-row fallback). Filenames are URL-encoded so spaces
 * and parentheses in pack filenames serve cleanly.
 */
export function buildMechvibesMultiPack({
  id, name, audioBase, source, config,
}: BuildMultiOpts): MultiFilePack {
  const overrides: Record<string, string> = {};
  for (const [scanStr, value] of Object.entries(config.defines)) {
    if (typeof value !== 'string') continue;
    const scan = Number.parseInt(scanStr, 10);
    const code = IOHOOK_TO_CODE[scan];
    if (!code) continue;
    if (overrides[code]) continue; // first occurrence wins
    overrides[code] = `${audioBase}/${encodeURIComponent(value)}`;
  }
  return {
    format: 'multi-file',
    id,
    name,
    source,
    rows: [],
    overrides,
  };
}

/** Convert a Mechvibes config + an audio URL into our SpritePack format. */
export function buildSpritePack({ id, name, audioUrl, source, config }: BuildOpts): SpritePack {
  const defines: Record<string, [number, number]> = {};
  for (const [scanStr, value] of Object.entries(config.defines)) {
    if (!Array.isArray(value) || value.length < 2) continue;
    const [offset, duration] = value as [number, number];
    if (typeof offset !== 'number' || typeof duration !== 'number') continue;
    const scan = Number.parseInt(scanStr, 10);
    const code = IOHOOK_TO_CODE[scan];
    if (!code) continue;
    if (defines[code]) continue; // first occurrence wins
    defines[code] = [offset, duration];
  }
  return { format: 'sprite', id, name, source, audioUrl, defines };
}

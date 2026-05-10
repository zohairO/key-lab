import type { SpritePack } from './sound-pack';

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
  // Extended (E0-prefixed) keys, encoded by Mechvibes as 3000+
  3613: 'ControlRight',
  3640: 'AltRight',
  3675: 'MetaLeft',
  3676: 'MetaRight',
  3677: 'ContextMenu',
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

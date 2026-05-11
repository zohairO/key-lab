import { buildLayout, type RowEntry } from './build-layout';
import { applyMacLabels } from './relabel';

/**
 * Standard ANSI TKL (tenkeyless). 18.25u wide × 6 rows. 87 keys (Win) / 86 (Mac).
 * Adds an F-row across the top (with grouped 0.5u gaps) and a 3-column nav
 * cluster on the right (Insert/Home/PgUp, Del/End/PgDn, arrows below).
 *
 * Each row sums to 18.25u.
 */
const TOP_ROWS: RowEntry[][] = [
  // Row 0: F-row + PrtSc / ScrLk / Pause cluster
  [
    [1, 'Escape', 'Esc', 'mod'],
    [1, '', ''],
    [1, 'F1', 'F1', 'mod'], [1, 'F2', 'F2', 'mod'], [1, 'F3', 'F3', 'mod'], [1, 'F4', 'F4', 'mod'],
    [0.5, '', ''],
    [1, 'F5', 'F5', 'mod'], [1, 'F6', 'F6', 'mod'], [1, 'F7', 'F7', 'mod'], [1, 'F8', 'F8', 'mod'],
    [0.5, '', ''],
    [1, 'F9', 'F9', 'mod'], [1, 'F10', 'F10', 'mod'], [1, 'F11', 'F11', 'mod'], [1, 'F12', 'F12', 'mod'],
    [0.25, '', ''],
    [1, 'PrintScreen', 'PrtSc', 'mod'],
    [1, 'ScrollLock', 'ScrLk', 'mod'],
    [1, 'Pause', 'Pause', 'mod'],
  ],
  // Row 1: number row + Insert/Home/PgUp
  [
    [1, 'Backquote', '`'],
    [1, 'Digit1', '1'], [1, 'Digit2', '2'], [1, 'Digit3', '3'], [1, 'Digit4', '4'], [1, 'Digit5', '5'],
    [1, 'Digit6', '6'], [1, 'Digit7', '7'], [1, 'Digit8', '8'], [1, 'Digit9', '9'], [1, 'Digit0', '0'],
    [1, 'Minus', '-'], [1, 'Equal', '='],
    [2, 'Backspace', 'Bksp', 'largekey'],
    [0.25, '', ''],
    [1, 'Insert', 'Ins', 'mod'],
    [1, 'Home', 'Home', 'mod'],
    [1, 'PageUp', 'PgUp', 'mod'],
  ],
  // Row 2: tab row + Delete/End/PgDn
  [
    [1.5, 'Tab', 'Tab', 'largekey'],
    [1, 'KeyQ', 'Q'], [1, 'KeyW', 'W'], [1, 'KeyE', 'E'], [1, 'KeyR', 'R'], [1, 'KeyT', 'T'],
    [1, 'KeyY', 'Y'], [1, 'KeyU', 'U'], [1, 'KeyI', 'I'], [1, 'KeyO', 'O'], [1, 'KeyP', 'P'],
    [1, 'BracketLeft', '['], [1, 'BracketRight', ']'],
    [1.5, 'Backslash', '\\', 'largekey'],
    [0.25, '', ''],
    [1, 'Delete', 'Del', 'mod'],
    [1, 'End', 'End', 'mod'],
    [1, 'PageDown', 'PgDn', 'mod'],
  ],
  // Row 3: home row — nav cluster column is empty on standard TKL
  [
    [1.75, 'CapsLock', 'Caps', 'mod'],
    [1, 'KeyA', 'A'], [1, 'KeyS', 'S'], [1, 'KeyD', 'D'], [1, 'KeyF', 'F'], [1, 'KeyG', 'G'],
    [1, 'KeyH', 'H'], [1, 'KeyJ', 'J'], [1, 'KeyK', 'K'], [1, 'KeyL', 'L'],
    [1, 'Semicolon', ';'], [1, 'Quote', "'"],
    [2.25, 'Enter', 'Enter', 'largekey'],
  ],
  // Row 4: shift row + ArrowUp (centred under nav cluster)
  [
    [2.25, 'ShiftLeft', 'Shift', 'mod'],
    [1, 'KeyZ', 'Z'], [1, 'KeyX', 'X'], [1, 'KeyC', 'C'], [1, 'KeyV', 'V'], [1, 'KeyB', 'B'],
    [1, 'KeyN', 'N'], [1, 'KeyM', 'M'],
    [1, 'Comma', ','], [1, 'Period', '.'], [1, 'Slash', '/'],
    [2.75, 'ShiftRight', 'Shift', 'mod'],
    [1.25, '', ''],
    [1, 'ArrowUp', '↑'],
    [1, '', ''],
  ],
];

const BOTTOM_WIN: RowEntry[] = [
  [1.25, 'ControlLeft', 'Ctrl', 'mod'],
  [1.25, 'MetaLeft', 'Win', 'mod'],
  [1.25, 'AltLeft', 'Alt', 'mod'],
  [6.25, 'Space', '', 'space'],
  [1.25, 'AltRight', 'Alt', 'mod'],
  [1.25, 'MetaRight', 'Win', 'mod'],
  [1.25, 'ContextMenu', 'Fn', 'mod'],
  [1.25, 'ControlRight', 'Ctrl', 'mod'],
  [0.25, '', ''],
  [1, 'ArrowLeft', '←'],
  [1, 'ArrowDown', '↓'],
  [1, 'ArrowRight', '→'],
];

const BOTTOM_MAC: RowEntry[] = [
  [1.25, 'ContextMenu', 'fn', 'mod'],
  [1.25, 'ControlLeft', '⌃', 'mod'],
  [1.25, 'AltLeft', '⌥', 'mod'],
  [1.25, 'MetaLeft', '⌘', 'mod'],
  [6.25, 'Space', '', 'space'],
  [1.25, 'MetaRight', '⌘', 'mod'],
  [1.25, 'AltRight', '⌥', 'mod'],
  [1.25, 'ControlRight', '⌃', 'mod'],
  [0.25, '', ''],
  [1, 'ArrowLeft', '←'],
  [1, 'ArrowDown', '↓'],
  [1, 'ArrowRight', '→'],
];

export const tklWin = buildLayout({
  id: 'tkl-windows',
  name: 'TKL ANSI',
  rows: [...TOP_ROWS, BOTTOM_WIN],
});

export const tklMac = buildLayout({
  id: 'tkl-mac',
  name: 'TKL ANSI',
  rows: [...applyMacLabels(TOP_ROWS), BOTTOM_MAC],
});

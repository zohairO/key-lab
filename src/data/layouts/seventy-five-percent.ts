import { buildLayout, type RowEntry } from './build-layout';
import { applyMacLabels } from './relabel';

/**
 * 75% ANSI (Keychron K2 / K3 / Q1 / GMMK Pro / Drop CTRL style).
 * 16u wide × 6 rows. Essentially 65% + an F-row across the top.
 *
 * F-row ends with PrtSc / Del / LightEffect — matches the Keychron K2 family
 * (most common 75% in the wild). Right-column nav keys cycle PgUp → PgDn →
 * Home → End going down the rows, also K2 convention.
 *
 * Each row sums to 16u.
 */
const F_ROW: RowEntry[] = [
  [1, 'Escape', 'Esc', 'mod'],
  [1, 'F1', 'F1', 'mod'], [1, 'F2', 'F2', 'mod'], [1, 'F3', 'F3', 'mod'], [1, 'F4', 'F4', 'mod'],
  [1, 'F5', 'F5', 'mod'], [1, 'F6', 'F6', 'mod'], [1, 'F7', 'F7', 'mod'], [1, 'F8', 'F8', 'mod'],
  [1, 'F9', 'F9', 'mod'], [1, 'F10', 'F10', 'mod'], [1, 'F11', 'F11', 'mod'], [1, 'F12', 'F12', 'mod'],
  [1, 'PrintScreen', 'PrtSc', 'mod'],
  [1, 'Delete', 'Del', 'mod'],
  // LightEffect: hardware-only key on the K2 (toggles backlight effect). The
  // browser never fires keydown for it, so it sits as a visual placeholder.
  [1, 'LightEffect', 'Light', 'mod'],
];

const MAIN_ROWS: RowEntry[][] = [
  // number row + PgUp (Del moved to F-row, K2-style)
  [
    [1, 'Backquote', '`'],
    [1, 'Digit1', '1'], [1, 'Digit2', '2'], [1, 'Digit3', '3'], [1, 'Digit4', '4'], [1, 'Digit5', '5'],
    [1, 'Digit6', '6'], [1, 'Digit7', '7'], [1, 'Digit8', '8'], [1, 'Digit9', '9'], [1, 'Digit0', '0'],
    [1, 'Minus', '-'], [1, 'Equal', '='],
    [2, 'Backspace', 'Bksp', 'largekey'],
    [1, 'PageUp', 'PgUp', 'largekey'],
  ],
  // tab row + PgDn
  [
    [1.5, 'Tab', 'Tab', 'largekey'],
    [1, 'KeyQ', 'Q'], [1, 'KeyW', 'W'], [1, 'KeyE', 'E'], [1, 'KeyR', 'R'], [1, 'KeyT', 'T'],
    [1, 'KeyY', 'Y'], [1, 'KeyU', 'U'], [1, 'KeyI', 'I'], [1, 'KeyO', 'O'], [1, 'KeyP', 'P'],
    [1, 'BracketLeft', '['], [1, 'BracketRight', ']'],
    [1.5, 'Backslash', '\\', 'largekey'],
    [1, 'PageDown', 'PgDn', 'largekey'],
  ],
  // home row + Home
  [
    [1.75, 'CapsLock', 'Caps', 'mod'],
    [1, 'KeyA', 'A'], [1, 'KeyS', 'S'], [1, 'KeyD', 'D'], [1, 'KeyF', 'F'], [1, 'KeyG', 'G'],
    [1, 'KeyH', 'H'], [1, 'KeyJ', 'J'], [1, 'KeyK', 'K'], [1, 'KeyL', 'L'],
    [1, 'Semicolon', ';'], [1, 'Quote', "'"],
    [2.25, 'Enter', 'Enter', 'largekey'],
    [1, 'Home', 'Home', 'largekey'],
  ],
  // shift row + Up + End (RShift shortened to 1.75)
  [
    [2.25, 'ShiftLeft', 'Shift', 'mod'],
    [1, 'KeyZ', 'Z'], [1, 'KeyX', 'X'], [1, 'KeyC', 'C'], [1, 'KeyV', 'V'], [1, 'KeyB', 'B'],
    [1, 'KeyN', 'N'], [1, 'KeyM', 'M'],
    [1, 'Comma', ','], [1, 'Period', '.'], [1, 'Slash', '/'],
    [1.75, 'ShiftRight', 'Shift', 'mod'],
    [1, 'ArrowUp', '↑'],
    [1, 'End', 'End', 'largekey'],
  ],
];

const BOTTOM_WIN: RowEntry[] = [
  [1.5, 'ControlLeft', 'Ctrl', 'mod'],
  [1.25, 'MetaLeft', 'Win', 'mod'],
  [1.25, 'AltLeft', 'Alt', 'mod'],
  [6.25, 'Space', '', 'space'],
  [1.25, 'AltRight', 'Alt', 'mod'],
  [1.5, 'ContextMenu', 'Fn', 'mod'],
  [1, 'ArrowLeft', '←'],
  [1, 'ArrowDown', '↓'],
  [1, 'ArrowRight', '→'],
];

const BOTTOM_MAC: RowEntry[] = [
  [1.0, 'ContextMenu', 'fn', 'mod'],
  [1.0, 'ControlLeft', '⌃', 'mod'],
  [1.0, 'AltLeft', '⌥', 'mod'],
  [1.25, 'MetaLeft', '⌘', 'mod'],
  [6.25, 'Space', '', 'space'],
  [1.25, 'MetaRight', '⌘', 'mod'],
  [1.25, 'AltRight', '⌥', 'mod'],
  [1, 'ArrowLeft', '←'],
  [1, 'ArrowDown', '↓'],
  [1, 'ArrowRight', '→'],
];

export const seventyFivePercentWin = buildLayout({
  id: 'seventy-five-percent-windows',
  name: '75% ANSI',
  rows: [F_ROW, ...MAIN_ROWS, BOTTOM_WIN],
});

export const seventyFivePercentMac = buildLayout({
  id: 'seventy-five-percent-mac',
  name: '75% ANSI',
  rows: [F_ROW, ...applyMacLabels(MAIN_ROWS), BOTTOM_MAC],
});

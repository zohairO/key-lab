import { buildLayout, type RowEntry } from './build-layout';
import { applyMacLabels } from './relabel';

const TOP_ROWS: RowEntry[][] = [
  // row 0: number row
  [
    [1, 'Backquote', '`'],
    [1, 'Digit1', '1'], [1, 'Digit2', '2'], [1, 'Digit3', '3'], [1, 'Digit4', '4'], [1, 'Digit5', '5'],
    [1, 'Digit6', '6'], [1, 'Digit7', '7'], [1, 'Digit8', '8'], [1, 'Digit9', '9'], [1, 'Digit0', '0'],
    [1, 'Minus', '-'], [1, 'Equal', '='],
    [2, 'Backspace', 'Bksp', 'largekey'],
  ],
  // row 1: tab row
  [
    [1.5, 'Tab', 'Tab', 'largekey'],
    [1, 'KeyQ', 'Q'], [1, 'KeyW', 'W'], [1, 'KeyE', 'E'], [1, 'KeyR', 'R'], [1, 'KeyT', 'T'],
    [1, 'KeyY', 'Y'], [1, 'KeyU', 'U'], [1, 'KeyI', 'I'], [1, 'KeyO', 'O'], [1, 'KeyP', 'P'],
    [1, 'BracketLeft', '['], [1, 'BracketRight', ']'],
    [1.5, 'Backslash', '\\', 'largekey'],
  ],
  // row 2: home row
  [
    [1.75, 'CapsLock', 'Caps', 'mod'],
    [1, 'KeyA', 'A'], [1, 'KeyS', 'S'], [1, 'KeyD', 'D'], [1, 'KeyF', 'F'], [1, 'KeyG', 'G'],
    [1, 'KeyH', 'H'], [1, 'KeyJ', 'J'], [1, 'KeyK', 'K'], [1, 'KeyL', 'L'],
    [1, 'Semicolon', ';'], [1, 'Quote', "'"],
    [2.25, 'Enter', 'Enter', 'largekey'],
  ],
  // row 3: shift row
  [
    [2.25, 'ShiftLeft', 'Shift', 'mod'],
    [1, 'KeyZ', 'Z'], [1, 'KeyX', 'X'], [1, 'KeyC', 'C'], [1, 'KeyV', 'V'], [1, 'KeyB', 'B'],
    [1, 'KeyN', 'N'], [1, 'KeyM', 'M'],
    [1, 'Comma', ','], [1, 'Period', '.'], [1, 'Slash', '/'],
    [2.75, 'ShiftRight', 'Shift', 'mod'],
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
];

// Mac bottom row order, going outward from spacebar: ⌘ → ⌥ → ⌃ → fn
const BOTTOM_MAC: RowEntry[] = [
  [1.25, 'ContextMenu', 'fn', 'mod'],
  [1.25, 'ControlLeft', '⌃', 'mod'],
  [1.25, 'AltLeft', '⌥', 'mod'],
  [1.25, 'MetaLeft', '⌘', 'mod'],
  [6.25, 'Space', '', 'space'],
  [1.25, 'MetaRight', '⌘', 'mod'],
  [1.25, 'AltRight', '⌥', 'mod'],
  [1.25, 'ControlRight', '⌃', 'mod'],
];

export const sixtyPercentWin = buildLayout({
  id: 'sixty-percent-windows',
  name: '60% ANSI',
  rows: [...TOP_ROWS, BOTTOM_WIN],
});

export const sixtyPercentMac = buildLayout({
  id: 'sixty-percent-mac',
  name: '60% ANSI',
  rows: [...applyMacLabels(TOP_ROWS), BOTTOM_MAC],
});

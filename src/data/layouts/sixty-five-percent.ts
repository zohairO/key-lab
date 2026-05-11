import { buildLayout, type RowEntry } from './build-layout';

/**
 * Tofu65-style 65% ANSI layout: 60% + one extra column on the right
 * with nav cluster (Del/Home/PgUp/PgDn/End) and an integrated arrow
 * cluster across the bottom two rows.
 *
 * Each row sums to 16u. Right-shift drops from 2.75u → 1.75u and the
 * bottom row swaps the right-modifier cluster for arrows to make room.
 */
const ROWS: RowEntry[][] = [
  // row 0: number row + Del
  [
    [1, 'Backquote', '`'],
    [1, 'Digit1', '1'], [1, 'Digit2', '2'], [1, 'Digit3', '3'], [1, 'Digit4', '4'], [1, 'Digit5', '5'],
    [1, 'Digit6', '6'], [1, 'Digit7', '7'], [1, 'Digit8', '8'], [1, 'Digit9', '9'], [1, 'Digit0', '0'],
    [1, 'Minus', '-'], [1, 'Equal', '='],
    [2, 'Backspace', 'Bksp', 'largekey'],
    [1, 'Delete', 'Del', 'largekey'],
  ],
  // row 1: tab row + Home
  [
    [1.5, 'Tab', 'Tab', 'largekey'],
    [1, 'KeyQ', 'Q'], [1, 'KeyW', 'W'], [1, 'KeyE', 'E'], [1, 'KeyR', 'R'], [1, 'KeyT', 'T'],
    [1, 'KeyY', 'Y'], [1, 'KeyU', 'U'], [1, 'KeyI', 'I'], [1, 'KeyO', 'O'], [1, 'KeyP', 'P'],
    [1, 'BracketLeft', '['], [1, 'BracketRight', ']'],
    [1.5, 'Backslash', '\\', 'largekey'],
    [1, 'Home', 'Home', 'largekey'],
  ],
  // row 2: home row + PgUp
  [
    [1.75, 'CapsLock', 'Caps', 'mod'],
    [1, 'KeyA', 'A'], [1, 'KeyS', 'S'], [1, 'KeyD', 'D'], [1, 'KeyF', 'F'], [1, 'KeyG', 'G'],
    [1, 'KeyH', 'H'], [1, 'KeyJ', 'J'], [1, 'KeyK', 'K'], [1, 'KeyL', 'L'],
    [1, 'Semicolon', ';'], [1, 'Quote', "'"],
    [2.25, 'Enter', 'Enter', 'largekey'],
    [1, 'PageUp', 'PgUp', 'largekey'],
  ],
  // row 3: shift row + Up + PgDn (RShift shortened to 1.75)
  [
    [2.25, 'ShiftLeft', 'Shift', 'mod'],
    [1, 'KeyZ', 'Z'], [1, 'KeyX', 'X'], [1, 'KeyC', 'C'], [1, 'KeyV', 'V'], [1, 'KeyB', 'B'],
    [1, 'KeyN', 'N'], [1, 'KeyM', 'M'],
    [1, 'Comma', ','], [1, 'Period', '.'], [1, 'Slash', '/'],
    [1.75, 'ShiftRight', 'Shift', 'mod'],
    [1, 'ArrowUp', '↑'],
    [1, 'PageDown', 'PgDn', 'largekey'],
  ],
  // row 4: bottom row with arrows replacing the right-side modifier cluster
  [
    [1.5, 'ControlLeft', 'Ctrl', 'mod'],
    [1.25, 'MetaLeft', 'Win', 'mod'],
    [1.25, 'AltLeft', 'Alt', 'mod'],
    [6.25, 'Space', '', 'space'],
    [1.25, 'AltRight', 'Alt', 'mod'],
    [1.5, 'ContextMenu', 'Fn', 'mod'],
    [1, 'ArrowLeft', '←'],
    [1, 'ArrowDown', '↓'],
    [1, 'ArrowRight', '→'],
  ],
];

export const sixtyFivePercent = buildLayout({
  id: 'sixty-five-percent',
  name: '65% ANSI',
  rows: ROWS,
});

import { useEffect, useState } from 'react';

/**
 * Tracks the set of currently-pressed KeyboardEvent.code values.
 * Skips autorepeat events. Clears on window blur so tab-switching
 * doesn't leave keys "stuck" in the pressed state.
 */
export function usePressedKeys(): Set<string> {
  const [keys, setKeys] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      setKeys((prev) => {
        if (prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    };
    const onUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        if (!prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };
    const onBlur = () => setKeys((prev) => (prev.size ? new Set() : prev));

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return keys;
}

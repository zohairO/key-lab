import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioEngine } from '../systems/audio/audio-engine';
import type { SoundPack } from '../systems/audio/sound-pack';
import type { KeycapProfile } from '../systems/audio/keycap-eq';
import type { Layout } from '../types';
import { buildCodeIndex } from '../lib/key-lookup';

interface UseAudioEngineOptions {
  pack: SoundPack;
  layout: Layout;
  keycap: KeycapProfile;
  enabled?: boolean;
}

/**
 * Owns a single AudioEngine instance. Wires keydown/keyup -> engine.play().
 * Skips autorepeat events (real keyboards don't make sound on autorepeat).
 */
export function useAudioEngine({ pack, layout, keycap, enabled = true }: UseAudioEngineOptions) {
  const engineRef = useRef<AudioEngine | null>(null);
  if (!engineRef.current) engineRef.current = new AudioEngine(pack);
  const engine = engineRef.current;

  const codeIndex = useMemo(() => buildCodeIndex(layout), [layout]);
  const [ready, setReady] = useState(false);

  // Sync pack & keycap changes into the engine
  useEffect(() => {
    engine.setPack(pack);
    setReady(false);
    let cancelled = false;
    engine
      .preload()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => console.error('[audio] preload failed', err));
    return () => {
      cancelled = true;
    };
  }, [engine, pack]);

  useEffect(() => {
    engine.setKeycap(keycap);
  }, [engine, keycap]);

  // Keyboard input listener
  useEffect(() => {
    if (!enabled) return;
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = codeIndex.get(e.code);
      if (!key) return;
      engine.play(key);
    };
    window.addEventListener('keydown', onDown);
    return () => window.removeEventListener('keydown', onDown);
  }, [engine, codeIndex, enabled]);

  return { engine, ready };
}

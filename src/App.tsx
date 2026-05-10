import { useEffect, useMemo, useState } from 'react';
import { Scene } from './systems/rendering/Scene';
import { Keyboard } from './systems/rendering/Keyboard';
import { sixtyPercent } from './data/sixty-percent';
import { holyPandas } from './data/sound-packs/holy-pandas';
import { cherryMxBrownPbt } from './data/sound-packs/cherrymx-brown-pbt';
import { cherryMxBluePbt } from './data/sound-packs/cherrymx-blue-pbt';
import { KEYCAP_LABEL } from './data/keycap-profiles';
import type { KeycapProfile } from './types';
import { useAudioEngine } from './hooks/useAudioEngine';
import { usePressedKeys } from './hooks/usePressedKeys';
import { readBuildHash, writeBuildHash } from './lib/url-state';
import type { SoundPack } from './systems/audio/sound-pack';

const PACKS: SoundPack[] = [cherryMxBrownPbt, holyPandas, cherryMxBluePbt];
const KEYCAP_OPTIONS: KeycapProfile[] = ['thin-abs', 'thick-pbt', 'tall-pbt'];

export default function App() {
  // Hydrate from URL on mount; fall back to defaults.
  const initial = useMemo(() => readBuildHash(), []);
  const [packId, setPackId] = useState<string>(
    initial.packId && PACKS.some((p) => p.id === initial.packId)
      ? initial.packId
      : cherryMxBrownPbt.id,
  );
  const [keycap, setKeycap] = useState<KeycapProfile>(initial.keycap ?? 'thick-pbt');

  // Keep URL in sync.
  useEffect(() => {
    writeBuildHash({ packId, keycap });
  }, [packId, keycap]);

  const pack = PACKS.find((p) => p.id === packId) ?? PACKS[0];
  const { ready } = useAudioEngine({ pack, layout: sixtyPercent, keycap });
  const pressedKeys = usePressedKeys();

  return (
    <div className="relative h-full w-full">
      <Scene>
        <Keyboard pressedKeys={pressedKeys} keycap={keycap} />
      </Scene>

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">KeyboardLab</h1>
          <p className="text-xs text-neutral-400">
            drag to rotate · scroll to zoom · type to hear and see it
          </p>
        </div>
        <div className="pointer-events-auto">
          <ShareButton />
        </div>
      </header>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-neutral-500">
          <span>Switches</span>
          <span className={ready ? 'text-emerald-400' : 'text-amber-400'}>
            {ready ? '●' : '○'}
          </span>
        </div>
        <Segmented
          options={PACKS.map((p) => ({ id: p.id, label: p.name }))}
          value={packId}
          onChange={setPackId}
        />

        <div className="mt-1 text-[11px] uppercase tracking-wider text-neutral-500">Keycaps</div>
        <Segmented
          options={KEYCAP_OPTIONS.map((k) => ({ id: k, label: KEYCAP_LABEL[k] }))}
          value={keycap}
          onChange={(v) => setKeycap(v as KeycapProfile)}
        />
      </div>
    </div>
  );
}

interface SegmentedProps {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}

function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="flex gap-1 rounded-full bg-neutral-900/80 p-1 backdrop-blur">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-full px-4 py-2 text-sm transition ${
            value === opt.id
              ? 'bg-neutral-100 text-neutral-900'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers / no clipboard permission — fall through silently.
      window.prompt('Copy this link:', window.location.href);
    }
  };

  return (
    <button
      onClick={onClick}
      className="rounded-full bg-neutral-900/80 px-4 py-2 text-sm text-neutral-200 backdrop-blur transition hover:bg-neutral-800"
    >
      {copied ? 'Copied ✓' : 'Share build'}
    </button>
  );
}

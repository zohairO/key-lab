import { useEffect, useMemo, useState } from 'react';
import { Scene } from './systems/rendering/Scene';
import { Keyboard } from './systems/rendering/Keyboard';
import { LAYOUTS, DEFAULT_LAYOUT_ID, getLayout } from './data/layouts';
import { holyPandas } from './data/sound-packs/holy-pandas';
import { cherryMxBrownPbt } from './data/sound-packs/cherrymx-brown-pbt';
import { cherryMxBluePbt } from './data/sound-packs/cherrymx-blue-pbt';
import { KEYCAP_LABEL, KEYCAP_VISUAL } from './data/keycap-profiles';
import { BOARD_CONFIG, BOARD_TYPE_OPTIONS } from './data/board-types';
import { PLATE_OPTIONS, PLATE_VISUAL } from './data/plate-materials';
import { PRESETS } from './data/presets';
import type { BoardType, KeycapProfile, PlateMaterial } from './types';
import { useAudioEngine } from './hooks/useAudioEngine';
import { usePressedKeys } from './hooks/usePressedKeys';
import { readBuildHash, writeBuildHash, type BuildState } from './lib/url-state';
import type { SoundPack } from './systems/audio/sound-pack';
import { SidePanel } from './ui/SidePanel';
import { PanelSection } from './ui/PanelSection';
import { OptionList } from './ui/OptionList';

const PACKS: SoundPack[] = [cherryMxBrownPbt, holyPandas, cherryMxBluePbt];
const KEYCAP_OPTIONS: KeycapProfile[] = ['thin-abs', 'thick-pbt', 'tall-pbt'];

const DEFAULTS: BuildState = {
  boardType: 'mechanical',
  packId: cherryMxBrownPbt.id,
  keycap: 'thick-pbt',
  plateMaterial: 'aluminum',
  layoutId: DEFAULT_LAYOUT_ID,
};

export default function App() {
  const initial = useMemo(() => readBuildHash(), []);
  const [boardType, setBoardType] = useState<BoardType>(initial.boardType ?? DEFAULTS.boardType);
  const [packId, setPackId] = useState<string>(
    initial.packId && PACKS.some((p) => p.id === initial.packId) ? initial.packId : DEFAULTS.packId,
  );
  const [keycap, setKeycap] = useState<KeycapProfile>(initial.keycap ?? DEFAULTS.keycap);
  const [plateMaterial, setPlateMaterial] = useState<PlateMaterial>(
    initial.plateMaterial ?? DEFAULTS.plateMaterial,
  );
  const [layoutId, setLayoutId] = useState<string>(
    initial.layoutId && LAYOUTS.some((l) => l.id === initial.layoutId)
      ? initial.layoutId
      : DEFAULTS.layoutId,
  );
  const [panelOpen, setPanelOpen] = useState(true);

  const layout = getLayout(layoutId);
  const pack = PACKS.find((p) => p.id === packId) ?? PACKS[0];

  useEffect(() => {
    writeBuildHash({ boardType, packId, keycap, plateMaterial, layoutId });
  }, [boardType, packId, keycap, plateMaterial, layoutId]);

  const { ready } = useAudioEngine({ pack, layout, keycap, plateMaterial });
  const pressedKeys = usePressedKeys();

  const matchingPreset = PRESETS.find(
    (p) =>
      p.build.boardType === boardType &&
      p.build.packId === packId &&
      p.build.keycap === keycap &&
      p.build.plateMaterial === plateMaterial &&
      p.build.layoutId === layoutId,
  );

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setBoardType(preset.build.boardType);
    setPackId(preset.build.packId);
    setKeycap(preset.build.keycap);
    setPlateMaterial(preset.build.plateMaterial);
    setLayoutId(preset.build.layoutId);
  };

  const reset = () => {
    setBoardType(DEFAULTS.boardType);
    setPackId(DEFAULTS.packId);
    setKeycap(DEFAULTS.keycap);
    setPlateMaterial(DEFAULTS.plateMaterial);
    setLayoutId(DEFAULTS.layoutId);
  };

  return (
    <div className="relative h-full w-full">
      <Scene>
        <Keyboard
          pressedKeys={pressedKeys}
          keycap={keycap}
          boardType={boardType}
          plateMaterial={plateMaterial}
          layout={layout}
        />
      </Scene>

      <header className="pointer-events-none absolute right-0 top-0 flex items-start justify-end px-4 py-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded border border-neutral-800 bg-[#0e0e10] px-2.5 py-1.5 text-[11px] uppercase tracking-wider ${
              ready ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {ready ? 'Ready' : 'Loading'}
          </span>
          <ShareButton />
        </div>
      </header>

      <SidePanel
        open={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        footer={
          <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-500">
            <span>{layout.name} · drag · scroll · type</span>
            <button
              onClick={reset}
              className="rounded border border-neutral-800 px-2.5 py-1 text-neutral-400 transition hover:border-neutral-700 hover:text-neutral-200"
            >
              Reset
            </button>
          </div>
        }
      >
        <PanelSection title="Presets" defaultOpen>
          <OptionList
            options={[
              { id: '__custom', label: 'Custom build', description: 'Configure each component yourself' },
              ...PRESETS.map((p) => ({ id: p.id, label: p.name, description: p.description })),
            ]}
            value={matchingPreset?.id ?? '__custom'}
            onChange={(id) => {
              if (id === '__custom') return;
              applyPreset(id);
            }}
          />
        </PanelSection>

        <PanelSection title="Board" defaultOpen>
          <div className="px-4 pb-1 pt-1 text-[10px] uppercase tracking-wider text-neutral-600">Layout</div>
          <OptionList
            options={LAYOUTS.map((l) => ({ id: l.id, label: l.name }))}
            value={layoutId}
            onChange={setLayoutId}
          />
          <div className="px-4 pb-1 pt-3 text-[10px] uppercase tracking-wider text-neutral-600">Type</div>
          <OptionList
            options={BOARD_TYPE_OPTIONS.map((b) => ({
              id: b,
              label: BOARD_CONFIG[b].name,
              description: BOARD_CONFIG[b].description,
            }))}
            value={boardType}
            onChange={(v) => setBoardType(v as BoardType)}
          />
        </PanelSection>

        <PanelSection title="Switches" defaultOpen>
          <OptionList
            options={PACKS.map((p) => ({ id: p.id, label: p.name }))}
            value={packId}
            onChange={setPackId}
          />
        </PanelSection>

        <PanelSection title="Keycaps" defaultOpen>
          <OptionList
            options={KEYCAP_OPTIONS.map((k) => ({
              id: k,
              label: KEYCAP_LABEL[k],
              swatch: KEYCAP_VISUAL[k].capColor,
            }))}
            value={keycap}
            onChange={(v) => setKeycap(v as KeycapProfile)}
          />
        </PanelSection>

        <PanelSection title="Internals" defaultOpen={false}>
          <div className="px-4 pb-1 pt-1 text-[10px] uppercase tracking-wider text-neutral-600">Plate</div>
          <OptionList
            options={PLATE_OPTIONS.map((p) => ({
              id: p,
              label: PLATE_VISUAL[p].name,
              description: PLATE_VISUAL[p].description,
              swatch: PLATE_VISUAL[p].swatch,
            }))}
            value={plateMaterial}
            onChange={(v) => setPlateMaterial(v as PlateMaterial)}
          />
        </PanelSection>

        <PanelSection title="Settings" defaultOpen={false}>
          <div className="px-4 py-2 text-[12px] text-neutral-500">
            Volume, auto-rotate, ANSI/ISO — coming soon.
          </div>
        </PanelSection>
      </SidePanel>
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
      window.prompt('Copy this link:', window.location.href);
    }
  };

  return (
    <button
      onClick={onClick}
      className="rounded border border-neutral-800 bg-[#0e0e10] px-3 py-1.5 text-[12px] text-neutral-200 transition hover:border-neutral-700"
    >
      {copied ? 'Copied' : 'Share build'}
    </button>
  );
}

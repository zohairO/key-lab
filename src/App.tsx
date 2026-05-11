import { useEffect, useMemo, useState } from 'react';
import { Scene } from './systems/rendering/Scene';
import { Keyboard } from './systems/rendering/Keyboard';
import {
  DEFAULT_KEYBOARD_STYLE,
  DEFAULT_LAYOUT_FAMILY,
  KEYBOARD_STYLES,
  LAYOUT_FAMILIES,
  resolveLayout,
} from './data/layouts';
import { holyPandas } from './data/sound-packs/holy-pandas';
import { cherryMxBrownPbt } from './data/sound-packs/cherrymx-brown-pbt';
import { cherryMxBluePbt } from './data/sound-packs/cherrymx-blue-pbt';
import { KEYCAP_LABEL, KEYCAP_VISUAL } from './data/keycap-profiles';
import { BOARD_CONFIG, BOARD_TYPE_OPTIONS } from './data/board-types';
import { PLATE_OPTIONS, PLATE_VISUAL } from './data/plate-materials';
import { KEYCAP_SHAPES, KEYCAP_SHAPE_OPTIONS } from './data/keycap-shapes';
import { PRESETS } from './data/presets';
import type {
  BoardType,
  KeyboardStyle,
  KeycapProfile,
  KeycapShape,
  LayoutFamily,
  PlateMaterial,
  Theme,
} from './types';
import { useAudioEngine } from './hooks/useAudioEngine';
import { usePressedKeys } from './hooks/usePressedKeys';
import { readBuildHash, writeBuildHash, type BuildState } from './lib/url-state';
import type { SoundPack } from './systems/audio/sound-pack';
import { SidePanel } from './ui/SidePanel';
import { PanelSection } from './ui/PanelSection';
import { OptionList } from './ui/OptionList';
import { ChipRow } from './ui/ChipRow';

const PACKS: SoundPack[] = [cherryMxBrownPbt, holyPandas, cherryMxBluePbt];
const KEYCAP_OPTIONS: KeycapProfile[] = ['thin-abs', 'thick-pbt', 'tall-pbt'];

const DEFAULTS: BuildState = {
  boardType: 'mechanical',
  packId: cherryMxBrownPbt.id,
  keycap: 'thick-pbt',
  keycapShape: 'oem',
  plateMaterial: 'aluminum',
  layoutFamily: DEFAULT_LAYOUT_FAMILY,
  keyboardStyle: DEFAULT_KEYBOARD_STYLE,
  theme: 'dark',
};

export default function App() {
  const initial = useMemo(() => readBuildHash(), []);
  const [boardType, setBoardType] = useState<BoardType>(initial.boardType ?? DEFAULTS.boardType);
  const [packId, setPackId] = useState<string>(
    initial.packId && PACKS.some((p) => p.id === initial.packId) ? initial.packId : DEFAULTS.packId,
  );
  const [keycap, setKeycap] = useState<KeycapProfile>(initial.keycap ?? DEFAULTS.keycap);
  const [keycapShape, setKeycapShape] = useState<KeycapShape>(
    initial.keycapShape ?? DEFAULTS.keycapShape,
  );
  const [plateMaterial, setPlateMaterial] = useState<PlateMaterial>(
    initial.plateMaterial ?? DEFAULTS.plateMaterial,
  );
  const [layoutFamily, setLayoutFamily] = useState<LayoutFamily>(
    initial.layoutFamily ?? DEFAULTS.layoutFamily,
  );
  const [keyboardStyle, setKeyboardStyle] = useState<KeyboardStyle>(
    initial.keyboardStyle ?? DEFAULTS.keyboardStyle,
  );
  const [theme, setTheme] = useState<Theme>(initial.theme ?? DEFAULTS.theme);
  const [panelOpen, setPanelOpen] = useState(true);

  const layout = resolveLayout(layoutFamily, keyboardStyle);
  const pack = PACKS.find((p) => p.id === packId) ?? PACKS[0];

  // Sync theme class onto <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    writeBuildHash({
      boardType, packId, keycap, keycapShape, plateMaterial,
      layoutFamily, keyboardStyle, theme,
    });
  }, [boardType, packId, keycap, keycapShape, plateMaterial, layoutFamily, keyboardStyle, theme]);

  const { ready } = useAudioEngine({ pack, layout, keycap, plateMaterial });
  const pressedKeys = usePressedKeys();

  const matchingPreset = PRESETS.find(
    (p) =>
      p.build.boardType === boardType &&
      p.build.packId === packId &&
      p.build.keycap === keycap &&
      p.build.keycapShape === keycapShape &&
      p.build.plateMaterial === plateMaterial &&
      p.build.layoutFamily === layoutFamily &&
      p.build.keyboardStyle === keyboardStyle,
  );

  // Visual overrides come from the matching preset (if any). When the user
  // customises away from the preset, overrides drop and the build returns
  // to its generic look from KEYCAP_VISUAL.
  const visualOverrides = matchingPreset
    ? {
        caseColor: matchingPreset.build.caseColorOverride,
        capColor: matchingPreset.build.capColorOverride,
        labelColor: matchingPreset.build.labelColorOverride,
        zoneColors: matchingPreset.build.zoneColors,
        keyColors: matchingPreset.build.keyColors,
      }
    : undefined;

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setBoardType(preset.build.boardType);
    setPackId(preset.build.packId);
    setKeycap(preset.build.keycap);
    setKeycapShape(preset.build.keycapShape);
    setPlateMaterial(preset.build.plateMaterial);
    setLayoutFamily(preset.build.layoutFamily);
    setKeyboardStyle(preset.build.keyboardStyle);
  };

  const reset = () => {
    setBoardType(DEFAULTS.boardType);
    setPackId(DEFAULTS.packId);
    setKeycap(DEFAULTS.keycap);
    setKeycapShape(DEFAULTS.keycapShape);
    setPlateMaterial(DEFAULTS.plateMaterial);
    setLayoutFamily(DEFAULTS.layoutFamily);
    setKeyboardStyle(DEFAULTS.keyboardStyle);
  };

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="relative h-full w-full">
      <Scene theme={theme}>
        <Keyboard
          pressedKeys={pressedKeys}
          keycap={keycap}
          keycapShape={keycapShape}
          boardType={boardType}
          plateMaterial={plateMaterial}
          layout={layout}
          overrides={visualOverrides}
        />
      </Scene>

      <header className="pointer-events-none absolute right-0 top-0 flex items-start justify-end px-4 py-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded border bg-white px-2.5 py-1.5 text-[11px] uppercase tracking-wider dark:bg-[#0e0e10] ${
              ready
                ? 'border-emerald-300 text-emerald-600 dark:border-neutral-800 dark:text-emerald-400'
                : 'border-amber-300 text-amber-600 dark:border-neutral-800 dark:text-amber-400'
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
        theme={theme}
        onToggleTheme={toggleTheme}
        footer={
          <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-neutral-500">
            <span>
              {layout.name} · {keyboardStyle === 'mac' ? 'Mac' : 'Win'} · drag · type
            </span>
            <button
              onClick={reset}
              className="rounded border border-zinc-200 px-2.5 py-1 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200"
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
          {matchingPreset?.authenticityNotes && (
            <div className="mx-4 mt-2 rounded border border-zinc-200 bg-zinc-50 p-2 text-[11px] leading-snug text-zinc-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
              <div className="mb-1 font-medium uppercase tracking-wider text-zinc-500 dark:text-neutral-500">
                Authenticity
              </div>
              {matchingPreset.authenticityNotes}
            </div>
          )}
        </PanelSection>

        <PanelSection title="Board" defaultOpen>
          <ChipRow
            label="Layout"
            options={LAYOUT_FAMILIES.map((l) => ({
              id: l.id,
              label: l.name.replace(' ANSI', ''),
            }))}
            value={layoutFamily}
            onChange={(v) => setLayoutFamily(v as LayoutFamily)}
          />
          <ChipRow
            label="Style"
            options={KEYBOARD_STYLES.map((s) => ({ id: s.id, label: s.name }))}
            value={keyboardStyle}
            onChange={(v) => setKeyboardStyle(v as KeyboardStyle)}
          />
          <ChipRow
            label="Type"
            options={BOARD_TYPE_OPTIONS.map((b) => ({
              id: b,
              label: BOARD_CONFIG[b].name,
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
          <ChipRow
            label="Colorway"
            options={KEYCAP_OPTIONS.map((k) => ({
              id: k,
              label: KEYCAP_LABEL[k],
              swatch: KEYCAP_VISUAL[k].capColor,
            }))}
            value={keycap}
            onChange={(v) => setKeycap(v as KeycapProfile)}
          />
          {boardType === 'mechanical' ? (
            <ChipRow
              label="Profile shape"
              options={KEYCAP_SHAPE_OPTIONS.map((s) => ({
                id: s,
                label: KEYCAP_SHAPES[s].name,
              }))}
              value={keycapShape}
              onChange={(v) => setKeycapShape(v as KeycapShape)}
            />
          ) : (
            <div className="px-4 pb-2 pt-1 text-[11px] leading-snug text-zinc-500 dark:text-neutral-500">
              Shape forced by board:{' '}
              <span className="text-zinc-700 dark:text-neutral-300">
                {KEYCAP_SHAPES[BOARD_CONFIG[boardType].forceKeycapShape!].name}
              </span>
            </div>
          )}
        </PanelSection>

        <PanelSection title="Plate" defaultOpen={false}>
          <ChipRow
            label="Material"
            options={PLATE_OPTIONS.map((p) => ({
              id: p,
              label: PLATE_VISUAL[p].name,
              swatch: PLATE_VISUAL[p].swatch,
            }))}
            value={plateMaterial}
            onChange={(v) => setPlateMaterial(v as PlateMaterial)}
          />
        </PanelSection>

        <PanelSection title="Settings" defaultOpen={false}>
          <div className="px-4 py-2 text-[12px] text-zinc-500 dark:text-neutral-500">
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
      className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-[12px] text-zinc-700 transition hover:border-zinc-300 dark:border-neutral-800 dark:bg-[#0e0e10] dark:text-neutral-200 dark:hover:border-neutral-700"
    >
      {copied ? 'Copied' : 'Share build'}
    </button>
  );
}

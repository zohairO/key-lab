import type { KeyDef, PlateMaterial } from '../../types';
import { packUrls, resolveSlice, type SoundPack } from './sound-pack';
import { KEYCAP_EQ, type FilterPreset, type KeycapProfile } from './keycap-eq';
import { PLATE_EQ } from '../../data/plate-materials';

const PITCH_JITTER = 0.02;       // ±2% playback rate randomization
const ONSET_JITTER_MS = 5;       // ±5ms onset randomization
const MASTER_GAIN = 0.7;

/**
 * Web Audio engine for playing per-key samples with a keycap EQ filter applied.
 * Handles both multi-file packs (one sample per row + per-key overrides) and
 * sprite packs (single audio file with offset/duration per key).
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private cache = new Map<string, AudioBuffer>();
  private inflight = new Map<string, Promise<AudioBuffer>>();
  private pack: SoundPack;
  private keycap: KeycapProfile = 'thick-pbt';
  private plate: PlateMaterial = 'aluminum';
  private masterGain: GainNode | null = null;

  constructor(pack: SoundPack) {
    this.pack = pack;
  }

  setPack(pack: SoundPack) {
    if (this.pack.id === pack.id) return;
    this.pack = pack;
    this.cache.clear();
    this.inflight.clear();
  }

  setKeycap(profile: KeycapProfile) {
    this.keycap = profile;
  }

  setPlate(plate: PlateMaterial) {
    this.plate = plate;
  }

  /** Lazy-init the context so we don't create one before user interaction. */
  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = MASTER_GAIN;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  /** Preload every sample referenced by the current pack. */
  async preload(): Promise<void> {
    this.ensureCtx();
    const urls = new Set<string>(packUrls(this.pack));
    await Promise.all([...urls].map((u) => this.load(u)));
  }

  private load(url: string): Promise<AudioBuffer> {
    const cached = this.cache.get(url);
    if (cached) return Promise.resolve(cached);
    const pending = this.inflight.get(url);
    if (pending) return pending;

    const ctx = this.ensureCtx();
    const promise = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`failed to load ${url}: ${r.status}`);
        return r.arrayBuffer();
      })
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        this.cache.set(url, decoded);
        this.inflight.delete(url);
        return decoded;
      })
      .catch((err) => {
        this.inflight.delete(url);
        throw err;
      });

    this.inflight.set(url, promise);
    return promise;
  }

  /** Play a key. No-op if the sample isn't loaded yet (preloads it for next time). */
  play(key: KeyDef): void {
    const slice = resolveSlice(this.pack, key);
    if (!slice) return;

    const ctx = this.ensureCtx();
    const buf = this.cache.get(slice.url);
    if (!buf) {
      void this.load(slice.url); // first press of an unloaded sample is silent
      return;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = 1 + (Math.random() * 2 - 1) * PITCH_JITTER;

    // EQ chain: src -> keycap filters -> plate filters -> masterGain
    const buildFilters = (presets: FilterPreset[]) =>
      presets.map((preset) => {
        const f = ctx.createBiquadFilter();
        f.type = preset.type;
        f.frequency.value = preset.frequency;
        if (preset.gain !== undefined) f.gain.value = preset.gain;
        if (preset.Q !== undefined) f.Q.value = preset.Q;
        return f;
      });
    const filters = [...buildFilters(KEYCAP_EQ[this.keycap]), ...buildFilters(PLATE_EQ[this.plate])];

    let node: AudioNode = src;
    for (const f of filters) {
      node.connect(f);
      node = f;
    }
    node.connect(this.masterGain!);

    const onsetSec = (Math.random() * 2 - 1) * (ONSET_JITTER_MS / 1000);
    const startTime = ctx.currentTime + Math.max(0, onsetSec);
    if (slice.offsetSec !== undefined && slice.durationSec !== undefined) {
      src.start(startTime, slice.offsetSec, slice.durationSec > 0 ? slice.durationSec : undefined);
    } else {
      src.start(startTime);
    }
  }
}

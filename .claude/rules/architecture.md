# KeyboardLab — Architecture

Big-picture context. Read first when starting a session; most sessions won't need to revisit it, which is the point.

## What this is

A browser-based interactive 3D mechanical-keyboard simulator. Two modes:

1. **Browse** — explore curated keyboards in 3D, hear their sound profile.
2. **Build** — assemble a custom keyboard from parts; visuals and sound update live; share via URL-encoded link.

The killer interaction: the user types on their **physical** keyboard, and the browser plays back the simulated sound of the **virtual** keyboard they've selected or built. Per-zone sounds (alphas, spacebar, mods) so it actually feels like *that* board.

Long-term ambition: a generic *enthusiast product simulator* (watches, bikes, PCs, cameras, audio gear). v0 is keyboard-only. Cross-category generalization is deferred until a second category arrives.

## Core architecture (v0)

- **Client-only.** No backend, no DB, no auth. Single-page React app.
- **Procedural 3D.** A keyboard is generated from a layout spec (e.g. 60%, TKL) + parameterised case mesh + instanced keycaps. No purchased models.
- **Sample-based sound.** Real recordings sourced from YouTube/free sources, segmented per zone. Web Audio for playback. Tone.js for any later EQ/reverb shaping.
- **URL-encoded builds.** Build state serializes to the URL hash. Sharing requires no server.
- **Strict module boundaries** so future generalization is cheap, but no generic abstractions in v0:
  - `src/features/keyboard-browser/` — Browse mode UI
  - `src/features/keyboard-builder/` — Build mode UI
  - `src/systems/rendering/` — R3F scene, camera, lighting (keyboard-specific is OK)
  - `src/systems/audio/` — sample loading, key→sample dispatch, zone mapping
  - `src/data/` — keyboard specs, part catalog, sample manifests
  - `src/lib/` — pure helpers (URL encoding, layout math)
  - `src/types.ts` — shared types

## Decisions: 3D model strategy

| Path | What it is | v0 fit | Status |
|---|---|---|---|
| **A. Procedural** | Generate cases + keycaps in code from a spec. Stylized but functional. | Free, fast, infinitely configurable, scales to "build your own." | **CHOSEN for v0 (2026-05-09).** |
| B. Licensed models (Sketchfab / TurboSquid / CGTrader) | $10–$200 per board. Higher fidelity. | Doesn't scale to custom builds — can't swap a switch on a baked mesh. Reasonable for hand-picked catalog entries later. | **Deferred to Phase 2** for catalog-only "hero" boards. |
| C. Hand-modeled in Blender | Highest control, highest cost. | Solo dev with no Blender pipeline yet. Out of scope. | Rejected for v0. |

Visual target: **stylized but recognizable**, not photoreal. Photorealism is an upgrade path, not a v0 requirement.

## Decisions: sound strategy

Sound is layered: **switch defines the sample, keycap shapes the sample via EQ.**

| Path | What it is | v0 fit | Status |
|---|---|---|---|
| **A. Sample-based per switch + EQ-modifier per keycap** | 12 base sample sets (3 switches × 4 zones). Each keycap profile applies a Web Audio `BiquadFilterNode` curve on top to bias bright/neutral/deep. | Authentic, sourceable, keeps sample count tractable. EQ is acoustically honest — keycap mostly shapes high-frequency content. | **CHOSEN for v0 (2026-05-10).** |
| B. Combinatorial samples (switch × keycap) | 36 sample sets (3 switches × 3 keycaps × 4 zones). Most authentic. | 3× sourcing burden, prohibitive for v0. | Rejected for v0. Optional Phase 2 upgrade for hero boards. |
| C. Pure synthesis (Tone.js) | Generate sound from parameters. | Hard to make sound *real*. | Deferred. |

**Pack formats supported:**
- `multi-file` — kbsim/Holy Pandas style: one MP3 per keyboard row + per-key overrides for Space/Enter/Backspace.
- `sprite` — Mechvibes single-file style: one OGG/MP3 + a JSON map of `[offsetMs, durationMs]` per scancode. We translate iohook scancodes to `KeyboardEvent.code` at pack-build time (`src/systems/audio/mechvibes.ts`).

The audio engine resolves both via `resolveSlice(pack, key)` so the playback path is uniform. `KeyDef.zone` is still useful for builder UI grouping; for *audio*, sprite packs key off `event.code` directly and multi-file packs key off row index (`KeyDef.y`) with code-keyed overrides.

**Per-key resolution:** sprite packs are per-key by construction. Multi-file packs are per-row + special-key overrides (more accurate than the original four-zone plan — real recordings differ row-to-row because of keycap tilt and stab).

**Keycap as EQ:** each of the 3 keycap profiles maps to a `BiquadFilterNode` config:

- **Thin ABS (bright/clacky):** highshelf +3–5dB at ~4kHz, slight peak at ~6kHz
- **Thick PBT (neutral/thocky):** lowshelf +2dB at ~200Hz, highshelf -3dB at ~5kHz
- **Thick PBT tall profile (deep/vintage thock):** lowshelf +4dB at ~150Hz, highshelf -6dB at ~5kHz, gentle lowpass cutoff ~8kHz

Tune by ear once we have real samples. The numbers above are starting points.

**Anti-machine-gun:** randomize pitch ±2% and onset ±5ms; rotate through 3–5 sample variants per zone if available.

**Web Audio only.** `BiquadFilterNode` is native; no Tone.js dependency yet. Tone.js still deferred to Phase 2 if/when reverb or convolution is needed.

## v0 "done" criteria

The bar for v0 being shippable as a "whoa" demo:

1. One procedural keyboard renders in 3D, rotatable and zoomable.
2. User can swap **switches** (3 options) — base sample changes live.
3. User can swap **keycaps** (3 material/profile options) — visuals change live AND sound shifts via EQ filter (bright / neutral / deep).
4. Typing on the physical keyboard plays the right per-zone sound for the current build.
5. Build state lives in the URL and is shareable as a link.

Explicitly **deferred**:

- Multiple keyboards / catalog
- Auth, accounts, saved builds in DB
- Save/share via Supabase
- Affiliate / commerce links
- Brand-licensed boards
- Other product categories (watches, bikes, etc.)
- Sound synthesis layer (Tone.js EQ/reverb)
- Per-key sample variation beyond zone level
- Mobile/touch
- Photoreal materials / hand-modeled assets

## What's important

- The "whoa" moment: user picks switches, types on their real keyboard, hears the change.
- Sound authenticity at the zone level. If the spacebar sounds like an alpha, that breaks the demo.
- Real-time visual update on part swap. Lag kills the magic.
- Keeping module boundaries clean so generalization is *possible* later, without paying its cost now.

## What's not important

- Photorealism in v0.
- Cross-browser quirks beyond evergreen Chrome/Safari/Firefox.
- Mobile in v0 (typing demo requires a physical keyboard anyway).
- Acoustic simulation accuracy. Perceptual realism is the bar.
- Multi-category platform code in v0. Build keyboard-specific; generalize at category #2.

## Tech stack

- **Frontend:** React + TypeScript + Tailwind, Vite.
- **3D:** React Three Fiber + Drei + Three.js.
- **Audio:** Web Audio API; Tone.js when EQ/reverb shaping is needed.
- **Backend:** none in v0. Supabase reserved for Phase 2 (saved builds, auth, asset storage).
- **Hosting:** Vercel (Phase 2; v0 is local).

## Directory layout (planned)

```
src/
  features/
    keyboard-browser/   Phase 2 (catalog UI)
    keyboard-builder/   v0 (part picker + 3D viewport)
  systems/
    rendering/          R3F scene, camera, materials
    audio/              sample loader, keydown → sample dispatch
  data/
    keyboards/          procedural specs + sample manifests
    parts/              switches, keycaps, cases (data, not models)
  lib/                  URL encoding, layout math, pure helpers
  hooks/
  types.ts
public/
  audio/                sourced sample WAVs (per keyboard, per zone)
```

## Brand / IP posture

- v0 ships **generic, unbranded** keyboards. Real brand names, logos, and likenesses are off-limits until IP is sorted.
- Sourced audio recordings: prefer Creative Commons or own recordings. If sampling from YouTube test videos, treat that as a research/prototype shortcut and replace before any public launch.
- This decision exists to keep the project legally simple while validating the core concept.

## Multi-category extensibility (deferred)

Long-term, the platform should generalize to watches/bikes/PCs/etc. via a Component System + Compatibility Engine + generic Rendering & Sensory engines. **None of that is in v0.** What v0 *does* commit to:

- Module boundaries above (`features/`, `systems/`, `data/`) so a future Component System can be lifted out cleanly.
- Keep keyboard-specific terminology inside `features/keyboard-*` and `data/keyboards/`. Don't leak "keyboard" assumptions into `systems/`.

When category #2 lands, that's when we extract the generic interfaces — not before.

## Known tensions / open questions

- **Sample sourcing & licensing.** Pulling audio from YouTube is fine for prototyping; replacing with own recordings or licensed samples is a prerequisite for any public launch. Track in v0.5/Phase 2.
- **URL-encoded builds vs. growing config.** Hash will get long once part counts grow. Switch to short-code + Supabase lookup when this becomes painful.
- **Phantom typing** during the demo (user holds Shift, autorepeat fires) — needs a debounce or rate limit on the audio dispatcher to avoid the machine-gun problem.
- **Browser keyboard event coverage** is reliable for keydown/keyup but key labels vary across layouts (US/AU/UK). Map by `event.code` not `event.key`.

## Notes for future Claude sessions

- v0 is procedural + sample-based + client-only. If a suggestion requires a backend, licensed model, or brand name, it's out of v0 scope — call that out and ask.
- The "whoa" demo is the product. Features that don't make typing-on-your-real-keyboard feel more real are deferred.
- Don't generalize to multi-category until category #2 actually arrives. The spec describes the *long-term* vision, not the v0 codebase.

# KeyboardLab

Interactive 3D mechanical-keyboard simulator. Build your own keyboard, type on your physical one, and hear what the virtual one would sound like.

> **Status:** v0 (proof of concept). One procedural keyboard, swappable switches and keycaps, sample-based per-zone sound, URL-encoded build sharing. No backend.

## Vision

Two modes (long-term):

1. **Browse** — explore curated keyboards in 3D, hear their sound profile, follow links to buy.
2. **Build** — assemble a custom keyboard from parts; visuals and sound update live; share via link.

The killer interaction: type on your **physical** keyboard, and the browser plays back the simulated sound of the **virtual** keyboard you've selected or built. Per-zone sounds (alphas, spacebar, mods) so it actually feels like *that* board.

Long-term ambition is a generic enthusiast-product simulator (watches, bikes, PCs, cameras, audio gear). v0 is keyboard-only.

## v0 done criteria

1. One procedural keyboard renders in 3D, rotatable and zoomable.
2. User can swap **switches** (3 options), and the sound changes live.
3. User can swap **keycaps** (3 options), and the visuals change live.
4. Typing on the physical keyboard plays the right per-zone sound for the current build.
5. Build state lives in the URL and is shareable as a link.

Everything else (catalog, auth, saved builds, brand-licensed boards, other product categories, mobile, photoreal materials) is deferred.

## Tech stack

- **Frontend:** React + TypeScript + Tailwind, Vite
- **3D:** React Three Fiber + Drei + Three.js
- **Audio:** Web Audio API (Tone.js layer added in Phase 2)
- **Backend:** none in v0

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Verify

```bash
npm run typecheck
npm run build
```

No test runner yet.

## Project structure

```
src/
  features/
    keyboard-builder/   v0 (part picker + 3D viewport)
  systems/
    rendering/          R3F scene, camera, materials
    audio/              sample loader, keydown -> sample dispatch
  data/
    keyboards/          procedural specs + sample manifests
    parts/              switches, keycaps, cases (data, not models)
  lib/                  URL encoding, layout math, pure helpers
  types.ts
public/
  audio/                sourced sample WAVs (per keyboard, per zone)
```

## Project rules

See [`CLAUDE.md`](./CLAUDE.md) for the operating contract and [`.claude/rules/architecture.md`](./.claude/rules/architecture.md) for big-picture decisions (3D model strategy, sound strategy, deferred items, multi-category extensibility posture).

## License

TBD.

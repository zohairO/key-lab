# Decisions

Date-stamped architectural and product decisions. Most recent at top.

---

## 2026-05-09

- **Project name: KeyboardLab.** Project root: `/Users/zohairoomatia/Desktop/projects/key-lab`.
- **Vision recorded.** Two-mode product (Browse curated keyboards / Build your own custom). Killer interaction: user types on physical keyboard, hears simulated sound of selected virtual keyboard, with per-zone sound differentiation (alphas vs space vs mods). Long-term ambition: generic enthusiast-product simulator (watches, bikes, PCs). v0 is keyboard-only.
- **v0 scope chosen: smallest possible POC.** One procedural keyboard, 3 switches, 3 keycap sets, live visual + sound swap, type-on-physical-keyboard demo, URL-encoded sharing. No auth, no DB, no catalog, no backend.
- **3D model strategy: procedural for v0.** Keyboards generated from a layout spec + parameterised case + instanced keycaps. Free, scales to "build your own", stylized but recognizable. **Why:** licensed models ($10–$200 each on Sketchfab/TurboSquid/CGTrader) don't scale to per-part swapping, and hand-modeling in Blender is out of scope for solo dev. Photoreal hand-modeled assets are Phase 2 for catalog "hero" boards only. **How to apply:** when implementing the viewer, build the case mesh from primitives (RoundedBox etc.) and instance keycaps from a single mesh + per-key transforms. Don't suggest buying models.
- **Sound strategy: sample-based, sourced from YouTube/free sources.** Per-zone (alpha, space, tab/enter/backspace, modifiers). Anti-machine-gun: ±2% pitch + ±5ms onset randomization, 3–5 sample variants per zone if available. **Why:** synthesis is hard to make sound real; samples are authentic out of the box; sourcing from keyboard test videos on YouTube is realistic for prototyping. **How to apply:** Tone.js EQ/reverb/synth layer is deferred to Phase 2. v0 just plays the right sample for the right zone.
- **One sound per keyboard is NOT acceptable.** Spacebar/tab/modifier zones must sound different. v0 minimum: 4 zones (alphas, space, tab+enter+backspace, modifiers).
- **Build sharing: URL-encoded for v0.** No backend. Build state serializes to URL hash. Switch to Supabase + short codes only when hash gets painful.
- **Brand/IP posture: generic unbranded keyboards in v0.** No NuPhy/Keychron/Razer names or likenesses. **Why:** keeps legal surface small while validating the concept; procedural generation forces this naturally. **How to apply:** name boards "60% aluminum case", "TKL plastic case", etc. Don't suggest licensed brand integrations until IP is sorted.
- **Audio sourcing for v0:** YouTube test recordings acceptable as a prototyping shortcut. Replace with own recordings or licensed samples before any public launch.
- **No premature multi-category generalization.** The long-term vision (watches, bikes, PCs) is real, but v0 stays keyboard-specific with clean module boundaries (`features/`, `systems/`, `data/`). Generic Component/Compatibility/Sensory engines are extracted at category #2, not earlier. **Why:** premature abstraction is the most common failure mode for platforms like this. **How to apply:** keyboard terminology stays inside `features/keyboard-*` and `data/keyboards/`; don't leak it into `systems/`. But don't invent generic interfaces just because the long-term plan calls for them.
- **Tech stack confirmed:** React + TypeScript + Tailwind + Vite. R3F + Drei + Three.js for 3D. Web Audio API + (later) Tone.js for audio. Supabase + Vercel reserved for Phase 2.
- **Key event mapping:** use `event.code` (physical key position), not `event.key` (label varies by layout).
- **Claude scaffolding set up.** `.claude/rules/architecture.md` + `.claude/memory/{profile,preferences,decisions,sessions}.md` + root `CLAUDE.md`, mirroring the subscription-sentry structure. Update-as-you-go memory protocol mandated.
- **No `Co-Authored-By: Claude` trailer on commits.** User reversed the subscription-sentry default; commits in this repo are user-authored only. **How to apply:** never append a Claude co-author trailer to commit messages in this project.

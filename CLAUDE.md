# KeyboardLab — CLAUDE.md

Interactive 3D mechanical-keyboard simulator. Browse curated keyboards or build your own; type on your physical keyboard and hear the simulated sound of the virtual one. Web app, solo passion project, long-term ambition is a generic enthusiast-product simulation platform (watches, bikes, PCs, etc.).

## Before writing any code

1. Read `.claude/rules/architecture.md` once per session — it owns the big-picture decisions (v0 scope, the "whoa moment" definition, 3D model strategy, sound strategy, multi-category extensibility rules, deferred items).
2. Confirm the current phase. v0 = smallest thing that proves the concept. Don't build Phase 2/3/4 features until v0 ships and someone says "whoa."

## Run it

Not yet bootstrapped. When set up:

```bash
npm install
npm run dev       # vite dev server
```

## Verify

```bash
npm run typecheck
npm run build
```

No test runner yet. First targets when added: sound-engine layering math, compatibility-engine rules.

## Non-negotiable rules (v0)

- **Procedural 3D for v0.** No purchased/licensed models. A keyboard is generated from a layout spec + parameterised case mesh + instanced keycaps. Hand-modeled assets are Phase 2.
- **Generic, unbranded keyboards in v0.** "60% aluminum case", "TKL plastic case" — no NuPhy/Keychron/Razer names or likenesses until brand/IP is sorted.
- **Per-zone sound, not per-board.** Alphas, spacebar, tab/enter/backspace, modifiers all sound different on real boards. v0 must mimic that.
- **Sound source = real recordings.** Sample-based, sourced from YouTube/free sources. Tone.js synthesis is a later option.
- **No backend in v0.** No Supabase, no auth, no DB. Builds are URL-encoded so they're shareable without a server.
- **No premature generalization.** Keep code keyboard-specific but with clean module boundaries. We generalize when a second category lands, not before. Premature abstraction is how platforms like this die.
- **No real brand names, logos, or trademarks** in code, UI, or assets without revisiting architecture.md.

## Commit style

- Commit frequently — every logical chunk, not batched.
- Prefix in conventional style (`feat:`, `fix:`, `chore:`, `docs:`).
- HEREDOC for multi-line messages.
- **Do NOT add a `Co-Authored-By: Claude` trailer.** Commits are authored by the user only.

## Scope discipline

v0 is exactly the criteria in architecture.md § "v0 done criteria". Anything beyond — auth, sharing-via-DB, catalog beyond 1 board, second product category, brand integrations, marketplace — is deferred. Confirm before building outside v0.

## Rules directory

```
.claude/rules/
  architecture.md    big picture: what, why, not-what, deferred items
```

`conventions.md`, `audio.md`, `rendering.md` may be added as the project grows.

## When in doubt

- The "whoa" moment wins over internal elegance. If a refactor doesn't make the demo more impressive, defer it.
- Ask before adding a runtime dependency, a new top-level system, or a feature that spans both Browse and Build modes.
- Re-read architecture.md if a decision feels load-bearing and context is thin.

### Auto-Update Memory (MANDATORY)

**Update memory files AS YOU GO, not at the end.** When you learn something new, update immediately.

| Trigger | Action |
|---------|--------|
| User shares a fact about themselves | → Update (or create if it doesn't yet exist) `.claude/memory/memory-profile.md` |
| User states a preference | → Update (or create if it doesn't yet exist) `.claude/memory/memory-preferences.md` |
| A decision is made | → Update (or create if it doesn't yet exist) `.claude/memory/memory-decisions.md` with date |
| Completing substantive work | → Add to (or create if it doesn't yet exist) `.claude/memory/memory-sessions.md` |

**Skip:** Quick factual questions, trivial tasks with no new info.

**DO NOT ASK. Just update the files when you learn something.**

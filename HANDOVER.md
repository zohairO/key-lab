# KeyboardLab — Session Handover

Read this first if you're picking up the project mid-flight. Tells you what's
shipped, what's broken, where to find each tweakable value, and what's next.

For the *long-term* product vision and architectural rules, see
[`.claude/rules/architecture.md`](./.claude/rules/architecture.md). This file
is the operational state.

---

## 1. What this app is (1 sentence)

Browser-based 3D mechanical-keyboard simulator: pick a board / layout / switch
pack / keycap profile, type on your physical keyboard, see and hear the
virtual keyboard react in real time. Solo passion project, repo is
[zohairO/key-lab](https://github.com/zohairO/key-lab) (private).

## 2. What's shipped

### Engine
- **Layouts:** 60% ANSI · 65% ANSI · 75% ANSI · TKL — each in Win + Mac variants.
  75% F-row is K2-accurate (PrtSc / Del / LightEffect, not TKL-style PrtSc /
  ScrLk / Pause).
- **Board types:** flat (chiclet) · low-profile · mechanical — drives plate
  visibility, case dims, and forces a keycap shape for non-mech boards.
- **Keycap shapes (geometry):** cherry · oem · sa · mt3 · dsa · xda + two
  board-forced shapes (chiclet, low-profile-mech). Each with per-shape height,
  taper, dish depth, and per-row sculpt tilt.
- **Keycap colorway (visual material):** cream · dark · vintage. Independent
  axis from shape.
- **Switch packs (audio):** Cherry MX Brown PBT · Holy Pandas · Cherry MX
  Blue PBT · Kailh Box White. Three formats supported: kbsim multi-file,
  Mechvibes sprite, Mechvibes per-key multi.
- **Plate materials:** FR4 · Polycarbonate · Aluminum · Brass. Affects plate
  mesh color/finish AND audio EQ (extra BiquadFilter chain after keycap EQ).
- **Audio engine:** per-key sample dispatch, pitch/onset jitter, keycap EQ +
  plate EQ in the chain. Keydown plays full sample at 100% volume; **keyup
  plays the same sample skipped past the bottom-out transient + heavy
  high-pass + presence boost + 40% volume**, so press and release sound
  qualitatively different. See "Open issues" — user feedback on this is mixed.

### UI
- **Workshop tooling aesthetic:** opaque dark/light surface, hairline borders,
  no glass/blur. Light/dark theme toggle in panel header. Theme + state
  persisted in URL hash.
- **Side panel with hamburger toggle:** sections for Presets · Board ·
  Switches · Keycaps · Plate · Settings (placeholder). Compact chip-row
  selectors for low-cardinality choices (layout/style/board-type, colorway,
  profile, plate material) and vertical option lists for high-info choices
  (presets, switches).
- **Cross-functionality:** every dimension is independent. TKL + Mac + Flat
  + Brass plate + Tall-PBT colorway is a valid combo. Presets are starting
  shortcuts; you can remix freely.
- **Applied-preset model:** clicking a preset sets `appliedPresetId` and
  applies its build. The preset's visual identity (case color, two-tone caps,
  accent keys) **persists across setting changes** until "Custom build" is
  clicked or another preset is applied. This was a fix for "Mac K2" losing
  its colorway.
- **Per-key visual feedback:** every keypress dips the matching keycap
  (animated, asymmetric damping) and lights up an emissive blue.
- **URL state:** every build dimension serializes to `#` hash. Share button
  copies the current URL. `?layout=...&style=...&board=...&pack=...&keycap=...&shape=...&plate=...&theme=...&preset=...`.

### Presets (6 total)
- Magic Keyboard (flat / TKL / Mac / Cherry Brown sample / aluminum plate)
- NuPhy Air75 (low-profile / 75% / Mac)
- Keychron K2 / Brown (mechanical / 75% / Win / two-tone PBT + orange Esc)
- GMMK Pro / Holy Pandas (mechanical / 75% / Win)
- Drop CTRL / Box White (mechanical / TKL / Win)
- Budget Clicky (mechanical / 60% / Cherry Blue)
- Vintage SA (mechanical / 60% / SA caps / brass plate)

Each preset can have `caseColorOverride`, `capColorOverride`, `labelColorOverride`,
`zoneColors` (per-Zone overrides — used for K2 two-tone), `keyColors` (per-key
overrides — used for K2 orange Esc).

## 3. Open issues / known gaps

### 🔴 Keycap geometry still reads flat to the user
Despite multiple iterations (chamfer band at top 15% of height, top 35%
smaller than bottom, 50%-deeper dish depths, multi-material per face with
darkened sides), the user still says the keycaps "look flat" and "boxy."

**Status:** parked. User has the file paths to play with values themselves
(see `keycap-shapes.ts` + `keycap-geometry.ts` + `Keycap.tsx`). The
fundamental limit is procedural geometry without normal/displacement maps.
**Next escalation options if revisited:**
1. Stronger scene lighting contrast (revealing the geometry that's already there)
2. Edge wireframe overlay (closer to kbs.im's vector look)
3. Import real GLB keycap models from Blender/Sketchfab (abandons procedural)

### 🟡 Keyup audio is synthetic, not authentic
Current: take the press sample, skip first 30ms, apply heavy high-pass +
presence boost, drop to 40% volume. Sounds different from press, but it's
shaped from the same recording. **Real fix:** source packs that ship
`release/` folders (Mechvibes config supports `*-up` overrides). User hasn't
sourced these — they're rare.

### 🟡 No linear switch audio
All 4 packs are tactile or clicky. **Missing:** Cherry MX Red, Gateron
Yellow / Oil Kings, or any linear. This is the biggest audio gap. User has
tried to source one but hasn't found a kbsim/Mechvibes pack they liked.

### 🟡 K2-specific recording missing
The K2 preset uses generic Cherry Brown samples. For full audio authenticity
the K2 would need its own pack.

### 🟢 Minor
- `multi-file` format with row-based fallback (Holy Pandas) returns null for
  TKL/75% row 5 since the pack only has rows 0-4. Falls silent on bottom row.
  Fix: extend `resolveSlice` to clamp `key.y` to `rows.length - 1`.

## 4. Where to find each tweakable value

```
src/data/
├── keycap-shapes.ts         height, topShrinkFactor, dishDepth, sculpt[] per profile
│                            + SPACEBAR_BULGE_FACTOR (-0.35) for convex spacebars
├── board-types.ts           forceKeycapShape, plate dims, case dims, keyGap per board type
├── keycap-profiles.ts       capColor, labelColor, caseColor per colorway
├── plate-materials.ts       PLATE_VISUAL (colour/roughness/metalness) + PLATE_EQ filter chains
├── presets.ts               preset definitions + visual overrides
└── layouts/
    ├── build-layout.ts      shared row→keys builder; empty-code = spacer
    ├── relabel.ts           applyMacLabels — Mac symbol swaps for rows 0-3
    ├── sixty-percent.ts     60% ANSI (Win + Mac variants)
    ├── sixty-five-percent.ts 65% ANSI (Tofu65-style)
    ├── seventy-five-percent.ts 75% ANSI (Keychron K2-style F-row + nav)
    ├── tkl.ts               TKL ANSI (87 keys, gapped F-row, 3-col nav cluster)
    └── index.ts             LAYOUTS registry + resolveLayout(family, style)

src/data/sound-packs/
├── holy-pandas.ts           kbsim multi-file (per-row + key overrides)
├── cherrymx-brown-pbt.ts    Mechvibes sprite (single OGG + offsetMs/durationMs map)
├── cherrymx-blue-pbt.ts     Mechvibes sprite
└── kalih-box-white.ts       Mechvibes per-key multi (one MP3 per scancode)

src/systems/rendering/
├── Scene.tsx                camera position [0,9,13.5], fov 38, ambient/directional intensities
├── Keyboard.tsx             resolves effective shape; renders case, plate, every keycap
├── Keycap.tsx               per-face materials (top brighter, sides darker via darkerSide)
└── keycap-geometry.ts       SHOULDER_T (0.85), SHOULDER_TAPER_T (0.15), cosine bowl formula

src/systems/audio/
├── audio-engine.ts          play(key, action) — keydown/keyup paths, EQ chain, gain
├── sound-pack.ts            SoundPack union, resolveSlice (unifies multi-file + sprite)
├── mechvibes.ts             buildSpritePack, buildMechvibesMultiPack, iohook→event.code map
└── keycap-eq.ts             KEYCAP_EQ per colorway (BiquadFilter chains)

src/ui/                      panel components (workshop tooling style)
├── SidePanel.tsx
├── PanelSection.tsx
├── ChipRow.tsx              compact horizontal pill selector
├── OptionList.tsx           vertical list with radio dot
└── icons.tsx                hairline SVG icons

src/lib/
├── url-state.ts             BuildState + readBuildHash/writeBuildHash
└── key-lookup.ts            buildCodeIndex (event.code → KeyDef)

src/hooks/
├── useAudioEngine.ts        owns the engine, wires keydown+keyup
└── usePressedKeys.ts        tracked Set<event.code>; clears on window blur

docs/
├── audio-sourcing.md        which packs to look for and where
└── switch-pack-recipe.md    how to drop a new pack into the project
```

## 5. How to run / verify

```bash
npm install
npm run dev          # http://localhost:5173, opens automatically
npm run typecheck    # strict TS, no emit
npm run build        # production bundle (warns about 500kB chunks — three.js)
```

No test runner yet.

## 6. Decisions worth remembering

- **Design language: workshop tooling, not consumer-premium.** Solid dark
  panels, hairline borders, no glass / blur / lensing. The app is a tool the
  user *builds* with, not a showroom they browse. This was an explicit user
  preference — see `.claude/memory/memory-preferences.md`.
- **Cross-functionality over preset matching.** Presets are starting points,
  not constraints. User can mix anything (K2 visual + low-profile board +
  Box Whites + Mac TKL is a valid remix). Applied-preset model preserves
  visual identity through customisation; only "Custom build" clears it.
- **Audio resolution path is unified.** Multi-file (per-row + overrides),
  sprite (offset/duration), and multi-key (per-scancode files) all flow
  through `resolveSlice(pack, key)`. Adding a new format = one new builder
  in `mechvibes.ts`.
- **No backend.** State lives in the URL hash. Sharing requires no server.
  Supabase/auth/saved-builds are deferred to Phase 2.
- **No real brand names in code/UI without revisiting architecture.** Preset
  names like "Keychron K2 / Brown" are the closest we get; visual overrides
  approximate the real product. Brand integrations/affiliate links =
  Phase 2.
- **No Co-Authored-By trailer on commits.** User authored only.

## 7. What's next (priority order)

1. **Source authentic audio packs** — biggest impact left. Specifically:
   - A linear pack (Cherry MX Red / Gateron Yellow / Oil Kings)
   - Any pack with a `release/` folder so we can do real keyup audio
   - A K2-specific recording for preset authenticity
   The integration is well-documented in `docs/switch-pack-recipe.md`;
   sourcing is the bottleneck.
2. **Volume slider + auto-rotate** — easy UX wins, both can go in the
   Settings panel section (currently a placeholder string).
3. **Save builds to local storage** — name-and-recall, a "My Builds" list in
   the panel.
4. **Decide on keycap depth approach** — if user revisits this:
   stronger lighting → edge wireframe → GLB models. Currently parked.
5. **Phase 2 territory** — Browse mode (catalogue of real keyboards),
   Supabase, auth, affiliate links, photos. None of this is in scope until
   the Build side feels great.

## 8. Files a new session should also read

- [`.claude/rules/architecture.md`](./.claude/rules/architecture.md) — big-picture decisions and the v0 done criteria
- [`.claude/memory/memory-preferences.md`](./.claude/memory/memory-preferences.md) — collaboration style + design-language preference
- [`.claude/memory/memory-decisions.md`](./.claude/memory/memory-decisions.md) — dated log of architectural calls

Most-recent commits (last 10):

```
d8a768c feat(geometry): deeper dish + convex spacebar bulge
e2e418a fix: keyup sounds genuinely different + sharper keycap depth
aa259ed feat: keyup sound + sharper keycap depth (less boxy)
2dd1d36 feat(audio): Kailh Box White pack + Mechvibes per-key format support
c196a3e fix: 75% layout matches the real Keychron K2 layout
edaa524 feat: 75% ANSI layout + preset cleanup to match real products
0f40439 fix: preset identity sticks across setting changes (Mac K2 now works)
30bcb64 feat(ui): chip-row panel — compact, scannable, less clunky
3b9ed75 feat: TKL ANSI layout (87 keys, F-row, nav cluster)
2997641 fix(geometry): real keycap silhouette — chamfered top edge + deep dish
```

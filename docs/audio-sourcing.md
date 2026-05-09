# Audio Sourcing Checklist — v0

## Goal

Get **3 switch sound profiles** × **4 zones** = **12 sample sets** for v0. Each sample set should ideally have 3–5 short variants (50–150ms WAVs) to randomize between, so typing fast doesn't sound like a machine gun.

## The 3 switches (v0)

We pick three that sound *clearly different* from each other so the demo's "switch swap" moment is obvious. Recommended:

| # | Switch | Sound character | Why it's in v0 |
|---|--------|-----------------|----------------|
| 1 | **Cherry MX Brown** (or generic tactile) | Mid, soft, "scratchy" | Default reference. Most common. |
| 2 | **Gateron Oil King / Holy Panda / any "thocky" linear or tactile** | Low, deep, "thock" | The classic "premium" sound enthusiasts chase. Maximum contrast vs. Brown. |
| 3 | **Kailh Box White / Cherry MX Blue** (clicky) | High, sharp, click + ping | Loud and spicy. Instantly recognisable. |

If sourcing is hard, alternates are fine — what matters is *three sounds that are obviously different*.

## The 4 zones (per switch)

| Zone | Keys it covers | Why it sounds different |
|------|----------------|-------------------------|
| `alpha` | Letters A–Z, numbers, symbols | Baseline 1u key sound |
| `space` | Spacebar | Long stabilized key, deeper resonance, often "thockier" |
| `mod` | Shift, Ctrl, Alt/Option, Cmd/Win, Caps, Fn | Stabilized 1.25u–2.75u, slightly lower-pitched than alphas |
| `largekey` | Tab, Enter, Backspace, `\` | Stabilized 1.5u–2u, between alpha and space |

**Total samples to find:** 3 switches × 4 zones × ~3 variants each ≈ **36 short WAVs**.

## Where to source (ranked)

### Tier 1 — Free, license-friendly

1. **Mechvibes sound packs** ([github.com/hainguyents13/mechvibes](https://github.com/hainguyents13/mechvibes), packs at [mechvibes.com](https://mechvibes.com))
   - Already segmented per-key. Often CC-licensed.
   - Search the pack list for the 3 switches above. Look for packs like "Cherry MX Brown", "Holy Panda", "Cherry MX Blue".
   - These are the easiest win. Probably gets us 60% of v0.
2. **Freesound.org** — search "cherry mx brown", "thock keyboard", "blue switch typing". Filter by CC0 / CC-BY.
3. **Pixabay sound effects** — filter "keyboard", license is permissive.
4. **OpenGameArt** — occasional keyboard packs.

### Tier 2 — Permission-required / scraped (prototyping only)

5. **YouTube keyboard sound tests** — channels like *TaeKeyboards*, *Hipyo Tech*, *Keybored*, *Glarses*. Use only as v0 prototyping shortcut. Replace with own/licensed before any public launch.
   - Recording method: download with `yt-dlp`, isolate clean keypress segments in Audacity, export 50–150ms WAVs.
6. **Reddit r/MechanicalKeyboards sound tests** — same caveat.

### Tier 3 — Record your own (best long-term)

7. **DIY recording.** USB condenser mic (Blue Yeti / similar) ~10cm from keyboard, record solo keystrokes per zone, edit in Audacity. Highest fidelity, fully owned.

## Naming + folder convention

Drop files into `public/audio/` using this layout:

```
public/audio/
  cherry-brown/
    alpha-1.wav   alpha-2.wav   alpha-3.wav
    space-1.wav   space-2.wav
    mod-1.wav     mod-2.wav
    largekey-1.wav largekey-2.wav
  thock/
    alpha-1.wav   ...
  blue-clicky/
    alpha-1.wav   ...
```

Switch IDs in code will match the folder names: `cherry-brown`, `thock`, `blue-clicky`.

## Sample format requirements

- **Format:** WAV, 44.1 kHz, mono. (Stereo is fine but doubles file size.)
- **Length:** 50–150 ms. Trim aggressively — nothing past the keyup.
- **Normalization:** peak around -3 dB. Keep relative loudness *between zones* roughly consistent (space slightly louder than alphas, like the real thing).
- **Trim silence** at the start. Even 20ms of leading silence makes typing feel laggy.
- **No reverb tails.** We add reverb in code if needed.

## Quality checklist (per sample)

- [ ] Clean attack — no click/pop from the recording start
- [ ] No background hum, AC noise, or speech
- [ ] Single keypress isolated (no neighbouring keys bleeding in)
- [ ] Length ≤ 150ms
- [ ] Naming matches `<zone>-<n>.wav`

## What I (Claude) can do for you

1. **Write a download script** that pulls a known Mechvibes pack and reorganizes it into our folder structure. Just need the pack URL.
2. **Write an Audacity macro / ffmpeg one-liner** to batch-trim and normalize a folder of raw WAVs.
3. **Build a sample preview page** in the app early so you can audition each sample as you drop it in.

## Order of operations (suggested)

1. Pick the 3 switches from the table above (or your own choices).
2. Hit Mechvibes first — try to fill all 12 zone-sets from there.
3. Anything missing: Freesound / Pixabay / YouTube fallback.
4. Drop into `public/audio/<switch-id>/<zone>-<n>.wav`.
5. Tell me when 1–2 switches are populated and we'll wire up the audio engine against real samples.

We don't need all 36 samples to start coding — even **1 switch × 4 zones × 1 variant = 4 WAVs** is enough to wire up the full audio pipeline and prove the demo. The other 32 can fill in over time.

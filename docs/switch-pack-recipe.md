# Adding a new switch sound pack

We support two pack formats. Both come from the kbsim/Mechvibes ecosystem.

| Format | Source | Example | Steps |
|---|---|---|---|
| **Multi-file** (kbsim) | One MP3 per keyboard row + per-key overrides | Holy Pandas | Copy mp3s to `public/audio/<pack-id>/`, write a `data/sound-packs/<pack-id>.ts` |
| **Sprite** (Mechvibes) | One OGG/MP3 + JSON map of `[offsetMs, durationMs]` per scancode | Cherry MX Brown PBT | Copy OGG to `public/audio/<pack-id>/sound.ogg`, copy `config.json` to `data/sound-packs/<pack-id>.json`, write a tiny `.ts` wrapper |

`src/systems/audio/mechvibes.ts` handles iohook scancode translation for sprite packs — no manual code mapping needed.

## Wanted: priority list

In rough order of unlock value:

| Priority | Pack | Sound character | Unlocks |
|---|---|---|---|
| 1 | **Cherry MX Red** (linear) | Smooth, no bump, full-height clack | First linear; bigger spread of sound options |
| 2 | **Gateron Yellow** or **Oil Kings** (linear premium) | Thocky linear, deeper | Authentic-feeling "thock" presets |
| 3 | **Keychron K Pro Brown** (specifically) | Authentic K2 audio | The K2 preset can finally be truly authentic |
| 4 | **Kailh Box White** (clicky) | Sharper than MX Blue, less ping | Better clicky than Cherry Blue |
| 5 | **Boba U4T** (tactile) | Premium tactile, less marble-y than Pandas | Tactile variety beyond Holy Pandas |
| 6 | **Cherry MX Black** (linear, vintage) | Heavier, slower linear | Heavy-spring linear option |

## Where to get them

- **Mechvibes packs**: https://github.com/hainguyents13/mechvibes — community packs in `data/sound-packs/`
- **kbsim packs**: https://github.com/tplai/kbsim/tree/main/public/packs — multi-file format, often single-pack-per-keyboard
- **Reddit r/MechanicalKeyboards** sound tests — sometimes ship sample packs

License: most kbsim packs are MIT. Most Mechvibes packs are CC0 / CC-BY. Check each pack's LICENSE / README. Holy Pandas is from `tplai/kbsim` (MIT).

## Drop-in steps (sprite pack — preferred)

1. Download the pack folder. It should contain `config.json` and `sound.ogg` (or `.mp3`).
2. Create the public audio folder:
   ```
   public/audio/<pack-id>/
     sound.ogg
   ```
3. Copy the JSON to the source tree:
   ```
   src/data/sound-packs/<pack-id>.json
   ```
4. Add a wrapper file `src/data/sound-packs/<pack-id>.ts`:
   ```ts
   import { buildSpritePack, type MechvibesConfig } from '../../systems/audio/mechvibes';
   import config from './<pack-id>.json';

   export const myNewPack = buildSpritePack({
     id: '<pack-id>',
     name: 'Display Name',
     audioUrl: '/audio/<pack-id>/sound.ogg',
     source: 'Mechvibes',
     config: config as MechvibesConfig,
   });
   ```
5. Register in `src/App.tsx`:
   ```ts
   import { myNewPack } from './data/sound-packs/<pack-id>';
   const PACKS: SoundPack[] = [...existing, myNewPack];
   ```

## Drop-in steps (multi-file pack)

Copy mp3s into `public/audio/<pack-id>/` then mirror the structure of `src/data/sound-packs/holy-pandas.ts` — `rows[]` + `overrides{}` keyed by `KeyboardEvent.code`.

## Audio chain reminder

Each keystroke gets played through:
```
sample → keycap EQ filter → plate EQ filter → master gain → speakers
```

So when you tune EQ presets later (e.g. for an authentic K2 build), you can shape an existing recording without needing a board-specific recording — though a real board recording will always beat any EQ chain.

import type { KeycapProfile } from '../types';

export interface BuildState {
  packId: string;
  keycap: KeycapProfile;
}

const KEYCAP_VALUES: KeycapProfile[] = ['thin-abs', 'thick-pbt', 'tall-pbt'];

function isKeycapProfile(v: string): v is KeycapProfile {
  return (KEYCAP_VALUES as string[]).includes(v);
}

/** Read a partial build state from `window.location.hash`. */
export function readBuildHash(): Partial<BuildState> {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  const out: Partial<BuildState> = {};
  const pack = params.get('pack');
  if (pack) out.packId = pack;
  const keycap = params.get('keycap');
  if (keycap && isKeycapProfile(keycap)) out.keycap = keycap;
  return out;
}

/** Write the full build state into `window.location.hash` (replaceState — no history pollution). */
export function writeBuildHash(state: BuildState): void {
  const params = new URLSearchParams();
  params.set('pack', state.packId);
  params.set('keycap', state.keycap);
  const next = `#${params.toString()}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next);
  }
}

import type { Layout } from '../../types';
import { sixtyPercent } from './sixty-percent';
import { sixtyFivePercent } from './sixty-five-percent';

export const LAYOUTS: Layout[] = [sixtyPercent, sixtyFivePercent];

export const LAYOUT_BY_ID: Record<string, Layout> = Object.fromEntries(
  LAYOUTS.map((l) => [l.id, l]),
);

export function getLayout(id: string): Layout {
  return LAYOUT_BY_ID[id] ?? sixtyPercent;
}

export const DEFAULT_LAYOUT_ID = sixtyPercent.id;

// Re-export individuals for convenience
export { sixtyPercent, sixtyFivePercent };

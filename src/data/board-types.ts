import type { BoardType, KeycapShape } from '../types';

export interface BoardConfig {
  id: BoardType;
  name: string;
  description: string;

  /**
   * Force a specific keycap shape regardless of the user's pick.
   * Flat boards have chiclet keys; low-profile boards have low-profile
   * mechanical keys. Mechanical boards leave this unset and the user picks.
   */
  forceKeycapShape?: KeycapShape;

  // Plate
  plateVisible: boolean;
  plateHeight: number;
  plateColor: string;
  plateInset: number;

  // Case
  caseHeight: number;
  casePadding: number;
  caseRadius: number;

  // Spacing
  keyGap: number;
}

export const BOARD_CONFIG: Record<BoardType, BoardConfig> = {
  flat: {
    id: 'flat',
    name: 'Flat',
    description: 'Magic Keyboard / MX Keys style — chiclet, very thin caps',
    forceKeycapShape: 'chiclet',
    plateVisible: false,
    plateHeight: 0,
    plateColor: '#1a1a1c',
    plateInset: 0.15,
    caseHeight: 0.28,
    casePadding: 0.25,
    caseRadius: 0.14,
    keyGap: 0.05,
  },
  'low-profile': {
    id: 'low-profile',
    name: 'Low Profile',
    description: 'Semi-mechanical — short-travel (Keychron K LP, NuPhy Air)',
    forceKeycapShape: 'low-profile-mech',
    plateVisible: true,
    plateHeight: 0.04,
    plateColor: '#1a1a1c',
    plateInset: 0.12,
    caseHeight: 0.34,
    casePadding: 0.3,
    caseRadius: 0.12,
    keyGap: 0.06,
  },
  mechanical: {
    id: 'mechanical',
    name: 'Mechanical',
    description: 'Standard Cherry MX — sculpted caps on a visible plate',
    // No forceKeycapShape — user picks Cherry/OEM/SA/MT3/DSA/XDA
    plateVisible: true,
    plateHeight: 0.08,
    plateColor: '#161618',
    plateInset: 0.12,
    caseHeight: 0.45,
    casePadding: 0.4,
    caseRadius: 0.18,
    keyGap: 0.07,
  },
};

export const BOARD_TYPE_OPTIONS: BoardType[] = ['flat', 'low-profile', 'mechanical'];

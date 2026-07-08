export type NavItemId = 'home' | 'search' | 'characters' | 'settings' | 'profile' | 'alerts';

interface NavTier {
  left: NavItemId[];
  right: NavItemId[];
}

// Home and Alerts are the permanent outer anchors; each wider tier inserts
// one more item on each side, moving inward from those anchors, so the
// total item count (wings*2 + 1 for the center Add button) stays odd and
// symmetric around it at every screen size.
const NAV_TIERS: Record<number, NavTier> = {
  1: { left: ['home', 'characters'], right: ['settings', 'profile'] },
  2: { left: ['home', 'characters'], right: ['settings', 'profile'] },
  3: { left: ['home', 'characters'], right: ['settings', 'profile'] },
};

const MAX_WINGS = 3;

export const getNavTier = (wings: number): NavTier => NAV_TIERS[Math.min(Math.max(wings, 1), MAX_WINGS)];

export const getNavWingCountForWidth = (width: number): number => {
  if (width < 380) return 1;
  if (width < 640) return 2;
  return 3;
};

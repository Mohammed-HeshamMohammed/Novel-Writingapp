import React from 'react';
import { Home, Search, Plus, X, Users, Settings, User, type LucideIcon } from 'lucide-react';
import NotificationsDropdown from './NotificationCenter';
import { getThemeStyles } from '../utils/themeUtils';
import { useWindowWidth } from '../../../shared/hooks/useWindowWidth';
import { getNavTier, getNavWingCountForWidth, type NavItemId } from './data/bottomNavTiers';
import type { Theme } from '../../../shared/types/story';

interface MobileBottomNavProps {
  theme: Theme;
  showMobileSearch: boolean;
  onToggleSearch: () => void;
  onNewStoryClick: () => void;
  onProfileClick?: () => void;
  onMyCharactersClick?: () => void;
  onSettingsClick?: () => void;
  notifications?: Array<{
    id: string;
    type: 'comment' | 'like' | 'follow' | 'story' | 'system' | 'unlike' | 'unfollow' | 'loved';
    title: string;
    message: string;
    time: string;
    read: boolean;
  }>;
  onNotificationClick: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onClearAllNotifications: () => void;
  onNotificationSettingsClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  theme,
  showMobileSearch,
  onToggleSearch,
  onNewStoryClick,
  onProfileClick,
  onMyCharactersClick,
  onSettingsClick,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
  onClearAllNotifications,
  onNotificationSettingsClick,
}) => {
  const styles = getThemeStyles(theme);
  const width = useWindowWidth();
  const tier = getNavTier(getNavWingCountForWidth(width));

  const itemDefs: Partial<Record<NavItemId, { icon: LucideIcon; label: string; onClick?: () => void; active?: boolean }>> = {
    home: { icon: Home, label: 'Home', active: true },
    search: {
      icon: showMobileSearch ? X : Search,
      label: showMobileSearch ? 'Close search' : 'Search',
      onClick: onToggleSearch,
    },
    characters: { icon: Users, label: 'Characters', onClick: onMyCharactersClick },
    profile: { icon: User, label: 'Profile', onClick: onProfileClick },
    settings: { icon: Settings, label: 'Settings', onClick: onSettingsClick },
  };

  const renderItem = (id: NavItemId) => {
    if (id === 'alerts') {
      return (
        <div key="alerts" className="flex-1 flex flex-col items-center justify-center gap-1">
          <NotificationsDropdown
            theme={theme}
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onMarkAllRead={onMarkAllNotificationsRead}
            onClearAll={onClearAllNotifications}
            onSettingsClick={onNotificationSettingsClick}
            openUpward
          />
          <span className={`text-[10px] font-medium ${styles.textSecondary}`}>Alerts</span>
        </div>
      );
    }

    const item = itemDefs[id];
    if (!item) return null;
    const Icon = item.icon;

    return (
      <button
        key={id}
        type="button"
        onClick={item.onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg ${
          item.active ? 'text-blue-500' : styles.textSecondary
        }`}
        aria-label={item.label}
        aria-current={item.active ? 'page' : undefined}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[10px] font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <nav
      className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t ${styles.nav} pb-[env(safe-area-inset-bottom)]`}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tier.left.map(renderItem)}

        <div className="flex-1 flex items-center justify-center">
          <button
            type="button"
            onClick={onNewStoryClick}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg -translate-y-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Create New Story"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {tier.right.map(renderItem)}
      </div>
    </nav>
  );
};

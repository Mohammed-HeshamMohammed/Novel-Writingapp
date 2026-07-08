import React from 'react';
import { Home, Search, Plus, X, Users, Settings, User, type LucideIcon } from 'lucide-react';
import NotificationsDropdown from './NotificationCenter';
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
  const width = useWindowWidth();
  const tier = getNavTier(getNavWingCountForWidth(width));

  const itemDefs: Partial<Record<NavItemId, { icon: LucideIcon; label: string; onClick?: () => void; active?: boolean }>> = {
    home: { icon: Home, label: 'Home', active: true },
    search: {
      icon: showMobileSearch ? X : Search,
      label: showMobileSearch ? 'Close search' : 'Search',
      onClick: onToggleSearch,
      active: showMobileSearch,
    },
    characters: { icon: Users, label: 'Characters', onClick: onMyCharactersClick },
    profile: { icon: User, label: 'Profile', onClick: onProfileClick },
    settings: { icon: Settings, label: 'Settings', onClick: onSettingsClick },
  };

  const renderItem = (id: NavItemId) => {
    if (id === 'alerts') {
      return (
        <div key="alerts" className="relative flex items-center justify-center flex-shrink-0">
          <NotificationsDropdown
            theme={theme}
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onMarkAllRead={onMarkAllNotificationsRead}
            onClearAll={onClearAllNotifications}
            onSettingsClick={onNotificationSettingsClick}
            openUpward
          />
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
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 ${
          item.active 
            ? 'bg-blue-600 text-white shadow-md' 
            : theme === 'dark'
              ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-transparent'
        }`}
        aria-label={item.label}
        aria-current={item.active ? 'page' : undefined}
      >
        <Icon className="w-5 h-5" />
        <span className="sr-only">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
      <nav
        className={`flex items-center justify-center gap-1.5 rounded-full border p-1.5 shadow-lg max-w-full backdrop-blur-md transition-all duration-300 ${
          theme === 'dark'
            ? 'border-gray-800 bg-gray-950/85 shadow-black/40 text-white'
            : 'border-gray-200 bg-white/85 shadow-gray-200/40 text-gray-900'
        }`}
      >
        {tier.left.map(renderItem)}

        <button
          type="button"
          onClick={onNewStoryClick}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
          aria-label="Create New Story"
        >
          <Plus className="w-5 h-5" />
        </button>

        {tier.right.map(renderItem)}
      </nav>
    </div>
  );
};

import React from 'react';
import { Home, Search, Plus, X } from 'lucide-react';
import NotificationsDropdown from './NotificationCenter';
import { getThemeStyles } from '../utils/themeUtils';
import type { Theme } from '../../../shared/types/story';

interface MobileBottomNavProps {
  theme: Theme;
  showMobileSearch: boolean;
  onToggleSearch: () => void;
  onNewStoryClick: () => void;
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
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
  onClearAllNotifications,
  onNotificationSettingsClick,
}) => {
  const styles = getThemeStyles(theme);

  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-50 border-t ${styles.nav} pb-[env(safe-area-inset-bottom)]`}
    >
      <div className="flex items-center justify-around h-16 px-2">
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-blue-500`}
          aria-label="Home"
          aria-current="page"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          type="button"
          onClick={onToggleSearch}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg ${styles.textSecondary}`}
          aria-label={showMobileSearch ? 'Close search' : 'Search stories'}
        >
          {showMobileSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          <span className="text-[10px] font-medium">Search</span>
        </button>

        <button
          type="button"
          onClick={onNewStoryClick}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg -translate-y-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Create New Story"
        >
          <Plus className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center justify-center gap-1 p-2">
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
      </div>
    </nav>
  );
};

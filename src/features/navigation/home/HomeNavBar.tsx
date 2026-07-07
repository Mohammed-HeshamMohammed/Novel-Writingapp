import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ThemeSwitch } from '../shared/ThemeSwitch';
import { TooltipButton } from '../shared/TooltipButton';
import { getThemeStyles } from '../utils/themeUtils';
import { NewStoryModal } from './NewStoryModal';
import UpdatedUserProfileDropdown from './UserProfileDropdown';
import NotificationsDropdown from './NotificationCenter';
import { MobileBottomNav } from './MobileBottomNav';
import type { Theme } from '../../../shared/types/story';

interface HomeNavBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onNewStory?: () => void;
  onThemeChange?: (theme: Theme) => void;
  onNotificationClick?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onClearAllNotifications?: () => void;
  onNotificationSettingsClick?: () => void;
  onProfileClick?: () => void;
  onEditProfileClick?: () => void;
  onAddMemberClick?: () => void;
  onSettingsClick?: () => void;
  onDeleteAccountClick?: () => void;
  onTeamAccessClick?: () => void;
  onLogoutClick?: () => void;
  onCreateCharacterClick?: () => void;
  onPricingClick?: () => void;
  onMyCharactersClick?: () => void;
  onMyChatsClick?: () => void;
  onAccountClick?: () => void;
  onMyStoriesClick?: () => void;
  onCreateStoryClick?: () => void;
  theme: Theme;
  userName?: string;
  userAvatar?: string;
  userPlan?: 'free' | 'premium' | 'pro';
  userStatus?: 'online' | 'idle' | 'dnd' | 'invisible';
  notifications?: Array<{
    id: string;
    type: 'comment' | 'like' | 'follow' | 'story' | 'system' | 'unlike' | 'unfollow' | 'loved';
    title: string;
    message: string;
    time: string;
    read: boolean;
  }>;
  themeToggleDebounceMs?: number;
}

export const HomeNavBar: React.FC<HomeNavBarProps> = ({
  searchQuery = '',
  onSearchChange,
  onNewStory,
  onThemeChange,
  onNotificationClick,
  onMarkAllNotificationsRead,
  onClearAllNotifications,
  onNotificationSettingsClick,
  onProfileClick,
  onEditProfileClick,
  onAddMemberClick,
  onSettingsClick,
  onDeleteAccountClick,
  onTeamAccessClick,
  onLogoutClick,
  onCreateCharacterClick,
  onPricingClick,
  onMyCharactersClick,
  onMyChatsClick,
  onAccountClick,
  onMyStoriesClick,
  onCreateStoryClick,
  theme,
  userName,
  userAvatar,
  userPlan,
  userStatus,
  notifications,
  themeToggleDebounceMs = 300,
}) => {
  const [showNewStoryModal, setShowNewStoryModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const styles = getThemeStyles(theme);

  const handleAction = (action?: () => void) => {
    try {
      action?.();
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    try {
      onThemeChange?.(newTheme);
    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  const handleNewStoryClick = () => {
    try {
      setShowNewStoryModal(true);
    } catch (error) {
      console.error('Error opening new story modal:', error);
    }
  };

  const handleNewStorySubmit = () => {
    try {
      onNewStory?.();
      setShowNewStoryModal(false);
    } catch (error) {
      console.error('Error creating new story:', error);
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 rounded-full shadow-lg ${styles.nav} border max-w-4xl w-[95vw]`}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center h-14 relative justify-between gap-2">
            <div className="flex items-center flex-shrink-0">
              <h1 className={`text-lg font-bold ${styles.text} hidden sm:block`}>Novelist</h1>
              <h1 className={`text-lg font-bold ${styles.text} sm:hidden`}>N</h1>
            </div>

            <div className="hidden lg:block flex-1 max-w-sm mx-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${styles.textSecondary} w-4 h-4`} />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-full ${styles.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-1 lg:space-x-2">
              <TooltipButton
                tooltip="Create New Story"
                onClick={handleNewStoryClick}
                className="hidden lg:inline-flex items-center px-3 py-1.5 text-sm font-medium border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                theme={theme}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Story</span>
              </TooltipButton>

              {onThemeChange && (
                <ThemeSwitch
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  debounceMs={themeToggleDebounceMs}
                />
              )}

              <div className="hidden lg:block">
                <NotificationsDropdown
                  theme={theme}
                  notifications={notifications}
                  onNotificationClick={(id: string) => handleAction(() => onNotificationClick?.(id))}
                  onMarkAllRead={() => handleAction(onMarkAllNotificationsRead)}
                  onClearAll={() => handleAction(onClearAllNotifications)}
                  onSettingsClick={() => handleAction(onNotificationSettingsClick)}
                />
              </div>

              <UpdatedUserProfileDropdown
                theme={theme}
                userName={userName}
                userAvatar={userAvatar}
                userPlan={userPlan}
                currentStatus={userStatus}
                onProfileClick={() => handleAction(onProfileClick)}
                onEditProfileClick={() => handleAction(onEditProfileClick)}
                onAddMemberClick={() => handleAction(onAddMemberClick)}
                onSettingsClick={() => handleAction(onSettingsClick)}
                onDeleteAccountClick={() => handleAction(onDeleteAccountClick)}
                onTeamAccessClick={() => handleAction(onTeamAccessClick)}
                onLogoutClick={() => handleAction(onLogoutClick)}
                onCreateCharacterClick={() => handleAction(onCreateCharacterClick)}
                onPricingClick={() => handleAction(onPricingClick)}
                onMyCharactersClick={() => handleAction(onMyCharactersClick)}
                onMyChatsClick={() => handleAction(onMyChatsClick)}
                onAccountClick={() => handleAction(onAccountClick)}
                onMyStoriesClick={() => handleAction(onMyStoriesClick)}
                onCreateStoryClick={() => handleAction(onCreateStoryClick)}
              />
            </div>
          </div>
        </div>
      </nav>

      {showMobileSearch && (
        <div className="lg:hidden fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-[95vw] max-w-4xl">
          <div className={`rounded-full shadow-lg ${styles.nav} border px-4 py-2.5`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${styles.textSecondary} w-4 h-4`} />
              <input
                type="text"
                autoFocus
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 text-sm border-none bg-transparent focus:outline-none ${styles.text} ${theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              />
            </div>
          </div>
        </div>
      )}

      <div className="h-20"></div>

      <MobileBottomNav
        theme={theme}
        showMobileSearch={showMobileSearch}
        onToggleSearch={() => setShowMobileSearch(prev => !prev)}
        onNewStoryClick={handleNewStoryClick}
        onProfileClick={() => handleAction(onProfileClick)}
        onMyCharactersClick={() => handleAction(onMyCharactersClick)}
        onSettingsClick={() => handleAction(onSettingsClick)}
        notifications={notifications}
        onNotificationClick={(id: string) => handleAction(() => onNotificationClick?.(id))}
        onMarkAllNotificationsRead={() => handleAction(onMarkAllNotificationsRead)}
        onClearAllNotifications={() => handleAction(onClearAllNotifications)}
        onNotificationSettingsClick={() => handleAction(onNotificationSettingsClick)}
      />

      {showNewStoryModal && (
        <NewStoryModal
          onClose={() => setShowNewStoryModal(false)}
          onSubmit={handleNewStorySubmit}
        />
      )}
    </>
  );
};
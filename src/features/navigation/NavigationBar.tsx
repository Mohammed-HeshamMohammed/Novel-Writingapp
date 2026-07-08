import React, { useState, useEffect } from 'react';
import { HomeNavBar } from './home/HomeNavBar';
import { EditorNavBar } from './editor/EditorNavBar';
import { getStoredTheme, storeTheme } from './utils/themeUtils';
import type { WritingMode, Theme, UserPlanType, UserStatus } from '../../shared/types/story';

interface NavigationBarProps {
  mode: 'home' | 'editor';
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onNewStory?: () => void;
  onBack?: () => void;
  onSave?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onWritingModeChange?: (mode: WritingMode) => void;
  onThemeChange?: (theme: Theme) => void;
  writingMode?: WritingMode;
  theme?: Theme;
  isSaving?: boolean;
  isExporting?: boolean;
  isImporting?: boolean;
  leftSidebarTabs?: string[];
  rightSidebarTabs?: string[];
  onSidebarTabsChange?: (sidebar: 'left' | 'right', tabs: string[]) => void;
  leftSectionOffset?: number;
  rightSectionOffset?: number;
  editorThemeTogglePosition?: number;
  themeToggleDebounceMs?: number;
  userName?: string;
  userAvatar?: string;
  userPlan?: UserPlanType;
  userStatus?: UserStatus;
  notifications?: Array<{
    id: string;
    type: 'comment' | 'like' | 'follow' | 'story' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
  }>;
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
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ 
  mode, 
  theme: propTheme, 
  onThemeChange,
  ...props 
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(propTheme || getStoredTheme());

  useEffect(() => {
    if (propTheme && propTheme !== currentTheme) {
      setCurrentTheme(propTheme);
    }
  }, [propTheme, currentTheme]);

  const handleThemeChange = (newTheme: Theme) => {
    try {
      setCurrentTheme(newTheme);
      storeTheme(newTheme);
      onThemeChange?.(newTheme);
    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  const commonProps = {
    theme: currentTheme,
    onThemeChange: handleThemeChange,
    themeToggleDebounceMs: props.themeToggleDebounceMs,
  };

  if (mode === 'home') {
    return (
      <HomeNavBar 
        {...commonProps}
        searchQuery={props.searchQuery}
        onSearchChange={props.onSearchChange}
        onNewStory={props.onNewStory}
        userName={props.userName}
        userAvatar={props.userAvatar}
        userPlan={props.userPlan}
        userStatus={props.userStatus}
        notifications={props.notifications}
        onNotificationClick={props.onNotificationClick}
        onMarkAllNotificationsRead={props.onMarkAllNotificationsRead}
        onClearAllNotifications={props.onClearAllNotifications}
        onNotificationSettingsClick={props.onNotificationSettingsClick}
        onProfileClick={props.onProfileClick}
        onEditProfileClick={props.onEditProfileClick}
        onAddMemberClick={props.onAddMemberClick}
        onSettingsClick={props.onSettingsClick}
        onDeleteAccountClick={props.onDeleteAccountClick}
        onTeamAccessClick={props.onTeamAccessClick}
        onLogoutClick={props.onLogoutClick}
        onCreateCharacterClick={props.onCreateCharacterClick}
        onPricingClick={props.onPricingClick}
        onMyCharactersClick={props.onMyCharactersClick}
        onMyChatsClick={props.onMyChatsClick}
        onAccountClick={props.onAccountClick}
        onMyStoriesClick={props.onMyStoriesClick}
        onCreateStoryClick={props.onCreateStoryClick}
      />
    );
  }

  return (
    <EditorNavBar 
      {...commonProps}
      onBack={props.onBack}
      onSave={props.onSave}
      onImport={props.onImport}
      onExport={props.onExport}
      onWritingModeChange={props.onWritingModeChange}
      writingMode={props.writingMode}
      isSaving={props.isSaving}
      isExporting={props.isExporting}
      isImporting={props.isImporting}
      leftSidebarTabs={props.leftSidebarTabs}
      rightSidebarTabs={props.rightSidebarTabs}
      onSidebarTabsChange={props.onSidebarTabsChange}
      leftSectionOffset={props.leftSectionOffset}
      rightSectionOffset={props.rightSectionOffset}
      editorThemeTogglePosition={props.editorThemeTogglePosition}
    />
  );
};
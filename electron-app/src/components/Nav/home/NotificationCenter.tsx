import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { NotificationCenterProps } from './../../../types/story';
import { useNotifications } from './Notifications/useNotifications';
import { BellIcon } from './Notifications/NotificationIcons';
import {
  NotificationBadge,
  NotificationHeader,
  NotificationsList,
  EmptyState,
  NotificationFooter
} from './Notifications/NotificationComponents';
import { StyledWrapper } from './Notifications/NotificationStyles';

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  theme,
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
  onClearAll,
  onSettingsClick
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const {
    displayNotifications,
    unreadCount,
    markAllAsRead,
    clearAll
  } = useNotifications(notifications);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleBellClick = useCallback(() => {
    setIsPressed(true);
    setIsOpen(prev => !prev);
    setTimeout(() => setIsPressed(false), 600);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
    onMarkAllRead?.();
  }, [markAllAsRead, onMarkAllRead]);

  const handleClearAll = useCallback(() => {
    clearAll();
    onClearAll?.();
  }, [clearAll, onClearAll]);

  const handleSettingsClick = useCallback(() => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      window.location.href = '/settings#notifications';
    }
  }, [onSettingsClick]);

  return (
    <StyledWrapper theme={theme} isOpen={isOpen}>
      <div className="notifications-container">
        <div 
          ref={buttonRef}
          tabIndex={0} 
          className={`popup button ${isOpen ? 'open' : ''}`}
          onClick={handleBellClick}
        >
          <div className="popup-header">
            <BellIcon isRinging={isPressed} />
            <NotificationBadge count={unreadCount} />
          </div>
          
          <div 
            ref={dropdownRef}
            className={`popup-main ${isOpen ? 'open' : ''}`}
          >
            <NotificationHeader
              unreadCount={unreadCount}
              onMarkAllRead={handleMarkAllRead}
              onSettingsClick={handleSettingsClick}
            />
            
            {displayNotifications.length > 0 ? (
              <>
                <NotificationsList
                  notifications={displayNotifications}
                  onNotificationClick={onNotificationClick}
                />
                <NotificationFooter onClearAll={handleClearAll} />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default NotificationCenter;
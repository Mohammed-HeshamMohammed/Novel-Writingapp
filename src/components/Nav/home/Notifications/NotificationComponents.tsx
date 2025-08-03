import React from 'react';
import { Check, Settings, Trash2 } from 'lucide-react';
import type { Notification } from '../../../../types/story';
import { getNotificationIcon } from './NotificationIcons';

export const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return <span className="notification-badge">{count}</span>;
};

export const NotificationHeader: React.FC<{
  unreadCount: number;
  onMarkAllRead: () => void;
  onSettingsClick: () => void;
}> = ({ unreadCount, onMarkAllRead, onSettingsClick }) => (
  <div className="notifications-header">
    <div className="header-title">
      <h3>Notifications</h3>
      {unreadCount > 0 && <span className="unread-count">{unreadCount} new</span>}
    </div>
    <div className="header-actions">
      {unreadCount > 0 && (
        <button onClick={onMarkAllRead} className="action-btn mark-read">
          <Check size={14} />
          <span>Mark all read</span>
        </button>
      )}
      <button onClick={onSettingsClick} className="action-btn settings">
        <Settings size={14} />
      </button>
    </div>
  </div>
);

export const NotificationItem: React.FC<{
  notification: Notification;
  onClick: () => void;
}> = ({ notification, onClick }) => (
  <div
    className={`notification-item ${!notification.read ? 'unread' : ''}`}
    onClick={onClick}
  >
    <div className="notification-icon">
      {getNotificationIcon(notification.type)}
    </div>
    <div className="notification-content">
      <div className="notification-title">{notification.title}</div>
      <div className="notification-message">{notification.message}</div>
      <div className="notification-time">{notification.time}</div>
    </div>
    {!notification.read && <div className="unread-indicator" />}
  </div>
);

export const NotificationsList: React.FC<{
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
}> = ({ notifications, onNotificationClick }) => (
  <div className="notifications-list">
    {notifications.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onClick={() => onNotificationClick?.(notification.id)}
      />
    ))}
  </div>
);

export const EmptyState: React.FC = () => (
  <div className="empty-state">
    <div className="empty-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    </div>
    <div className="empty-text">
      <h4>All caught up!</h4>
      <p>No new notifications to show.</p>
    </div>
  </div>
);

export const NotificationFooter: React.FC<{ onClearAll: () => void }> = ({ onClearAll }) => (
  <div className="notifications-footer">
    <button onClick={onClearAll} className="clear-all-btn">
      <Trash2 size={14} />
      Clear All Notifications
    </button>
  </div>
);
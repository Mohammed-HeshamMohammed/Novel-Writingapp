import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Notification } from '../../../../shared/types/story';

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'comment',
    title: 'New Comment',
    message: 'John commented on your story "The Mystery Novel"',
    time: '2 min ago',
    read: false
  },
  {
    id: '2',
    type: 'loved',
    title: 'Story Loved',
    message: 'Emma loved your roleplay bot "Fantasy Adventure"',
    time: '15 min ago',
    read: false
  },
  {
    id: '3',
    type: 'like',
    title: 'Story Liked',
    message: 'Sarah liked your story "Adventure Begins"',
    time: '1 hour ago',
    read: false
  },
  {
    id: '4',
    type: 'follow',
    title: 'New Follower',
    message: 'Mike started following you',
    time: '3 hours ago',
    read: true
  },
  {
    id: '5',
    type: 'unlike',
    title: 'Story Unliked',
    message: 'Alex unliked your story "Dark Tales"',
    time: '5 hours ago',
    read: true
  },
  {
    id: '6',
    type: 'unfollow',
    title: 'Unfollowed',
    message: 'Lisa unfollowed you',
    time: '8 hours ago',
    read: true
  },
  {
    id: '7',
    type: 'story',
    title: 'Story Published',
    message: 'Your story "Sci-Fi Dreams" was successfully published',
    time: '1 day ago',
    read: true
  },
  {
    id: '8',
    type: 'system',  
    title: 'System Update',
    message: 'New features are now available in the editor',
    time: '2 days ago',
    read: true
  }
];

export const useNotifications = (initialNotifications: Notification[]) => {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  
  const displayNotifications = useMemo(() => {
    if (initialNotifications.length > 0) return initialNotifications;
    if (localNotifications.length > 0) return localNotifications;
    return DEFAULT_NOTIFICATIONS;
  }, [initialNotifications, localNotifications]);

  const unreadCount = useMemo(() => 
    displayNotifications.filter(n => !n.read).length, 
    [displayNotifications]
  );

  const markAllAsRead = useCallback(() => {
    if (initialNotifications.length === 0) {
      setLocalNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    }
  }, [initialNotifications.length]);

  const clearAll = useCallback(() => {
    if (initialNotifications.length === 0) {
      setLocalNotifications([]);
    }
  }, [initialNotifications.length]);

  useEffect(() => {
    if (initialNotifications.length === 0 && localNotifications.length === 0) {
      setLocalNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, [initialNotifications.length, localNotifications.length]);

  return {
    displayNotifications,
    unreadCount,
    markAllAsRead,
    clearAll
  };
};
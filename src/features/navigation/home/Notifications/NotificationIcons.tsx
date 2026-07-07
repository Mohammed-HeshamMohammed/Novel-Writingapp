import React from 'react';
import { MessageCircle, UserPlus, BookOpen, ThumbsUp, ThumbsDown, UserMinus } from 'lucide-react';

export const getNotificationIcon = (type: string) => {
  const iconMap = {
    comment: <MessageCircle size={16} color="#3b82f6" />,
    like: <ThumbsUp size={16} color="#10b981" />,
    follow: <UserPlus size={16} color="#8b5cf6" />,
    story: <BookOpen size={16} color="#f59e0b" />,
    unlike: <ThumbsDown size={16} color="#ef4444" />,
    unfollow: <UserMinus size={16} color="#6b7280" />,
    loved: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#dc2626">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    system: <BookOpen size={16} color="#6366f1" />,
  };
  return iconMap[type as keyof typeof iconMap] || <BookOpen size={16} color="#6b7280" />;
};

export const BellIcon: React.FC<{ isRinging: boolean }> = ({ isRinging }) => (
  <svg
    className={`bell-icon ${isRinging ? 'ringing' : ''}`}
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
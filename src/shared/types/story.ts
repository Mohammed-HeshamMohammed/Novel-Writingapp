import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface Chapter {
  id: string;
  title: string;
  number?: number | string;
  content: string;
  wordCount: number;
  status?: 'Draft' | 'In Progress' | 'Completed' | 'Needs Review';
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  name: string;
  role?: string;
  description?: string;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date?: string;
  description?: string;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  timeline: TimelineEvent[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  totalWords: number;
  author?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  isBookmarked?: boolean;
  readingProgress?: number;
  popularity?: number;
  status?: any;
  thumbnail?: string;
  isFavorited?: any;
  summary?: ReactNode;
  rating?: any;
  readers?: ReactNode;
  engagement?: ReactNode;
  progress?: any;
  lastUpdated?: (lastUpdated: any) => ReactNode;
}

export interface StoryMetadata {
  id: string;
  title: string;
  description: string;
  wordCount: number;
  chapterCount: number;
  totalWords: number;
  createdAt: Date;
  updatedAt: Date;
  filePath?: string;
  coverImage?: string;
  author?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  isBookmarked?: boolean;
  readingProgress?: number;
  popularity?: number;
}

export interface UISettings {
  showCustomizeButton?: boolean;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'date' | 'title' | 'popularity' | 'readingTime';
export type FilterOption = 'all' | 'bookmarked' | 'recent' | 'male' | 'female' | 'non-binary' | 'oc' | 'fictional' | 'game' | 'anime' | 'historical' | 'royalty' | 'detective' | 'hero' | 'villain' | 'magical' | 'non-human' | 'monster' | 'monster-girl' | 'robot' | 'vampire' | 'elf' | 'multiple' | 'vtuber' | 'dominant' | 'submissive' | 'scenario' | 'non-english' | 'mature' | 'fantasy' | 'roleplay' | 'furry' | 'action' | 'romance' | 'comedy' | 'drama' | 'horror' | 'adventure' | 'mystery' | 'wholesome' | 'demon' | 'tsundere' | 'goddess' | 'military' | 'maid' | 'warrior' | 'school' | 'shy' | 'werewolf' | 'goth';
export type WritingMode = 'focus' | 'normal' | 'distraction-free' | 'typewriter' | 'guided' | 'describe' | 'rewrite' | 'brainstorm' | 'visualize';
export type Theme = 'light' | 'dark';

export interface FilterOptionData {
  value: FilterOption;
  label: string;
  emoji: string;
}

export interface WritingSuggestion {
  id: string;
  type: 'grammar' | 'style' | 'plot' | 'character' | 'pacing' | 'dialogue';
  title: string;
  description: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
  position?: {
    line: number;
    column: number;
  };
  isAccepted?: boolean;
  isDismissed?: boolean;
}

export interface UserPreferences {
  theme: Theme;
  fontSize?: 'small' | 'medium' | 'large';
  fontFamily?: string;
  autoSave?: boolean;
  spellCheck?: boolean;
  wordWrap?: boolean;
}

export interface Notification {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'story' | 'system' | 'unlike' | 'unfollow' | 'loved';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface NotificationCenterProps {
  theme: 'light' | 'dark';
  notifications?: Notification[];
  onNotificationClick?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onSettingsClick?: () => void;
  openUpward?: boolean;
}

export interface UserProfileDropdownProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    userPlan?: 'free' | 'premium' | 'pro';
  };
}

export type UserStatus = 'online' | 'idle' | 'dnd' | 'invisible';

export interface StatusWithDuration {
  status: UserStatus;
  duration?: string;
  expiresAt?: Date;
}

export interface StatusOption {
  id: UserStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export type UserPlanType = 'free' | 'premium' | 'pro';

export interface UserPlan {
  plan: UserPlanType;
  icon: LucideIcon;
  label: string;
  color: string;
  upgradeText: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const filterOptions: FilterOptionData[] = [
  { value: 'all', label: 'All Stories', emoji: '📚' },
  { value: 'bookmarked', label: 'Bookmarked', emoji: '⭐' },
  { value: 'recent', label: 'Recent', emoji: '🕒' },
  { value: 'male', label: 'Male', emoji: '👨‍🦰' },
  { value: 'female', label: 'Female', emoji: '👩‍🦰' },
  { value: 'non-binary', label: 'Non-binary', emoji: '🌈' },
  { value: 'oc', label: 'OC', emoji: '🧑‍🎨' },
  { value: 'fictional', label: 'Fictional', emoji: '📚' },
  { value: 'game', label: 'Game', emoji: '🎮' },
  { value: 'anime', label: 'Anime', emoji: '📺' },
  { value: 'historical', label: 'Historical', emoji: '🏰' },
  { value: 'royalty', label: 'Royalty', emoji: '👑' },
  { value: 'detective', label: 'Detective', emoji: '🕵️‍♀️' },
  { value: 'hero', label: 'Hero', emoji: '🦸‍♂️' },
  { value: 'villain', label: 'Villain', emoji: '🦹‍♂️' },
  { value: 'magical', label: 'Magical', emoji: '🔮' },
  { value: 'non-human', label: 'Non-human', emoji: '🦄' },
  { value: 'monster', label: 'Monster', emoji: '👹' },
  { value: 'monster-girl', label: 'Monster Girl', emoji: '👧' },
  { value: 'robot', label: 'Robot', emoji: '🤖' },
  { value: 'vampire', label: 'Vampire', emoji: '🧛‍♂️' },
  { value: 'elf', label: 'Elf', emoji: '🧝‍♀️' },
  { value: 'multiple', label: 'Multiple', emoji: '👭' },
  { value: 'vtuber', label: 'VTuber', emoji: '👩🏼‍💻' },
  { value: 'dominant', label: 'Dominant', emoji: '⛓️' },
  { value: 'submissive', label: 'Submissive', emoji: '🙇' },
  { value: 'scenario', label: 'Scenario', emoji: '🪢' },
  { value: 'non-english', label: 'Non-English', emoji: '🌎' },
  { value: 'mature', label: 'Mature', emoji: '🧑‍🦳' },
  { value: 'fantasy', label: 'Fantasy', emoji: '🧙‍♂️' },
  { value: 'roleplay', label: 'Roleplay', emoji: '🎭' },
  { value: 'furry', label: 'Furry', emoji: '🐾' },
  { value: 'action', label: 'Action', emoji: '💥' },
  { value: 'romance', label: 'Romance', emoji: '💖' },
  { value: 'comedy', label: 'Comedy', emoji: '😂' },
  { value: 'horror', label: 'Horror', emoji: '👻' },
  { value: 'adventure', label: 'Adventure', emoji: '⚔️' },
  { value: 'mystery', label: 'Mystery', emoji: '🔍' },
  { value: 'wholesome', label: 'Wholesome', emoji: '🌞' },
  { value: 'demon', label: 'Demon', emoji: '😈' },
  { value: 'tsundere', label: 'Tsundere', emoji: '🌸' },
  { value: 'goddess', label: 'Goddess', emoji: '👸' },
  { value: 'military', label: 'Military', emoji: '🎖️' },
  { value: 'maid', label: 'Maid', emoji: '👗' },
  { value: 'warrior', label: 'Warrior', emoji: '👊' },
  { value: 'school', label: 'School', emoji: '🏫' },
  { value: 'shy', label: 'Shy', emoji: '🙈' },
  { value: 'werewolf', label: 'Werewolf', emoji: '🐺' },
  { value: 'goth', label: 'Goth', emoji: '🦇' }
];

export interface StatusOption {
  id: UserStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badgeLabel?: string; // Add this optional property for shorter badge display
}
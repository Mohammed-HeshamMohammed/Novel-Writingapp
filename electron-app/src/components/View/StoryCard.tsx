import React from 'react';
import { StoryGrid } from './StoryGrid';
import { StoryList } from './StoryList';
import type { Story } from '../../types/story';

interface StoryCardProps {
  story: Story;
  onOpen: (id: string) => void;
  onBookmark: (id: string) => void;
  onDelete: (id: string) => void;
  viewMode: 'grid' | 'list';
  isVisible?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ 
  story, 
  onOpen, 
  onBookmark,
  onDelete,
  viewMode,
  isVisible = true
}) => {
  if (!isVisible) return null;

  try {
    const storyMetadata = {
      ...story,
      chapterCount: story.chapters?.length || 0
    };

    const props = { 
      story: storyMetadata, 
      onOpen, 
      onBookmark, 
      onDelete 
    };

    return viewMode === 'list' 
      ? <StoryList {...props} /> 
      : <StoryGrid {...props} />;
  } catch (error) {
    console.error('Error rendering story card:', error);
    return null;
  }
};
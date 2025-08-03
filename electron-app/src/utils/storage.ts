import type { Story, StoryMetadata } from '../types/story';

const STORAGE_KEY = 'story-writer-stories';
const METADATA_KEY = 'story-writer-metadata';

export const saveStory = (story: Story) => {
  try {
    const stories = getStoredStories();
    stories[story.id] = story;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    
    const metadata = getStoredMetadata();
    metadata[story.id] = {
      id: story.id,
      title: story.title,
      description: story.description,
      chapterCount: story.chapters.length,
      totalWords: story.totalWords,
      coverImage: story.coverImage,
      updatedAt: story.updatedAt,
      author: story.author,
      category: story.category,
      tags: story.tags,
      readingTime: story.readingTime,
      isBookmarked: story.isBookmarked,
      readingProgress: story.readingProgress,
      popularity: story.popularity,
    };
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving story:', error);
  }
};

export const loadStory = (id: string): Story | null => {
  try {
    const stories = getStoredStories();
    const story = stories[id];
    
    if (!story) return null;
    
    return {
      ...story,
      createdAt: new Date(story.createdAt),
      updatedAt: new Date(story.updatedAt),
      chapters: story.chapters.map(chapter => ({
        ...chapter,
        createdAt: new Date(chapter.createdAt),
        updatedAt: new Date(chapter.updatedAt),
      })),
    };
  } catch (error) {
    console.error('Error loading story:', error);
    return null;
  }
};

export const deleteStory = (id: string) => {
  try {
    const stories = getStoredStories();
    delete stories[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    
    const metadata = getStoredMetadata();
    delete metadata[id];
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error deleting story:', error);
  }
};

export const toggleBookmark = (id: string) => {
  try {
    const stories = getStoredStories();
    const story = stories[id];
    if (story) {
      story.isBookmarked = !story.isBookmarked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
      
      const metadata = getStoredMetadata();
      if (metadata[id]) {
        metadata[id].isBookmarked = story.isBookmarked;
        localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
      }
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
  }
};

export const getAllStoryMetadata = (): StoryMetadata[] => {
  try {
    const metadata = getStoredMetadata();
    return Object.values(metadata).map(meta => ({
      ...meta,
      updatedAt: new Date(meta.updatedAt),
    })).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error('Error getting all story metadata:', error);
    return [];
  }
};

const getStoredStories = (): Record<string, Story> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting stored stories:', error);
    return {};
  }
};

const getStoredMetadata = (): Record<string, StoryMetadata> => {
  try {
    const stored = localStorage.getItem(METADATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting stored metadata:', error);
    return {};
  }
};
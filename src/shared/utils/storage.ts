import type { Story, StoryMetadata } from '../types/story';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const STORAGE_KEY = 'story-writer-stories';
const METADATA_KEY = 'story-writer-metadata';
const TABLE = 'stories';

const toMetadata = (story: Story): StoryMetadata => ({
  id: story.id,
  title: story.title,
  description: story.description,
  chapterCount: story.chapters.length,
  wordCount: story.totalWords,
  totalWords: story.totalWords,
  coverImage: story.coverImage,
  createdAt: story.createdAt,
  updatedAt: story.updatedAt,
  author: story.author,
  category: story.category,
  tags: story.tags,
  readingTime: story.readingTime,
  isBookmarked: story.isBookmarked,
  readingProgress: story.readingProgress,
  popularity: story.popularity,
});

const reviveStory = (story: Story): Story => ({
  ...story,
  createdAt: new Date(story.createdAt),
  updatedAt: new Date(story.updatedAt),
  chapters: story.chapters.map(chapter => ({
    ...chapter,
    createdAt: new Date(chapter.createdAt),
    updatedAt: new Date(chapter.updatedAt),
  })),
});

export const saveStory = async (story: Story): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from(TABLE).upsert({
        id: story.id,
        data: story,
        updated_at: new Date(story.updatedAt).toISOString(),
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error saving story to Supabase:', error);
    }
    return;
  }
  saveStoryLocal(story);
};

export const loadStory = async (id: string): Promise<Story | null> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from(TABLE).select('data').eq('id', id).maybeSingle();
      if (error) throw error;
      return data ? reviveStory(data.data as Story) : null;
    } catch (error) {
      console.error('Error loading story from Supabase:', error);
      return null;
    }
  }
  return loadStoryLocal(id);
};

export const deleteStory = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting story from Supabase:', error);
    }
    return;
  }
  deleteStoryLocal(id);
};

export const toggleBookmark = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from(TABLE).select('data').eq('id', id).maybeSingle();
      if (error) throw error;
      if (!data) return;

      const story = data.data as Story;
      story.isBookmarked = !story.isBookmarked;

      const { error: updateError } = await supabase.from(TABLE).update({ data: story }).eq('id', id);
      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error toggling bookmark in Supabase:', error);
    }
    return;
  }
  toggleBookmarkLocal(id);
};

export const getAllStoryMetadata = async (): Promise<StoryMetadata[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('data')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => {
        const story = reviveStory(row.data as Story);
        return toMetadata(story);
      });
    } catch (error) {
      console.error('Error getting all story metadata from Supabase:', error);
      return [];
    }
  }
  return getAllStoryMetadataLocal();
};

// --- localStorage backend (used when Supabase isn't configured) ---

const saveStoryLocal = (story: Story) => {
  try {
    const stories = getStoredStories();
    stories[story.id] = story;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));

    const metadata = getStoredMetadata();
    metadata[story.id] = toMetadata(story);
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving story:', error);
  }
};

const loadStoryLocal = (id: string): Story | null => {
  try {
    const stories = getStoredStories();
    const story = stories[id];
    return story ? reviveStory(story) : null;
  } catch (error) {
    console.error('Error loading story:', error);
    return null;
  }
};

const deleteStoryLocal = (id: string) => {
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

const toggleBookmarkLocal = (id: string) => {
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

const getAllStoryMetadataLocal = (): StoryMetadata[] => {
  try {
    const metadata = getStoredMetadata();
    return Object.values(metadata).map(meta => ({
      ...meta,
      createdAt: new Date(meta.createdAt),
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

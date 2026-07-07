import type { StoryMetadata } from '../../../shared/types/story';

export const matchesFilter = (story: StoryMetadata, filters: string[]): boolean => {
  if (filters.includes('all')) return true;
  const storyTags = story.tags || [];
  const storyCategory = story.category || '';
  return filters.some((filter) => {
    switch (filter) {
      case 'bookmarked':
        return story.isBookmarked;
      case 'recent':
        return Date.now() - story.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000;
      default:
        return storyTags.includes(filter) || storyCategory === filter;
    }
  });
};

export const matchesGenre = (story: StoryMetadata, genre: string): boolean => {
  const storyTags = (story.tags || []).map((t) => t.toLowerCase());
  const storyCategory = (story.category || '').toLowerCase();
  const cleanGenre = genre.toLowerCase();

  switch (cleanGenre) {
    case 'all':
      return true;
    case 'popular':
      return (story.popularity || 0) > 500;
    case 'trending':
      return Date.now() - story.updatedAt.getTime() < 3 * 24 * 60 * 60 * 1000;
    case 'new':
      return Date.now() - story.updatedAt.getTime() < 24 * 60 * 60 * 1000;
    default: {
      const normGenre = cleanGenre === 'scifi' ? 'sci-fi' : cleanGenre;
      return (
        storyTags.includes(normGenre) ||
        storyTags.includes(cleanGenre) ||
        storyCategory === normGenre ||
        storyCategory === cleanGenre
      );
    }
  }
};

export const sortStories = (stories: StoryMetadata[], sortOption: string): StoryMetadata[] => {
  return [...stories].sort((a, b) => {
    switch (sortOption) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      case 'author':
        return (a.author || '').localeCompare(b.author || '');
      case 'wordCount':
        return (a.wordCount || 0) - (b.wordCount || 0);
      case 'wordCountDesc':
        return (b.wordCount || 0) - (a.wordCount || 0);
      case 'readingTime':
        return (a.readingTime || 0) - (b.readingTime || 0);
      case 'readingTimeDesc':
        return (b.readingTime || 0) - (a.readingTime || 0);
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0);
      case 'progress':
        return (b.readingProgress || 0) - (a.readingProgress || 0);
      case 'created':
        return (b.createdAt || b.updatedAt).getTime() - (a.createdAt || a.updatedAt).getTime();
      case 'updated':
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });
};

export interface StoryQueryParams {
  searchQuery: string;
  selectedGenre: string;
  filterBy: string[];
  sortBy: string;
}

export const queryStories = (stories: StoryMetadata[], params: StoryQueryParams): StoryMetadata[] => {
  const { searchQuery, selectedGenre, filterBy, sortBy } = params;
  let filtered = stories;

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (story) =>
        story.title.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        story.author?.toLowerCase().includes(query)
    );
  }

  filtered = filtered.filter((story) => matchesGenre(story, selectedGenre));
  filtered = filtered.filter((story) => matchesFilter(story, filterBy));

  return sortStories(filtered, sortBy);
};

export const convertToDisplayStory = (metadata: StoryMetadata) => ({
  ...metadata,
  status: 'draft',
  thumbnail: metadata.coverImage || '',
  isFavorited: metadata.isBookmarked || false,
  summary: metadata.description,
  rating: 0,
  readers: `${Math.floor(Math.random() * 1000)} readers`,
  engagement: `${Math.floor(Math.random() * 100)}% engagement`,
  lastUpdated: () => metadata.updatedAt.toLocaleDateString(),
  progress: metadata.readingProgress || 0,
  chapters: [],
  characters: [],
  locations: [],
  timeline: [],
  createdAt: new Date(metadata.updatedAt.getTime() - 86400000),
});

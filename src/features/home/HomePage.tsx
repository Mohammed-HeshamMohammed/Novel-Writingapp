import React, { useState, useMemo, useEffect } from 'react';
import type { StoryMetadata, ViewMode, Theme } from '../../shared/types/story';
import { StoryCard } from './components/StoryCard';
import { StoryFilters } from './StoryFilters';
import { GenreNavBar } from './GenreNavBar';
import { NavigationBar } from '../navigation/NavigationBar';
import { CustomizeModal } from './Customizemodal';
import Notification from '../fun/Gokutextreminder';
import CustomizeButton from './customize';
import { Plus } from 'lucide-react';

interface FilterPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface HomePageProps {
  stories: StoryMetadata[];
  onNewStory: (storyData: { title: string; description: string; category: string; tags: string[] }) => void;
  onOpenStory: (id: string) => void;
  onDeleteStory: (id: string) => void;
  onBookmarkStory: (id: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  genreFilterSpacing?: string;
  navbarSpacing?: string;
  contentSpacing?: string;
  filterPosition?: FilterPosition;
  userEmail?: string;
  onLogout?: () => void;
}

const themeStyles = {
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    cardBackground: 'bg-gray-800',
    button: 'text-white bg-blue-700 hover:bg-blue-800 border-transparent',
    iconBackground: 'bg-gray-800',
    iconColor: 'text-gray-500',
  },
  light: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    cardBackground: 'bg-gray-100',
    button: 'text-white bg-blue-600 hover:bg-blue-700 border-transparent',
    iconBackground: 'bg-gray-100',
    iconColor: 'text-gray-400',
  }
};

export const HomePage: React.FC<HomePageProps> = ({ 
  stories, 
  onNewStory, 
  onOpenStory, 
  onDeleteStory, 
  onBookmarkStory,
  theme,
  onThemeChange,
  genreFilterSpacing = 'gap-3 sm:gap-4',
  navbarSpacing = 'mb-2',
  contentSpacing = 'pt-2',
  filterPosition = {},
  userEmail,
  onLogout
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<string>('updated');
  const [filterBy, setFilterBy] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [showNotification, setShowNotification] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [isCustomizeButtonVisible] = useState(false);

  const styles = themeStyles[theme];

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * 24 * 3600000) + Math.floor(Math.random() * 60 * 60000);
    const timer = setTimeout(() => setShowNotification(true), randomDelay);
    return () => clearTimeout(timer);
  }, []);

  const getFilterPositionStyle = () => {
    const style: React.CSSProperties = {};
    if (filterPosition.top !== undefined) style.marginTop = `${filterPosition.top}px`;
    if (filterPosition.right !== undefined) style.marginRight = `${filterPosition.right}px`;
    if (filterPosition.bottom !== undefined) style.marginBottom = `${filterPosition.bottom}px`;
    if (filterPosition.left !== undefined) style.marginLeft = `${filterPosition.left}px`;
    return style;
  };

  const convertToStory = (metadata: StoryMetadata) => ({
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
    createdAt: new Date(metadata.updatedAt.getTime() - 86400000)
  });

  const matchesFilter = (story: StoryMetadata, filters: string[]) => {
    if (filters.includes('all')) return true;
    const storyTags = story.tags || [];
    const storyCategory = story.category || '';
    return filters.some(filter => {
      switch (filter) {
        case 'bookmarked': return story.isBookmarked;
        case 'recent': return Date.now() - story.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000;
        default: return storyTags.includes(filter) || storyCategory === filter;
      }
    });
  };

  const matchesGenre = (story: StoryMetadata, genre: string) => {
    const storyTags = story.tags || [];
    const storyCategory = story.category || '';
    
    switch (genre) {
      case 'all': return true;
      case 'popular': return (story.popularity || 0) > 500;
      case 'trending': return Date.now() - story.updatedAt.getTime() < 3 * 24 * 60 * 60 * 1000;
      case 'new': return Date.now() - story.updatedAt.getTime() < 24 * 60 * 60 * 1000;
      default: return storyTags.includes(genre) || storyCategory === genre;
    }
  };

  const sortStories = (stories: StoryMetadata[], sortOption: string) => {
    return [...stories].sort((a, b) => {
      switch (sortOption) {
        case 'title': return a.title.localeCompare(b.title);
        case 'titleDesc': return b.title.localeCompare(a.title);
        case 'author': return (a.author || '').localeCompare(b.author || '');
        case 'wordCount': return (a.wordCount || 0) - (b.wordCount || 0);
        case 'wordCountDesc': return (b.wordCount || 0) - (a.wordCount || 0);
        case 'readingTime': return (a.readingTime || 0) - (b.readingTime || 0);
        case 'readingTimeDesc': return (b.readingTime || 0) - (a.readingTime || 0);
        case 'popularity': return (b.popularity || 0) - (a.popularity || 0);
        case 'progress': return (b.readingProgress || 0) - (a.readingProgress || 0);
        case 'created': return (b.createdAt || b.updatedAt).getTime() - (a.createdAt || a.updatedAt).getTime();
        case 'updated':
        default: return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });
  };

  const filteredAndSortedStories = useMemo(() => {
    try {
      let filtered = stories;
      
      if (searchQuery) {
        filtered = filtered.filter(story =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.author?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      filtered = filtered.filter(story => matchesGenre(story, selectedGenre));
      filtered = filtered.filter(story => matchesFilter(story, filterBy));
      
      return sortStories(filtered, sortBy);
    } catch (error) {
      console.error('Error filtering stories:', error);
      return stories;
    }
  }, [stories, searchQuery, selectedGenre, filterBy, sortBy]);

  const handleNewStory = () => {
    try {
      onNewStory({
        title: '',
        description: '',
        category: 'Fiction',
        tags: []
      });
    } catch (error) {
      console.error('Error creating new story:', error);
    }
  };

  const handleGenreSelect = (genre: string) => {
    try {
      setSelectedGenre(genre);
    } catch (error) {
      console.error('Error selecting genre:', error);
    }
  };

  const handleCustomizeClick = () => {
    try {
      setShowCustomizeModal(true);
    } catch (error) {
      console.error('Error opening customize modal:', error);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 ${styles.iconBackground} rounded-full flex items-center justify-center mb-4`}>
        <Plus className={`w-6 h-6 sm:w-8 sm:h-8 ${styles.iconColor}`} />
      </div>
      <h3 className={`text-lg sm:text-xl font-medium ${styles.text} mb-2`}>
        {searchQuery || !filterBy.includes('all') ? 'No stories found' : 'No stories yet'}
      </h3>
      <p className={`${styles.textSecondary} mb-6 text-sm sm:text-base`}>
        {searchQuery || !filterBy.includes('all')
          ? 'Try adjusting your search or filters'
          : 'Create your first story to get started'
        }
      </p>
      {!searchQuery && filterBy.includes('all') && (
        <button 
          onClick={handleNewStory}
          className={`inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium border rounded-md ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Story
        </button>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${styles.background} relative`}>
      <div className={navbarSpacing}>
        <NavigationBar
          mode="home"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewStory={handleNewStory}
          onThemeChange={onThemeChange}
          theme={theme}
          userName={userEmail}
          onLogoutClick={onLogout}
        />
      </div>

      {isCustomizeButtonVisible && (
        <div 
          className="fixed bottom-4 left-16 z-[60] transition-all cursor-pointer"
          onClick={handleCustomizeClick}
        >
          <CustomizeButton />
        </div>
      )}

      <main className={`w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-4 sm:py-8 pb-24 md:pb-8 ${contentSpacing}`}>
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-start ${genreFilterSpacing} mb-2`}>
          <div className="flex min-w-0 flex-1 sm:max-w-4xl">
            <GenreNavBar
              theme={theme}
              activeGenre={selectedGenre}
              onGenreSelect={handleGenreSelect}
            />
          </div>

          <div
            className="min-w-0 w-full sm:w-auto sm:flex-shrink-0"
            style={getFilterPositionStyle()}
          >
            <StoryFilters
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
              theme={theme}
            />
          </div>
        </div>

        {filteredAndSortedStories.length === 0 ? renderEmptyState() : (
          <div className={`grid gap-3 sm:gap-6 transition-all duration-300 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8' 
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={convertToStory(story)}
                onOpen={onOpenStory}
                onDelete={onDeleteStory}
                onBookmark={onBookmarkStory}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      {showCustomizeModal && (
        <CustomizeModal
          onClose={() => setShowCustomizeModal(false)}
          onModeSelect={(mode: string) => {
            console.log('Selected mode:', mode);
            setShowCustomizeModal(false);
          }}
        />
      )}

      {showNotification && (
        <div className="fixed bottom-60 left-20">
          <Notification />
        </div>
      )}
    </div>
  );
};
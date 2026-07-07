import React, { useState, useMemo, useEffect } from 'react';
import type { StoryMetadata, ViewMode, Theme, UserPlanType, UserStatus } from '../../shared/types/story';
import { StoryCard } from './components/StoryCard';
import { StoryFilters } from './StoryFilters';
import { GenreNavBar } from './GenreNavBar';
import { getGenreLabel } from './data/genres';
import { queryStories, convertToDisplayStory } from './data/storyQueries';
import { NavigationBar } from '../navigation/NavigationBar';
import { CustomizeModal } from './Customizemodal';
import Notification from '../fun/Gokutextreminder';
import CustomizeButton from './customize';
import { Plus } from 'lucide-react';
import {
  ProfileModal, SettingsModal, PricingModal, CharactersModal, CreateCharacterModal, type Character
} from './components/UserModals';

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
  userName?: string;
  userAvatar?: string;
  userPlan?: UserPlanType;
  userStatus?: UserStatus;
  onProfileUpdate?: (data: { username: string; avatarUrl?: string; status: UserStatus }) => void;
  onPlanUpgrade?: (plan: UserPlanType) => void;
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
  navbarSpacing = 'mb-2',
  contentSpacing = 'pt-2',
  filterPosition = {},
  userEmail,
  userName,
  userAvatar,
  userPlan = 'free',
  userStatus = 'online',
  onProfileUpdate,
  onPlanUpgrade,
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
  
  // Modal states
  const [activeModal, setActiveModal] = useState<'profile' | 'settings' | 'pricing' | 'characters' | 'create-character' | null>(null);

  // Global characters bank
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const stored = localStorage.getItem('story-writer-characters');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('story-writer-characters', JSON.stringify(characters));
  }, [characters]);

  const handleAddCharacter = (newChar: Omit<Character, 'id' | 'createdAt'>) => {
    const character: Character = {
      ...newChar,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setCharacters(prev => [character, ...prev]);
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

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

  const filteredAndSortedStories = useMemo(() => {
    try {
      return queryStories(stories, { searchQuery, selectedGenre, filterBy, sortBy });
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
          userName={userName || userEmail}
          userAvatar={userAvatar}
          userPlan={userPlan}
          userStatus={userStatus}
          onProfileClick={() => setActiveModal('profile')}
          onSettingsClick={() => setActiveModal('settings')}
          onPricingClick={() => setActiveModal('pricing')}
          onCreateCharacterClick={() => setActiveModal('create-character')}
          onMyCharactersClick={() => setActiveModal('characters')}
          onMyStoriesClick={() => setFilterBy(['all'])}
          onCreateStoryClick={handleNewStory}
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
        {/* Discover panel: genre chips + filter/sort/view toolbar, grouped as one unit */}
        <div className="w-full mb-6 space-y-3">
          <GenreNavBar
            theme={theme}
            activeGenre={selectedGenre}
            onGenreSelect={handleGenreSelect}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedGenre === 'all'
                  ? 'All Stories'
                  : `${getGenreLabel(selectedGenre)} Stories`}
              </h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
                {filteredAndSortedStories.length} {filteredAndSortedStories.length === 1 ? 'story' : 'stories'}
              </span>
            </div>

            <div className="w-full sm:w-auto" style={getFilterPositionStyle()}>
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
                story={convertToDisplayStory(story)}
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

      {/* Profile Modal */}
      {activeModal === 'profile' && onProfileUpdate && (
        <ProfileModal
          theme={theme}
          email={userEmail}
          username={userName || 'User'}
          avatarUrl={userAvatar}
          planType={userPlan}
          status={userStatus}
          onUpdate={onProfileUpdate}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <SettingsModal
          theme={theme}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Pricing Modal */}
      {activeModal === 'pricing' && onPlanUpgrade && (
        <PricingModal
          theme={theme}
          userPlan={userPlan}
          onUpgrade={onPlanUpgrade}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Character List Modal */}
      {activeModal === 'characters' && (
        <CharactersModal
          theme={theme}
          characters={characters}
          onDeleteCharacter={handleDeleteCharacter}
          onCreateCharacterClick={() => setActiveModal('create-character')}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Create Character Modal */}
      {activeModal === 'create-character' && (
        <CreateCharacterModal
          theme={theme}
          onCreate={handleAddCharacter}
          onClose={() => setActiveModal('characters')}
        />
      )}
    </div>
  );
};
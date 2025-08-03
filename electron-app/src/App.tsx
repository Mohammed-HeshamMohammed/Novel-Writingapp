import { useState, useEffect } from 'react';
import type { Story, StoryMetadata, Theme } from './types/story';
import { HomePage } from './components/Home/HomePage';
import { StoryEditor } from './components/StoryEditor';
import { ThemeProvider } from './contexts/ThemeContext';
import { createNewStory, updateStoryWordCount } from './utils/storyUtils';
import { saveStory, loadStory, deleteStory, getAllStoryMetadata, toggleBookmark } from './utils/storage';
import { getStoredTheme, storeTheme } from './components/Nav/utils/themeUtils';

type AppState = 'home' | 'editor';

function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<StoryMetadata[]>([]);
  const [theme, setTheme] = useState<Theme>(getStoredTheme());

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    try {
      setTheme(newTheme);
      storeTheme(newTheme);
    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  const loadStories = () => {
    try {
      setStories(getAllStoryMetadata());
    } catch (error) {
      console.error('Failed to load stories:', error);
      setStories([]);
    }
  };

  const handleNewStory = (storyData: { title: string; description: string; category: string; tags: string[] }) => {
    try {
      const newStory = createNewStory(storyData.title, storyData.description);
      newStory.category = storyData.category;
      newStory.tags = storyData.tags;
      setCurrentStory(newStory);
      setAppState('editor');
    } catch (error) {
      console.error('Failed to create new story:', error);
    }
  };

  const handleOpenStory = (id: string) => {
    try {
      const story = loadStory(id);
      if (story) {
        setCurrentStory(story);
        setAppState('editor');
      }
    } catch (error) {
      console.error('Failed to open story:', error);
    }
  };

  const handleDeleteStory = (id: string) => {
    try {
      deleteStory(id);
      loadStories();
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  const handleBookmarkStory = (id: string) => {
    try {
      toggleBookmark(id);
      loadStories();
    } catch (error) {
      console.error('Failed to bookmark story:', error);
    }
  };

  const handleStoryUpdate = (story: Story) => {
    try {
      const updatedStory = updateStoryWordCount(story);
      setCurrentStory(updatedStory);
      saveStory(updatedStory);
      loadStories();
    } catch (error) {
      console.error('Failed to update story:', error);
    }
  };

  const handleBackToHome = () => {
    try {
      setAppState('home');
      setCurrentStory(null);
    } catch (error) {
      console.error('Failed to navigate back:', error);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {appState === 'editor' && currentStory ? (
          <StoryEditor
            story={currentStory}
            onStoryUpdate={handleStoryUpdate}
            onBack={handleBackToHome}
            theme={theme}
            onThemeChange={handleThemeChange}
          />
        ) : (
          <HomePage
            stories={stories}
            onNewStory={handleNewStory}
            onOpenStory={handleOpenStory}
            onDeleteStory={handleDeleteStory}
            onBookmarkStory={handleBookmarkStory}
            theme={theme}
            onThemeChange={handleThemeChange}
            filterPosition={{ top: 10, right: 15}}
          />
          )}
      </div>
    </ThemeProvider>
  );
}

export default App;
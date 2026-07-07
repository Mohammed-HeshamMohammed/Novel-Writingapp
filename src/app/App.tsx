import { useState, useEffect } from 'react';
import type { Story, StoryMetadata, Theme } from '../shared/types/story';
import { HomePage } from '../features/home/HomePage';
import { StoryEditor } from '../features/editor/StoryEditor';
import { ThemeProvider } from './providers/ThemeContext';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { LoginPage } from '../features/auth/LoginPage';
import { isSupabaseConfigured } from '../shared/services/supabase';
import { createNewStory, updateStoryWordCount } from '../shared/utils/storyUtils';
import { saveStory, loadStory, deleteStory, getAllStoryMetadata, toggleBookmark } from '../shared/utils/storage';
import { getStoredTheme, storeTheme } from '../features/navigation/utils/themeUtils';

type AppState = 'home' | 'editor';

function AppContent() {
  const { user, loading: authLoading, signOut } = useAuth();
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

  const loadStories = async () => {
    try {
      setStories(await getAllStoryMetadata());
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

  const handleOpenStory = async (id: string) => {
    try {
      const story = await loadStory(id);
      if (story) {
        setCurrentStory(story);
        setAppState('editor');
      }
    } catch (error) {
      console.error('Failed to open story:', error);
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await deleteStory(id);
      await loadStories();
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  const handleBookmarkStory = async (id: string) => {
    try {
      await toggleBookmark(id);
      await loadStories();
    } catch (error) {
      console.error('Failed to bookmark story:', error);
    }
  };

  const handleStoryUpdate = async (story: Story) => {
    try {
      const updatedStory = updateStoryWordCount(story);
      setCurrentStory(updatedStory);
      await saveStory(updatedStory);
      await loadStories();
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

  const handleLogout = async () => {
    try {
      await signOut();
      setAppState('home');
      setCurrentStory(null);
      setStories([]);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured && !user) {
      setStories([]);
      return;
    }
    loadStories();
  }, [user]);

  if (isSupabaseConfigured) {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (!user) {
      return <LoginPage theme={theme} />;
    }
  }

  return (
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
          filterPosition={{ top: 10, right: 15 }}
          userEmail={user?.email}
          onLogout={isSupabaseConfigured ? handleLogout : undefined}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

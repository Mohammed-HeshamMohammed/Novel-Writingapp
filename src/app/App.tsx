import { useState, useEffect } from 'react';
import type { Story, StoryMetadata, Theme, UserPlanType, UserStatus } from '../shared/types/story';
import { HomePage } from '../features/home/HomePage';
import { StoryEditor } from '../features/editor/StoryEditor';
import { ThemeProvider } from './providers/ThemeContext';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { LoginPage } from '../features/auth/LoginPage';
import { supabase, isSupabaseConfigured } from '../shared/services/supabase';
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
  const [profile, setProfile] = useState<{
    username: string;
    avatarUrl?: string;
    planType: UserPlanType;
    status: UserStatus;
  }>({
    username: 'User',
    planType: 'free',
    status: 'online'
  });

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

  const loadProfile = async () => {
    if (isSupabaseConfigured && user && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url, plan_type, status')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          const googleName = user.user_metadata?.full_name || user.user_metadata?.name;
          const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

          // If username in DB is empty or default email prefix, and googleName is available, prefer the Google name
          const emailPrefix = user.email?.split('@')[0] || '';
          const currentDbName = data.username || '';
          const prefersGoogleName = !!(googleName && (!currentDbName || currentDbName === emailPrefix));

          const loadedUsername = prefersGoogleName ? googleName : (currentDbName || emailPrefix || 'User');
          const loadedAvatar = data.avatar_url || googleAvatar || undefined;

          setProfile({
            username: loadedUsername,
            avatarUrl: loadedAvatar,
            planType: (data.plan_type as UserPlanType) || 'free',
            status: (data.status as UserStatus) || 'online',
          });

          // Sync metadata back to Supabase profiles table if out of sync
          if ((!data.avatar_url && googleAvatar) || prefersGoogleName) {
            supabase
              .from('profiles')
              .update({
                username: loadedUsername,
                avatar_url: loadedAvatar || null,
              })
              .eq('id', user.id)
              .then(({ error: syncError }) => {
                if (syncError) {
                  console.error('Failed to sync google profile info to DB:', syncError);
                }
              });
          }
        } else {
          // If no profile exists, try to insert one using Google metadata if available
          const googleName = user.user_metadata?.full_name || user.user_metadata?.name;
          const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

          const defaultUsername = googleName || user.email?.split('@')[0] || 'User';

          const newProfile = {
            id: user.id,
            username: defaultUsername,
            avatar_url: googleAvatar,
            plan_type: 'free',
            status: 'online'
          };
          await supabase.from('profiles').insert(newProfile);
          setProfile({
            username: defaultUsername,
            avatarUrl: googleAvatar || undefined,
            planType: 'free',
            status: 'online'
          });
        }
      } catch (error) {
        console.error('Failed to load user profile from Supabase:', error);
      }
    } else {
      // Offline mode: load from localStorage
      try {
        const stored = localStorage.getItem('story-writer-profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile({
            username: parsed.username || 'User',
            avatarUrl: parsed.avatarUrl || undefined,
            planType: parsed.planType || 'free',
            status: parsed.status || 'online',
          });
        } else {
          setProfile({
            username: 'Offline User',
            planType: 'free',
            status: 'online'
          });
        }
      } catch (e) {
        console.error('Failed to load user profile from localStorage:', e);
      }
    }
  };

  const handleProfileUpdate = async (data: { username: string; avatarUrl?: string; status: UserStatus }) => {
    const updated = {
      username: data.username,
      avatarUrl: data.avatarUrl,
      planType: profile.planType, // Keep same plan unless upgraded via Pricing
      status: data.status,
    };
    setProfile(updated);

    if (isSupabaseConfigured && user && supabase) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: data.username,
            avatar_url: data.avatarUrl || null,
            status: data.status,
            updated_at: new Date().toISOString(),
          });
      } catch (error) {
        console.error('Failed to save user profile to Supabase:', error);
      }
    } else {
      localStorage.setItem('story-writer-profile', JSON.stringify(updated));
    }
  };

  const handlePlanUpgrade = async (plan: UserPlanType) => {
    const updated = {
      ...profile,
      planType: plan,
    };
    setProfile(updated);

    if (isSupabaseConfigured && user && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ plan_type: plan })
          .eq('id', user.id);
      } catch (error) {
        console.error('Failed to update user plan on Supabase:', error);
      }
    } else {
      localStorage.setItem('story-writer-profile', JSON.stringify(updated));
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
      setProfile({
        username: 'User',
        planType: 'free',
        status: 'online'
      });
      return;
    }
    loadStories();
    loadProfile();
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
          userName={profile.username}
          userAvatar={profile.avatarUrl}
          userPlan={profile.planType}
          userStatus={profile.status}
          onProfileUpdate={handleProfileUpdate}
          onPlanUpgrade={handlePlanUpgrade}
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

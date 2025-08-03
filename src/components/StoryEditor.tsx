import React, { useState, useEffect } from 'react';
import type { Story, Chapter, WritingMode, Theme } from '../types/story';
import { Editor } from './Editor';
import { NavigationBar } from './Nav/NavigationBar';
import { LeftSidebar } from './Left_bar/LeftSidebar';
import { RightSidebar } from './Right_bar/RightSidebar';
import { Menu } from 'lucide-react';
import { createNewChapter, updateStoryWordCount } from '../utils/storyUtils';

interface StoryEditorProps {
  story: Story;
  onStoryUpdate: (story: Story) => void;
  onBack: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:8000';

export const StoryEditor: React.FC<StoryEditorProps> = ({ 
  story, 
  onStoryUpdate, 
  onBack, 
  theme, 
  onThemeChange 
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [leftSidebarHeight, setLeftSidebarHeight] = useState(60);
  const [leftSidebarPosition, setLeftSidebarPosition] = useState(20);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(350);
  const [rightSidebarPosition, setRightSidebarPosition] = useState(5);
  const [rightSidebarHeight, setRightSidebarHeight] = useState(70);
  const [writingMode, setWritingMode] = useState<WritingMode>('guided');
  const [leftSidebarTabs, setLeftSidebarTabs] = useState(['chapters', 'characters', 'locations', 'timeline']);
  const [rightSidebarTabs, setRightSidebarTabs] = useState(['suggestions', 'analytics', 'history', 'notes']);

  useEffect(() => {
    if (story.chapters.length > 0 && !selectedChapterId) {
      setSelectedChapterId(story.chapters[0].id);
    }
  }, [story.chapters, selectedChapterId]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth < 768;
      if (isSmallScreen) {
        setLeftSidebarWidth(Math.min(280, window.innerWidth * 0.8));
        setRightSidebarWidth(Math.min(300, window.innerWidth * 0.8));
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const updateStory = (updatedStory: Story) => {
    onStoryUpdate(updateStoryWordCount(updatedStory));
  };

  const handleChapterAdd = () => {
    try {
      const newChapter = createNewChapter(`Chapter ${story.chapters.length + 1}`);
      const updatedStory = {
        ...story,
        chapters: [...story.chapters, newChapter],
      };
      updateStory(updatedStory);
      setSelectedChapterId(newChapter.id);
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const handleChapterDelete = (chapterId: string) => {
    try {
      const updatedStory = {
        ...story,
        chapters: story.chapters.filter(ch => ch.id !== chapterId),
      };
      updateStory(updatedStory);
      
      if (selectedChapterId === chapterId) {
        setSelectedChapterId(updatedStory.chapters[0]?.id || null);
      }
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const handleChapterUpdate = (chapterId: string, updates: Partial<Chapter>) => {
    try {
      const updatedStory = {
        ...story,
        chapters: story.chapters.map(ch =>
          ch.id === chapterId ? { ...ch, ...updates } : ch
        ),
      };
      updateStory(updatedStory);
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const handleChapterEdit = (chapterId: string) => {
    try {
      setSelectedChapterId(chapterId);
    } catch (error) {
      console.error('Error selecting chapter:', error);
    }
  };

  const handleChapterSelect = (chapterId: string) => {
    try {
      setSelectedChapterId(chapterId);
    } catch (error) {
      console.error('Error selecting chapter:', error);
    }
  };

  const handleSidebarTabsChange = (sidebar: 'left' | 'right', tabs: string[]) => {
    try {
      if (sidebar === 'left') {
        setLeftSidebarTabs(tabs);
      } else {
        setRightSidebarTabs(tabs);
      }
    } catch (error) {
      console.error('Error changing sidebar tabs:', error);
    }
  };

  const handleApiCall = async (url: string, body: any, action: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(`${action} operation failed`);
    }

    return result;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await handleApiCall('/stories/save', {
        story: { ...story, updated_at: new Date().toISOString() }
      }, 'save story');
    } catch (error) {
      console.error('Error saving story:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.pdf,.epub';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const fileData = await file.arrayBuffer();
          const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileData)));
          const fileExtension = file.name.split('.').pop()?.toLowerCase();

          const result = await handleApiCall('/stories/import', {
            file_data: base64Data,
            file_name: file.name,
            file_type: fileExtension,
          }, 'import file');

          const importedStory = result.story;
          const updatedStory = {
            ...story,
            chapters: [...story.chapters, ...importedStory.chapters],
          };
          updateStory(updatedStory);
        } catch (error) {
          console.error('Error importing file:', error);
        }
      };
      input.click();
    } catch (error) {
      console.error('Error importing file:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const result = await handleApiCall('/stories/export', {
        story: { ...story, updated_at: new Date().toISOString() },
        format: 'txt',
        options: {},
      }, 'export story');

      const fileData = atob(result.file_data);
      const blob = new Blob([fileData], { type: result.content_type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${story.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting story:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedChapter = story.chapters.find(ch => ch.id === selectedChapterId) || null;
  const themeStyles = theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900';
  const isDark = theme === 'dark';

  return (
    <div className={`h-screen ${themeStyles} flex flex-col overflow-hidden`}>
      <NavigationBar
        mode="editor"
        onBack={onBack}
        onSave={handleSave}
        onImport={handleImport}
        onExport={handleExport}
        onWritingModeChange={setWritingMode}
        onThemeChange={onThemeChange}
        writingMode={writingMode}
        theme={theme}
        isSaving={isSaving}
        isExporting={isExporting}
        isImporting={isImporting}
        leftSidebarTabs={leftSidebarTabs}
        rightSidebarTabs={rightSidebarTabs}
        onSidebarTabsChange={handleSidebarTabsChange}
        leftSectionOffset={15}
        rightSectionOffset={50}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {!leftSidebarVisible && (
          <button
            onClick={() => setLeftSidebarVisible(true)}
            className={`fixed left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-50 p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
              isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <Menu className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}

        {leftSidebarVisible && (
          <LeftSidebar
            story={story}
            selectedChapter={selectedChapter}
            collapsed={false}
            onToggleCollapse={() => setLeftSidebarVisible(false)}
            onChapterAdd={handleChapterAdd}
            onChapterEdit={handleChapterEdit}
            onChapterDelete={handleChapterDelete}
            onChapterSelect={handleChapterSelect}
            onCharacterAdd={() => {}}
            onLocationAdd={() => {}}
            onTimelineAdd={() => {}}
            width={leftSidebarWidth}
            position={leftSidebarPosition}
            height={leftSidebarHeight}
            onWidthChange={setLeftSidebarWidth}
            onPositionChange={setLeftSidebarPosition}
            onHeightChange={setLeftSidebarHeight}
            onClose={() => setLeftSidebarVisible(false)}
            theme={theme}
            onCharacterEdit={() => {}}
            onCharacterDelete={() => {}}
            onLocationEdit={() => {}}
            onLocationDelete={() => {}}
            onTimelineEdit={() => {}}
            onTimelineDelete={() => {}}
            onStoryEdit={() => {}}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Editor
            chapter={selectedChapter}
            onChapterUpdate={handleChapterUpdate}
            theme={theme}
          />
        </div>

        {rightSidebarVisible && (
          <RightSidebar
            story={story}
            selectedChapter={selectedChapter}
            writingMode={writingMode}
            collapsed={false}
            onToggleCollapse={() => setRightSidebarVisible(false)}
            onChapterUpdate={handleChapterUpdate}
            visibleTabs={rightSidebarTabs}
            width={rightSidebarWidth}
            position={rightSidebarPosition}
            height={rightSidebarHeight}
            onWidthChange={setRightSidebarWidth}
            onPositionChange={setRightSidebarPosition}
            onHeightChange={setRightSidebarHeight}
            onClose={() => setRightSidebarVisible(false)}
            theme={theme}
          />
        )}

        {!rightSidebarVisible && (
          <button
            onClick={() => setRightSidebarVisible(true)}
            className={`fixed right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-50 p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
              isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <Menu className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
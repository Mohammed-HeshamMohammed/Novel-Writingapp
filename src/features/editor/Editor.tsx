import React, { useState, useEffect } from 'react';
import type { Chapter, Theme } from '../../shared/types/story';
import { calculateWordCount } from '../../shared/utils/storyUtils';
import { FileText } from 'lucide-react';

interface EditorProps {
  chapter: Chapter | null;
  theme: Theme;
  onChapterUpdate: (chapterId: string, updates: Partial<Chapter>) => void;
}

export const Editor: React.FC<EditorProps> = ({ chapter, theme, onChapterUpdate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title);
      setContent(chapter.content);
      setWordCount(chapter.wordCount);
    } else {
      setTitle('');
      setContent('');
      setWordCount(0);
    }
  }, [chapter]);

  const handleTitleChange = (newTitle: string) => {
    try {
      setTitle(newTitle);
      if (chapter) {
        onChapterUpdate(chapter.id, { title: newTitle });
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleContentChange = (newContent: string) => {
    try {
      setContent(newContent);
      const newWordCount = calculateWordCount(newContent);
      setWordCount(newWordCount);
      
      if (chapter) {
        onChapterUpdate(chapter.id, { 
          content: newContent, 
          wordCount: newWordCount,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const isDark = theme === 'dark';
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-500',
    border: isDark ? 'border-gray-700' : 'border-gray-300',
    placeholder: isDark ? 'placeholder-gray-500' : 'placeholder-gray-400'
  };

  if (!chapter) {
    return (
      <div className={`flex-1 ${themeClasses.bg} flex items-center justify-center`}>
        <div className="text-center">
          <FileText className={`w-12 h-12 ${themeClasses.textMuted} mx-auto mb-4`} />
          <h2 className={`text-xl font-medium ${themeClasses.text} mb-2`}>Select a chapter to edit</h2>
          <p className={themeClasses.textSecondary}>Choose a chapter from the sidebar to start writing</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 ${themeClasses.bg} flex flex-col h-full overflow-hidden`}>
      <div className={`p-4 md:p-6 border-b ${themeClasses.border} flex-shrink-0`}>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Chapter Title"
          className={`w-full text-xl md:text-2xl font-bold ${themeClasses.text} bg-transparent border-none outline-none ${themeClasses.placeholder}`}
        />
        <div className={`mt-2 text-sm ${themeClasses.textSecondary}`}>
          {wordCount} words
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your chapter..."
          className={`w-full h-full bg-transparent ${themeClasses.text} ${themeClasses.placeholder} border-none outline-none resize-none text-sm md:text-base leading-relaxed font-serif`}
        />
      </div>
    </div>
  );
};
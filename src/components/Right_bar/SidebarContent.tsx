import React from 'react';
import { Target, TrendingUp, Clock, Sparkles, Eye, Edit, Shuffle, Zap, FileText } from 'lucide-react';
import type { Chapter, WritingMode } from '../../types/story';

interface SidebarContentProps {
  activeTab: string;
  writingMode: WritingMode;
  selectedChapter: Chapter | null;
  onChapterUpdate?: (chapterId: string, updates: Partial<Chapter>) => void;
  theme: 'light' | 'dark';
}

interface Suggestion {
  type: string;
  title: string;
  content: string;
}

interface ModeConfig {
  icon: React.ComponentType<any>;
  color: string;
  suggestions: Suggestion[];
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { type: 'GENERAL', title: 'Continue writing', content: 'Keep writing your story at your own pace.' },
  { type: 'STYLE', title: 'Writing style', content: 'Focus on your unique voice and style.' },
  { type: 'FLOW', title: 'Story flow', content: 'Ensure your narrative flows naturally.' },
];

const MODE_CONFIG: Record<WritingMode, ModeConfig> = {
  guided: {
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    suggestions: [
      { type: 'GUIDE', title: 'Continue the story', content: 'Based on your plot, consider having the protagonist face their first major obstacle here.' },
      { type: 'STRUCTURE', title: 'Scene structure', content: 'This scene could benefit from a clear goal, conflict, and outcome.' },
      { type: 'PACING', title: 'Adjust pacing', content: 'Consider slowing down here to build tension before the climax.' },
    ]
  },
  describe: {
    icon: Eye,
    color: 'from-blue-500 to-cyan-500',
    suggestions: [
      { type: 'DESCRIBE', title: 'Enhance description', content: 'Add sensory details - what does the character smell, hear, or feel?' },
      { type: 'SETTING', title: 'Expand setting', content: 'Describe the atmosphere and mood of this location in more detail.' },
      { type: 'CHARACTER', title: 'Character details', content: 'Show the character\'s emotions through physical descriptions and actions.' },
    ]
  },
  rewrite: {
    icon: Edit,
    color: 'from-green-500 to-emerald-500',
    suggestions: [
      { type: 'REWRITE', title: 'Improve dialogue', content: 'This dialogue could be more natural and character-specific.' },
      { type: 'STYLE', title: 'Vary sentence structure', content: 'Mix short and long sentences to improve flow and rhythm.' },
      { type: 'CLARITY', title: 'Clarify meaning', content: 'This section could be clearer - consider rephrasing for better understanding.' },
    ]
  },
  brainstorm: {
    icon: Shuffle,
    color: 'from-orange-500 to-red-500',
    suggestions: [
      { type: 'BRAINSTORM', title: 'Plot possibilities', content: 'What if the character discovers a secret that changes everything?' },
      { type: 'TWIST', title: 'Potential twist', content: 'Consider revealing that the ally is actually working against the protagonist.' },
      { type: 'CONFLICT', title: 'Add conflict', content: 'Introduce an internal conflict that mirrors the external plot.' },
    ]
  },
  visualize: {
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    suggestions: [
      { type: 'VISUALIZE', title: 'Scene visualization', content: 'Imagine this scene as a movie - what would the camera focus on?' },
      { type: 'IMAGERY', title: 'Strengthen imagery', content: 'Create a vivid mental picture with metaphors and similes.' },
      { type: 'ATMOSPHERE', title: 'Build atmosphere', content: 'Use environmental details to reinforce the mood and tone.' },
    ]
  },
  focus: {
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    suggestions: [
      { type: 'FOCUS', title: 'Maintain focus', content: 'Keep the narrative centered on the main character\'s journey.' },
      { type: 'CLARITY', title: 'Clear direction', content: 'Ensure each scene moves the story forward with purpose.' },
      { type: 'TENSION', title: 'Build tension', content: 'Increase stakes and emotional investment for the reader.' },
    ]
  },
  normal: {
    icon: FileText,
    color: 'from-gray-500 to-gray-600',
    suggestions: DEFAULT_SUGGESTIONS
  },
  'distraction-free': {
    icon: FileText,
    color: 'from-gray-500 to-gray-600',
    suggestions: DEFAULT_SUGGESTIONS
  },
  typewriter: {
    icon: FileText,
    color: 'from-gray-500 to-gray-600',
    suggestions: DEFAULT_SUGGESTIONS
  }
};

const HISTORY_DATA = [
  { time: '2 minutes ago', action: 'Added 127 words to Chapter 3' },
  { time: '15 minutes ago', action: 'Created new character: Sarah' },
  { time: '1 hour ago', action: 'Edited Chapter 2 title' },
  { time: '2 hours ago', action: 'Applied suggestion: Add plot twist' },
];

export const SidebarContent: React.FC<SidebarContentProps> = ({ 
  activeTab, 
  writingMode, 
  selectedChapter, 
  onChapterUpdate,
  theme 
}) => {
  const handleNotesChange = (notes: string) => {
    try {
      if (selectedChapter && onChapterUpdate) {
        onChapterUpdate(selectedChapter.id, { notes } as Partial<Chapter>);
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleSuggestionAction = (id: string, action: string) => {
    try {
      console.log(`${action} suggestion:`, id);
    } catch (error) {
      console.error(`Error ${action} suggestion:`, error);
    }
  };

  const getThemeClasses = () => {
    return theme === 'light' ? {
      cardBg: 'bg-white/50',
      text: 'text-gray-800',
      subText: 'text-gray-600',
      border: 'border-gray-200',
      hover: 'hover:bg-white/70'
    } : {
      cardBg: 'bg-white/5',
      text: 'text-white',
      subText: 'text-gray-300',
      border: 'border-white/10',
      hover: 'hover:bg-white/10'
    };
  };

  const themeClasses = getThemeClasses();

  if (activeTab === 'suggestions') {
    const config = MODE_CONFIG[writingMode];
    const suggestions = config.suggestions.map((suggestion, index) => ({
      id: `${writingMode}-${index}`,
      ...suggestion,
      timestamp: new Date(),
    }));

    const IconComponent = config.icon;

    return (
      <div className="p-4 space-y-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${config.color} text-white shadow-lg`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <IconComponent className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Writing Assistant</h3>
          </div>
          <p className="text-white/90 text-sm">Optimized for {writingMode} mode</p>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className={`group relative overflow-hidden ${themeClasses.cardBg} backdrop-blur-sm p-4 rounded-2xl border ${themeClasses.border} ${themeClasses.hover} transition-all duration-300`}>
              <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${config.color} rounded-t-2xl`} />
              <div className="flex items-start justify-between mb-3">
                <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{suggestion.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${config.color} text-white font-medium`}>
                  {suggestion.type}
                </span>
              </div>
              <p className={`${themeClasses.subText} text-sm mb-4 leading-relaxed`}>{suggestion.content}</p>
              <div className="flex space-x-2">
                <div
                  onClick={() => handleSuggestionAction(suggestion.id, 'apply')}
                  className={`px-4 py-2 bg-gradient-to-r ${config.color} text-white text-xs rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium cursor-pointer`}
                >
                  Apply
                </div>
                <div
                  onClick={() => handleSuggestionAction(suggestion.id, 'dismiss')}
                  className={`px-4 py-2 ${themeClasses.cardBg} ${themeClasses.text} text-xs rounded-xl ${themeClasses.hover} transition-all duration-200 hover:scale-105 font-medium cursor-pointer`}
                >
                  Dismiss
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'analytics') {
    const progressBarStyles = { width: '75%' };
    const weeklyBars = [40, 60, 80, 45, 90, 75, 85];

    return (
      <div className="p-4">
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-6`}>
          Writing Analytics
        </h3>
        <div className="space-y-4">
          <div className={`relative overflow-hidden ${themeClasses.cardBg} backdrop-blur-sm p-5 rounded-2xl border ${themeClasses.border}`}>
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <span className={`${themeClasses.text} font-semibold`}>Today's Goal</span>
              </div>
            </div>
            <div className={`text-3xl font-bold ${themeClasses.text} mb-1`}>750 / 1000</div>
            <div className="text-sm text-blue-300 mb-3">words</div>
            <div className="w-full bg-gray-800/50 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-lg" 
                style={progressBarStyles}
              />
            </div>
          </div>

          <div className={`relative overflow-hidden ${themeClasses.cardBg} backdrop-blur-sm p-5 rounded-2xl border ${themeClasses.border}`}>
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-r-full" />
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className={`${themeClasses.text} font-semibold`}>Writing Streak</span>
            </div>
            <div className={`text-3xl font-bold ${themeClasses.text} mb-1`}>7</div>
            <div className="text-sm text-green-300">days</div>
          </div>

          <div className={`relative overflow-hidden ${themeClasses.cardBg} backdrop-blur-sm p-5 rounded-2xl border ${themeClasses.border}`}>
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full" />
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <span className={`${themeClasses.text} font-semibold`}>Session Time</span>
            </div>
            <div className={`text-3xl font-bold ${themeClasses.text} mb-1`}>45</div>
            <div className="text-sm text-purple-300">minutes</div>
          </div>

          <div className={`${themeClasses.cardBg} backdrop-blur-sm p-5 rounded-2xl border ${themeClasses.border}`}>
            <h4 className={`${themeClasses.text} font-semibold mb-4 flex items-center space-x-2`}>
              <div className="p-1 bg-orange-500/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <span>Weekly Progress</span>
            </h4>
            <div className="flex items-end space-x-2 h-20">
              {weeklyBars.map((height, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg flex-1 shadow-lg"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'history') {
    return (
      <div className="p-4">
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-6`}>
          Recent Changes
        </h3>
        <div className="space-y-3">
          {HISTORY_DATA.map((item, index) => (
            <div key={index} className={`group relative overflow-hidden ${themeClasses.cardBg} backdrop-blur-sm p-4 rounded-2xl border ${themeClasses.border} ${themeClasses.hover} transition-all duration-300`}>
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-r-full" />
              <div className="text-xs text-cyan-300 mb-2 font-medium">{item.time}</div>
              <div className={`text-sm ${themeClasses.text} transition-colors duration-200`}>{item.action}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'notes') {
    const notesValue = (selectedChapter as any)?.notes || '';
    
    return (
      <div className="p-4">
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-6`}>
          Chapter Notes
        </h3>
        <div className="relative">
          <textarea
            placeholder="Add notes about this chapter..."
            className={`w-full h-64 p-4 ${themeClasses.cardBg} backdrop-blur-sm ${themeClasses.text} placeholder-gray-400 rounded-2xl border ${themeClasses.border} focus:border-pink-400 focus:outline-none resize-none transition-all duration-200 focus:shadow-lg focus:shadow-pink-500/20`}
            value={notesValue}
            onChange={(e) => handleNotesChange(e.target.value)}
          />
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-30" />
        </div>
      </div>
    );
  }

  return null;
};
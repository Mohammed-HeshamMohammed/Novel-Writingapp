import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, Sparkles, Eye, Edit, Shuffle, Zap, FileText } from 'lucide-react';
import { SidebarTabs } from './SidebarTabs';
import { SidebarContent } from './SidebarContent';
import { useSidebarDrag } from './useSidebarDrag';
import type { Story, Chapter, WritingMode } from '../../types/story';

interface RightSidebarProps {
  story: Story;
  selectedChapter: Chapter | null;
  writingMode: WritingMode;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onChapterUpdate?: (chapterId: string, updates: Partial<Chapter>) => void;
  visibleTabs?: string[];
  width: number;
  position: number;
  height: number;
  onWidthChange: (width: number) => void;
  onPositionChange: (position: number) => void;
  onHeightChange: (height: number) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const MODE_ICONS: Record<WritingMode, { icon: React.ComponentType<any>; color: string }> = {
  guided: { icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  describe: { icon: Eye, color: 'from-blue-500 to-cyan-500' },
  rewrite: { icon: Edit, color: 'from-green-500 to-emerald-500' },
  brainstorm: { icon: Shuffle, color: 'from-orange-500 to-red-500' },
  visualize: { icon: Zap, color: 'from-yellow-500 to-orange-500' },
  focus: { icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  normal: { icon: FileText, color: 'from-gray-500 to-gray-600' },
  'distraction-free': { icon: FileText, color: 'from-gray-500 to-gray-600' },
  typewriter: { icon: FileText, color: 'from-gray-500 to-gray-600' }
};

export const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedChapter,
  writingMode,
  collapsed,
  onToggleCollapse,
  onChapterUpdate,
  visibleTabs = ['suggestions', 'analytics', 'history', 'notes'],
  width,
  position,
  height,
  onWidthChange,
  onPositionChange,
  onHeightChange,
  onClose,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const { handleHeaderMouseDown, DragHandle } = useSidebarDrag({
    height,
    position,
    width,
    onHeightChange,
    onPositionChange,
    onWidthChange
  });

  useEffect(() => {
    try {
      if (!visibleTabs.includes(activeTab) && visibleTabs.length > 0) {
        setActiveTab(visibleTabs[0]);
      }
    } catch (error) {
      console.error('Error updating active tab:', error);
    }
  }, [visibleTabs, activeTab]);

  const modeConfig = MODE_ICONS[writingMode];
  const IconComponent = modeConfig.icon;

  const getScrollbarStyles = () => {
    const baseColor = theme === 'light' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(139, 92, 246, 0.5)';
    const hoverColor = theme === 'light' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(139, 92, 246, 0.8)';
    
    return `
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${baseColor} transparent;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${baseColor};
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${hoverColor};
        background-clip: content-box;
      }
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
  };

  const getThemeClasses = () => {
    if (theme === 'light') {
      return {
        sidebar: 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 border-gray-200/50',
        collapsed: 'bg-gradient-to-b from-white via-gray-50 to-white border-gray-200/50',
        header: 'bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/30',
        collapsedButton: 'text-gray-600 hover:text-gray-900 bg-gradient-to-r from-purple-100/30 to-pink-100/30 hover:from-purple-200/50 hover:to-pink-200/50',
        closeButton: 'text-gray-600 hover:text-white hover:bg-red-500/30'
      };
    }
    return {
      sidebar: 'bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 border-gray-700/50',
      collapsed: 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700/50',
      header: 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700/30',
      collapsedButton: 'text-gray-400 hover:text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30',
      closeButton: 'text-gray-400 hover:text-white hover:bg-red-500/30'
    };
  };

  const themeClasses = getThemeClasses();

  if (collapsed) {
    return (
      <div className={`w-16 ${themeClasses.collapsed} backdrop-blur-sm flex flex-col transition-all duration-300 shadow-2xl rounded-r-2xl`}>
        <div className="p-4 flex items-center justify-center">
          <div 
            onClick={onToggleCollapse}
            className={`p-3 ${themeClasses.collapsedButton} rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer`}
          >
            <ChevronLeft className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  const sidebarStyles = {
    top: `${position}%`,
    height: `${height}%`,
    width: `${width}px`,
    minWidth: '350px',
    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))',
  };

  return (
    <div 
      ref={sidebarRef}
      className={`fixed right-4 z-40 ${themeClasses.sidebar} flex flex-col shadow-2xl rounded-2xl border backdrop-blur-xl overflow-hidden`}
      style={sidebarStyles}
    >
      <style>{getScrollbarStyles()}</style>

      <DragHandle type="width" />

      <div 
        className={`relative p-4 ${themeClasses.header} backdrop-blur-sm rounded-t-2xl select-none border-b`}
        onMouseDown={handleHeaderMouseDown}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${modeConfig.color} opacity-10 rounded-t-2xl`} />
        <div className="relative z-10 flex items-center justify-between">
          <div className={`flex items-center space-x-3 bg-gradient-to-r ${modeConfig.color} p-3 rounded-xl shadow-lg backdrop-blur-sm`}>
            <IconComponent className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-semibold capitalize">{writingMode}</span>
          </div>
          
          <div 
            onClick={onClose}
            className={`no-drag p-2 ${themeClasses.closeButton} rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </div>
        </div>
      </div>

      <SidebarTabs 
        visibleTabs={visibleTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        writingMode={writingMode}
        theme={theme}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <SidebarContent
          activeTab={activeTab}
          writingMode={writingMode}
          selectedChapter={selectedChapter}
          onChapterUpdate={onChapterUpdate}
          theme={theme}
        />
      </div>

      <DragHandle type="resize" />
    </div>
  );
};
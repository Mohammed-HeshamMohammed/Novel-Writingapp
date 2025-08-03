import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, History, BarChart3, MessageSquare } from 'lucide-react';

interface SidebarTabsProps {
  visibleTabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  writingMode: string;
  theme: 'light' | 'dark';
}

interface TabConfig {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  color?: string;
}

const MODE_COLORS: Record<string, string> = {
  guided: 'from-purple-500 to-pink-500',
  describe: 'from-blue-500 to-cyan-500',
  rewrite: 'from-green-500 to-emerald-500',
  brainstorm: 'from-orange-500 to-red-500',
  visualize: 'from-yellow-500 to-orange-500',
  focus: 'from-purple-500 to-pink-500',
};

const TAB_CONFIG: TabConfig[] = [
  { key: 'suggestions', label: 'Assistant', icon: Lightbulb },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
  { key: 'history', label: 'History', icon: History, color: 'from-green-500 to-emerald-500' },
  { key: 'notes', label: 'Notes', icon: MessageSquare, color: 'from-orange-500 to-red-500' },
];

export const SidebarTabs: React.FC<SidebarTabsProps> = ({ 
  visibleTabs, 
  activeTab, 
  onTabChange, 
  collapsed, 
  writingMode,
  theme 
}) => {
  const [showLabels, setShowLabels] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabs = TAB_CONFIG.filter(tab => visibleTabs.includes(tab.key));

  const handleTabsWheel = (e: React.WheelEvent) => {
    const tabsElement = tabsRef.current;
    if (!tabsElement) return;

    const canScroll = tabsElement.scrollWidth > tabsElement.clientWidth;
    if (canScroll) {
      e.preventDefault();
      tabsElement.scrollBy({ left: e.deltaY > 0 ? 60 : -60, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (tabsRef.current) {
      const containerWidth = tabsRef.current.clientWidth;
      const tabCount = tabs.length;
      const maxTabWidth = 120;
      
      if (tabCount > 2) {
        setShowLabels(false);
      } else {
        const availableWidth = containerWidth / tabCount;
        setShowLabels(availableWidth >= maxTabWidth);
      }
    }
  }, [tabs.length, collapsed]);

  const getBgClass = () => {
    return theme === 'light' 
      ? 'bg-gradient-to-r from-gray-100/50 to-gray-200/50 border-gray-300/30'
      : 'bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/30';
  };

  const getTextClass = (isActive: boolean) => {
    if (theme === 'light') {
      return isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900';
    }
    return isActive ? 'text-white' : 'text-gray-400 hover:text-white';
  };

  const getIconBgClass = (isActive: boolean, tabColor: string) => {
    if (isActive) {
      return `bg-gradient-to-r ${tabColor} shadow-lg`;
    }
    return theme === 'light' 
      ? 'bg-gray-200/50 hover:bg-gray-300/50'
      : 'bg-gray-800/50 hover:bg-gray-700/50';
  };

  const getIconTextClass = (isActive: boolean) => {
    if (isActive) return 'text-white';
    return theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  };

  const getGradientTextClass = (isActive: boolean) => {
    if (isActive) {
      return theme === 'light' 
        ? 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
        : 'bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent';
    }
    return '';
  };

  return (
    <div className={`relative ${getBgClass()} backdrop-blur-sm border-b`}>
      <div 
        ref={tabsRef}
        className="flex overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onWheel={handleTabsWheel}
      >
        {tabs.map((tab) => {
          const tabColor = tab.key === 'suggestions' 
            ? MODE_COLORS[writingMode] || MODE_COLORS.guided 
            : tab.color || MODE_COLORS.guided;
          
          return (
            <div
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${
                tabs.length > 2 ? 'min-w-[60px]' : 'min-w-[120px]'
              } ${getTextClass(activeTab === tab.key)}`}
            >
              {activeTab === tab.key && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tabColor} opacity-20`} />
              )}
              <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${getIconBgClass(activeTab === tab.key, tabColor)}`}>
                <tab.icon className={`w-4 h-4 ${getIconTextClass(activeTab === tab.key)}`} />
              </div>
              {showLabels && (
                <span className={`relative z-10 font-semibold ${getGradientTextClass(activeTab === tab.key)}`}>
                  {tab.label}
                </span>
              )}
              {activeTab === tab.key && (
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tabColor}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
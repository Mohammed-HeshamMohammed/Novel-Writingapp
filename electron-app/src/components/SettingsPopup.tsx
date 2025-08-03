import React from 'react';
import { X, Settings } from 'lucide-react';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  leftSidebarTabs: string[];
  rightSidebarTabs: string[];
  onSidebarTabsChange: (sidebar: 'left' | 'right', tabs: string[]) => void;
}

export const SettingsPopup: React.FC<SettingsPopupProps> = ({
  isOpen,
  onClose,
  leftSidebarTabs,
  rightSidebarTabs,
  onSidebarTabsChange,
}) => {
  const leftAvailableTabs = [
    { key: 'chapters', label: 'Chapters' },
    { key: 'characters', label: 'Characters' },
    { key: 'locations', label: 'Locations' },
    { key: 'timeline', label: 'Timeline' },
  ];

  const rightAvailableTabs = [
    { key: 'suggestions', label: 'Assistant' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'history', label: 'History' },
    { key: 'notes', label: 'Notes' },
  ];

  const handleTabToggle = (sidebar: 'left' | 'right', tabKey: string) => {
    try {
      const currentTabs = sidebar === 'left' ? leftSidebarTabs : rightSidebarTabs;
      const newTabs = currentTabs.includes(tabKey)
        ? currentTabs.filter((tab) => tab !== tabKey)
        : [...currentTabs, tabKey];
      onSidebarTabsChange(sidebar, newTabs);
    } catch (error) {
      console.error('Error toggling tab:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between mb-8 border-b border-gray-700/50 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            Sidebar Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              Left Sidebar Tabs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leftAvailableTabs.map((tab) => (
                <label
                  key={tab.key}
                  className="flex items-center space-x-4 cursor-pointer p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <input
                    type="checkbox"
                    checked={leftSidebarTabs.includes(tab.key)}
                    onChange={() => handleTabToggle('left', tab.key)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-200 font-medium text-lg">{tab.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700/50 pt-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              Right Sidebar Tabs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rightAvailableTabs.map((tab) => (
                <label
                  key={tab.key}
                  className="flex items-center space-x-4 cursor-pointer p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <input
                    type="checkbox"
                    checked={rightSidebarTabs.includes(tab.key)}
                    onChange={() => handleTabToggle('right', tab.key)}
                    className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-500 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-200 font-medium text-lg">{tab.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { FileText, Users, MapPin, Clock, Plus, Edit, Trash2, Calendar, User, Home } from 'lucide-react';
import type { Chapter } from '../../types/story';

interface SidebarContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filteredItems: any;
  selectedChapter: Chapter | null;
  themeClasses: any;
  onChapterSelect: (id: string) => void;
  onChapterAdd: () => void;
  onEdit: (type: string, id: string) => void;
  onDelete: (type: string, id: string) => void;
  onAdd: (type: string) => void;
}

const TABS = [
  { key: 'chapters', icon: FileText, label: 'Chapters' },
  { key: 'characters', icon: Users, label: 'Characters' },
  { key: 'locations', icon: MapPin, label: 'Locations' },
  { key: 'timeline', icon: Clock, label: 'Timeline' },
];

const ITEM_CONFIGS = {
  chapters: { icon: User, nameField: 'title' },
  characters: { icon: User, nameField: 'name' },
  locations: { icon: Home, nameField: 'name' },
  timeline: { icon: Calendar, nameField: 'title' }
};

export const SidebarContent: React.FC<SidebarContentProps> = ({
  activeTab,
  onTabChange,
  filteredItems,
  selectedChapter,
  themeClasses,
  onChapterSelect,
  onChapterAdd,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const renderItemActions = (type: string, id: string) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onEdit(type, id)}
        className={`p-2 ${themeClasses.hover} rounded-lg transition-colors opacity-0 group-hover:opacity-100`}
        title={`Edit ${type.slice(0, -1)}`}
        aria-label={`Edit ${type.slice(0, -1)}`}
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(type, id)}
        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title={`Delete ${type.slice(0, -1)}`}
        aria-label={`Delete ${type.slice(0, -1)}`}
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );

  const renderEmptyState = (type: string) => {
    const configs = {
      chapters: { icon: FileText, text: 'No chapters yet', action: 'Create your first chapter', onAction: onChapterAdd },
      characters: { icon: Users, text: 'No characters yet', action: 'Add character', onAction: () => onAdd('character') },
      locations: { icon: MapPin, text: 'No locations yet', action: 'Add location', onAction: () => onAdd('location') },
      timeline: { icon: Clock, text: 'No timeline yet', action: 'Add timeline event', onAction: () => onAdd('timeline') }
    };

    const config = configs[type as keyof typeof configs];
    if (!config) return null;

    return (
      <div className="flex flex-col items-center justify-center h-40 space-y-4">
        <config.icon className={`w-12 h-12 ${themeClasses.subText}`} />
        <p className={`${themeClasses.subText} text-center`}>{config.text}</p>
        <button
          onClick={config.onAction}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {config.action}
        </button>
      </div>
    );
  };

  const renderChapters = () => {
    if (!filteredItems.chapters.length) return renderEmptyState('chapters');

    return (
      <div className="space-y-3">
        {filteredItems.chapters.map((chapter: any) => (
          <div key={chapter.id} className={`group relative ${themeClasses.cardBg} backdrop-blur-sm p-4 rounded-xl border ${themeClasses.border} ${themeClasses.hover} transition-all duration-300`}>
            <div className="flex items-start justify-between">
              <div className="flex-1 cursor-pointer" onClick={() => onChapterSelect(chapter.id)}>
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className={`font-semibold ${themeClasses.text}`}>
                    Chapter {chapter.number !== undefined && chapter.number !== '' ? chapter.number : 'Untitled'}
                  </h4>
                </div>
                <p className={`text-sm ${themeClasses.text} mb-1`}>{chapter.title || 'Untitled Chapter'}</p>
                <p className={`text-xs ${themeClasses.subText}`}>
                  {chapter.wordCount || 0} words • {chapter.status || 'Draft'}
                </p>
              </div>
              {renderItemActions('chapters', chapter.id)}
            </div>
            {selectedChapter?.id === chapter.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderGenericItems = (items: any[], type: string) => {
    if (!items.length) return renderEmptyState(type);
    
    const config = ITEM_CONFIGS[type as keyof typeof ITEM_CONFIGS];
    if (!config) return null;

    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className={`group ${themeClasses.cardBg} backdrop-blur-sm p-4 rounded-xl border ${themeClasses.border} ${themeClasses.hover} transition-all duration-300`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <config.icon className={`w-5 h-5 ${themeClasses.subText} mt-1`} />
                <div className="flex-1">
                  <h4 className={`font-semibold ${themeClasses.text} mb-1`}>{item[config.nameField]}</h4>
                  {item.role && <p className={`text-sm ${themeClasses.subText} mb-1`}>{item.role}</p>}
                  {item.date && <p className={`text-sm ${themeClasses.subText} mb-1`}>{item.date}</p>}
                  {item.description && <p className={`text-xs ${themeClasses.subText} line-clamp-2`}>{item.description}</p>}
                </div>
              </div>
              {renderItemActions(type, item.id)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chapters': return renderChapters();
      case 'characters': return renderGenericItems(filteredItems.characters, 'characters');
      case 'locations': return renderGenericItems(filteredItems.locations, 'locations');
      case 'timeline': return renderGenericItems(filteredItems.timeline, 'timeline');
      default: return null;
    }
  };

  const renderAddButton = () => {
    const configs = {
      chapters: { text: 'Add Chapter', action: onChapterAdd },
      characters: { text: 'Add Character', action: () => onAdd('character') },
      locations: { text: 'Add Location', action: () => onAdd('location') },
      timeline: { text: 'Add Timeline Event', action: () => onAdd('timeline') }
    };

    const config = configs[activeTab as keyof typeof configs];
    if (!config) return null;

    return (
      <div className="mb-4">
        <button
          onClick={config.action}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{config.text}</span>
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`flex border-b ${themeClasses.border}`}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 flex items-center justify-center px-4 py-3 transition-all duration-200 ${
              activeTab === tab.key
                ? `${themeClasses.text} bg-blue-500/20 border-b-2 border-blue-500`
                : `${themeClasses.subText} ${themeClasses.hover}`
            }`}
            title={tab.label}
            aria-label={`Switch to ${tab.label} tab`}
          >
            <tab.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderAddButton()}
        {renderTabContent()}
      </div>
    </>
  );
};
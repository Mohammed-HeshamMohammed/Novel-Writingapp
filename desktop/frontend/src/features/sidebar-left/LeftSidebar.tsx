import React, { useState, useRef } from 'react';
import { X, ChevronLeft, Search } from 'lucide-react';
import { useSidebarDrag } from './useSidebarDrag';
import { SidebarContent } from './SidebarContent';
import { SidebarModal } from './SidebarModal';
import type { Story, Chapter } from '../../shared/types/story';

interface LeftSidebarProps {
  story: Story;
  selectedChapter: Chapter | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onChapterAdd: () => void;
  onChapterEdit: (chapterId: string, updates: any) => void;
  onChapterDelete: (chapterId: string) => void;
  onChapterSelect: (chapterId: string) => void;
  onCharacterAdd: (character: any) => void;
  onCharacterEdit: (characterId: string, updates: any) => void;
  onCharacterDelete: (characterId: string) => void;
  onLocationAdd: (location: any) => void;
  onLocationEdit: (locationId: string, updates: any) => void;
  onLocationDelete: (locationId: string) => void;
  onTimelineAdd: (event: any) => void;
  onTimelineEdit: (eventId: string, updates: any) => void;
  onTimelineDelete: (eventId: string) => void;
  onStoryEdit: () => void;
  width: number;
  position: number;
  height: number;
  onWidthChange: (width: number) => void;
  onPositionChange: (position: number) => void;
  onHeightChange: (height: number) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  story,
  selectedChapter,
  collapsed,
  onToggleCollapse,
  onChapterAdd,
  onChapterEdit,
  onChapterDelete,
  onChapterSelect,
  onCharacterAdd,
  onCharacterEdit,
  onCharacterDelete,
  onLocationAdd,
  onLocationEdit,
  onLocationDelete,
  onTimelineAdd,
  onTimelineEdit,
  onTimelineDelete,
  onStoryEdit,
  width,
  position,
  height,
  onWidthChange,
  onPositionChange,
  onHeightChange,
  onClose,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<string>('chapters');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [showModal, setShowModal] = useState<{ type: string; item?: any } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const { handleHeaderMouseDown, DragHandle } = useSidebarDrag({
    height,
    position,
    width,
    onHeightChange,
    onPositionChange,
    onWidthChange
  });

  const themeClasses = theme === 'light' ? {
    sidebar: 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 border-gray-200/50',
    collapsed: 'bg-gradient-to-b from-white via-gray-50 to-white border-gray-200/50',
    header: 'bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/30',
    collapsedButton: 'text-gray-600 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-200/50',
    closeButton: 'text-gray-600 hover:text-white hover:bg-red-500',
    text: 'text-gray-800',
    subText: 'text-gray-600',
    cardBg: 'bg-white/50',
    border: 'border-gray-200',
    hover: 'hover:bg-white/70',
    input: 'bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500'
  } : {
    sidebar: 'bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 border-gray-700/50',
    collapsed: 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700/50',
    header: 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700/30',
    collapsedButton: 'text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50',
    closeButton: 'text-gray-400 hover:text-white hover:bg-red-500',
    text: 'text-white',
    subText: 'text-gray-300',
    cardBg: 'bg-white/5',
    border: 'border-white/10',
    hover: 'hover:bg-white/10',
    input: 'bg-white/5 border-white/10 text-white placeholder-gray-400'
  };

  const handleConfirmDelete = (type: string, id: string) => {
    try {
      const actions = {
        chapters: () => onChapterDelete(id),
        characters: () => onCharacterDelete(id),
        locations: () => onLocationDelete(id),
        timeline: () => onTimelineDelete(id)
      };
      actions[type as keyof typeof actions]?.();
      setDeleteConfirm(null);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleModalSubmit = (type: string, data: any, item?: any) => {
    try {
      if (item) {
        const editActions = {
          chapter: () => onChapterEdit(item.id, data),
          character: () => onCharacterEdit(item.id, data),
          location: () => onLocationEdit(item.id, data),
          timeline: () => onTimelineEdit(item.id, data)
        };
        editActions[type as keyof typeof editActions]?.();
      } else {
        const newItem = { id: Date.now().toString(), ...data, createdAt: new Date().toISOString() };
        const addActions = {
          character: () => onCharacterAdd(newItem),
          location: () => onLocationAdd(newItem),
          timeline: () => onTimelineAdd(newItem)
        };
        addActions[type as keyof typeof addActions]?.();
      }
      setShowModal(null);
    } catch (error) {
      console.error(`Error ${item ? 'updating' : 'adding'} ${type}:`, error);
    }
  };

  const filteredItems = (() => {
    const searchLower = searchTerm.toLowerCase();
    return {
      chapters: story.chapters?.filter(chapter => 
        chapter.title.toLowerCase().includes(searchLower) ||
        (chapter.number && String(chapter.number).toLowerCase().includes(searchLower))
      ) || [],
      characters: story.characters?.filter((char: { name: string; }) => 
        char.name.toLowerCase().includes(searchLower)
      ) || [],
      locations: story.locations?.filter((loc: { name: string; }) => 
        loc.name.toLowerCase().includes(searchLower)
      ) || [],
      timeline: story.timeline?.filter((event: { title: string; }) => 
        event.title.toLowerCase().includes(searchLower)
      ) || []
    };
  })();

  const totalWords = story.chapters?.reduce((total, chapter) => total + (chapter.wordCount || 0), 0) || 0;

  if (collapsed) {
    return (
      <div className={`fixed left-4 top-1/2 -translate-y-1/2 w-16 ${themeClasses.collapsed} backdrop-blur-sm flex flex-col transition-all duration-300 shadow-2xl rounded-2xl z-40`}>
        <div className="p-4 flex items-center justify-center">
          <button 
            onClick={onToggleCollapse}
            className={`p-3 ${themeClasses.collapsedButton} rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer`}
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  const sidebarStyle = {
    top: `${position}%`,
    height: `${height}%`,
    width: `${width}px`,
    minWidth: '320px',
  };

  return (
    <div 
      ref={sidebarRef}
      className={`left-4 z-40 fixed flex flex-col shadow-2xl rounded-2xl border backdrop-blur-xl overflow-hidden ${themeClasses.sidebar}`}
      style={sidebarStyle}
    >
      <DragHandle type="width" />

      <div 
        className={`relative p-4 ${themeClasses.header} backdrop-blur-sm rounded-t-2xl select-none border-b ${themeClasses.border}`}
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1 cursor-pointer" onClick={onStoryEdit}>
            <h3 className={`text-lg font-bold ${themeClasses.text}`}>{story.title}</h3>
            <p className={`text-xs ${themeClasses.subText}`}>
              {story.chapters?.length || 0} chapters • {totalWords} words
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`no-drag p-2 ${themeClasses.closeButton} rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer`}
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`p-4 border-b ${themeClasses.border}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${themeClasses.subText}`} />
          <input
            type="text"
            placeholder="Search story..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-xl border focus:outline-none focus:border-blue-400 transition-colors`}
          />
        </div>
      </div>

      <SidebarContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filteredItems={filteredItems}
        selectedChapter={selectedChapter}
        themeClasses={themeClasses}
        onChapterSelect={onChapterSelect}
        onChapterAdd={onChapterAdd}
        onEdit={(type, id) => {
          const collections = { chapters: story.chapters, characters: story.characters, locations: story.locations, timeline: story.timeline };
          const item = collections[type as keyof typeof collections]?.find((item: any) => item.id === id);
          setShowModal({ type: type.slice(0, -1), item });
        }}
        onDelete={(type, id) => setDeleteConfirm({ type, id })}
        onAdd={(type) => setShowModal({ type })}
      />

      {deleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${themeClasses.cardBg} p-6 rounded-2xl border ${themeClasses.border} backdrop-blur-xl`}>
            <p className={`${themeClasses.text} mb-4 text-center`}>
              Are you sure you want to delete this {deleteConfirm.type.slice(0, -1)}?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleConfirmDelete(deleteConfirm.type, deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`flex-1 px-4 py-2 ${themeClasses.cardBg} ${themeClasses.text} rounded-xl border ${themeClasses.border} ${themeClasses.hover} transition-colors`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <SidebarModal
          type={showModal.type}
          item={showModal.item}
          themeClasses={themeClasses}
          onSubmit={(data) => handleModalSubmit(showModal.type, data, showModal.item)}
          onClose={() => setShowModal(null)}
        />
      )}

      <DragHandle type="resize" />
    </div>
  );
};
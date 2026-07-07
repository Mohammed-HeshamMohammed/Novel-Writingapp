import React, { useState, useRef, useEffect } from 'react';
import { Grid, List, Filter, SortAsc, X } from 'lucide-react';

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
  '#10ac84', '#ee5a24', '#0abde3', '#c44569', '#f368e0',
  '#3742fa', '#2f3542', '#ff3838', '#70a1ff', '#7bed9f'
];

const filterColorMap = new Map<string, string>();

const getUniqueColorForFilter = (value: string): string => {
  if (filterColorMap.has(value)) {
    return filterColorMap.get(value)!;
  }
  
  const usedColors = new Set(filterColorMap.values());
  const availableColors = colors.filter(color => !usedColors.has(color));
  
  const selectedColor = availableColors.length > 0 
    ? availableColors[Math.floor(Math.random() * availableColors.length)]
    : colors[Math.floor(Math.random() * colors.length)];
  
  filterColorMap.set(value, selectedColor);
  return selectedColor;
};

const getThemeStyles = (theme: 'light' | 'dark') => {
  const lightStyles = {
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    button: 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500',
    dropdown: 'bg-white border-gray-300 shadow-xl',
    dropdownArrow: 'bg-white border-gray-300',
    checkboxStroke: '#c8ccd4',
    checkboxRipple: 'rgba(34, 50, 84, 0.03)',
    itemHover: 'hover:bg-gray-50',
    clearButton: 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 hover:text-gray-800',
    scrollArrow: 'bg-gray-200 text-gray-600',
    activeSort: 'bg-blue-50 text-blue-600',
    viewModeActive: 'bg-blue-500 text-white',
    viewModeInactive: 'bg-white text-gray-500 hover:bg-gray-50',
    border: 'border-gray-300',
  };

  const darkStyles = {
    text: 'text-white',
    textSecondary: 'text-slate-300',
    button: 'bg-gray-800 border-gray-600 text-gray-200 hover:border-gray-500 focus:border-blue-400 focus:ring-blue-400',
    dropdown: 'bg-gray-800 border-gray-600 shadow-gray-900/20',
    dropdownArrow: 'bg-gray-800 border-gray-600',
    checkboxStroke: '#64748b',
    checkboxRipple: 'rgba(255, 255, 255, 0.08)',
    itemHover: 'hover:bg-gray-700',
    clearButton: 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-gray-100',
    scrollArrow: 'bg-gray-600 text-gray-300',
    activeSort: 'bg-blue-900/30 text-blue-400',
    viewModeActive: 'bg-blue-600 text-white',
    viewModeInactive: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
    border: 'border-gray-600',
  };

  return theme === 'light' ? lightStyles : darkStyles;
};

const CustomCheckbox: React.FC<{ 
  id: string; 
  checked: boolean; 
  onChange: () => void;
  value: string;
  theme: 'light' | 'dark';
}> = ({ id, checked, onChange, value, theme }) => {
  const color = getUniqueColorForFilter(value);
  const styles = getThemeStyles(theme);
  
  return (
    <div className="checkbox-container">
      <style>{`
        .checkbox-container .check {
          cursor: pointer;
          position: relative;
          margin: auto;
          width: 18px;
          height: 18px;
          -webkit-tap-highlight-color: transparent;
          transform: translate3d(0, 0, 0);
        }
        .checkbox-container .check:before {
          content: "";
          position: absolute;
          top: -15px;
          left: -15px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: ${styles.checkboxRipple};
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .checkbox-container .check svg {
          position: relative;
          z-index: 1;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke: ${styles.checkboxStroke};
          stroke-width: 1.5;
          transform: translate3d(0, 0, 0);
          transition: all 0.2s ease;
        }
        .checkbox-container .check svg path {
          stroke-dasharray: 60;
          stroke-dashoffset: 0;
        }
        .checkbox-container .check svg polyline {
          stroke-dasharray: 22;
          stroke-dashoffset: 66;
        }
        .checkbox-container .check:hover:before {
          opacity: 1;
        }
        .checkbox-container .check:hover svg {
          stroke: ${color};
        }
        .checkbox-container input:checked + .check svg {
          stroke: ${color};
        }
        .checkbox-container input:checked + .check svg path {
          stroke-dashoffset: 60;
          transition: all 0.3s linear;
        }
        .checkbox-container input:checked + .check svg polyline {
          stroke-dashoffset: 42;
          transition: all 0.2s linear;
          transition-delay: 0.15s;
        }
      `}</style>
      <input 
        type="checkbox" 
        id={id} 
        className="hidden"
        checked={checked}
        onChange={onChange}
        aria-label={`Filter by ${value}`}
      />
      <label htmlFor={id} className="check">
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z" />
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </label>
    </div>
  );
};

const ScrollArrow: React.FC<{ direction: 'up' | 'down'; theme: 'light' | 'dark' }> = ({ direction, theme }) => {
  const styles = getThemeStyles(theme);
  return (
    <div className={`absolute ${direction === 'up' ? 'top-2' : 'bottom-2'} left-1/2 transform -translate-x-1/2 z-10 pointer-events-none`}>
      <div className={`w-6 h-6 rounded-full ${styles.scrollArrow} flex items-center justify-center shadow-md`}>
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-current">
          <path 
            d={direction === 'up' ? "M6 3L2 7h8L6 3z" : "M6 9L2 5h8L6 9z"}
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

const filterOptions = [
  { value: 'all', label: 'All Stories', emoji: '📚' },
  { value: 'bookmarked', label: 'Bookmarked', emoji: '⭐' },
  { value: 'recent', label: 'Recent', emoji: '🕒' },
  { value: 'male', label: 'Male', emoji: '👨‍🦰' },
  { value: 'female', label: 'Female', emoji: '👩‍🦰' },
  { value: 'non-binary', label: 'Non-binary', emoji: '🌈' },
  { value: 'oc', label: 'OC', emoji: '🧑‍🎨' },
  { value: 'fictional', label: 'Fictional', emoji: '📚' },
  { value: 'game', label: 'Game', emoji: '🎮' },
  { value: 'anime', label: 'Anime', emoji: '📺' },
  { value: 'historical', label: 'Historical', emoji: '🏰' },
  { value: 'royalty', label: 'Royalty', emoji: '👑' },
  { value: 'detective', label: 'Detective', emoji: '🕵️‍♀️' },
  { value: 'hero', label: 'Hero', emoji: '🦸‍♂️' },
  { value: 'villain', label: 'Villain', emoji: '🦹‍♂️' },
  { value: 'magical', label: 'Magical', emoji: '🔮' },
  { value: 'non-human', label: 'Non-human', emoji: '🦄' },
  { value: 'monster', label: 'Monster', emoji: '👹' },
  { value: 'monster-girl', label: 'Monster Girl', emoji: '👧' },
  { value: 'robot', label: 'Robot', emoji: '🤖' },
  { value: 'vampire', label: 'Vampire', emoji: '🧛‍♂️' },
  { value: 'elf', label: 'Elf', emoji: '🧝‍♀️' },
  { value: 'multiple', label: 'Multiple', emoji: '👭' },
  { value: 'vtuber', label: 'VTuber', emoji: '👩🏼‍💻' },
  { value: 'dominant', label: 'Dominant', emoji: '⛓️' },
  { value: 'submissive', label: 'Submissive', emoji: '🙇' },
  { value: 'scenario', label: 'Scenario', emoji: '🪢' },
  { value: 'non-english', label: 'Non-English', emoji: '🌎' },
  { value: 'mature', label: 'Mature', emoji: '🧑‍🦳' },
  { value: 'fantasy', label: 'Fantasy', emoji: '🧙‍♂️' },
  { value: 'roleplay', label: 'Roleplay', emoji: '🎭' },
  { value: 'furry', label: 'Furry', emoji: '🐾' },
  { value: 'action', label: 'Action', emoji: '💥' },
  { value: 'romance', label: 'Romance', emoji: '💖' },
  { value: 'comedy', label: 'Comedy', emoji: '😂' },
  { value: 'drama', label: 'Drama', emoji: '🎭' },
  { value: 'horror', label: 'Horror', emoji: '👻' },
  { value: 'adventure', label: 'Adventure', emoji: '⚔️' },
  { value: 'mystery', label: 'Mystery', emoji: '🔍' },
  { value: 'wholesome', label: 'Wholesome', emoji: '🌞' },
  { value: 'demon', label: 'Demon', emoji: '😈' },
  { value: 'tsundere', label: 'Tsundere', emoji: '🌸' },
  { value: 'goddess', label: 'Goddess', emoji: '👸' },
  { value: 'military', label: 'Military', emoji: '🎖️' },
  { value: 'maid', label: 'Maid', emoji: '👗' },
  { value: 'warrior', label: 'Warrior', emoji: '👊' },
  { value: 'school', label: 'School', emoji: '🏫' },
  { value: 'shy', label: 'Shy', emoji: '🙈' },
  { value: 'werewolf', label: 'Werewolf', emoji: '🐺' },
  { value: 'goth', label: 'Goth', emoji: '🦇' }
];

const sortOptions = [
  { value: 'updated', label: 'Latest Updated' },
  { value: 'created', label: 'Date Created' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'titleDesc', label: 'Title Z-A' },
  { value: 'author', label: 'Author A-Z' },
  { value: 'wordCount', label: 'Word Count' },
  { value: 'wordCountDesc', label: 'Word Count (Desc)' },
  { value: 'readingTime', label: 'Reading Time' },
  { value: 'readingTimeDesc', label: 'Reading Time (Desc)' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'progress', label: 'Reading Progress' },
  { value: 'chapters', label: 'Chapter Count' }
];

interface StoryFiltersProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  filterBy: string[];
  onFilterChange: (filterBy: string[]) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  theme?: 'light' | 'dark';
}

export const StoryFilters: React.FC<StoryFiltersProps> = ({
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  viewMode,
  onViewModeChange,
  theme = 'light'
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [canSortScrollUp, setCanSortScrollUp] = useState(false);
  const [canSortScrollDown, setCanSortScrollDown] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sortScrollContainerRef = useRef<HTMLDivElement>(null);

  const styles = getThemeStyles(theme);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight);
    }
  };

  const handleSortScroll = () => {
    if (sortScrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = sortScrollContainerRef.current;
      setCanSortScrollUp(scrollTop > 0);
      setCanSortScrollDown(scrollTop + clientHeight < scrollHeight);
    }
  };

  const handleClearFilters = () => {
    try {
      onFilterChange(['all']);
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  const handleFilterToggle = (filterValue: string) => {
    try {
      if (filterValue === 'all') {
        onFilterChange(['all']);
      } else {
        const newFilters = filterBy.includes('all') ? [] : [...filterBy];
        if (newFilters.includes(filterValue)) {
          const filtered = newFilters.filter(f => f !== filterValue);
          onFilterChange(filtered.length ? filtered : ['all']);
        } else {
          onFilterChange([...newFilters.filter(f => f !== 'all'), filterValue]);
        }
      }
    } catch (error) {
      console.error('Error toggling filter:', error);
    }
  };

  const getDropdownPosition = (isFilter: boolean) => {
    if (typeof window === 'undefined') return 'left-0';
    
    const screenWidth = window.innerWidth;
    const dropdownWidth = isFilter ? 600 : 300;
    
    if (screenWidth < dropdownWidth + 100) {
      return 'right-0';
    }
    
    return 'left-1/2 -translate-x-1/2';
  };

  const getDisplayText = () => {
    if (filterBy.includes('all') || filterBy.length === 0) return 'All Stories';
    if (filterBy.length === 1) {
      const option = filterOptions.find(opt => opt.value === filterBy[0]);
      return option?.label || filterBy[0];
    }
    return `${filterBy.length} filters selected`;
  };

  const getSortDisplayText = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option?.label || sortBy;
  };

  const hasActiveFilters = !filterBy.includes('all') && filterBy.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && scrollContainerRef.current) {
      handleScroll();
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isSortDropdownOpen && sortScrollContainerRef.current) {
      handleSortScroll();
    }
  }, [isSortDropdownOpen]);

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div className="w-full px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 mb-4 sm:mb-6 transition-colors duration-200">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center relative group">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-between min-w-[120px] sm:min-w-[150px] px-3 py-2 border rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 transition-colors duration-200 ${styles.button}`}
                aria-label="Filter stories"
              >
                <span className="truncate">{getDisplayText()}</span>
                <Filter className="w-4 h-4 ml-2 flex-shrink-0" />
              </button>

              {isDropdownOpen && (
                <div ref={dropdownRef} className={`absolute pointer-events-auto backdrop-blur-sm rounded-lg shadow-lg border transition-all duration-200 ease-in-out top-full translate-y-2 mt-2 z-[9999] w-[min(600px,calc(100vw-2rem))] ${getDropdownPosition(true)} ${styles.dropdown}`}>
                  <div className={`absolute w-2 h-2 transform rotate-45 top-[-4px] left-6 border-l border-t ${styles.dropdownArrow}`}></div>
                  <div className="relative max-h-80 overflow-hidden rounded-b-lg">
                    {canScrollUp && <ScrollArrow direction="up" theme={theme} />}
                    <div
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto scrollbar-hide"
                    >
                      {filterOptions.map(option => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors duration-150 ${styles.itemHover}`}
                        >
                          <CustomCheckbox
                            id={`filter-${option.value}`}
                            checked={filterBy.includes(option.value) || (option.value === 'all' && filterBy.includes('all'))}
                            onChange={() => handleFilterToggle(option.value)}
                            value={option.value}
                            theme={theme}
                          />
                          <span className="text-lg mr-1">{option.emoji}</span>
                          <span className={`text-sm select-none ${styles.text}`}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {canScrollDown && <ScrollArrow direction="down" theme={theme} />}
                  </div>
                </div>
              )}
            </div>

            <div className="inline-flex items-center relative group">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className={`flex items-center justify-between min-w-[120px] sm:min-w-[150px] px-3 py-2 border rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 transition-colors duration-200 ${styles.button}`}
                aria-label="Sort stories"
              >
                <span className="truncate">{getSortDisplayText()}</span>
                <SortAsc className="w-4 h-4 ml-2 flex-shrink-0" />
              </button>

              {isSortDropdownOpen && (
                <div ref={sortDropdownRef} className={`absolute pointer-events-auto backdrop-blur-sm rounded-lg shadow-lg border transition-all duration-200 ease-in-out top-full translate-y-2 mt-2 z-[9999] w-[min(300px,calc(100vw-2rem))] ${getDropdownPosition(false)} ${styles.dropdown}`}>
                  <div className={`absolute w-2 h-2 transform rotate-45 top-[-4px] left-6 border-l border-t ${styles.dropdownArrow}`}></div>
                  <div className="relative max-h-80 overflow-hidden rounded-b-lg">
                    {canSortScrollUp && <ScrollArrow direction="up" theme={theme} />}
                    <div 
                      ref={sortScrollContainerRef} 
                      onScroll={handleSortScroll} 
                      className="p-4 grid grid-cols-1 gap-1 max-h-80 overflow-y-auto scrollbar-hide"
                    >
                      {sortOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 p-2 rounded cursor-pointer text-left transition-colors duration-150 ${styles.itemHover} ${
                            sortBy === option.value ? styles.activeSort : styles.text
                          }`}
                        >
                          <span className="text-sm select-none">{option.label}</span>
                        </button>
                      ))}
                    </div>
                    {canSortScrollDown && <ScrollArrow direction="down" theme={theme} />}
                  </div>
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm cursor-pointer transition-colors duration-200 ${styles.clearButton}`}
                aria-label="Clear all filters"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <div className={`flex rounded-md border overflow-hidden ${styles.border}`}>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2.5 cursor-pointer transition-colors duration-200 ${
                  viewMode === 'grid' ? styles.viewModeActive : styles.viewModeInactive
                }`}
                aria-label="Grid view"
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2.5 border-l cursor-pointer transition-colors duration-200 ${styles.border} ${
                  viewMode === 'list' ? styles.viewModeActive : styles.viewModeInactive
                }`}
                aria-label="List view"
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
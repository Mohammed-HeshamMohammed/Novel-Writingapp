import React, { useState, useRef, useEffect } from 'react';
import { Grid, List, Filter, SortAsc, X, ChevronDown } from 'lucide-react';
import { filterOptions, sortOptions } from '../../shared/types/story';
import { getColorForFilterValue } from './data/filterChipColors';

const getThemeStyles = (theme: 'light' | 'dark') => {
  const lightStyles = {
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    bar: 'bg-white border-gray-300',
    segment: 'text-gray-700 hover:bg-gray-100',
    segmentActive: 'bg-blue-50 text-blue-700',
    divider: 'bg-gray-200',
    dropdown: 'bg-white border-gray-300 shadow-xl',
    dropdownArrow: 'bg-white border-gray-300',
    checkboxStroke: '#c8ccd4',
    checkboxRipple: 'rgba(34, 50, 84, 0.03)',
    itemHover: 'hover:bg-gray-50',
    scrollArrow: 'bg-gray-200 text-gray-600',
    activeSort: 'bg-blue-50 text-blue-600',
    viewModeActive: 'bg-blue-500 text-white',
    viewModeInactive: 'text-gray-500 hover:bg-gray-100',
    badge: 'bg-blue-600 text-white',
  };

  const darkStyles = {
    text: 'text-white',
    textSecondary: 'text-slate-300',
    bar: 'bg-gray-800 border-gray-700',
    segment: 'text-gray-200 hover:bg-gray-700/60',
    segmentActive: 'bg-blue-900/40 text-blue-300',
    divider: 'bg-gray-700',
    dropdown: 'bg-gray-800 border-gray-600 shadow-gray-900/40',
    dropdownArrow: 'bg-gray-800 border-gray-600',
    checkboxStroke: '#64748b',
    checkboxRipple: 'rgba(255, 255, 255, 0.08)',
    itemHover: 'hover:bg-gray-700',
    scrollArrow: 'bg-gray-600 text-gray-300',
    activeSort: 'bg-blue-900/30 text-blue-400',
    viewModeActive: 'bg-blue-600 text-white',
    viewModeInactive: 'text-gray-400 hover:bg-gray-700/60',
    badge: 'bg-blue-500 text-white',
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
  const color = getColorForFilterValue(value);
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

  const getDesktopDropdownPosition = (isFilter: boolean) => {
    if (typeof window === 'undefined') return 'left-0';

    const screenWidth = window.innerWidth;
    const dropdownWidth = isFilter ? 600 : 300;

    if (screenWidth < dropdownWidth + 100) {
      return 'right-0';
    }

    return 'left-0';
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

  const activeFilterCount = filterBy.includes('all') ? 0 : filterBy.length;
  const hasActiveFilters = activeFilterCount > 0;

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

  // Shared classes for the two panels: a bottom sheet on phones, a floating
  // card anchored to the trigger from `sm` upward.
  const panelBase = 'fixed inset-x-0 bottom-0 z-[9999] rounded-t-2xl border-t max-h-[75vh] sm:max-h-none sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-full sm:mt-2 sm:rounded-2xl sm:border sm:shadow-lg';

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div className={`inline-flex w-full sm:w-auto items-stretch rounded-xl border overflow-visible ${styles.bar}`}>
        <div className="relative flex-1 sm:flex-none" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`relative flex items-center justify-center gap-2 w-full h-full px-3.5 py-2.5 text-sm font-medium rounded-l-xl transition-colors duration-150 cursor-pointer ${hasActiveFilters ? styles.segmentActive : styles.segment}`}
            aria-label="Filter stories"
            aria-expanded={isDropdownOpen}
          >
            <Filter className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate max-w-[140px]">{getDisplayText()}</span>
            <span className="sm:hidden">Filters</span>
            {hasActiveFilters && (
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${styles.badge}`}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`hidden sm:block w-3.5 h-3.5 opacity-60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              <div className="sm:hidden fixed inset-0 bg-black/50 z-[9998]" onClick={() => setIsDropdownOpen(false)} aria-hidden="true" />
              <div className={`${panelBase} w-full sm:w-[min(600px,calc(100vw-2rem))] ${getDesktopDropdownPosition(true)} ${styles.dropdown}`}>
                <div className={`hidden sm:block absolute w-2 h-2 transform rotate-45 top-[-4px] left-6 border-l border-t ${styles.dropdownArrow}`}></div>
                <div className="sm:hidden flex items-center justify-between px-4 pt-4 pb-2">
                  <h3 className={`text-sm font-semibold ${styles.text}`}>Filter stories</h3>
                  <button onClick={() => setIsDropdownOpen(false)} aria-label="Close filters" className={`p-1.5 rounded-full ${styles.itemHover}`}>
                    <X className={`w-4 h-4 ${styles.text}`} />
                  </button>
                </div>
                <div className="relative max-h-[60vh] sm:max-h-80 overflow-hidden rounded-b-2xl sm:rounded-b-lg">
                  {canScrollUp && <ScrollArrow direction="up" theme={theme} />}
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[60vh] sm:max-h-80 overflow-y-auto scrollbar-hide"
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
            </>
          )}
        </div>

        <div className={`w-px my-2 ${styles.divider}`} />

        <div className="relative flex-1 sm:flex-none" ref={sortDropdownRef}>
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className={`flex items-center justify-center gap-2 w-full h-full px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${styles.segment}`}
            aria-label="Sort stories"
            aria-expanded={isSortDropdownOpen}
          >
            <SortAsc className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate max-w-[140px]">{getSortDisplayText()}</span>
            <span className="sm:hidden">Sort</span>
            <ChevronDown className={`hidden sm:block w-3.5 h-3.5 opacity-60 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortDropdownOpen && (
            <>
              <div className="sm:hidden fixed inset-0 bg-black/50 z-[9998]" onClick={() => setIsSortDropdownOpen(false)} aria-hidden="true" />
              <div className={`${panelBase} w-full sm:w-[min(300px,calc(100vw-2rem))] ${getDesktopDropdownPosition(false)} ${styles.dropdown}`}>
                <div className={`hidden sm:block absolute w-2 h-2 transform rotate-45 top-[-4px] left-6 border-l border-t ${styles.dropdownArrow}`}></div>
                <div className="sm:hidden flex items-center justify-between px-4 pt-4 pb-2">
                  <h3 className={`text-sm font-semibold ${styles.text}`}>Sort stories</h3>
                  <button onClick={() => setIsSortDropdownOpen(false)} aria-label="Close sort options" className={`p-1.5 rounded-full ${styles.itemHover}`}>
                    <X className={`w-4 h-4 ${styles.text}`} />
                  </button>
                </div>
                <div className="relative max-h-[60vh] sm:max-h-80 overflow-hidden rounded-b-2xl sm:rounded-b-lg">
                  {canSortScrollUp && <ScrollArrow direction="up" theme={theme} />}
                  <div
                    ref={sortScrollContainerRef}
                    onScroll={handleSortScroll}
                    className="p-4 grid grid-cols-1 gap-1 max-h-[60vh] sm:max-h-80 overflow-y-auto scrollbar-hide"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer text-left transition-colors duration-150 ${styles.itemHover} ${
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
            </>
          )}
        </div>

        {hasActiveFilters && (
          <>
            <div className={`w-px my-2 ${styles.divider}`} />
            <button
              onClick={handleClearFilters}
              className={`flex items-center justify-center px-3 transition-colors duration-150 cursor-pointer ${styles.segment}`}
              aria-label="Clear all filters"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}

        <div className={`w-px my-2 ${styles.divider}`} />

        <div className="flex items-stretch">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center justify-center px-3 transition-colors duration-150 cursor-pointer ${
              viewMode === 'grid' ? styles.viewModeActive : styles.viewModeInactive
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            title="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center justify-center px-3 rounded-r-xl transition-colors duration-150 cursor-pointer ${
              viewMode === 'list' ? styles.viewModeActive : styles.viewModeInactive
            }`}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

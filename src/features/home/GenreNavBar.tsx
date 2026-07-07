import React, { useEffect, useRef, useState } from 'react';
import { genres } from './data/genres';

export { genres } from './data/genres';

interface GenreNavBarProps {
  onGenreSelect?: (genre: string) => void;
  activeGenre?: string;
  theme?: 'light' | 'dark';
  width?: string;
  height?: string;
}

export const GenreNavBar: React.FC<GenreNavBarProps> = ({
  onGenreSelect,
  activeGenre,
  theme = 'dark',
  width = 'w-full min-w-0',
  height = 'h-12 sm:h-14',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollShadows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollShadows();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollShadows);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleGenreClick = (genreId: string) => {
    try {
      onGenreSelect?.(genreId);
    } catch (error) {
      console.error('Genre selection error:', error);
    }
  };

  const themeClasses = theme === 'light'
    ? 'bg-white/60 border-gray-200/60 text-gray-800 shadow-sm'
    : 'bg-gray-900/50 border-gray-800/50 text-white shadow-md';

  const edgeFade = theme === 'light' ? 'from-white/90' : 'from-gray-900/90';

  return (
    <>
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .genre-btn { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease; }
        .genre-btn:hover { transform: translateY(-1px); }
        .genre-btn:active { transform: translateY(0) scale(0.97); }
      `}</style>

      <div className={`${width} ${height} ${themeClasses} relative backdrop-blur-md rounded-2xl border flex items-center`}>
        {canScrollLeft && (
          <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 rounded-l-2xl bg-gradient-to-r ${edgeFade} to-transparent z-10`} />
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollShadows}
          className="flex items-center overflow-x-auto overflow-y-hidden scrollbar-none scroll-smooth snap-x w-full h-full px-2"
        >
          <div className="flex gap-2 min-w-max h-full items-center py-2">
            {genres.map((genre) => {
              const isActive = activeGenre === genre.id;

              const buttonClass = isActive
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-transparent'
                : theme === 'light'
                  ? 'bg-gray-100/70 hover:bg-gray-200/70 text-gray-700 hover:text-gray-900 border-gray-200/50'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/5';

              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={`genre-btn snap-start ${buttonClass} px-4 py-1.5 rounded-xl flex items-center gap-1.5 border whitespace-nowrap h-9 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
                  aria-label={`Select ${genre.label}`}
                  aria-pressed={isActive}
                >
                  <span className="text-sm select-none">{genre.icon}</span>
                  <span>{genre.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {canScrollRight && (
          <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 rounded-r-2xl bg-gradient-to-l ${edgeFade} to-transparent z-10`} />
        )}
      </div>
    </>
  );
};

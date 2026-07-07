import React from 'react';

export const genres = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'new', label: 'New', icon: '✨' },
  { id: 'popular', label: 'Popular', icon: '⭐' },
  { id: 'anime', label: 'Anime', icon: '🎌' },
  { id: 'fantasy', label: 'Fantasy', icon: '🧙' },
  { id: 'scifi', label: 'Sci-Fi', icon: '🚀' },
  { id: 'romance', label: 'Romance', icon: '💕' },
  { id: 'adventure', label: 'Adventure', icon: '⚔️' },
  { id: 'mystery', label: 'Mystery', icon: '🔍' },
  { id: 'horror', label: 'Horror', icon: '👻' },
  { id: 'comedy', label: 'Comedy', icon: '😄' }
];

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
  height = 'h-14'
}) => {
  const handleGenreClick = (genreId: string) => {
    try {
      onGenreSelect?.(genreId);
    } catch (error) {
      console.error('Genre selection error:', error);
    }
  };

  const themeClasses = theme === 'light' 
    ? 'bg-white/40 border-gray-200/50 text-gray-800 shadow-sm'
    : 'bg-gray-900/40 border-gray-800/40 text-white shadow-md';

  return (
    <>
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .genre-btn {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .genre-btn:hover {
          transform: translateY(-1px);
        }
        .genre-btn:active {
          transform: translateY(1px);
        }
      `}</style>
      
      <div className={`${width} ${height} ${themeClasses} backdrop-blur-md rounded-2xl px-3 py-2 border flex items-center`}>
        <div className="flex items-center justify-start overflow-x-auto overflow-y-hidden scrollbar-none w-full h-full">
          <div className="flex gap-2 px-1 min-w-max h-full items-center">
            {genres.map((genre) => {
              const isActive = activeGenre === genre.id;
              
              let buttonClass = '';
              if (isActive) {
                buttonClass = 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-transparent';
              } else {
                buttonClass = theme === 'light'
                  ? 'bg-gray-100/70 hover:bg-gray-200/70 text-gray-700 hover:text-gray-900 border-gray-200/30'
                  : 'bg-gray-850/50 hover:bg-gray-800/60 text-white/80 hover:text-white border-white/5';
              }

              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={`genre-btn ${buttonClass} backdrop-blur-sm px-4.5 py-1.5 rounded-xl flex items-center gap-2 border whitespace-nowrap h-9 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  aria-label={`Select ${genre.label}`}
                >
                  <span className="text-sm select-none">{genre.icon}</span>
                  <span>{genre.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
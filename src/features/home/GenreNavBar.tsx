import React from 'react';

const genres = [
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
  height = 'h-20'
}) => {
  const handleGenreClick = (genreId: string) => {
    try {
      onGenreSelect?.(genreId);
    } catch (error) {
      console.error('Genre selection error:', error);
    }
  };

  const themeClasses = theme === 'light' 
    ? 'bg-semitransparent border-white/30 text-gray-800'
    : 'bg-semitransparent border-white/20 text-white';

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
      `}</style>
      
      <div className={`${width} ${height} ${themeClasses} backdrop-blur-md bg-blur-md rounded-3xl p-4`}>
        <div className="flex items-center justify-start overflow-x-auto overflow-y-hidden scrollbar-none h-full">
          <div className="flex gap-2 px-1 min-w-max h-full items-center">
            {genres.map((genre) => {
              const isActive = activeGenre === genre.id;
              const buttonClass = isActive
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                : theme === 'light'
                ? 'hover:bg-semitransparent hover:bg-white/50 text-gray-700 hover:text-gray-900'
                : 'hover:bg-semitransparent hover:bg-white/20 text-white/80 hover:text-white';

              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={`${buttonClass} backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap border border-white/10 h-8`}
                  aria-label={`Select ${genre.label}`}
                >
                  <span className="text-md">{genre.icon}</span>
                  <span className="font-medium text-xs">{genre.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
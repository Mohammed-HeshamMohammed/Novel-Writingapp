export interface Genre {
  id: string;
  label: string;
  icon: string;
}

export const genres: Genre[] = [
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
  { id: 'comedy', label: 'Comedy', icon: '😄' },
  { id: 'action', label: 'Action', icon: '💥' },
  { id: 'drama', label: 'Drama', icon: '🎭' },
  { id: 'historical', label: 'Historical', icon: '🏰' },
  { id: 'magical', label: 'Magical', icon: '🔮' },
  { id: 'game', label: 'Game', icon: '🎮' },
  { id: 'vampire', label: 'Vampire', icon: '🧛' },
  { id: 'werewolf', label: 'Werewolf', icon: '🐺' },
  { id: 'roleplay', label: 'Roleplay', icon: '🎲' },
  { id: 'wholesome', label: 'Wholesome', icon: '🌸' },
];

export const getGenreLabel = (genreId: string): string =>
  genres.find((g) => g.id === genreId)?.label || genreId;

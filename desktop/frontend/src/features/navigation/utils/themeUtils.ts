import type { Theme } from '../../../shared/types/story';

const THEME_STORAGE_KEY = 'novelist_theme';

export const getStoredTheme = (): Theme => {
  try {
    const stored = sessionStorage.getItem(THEME_STORAGE_KEY);
    return (stored as Theme) || 'dark';
  } catch {
    return 'dark';
  }
};

export const storeTheme = (theme: Theme): void => {
  try {
    sessionStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to store theme:', error);
  }
};

export const getThemeStyles = (theme: Theme) => {
  if (theme === 'light') {
    return {
      nav: 'bg-white border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      input: 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-500',
      button: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
      buttonActive: 'text-blue-700 bg-blue-100 hover:bg-blue-200',
      buttonPrimary: 'text-white bg-blue-600 hover:bg-blue-700',
      statusBg: 'bg-gray-100',
      divider: 'bg-gray-300',
    };
  }
  return {
    nav: 'bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm border-slate-700/50',
    text: 'text-white',
    textSecondary: 'text-slate-300',
    input: 'bg-gray-800 text-white border-gray-600 placeholder-gray-400',
    button: 'text-slate-400 hover:text-white hover:bg-white/10',
    buttonActive: 'text-blue-100 bg-blue-600/80 hover:bg-blue-500/80 shadow-lg shadow-blue-500/20',
    buttonPrimary: 'text-white bg-blue-700 hover:bg-blue-800',
    statusBg: 'bg-white/5',
    divider: 'bg-slate-600/50',
  };
};
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../../types/story';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get theme from localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('novelist-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme as Theme;
      }
    }
    return 'dark'; // Default theme
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('novelist-theme', newTheme);
    }
  };

  // Apply theme to document body for global styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.className = theme === 'dark' ? 'dark' : 'light';
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
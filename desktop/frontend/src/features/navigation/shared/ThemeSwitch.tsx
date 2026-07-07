import React, { useState, useCallback, useRef } from 'react';
import { storeTheme } from '../utils/themeUtils';
import type { Theme } from '../../../shared/types/story';

interface ThemeSwitchProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  debounceMs?: number;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ 
  theme, 
  onThemeChange,
  debounceMs = 300
}) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = useCallback(() => {
    if (isToggling) return;
    
    setIsToggling(true);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    debounceRef.current = setTimeout(() => {
      try {
        storeTheme(newTheme);
        onThemeChange(newTheme);
      } catch (error) {
        console.error('Error changing theme:', error);
      } finally {
        setIsToggling(false);
      }
    }, debounceMs);
  }, [theme, onThemeChange, debounceMs, isToggling]);

  return (
    <div className="flex items-center">
      <label className="relative inline-block cursor-pointer" style={{ width: '56px', height: '32px' }}>
        <input 
          type="checkbox" 
          checked={theme === 'dark'}
          onChange={handleToggle}
          disabled={isToggling}
          className="opacity-0 w-0 h-0"
        />
        <span 
          className={`absolute top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-full ${isToggling ? 'opacity-75' : ''}`}
          style={{
            backgroundColor: theme === 'dark' ? '#303136' : '#f4f4f5',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <span 
            className="absolute rounded-full transition-all duration-300"
            style={{
              height: '22.4px',
              width: '22.4px',
              left: theme === 'dark' ? 'calc(100% - 27.2px)' : '4.8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: theme === 'dark' 
                ? '#303136' 
                : 'linear-gradient(40deg, #ff0080, #ff8c00 70%)',
              boxShadow: theme === 'dark' 
                ? 'inset -3px -2px 5px -2px #8983f7, inset -10px -4px 0 0 #a3dafb' 
                : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </span>
      </label>
    </div>
  );
};
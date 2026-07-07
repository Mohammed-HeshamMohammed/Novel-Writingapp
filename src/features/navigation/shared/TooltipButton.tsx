import React from 'react';
import type { Theme } from '../../../shared/types/story';

interface TooltipButtonProps {
  children: React.ReactNode;
  tooltip: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  theme?: Theme;
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({ 
  children, 
  tooltip, 
  className, 
  onClick, 
  disabled, 
  theme = 'dark' 
}) => {
  const tooltipStyles = theme === 'dark' 
    ? 'text-white bg-gray-800 border-gray-700' 
    : 'text-gray-900 bg-white border-gray-200';
  
  const arrowStyles = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

  return (
    <div className="tooltip-container inline-flex items-center relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
      <span className={`absolute pointer-events-none opacity-0 group-hover:opacity-100 px-4 py-2 text-sm font-medium backdrop-blur-sm rounded-lg shadow-lg border transition-all duration-200 ease-in-out whitespace-nowrap top-full left-1/2 -translate-x-1/2 translate-y-2 mt-2 z-[9999] ${tooltipStyles}`}>
        {tooltip}
        <span className={`absolute w-2 h-2 transform rotate-45 top-[-4px] left-1/2 -translate-x-1/2 ${arrowStyles}`}></span>
      </span>
    </div>
  );
};
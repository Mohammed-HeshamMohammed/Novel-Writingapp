import React, { useState, useRef, useEffect } from 'react';
import { Circle, CircleSlash, EyeOff, Moon } from 'lucide-react';
import type { Theme, UserStatus, StatusWithDuration, StatusOption } from '../../../../types/story';

interface StatusDropdownProps {
  currentStatus: UserStatus;
  theme: Theme;
  onStatusChange: (statusData: StatusWithDuration) => void;
  durationOffsetX?: number;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  theme,
  onStatusChange}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>('online');
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastToggleTime = useRef<number>(0);

  const statusOptions: StatusOption[] = [
    {
      id: 'online',
      label: 'Online',
      description: '',
      icon: <Circle className="w-4 h-4 text-green-500 fill-current" />,
      color: 'text-green-500',
      badgeLabel: 'Online'
    },
    {
      id: 'idle',
      label: 'Idle',
      description: '',
      icon: <Moon className="w-4 h-4 text-yellow-500" />,
      color: 'text-yellow-500',
      badgeLabel: 'Idle'
    },
    {
      id: 'dnd',
      label: 'Do Not Disturb',
      description: 'You will not receive desktop notifications',
      icon: <CircleSlash className="w-4 h-4 text-red-500" />,
      color: 'text-red-500',
      badgeLabel: 'DND'
    },
    {
      id: 'invisible',
      label: 'Invisible',
      description: 'You will appear offline',
      icon: <EyeOff className="w-4 h-4 text-gray-500" />,
      color: 'text-gray-500',
      badgeLabel: 'Invisible'
    }
  ];

  const timeOptions = [
    { label: 'For 15 Minutes', minutes: 15 },
    { label: 'For 1 Hour', minutes: 60 },
    { label: 'For 8 Hours', minutes: 480 },
    { label: 'For 24 Hours', minutes: 1440 },
    { label: 'For 3 Days', minutes: 4320 },
    { label: 'Forever', minutes: null }
  ];

  const getCurrentStatus = () => statusOptions.find(option => option.id === currentStatus) || statusOptions[0];

  const resetState = () => {
    setIsOpen(false);
    setShowDurationPicker(false);
    setSelectedStatus('online');
  };

  const calculateExpiryDate = (minutes: number | null) => {
    if (!minutes) return undefined;
    return new Date(Date.now() + minutes * 60 * 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        resetState();
      }
    };

    if (isOpen || showDurationPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, showDurationPicker]);

  const handleButtonClick = () => {
    try {
      const now = Date.now();
      const timeSinceLastToggle = now - lastToggleTime.current;
      
      if (timeSinceLastToggle < 250 || isAnimating) return;

      setIsAnimating(true);
      
      if (showDurationPicker) {
        setShowDurationPicker(false);
        setSelectedStatus('online');
      }
      setIsOpen(!isOpen);
      lastToggleTime.current = now;
      
      setTimeout(() => setIsAnimating(false), 300);
    } catch (error) {
      console.error('Error toggling status dropdown:', error);
    }
  };

  const handleStatusChange = (statusData: StatusWithDuration) => {
    try {
      if (isAnimating) return;
      onStatusChange(statusData);
      resetState();
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const handleStatusClick = (statusId: UserStatus) => {
    if (isAnimating) return;
    
    if (statusId === 'online') {
      handleStatusChange({ status: statusId });
      return;
    }

    try {
      setSelectedStatus(statusId);
      setShowDurationPicker(true);
    } catch (error) {
      console.error('Error handling status click:', error);
    }
  };

  const handleDurationSelect = (option: typeof timeOptions[0]) => {
    try {
      if (isAnimating) return;
      const expiresAt = calculateExpiryDate(option.minutes);
      handleStatusChange({ 
        status: selectedStatus, 
        duration: option.label,
        expiresAt
      });
    } catch (error) {
      console.error('Error setting status with duration:', error);
    }
  };

  const getThemeClasses = (type: string) => {
    const isDark = theme === 'dark';
    
    switch (type) {
      case 'button':
        return isDark ? 'hover:bg-gray-700/50 text-gray-300' : 'hover:bg-gray-100 text-gray-600';
      case 'dropdown':
        return isDark ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl';
      case 'statusActive':
        return isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200';
      case 'statusHover':
        return isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50';
      case 'text':
        return isDark ? 'text-white' : 'text-gray-900';
      case 'textSecondary':
        return isDark ? 'text-gray-400' : 'text-gray-500';
      case 'textTertiary':
        return isDark ? 'text-gray-300' : 'text-gray-700';
      case 'shadow':
        return isDark ? 'shadow-2xl shadow-black/50' : 'shadow-2xl shadow-gray-900/20';
      case 'border':
        return isDark ? 'border-gray-700/50' : 'border-gray-200/50';
      case 'badge':
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
      default:
        return '';
    }
  };

  const getDropdownBg = () => theme === 'dark' ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)';

  const currentStatusOption = getCurrentStatus();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        disabled={isAnimating}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${getThemeClasses('button')} ${
          isAnimating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
        }`}
      >
        {currentStatusOption.icon}
        <span>{currentStatusOption.badgeLabel || currentStatusOption.label}</span>
      </button>

      {isOpen && (
        <div 
          className={`absolute left-0 top-full mt-2 w-80 rounded-xl border ${getThemeClasses('dropdown')} ${getThemeClasses('shadow')} z-[100000] pointer-events-auto`}
          style={{
            backgroundColor: getDropdownBg(),
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <div className={`p-4 border-b rounded-t-xl ${getThemeClasses('border')}`}>
            <h3 className={`text-sm font-semibold ${getThemeClasses('text')}`}>Set your status</h3>
            <p className={`text-xs mt-1 ${getThemeClasses('textSecondary')}`}>Let others know what you're up to</p>
          </div>

          <div className="p-3">
            <div className="space-y-1">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusClick(status.id)}
                  disabled={isAnimating}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 border ${
                    currentStatus === status.id 
                      ? `${getThemeClasses('statusActive')} border-solid` 
                      : `${getThemeClasses('statusHover')} border-transparent hover:border-gray-300/20`
                  } ${isAnimating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  <div className="flex-shrink-0">
                    {status.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium text-sm ${getThemeClasses('text')}`}>
                      {status.label}
                    </div>
                    {status.description && (
                      <div className={`text-xs mt-0.5 ${getThemeClasses('textSecondary')}`}>
                        {status.description}
                      </div>
                    )}
                  </div>
                  {currentStatus === status.id && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDurationPicker && (
        <div 
          className={`absolute left-full ml-60 top-32 w-72 rounded-xl border ${getThemeClasses('dropdown')} ${getThemeClasses('shadow')} z-[100001] pointer-events-auto`}
          style={{
            backgroundColor: getDropdownBg(),
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <div className={`p-4 border-b rounded-t-xl ${getThemeClasses('border')}`}>
            <h3 className={`text-sm font-semibold ${getThemeClasses('text')}`}>Clear status after</h3>
            <p className={`text-xs mt-1 ${getThemeClasses('textSecondary')}`}>Your status will automatically return to online</p>
          </div>

          <div className="p-3">
            <div className="space-y-1">
              {timeOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleDurationSelect(option)}
                  disabled={isAnimating}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${getThemeClasses('textTertiary')} ${getThemeClasses('statusHover')} hover:border-gray-300/20 ${
                    isAnimating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {option.minutes === null && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getThemeClasses('badge')}`}>
                        Manual
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
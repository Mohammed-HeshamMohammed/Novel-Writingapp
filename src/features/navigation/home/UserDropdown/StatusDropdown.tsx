import React, { useState, useRef, useEffect } from 'react';
import { Circle, CircleSlash, EyeOff, Moon, ChevronLeft } from 'lucide-react';
import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal } from '@floating-ui/react';
import { useIsMobile } from '../../../../shared/hooks/useIsMobile';
import type { Theme, UserStatus, StatusWithDuration, StatusOption } from '../../../../shared/types/story';

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
  const lastToggleTime = useRef<number>(0);
  const isMobile = useIsMobile();

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [
      offset(8),
      flip({ padding: 16 }),
      shift({ padding: 16 }),
    ],
    whileElementsMounted: autoUpdate,
  });

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
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const isInsideDropdown = refs.floating.current?.contains(event.target as Node);
      const isInsideButton = (refs.reference.current as HTMLElement)?.contains(event.target as Node);
      
      if (!isInsideDropdown && !isInsideButton) {
        resetState();
      }
    };

    if (isOpen || showDurationPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, showDurationPicker, refs.floating, refs.reference]);

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

  const dropdownStyle = isMobile
    ? {
        backgroundColor: getDropdownBg(),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }
    : {
        ...floatingStyles,
        backgroundColor: getDropdownBg(),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={refs.setReference}
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
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={dropdownStyle}
            className={`fixed inset-x-4 top-1/2 -translate-y-1/2 ${isMobile ? '' : 'sm:inset-auto'} sm:translate-y-0 sm:w-80 max-w-full max-h-[80vh] overflow-y-auto rounded-xl border ${getThemeClasses('dropdown')} ${getThemeClasses('shadow')} z-[100000] pointer-events-auto`}
          >
          {showDurationPicker ? (
            <>
              <div className={`flex items-center gap-2 p-4 border-b rounded-t-xl ${getThemeClasses('border')}`}>
                <button
                  onClick={() => { setShowDurationPicker(false); setSelectedStatus('online'); }}
                  disabled={isAnimating}
                  aria-label="Back to status list"
                  className={`-ml-1 p-1 rounded-full transition-colors duration-150 ${getThemeClasses('statusHover')}`}
                >
                  <ChevronLeft className={`w-4 h-4 ${getThemeClasses('text')}`} />
                </button>
                <div>
                  <h3 className={`text-sm font-semibold ${getThemeClasses('text')}`}>Clear status after</h3>
                  <p className={`text-xs mt-0.5 ${getThemeClasses('textSecondary')}`}>Your status will automatically return to online</p>
                </div>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </FloatingPortal>
      )}
    </div>
  );
};

export default StatusDropdown;
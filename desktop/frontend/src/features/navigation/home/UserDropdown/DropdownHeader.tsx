import React from 'react';
import Avatar from './Avatar';
import StatusDropdown from './StatusDropdown';
import type { UserPlan, Theme, UserStatus, StatusWithDuration } from '../../../../shared/types/story';

interface DropdownHeaderProps {
  userName: string;
  userAvatar?: string;
  planInfo: UserPlan;
  currentStatus: UserStatus;
  theme: Theme;
  onStatusChange: (statusData: StatusWithDuration) => void;
  onAccountClick?: () => void;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({
  userName,
  userAvatar,
  planInfo,
  currentStatus,
  theme,
  onStatusChange,
  onAccountClick
}) => {
  const PlanIcon = planInfo.icon;

  return (
    <div className="relative px-3 py-3 rounded-t-2xl overflow-visible z-[99998]">
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar 
              userName={userName}
              userAvatar={userAvatar}
              planInfo={planInfo}
              size="large"
              isOnline={currentStatus === 'online'}
              theme={theme}
            />
            
            <div className="flex flex-col">
              <h3 className={`text-base font-semibold leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {userName}
              </h3>
              <div className="relative z-[99999]">
                <StatusDropdown
                  currentStatus={currentStatus}
                  onStatusChange={onStatusChange}
                  theme={theme}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              theme === 'dark'
                ? 'bg-gray-700/80 text-gray-300 backdrop-blur-sm'
                : 'bg-gray-200/80 text-gray-700 backdrop-blur-sm'
            }`}>
              <PlanIcon size={12} />
              <span>{planInfo.label}</span>
            </div>
            
            {onAccountClick && (
              <button
                onClick={onAccountClick}
                className={`text-xs font-medium cursor-pointer transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Account Settings
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownHeader;
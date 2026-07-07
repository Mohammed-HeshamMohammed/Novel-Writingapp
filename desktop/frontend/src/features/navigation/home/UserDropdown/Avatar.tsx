import React from 'react';
import { User, Crown, Zap } from 'lucide-react';
import type { UserPlan } from '../../../../shared/types/story';

interface AvatarProps {
  userName: string;
  userAvatar?: string;
  planInfo: UserPlan;
  size?: 'small' | 'medium' | 'large';
  isOnline?: boolean;
  theme: 'dark' | 'light';
}

const Avatar: React.FC<AvatarProps> = ({
  userName,
  userAvatar,
  planInfo,
  size = 'medium',
  theme
}) => {
  const sizeMap = {
    small: { container: 'w-8 h-8', badge: 'w-4 h-4', icon: 10 },
    medium: { container: 'w-10 h-10', badge: 'w-5 h-5', icon: 12 },
    large: { container: 'w-12 h-12', badge: 'w-6 h-6', icon: 14 }
  };

  const currentSize = sizeMap[size];
  const BadgeIcon = planInfo.plan === 'premium' ? Crown : planInfo.plan === 'pro' ? Zap : null;

  const getBorderStyle = () => {
    if (planInfo.plan === 'premium') return 'ring-gradient-premium';
    if (planInfo.plan === 'pro') return 'ring-gradient-pro';
    return 'ring-gradient-rgb';
  };

  const getBadgeClass = () => {
    if (planInfo.plan === 'premium') return 'badge-premium';
    if (planInfo.plan === 'pro') return 'badge-pro';
    return '';
  };

  return (
    <>
      <style>{`
        @keyframes rgb-rotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        @keyframes premium-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(251, 191, 36, 0.4); }
        }

        @keyframes pro-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 0 25px rgba(139, 92, 246, 0.7), 0 0 50px rgba(139, 92, 246, 0.3); }
        }

        .ring-gradient-rgb {
          position: relative;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, 
            #ff0000, #ff1a00, #ff3300, #ff4d00, #ff6600, #ff8000, #ff9900, #ffb300, 
            #ffcc00, #ffe600, #ffff00, #e6ff00, #ccff00, #b3ff00, #99ff00, #80ff00, 
            #66ff00, #4dff00, #33ff00, #1aff00, #00ff00, #00ff1a, #00ff33, #00ff4d, 
            #00ff66, #00ff80, #00ff99, #00ffb3, #00ffcc, #00ffe6, #00ffff, #00e6ff, 
            #00ccff, #00b3ff, #0099ff, #0080ff, #0066ff, #004dff, #0033ff, #001aff, 
            #0000ff, #1a00ff, #3300ff, #4d00ff, #6600ff, #8000ff, #9900ff, #b300ff, 
            #cc00ff, #e600ff, #ff00ff, #ff00e6, #ff00cc, #ff00b3, #ff0099, #ff0080, 
            #ff0066, #ff004d, #ff0033, #ff001a, #ff0000
          );
          background-size: 400% 400%;
          animation: rgb-rotate 3s linear infinite;
        }

        .ring-gradient-premium {
          position: relative;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #fbbf24);
          background-size: 200% 200%;
          animation: premium-glow 2s ease-in-out infinite;
        }
        
        .ring-gradient-pro {
          position: relative;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, #8b5cf6, #7c3aed, #6d28d9, #8b5cf6);
          background-size: 200% 200%;
          animation: pro-pulse 2s ease-in-out infinite;
        }

        .badge-premium {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
          animation: premium-glow 2s ease-in-out infinite;
        }

        .badge-pro {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
          animation: pro-pulse 2s ease-in-out infinite;
        }

        .avatar-inner {
          border-radius: 50%;
          overflow: hidden;
          background: ${theme === 'dark' ? '#1a202c' : '#ffffff'};
        }
      `}</style>
      
      <div className="relative">
        <div className={`${currentSize.container} ${getBorderStyle()}`}>
          <div className={`w-full h-full avatar-inner`}>
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center ${planInfo.bgColor} ${userAvatar ? 'hidden' : ''}`}>
              <User 
                className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} 
                size={size === 'large' ? 24 : size === 'medium' ? 20 : 16} 
              />
            </div>
          </div>
        </div>

        {BadgeIcon && (
          <div className={`absolute -top-1 -right-1 ${currentSize.badge} rounded-full flex items-center justify-center z-10 backdrop-blur-sm ${getBadgeClass()}`}>
            <BadgeIcon className="text-white drop-shadow-sm" size={currentSize.icon} />
          </div>
        )}
      </div>
    </>
  );
};

export default Avatar;
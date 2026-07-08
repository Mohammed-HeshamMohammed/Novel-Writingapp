import React, { useState } from 'react';
import { useFloating, useClick, useDismiss, useInteractions, FloatingPortal, offset, flip, shift, size, autoUpdate } from '@floating-ui/react';
import { User, UserPlus, Settings, Users, BookOpen, DollarSign, Crown, Zap, LogOut, HeartHandshake, PenTool } from 'lucide-react';
import styled from 'styled-components';
import DropdownHeader from './UserDropdown/DropdownHeader';
import { useIsMobile } from '../../../shared/hooks/useIsMobile';
import type { Theme, UserPlanType, UserPlan, UserStatus, StatusWithDuration } from '../../../shared/types/story';

interface UserProfileDropdownProps {
  theme: Theme;
  userName?: string;
  userAvatar?: string;
  userPlan?: UserPlanType;
  currentStatus?: UserStatus;
  onProfileClick?: () => void;
  onEditProfileClick?: () => void;
  onAddMemberClick?: () => void;
  onSettingsClick?: () => void;
  onDeleteAccountClick?: () => void;
  onTeamAccessClick?: () => void;
  onLogoutClick?: () => void;
  onCreateCharacterClick?: () => void;
  onPricingClick?: () => void;
  onMyCharactersClick?: () => void;
  onMyChatsClick?: () => void;
  onAccountClick?: () => void;
  onMyStoriesClick?: () => void;
  onCreateStoryClick?: () => void;
  onStatusChange?: (statusData: StatusWithDuration) => void;
  onPlanUpgrade?: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  theme,
  userName = 'User',
  userAvatar,
  userPlan = 'premium',
  currentStatus = 'online',
  ...callbacks
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuGlow, setMenuGlow] = useState('');
  const [glowPosition, setGlowPosition] = useState({ x: '50%', y: '50%' });
  const [status, setStatus] = useState<UserStatus>(currentStatus);
  const isMobile = useIsMobile();

  const { refs, x, y, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
    middleware: [
      offset(8),
      flip({ padding: 16 }),
      shift({ padding: 16 }),
      size({
        padding: 16,
        apply({ availableHeight, elements }) {
          // Exposed as a custom property (rather than set directly on this
          // wrapper) so StyledMenuCard - the element that actually has the
          // rounded corners/shadow/scroll - can use it, since the card is a
          // child of this floating wrapper, not the wrapper itself.
          elements.floating.style.setProperty('--dropdown-available-height', `${Math.max(200, availableHeight)}px`);
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const handleAction = (action?: () => void) => {
    try {
      action?.();
      setIsOpen(false);
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const handleStatusChange = (statusData: StatusWithDuration) => {
    try {
      setStatus(statusData.status);
      callbacks.onStatusChange?.(statusData);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const handleMouseEnter = (item: any, event: React.MouseEvent) => {
    try {
      const menuCard = event.currentTarget.closest('.menu-card') as HTMLElement;
      if (!menuCard) {
        console.warn('Menu card element not found');
        return;
      }
      
      const rect = menuCard.getBoundingClientRect();
      const itemRect = event.currentTarget.getBoundingClientRect();
      
      const x = ((itemRect.left + itemRect.width / 2 - rect.left) / rect.width) * 100;
      const y = ((itemRect.top + itemRect.height / 2 - rect.top) / rect.height) * 100;
      
      setGlowPosition({ x: `${x}%`, y: `${y}%` });
      setMenuGlow(item.glowClass || '');
    } catch (error) {
      console.error('Error handling mouse enter:', error);
    }
  };

  const getPlanInfo = (): UserPlan => {
    const planConfigs = {
      owner: { plan: 'owner' as const, icon: Crown, label: 'Owner', color: '#f43f5e', upgradeText: 'Creator Mode', bgColor: 'bg-rose-100 dark:bg-rose-950/30', textColor: 'text-rose-800 dark:text-rose-400', borderColor: 'border-rose-300 dark:border-rose-900/50' },
      premium: { plan: 'premium' as const, icon: Crown, label: 'Premium', color: '#ffd700', upgradeText: 'Upgrade or Extend Plan', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-300' },
      pro: { plan: 'pro' as const, icon: Zap, label: 'Pro', color: '#8b5cf6', upgradeText: 'TOP VIP', bgColor: 'bg-purple-100', textColor: 'text-purple-800', borderColor: 'border-purple-300' },
      free: { plan: 'free' as const, icon: User, label: 'Free', color: '#6b7280', upgradeText: 'Go Premium', bgColor: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300' }
    };
    
    return planConfigs[userPlan];
  };

  const getPricingLabel = () => {
    const labels = { owner: 'Pricing', premium: 'Pricing', pro: 'Extend Plan', free: 'Pricing' };
    return labels[userPlan];
  };

  const getMenuItems = () => {
    const baseItems = [
      { icon: User, label: 'Profile', action: callbacks.onProfileClick, color: '#3b82f6', hoverColor: '#2563eb', glowClass: 'glow-blue' },
      { icon: Settings, label: 'Settings', action: callbacks.onSettingsClick, color: '#6b7280', hoverColor: '#4b5563', glowClass: 'glow-gray' },
      ...(userPlan !== 'premium' ? [{ icon: DollarSign, label: getPricingLabel(), action: callbacks.onPricingClick, color: '#f59e0b', hoverColor: '#d97706', glowClass: 'glow-amber' }] : []),
      ...(userPlan === 'premium' ? [{ icon: DollarSign, label: 'Upgrade or Extend Plan', action: callbacks.onPricingClick, color: '#10b981', hoverColor: '#059669', glowClass: 'glow-green' }] : []),
      { separator: true },
      { sectionTitle: 'Create' },
      { icon: UserPlus, label: 'Create Character', action: callbacks.onCreateCharacterClick, color: '#10b981', hoverColor: '#059669', glowClass: 'glow-green' },
      { icon: PenTool, label: 'Create Story', action: callbacks.onCreateStoryClick, color: '#8b5cf6', hoverColor: '#7c3aed', glowClass: 'glow-purple' },
      { separator: true },
      { sectionTitle: 'My Content' },
      { icon: Users, label: 'My Characters', action: callbacks.onMyCharactersClick, color: '#06b6d4', hoverColor: '#0891b2', glowClass: 'glow-cyan' },
      { icon: BookOpen, label: 'My Stories', action: callbacks.onMyStoriesClick, color: '#8b5cf6', hoverColor: '#7c3aed', glowClass: 'glow-purple' },
      { separator: true },
      { sectionTitle: 'Help and Support' },
      { icon: HeartHandshake, label: 'Help Center', action: () => {}, color: '#6b7280', hoverColor: '#4b5563', glowClass: 'glow-gray' },
      { separator: true },
      { icon: LogOut, label: 'Sign Out', action: callbacks.onLogoutClick, color: '#ef4444', hoverColor: '#dc2626', glowClass: 'glow-red' }
    ];

    if (userPlan === 'pro' || userPlan === 'owner') {
      baseItems.splice(-3, 0, { icon: Zap, label: 'Request Feature', action: () => {}, color: '#8b5cf6', hoverColor: '#7c3aed', glowClass: 'glow-purple' });
    }

    return baseItems;
  };

  const getStatusBadgeClass = (status: UserStatus) => {
    const statusClasses = { online: 'status-online', idle: 'status-idle', dnd: 'status-dnd', invisible: 'status-invisible' };
    return statusClasses[status] || 'status-online';
  };

  const planInfo = getPlanInfo();
  const menuItems = getMenuItems();

  // Built from raw x/y (not @floating-ui/react's floatingStyles helper)
  // because floatingStyles positions via `transform`, which would clobber
  // the scale/slide entrance transform already defined on this element.
  const desktopPositionStyle: React.CSSProperties | undefined =
    !isMobile && x != null && y != null ? { position: strategy, top: y, left: x } : undefined;

  const menuContent = (
    <FloatingPortal>
      <StyledBackdrop $isOpen={isOpen} onClick={() => setIsOpen(false)} aria-hidden="true" />

      <StyledDropdownMenu
        $isOpen={isOpen}
        ref={refs.setFloating}
        style={desktopPositionStyle}
        {...getFloatingProps()}
      >
        <StyledMenuCard
          className="menu-card"
          $theme={theme}
          $glow={menuGlow}
          $planInfo={planInfo}
          $isOpen={isOpen}
          style={{
            '--glow-x': glowPosition.x,
            '--glow-y': glowPosition.y
          } as React.CSSProperties}
        >
          <DropdownHeader
            userName={userName}
            userAvatar={userAvatar}
            planInfo={planInfo}
            theme={theme}
            currentStatus={status}
            onStatusChange={handleStatusChange}
            onAccountClick={callbacks.onAccountClick}
          />

          <div className="menu-items">
            {menuItems.map((item, index) => {
              if (item.separator) {
                return <div key={index} className="menu-divider" />;
              }

              if (item.sectionTitle) {
                return (
                  <div key={index} className={`section-title ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.sectionTitle}
                  </div>
                );
              }

              const IconComponent = item.icon!;
              const isLongItem = (item.label?.length || 0) > 15;
              const itemClass = `menu-item ${isLongItem ? 'menu-item-long' : ''}`;
              return (
                <button
                  key={index}
                  className={itemClass}
                  onClick={() => handleAction(item.action)}
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onMouseLeave={() => setMenuGlow('')}
                  style={{
                    '--item-color': item.color,
                    '--item-hover-color': item.hoverColor
                  } as React.CSSProperties}
                >
                  <IconComponent size={18} className="item-icon" />
                  <span className="item-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </StyledMenuCard>
      </StyledDropdownMenu>
    </FloatingPortal>
  );

  return (
    <StyledWrapper $theme={theme}>
      <div className="template">
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          className="popup-trigger"
        >
          <span className="username">{userName}</span>
          <div className="avatar-container">
            {userAvatar ? (
              <img src={userAvatar} alt="User Avatar" className="avatar" />
            ) : (
              <svg height={32} width={32} viewBox="0 0 1024 1024" className="avatar-icon">
                <path fill="#FFCE8B" d="M1021.103385 510.551692A510.551692 510.551692 0 1 1 510.551692 0a510.551692 510.551692 0 0 1 510.551693 510.551692" />
                <path fill="#644646" d="M809.99026 493.192935v315.26567H494.979866a317.052601 317.052601 0 0 1-66.626996-7.147724V493.192935z" />
                <path d="M494.979866 808.458605h-66.626996v-7.147724a317.052601 317.052601 0 0 0 66.626996 7.147724" />
                <path fill="#644646" d="M809.99026 493.192935H428.35287v308.117946A315.010394 315.010394 0 0 1 178.693092 493.192935a310.670705 310.670705 0 0 1 21.953723-115.639958A314.755118 314.755118 0 0 1 494.979866 178.693092a308.373222 308.373222 0 0 1 82.96465 11.232138a313.989291 313.989291 0 0 1 232.045744 304.033532" />
                <path fill="#C7F4F1" d="M758.935091 959.581906a510.551692 510.551692 0 0 1-512.338624-9.18993 268.55019 268.55019 0 0 1 512.338624 9.18993" />
                <path fill="#F7BEA9" d="M581.263102 727.02561v86.793788a68.924478 68.924478 0 0 1-137.593681 0v-91.133477a184.309161 184.309161 0 0 0 74.285271 15.571826 178.693092 178.693092 0 0 0 63.30841-11.232137" />
                <path fill="#FBD1BB" d="M700.987474 390.572045v163.121266a195.796574 195.796574 0 0 1-119.724372 183.798609 172.566472 172.566472 0 0 1-137.593681-4.850241 197.072953 197.072953 0 0 1-108.747511-178.693093v-163.376541a189.92523 189.92523 0 0 1 183.032782-195.796574 176.39561 176.39561 0 0 1 129.424854 57.437065 201.667919 201.667919 0 0 1 53.607928 138.359509" />
                <path fill="#FBD1BB" d="M370.405253 553.182759a43.396894 43.396894 0 1 1-43.396894-41.099411 42.37579 42.37579 0 0 1 43.396894 41.099411" />
                <path fill="#F49F83" d="M605.769583 590.963584v2.042207a70.966685 70.966685 0 1 1-141.93337 0v-2.042207" />
                <path fill="#030303" d="M499.064279 517.699416a18.890413 18.890413 0 1 1-18.890412-18.890412 18.890413 18.890413 0 0 1 18.890412 18.890412M619.043927 517.699416a18.890413 18.890413 0 1 1-18.890412-18.890412 18.890413 18.890413 0 0 1 18.890412 18.890412" />
                <path fill="#644646" d="M796.46064 401.038354a224.387469 224.387469 0 0 1-282.590362-28.590894 224.132193 224.132193 0 0 1-312.202359 5.105517A314.755118 314.755118 0 0 1 494.979866 178.693092a308.373222 308.373222 0 0 1 82.96465 11.232138a316.031498 316.031498 0 0 1 218.516124 211.878952" />
              </svg>
            )}
            <div className={`status-badge ${getStatusBadgeClass(status)}`}></div>
          </div>
        </button>
      </div>

      {menuContent}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $theme: Theme }>`
  .template {
    position: relative;
    display: flex;
    margin: 0;
    box-sizing: border-box;
    font-size: 0.975rem;
    color: ${props => props.$theme === 'dark' ? '#e2e8f0' : '#1a202c'};
  }

  .popup-trigger {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 12px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    &:not(:disabled):hover {
      background: ${props => props.$theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.06)'};
      transform: translateY(-1px);

      .avatar-container {
        transform: scale(1.05);
      }
    }
  }

  .username {
    font-weight: 600;
    letter-spacing: 0.5px;
    color: ${props => props.$theme === 'dark' ? '#e2e8f0' : '#2d3748'};
    margin: 0;

    @media (max-width: 639px) {
      display: none;
    }
  }

  .avatar-container {
    position: relative;
    width: 32px;
    height: 32px;
    transition: transform 0.3s ease;
  }

  .avatar, .avatar-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .avatar {
    object-fit: cover;
    border: 2px solid ${props => props.$theme === 'dark' ? '#4a5568' : '#e2e8f0'};
  }

  .status-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid ${props => props.$theme === 'dark' ? '#1a202c' : '#ffffff'};
    
    &.status-online { background-color: #10b981; }
    &.status-idle { background-color: #f59e0b; }
    &.status-dnd { background-color: #ef4444; }
    &.status-invisible { background-color: #6b7280; }
  }

`;

const StyledBackdrop = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 640px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease;
    z-index: 49999;
  }
`;

const StyledDropdownMenu = styled.div<{ $isOpen: boolean }>`
  /* top/left come from @floating-ui/react's inline style on desktop (see the
     style prop where this is rendered) - not hardcoded here, since a fixed
     \`right: 0\` alongside floating-ui's computed \`left\` would stretch this
     element to fill the gap between them instead of sizing to content. */
  position: absolute;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)'};
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 50000;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};

  @media (max-width: 640px) {
    /* The card positions itself via \`fixed\`/\`bottom\` below; this wrapper
       just needs to stop intercepting clicks when closed. */
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    transition: none;
    pointer-events: none;
  }
`;

const StyledMenuCard = styled.div<{ $theme: Theme; $glow: string; $planInfo: UserPlan; $isOpen: boolean }>`
  width: 280px;
  max-width: calc(100vw - 2rem);
  background: ${props => props.$theme === 'dark' ? '#2d3748' : '#f7fafc'};
  border-radius: 16px;
  padding: 0;
  box-shadow: ${props => props.$theme === 'dark'
    ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
    : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 2;
  max-height: var(--dropdown-available-height, 80vh);
  overflow-y: auto;

  @media (max-width: 640px) {
    /* Positioned with \`bottom\` (not \`transform\`) so this never becomes a
       containing block for the fixed-position status/duration popups nested
       inside DropdownHeader - a transform here would trap them on-screen
       instead of letting them anchor to the real viewport. */
    position: fixed;
    left: 0;
    right: 0;
    bottom: ${props => props.$isOpen ? '0' : '-100%'};
    width: 100%;
    max-width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    border-radius: 20px 20px 0 0;
    padding-bottom: env(safe-area-inset-bottom);
    pointer-events: auto;
    z-index: 50001;
    transition: bottom 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: ${props => props.$theme === 'dark'
      ? 'linear-gradient(to bottom, #1a202c 0%, rgba(45, 55, 72, 0.8) 60%, transparent 100%)'
      : 'linear-gradient(to bottom, #ffffff 0%, rgba(247, 250, 252, 0.8) 60%, transparent 100%)'};
    pointer-events: none;
    z-index: 0;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    border-radius: 16px;
    transition: all 0.6s ease;
    pointer-events: none;
    z-index: 0;
    opacity: 0;
  }

  @keyframes flashyGlow {
    0%, 100% {
      box-shadow: ${props => props.$theme === 'dark'
        ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'},
        0 0 15px var(--glow-color, rgba(59, 130, 246, 0.35)),
        0 0 30px var(--glow-color, rgba(59, 130, 246, 0.15));
    }
    50% {
      box-shadow: ${props => props.$theme === 'dark'
        ? '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)'
        : '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)'},
        0 0 25px var(--glow-color, rgba(59, 130, 246, 0.55)),
        0 0 45px var(--glow-color, rgba(59, 130, 246, 0.25)),
        0 0 15px var(--glow-color-bright, rgba(139, 92, 246, 0.4));
    }
  }

  ${props => {
    const planGlowColors = {
      owner: { primary: 'rgba(244, 63, 94, 0.55)', bright: 'rgba(244, 63, 94, 0.85)' },
      premium: { primary: 'rgba(251, 191, 36, 0.45)', bright: 'rgba(251, 191, 36, 0.75)' },
      pro: { primary: 'rgba(139, 92, 246, 0.45)', bright: 'rgba(167, 139, 250, 0.75)' },
      free: { primary: 'rgba(59, 130, 246, 0.3)', bright: 'rgba(96, 165, 250, 0.6)' }
    };

    const colors = planGlowColors[props.$planInfo.plan] || planGlowColors.free;

    const glowColors = {
      'glow-red': 'rgba(239, 68, 68, 0.15)',
      'glow-green': 'rgba(16, 185, 129, 0.15)',
      'glow-purple': 'rgba(139, 92, 246, 0.15)',
      'glow-amber': 'rgba(245, 158, 11, 0.15)',
      'glow-blue': 'rgba(59, 130, 246, 0.15)',
      'glow-cyan': 'rgba(6, 182, 212, 0.15)',
      'glow-gray': 'rgba(107, 114, 128, 0.15)'
    };

    const itemColor = glowColors[props.$glow as keyof typeof glowColors];
    
    return `
      --glow-color: ${colors.primary};
      --glow-color-bright: ${colors.bright};
      animation: flashyGlow 4s infinite ease-in-out;
      border: 1px solid ${colors.primary.replace(/0\.\d+/, '0.3')};
      
      &::before { 
        background: radial-gradient(ellipse 400px 300px at var(--glow-x, 50%) var(--glow-y, 50%), ${itemColor || colors.primary.replace(/0\.\d+/, '0.1')} 0%, ${(itemColor || colors.primary).replace(/0\.\d+/, '0.05')} 40%, transparent 70%); 
        opacity: ${itemColor ? 1 : 0.7}; 
      }
    `;
  }}

  > * {
    position: relative;
    z-index: 2;
  }

  .section-title {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 6px 12px 2px 12px;
    margin-top: 4px;
    margin-bottom: 2px;

    @media (max-width: 640px) {
      grid-column: span 2;
      margin-top: 2px;
      margin-bottom: 1px;
    }
  }

  .menu-items {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    z-index: 1;

    @media (max-width: 640px) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      padding: 12px;
    }
  }

  .menu-divider {
    height: 1px;
    background: ${props => props.$theme === 'dark'
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)'};
    margin: 6px 0;

    @media (max-width: 640px) {
      grid-column: span 2;
      margin: 4px 0;
    }
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;

    @media (max-width: 640px) {
      padding: 6px 10px;
      gap: 6px;
    }

    &.menu-item-long {
      @media (max-width: 640px) {
        grid-column: span 2;
      }
    }

    &:hover {
      transform: translateX(2px);

      .item-icon {
        color: var(--item-hover-color, ${props => props.$theme === 'dark' ? '#818cf8' : '#6366f1'});
        transform: scale(1.05);
      }

      .item-label {
        color: ${props => props.$theme === 'dark' ? '#f1f5f9' : '#1e293b'};
      }
    }

    &:active {
      transform: translateX(2px) scale(0.98);
    }
  }

  .item-icon {
    color: var(--item-color, ${props => props.$theme === 'dark' ? '#94a3b8' : '#64748b'});
    transition: all 0.3s ease;
  }

  .item-label {
    font-weight: 500;
    font-size: 0.875rem;
    color: ${props => props.$theme === 'dark' ? '#e2e8f0' : '#334155'};
    transition: all 0.3s ease;
  }
`;

export default UserProfileDropdown;
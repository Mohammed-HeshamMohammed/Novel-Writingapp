import styled from 'styled-components';

export const StyledWrapper = styled.div<{ theme: 'light' | 'dark'; isOpen: boolean }>`
  .notifications-container {
    position: relative;
  }

  .popup {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: transparent;
    border: none;
    outline: none;
  }

  .popup:hover:not(.open) {
    background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }

  .popup:hover:not(.open) .bell-icon {
    color: ${props => props.theme === 'dark' ? '#f1f5f9' : '#334155'};
  }

  .popup.open {
    background-color: ${props => props.theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)'};
  }

  .popup-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.isOpen 
      ? (props.theme === 'dark' ? '#3b82f6' : '#2563eb')
      : (props.theme === 'dark' ? '#e2e8f0' : '#64748b')
    };
    pointer-events: none;
    transition: color 0.2s ease;
  }

  .bell-icon {
    transition: all 0.2s ease;
  }

  .bell-icon.ringing {
    animation: bellRing 0.6s ease-in-out;
  }

  @keyframes bellRing {
    0%, 100% { transform: rotate(0deg); }
    10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
    20%, 40%, 60%, 80% { transform: rotate(10deg); }
  }

  .notification-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0px 5px;
    border-radius: 10px;
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
    border: 2px solid ${props => props.theme === 'dark' ? '#1e293b' : '#ffffff'};
  }

  .popup-main {
    position: absolute;
    top: 100%;
    right: -160px;
    opacity: 0;
    margin-top: 8px;
    border-radius: 16px;
    width: 380px;
    max-height: 520px;
    background: ${props => props.theme === 'dark' 
      ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' 
      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'};
    backdrop-filter: blur(20px);
    border: 1px solid ${props => props.theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : 'rgba(148, 163, 184, 0.2)'};
    box-shadow: ${props => props.theme === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    z-index: 1000;
    pointer-events: none;
    transform: translateY(-10px) scale(0.95);
  }

  .popup-main.open {
    margin-top: 12px;
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  .notifications-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid ${props => props.theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : 'rgba(148, 163, 184, 0.15)'};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-title h3 {
    margin: 0 0 4px 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme === 'dark' ? '#f1f5f9' : '#0f172a'};
    letter-spacing: -0.025em;
  }

  .unread-count {
    font-size: 0.75rem;
    color: ${props => props.theme === 'dark' ? '#94a3b8' : '#64748b'};
    font-weight: 500;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-btn {
    background: none;
    border: none;
    color: ${props => props.theme === 'dark' ? '#94a3b8' : '#64748b'};
    cursor: pointer;
    font-size: 0.8rem;
    padding: 6px 10px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  .action-btn:hover {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : 'rgba(148, 163, 184, 0.1)'};
    color: ${props => props.theme === 'dark' ? '#f1f5f9' : '#334155'};
  }

  .action-btn.mark-read:hover {
    background-color: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }

  .action-btn.settings {
    padding: 6px;
  }

  .notifications-list {
    max-height: 360px;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .notifications-list::-webkit-scrollbar {
    display: none;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    padding: 16px 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    border-left: 3px solid transparent;
  }

  .notification-item:hover {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.05)' 
      : 'rgba(148, 163, 184, 0.08)'};
  }

  .notification-item.unread {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(59, 130, 246, 0.08)' 
      : 'rgba(59, 130, 246, 0.05)'};
    border-left-color: #3b82f6;
  }

  .notification-item.unread:hover {
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(59, 130, 246, 0.12)' 
      : 'rgba(59, 130, 246, 0.08)'};
  }

  .notification-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${props => props.theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : 'rgba(148, 163, 184, 0.08)'};
    margin-right: 16px;
    flex-shrink: 0;
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: ${props => props.theme === 'dark' ? '#f1f5f9' : '#0f172a'};
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .notification-message {
    font-size: 0.85rem;
    color: ${props => props.theme === 'dark' ? '#94a3b8' : '#64748b'};
    line-height: 1.5;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .notification-time {
    font-size: 0.75rem;
    color: ${props => props.theme === 'dark' ? '#64748b' : '#94a3b8'};
    font-weight: 500;
  }

  .unread-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    flex-shrink: 0;
    margin-left: 12px;
    margin-top: 6px;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .notifications-footer {
    padding: 7px 65px 35px;
    border-top: transparent ${props => props.theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : 'rgba(148, 163, 184, 0.15)'};
  }

  .clear-all-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background: none;
    border: 1px solid ${props => props.theme === 'dark' 
      ? 'rgba(239, 68, 68, 0.2)' 
      : 'rgba(239, 68, 68, 0.15)'};
    border-radius: 12px;
    color: ${props => props.theme === 'dark' ? '#fca5a5' : '#ef4444'};
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .clear-all-btn:hover {
    background-color: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
    transform: translateY(-1px);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    text-align: center;
  }

  .empty-icon {
    margin-bottom: 16px;
    opacity: 0.4;
    color: ${props => props.theme === 'dark' ? '#64748b' : '#94a3b8'};
  }

  .empty-text h4 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#475569'};
  }

  .empty-text p {
    margin: 0;
    font-size: 0.9rem;
    color: ${props => props.theme === 'dark' ? '#94a3b8' : '#64748b'};
  }
`;
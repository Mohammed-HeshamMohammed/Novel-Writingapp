import React, { useState } from 'react';
import { 
  X, User, Crown, Zap, Trash2, Plus, 
  Check, Globe, Activity, Eye, Sliders,
  Mail, PenSquare, ArrowLeft
} from 'lucide-react';
import type { Theme, UserPlanType, UserStatus } from '../../../shared/types/story';

interface ModalWrapperProps {
  theme: Theme;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ theme, title, onClose, children, maxWidth = 'max-w-md' }) => {
  const isDark = theme === 'dark';
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Card container */}
      <div className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl border p-6 shadow-2xl transition-all duration-300 scale-100 ${
        isDark 
          ? 'bg-gray-900/95 border-gray-800 text-white shadow-blue-500/5' 
          : 'bg-white/95 border-gray-200 text-gray-900 shadow-gray-200/50'
      }`}>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-500/10">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className={`rounded-full p-1.5 transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. Profile Modal
interface ProfileModalProps {
  theme: Theme;
  email?: string;
  username: string;
  avatarUrl?: string;
  planType: UserPlanType;
  status: UserStatus;
  onUpdate: (data: { username: string; avatarUrl?: string; status: UserStatus }) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  theme, email, username: initialUsername, avatarUrl: initialAvatar, planType, status: initialStatus, onUpdate, onClose
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar || '');
  const [status, setStatus] = useState<UserStatus>(initialStatus);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isDark = theme === 'dark';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ username, avatarUrl: avatarUrl || undefined, status });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsEditing(false);
    }, 1000);
  };

  const getPlanBadge = (plan: UserPlanType) => {
    switch (plan) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.35)] animate-pulse">
            <Crown className="w-3.5 h-3.5" /> Owner
          </span>
        );
      case 'premium':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5" /> Premium
          </span>
        );
      case 'pro':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Zap className="w-3.5 h-3.5" /> Pro
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <User className="w-3.5 h-3.5" /> Free Tier
          </span>
        );
    }
  };

  const bannerGradient = planType === 'owner'
    ? 'from-red-600 via-rose-600 to-red-800'
    : planType === 'premium'
      ? 'from-amber-500 via-yellow-600 to-amber-700'
      : planType === 'pro'
        ? 'from-violet-600 via-purple-600 to-fuchsia-700'
        : 'from-blue-600 via-indigo-600 to-indigo-800';

  const glowRing = planType === 'owner'
    ? 'ring-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.55)]'
    : planType === 'premium'
      ? 'ring-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
      : planType === 'pro'
        ? 'ring-purple-500/80 shadow-[0_0_20px_rgba(139,92,246,0.5)]'
        : 'ring-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.45)]';

  const statusColors = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  const statusLabel = {
    online: '🟢 Online',
    idle: '🌙 Idle',
    dnd: '🔴 Do Not Disturb',
    invisible: '⚪ Invisible'
  };

  return (
    <ModalWrapper theme={theme} title={isEditing ? "Edit Profile Settings" : "Creator Profile"} onClose={onClose}>
      {!isEditing ? (
        <div className="space-y-6">
          {/* Cover Banner */}
          <div className="relative">
            <div className={`h-24 w-full rounded-xl bg-gradient-to-r ${bannerGradient} shadow-inner`} />
            
            {/* Avatar centered on banner border */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
              <div className="relative">
                {initialAvatar ? (
                  <img 
                    src={initialAvatar} 
                    alt={username} 
                    className={`w-20 h-20 rounded-full object-cover ring-4 bg-gray-905 ${glowRing}`}
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ring-4 text-white bg-gradient-to-br from-indigo-500 to-purple-600 ${glowRing}`}>
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {/* Status Dot */}
                <span className={`absolute bottom-0 right-0 block h-5 w-5 rounded-full border-2 ${isDark ? 'border-gray-950' : 'border-white'} ${statusColors[status]}`} />
              </div>
            </div>
          </div>

          {/* Profile Name Header */}
          <div className="text-center pt-8 space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight">{username}</h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-center gap-1`}>
              <Mail className="w-3.5 h-3.5 inline" /> {email || 'offline_user@novelist.app'}
            </p>
            <div className="flex justify-center pt-1.5">{getPlanBadge(planType)}</div>
          </div>

          {/* User Stats Widgets */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-gray-800/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <span className={`text-lg font-bold block ${isDark ? 'text-white' : 'text-gray-900'}`}>5</span>
              <span className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>Stories</span>
            </div>
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-gray-800/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <span className={`text-lg font-bold block ${isDark ? 'text-white' : 'text-gray-900'}`}>12</span>
              <span className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>Characters</span>
            </div>
            <div className={`p-3 rounded-xl border text-center flex flex-col justify-center items-center ${isDark ? 'bg-gray-800/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <span className="text-xs font-semibold block text-blue-500">{statusLabel[status].split(' ')[1]}</span>
              <span className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mt-1`}>Status</span>
            </div>
          </div>

          {/* Preferences Link & Action */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/10"
            >
              <PenSquare className="w-4 h-4" /> Edit Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all active:scale-95 ${
                isDark 
                  ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800 text-gray-300' 
                  : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Header Switch */}
          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold">Back to profile card</span>
          </div>

          {/* Username field */}
          <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Display Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Avatar URL field */}
          <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Avatar Image URL</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input 
                type="url" 
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Status selection */}
          <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current Status</label>
            <div className="relative">
              <Activity className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="online">🟢 Online</option>
                <option value="idle">🌙 Idle</option>
                <option value="dnd">🔴 Do Not Disturb</option>
                <option value="invisible">⚪ Invisible</option>
              </select>
            </div>
          </div>

          {/* Save button */}
          <div className="pt-2 flex gap-2">
            <button 
              type="submit" 
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                isSaved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10'
              }`}
            >
              {isSaved ? (
                <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> Profile Updated!</span>
              ) : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all active:scale-95 ${
                isDark 
                  ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800 text-gray-300' 
                  : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
};

// 2. Settings Modal
interface SettingsModalProps {
  theme: Theme;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ theme, onClose }) => {
  const isDark = theme === 'dark';
  
  // Local states for preferences loaded from localStorage
  const [autoSave, setAutoSave] = useState(() => localStorage.getItem('writer-auto-save') !== 'false');
  const [spellCheck, setSpellCheck] = useState(() => localStorage.getItem('writer-spell-check') !== 'false');
  const [wordWrap, setWordWrap] = useState(() => localStorage.getItem('writer-word-wrap') !== 'false');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('writer-font-size') || 'medium');
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('writer-font-family') || 'serif');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('writer-auto-save', String(autoSave));
    localStorage.setItem('writer-spell-check', String(spellCheck));
    localStorage.setItem('writer-word-wrap', String(wordWrap));
    localStorage.setItem('writer-font-size', fontSize);
    localStorage.setItem('writer-font-family', fontFamily);
    
    // Apply styling changes immediately if necessary (e.g. editor font settings)
    window.dispatchEvent(new Event('writer-settings-changed'));
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const renderToggle = (label: string, desc: string, value: boolean, onChange: (v: boolean) => void) => {
    return (
      <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
        isDark ? 'bg-gray-800/25 border-gray-800/80' : 'bg-gray-50/70 border-gray-200'
      }`}>
        <div className="space-y-0.5 pr-2">
          <label className="text-sm font-semibold tracking-tight block">{label}</label>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{desc}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            value ? 'bg-blue-600' : isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <ModalWrapper theme={theme} title="Writing Preferences" onClose={onClose}>
      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Toggle options */}
        <div className="space-y-2.5">
          {renderToggle("Auto-save Content", "Automatically save to cloud/storage", autoSave, setAutoSave)}
          {renderToggle("Active Spell Check", "Highlight typos and spelling errors", spellCheck, setSpellCheck)}
          {renderToggle("Soft Word Wrap", "Wraps long lines to fit your viewport", wordWrap, setWordWrap)}
        </div>

        <div className="border-t border-gray-500/10 pt-4 space-y-4">
          {/* Font size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1.5"><Eye className="w-4 h-4 text-blue-500" /> Editor Font Size</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'small', label: 'A', desc: '14px', textStyle: 'text-xs' },
                { value: 'medium', label: 'A', desc: '16px', textStyle: 'text-sm' },
                { value: 'large', label: 'A', desc: '18px', textStyle: 'text-base' },
                { value: 'xlarge', label: 'A', desc: '20px', textStyle: 'text-lg' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFontSize(opt.value)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 active:scale-95 ${
                    fontSize === opt.value
                      ? 'bg-blue-600 text-white border-transparent shadow-md'
                      : isDark
                        ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/80 text-gray-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className={`${opt.textStyle} font-bold`}>{opt.label}</span>
                  <span className="text-[10px] opacity-80 mt-0.5 font-medium">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1.5"><Sliders className="w-4 h-4 text-purple-500" /> Typography Family</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'serif', label: 'Georgia', fontClass: 'font-serif' },
                { value: 'sans', label: 'Sans-Ui', fontClass: 'font-sans' },
                { value: 'monospace', label: 'Courier', fontClass: 'font-mono' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFontFamily(opt.value)}
                  className={`p-3 rounded-xl border transition-all duration-200 text-center active:scale-95 ${
                    fontFamily === opt.value
                      ? 'bg-purple-600 text-white border-transparent shadow-md'
                      : isDark
                        ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/80 text-gray-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className={`text-xs block font-bold ${opt.fontClass}`}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2 flex gap-2">
          <button 
            type="submit" 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isSaved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10'
            }`}
          >
            {isSaved ? (
              <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> Preferences Saved!</span>
            ) : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all active:scale-95 ${
              isDark 
                ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800 text-gray-300' 
                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// 3. Pricing Modal
interface PricingModalProps {
  theme: Theme;
  userPlan: UserPlanType;
  onUpgrade: (plan: UserPlanType) => void;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ theme, userPlan, onUpgrade, onClose }) => {
  const isDark = theme === 'dark';
  const [successPlan, setSuccessPlan] = useState<UserPlanType | null>(null);

  const handleUpgrade = (tier: UserPlanType) => {
    onUpgrade(tier);
    setSuccessPlan(tier);
    setTimeout(() => {
      setSuccessPlan(null);
      onClose();
    }, 1500);
  };

  return (
    <ModalWrapper theme={theme} title="Novelist Premium Tiers" onClose={onClose} maxWidth="max-w-3xl">
      <p className={`text-sm text-center mb-6 max-w-lg mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Choose the perfect plan to organize your creative writing, sync stories to the cloud, and access advanced writing assistants.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Free Plan */}
        <div className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 relative ${
          isDark 
            ? 'bg-gray-800/20 border-gray-800 text-white hover:border-gray-700' 
            : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
        }`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold">Basic Free</h3>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Core writing features</p>
          </div>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-3xl font-extrabold">$0</span>
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/ forever</span>
          </div>
          <ul className={`text-xs space-y-2.5 mb-6 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500" /> Save up to 3 stories</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500" /> Basic rich text editing</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500" /> Offline localStorage backup</li>
          </ul>
          <button
            disabled={userPlan === 'free'}
            onClick={() => handleUpgrade('free')}
            className={`w-full py-2 text-xs font-semibold rounded-xl border transition-colors ${
              userPlan === 'free'
                ? 'bg-transparent text-blue-500 border-blue-500/20 cursor-default'
                : isDark ? 'bg-gray-800 hover:bg-gray-700 text-white border-transparent' : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
            }`}
          >
            {userPlan === 'free' ? 'Current Tier' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro Plan (Middle Card - Highlighted/Glow) */}
        <div className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 relative scale-100 md:scale-105 shadow-xl ${
          isDark 
            ? 'bg-purple-950/20 border-purple-500/30 text-white ring-1 ring-purple-500/20 shadow-purple-500/5' 
            : 'bg-purple-50/50 border-purple-200 text-gray-900 ring-1 ring-purple-200 shadow-purple-200/50'
        }`}>
          <div className="absolute -top-3 right-4 bg-purple-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
            VIP Recommended
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-1"><Zap className="w-4 h-4 text-purple-500 fill-purple-500" /> Pro Writer</h3>
            <p className={`text-xs ${isDark ? 'text-purple-400/60' : 'text-purple-600/70'}`}>Enhanced cloud capacity & VIP perks</p>
          </div>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-3xl font-extrabold">$9.99</span>
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/ month</span>
          </div>
          <ul className={`text-xs space-y-2.5 mb-6 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> Unlimited Cloud Stories</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> Sync across multiple devices</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> 10 custom Character slots</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-500" /> Advanced analytics & exports</li>
          </ul>
          <button
            onClick={() => handleUpgrade('pro')}
            className={`w-full py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
              userPlan === 'pro'
                ? 'bg-transparent text-purple-500 border border-purple-500/20 cursor-default'
                : successPlan === 'pro'
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
            }`}
          >
            {userPlan === 'pro' ? 'Current Tier' : successPlan === 'pro' ? 'Upgraded!' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 relative ${
          isDark 
            ? 'bg-yellow-950/10 border-yellow-500/20 text-white hover:border-yellow-500/30' 
            : 'bg-yellow-50/20 border-yellow-200 text-gray-900 hover:border-yellow-300'
        }`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-1"><Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Premium Elite</h3>
            <p className={`text-xs ${isDark ? 'text-yellow-400/60' : 'text-yellow-600/70'}`}>Ultimate toolkit & AI integration</p>
          </div>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-3xl font-extrabold">$19.99</span>
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/ month</span>
          </div>
          <ul className={`text-xs space-y-2.5 mb-6 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-500" /> Everything in Pro plan</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-500" /> Unlimited Character generation</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-500" /> AI-powered writing suggestion bots</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-500" /> Early beta access & priority support</li>
          </ul>
          <button
            onClick={() => handleUpgrade('premium')}
            className={`w-full py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
              userPlan === 'premium'
                ? 'bg-transparent text-yellow-500 border border-yellow-500/20 cursor-default'
                : successPlan === 'premium'
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md shadow-yellow-500/20'
            }`}
          >
            {userPlan === 'premium' ? 'Current Tier' : successPlan === 'premium' ? 'Upgraded!' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 4. Character List Modal
export interface Character {
  id: string;
  name: string;
  role: string;
  traits: string[];
  description: string;
  avatarUrl?: string;
  createdAt: string;
}

interface CharactersModalProps {
  theme: Theme;
  characters: Character[];
  onDeleteCharacter: (id: string) => void;
  onCreateCharacterClick: () => void;
  onClose: () => void;
}

export const CharactersModal: React.FC<CharactersModalProps> = ({
  theme, characters, onDeleteCharacter, onCreateCharacterClick, onClose
}) => {
  const isDark = theme === 'dark';

  return (
    <ModalWrapper theme={theme} title="Global Character Bank" onClose={onClose} maxWidth="max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your fictional characters globally. Import them inside any book editor.
        </p>
        <button
          onClick={onCreateCharacterClick}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add New
        </button>
      </div>

      {characters.length === 0 ? (
        <div className={`p-8 text-center rounded-xl border border-dashed ${
          isDark ? 'bg-gray-800/10 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <User className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <h4 className="text-sm font-semibold">No Characters Created</h4>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Click "Add New" to customize your first protagonist or antagonist!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {characters.map(char => (
            <div 
              key={char.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-gray-800/40 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {char.avatarUrl ? (
                  <img src={char.avatarUrl} alt={char.name} className="w-10 h-10 rounded-full object-cover border border-gray-500/20" />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isDark ? 'bg-gray-800 text-blue-400' : 'bg-gray-200 text-blue-600'
                  }`}>
                    {char.name.charAt(0)}
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold">{char.name}</h4>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                      isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>{char.role}</span>
                  </div>
                  <p className={`text-xs line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{char.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {char.traits.slice(0, 3).map((trait, idx) => (
                      <span key={idx} className="text-[9px] bg-blue-500/10 text-blue-400 px-1 rounded-sm">{trait}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteCharacter(char.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-red-950/40 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                }`}
                title="Delete Character"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ModalWrapper>
  );
};

// 5. Create Character Modal
interface CreateCharacterModalProps {
  theme: Theme;
  onCreate: (char: Omit<Character, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({ theme, onCreate, onClose }) => {
  const isDark = theme === 'dark';
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('Protagonist');
  const [traitsText, setTraitsText] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const traits = traitsText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
      
    onCreate({
      name,
      role,
      traits,
      description,
      avatarUrl: avatarUrl || undefined
    });
    onClose();
  };

  return (
    <ModalWrapper theme={theme} title="Create Character" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Character Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. John Doe"
            className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Role Select */}
        <div className="space-y-1">
          <label className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Role in Narrative</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="Protagonist">Hero / Protagonist</option>
            <option value="Antagonist">Antagonist / Villain</option>
            <option value="Mentor">Mentor / Guide</option>
            <option value="Sidekick">Sidekick / Ally</option>
            <option value="Love Interest">Love Interest</option>
            <option value="Supporting">Supporting Character</option>
          </select>
        </div>

        {/* Traits (Comma Separated) */}
        <div className="space-y-1">
          <label className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Traits (comma-separated)</label>
          <input 
            type="text" 
            value={traitsText}
            onChange={(e) => setTraitsText(e.target.value)}
            placeholder="e.g. brave, sarcastic, short-tempered"
            className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Short Backstory / Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Briefly describe character background or motivations..."
            className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Avatar Image URL */}
        <div className="space-y-1">
          <label className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Avatar Image URL (optional)</label>
          <input 
            type="url" 
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/character-image.png"
            className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={onClose}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-colors ${
              isDark ? 'bg-gray-800 hover:bg-gray-700 text-white border-transparent' : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
            }`}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow shadow-blue-500/20 transition-all duration-300"
          >
            Create
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

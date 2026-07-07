import React, { useState } from 'react';
import { ArrowLeft, Upload, Download, Save } from 'lucide-react';
import { ThemeSwitch } from '../shared/ThemeSwitch';
import { TooltipButton } from '../shared/TooltipButton';
import { SettingsIcon } from '../shared/SettingsIcon';
import { getThemeStyles } from '../utils/themeUtils';
import { SettingsPopup } from '../../editor/SettingsPopup';
import { EditorMobileBottomNav } from './EditorMobileBottomNav';
import type { WritingMode, Theme } from '../../../shared/types/story';

interface EditorNavBarProps {
  onBack?: () => void;
  onSave?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onWritingModeChange?: (mode: WritingMode) => void;
  onThemeChange?: (theme: Theme) => void;
  writingMode?: WritingMode;
  theme: Theme;
  isSaving?: boolean;
  isExporting?: boolean;
  isImporting?: boolean;
  leftSidebarTabs?: string[];
  rightSidebarTabs?: string[];
  onSidebarTabsChange?: (sidebar: 'left' | 'right', tabs: string[]) => void;
  leftSectionOffset?: number;
  rightSectionOffset?: number;
  editorThemeTogglePosition?: number;
  themeToggleDebounceMs?: number;
}

export const EditorNavBar: React.FC<EditorNavBarProps> = ({
  onBack,
  onSave,
  onImport,
  onExport,
  onWritingModeChange,
  onThemeChange,
  writingMode = 'guided',
  theme,
  isSaving = false,
  isExporting = false,
  isImporting = false,
  leftSidebarTabs = ['chapters', 'characters', 'locations', 'timeline'],
  rightSidebarTabs = ['suggestions', 'analytics', 'history', 'notes'],
  onSidebarTabsChange,
  leftSectionOffset = 24,
  rightSectionOffset = 24,
  editorThemeTogglePosition = 0,
  themeToggleDebounceMs = 300,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const styles = getThemeStyles(theme);

  const handleAction = (action?: () => void) => {
    try {
      action?.();
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const handleModeChange = (mode: WritingMode) => {
    try {
      onWritingModeChange?.(mode);
    } catch (error) {
      console.error('Error changing writing mode:', error);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    try {
      onThemeChange?.(newTheme);
    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  const modes: { key: WritingMode; label: string }[] = [
    { key: 'guided', label: 'Guided' },
    { key: 'describe', label: 'Describe' },
    { key: 'rewrite', label: 'Rewrite' },
    { key: 'brainstorm', label: 'Brainstorm' },
    { key: 'visualize', label: 'Visualize' },
  ];

  const getSaveStatus = () => {
    if (isSaving) return { status: 'saving', color: 'bg-yellow-400 animate-pulse' };
    return { status: 'saved', color: 'bg-emerald-400' };
  };

  const saveStatusInfo = getSaveStatus();

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <nav className={`${styles.nav} border-b shadow-lg relative z-[9998]`}>
        <div className="flex items-center justify-between h-14 md:h-16 px-3 md:px-6 relative gap-2">
          <div
            className="flex items-center gap-2 md:space-x-4 min-w-0"
            style={{ paddingLeft: `${leftSectionOffset}px` }}
          >
            <TooltipButton
              tooltip="Go Back"
              onClick={() => handleAction(onBack)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0 ${styles.button}`}
              theme={theme}
            >
              <ArrowLeft className="w-5 h-5" />
            </TooltipButton>

            <div className={`flex items-center gap-1.5 px-2 py-1 md:hidden ${styles.statusBg} rounded-lg flex-shrink-0`}>
              <div className={`w-2 h-2 rounded-full ${saveStatusInfo.color}`}></div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {modes.map((mode) => (
                <TooltipButton
                  key={mode.key}
                  tooltip={`Switch to ${mode.label} mode`}
                  onClick={() => handleModeChange(mode.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
                    writingMode === mode.key
                      ? styles.buttonActive
                      : `${styles.textSecondary} ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`
                  }`}
                  theme={theme}
                >
                  {mode.label}
                </TooltipButton>
              ))}
            </div>
          </div>

          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className={`flex items-center space-x-2 px-3 py-1.5 ${styles.statusBg} rounded-lg`}>
              <div className={`w-2 h-2 rounded-full ${saveStatusInfo.color}`}></div>
              <span className={`text-sm ${styles.textSecondary} capitalize`}>{saveStatusInfo.status}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3" style={{ paddingRight: `${rightSectionOffset}px` }}>
            <TooltipButton
              tooltip="Import Story"
              onClick={() => handleAction(onImport)}
              disabled={isImporting}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${styles.button}`}
              theme={theme}
            >
              <Upload className="w-4 h-4" />
            </TooltipButton>

            <TooltipButton
              tooltip="Export Story"
              onClick={() => handleAction(onExport)}
              disabled={isExporting}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${styles.button}`}
              theme={theme}
            >
              <Download className="w-4 h-4" />
            </TooltipButton>

            <TooltipButton
              tooltip="Save Story"
              onClick={() => handleAction(onSave)}
              disabled={isSaving}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${styles.button}`}
              theme={theme}
            >
              <Save className="w-4 h-4" />
            </TooltipButton>

            <div className={`w-px h-6 ${styles.divider}`} />

            <TooltipButton
              tooltip="Settings configuration"
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${styles.button}`}
              theme={theme}
            >
              <SettingsIcon />
            </TooltipButton>
          </div>

          {onThemeChange && (
            <>
              <div
                className="hidden md:block md:absolute md:top-1/2 md:transform md:-translate-y-1/2"
                style={{ right: `${editorThemeTogglePosition}px` }}
              >
                <ThemeSwitch
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  debounceMs={themeToggleDebounceMs}
                />
              </div>
              <div className="md:hidden flex-shrink-0">
                <ThemeSwitch
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  debounceMs={themeToggleDebounceMs}
                />
              </div>
            </>
          )}
        </div>

        <div className="md:hidden overflow-x-auto scrollbar-hide px-3 pb-2">
          <div className="flex gap-2 min-w-max">
            {modes.map((mode) => (
              <TooltipButton
                key={mode.key}
                tooltip={`Switch to ${mode.label} mode`}
                onClick={() => handleModeChange(mode.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                  writingMode === mode.key
                    ? styles.buttonActive
                    : `${styles.textSecondary} ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`
                }`}
                theme={theme}
              >
                {mode.label}
              </TooltipButton>
            ))}
          </div>
        </div>
      </nav>

      <EditorMobileBottomNav
        theme={theme}
        onImport={() => handleAction(onImport)}
        onExport={() => handleAction(onExport)}
        onSave={() => handleAction(onSave)}
        onSettings={() => setShowSettings(true)}
        isSaving={isSaving}
        isExporting={isExporting}
        isImporting={isImporting}
      />

      {onSidebarTabsChange && (
        <SettingsPopup
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          leftSidebarTabs={leftSidebarTabs}
          rightSidebarTabs={rightSidebarTabs}
          onSidebarTabsChange={onSidebarTabsChange}
        />
      )}
    </>
  );
};

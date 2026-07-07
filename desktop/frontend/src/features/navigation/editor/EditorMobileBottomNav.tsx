import React from 'react';
import { Upload, Save, Download, Settings } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';
import type { Theme } from '../../../shared/types/story';

interface EditorMobileBottomNavProps {
  theme: Theme;
  onImport: () => void;
  onExport: () => void;
  onSave: () => void;
  onSettings: () => void;
  isSaving?: boolean;
  isExporting?: boolean;
  isImporting?: boolean;
}

export const EditorMobileBottomNav: React.FC<EditorMobileBottomNavProps> = ({
  theme,
  onImport,
  onExport,
  onSave,
  onSettings,
  isSaving = false,
  isExporting = false,
  isImporting = false,
}) => {
  const styles = getThemeStyles(theme);

  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-50 border-t ${styles.nav} pb-[env(safe-area-inset-bottom)]`}
    >
      <div className="flex items-center justify-around h-16 px-2">
        <button
          type="button"
          onClick={onImport}
          disabled={isImporting}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg disabled:opacity-50 ${styles.textSecondary}`}
          aria-label="Import Story"
        >
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-medium">Import</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg disabled:opacity-50 ${styles.textSecondary}`}
          aria-label="Export Story"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-medium">Export</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg -translate-y-4 disabled:opacity-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Save Story"
        >
          <Save className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={onSettings}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg ${styles.textSecondary}`}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
};

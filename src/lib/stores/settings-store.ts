import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';
export type FontSize = 12 | 14 | 16 | 18;

interface SettingsState {
  theme: Theme;
  fontSize: FontSize;
  autoSaveEnabled: boolean;
  autoSaveDelay: 500 | 1000 | 2000;
  lineNumbers: boolean;
  minimap: boolean;
  wordWrap: boolean;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAutoSaveDelay: (delay: 500 | 1000 | 2000) => void;
  setLineNumbers: (enabled: boolean) => void;
  setMinimap: (enabled: boolean) => void;
  setWordWrap: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 14,
      autoSaveEnabled: true,
      autoSaveDelay: 1000,
      lineNumbers: true,
      minimap: true,
      wordWrap: true,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setAutoSaveEnabled: (autoSaveEnabled) => set({ autoSaveEnabled }),
      setAutoSaveDelay: (autoSaveDelay) => set({ autoSaveDelay }),
      setLineNumbers: (lineNumbers) => set({ lineNumbers }),
      setMinimap: (minimap) => set({ minimap }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
    }),
    {
      name: 'beesto-settings',
    }
  )
);

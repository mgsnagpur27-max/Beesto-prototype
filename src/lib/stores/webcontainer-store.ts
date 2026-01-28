import { create } from 'zustand';
import type { ContainerStatus } from '@/lib/webcontainer';

interface WebContainerState {
  status: ContainerStatus;
  previewUrl: string | null;
  error: string | null;
  terminalOutput: string[];
  isInstalling: boolean;
  isServerRunning: boolean;
  
  setStatus: (status: ContainerStatus) => void;
  setPreviewUrl: (url: string | null) => void;
  setError: (error: string | null) => void;
  appendOutput: (output: string) => void;
  clearOutput: () => void;
  setInstalling: (installing: boolean) => void;
  setServerRunning: (running: boolean) => void;
}

export const useWebContainerStore = create<WebContainerState>((set) => ({
  status: 'idle',
  previewUrl: null,
  error: null,
  terminalOutput: [],
  isInstalling: false,
  isServerRunning: false,

  setStatus: (status) => set({ status }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setError: (error) => set({ error }),
  appendOutput: (output) => set((state) => ({ 
    terminalOutput: [...state.terminalOutput.slice(-500), output] 
  })),
  clearOutput: () => set({ terminalOutput: [] }),
  setInstalling: (installing) => set({ isInstalling: installing }),
  setServerRunning: (running) => set({ isServerRunning: running }),
}));

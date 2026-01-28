import { create } from 'zustand';
import type { FileNode } from '@/types';

interface FileTreeState {
  rootNodes: FileNode[];
  selectedPath: string | null;
  searchTerm: string;
  expandedPaths: Set<string>;
  isLoading: boolean;
  contextMenuPath: string | null;
  contextMenuPosition: { x: number; y: number } | null;
  
  setRootNodes: (nodes: FileNode[]) => void;
  setSelectedPath: (path: string | null) => void;
  setSearchTerm: (term: string) => void;
  toggleExpanded: (path: string) => void;
  setExpanded: (path: string, expanded: boolean) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setLoading: (loading: boolean) => void;
  openContextMenu: (path: string, position: { x: number; y: number }) => void;
  closeContextMenu: () => void;
  refreshTree: () => Promise<void>;
}

function collectAllPaths(nodes: FileNode[]): string[] {
  const paths: string[] = [];
  function traverse(node: FileNode) {
    if (node.type === 'directory') {
      paths.push(node.path);
      node.children?.forEach(traverse);
    }
  }
  nodes.forEach(traverse);
  return paths;
}

export const useFileTreeStore = create<FileTreeState>((set, get) => ({
  rootNodes: [],
  selectedPath: null,
  searchTerm: '',
  expandedPaths: new Set(['/src', '/src/app']),
  isLoading: false,
  contextMenuPath: null,
  contextMenuPosition: null,

  setRootNodes: (nodes) => set({ rootNodes: nodes }),

  setSelectedPath: (path) => set({ selectedPath: path }),

  setSearchTerm: (term) => set({ searchTerm: term }),

  toggleExpanded: (path) => {
    set((state) => {
      const newExpanded = new Set(state.expandedPaths);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return { expandedPaths: newExpanded };
    });
  },

  setExpanded: (path, expanded) => {
    set((state) => {
      const newExpanded = new Set(state.expandedPaths);
      if (expanded) {
        newExpanded.add(path);
      } else {
        newExpanded.delete(path);
      }
      return { expandedPaths: newExpanded };
    });
  },

  expandAll: () => {
    const { rootNodes } = get();
    const allPaths = collectAllPaths(rootNodes);
    set({ expandedPaths: new Set(allPaths) });
  },

  collapseAll: () => {
    set({ expandedPaths: new Set() });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  openContextMenu: (path, position) => {
    set({ contextMenuPath: path, contextMenuPosition: position });
  },

  closeContextMenu: () => {
    set({ contextMenuPath: null, contextMenuPosition: null });
  },

  refreshTree: async () => {
    const { expandedPaths } = get();
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ isLoading: false, expandedPaths });
  },
}));

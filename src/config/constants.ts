export const AI_MODELS = {
  SAMBANOVA: {
    name: 'SambaNova',
    models: ['Meta-Llama-3.1-8B-Instruct', 'Meta-Llama-3.1-70B-Instruct'],
  },
  GROQ: {
    name: 'Groq',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  },
} as const;

export const EDITOR_CONFIG = {
  fontSize: 14,
  tabSize: 2,
  minimap: { enabled: false },
  lineNumbers: 'on' as const,
  wordWrap: 'on' as const,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  theme: 'vs-dark',
};

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  css: 'css',
  scss: 'scss',
  html: 'html',
  md: 'markdown',
  py: 'python',
  rs: 'rust',
  go: 'go',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  sh: 'shell',
  bash: 'shell',
};

export const FILE_ICONS: Record<string, string> = {
  ts: '📘',
  tsx: '⚛️',
  js: '📒',
  jsx: '⚛️',
  json: '📋',
  css: '🎨',
  html: '🌐',
  md: '📝',
  py: '🐍',
  rs: '🦀',
  go: '🐹',
  folder: '📁',
  default: '📄',
};

export const TERMINAL_THEME = {
  background: 'hsl(240, 10%, 3.9%)',
  foreground: 'hsl(0, 0%, 98%)',
  cursor: 'hsl(239, 84%, 67%)',
  cursorAccent: 'hsl(240, 10%, 3.9%)',
  selection: 'hsl(239, 84%, 67%, 0.3)',
  black: '#1a1a2e',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#6366f1',
  magenta: '#a855f7',
  cyan: '#06b6d4',
  white: '#f8fafc',
  brightBlack: '#475569',
  brightRed: '#f87171',
  brightGreen: '#4ade80',
  brightYellow: '#facc15',
  brightBlue: '#818cf8',
  brightMagenta: '#c084fc',
  brightCyan: '#22d3ee',
  brightWhite: '#ffffff',
};

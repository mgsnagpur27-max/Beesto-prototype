"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Moon, Sun, Monitor, Type, Save, Eye, WrapText, Hash } from "lucide-react";
import { useSettingsStore, type Theme, type FontSize } from "@/lib/stores/settings-store";
import { useUIStore, AI_MODELS } from "@/lib/stores/ui-store";

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    theme,
    fontSize,
    autoSaveEnabled,
    autoSaveDelay,
    lineNumbers,
    minimap,
    wordWrap,
    setTheme,
    setFontSize,
    setAutoSaveEnabled,
    setAutoSaveDelay,
    setLineNumbers,
    setMinimap,
    setWordWrap,
  } = useSettingsStore();

  const { selectedModel, setSelectedModel } = useUIStore();

  const themes: { value: Theme; label: string; icon: typeof Moon }[] = [
    { value: "dark", label: "Dark", icon: Moon },
    { value: "light", label: "Light", icon: Sun },
    { value: "system", label: "System", icon: Monitor },
  ];

  const fontSizes: FontSize[] = [12, 14, 16, 18];
  const delays: { value: 500 | 1000 | 2000; label: string }[] = [
    { value: 500, label: "500ms" },
    { value: 1000, label: "1s" },
    { value: 2000, label: "2s" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        title="Settings"
      >
        <Settings className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-80 border-l border-[#1a1a24] bg-[#0c0c10] shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#1a1a24] px-4 py-3">
                <h2 className="font-semibold text-zinc-200">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                <section className="space-y-3">
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Appearance</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                      {themes.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setTheme(value)}
                          className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                            theme === value
                              ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                              : "border-[#2a2a3a] bg-[#0a0a0f] text-zinc-400 hover:bg-[#1a1a24]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-zinc-400">
                      <Type className="h-3.5 w-3.5" />
                      Font Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {fontSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                            fontSize === size
                              ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                              : "border-[#2a2a3a] bg-[#0a0a0f] text-zinc-400 hover:bg-[#1a1a24]"
                          }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Editor</h3>
                  
                  <ToggleOption
                    icon={Hash}
                    label="Line Numbers"
                    checked={lineNumbers}
                    onChange={setLineNumbers}
                  />
                  
                  <ToggleOption
                    icon={Eye}
                    label="Minimap"
                    checked={minimap}
                    onChange={setMinimap}
                  />
                  
                  <ToggleOption
                    icon={WrapText}
                    label="Word Wrap"
                    checked={wordWrap}
                    onChange={setWordWrap}
                  />
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Auto-Save</h3>
                  
                  <ToggleOption
                    icon={Save}
                    label="Enable Auto-Save"
                    checked={autoSaveEnabled}
                    onChange={setAutoSaveEnabled}
                  />
                  
                  {autoSaveEnabled && (
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">Delay</label>
                      <div className="grid grid-cols-3 gap-2">
                        {delays.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setAutoSaveDelay(value)}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                              autoSaveDelay === value
                                ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                                : "border-[#2a2a3a] bg-[#0a0a0f] text-zinc-400 hover:bg-[#1a1a24]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">AI Model</h3>
                  <div className="space-y-2">
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          selectedModel.id === model.id
                            ? "border-violet-500/50 bg-violet-500/10"
                            : "border-[#2a2a3a] bg-[#0a0a0f] hover:bg-[#1a1a24]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            selectedModel.id === model.id ? "text-violet-400" : "text-zinc-300"
                          }`}>
                            {model.name}
                          </span>
                          <span className="text-xs text-zinc-500">{model.contextWindow}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-zinc-500">{model.provider}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {model.speed}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-3 pt-2">
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Shortcuts</h3>
                  <div className="space-y-2 text-xs">
                    <ShortcutRow label="Save File" keys={["⌘", "S"]} />
                    <ShortcutRow label="Toggle Chat" keys={["⌘", "K"]} />
                    <ShortcutRow label="Toggle Terminal" keys={["⌘", "`"]} />
                    <ShortcutRow label="Close Tab" keys={["⌘", "W"]} />
                    <ShortcutRow label="Next Tab" keys={["⌘", "Tab"]} />
                    <ShortcutRow label="Preview" keys={["⌘", "1"]} />
                    <ShortcutRow label="Code" keys={["⌘", "2"]} />
                    <ShortcutRow label="Close Modal" keys={["Esc"]} />
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ToggleOption({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Moon;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-[#2a2a3a] bg-[#0a0a0f] px-3 py-2.5 transition-colors hover:bg-[#1a1a24]"
    >
      <span className="flex items-center gap-2 text-sm text-zinc-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-violet-500" : "bg-zinc-700"
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}

function ShortcutRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-zinc-400">{label}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

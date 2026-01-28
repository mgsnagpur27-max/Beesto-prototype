"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, Share2, Play, HelpCircle, Terminal, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/lib/stores/ui-store";
import { SettingsPanel } from "./settings-panel";
import { webContainerManager } from "@/lib/webcontainer";

export function TopBar() {
  const { isTerminalOpen, toggleTerminal } = useUIStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportProject = useCallback(async () => {
    setIsExporting(true);
    try {
      const files = await webContainerManager.readAllFiles();
      if (!files || Object.keys(files).length === 0) {
        console.error("No files to export");
        return;
      }

      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      for (const [path, content] of Object.entries(files)) {
        if (typeof content === "string") {
          zip.file(path, content);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `beesto-project-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <header className="flex h-12 items-center justify-between border-b border-[#1a1a24] bg-[#0a0a0f] px-3">
      <div className="flex items-center gap-3">
        <Link 
          href="/"
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-label="Back to home"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>
        <div className="h-5 w-px bg-[#1a1a24]" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">B</span>
          </div>
          <span className="text-sm font-medium text-zinc-200">Beesto Project</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={toggleTerminal}
          className={`p-2 rounded-lg transition-colors ${
            isTerminalOpen 
              ? "text-violet-400 bg-violet-500/10" 
              : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a24]"
          }`}
          aria-label={isTerminalOpen ? "Hide terminal" : "Show terminal"}
          title="Toggle Terminal (⌘+`)"
        >
          <Terminal className="h-4 w-4" />
        </button>
        
        <button 
          onClick={handleExportProject}
          disabled={isExporting}
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a24] rounded-lg transition-colors disabled:opacity-50"
          aria-label="Export project"
          title="Download as ZIP"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </button>

        <div className="w-px h-5 bg-[#1a1a24] mx-1" />
        
        <button 
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          aria-label="Deploy project"
        >
          <Play className="h-3.5 w-3.5" />
          Deploy
        </button>
        <button 
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a24] rounded-lg transition-colors"
          aria-label="Share project"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <button 
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a24] rounded-lg transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <SettingsPanel />
      </div>
    </header>
  );
}

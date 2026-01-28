"use client";

import { FileCode, GitBranch, Circle, MessageSquare } from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";

export function StatusBar() {
  const { isChatOpen, toggleChat } = useUIStore();

  return (
    <footer className="flex h-7 items-center justify-between border-t border-border/50 bg-card/80 px-3 text-xs text-muted-foreground backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <GitBranch className="h-3.5 w-3.5" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle className="h-2 w-2 fill-success text-success" />
          <span>Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <FileCode className="h-3.5 w-3.5" />
          <span>TypeScript</span>
        </div>
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <button
          onClick={toggleChat}
          className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors hover:bg-muted ${
            isChatOpen ? "text-primary" : ""
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>⌘K</span>
        </button>
      </div>
    </footer>
  );
}

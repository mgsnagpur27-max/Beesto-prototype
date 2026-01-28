"use client";

import { useRef, useCallback } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { CenterPanel } from "@/components/center/center-panel";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { WebContainerProvider } from "@/components/providers/webcontainer-provider";
import { useUIStore } from "@/lib/stores/ui-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

function EditorContent() {
  useKeyboardShortcuts();
  const { 
    isTerminalOpen, 
    chatWidth, 
    terminalHeight, 
    setChatWidth, 
    setTerminalHeight 
  } = useUIStore();
  
  const isDraggingChat = useRef(false);
  const isDraggingTerminal = useRef(false);

  const handleChatMouseDown = useCallback(() => {
    isDraggingChat.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleTerminalMouseDown = useCallback(() => {
    isDraggingTerminal.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingChat.current) {
      setChatWidth(e.clientX);
    }
    if (isDraggingTerminal.current) {
      const container = e.currentTarget.getBoundingClientRect();
      setTerminalHeight(container.bottom - e.clientY);
    }
  }, [setChatWidth, setTerminalHeight]);

  const handleMouseUp = useCallback(() => {
    isDraggingChat.current = false;
    isDraggingTerminal.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  return (
    <div 
      className="flex h-screen flex-col overflow-hidden bg-[#0a0a0f]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <div style={{ width: chatWidth }} className="shrink-0 h-full">
          <ChatPanel />
        </div>
        
        <div 
          onMouseDown={handleChatMouseDown}
          className="w-1 bg-[#1a1a24] hover:bg-violet-500/50 cursor-col-resize transition-colors shrink-0"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat panel"
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            className="flex-1 overflow-hidden" 
            style={{ height: isTerminalOpen ? `calc(100% - ${terminalHeight}px - 4px)` : "100%" }}
          >
            <CenterPanel />
          </div>
          
          {isTerminalOpen && (
            <>
              <div 
                onMouseDown={handleTerminalMouseDown}
                className="h-1 bg-[#1a1a24] hover:bg-violet-500/50 cursor-row-resize transition-colors shrink-0"
                role="separator"
                aria-orientation="horizontal"
                aria-label="Resize terminal panel"
              />
              <div style={{ height: terminalHeight }} className="shrink-0">
                <TerminalPanel />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <WebContainerProvider autoInit={false}>
      <EditorContent />
    </WebContainerProvider>
  );
}

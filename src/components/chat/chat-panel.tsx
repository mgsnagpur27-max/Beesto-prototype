"use client";

import { useRef, useEffect, useCallback } from "react";
import { Sparkles, Trash2, Download, Loader2, RotateCcw } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAgentStore } from "@/lib/stores/agent-store";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { AgentStatus, AgentPlanViewer, AgentReport, AgentLogs } from "@/components/agent";
import { useAgentLoop } from "@/hooks/use-agent-loop";

export function ChatPanel() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, isStreaming, chatMode, addMessage, appendToLastMessage, setLastMessageStreaming, clearMessages, exportConversation, getRecentMessages } = useChatStore();
  const { selectedModel, setAIStatus } = useUIStore();
  const { state: agentState, isProcessing: agentProcessing, reset: resetAgent } = useAgentStore();
  const { runAgentLoop, rollback } = useAgentLoop();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      addMessage({ role: "user", content });

      if (chatMode === "agent") {
        addMessage({ role: "assistant", content: "Starting agent loop...", isStreaming: false });
        await runAgentLoop(content);
        return;
      }

      setAIStatus("thinking");
      addMessage({ role: "assistant", content: "", isStreaming: true });
      setLastMessageStreaming(true);

      try {
        const recentMessages = getRecentMessages(10);
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: recentMessages.slice(0, -1).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model: selectedModel.id,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setAIStatus("streaming");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response body");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  appendToLastMessage(parsed.content);
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        appendToLastMessage(`\n\n*Error: ${message}*`);
      } finally {
        setLastMessageStreaming(false);
        setAIStatus("idle");
      }
    },
    [addMessage, appendToLastMessage, setLastMessageStreaming, getRecentMessages, selectedModel.id, setAIStatus, chatMode, runAgentLoop]
  );

  const handleExport = useCallback(() => {
    const json = exportConversation();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportConversation]);

  return (
    <div className="flex h-full flex-col bg-[#0c0c10] border-r border-[#1a1a24]">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#1a1a24]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-zinc-200">BEESTO AI</span>
          {chatMode === "agent" && agentState !== "IDLE" && (
            <AgentStatus />
          )}
        </div>
        <div className="flex items-center gap-1">
          {chatMode === "agent" && agentState === "FAILED" && (
            <button
              onClick={rollback}
              className="p-1.5 text-amber-500 hover:text-amber-400 rounded transition-colors"
              title="Rollback changes"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={messages.length === 0}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded transition-colors disabled:opacity-30"
            title="Export conversation"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => { clearMessages(); resetAgent(); }}
            disabled={messages.length === 0 && agentState === "IDLE"}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded transition-colors disabled:opacity-30"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
        {chatMode === "agent" && (agentState !== "IDLE" || agentProcessing) && (
          <div className="pt-4">
            <AgentPlanViewer />
            <AgentReport />
            <AgentLogs />
          </div>
        )}
        
        <div className="p-4 space-y-4">
          {messages.length === 0 && agentState === "IDLE" ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-20">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">ASK BEESTO</h3>
              <p className="text-sm text-zinc-500 max-w-[220px]">
                {chatMode === "agent" 
                  ? "Describe what you want to build and the agent will autonomously create it."
                  : "Describe what you want to build and I'll help you create it."}
              </p>
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
          {isStreaming && messages[messages.length - 1]?.content === "" && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#1a1a24] flex items-center justify-center shrink-0">
                <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
              </div>
              <div className="bg-[#1a1a24] rounded-2xl px-4 py-2.5">
                <span className="text-sm text-zinc-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={agentProcessing} />
    </div>
  );
}

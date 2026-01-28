"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Paperclip, ChevronUp, Zap, Sparkles, MessageSquare, Infinity } from "lucide-react";
import { useUIStore, AI_MODELS, AIModel } from "@/lib/stores/ui-store";
import { useChatStore } from "@/lib/stores/chat-store";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 4000;

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  const { selectedModel, setSelectedModel } = useUIStore();
  const { chatMode, setChatMode, isStreaming } = useChatStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelOpen(false);
      }
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
        setIsModeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || disabled || isStreaming) return;
      onSend(input.trim());
      setInput("");
    },
    [input, disabled, isStreaming, onSend]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const getSpeedIcon = (speed: AIModel["speed"]) => {
    switch (speed) {
      case "ultra-fast":
        return <Sparkles className="size-3.5 text-amber-400" />;
      case "very-fast":
        return <Zap className="size-3.5 text-emerald-400" />;
      default:
        return <Zap className="size-3.5 text-blue-400" />;
    }
  };

  const isDisabled = disabled || isStreaming;
  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  const currentModel = mounted ? selectedModel : AI_MODELS[0];
  const currentMode = mounted ? chatMode : "chat";

  return (
    <form onSubmit={handleSubmit} className="p-2 border-t border-[#1a1a24]">
      <div className="flex flex-col gap-2 rounded-xl bg-[#12121a] p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS + 100))}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build..."
          disabled={isDisabled}
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none min-h-[36px] max-h-[200px] py-2 px-1 disabled:opacity-50"
        />

        <div className="flex items-center justify-between gap-1">
          {/* Left side: Mode, Model, Attachment */}
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {/* Chat/Agent Mode Toggle */}
            <div className="relative shrink-0" ref={modeDropdownRef}>
              <button
                type="button"
                onClick={() => setIsModeOpen(!isModeOpen)}
                disabled={isDisabled}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-[#0c0c10] hover:bg-[#1a1a24] rounded-lg transition-colors disabled:opacity-50"
              >
                {currentMode === "chat" ? (
                  <MessageSquare className="size-3.5" />
                ) : (
                  <Infinity className="size-3.5" />
                )}
                <span className="capitalize">{currentMode}</span>
                <ChevronUp
                  className={`size-3 transition-transform ${isModeOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isModeOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-32 overflow-hidden rounded-lg border border-[#1a1a24] bg-[#0c0c10] shadow-xl z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setChatMode("chat");
                      setIsModeOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[#1a1a24] ${
                      currentMode === "chat" ? "bg-[#1a1a24] text-zinc-200" : "text-zinc-400"
                    }`}
                  >
                    <MessageSquare className="size-3.5" />
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChatMode("agent");
                      setIsModeOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[#1a1a24] ${
                      currentMode === "agent" ? "bg-[#1a1a24] text-zinc-200" : "text-zinc-400"
                    }`}
                  >
                    <Infinity className="size-3.5" />
                    Agent
                  </button>
                </div>
              )}
            </div>

            {/* Model Selection */}
            <div className="relative shrink-0" ref={modelDropdownRef}>
              <button
                type="button"
                onClick={() => setIsModelOpen(!isModelOpen)}
                disabled={isDisabled}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-[#0c0c10] hover:bg-[#1a1a24] rounded-lg transition-colors disabled:opacity-50"
              >
                {getSpeedIcon(currentModel.speed)}
                <span className="max-w-[60px] truncate">{currentModel.name}</span>
                <ChevronUp
                  className={`size-3 transition-transform ${isModelOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isModelOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-52 overflow-hidden rounded-lg border border-[#1a1a24] bg-[#0c0c10] shadow-xl z-50 max-h-[200px] overflow-y-auto">
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-xs transition-colors hover:bg-[#1a1a24] ${
                        currentModel.id === model.id ? "bg-[#1a1a24]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getSpeedIcon(model.speed)}
                        <div className="text-left">
                          <div className="text-xs font-medium text-zinc-200">{model.name}</div>
                          <div className="text-[10px] text-zinc-500">
                            {model.provider} · {model.contextWindow}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attachment Button */}
            <button
              type="button"
              disabled={isDisabled}
              className="shrink-0 p-1.5 text-zinc-500 hover:text-zinc-300 bg-[#0c0c10] hover:bg-[#1a1a24] rounded-lg transition-colors disabled:opacity-50"
              title="Attach file"
            >
              <Paperclip className="size-4" />
            </button>
          </div>

          {/* Right side: Char count + Send */}
          <div className="flex items-center gap-1.5 shrink-0">
            {charCount > MAX_CHARS * 0.8 && (
              <span
                className={`text-[10px] ${isOverLimit ? "text-red-400" : "text-zinc-500"}`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            )}
            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isDisabled || isOverLimit}
              className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot, User } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e1e] border-b border-zinc-800">
        <span className="text-xs text-zinc-500 font-mono">{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="p-1 text-zinc-500 hover:text-zinc-300 rounded transition-colors opacity-0 group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "12px 16px",
          fontSize: "13px",
          borderRadius: 0,
          background: "#1e1e1e",
        }}
        showLineNumbers={children.split("\n").length > 5}
        lineNumberStyle={{ color: "#4a4a4a", fontSize: "12px" }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="px-3 py-1.5 bg-zinc-800/50 rounded-lg text-xs text-zinc-500">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
          isUser ? "bg-violet-600" : "bg-[#1a1a24]"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-violet-400" />
        )}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-violet-600 text-white"
            : "bg-[#1a1a24] text-zinc-200"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match && !className;
                  
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 bg-zinc-800 rounded text-violet-300 text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock language={match?.[1] || ""}>
                      {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-2 list-disc pl-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
                em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
                h1: ({ children }) => <h1 className="text-lg font-bold text-zinc-100 mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold text-zinc-100 mt-3 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-100 mt-2 mb-1">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-violet-500 pl-3 my-2 text-zinc-400 italic">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full border-collapse text-xs">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-zinc-700 px-2 py-1 bg-zinc-800 text-left font-medium">{children}</th>
                ),
                td: ({ children }) => <td className="border border-zinc-700 px-2 py-1">{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-0.5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, PenLine, Eye, Clock, Zap } from "lucide-react";
import { IChatMessageResponse, IPreviewResult } from "../../../lib/types/chat.types";

interface MessageBubbleProps {
  message: IChatMessageResponse;
  isRenderingPreview: boolean;
  previewResult: IPreviewResult | null;
  onRenderPreview: (messageId: string, chatSessionId: string) => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatMs(ms?: number) {
  if (!ms) return null;
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// Minimal markdown renderer
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="font-semibold text-sm mt-2 mb-0.5 text-black dark:text-white">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="font-bold text-sm mt-2.5 mb-1 text-black dark:text-white">{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="font-bold text-base mt-3 mb-1 text-black dark:text-white">{line.slice(2)}</h1>);
    }
    // Code block
    else if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-black/6 dark:bg-white/8 rounded-lg px-3 py-2.5 my-2 overflow-x-auto">
          <code className="text-xs font-mono text-neutral-800 dark:text-neutral-200">{codeLines.join("\n")}</code>
        </pre>
      );
    }
    // Unordered list
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-0.5 my-1.5 text-sm">
          {items.map((item, j) => <li key={j} className="text-neutral-700 dark:text-neutral-300">{inlineFormat(item)}</li>)}
        </ul>
      );
      continue;
    }
    // Ordered list
    else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-0.5 my-1.5 text-sm">
          {items.map((item, j) => <li key={j} className="text-neutral-700 dark:text-neutral-300">{inlineFormat(item)}</li>)}
        </ol>
      );
      continue;
    }
    // Empty line
    else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1.5" />);
    }
    // Normal paragraph
    else {
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
          {inlineFormat(line)}
        </p>
      );
    }
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function inlineFormat(text: string): (string | JSX.Element)[] {
  // Bold + inline code
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  let last = 0;
  let match;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const m = match[0];
    if (m.startsWith("**")) {
      parts.push(<strong key={k++} className="font-semibold text-black dark:text-white">{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("`")) {
      parts.push(<code key={k++} className="bg-black/8 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono">{m.slice(1, -1)}</code>);
    } else if (m.startsWith("*")) {
      parts.push(<em key={k++}>{m.slice(1, -1)}</em>);
    }
    last = match.index + m.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function MessageBubble({ message, isRenderingPreview, previewResult, onRenderPreview }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.type === "user_question";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activePreview =
    previewResult?.messageId === message.id ? previewResult : null;
  const previewUrl = message.previewImageUrl || activePreview?.previewImageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-3 px-5 py-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold ${
        isUser
          ? "bg-black dark:bg-white text-white dark:text-black"
          : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
      }`}>
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-black dark:bg-white text-white dark:text-black rounded-tr-sm"
            : "bg-neutral-100 dark:bg-neutral-800 rounded-tl-sm"
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <SimpleMarkdown content={message.content} />
          )}
        </div>

        {/* Meta + Actions */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(message.metadata.timestamp)}
          </span>

          {!isUser && message.metadata.processingTimeMs && (
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {formatMs(message.metadata.processingTimeMs)}
            </span>
          )}

          {/* Copy button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleCopy}
            className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white transition"
            title="Copy"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          </motion.button>

          {/* AI-only: render in handwriting */}
          {!isUser && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onRenderPreview(message.id, message.chatSessionId)}
              disabled={isRenderingPreview}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border border-black/12 dark:border-white/12 text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/8 disabled:opacity-50 transition"
            >
              <PenLine className="w-3 h-3" />
              {isRenderingPreview ? "Rendering…" : "Render"}
            </motion.button>
          )}
        </div>

        {/* Preview thumbnail */}
        {!isUser && previewUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-1 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm"
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Handwriting preview"
                className="w-full max-w-xs object-cover"
              />
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 flex items-center gap-1 text-[11px] bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full font-medium text-neutral-700 dark:text-neutral-300 hover:opacity-90 transition"
              >
                <Eye className="w-3 h-3" />
                View
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageParser } from "@/app/components/message-parser/core/Parser.core";
import { IMessageResponse } from "@/app/lib/types/message.types";
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";

interface ChatMessageProps {
  message: IMessageResponse;
  isLatest: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.type === "user_question";
  const isAI = message.type === "ai_answer";
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<null | "up" | "down">(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`group flex items-start gap-3 py-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300">
              U
            </span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center">
            <span className="text-xs font-bold text-white dark:text-black">
              AI
            </span>
          </div>
        )}
      </div>

      {/* Bubble / Content */}
      <div
        className={`flex flex-col gap-1 min-w-0 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
      >
        {isUser ? (
          // User bubble
          <div className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        ) : (
          // AI message rendered with MessageParser
          <div className="text-black dark:text-white text-sm leading-relaxed min-w-0 w-full">
            <MessageParser
              content={message.content}
              streaming={isLatest && false} // set true if you're streaming live
              classNames={{
                paragraph: "mb-3 last:mb-0 leading-7",
                h1: "text-xl font-semibold mt-6 mb-3 text-black dark:text-white",
                h2: "text-lg font-semibold mt-5 mb-2 text-black dark:text-white",
                h3: "text-base font-semibold mt-4 mb-2 text-black dark:text-white",
                ul: "list-disc pl-5 mb-3 space-y-1",
                ol: "list-decimal pl-5 mb-3 space-y-1",
                li: "leading-7",
                blockquote:
                  "border-l-2 border-gray-300 dark:border-zinc-600 pl-4 text-gray-500 dark:text-zinc-400 my-3 italic",
                codeBlock: "my-3 rounded-xl overflow-hidden text-xs",
                codeBlockHeader:
                  "flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700",
                codeBlockBody:
                  "bg-gray-50 dark:bg-zinc-900 p-4 overflow-x-auto",
                codeBlockLanguage:
                  "text-xs text-gray-500 dark:text-zinc-400 font-mono",
                codeBlockCopyButton:
                  "text-xs text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors",
                table: "w-full text-sm border-collapse my-3",
                tableWrapper:
                  "overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-700",
                thead: "bg-gray-50 dark:bg-zinc-800",
                tbody: "",
                tr: "border-b border-gray-100 dark:border-zinc-800 last:border-0",
                th: "px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide",
                td: "px-4 py-2.5 text-sm",
                hr: "border-0 border-t border-gray-200 dark:border-zinc-700 my-4",
                callout: "rounded-xl border px-4 py-3 my-3 text-sm",
                calloutTitle: "font-semibold mb-1",
                calloutBody: "text-gray-600 dark:text-zinc-400",
                taskList: "space-y-1 my-2",
                taskItem: "flex items-center gap-2 text-sm",
                taskCheckbox:
                  "w-4 h-4 rounded border border-gray-300 dark:border-zinc-600",
              }}
            />
          </div>
        )}

        {/* Metadata timestamp */}
        <span className="text-[11px] text-gray-400 dark:text-zinc-600 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {message.metadata?.model && (
            <span className="ml-2">· {message.metadata.model}</span>
          )}
        </span>

        {/* AI action buttons */}
        {isAI && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5">
            <ActionButton onClick={handleCopy} title="Copy">
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </ActionButton>
            <ActionButton
              onClick={() => setLiked(liked === "up" ? null : "up")}
              title="Good response"
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 ${liked === "up" ? "text-black dark:text-white fill-current" : ""}`}
              />
            </ActionButton>
            <ActionButton
              onClick={() => setLiked(liked === "down" ? null : "down")}
              title="Bad response"
            >
              <ThumbsDown
                className={`w-3.5 h-3.5 ${liked === "down" ? "text-black dark:text-white fill-current" : ""}`}
              />
            </ActionButton>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-150"
    >
      {children}
    </button>
  );
}

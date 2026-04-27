"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Clock, Loader2 } from "lucide-react";
import { useChat } from "@/app/hooks/useChat.hooks";
import { IChatMessageResponse } from "@/app/lib/types/chat.types";

interface MessageThreadProps {
  sessionId: string;
}

// ── Individual message bubble ─────────────────────────────────────────────────
function MessageBubble({
  message,
  index,
}: {
  message: IChatMessageResponse;
  index: number;
}) {
  const isUser = message.type === "user_question";
  const time = new Date(message.metadata.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "border border-black/10 bg-white text-black dark:border-white/10 dark:bg-zinc-800 dark:text-white"
        }`}
      >
        {isUser ? (
          <User size={14} strokeWidth={2} />
        ) : (
          <Sparkles size={14} strokeWidth={1.5} />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-black text-white dark:bg-white dark:text-black"
              : "rounded-tl-sm border border-black/8 bg-white text-black shadow-sm dark:border-white/8 dark:bg-zinc-900 dark:text-white"
          }`}
          style={{ fontFamily: isUser ? "inherit" : "'Georgia', serif" }}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center gap-1 text-[10px] text-black/35 dark:text-white/30 ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          <Clock size={10} />
          <span>{time}</span>
          {message.metadata.processingTimeMs && !isUser && (
            <span className="ml-1 text-black/25 dark:text-white/20">
              · {(message.metadata.processingTimeMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="flex gap-3"
    >
      <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black dark:border-white/10 dark:bg-zinc-800 dark:text-white">
        <Sparkles size={14} strokeWidth={1.5} />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-black/8 bg-white px-4 py-3.5 shadow-sm dark:border-white/8 dark:bg-zinc-900">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-black/40 dark:bg-white/40"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/8 bg-white shadow-sm dark:border-white/8 dark:bg-zinc-900">
        <Sparkles size={22} className="text-black/40 dark:text-white/40" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-black/60 dark:text-white/60">
          Start your assignment
        </p>
        <p className="mt-1 text-xs text-black/35 dark:text-white/30">
          Type a question or topic below
        </p>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MessageThread({ sessionId }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isSendingMessage, isLoading, getSession } = useChat();

  // Load session on mount
  useEffect(() => {
    if (sessionId) getSession(sessionId);
  }, [sessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSendingMessage]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={22} className="animate-spin text-black/30 dark:text-white/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} />
              ))}

              {isSendingMessage && (
                <TypingIndicator key="typing" />
              )}
            </AnimatePresence>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
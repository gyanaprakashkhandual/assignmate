"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles } from "lucide-react";
import { useChat } from "@/app/hooks/useChat.hooks";

interface ChatBoxProps {
  sessionId?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function ChatBox({
  sessionId,
  placeholder = "Ask me anything to write in your handwriting…",
  autoFocus = true,
}: ChatBoxProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    create,
    send,
    sendToCurrentSession,
    isSendingMessage,
    currentSessionId,
    error,
    dismissError,
  } = useChat();

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const activeSessionId = sessionId ?? currentSessionId;

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isSendingMessage || isCreatingSession) return;

    setInput("");

    if (activeSessionId) {
      await send({ sessionId: activeSessionId, question });
    } else {
      // First message → create session then navigate
      setIsCreatingSession(true);
      try {
        const result = await create({ title: question.slice(0, 60) });
        // result.payload is the IChatSessionResponse
        const payload = (result as any).payload;
        if (payload?.id) {
          await send({ sessionId: payload.id, question });
          router.push(`/chat/${payload.id}`);
        }
      } finally {
        setIsCreatingSession(false);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isBusy = isSendingMessage || isCreatingSession;
  const canSend = input.trim().length > 0 && !isBusy;

  return (
    <div className="w-full">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-3 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-400"
          >
            <span>{error}</span>
            <button
              onClick={dismissError}
              className="ml-3 text-red-400 hover:text-red-600 dark:hover:text-red-300"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative flex items-end gap-3 rounded-2xl border border-black/10 bg-white p-3 shadow-[0_2px_24px_rgba(0,0,0,0.07)] transition-shadow focus-within:shadow-[0_4px_32px_rgba(0,0,0,0.13)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)] dark:focus-within:shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
      >
        {/* Sparkle icon */}
        <div className="mb-1 flex-shrink-0 text-black/25 dark:text-white/25">
          <Sparkles size={18} strokeWidth={1.5} />
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="max-h-[200px] flex-1 resize-none bg-transparent text-sm leading-relaxed text-black outline-none placeholder:text-black/35 dark:text-white dark:placeholder:text-white/30"
          style={{ fontFamily: "'Georgia', serif" }}
          disabled={isBusy}
        />

        {/* Send button */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.93 } : {}}
          className={`mb-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
            canSend
              ? "bg-black text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
              : "bg-black/8 text-black/30 dark:bg-white/10 dark:text-white/30"
          }`}
          aria-label="Send message"
        >
          <AnimatePresence mode="wait">
            {isBusy ? (
              <motion.span
                key="loader"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <Loader2 size={15} className="animate-spin" />
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <Send size={15} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <p className="mt-2 text-center text-[11px] text-black/30 dark:text-white/25">
        Press{" "}
        <kbd className="rounded bg-black/6 px-1 py-0.5 font-mono dark:bg-white/10">
          Enter
        </kbd>{" "}
        to send &nbsp;·&nbsp;{" "}
        <kbd className="rounded bg-black/6 px-1 py-0.5 font-mono dark:bg-white/10">
          Shift+Enter
        </kbd>{" "}
        for new line
      </p>
    </div>
  );
}

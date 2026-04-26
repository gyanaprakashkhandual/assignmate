"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Loader2 } from "lucide-react";

interface ChatBoxProps {
  isSendingMessage: boolean;
  currentSessionId: string | null;
  onSend: (question: string) => void;
}

export default function ChatBox({ isSendingMessage, currentSessionId, onSend }: ChatBoxProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxH = 5 * 24 + 32; // ~5 rows
    el.style.height = Math.min(el.scrollHeight, maxH) + "px";
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSend = () => {
    const q = value.trim();
    if (!q || isSendingMessage || !currentSessionId) return;
    onSend(q);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") setValue("");
  };

  const canSend = value.trim().length > 0 && !isSendingMessage && !!currentSessionId;

  return (
    <div className="shrink-0 border-t border-black/8 dark:border-white/8 bg-white dark:bg-neutral-900 px-5 py-4">
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={
              !currentSessionId
                ? "Create a session first…"
                : "Ask a question… (Enter to send, Shift+Enter for newline)"
            }
            disabled={!currentSessionId || isSendingMessage}
            rows={1}
            className="w-full resize-none bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white text-sm placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl px-4 py-3 pr-12 outline-none border border-transparent focus:border-black/15 dark:focus:border-white/15 transition disabled:opacity-50 leading-6 overflow-hidden"
          />

          {/* char count subtle hint */}
          {value.length > 900 && (
            <span className="absolute bottom-2.5 right-3 text-[10px] text-neutral-400">
              {value.length}/1000
            </span>
          )}
        </div>

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleSend}
          disabled={!canSend}
          title={!currentSessionId ? "Create a session first" : "Send message"}
          className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 disabled:opacity-30 hover:opacity-80 transition"
        >
          {isSendingMessage ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {isSendingMessage && (
        <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 mt-2">
          Generating your answer…
        </p>
      )}
    </div>
  );
}
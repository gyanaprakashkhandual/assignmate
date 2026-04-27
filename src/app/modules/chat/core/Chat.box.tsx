/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useChat } from "@/app/hooks/useChat.hooks";
import BrandIcon from "@/app/components/icons/Brand.icon";
import { Tooltip } from "@/ui/data/tooltip/Tooltip.ui";

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

  const { create, send, isSendingMessage, currentSessionId } = useChat();

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
      setIsCreatingSession(true);
      try {
        const result = await create({ title: question.slice(0, 60) });
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative flex items-end gap-3 rounded-2xl border border-black/10 bg-white p-3"
      >
        <div className="mb-1 shrink-0 text-black/25 dark:text-white/25">
          <BrandIcon size={18} className="text-black" />
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="max-h-50 flex-1 resize-none bg-transparent text-sm leading-relaxed text-black outline-none placeholder:text-black/35 dark:text-white dark:placeholder:text-white/30"
          disabled={isBusy}
        />
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.93 } : {}}
          className={`mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
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
              <Tooltip content="Send" showArrow>
                <motion.span
                  key="send"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                >
                  <Send size={12} />
                </motion.span>
              </Tooltip>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
  );
}

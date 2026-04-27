"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Square, Paperclip } from "lucide-react";
import { useMessage } from "@/app/hooks/useMessage.hooks";
import { IMessageResponse } from "@/app/lib/types/message.types";

interface ChatInputProps {
  sessionId: string;
}

export function ChatInput({ sessionId }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { append, isBusy } = useMessage();

  // Auto-resize textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || isBusy || isSending) return;

    setIsSending(true);

    // Optimistically append user message to store
    const userMessage: IMessageResponse = {
      id: `temp-${Date.now()}`,
      chatSessionId: sessionId,
      type: "user_question",
      content: trimmed,
      order: Date.now(),
      metadata: {
        messageId: `temp-${Date.now()}`,
        timestamp: new Date(),
      },
      handwritingRenderData: null,
      createdAt: new Date(),
    };
    append(userMessage);
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // TODO: Replace with your actual API call to send message to backend
      // Example:
      // const response = await chatApi.sendMessage({ sessionId, content: trimmed });
      // append(response); // append AI response when it comes back
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  }, [value, isBusy, isSending, sessionId, append]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isBusy && !isSending;

  return (
    <div className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black px-4 py-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="relative flex items-end gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-sm focus-within:border-gray-400 dark:focus-within:border-zinc-500 transition-colors duration-200 px-4 py-3">
          {/* Attach button (UI only) */}
          <button
            className="shrink-0 mb-0.5 p-1 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-150"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            disabled={isBusy}
            className="flex-1 resize-none bg-transparent text-black dark:text-white text-sm leading-6 placeholder-gray-400 dark:placeholder-zinc-600 outline-none max-h-[200px] overflow-y-auto py-0.5 disabled:opacity-50"
            style={{ scrollbarWidth: "none" }}
          />

          {/* Send / Stop button */}
          <AnimatePresence mode="wait">
            {isBusy ? (
              <motion.button
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.12 }}
                onClick={() => {
                  /* TODO: cancel streaming */
                }}
                className="shrink-0 mb-0.5 w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center hover:opacity-80 transition-opacity"
                title="Stop generating"
              >
                <Square className="w-3 h-3 text-white dark:text-black fill-current" />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.12 }}
                onClick={handleSend}
                disabled={!canSend}
                className="shrink-0 mb-0.5 w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-80"
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 text-white dark:text-black" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Hint text */}
        <p className="text-center text-[11px] text-gray-400 dark:text-zinc-600 mt-2">
          Press{" "}
          <kbd className="font-mono bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[10px]">
            Enter
          </kbd>{" "}
          to send,{" "}
          <kbd className="font-mono bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[10px]">
            Shift + Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
}

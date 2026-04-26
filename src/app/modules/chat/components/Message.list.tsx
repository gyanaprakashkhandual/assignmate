"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PenLine } from "lucide-react";
import { IChatMessageResponse, IPreviewResult } from "../../../lib/types/chat.types";
import MessagePair from "./Message.pair";
import TypingIndicator from "./Type.indicator";

interface MessageListProps {
  messages: IChatMessageResponse[];
  hasMessages: boolean;
  isSendingMessage: boolean;
  isRenderingPreview: boolean;
  previewResult: IPreviewResult | null;
  onRenderPreview: (messageId: string, chatSessionId: string) => void;
}

export default function MessageList({
  messages,
  hasMessages,
  isSendingMessage,
  isRenderingPreview,
  previewResult,
  onRenderPreview,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isSendingMessage, scrollToBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(fromBottom > 200);
  };

  // Pair messages: user questions with their following ai answers
  const pairs: { user: IChatMessageResponse; ai?: IChatMessageResponse }[] = [];
  const sorted = [...messages].sort((a, b) => a.order - b.order);
  let i = 0;
  while (i < sorted.length) {
    if (sorted[i].type === "user_question") {
      const ai = sorted[i + 1]?.type === "ai_answer" ? sorted[i + 1] : undefined;
      pairs.push({ user: sorted[i], ai });
      i += ai ? 2 : 1;
    } else {
      i++;
    }
  }

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scroll-smooth"
      >
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center select-none">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <PenLine className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Ask anything
              </p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs">
                Your answer will be beautifully written in your own handwriting style.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {pairs.map((pair, idx) => (
              <MessagePair
                key={pair.user.id}
                userMessage={pair.user}
                aiMessage={pair.ai}
                isRenderingPreview={isRenderingPreview}
                previewResult={previewResult}
                onRenderPreview={onRenderPreview}
              />
            ))}

            {isSendingMessage && <TypingIndicator />}

            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Scroll to bottom FAB */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg hover:opacity-80 transition z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
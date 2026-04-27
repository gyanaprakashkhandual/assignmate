/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  User,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Copy,
  Check,
} from "lucide-react";
import { useMessage } from "@/app/hooks/useMessage.hooks";
import { MessageParser } from "@/app/components/message-parser/core/Parser.core";
import { IMessageResponse } from "@/app/lib/types/message.types";
import { useAuth } from "@/app/context/Auth.context";
import BrandIcon from "@/app/components/icons/Brand.icon";

interface MessageThreadProps {
  sessionId: string;
}

function UserBubble({ message }: { message: IMessageResponse }) {
  const { user } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex justify-end px-4 py-1.5 md:px-6"
    >
      <div className="flex max-w-[75%] items-end gap-2.5">
        <div className="rounded-2xl rounded-br-sm bg-black px-4 py-2.5 dark:bg-white">
          <p className="text-sm leading-relaxed text-white dark:text-black">
            {message.content}
          </p>
        </div>
        <div className="rounded-2xl rounded-br-sm px-4 py-2.5 dark:bg-white">
          <span>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-zinc-500" />
              </div>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AiBubble({ message }: { message: IMessageResponse }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<"like" | "dislike" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      className="flex justify-start px-4 py-1.5 md:px-6"
    >
      <div className="flex max-w-[82%] items-start gap-2.5">
        <BrandIcon className="h-8 w-8text-black dark:text-white/50" />

        <div className="min-w-0">
          <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 dark:bg-zinc-800">
            <MessageParser
              content={message.content}
              streaming={false}
              className="text-sm text-black/80 dark:text-white/80"
            />
          </div>

          {/* Action row */}
          <div className="mt-1.5 flex items-center gap-1 pl-1">
            {/* Timestamp */}
            <span className="mr-1.5 text-[15px] text-black dark:text-white/25">
              {timestamp}
            </span>

            {/* Copy */}
            <button
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy"}
              className="flex h-6 w-6 items-center justify-center rounded-md text-black transition-colors hover:bg-black/5 hover:text-black/50 dark:text-white/25 dark:hover:bg-white/8 dark:hover:text-white/50"
            >
              {copied ? (
                <Check size={15} className="text-emerald-500" />
              ) : (
                <Copy size={15} />
              )}
            </button>

            {/* Like */}
            <button
              onClick={() =>
                setLiked((prev: string) => (prev === "like" ? null : "like"))
              }
              title="Like"
              className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/8 ${
                liked === "like"
                  ? "text-emerald-500"
                  : "text-black hover:text-black/50 dark:text-white/25 dark:hover:text-white/50"
              }`}
            >
              <ThumbsUp
                size={15}
                className={liked === "like" ? "fill-emerald-500" : ""}
              />
            </button>

            {/* Dislike */}
            <button
              onClick={() =>
                setLiked((prev: string) =>
                  prev === "dislike" ? null : "dislike",
                )
              }
              title="Dislike"
              className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/8 ${
                liked === "dislike"
                  ? "text-red-400"
                  : "text-black hover:text-black/50 dark:text-white/25 dark:hover:text-white/50"
              }`}
            >
              <ThumbsDown
                size={15}
                className={liked === "dislike" ? "fill-red-400" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MessageThread({ sessionId }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { getBySession, sortedMessages, isLoading, error, hasMessages } =
    useMessage();

  // Fetch messages when sessionId changes
  useEffect(() => {
    if (sessionId) {
      getBySession({ sessionId });
    }
  }, [sessionId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  // ── Loading state ────────────────────────────────────────────────────
  if (isLoading && !hasMessages) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={20}
            className="animate-spin text-black/25 dark:text-white/25"
          />
          <p className="text-xs text-black/35 dark:text-white/35">
            Loading messages…
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <p className="text-center text-sm text-red-500/70">{error}</p>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────
  if (!hasMessages) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Sparkles size={22} className="text-black/20 dark:text-white/20" />
          <p className="text-sm text-black/35 dark:text-white/35">
            No messages yet. Start the conversation.
          </p>
        </div>
      </div>
    );
  }

  // ── Group messages into user/ai pairs ────────────────────────────────
  const pairs: { user?: IMessageResponse; ai?: IMessageResponse }[] = [];

  sortedMessages.forEach((msg) => {
    if (msg.type === "user_question") {
      pairs.push({ user: msg });
    } else if (msg.type === "ai_answer") {
      const last = pairs[pairs.length - 1];
      if (last && !last.ai) {
        last.ai = msg;
      } else {
        pairs.push({ ai: msg });
      }
    }
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl py-6">
        <AnimatePresence initial={false}>
          {pairs.map((pair, idx) => (
            <div key={idx} className="mb-2">
              {pair.user && <UserBubble message={pair.user} />}
              {pair.ai && <AiBubble message={pair.ai} />}
            </div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

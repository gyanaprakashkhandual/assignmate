"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, StarOff, Archive, Loader2 } from "lucide-react";
import Link from "next/link";
import { useChat } from "@/app/hooks/useChat.hooks";
import MessageThread from "../components/Message.thread";
import ChatBox from "../core/Chat.box";
import PdfPreview from "../components/Pdf.preview";

interface ChatPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
 const resolvedParams = params ? use(params) : { sessionId: "" };
const { sessionId } = resolvedParams;

  const {
    currentSession,
    isLoading,
    starSession,
    unstarSession,
    archiveSession,
    currentSessionIsStarred,
    currentSessionTitle,
    messages,
    aiMessages,
  } = useChat();

  const lastAiMessage = aiMessages[aiMessages.length - 1];

  return (
    <div className="flex h-screen flex-col bg-[#fafafa] font-sans antialiased dark:bg-zinc-950">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex h-14 flex-shrink-0 items-center justify-between border-b border-black/8 bg-white/80 px-4 backdrop-blur-sm dark:border-white/8 dark:bg-zinc-950/80 md:px-6"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black/50 transition-all hover:bg-black/6 hover:text-black dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
          </Link>

          {isLoading && !currentSession ? (
            <Loader2 size={14} className="animate-spin text-black/30 dark:text-white/30" />
          ) : (
            <h1 className="max-w-[220px] truncate text-sm font-semibold text-black dark:text-white md:max-w-sm">
              {currentSessionTitle ?? "Untitled session"}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Star toggle */}
          <button
            onClick={() =>
              currentSessionIsStarred
                ? unstarSession(sessionId)
                : starSession(sessionId)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black/40 transition-all hover:bg-black/6 hover:text-black dark:text-white/35 dark:hover:bg-white/8 dark:hover:text-white"
            title={currentSessionIsStarred ? "Unstar" : "Star"}
          >
            {currentSessionIsStarred ? (
              <Star size={15} className="fill-black dark:fill-white" />
            ) : (
              <StarOff size={15} />
            )}
          </button>

          {/* Archive */}
          <button
            onClick={() => archiveSession(sessionId)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black/40 transition-all hover:bg-black/6 hover:text-black dark:text-white/35 dark:hover:bg-white/8 dark:hover:text-white"
            title="Archive session"
          >
            <Archive size={15} />
          </button>
        </div>
      </motion.header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — conversation */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Messages */}
          <MessageThread sessionId={sessionId} />

          {/* Input */}
          <div className="flex-shrink-0 border-t border-black/8 bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-white/8 dark:bg-zinc-950/80 md:px-6">
            <div className="mx-auto max-w-7xl">
              <ChatBox sessionId={sessionId} />
            </div>
          </div>
        </main>

        {/* Right — preview panel (hidden on mobile unless there's an AI message) */}
        {(lastAiMessage || messages.length > 0) && (
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="hidden w-80 flex-shrink-0 overflow-y-auto border-l border-black/8 bg-white/60 p-5 dark:border-white/8 dark:bg-zinc-900/60 xl:block"
          >
            <PdfPreview
              sessionId={sessionId}
              messageId={lastAiMessage?.id}
              chatSessionId={lastAiMessage?.chatSessionId}
            />
          </motion.aside>
        )}
      </div>
    </div>
  );
}
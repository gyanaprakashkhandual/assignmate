"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Archive,
  Loader2,
  PanelRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { useChat } from "@/app/hooks/useChat.hooks";
import MessageThread from "@/app/modules/chat/components/Message.thread";
import ChatBox from "@/app/modules/chat/core/Chat.box";
import PdfPreview from "@/app/modules/chat/components/Pdf.preview";
interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatSessionPage({ params }: ChatPageProps) {
  const { id: sessionId } = use(params);
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    getSession,
    isLoading,
    starSession,
    unstarSession,
    archiveSession,
    currentSessionIsStarred,
    currentSessionTitle,
    currentSessionStatus,
    aiMessages,
    hasMessages,
  } = useChat();

  // Fetch session data on mount
  useEffect(() => {
    if (sessionId) getSession(sessionId);
  }, [sessionId]);

  const lastAiMessage = aiMessages[aiMessages.length - 1];
  const isArchived = currentSessionStatus === "archived";
  const hasAiResponse = aiMessages.length > 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f9f9f8] antialiased dark:bg-zinc-950">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-black/[0.07] bg-white/90 px-4 backdrop-blur-md dark:border-white/[0.07] dark:bg-zinc-950/90 md:px-5"
      >
        {/* Left */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Link
            href="/chat"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-black/40 transition-colors hover:bg-black/[0.06] hover:text-black dark:text-white/40 dark:hover:bg-white/[0.07] dark:hover:text-white"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </Link>

          <div className="min-w-0 flex-1">
            {isLoading && !currentSessionTitle ? (
              <div className="flex items-center gap-2">
                <Loader2 size={13} className="animate-spin text-black/30 dark:text-white/30" />
                <span className="text-sm text-black/40 dark:text-white/40">Loading…</span>
              </div>
            ) : (
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="truncate text-sm font-semibold text-black dark:text-white">
                  {currentSessionTitle ?? "Untitled session"}
                </h1>
                {isArchived && (
                  <span className="flex-shrink-0 rounded-md border border-black/10 bg-black/4 px-1.5 py-0.5 text-[10px] font-medium text-black/40 dark:border-white/10 dark:bg-white/6 dark:text-white/40">
                    Archived
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-shrink-0 items-center gap-1">
          {/* Star */}
          <button
            onClick={() =>
              currentSessionIsStarred
                ? unstarSession(sessionId)
                : starSession(sessionId)
            }
            title={currentSessionIsStarred ? "Unstar" : "Star"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black/35 transition-colors hover:bg-black/[0.06] hover:text-black dark:text-white/35 dark:hover:bg-white/[0.07] dark:hover:text-white"
          >
            <Star
              size={15}
              strokeWidth={2}
              className={
                currentSessionIsStarred
                  ? "fill-black text-black dark:fill-white dark:text-white"
                  : ""
              }
            />
          </button>

          {/* Archive */}
          {!isArchived && (
            <button
              onClick={() => archiveSession(sessionId)}
              title="Archive session"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-black/35 transition-colors hover:bg-black/[0.06] hover:text-black dark:text-white/35 dark:hover:bg-white/[0.07] dark:hover:text-white"
            >
              <Archive size={15} strokeWidth={2} />
            </button>
          )}

          {/* Preview panel toggle — mobile/tablet only */}
          {hasAiResponse && (
            <button
              onClick={() => setPreviewOpen((p) => !p)}
              title="Toggle preview"
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors xl:hidden ${
                previewOpen
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/35 hover:bg-black/[0.06] hover:text-black dark:text-white/35 dark:hover:bg-white/[0.07] dark:hover:text-white"
              }`}
            >
              <PanelRight size={15} strokeWidth={2} />
            </button>
          )}
        </div>
      </motion.header>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* ── Left: conversation ────────────────────────────────────── */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageThread sessionId={sessionId} />
          </div>

          {/* Input bar */}
          <div className="flex-shrink-0 border-t border-black/[0.07] bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-white/[0.07] dark:bg-zinc-950/80 md:px-6">
            <div className="mx-auto max-w-2xl">
              <ChatBox sessionId={sessionId} />
            </div>
          </div>
        </main>

        {/* ── Right: PDF preview panel (desktop) ───────────────────── */}
        {hasAiResponse && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden w-[312px] flex-shrink-0 overflow-y-auto border-l border-black/[0.07] bg-white/70 p-5 dark:border-white/[0.07] dark:bg-zinc-900/70 xl:block"
          >
            <PdfPreview
              sessionId={sessionId}
              messageId={lastAiMessage?.id}
              chatSessionId={lastAiMessage?.chatSessionId}
            />
          </motion.aside>
        )}

        {/* ── Right: PDF preview panel (mobile overlay) ─────────────── */}
        <AnimatePresence>
          {previewOpen && hasAiResponse && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPreviewOpen(false)}
                className="absolute inset-0 z-30 bg-black/30 backdrop-blur-sm xl:hidden"
              />

              {/* Drawer */}
              <motion.div
                key="drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="absolute right-0 top-0 z-40 flex h-full w-[300px] flex-col overflow-y-auto border-l border-black/[0.07] bg-white shadow-2xl dark:border-white/[0.07] dark:bg-zinc-900 xl:hidden"
              >
                {/* Drawer header */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-black/[0.07] px-4 py-3 dark:border-white/[0.07]">
                  <p className="text-sm font-semibold text-black dark:text-white">Preview</p>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-black/40 hover:bg-black/[0.06] hover:text-black dark:text-white/40 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Preview content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <PdfPreview
                    sessionId={sessionId}
                    messageId={lastAiMessage?.id}
                    chatSessionId={lastAiMessage?.chatSessionId}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
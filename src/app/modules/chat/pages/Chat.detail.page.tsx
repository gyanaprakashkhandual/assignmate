/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Archive, Loader2, PanelRight, X } from "lucide-react";
import { useChat } from "@/app/hooks/useChat.hooks";
import MessageThread from "@/app/modules/chat/components/Message.thread";
import ChatBox from "@/app/modules/chat/core/Chat.box";
import PdfPreview from "@/app/modules/chat/components/Pdf.preview";
import { Tooltip } from "@/ui/data/tooltip/Tooltip.ui";
interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatSessionDetailPage({ params }: ChatPageProps) {
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
    <div className="flex h-screen flex-col overflow-hidden bg-white antialiased dark:bg-zinc-950">
      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* ── Left: conversation ────────────────────────────────────── */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageThread sessionId={sessionId} />
          </div>

          {/* Input bar */}
          {/* Input bar */}
          <div className="shrink-0 border-t border-black/[0.07] bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-white/[0.07] dark:bg-zinc-950/80 md:px-6">
            <div className="mx-auto max-w-3xl">
              {/* Session meta row */}
              <div className="mb-2 flex items-center justify-between">
                {/* Left — session name */}
                <div className="flex min-w-0 items-center gap-2">
                  {isLoading && !currentSessionTitle ? (
                    <div className="flex items-center gap-1.5">
                      <Loader2
                        size={11}
                        className="animate-spin text-black/25 dark:text-white/25"
                      />
                      <span className="text-xs text-black/30 dark:text-white/30">
                        Loading…
                      </span>
                    </div>
                  ) : (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-xs font-medium text-black/45 dark:text-white/45">
                        {currentSessionTitle ?? "Untitled session"}
                      </span>
                      {isArchived && (
                        <span className="shrink-0 rounded border border-black/10 px-1 py-px text-[9px] font-medium text-black/35 dark:border-white/10 dark:text-white/35">
                          Archived
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right — actions */}
                <div className="flex shrink-0 items-center gap-0.5">
                  {/* Star */}
                  <Tooltip
                    content={currentSessionIsStarred ? "Unstar" : "Star"}
                    position="top"
                    showArrow
                  >
                    <button
                      onClick={() =>
                        currentSessionIsStarred
                          ? unstarSession(sessionId)
                          : starSession(sessionId)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-black/30 transition-colors hover:bg-black/6 hover:text-black dark:text-white/30 dark:hover:bg-white/[0.07] dark:hover:text-white"
                    >
                      <Star
                        size={13}
                        strokeWidth={2}
                        className={
                          currentSessionIsStarred
                            ? "fill-black text-black dark:fill-white dark:text-white"
                            : ""
                        }
                      />
                    </button>
                  </Tooltip>

                  {/* Archive */}
                  {!isArchived && (
                    <Tooltip content="Archive" position="top" showArrow>
                      <button
                        onClick={() => archiveSession(sessionId)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-black/30 transition-colors hover:bg-black/6 hover:text-black dark:text-white/30 dark:hover:bg-white/[0.07] dark:hover:text-white"
                      >
                        <Archive size={13} strokeWidth={2} />
                      </button>
                    </Tooltip>
                  )}

                  {/* Preview panel toggle — mobile/tablet only */}
                  {hasAiResponse && (
                    <button
                      onClick={() => setPreviewOpen((p) => !p)}
                      title="Toggle preview"
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors xl:hidden ${
                        previewOpen
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "text-black/30 hover:bg-black/6 hover:text-black dark:text-white/30 dark:hover:bg-white/[0.07] dark:hover:text-white"
                      }`}
                    >
                      <PanelRight size={13} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>

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
            className="hidden w-78 shrink-0 overflow-y-auto border-l border-black/[0.07] bg-white/70 p-5 dark:border-white/[0.07] dark:bg-zinc-900/70 xl:block"
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
                className="absolute right-0 top-0 z-40 flex h-full w-75 flex-col overflow-y-auto border-l border-black/[0.07] bg-white shadow-2xl dark:border-white/[0.07] dark:bg-zinc-900 xl:hidden"
              >
                {/* Drawer header */}
                <div className="flex shrink-0 items-center justify-between border-b border-black/[0.07] px-4 py-3 dark:border-white/[0.07]">
                  <p className="text-sm font-semibold text-black dark:text-white">
                    Preview
                  </p>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-black/40 hover:bg-black/6 hover:text-black dark:text-white/40 dark:hover:bg-white/[0.07] dark:hover:text-white"
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

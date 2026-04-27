"use client";

import { use, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, StarOff, Archive } from "lucide-react";
import Link from "next/link";
import { useChat } from "@/app/hooks/useChat.hooks";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import MessageThread from "../components/Message.thread";
import ChatBox from "../core/Chat.box";
import PdfPreview from "../components/Pdf.preview";
import BrandIcon from "@/app/components/icons/Brand.icon";

interface ChatPageProps {
  params: Promise<{ sessionId: string }>;
}

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const first = name?.split(" ")[0] ?? "there";
  if (hour < 12) return `Good morning, ${first}`;
  if (hour < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export default function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = params ? use(params) : { sessionId: "" };
  const { sessionId } = resolvedParams;

  const {
    getSession,
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

  const { profile } = useProfile();

  useEffect(() => {
    if (sessionId) getSession(sessionId);
  }, [sessionId]);

  const lastAiMessage = aiMessages[aiMessages.length - 1];
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen flex-col bg-[#fafafa] font-sans antialiased dark:bg-zinc-950">
      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — conversation */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            {hasMessages ? (
              <MessageThread sessionId={sessionId} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black dark:bg-white">
                  <BrandIcon size={22} className="text-white dark:text-black" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-black dark:text-white">
                    {getGreeting(profile?.nickName)}
                  </p>
                  <p className="mt-1 text-sm text-black/40 dark:text-white/40">
                    How can I help you today?
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="flex-shrink-0 border-t border-black/[0.07] bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-white/[0.07] dark:bg-zinc-950/80 md:px-6">
            <div className="mx-auto max-w-2xl">
              {/* Session row */}
              <div className="mb-2 flex items-center gap-2">
                {/* Back */}
                <Link
                  href="/chat"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-black/35 transition-colors hover:bg-black/[0.06] hover:text-black dark:text-white/35 dark:hover:bg-white/[0.07] dark:hover:text-white"
                >
                  <ArrowLeft size={13} strokeWidth={2} />
                </Link>

                {/* Session title */}
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  {isLoading && !currentSessionTitle ? (
                    <span className="text-xs text-black/30 dark:text-white/30">
                      Loading…
                    </span>
                  ) : (
                    <span className="truncate text-xs font-medium text-black/40 dark:text-white/40">
                      {currentSessionTitle ?? "Untitled session"}
                    </span>
                  )}
                  {currentSession?.status === "archived" && (
                    <span className="flex-shrink-0 rounded border border-black/10 px-1 py-px text-[9px] font-medium text-black/30 dark:border-white/10 dark:text-white/30">
                      Archived
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-0.5">
                  <button
                    onClick={() =>
                      currentSessionIsStarred
                        ? unstarSession(sessionId)
                        : starSession(sessionId)
                    }
                    title={currentSessionIsStarred ? "Unstar" : "Star"}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-black/30 transition-colors hover:bg-black/[0.06] hover:text-black dark:text-white/30 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  >
                    {currentSessionIsStarred ? (
                      <Star
                        size={13}
                        strokeWidth={2}
                        className="fill-black dark:fill-white"
                      />
                    ) : (
                      <StarOff size={13} strokeWidth={2} />
                    )}
                  </button>

                  {currentSession?.status !== "archived" && (
                    <button
                      onClick={() => archiveSession(sessionId)}
                      title="Archive session"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-black/30 transition-colors hover:bg-black/[0.06] hover:text-black dark:text-white/30 dark:hover:bg-white/[0.07] dark:hover:text-white"
                    >
                      <Archive size={13} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>

              <ChatBox sessionId={sessionId} />
            </div>
          </div>
        </main>

        {/* Right — PDF preview panel */}
        {lastAiMessage && (
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="hidden w-80 flex-shrink-0 overflow-y-auto border-l border-black/[0.07] bg-white/60 p-5 dark:border-white/[0.07] dark:bg-zinc-900/60 xl:block"
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

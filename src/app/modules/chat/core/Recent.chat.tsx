"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  StarOff,
  Archive,
  Trash2,
  Trash,
  MoreHorizontal,
  Clock,
  FileText,
  RefreshCw,
  PenLine,
  Check,
  X,
} from "lucide-react";
import { useChat } from "@/app/hooks/useChat.hooks";
import { IChatSessionResponse } from "@/app/lib/types/chat.types";
import {
  ActionMenu,
  IconTrigger,
} from "@/ui/navigations/action/Action.menu.ui";
import type { ActionItem } from "@/ui/navigations/action/Action.menu.context";

function SessionCard({
  session,
  isActive,
  onSelect,
  onStar,
  onArchive,
  onSoftDelete,
  onHardDelete,
  onRename,
}: {
  session: IChatSessionResponse;
  isActive: boolean;
  onSelect: () => void;
  onStar: () => void;
  onArchive: () => void;
  onSoftDelete: () => void;
  onHardDelete: () => void;
  onRename: (id: string, currentTitle: string) => void;
}) {
  const menuItems: ActionItem[] = [
    {
      id: "rename",
      label: "Rename",
      leadingIcon: <PenLine size={13} />,
      onClick: () => onRename(session.id, session.title),
    },
    {
      id: "star",
      label: session.isStarred ? "Unstar" : "Star",
      leadingIcon: session.isStarred ? (
        <StarOff size={13} />
      ) : (
        <Star size={13} />
      ),
      onClick: onStar,
    },
    {
      id: "archive",
      label: "Archive",
      leadingIcon: <Archive size={13} />,
      onClick: onArchive,
    },
    {
      id: "delete",
      label: "Delete",
      leadingIcon: <Trash2 size={13} />,
      variant: "danger",
      dividerBefore: true,
      onClick: onSoftDelete,
    },
    {
      id: "delete-permanent",
      label: "Delete permanently",
      leadingIcon: <Trash size={13} />,
      variant: "danger",
      onClick: onHardDelete,
    },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.18 }}
      className="relative group"
    >
      <button
        onClick={onSelect}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-100 ${
          isActive
            ? "bg-gray-100 dark:bg-gray-800"
            : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
        }`}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div
            className={`mt-0.5 shrink-0 ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}
          >
            {session.pdfUrl ? (
              <FileText size={14} />
            ) : (
              <MessageSquare size={14} />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <p
              className={`text-[13px] leading-snug truncate font-medium ${
                isActive
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {session.title}
            </p>
            {session.isStarred && (
              <Star size={10} className="mt-1 text-amber-400 fill-amber-400" />
            )}
          </div>
        </div>
      </button>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <ActionMenu
          items={menuItems}
          size="sm"
          align="auto"
          trigger={
            <IconTrigger
              size="sm"
              variant="ghost"
              icon={<MoreHorizontal size={14} />}
            />
          }
        />
      </div>
    </motion.div>
  );
}

function RenameInput({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue: string;
  onSave: (title: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave(value.trim());
            if (e.key === "Escape") onCancel();
          }}
          maxLength={200}
          className="flex-1 text-[13px] bg-transparent text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
          placeholder="Session name..."
        />
        <button
          onClick={() => onSave(value.trim())}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Check size={13} />
        </button>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <MessageSquare size={14} className="text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center leading-relaxed px-4">
        {label}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="px-3 py-2.5 animate-pulse">
      <div className="flex items-start gap-2.5">
        <div className="w-3.5 h-3.5 rounded bg-gray-100 dark:bg-gray-800 mt-0.5 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

type FilterTab = "all" | "starred" | "archived";

export default function Recent() {
  const router = useRouter();
  const {
    sessions,
    activeSessions,
    starredSessions,
    isLoading,
    error,
    currentSessionId,
    fetchSessions,
    getSession,
    update,
    starSession,
    unstarSession,
    archiveSession,
    softDeleteSession,
    hardDeleteSession,
  } = useChat(true);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [renaming, setRenaming] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (activeTab === "all") fetchSessions({ status: "active" });
    if (activeTab === "starred") fetchSessions({ isStarred: true });
    if (activeTab === "archived") fetchSessions({ status: "archived" });
  }, [activeTab, fetchSessions]);

  const displayedSessions: IChatSessionResponse[] =
    activeTab === "starred"
      ? starredSessions
      : activeTab === "archived"
        ? sessions.filter((s) => s.status === "archived")
        : activeSessions;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "starred", label: "Starred" },
    { key: "archived", label: "Archived" },
  ];

  function handleSelect(session: IChatSessionResponse) {
    getSession(session.id);
    router.push(`/chat/${session.id}`);
  }

  function handleStar(session: IChatSessionResponse) {
    if (session.isStarred) unstarSession(session.id);
    else starSession(session.id);
  }

  function handleSaveRename(title: string) {
    if (!renaming || !title) return;
    update({ sessionId: renaming.id, title });
    setRenaming(null);
  }

  const emptyLabel =
    activeTab === "starred"
      ? "No starred sessions yet."
      : activeTab === "archived"
        ? "Nothing archived."
        : "No recent chats. Start a new one.";

  return (
    <div className="flex flex-col w-full min-h-[50vh] max-h-[50vh]">
      <div className="px-3 pt-3 pb-1 shrink-0">
        <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-[11px] font-medium py-1 rounded-md transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-2 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Recent
        </span>
        {!isLoading && (
          <button
            onClick={() => fetchSessions()}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <RefreshCw size={11} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="flex flex-col gap-0.5 pb-2">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : error ? (
            <div className="px-3 py-3">
              <p className="text-[12px] text-red-500 dark:text-red-400">
                {error}
              </p>
              <button
                onClick={() => fetchSessions()}
                className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline transition-colors"
              >
                Try again
              </button>
            </div>
          ) : displayedSessions.length === 0 ? (
            <EmptyState label={emptyLabel} />
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedSessions.map((session) =>
                renaming?.id === session.id ? (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RenameInput
                      initialValue={renaming.title}
                      onSave={handleSaveRename}
                      onCancel={() => setRenaming(null)}
                    />
                  </motion.div>
                ) : (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isActive={session.id === currentSessionId}
                    onSelect={() => handleSelect(session)}
                    onStar={() => handleStar(session)}
                    onArchive={() => archiveSession(session.id)}
                    onSoftDelete={() => softDeleteSession(session.id)}
                    onHardDelete={() => hardDeleteSession(session.id)}
                    onRename={(id, title) => setRenaming({ id, title })}
                  />
                ),
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {displayedSessions.length > 0 && !isLoading && (
        <div className="px-3 py-2 shrink-0 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-600">
            <Clock size={10} />
            <span>
              {displayedSessions.length} session
              {displayedSessions.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

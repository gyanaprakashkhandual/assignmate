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

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SessionContextMenu({
  session,
  onClose,
  onStar,
  onArchive,
  onSoftDelete,
  onHardDelete,
  onRename,
}: {
  session: IChatSessionResponse;
  onClose: () => void;
  onStar: () => void;
  onArchive: () => void;
  onSoftDelete: () => void;
  onHardDelete: () => void;
  onRename: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const items = [
    {
      label: "Rename",
      icon: <PenLine size={13} />,
      action: () => {
        onRename();
        onClose();
      },
      className: "text-gray-700 dark:text-gray-300",
    },
    {
      label: session.isStarred ? "Unstar" : "Star",
      icon: session.isStarred ? <StarOff size={13} /> : <Star size={13} />,
      action: () => {
        onStar();
        onClose();
      },
      className: "text-gray-700 dark:text-gray-300",
    },
    {
      label: "Archive",
      icon: <Archive size={13} />,
      action: () => {
        onArchive();
        onClose();
      },
      className: "text-gray-700 dark:text-gray-300",
    },
    {
      label: "Delete",
      icon: <Trash2 size={13} />,
      action: () => {
        onSoftDelete();
        onClose();
      },
      className: "text-red-500 dark:text-red-400",
    },
    {
      label: "Delete permanently",
      icon: <Trash size={13} />,
      action: () => {
        onHardDelete();
        onClose();
      },
      className: "text-red-600 dark:text-red-500 font-medium",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.12 }}
      className="absolute right-0 top-7 z-50 w-48 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.action}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-75 ${item.className} ${i === items.length - 2 ? "border-t border-gray-100 dark:border-gray-800 mt-0.5 pt-2" : ""}`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.18 }}
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
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

          <div className="flex-1 min-w-0 pr-5">
            <p
              className={`text-[13px] leading-snug truncate font-medium ${
                isActive
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {session.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {formatRelativeTime(session.lastMessageAt)}
              </span>
              {session.messageCount > 0 && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    {session.messageCount} msg
                    {session.messageCount !== 1 ? "s" : ""}
                  </span>
                </>
              )}
              {session.isStarred && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                </>
              )}
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {(hovered || menuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-75"
            >
              <MoreHorizontal size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <SessionContextMenu
            session={session}
            onClose={() => setMenuOpen(false)}
            onStar={onStar}
            onArchive={onArchive}
            onSoftDelete={onSoftDelete}
            onHardDelete={onHardDelete}
            onRename={() => onRename(session.id, session.title)}
          />
        )}
      </AnimatePresence>
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
    <div className="px-3 py-6 flex flex-col items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <MessageSquare size={14} className="text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
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

  return (
    <div className="flex flex-col w-full">
      <div className="px-3 pt-3 pb-1">
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

      <div className="px-3 py-2 flex items-center justify-between">
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
          <EmptyState
            label={
              activeTab === "starred"
                ? "No starred sessions yet."
                : activeTab === "archived"
                  ? "Nothing archived."
                  : "No recent chats. Start a new one."
            }
          />
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

      {displayedSessions.length > 0 && !isLoading && (
        <div className="px-3 pb-2">
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

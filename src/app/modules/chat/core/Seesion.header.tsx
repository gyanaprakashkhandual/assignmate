"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Archive,
  FileDown,
  MoreHorizontal,
  Edit3,
  Trash2,
  Trash,
  Check,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { IChatSessionResponse, ChatStatus } from "../../../lib/types/chat.types";

interface SessionHeaderProps {
  currentSession: IChatSessionResponse | null;
  currentSessionTitle: string | null;
  currentSessionIsStarred: boolean;
  currentSessionStatus: ChatStatus | null;
  currentSessionMessageCount: number;
  currentSessionPdfUrl: string | null;
  onUpdate: (payload: {
    sessionId: string;
    title?: string;
    isStarred?: boolean;
    status?: ChatStatus;
  }) => void;
  onSoftDelete: (sessionId: string) => void;
  onHardDelete: (sessionId: string) => void;
  onExportPdfClick: () => void;
}

export default function SessionHeader({
  currentSession,
  currentSessionTitle,
  currentSessionIsStarred,
  currentSessionStatus,
  currentSessionMessageCount,
  currentSessionPdfUrl,
  onUpdate,
  onSoftDelete,
  onHardDelete,
  onExportPdfClick,
}: SessionHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentSessionTitle ?? "");
  const [showOverflow, setShowOverflow] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<"soft" | "hard" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleValue(currentSessionTitle ?? "");
  }, [currentSessionTitle]);

  useEffect(() => {
    if (isEditingTitle) inputRef.current?.focus();
  }, [isEditingTitle]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setShowOverflow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!currentSession) return null;

  const saveTitle = () => {
    if (titleValue.trim() && titleValue !== currentSessionTitle) {
      onUpdate({ sessionId: currentSession.id, title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const statusColor =
    currentSessionStatus === "active"
      ? "bg-emerald-500"
      : currentSessionStatus === "archived"
      ? "bg-amber-400"
      : "bg-red-400";

  const statusLabel =
    currentSessionStatus === "active"
      ? "Active"
      : currentSessionStatus === "archived"
      ? "Archived"
      : "Deleted";

  return (
    <div className="h-14 border-b border-black/8 dark:border-white/8 bg-white dark:bg-neutral-900 px-5 flex items-center justify-between gap-4 shrink-0 z-10">
      {/* Left: title + meta */}
      <div className="flex items-center gap-3 min-w-0">
        {isEditingTitle ? (
          <input
            ref={inputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") {
                setTitleValue(currentSessionTitle ?? "");
                setIsEditingTitle(false);
              }
            }}
            className="font-semibold text-sm text-black dark:text-white bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 w-56 transition"
            maxLength={200}
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="group flex items-center gap-1.5 min-w-0"
          >
            <span className="font-semibold text-sm text-black dark:text-white truncate max-w-[200px] group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
              {currentSessionTitle}
            </span>
            <Edit3 className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
          </button>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <MessageSquare className="w-3 h-3" />
            {currentSessionMessageCount}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Star */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() =>
            onUpdate({
              sessionId: currentSession.id,
              isStarred: !currentSessionIsStarred,
            })
          }
          className={`p-2 rounded-lg transition hover:bg-black/5 dark:hover:bg-white/8 ${
            currentSessionIsStarred ? "text-amber-400" : "text-neutral-400 dark:text-neutral-500"
          }`}
          title={currentSessionIsStarred ? "Unstar" : "Star"}
        >
          <Star className={`w-4 h-4 ${currentSessionIsStarred ? "fill-amber-400" : ""}`} />
        </motion.button>

        {/* Archive */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() =>
            onUpdate({ sessionId: currentSession.id, status: "archived" as ChatStatus })
          }
          className="p-2 rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition"
          title="Archive session"
        >
          <Archive className="w-4 h-4" />
        </motion.button>

        {/* PDF export button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onExportPdfClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-80 transition"
        >
          <FileDown className="w-3.5 h-3.5" />
          Export PDF
        </motion.button>

        {/* PDF link if exists */}
        {currentSessionPdfUrl && (
          <a
            href={currentSessionPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition"
            title="Open last exported PDF"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Overflow menu */}
        <div className="relative" ref={overflowRef}>
          <button
            onClick={() => setShowOverflow((v) => !v)}
            className="p-2 rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showOverflow && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-48 bg-white dark:bg-neutral-800 border border-black/10 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1"
              >
                <button
                  onClick={() => {
                    setIsEditingTitle(true);
                    setShowOverflow(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Rename
                </button>

                <button
                  onClick={() => {
                    setShowDeleteConfirm("soft");
                    setShowOverflow(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>

                <button
                  onClick={() => {
                    setShowDeleteConfirm("hard");
                    setShowOverflow(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <Trash className="w-3.5 h-3.5" />
                  Delete permanently
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-2xl p-6 w-80 shadow-2xl"
            >
              <h3 className="font-semibold text-black dark:text-white mb-1.5">
                {showDeleteConfirm === "hard" ? "Permanently delete?" : "Delete session?"}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                {showDeleteConfirm === "hard"
                  ? "This cannot be undone. All messages will be erased forever."
                  : "You can restore this session from the archive later."}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-black/5 dark:bg-white/8 text-neutral-700 dark:text-neutral-300 hover:opacity-80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm === "hard") onHardDelete(currentSession.id);
                    else onSoftDelete(currentSession.id);
                    setShowDeleteConfirm(null);
                  }}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
                >
                  {showDeleteConfirm === "hard" ? "Delete forever" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, AlertTriangle, Loader2 } from "lucide-react";

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
  isLoading: boolean;
  error: string | null;
  hasHandwritingImage: boolean;
}

export default function NewSessionModal({
  isOpen,
  onClose,
  onCreate,
  isLoading,
  error,
  hasHandwritingImage,
}: NewSessionModalProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!title.trim() || isLoading) return;
    onCreate(title.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/8 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/8 dark:border-white/8">
              <h2 className="font-semibold text-black dark:text-white">New Chat Session</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {!hasHandwritingImage ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-black dark:text-white mb-1.5">
                      Handwriting sample required
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      You need to upload your handwriting sample before creating a session.
                    </p>
                  </div>
                  <a
                    href="/profile/handwriting"
                    className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition"
                  >
                    Upload handwriting sample →
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Session name
                    </label>
                    <input
                      ref={inputRef}
                      value={title}
                      onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      placeholder="Name your session…"
                      className="w-full px-4 py-2.5 rounded-xl border border-black/12 dark:border-white/12 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm placeholder-neutral-400 outline-none focus:border-black/30 dark:focus:border-white/30 transition"
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-[11px] text-neutral-400">{title.length}/200</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {hasHandwritingImage && (
              <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-black/8 dark:border-white/8">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/8 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreate}
                  disabled={!title.trim() || isLoading}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-80 disabled:opacity-40 transition"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Create
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
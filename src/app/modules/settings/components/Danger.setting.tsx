"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/Auth.context";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import { useConfirm } from "@/ui/overlay/confirm/Confirm.context";
import { useAlert } from "@/ui/feedback/alert/Alert.context";

const CONFIRM_PHRASE = "delete my account";

export default function DangerSettings() {
  const { signOut } = useAuth();
  const { remove, isLoading } = useProfile(false);
  const { showConfirm } = useConfirm();
  const { addAlert } = useAlert();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteRequest = async () => {
    const confirmed = await showConfirm({
      title: "Delete Account",
      message:
        "This will permanently delete your profile, handwriting sample, and all assignments. This cannot be undone.",
      confirmText: "Yes, delete it",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      await remove();
      await signOut();
    } catch {
      addAlert({
        type: "error",
        title: "Deletion failed",
        message: "Something went wrong. Please try again.",
        position: "top-right",
        duration: 5000,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmText !== CONFIRM_PHRASE) return;
    await handleDeleteRequest();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-lg font-bold text-black dark:text-white">
          Danger Zone
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Irreversible actions. Proceed with caution.
        </p>
      </div>

      <div className="rounded-xl border border-red-200 dark:border-red-900 overflow-hidden">
        <div className="px-5 py-4 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-black dark:text-white">
              Delete Account
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Permanently delete your account and all associated data. This
              cannot be undone.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                    This will permanently delete:
                  </p>
                  <ul className="space-y-1">
                    {[
                      "Your profile and username",
                      "Your handwriting sample",
                      "All assignments and history",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400"
                      >
                        <span className="w-1 h-1 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-red-700 dark:text-red-300">
                  Type{" "}
                  <span className="font-mono font-bold">{CONFIRM_PHRASE}</span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={CONFIRM_PHRASE}
                  className="w-full px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-zinc-900 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent placeholder-red-300 dark:placeholder-red-800"
                />
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmDelete}
                  disabled={confirmText !== CONFIRM_PHRASE || isLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Confirm Delete
                </motion.button>
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    setConfirmText("");
                  }}
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

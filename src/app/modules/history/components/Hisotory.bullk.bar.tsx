/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Archive, X, ShieldAlert } from "lucide-react";
import { BulkAction } from "../types/index";
import { Tooltip } from "@/ui/data/tooltip/Tooltip.ui";

interface HistoryBulkBarProps {
  selectionCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggleAll: () => void;
  onClearSelection: () => void;
  onBulkAction: (action: BulkAction) => void;
  totalCount: number;
}

export function HistoryBulkBar({
  selectionCount,
  isAllSelected,
  isIndeterminate,
  onToggleAll,
  onClearSelection,
  onBulkAction,
  totalCount,
}: HistoryBulkBarProps) {
  const show = selectionCount > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 mb-3 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
            <span className="text-sm font-medium tabular-nums shrink-0">
              {selectionCount} selected
            </span>

            <div className="flex-1" />
            <Tooltip content="Archive" showArrow>
              <button
                onClick={() => onBulkAction("archive")}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              >
                <Archive size={13} />
                Archive
              </button>
            </Tooltip>
            <Tooltip content="Move To Trash" showArrow>
              <button
                onClick={() => onBulkAction("soft-delete")}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </Tooltip>
            <Tooltip content="Delete" showArrow>
              <button
                onClick={() => onBulkAction("permanent-delete")}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors text-white"
              >
                <ShieldAlert size={13} />
                Delete permanently
              </button>
            </Tooltip>
            <Tooltip content="Close" showArrow>
              <button
                onClick={onClearSelection}
                className="ml-1 text-white/60 dark:text-black/50 hover:text-white dark:hover:text-black transition-colors"
              >
                <X size={15} />
              </button>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, FileText, FolderOpen, ChevronDown } from "lucide-react";
import { IChatStats } from "../../../lib/types/chat.types";

interface StatsCardProps {
  stats: IChatStats | null;
  isLoading: boolean;
  onFetch: () => void;
}

export default function StatsCard({ stats, isLoading, onFetch }: StatsCardProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    onFetch();
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="px-3 py-3 border-t border-black/8 dark:border-white/8">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 bg-black/5 dark:bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const primary = [
    { label: "Sessions", value: stats.totalSessions, icon: FolderOpen },
    { label: "Messages", value: stats.totalMessages, icon: MessageSquare },
    { label: "PDFs", value: stats.totalPdfsGenerated, icon: FileText },
  ];

  const secondary = [
    { label: "Active", value: stats.activeSessions },
    { label: "Archived", value: stats.archivedSessions },
    { label: "Avg/session", value: stats.averageMessagesPerSession.toFixed(1) },
  ];

  return (
    <div className="border-t border-black/8 dark:border-white/8">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-black/2 dark:hover:bg-white/2 transition"
      >
        <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Stats
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </motion.div>
      </button>

      <div className="px-3 pb-3">
        <div className="grid grid-cols-3 gap-1.5">
          {primary.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg py-2 px-1"
            >
              <item.icon className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
              <span className="text-sm font-bold text-black dark:text-white leading-none">
                {item.value}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{item.label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                {secondary.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-0.5 py-2 px-1"
                  >
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
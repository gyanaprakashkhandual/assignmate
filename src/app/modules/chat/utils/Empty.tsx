"use client";

import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4 text-center px-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
        <span className="text-white dark:text-black text-lg font-bold">AI</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-black dark:text-white mb-1">
          How can I help you?
        </h2>
        <p className="text-sm text-gray-500 dark:text-zinc-500 max-w-xs">
          Start a conversation below. Your messages will appear here.
        </p>
      </div>
    </motion.div>
  );
}
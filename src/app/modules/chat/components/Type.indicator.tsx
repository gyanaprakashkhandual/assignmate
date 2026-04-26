"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white dark:text-black text-xs font-bold">AI</span>
      </div>

      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
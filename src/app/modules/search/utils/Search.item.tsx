"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, Star, File as FileIcon } from "lucide-react";
import { IChatSessionResponse } from "@/app/lib/types/chat.types";
import { Tooltip } from "@/ui/data/tooltip/Tooltip.ui";

interface SessionResultItemProps {
  session: IChatSessionResponse;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SessionResultItem({
  session,
  index,
  isSelected,
  onSelect,
}: SessionResultItemProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <motion.button
      key={session.id}
      data-index={index}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.12, delay: index * 0.02 }}
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors duration-100 group ${
        isSelected
          ? "bg-blue-50 dark:bg-gray-800/80"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 transition-colors ${
            isSelected
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
          }`}
        >
          {session.pdfUrl ? (
            <FileText size={16} />
          ) : (
            <MessageSquare size={16} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Tooltip content={session.title} showCopy position="right">
            <p
              className={`text-sm font-medium truncate transition-colors ${
                isSelected
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
              }`}
            >
              {session.title}
            </p>
          </Tooltip>
          <div className="flex items-center gap-3 mt-1">
            <p
              className={`text-xs transition-colors ${
                isSelected
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              }`}
            >
              {session.messageCount}{" "}
              {session.messageCount === 1 ? "message" : "messages"}
            </p>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <p
              className={`text-xs transition-colors ${
                isSelected
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              }`}
            >
              {formatDate(session.lastMessageAt)}
            </p>
          </div>
        </div>

        {session.isStarred && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="shrink-0"
          >
            <Star size={14} className="text-amber-400 fill-amber-400" />
          </motion.div>
        )}

        {session.pdfUrl && (
          <a
            href={session.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`shrink-0 p-2 rounded-lg transition-colors ${
              isSelected
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                : "text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <FileIcon size={14} />
          </a>
        )}

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="shrink-0 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
          />
        )}
      </div>
    </motion.button>
  );
}

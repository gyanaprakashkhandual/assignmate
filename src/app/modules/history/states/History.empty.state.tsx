"use client";
import { motion } from "framer-motion";
import { MessageSquare, Search } from "lucide-react";

interface HistoryEmptyStateProps {
    hasSearch: boolean;
    hasFilters: boolean;
    onReset: () => void;
}

export function HistoryEmptyState({ hasSearch, hasFilters, onReset }: HistoryEmptyStateProps) {
    const isFiltered = hasSearch || hasFilters;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-24 text-center"
        >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4">
                {isFiltered ? (
                    <Search size={22} className="text-gray-400 dark:text-gray-600" />
                ) : (
                    <MessageSquare size={22} className="text-gray-400 dark:text-gray-600" />
                )}
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isFiltered ? "No matching chats" : "No chat history yet"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 max-w-[220px]">
                {isFiltered
                    ? "Try adjusting your search or filters."
                    : "Start a conversation to see it here."}
            </p>
            {isFiltered && (
                <button
                    onClick={onReset}
                    className="mt-4 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                >
                    Clear filters
                </button>
            )}
        </motion.div>
    );
}
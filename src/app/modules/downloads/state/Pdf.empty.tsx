"use client";
import { motion } from "framer-motion";
import { FileText, Search } from "lucide-react";

interface PdfEmptyStateProps {
    hasFilters: boolean;
    onReset: () => void;
}

export function PdfEmptyState({ hasFilters, onReset }: PdfEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-28 text-center"
        >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4">
                {hasFilters ? (
                    <Search size={22} className="text-gray-400 dark:text-gray-600" />
                ) : (
                    <FileText size={22} className="text-gray-400 dark:text-gray-600" />
                )}
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {hasFilters ? "No PDFs found" : "No PDFs yet"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 max-w-[200px] leading-relaxed">
                {hasFilters
                    ? "Try adjusting your search or filters."
                    : "Export a chat to PDF and it will appear here."}
            </p>
            {hasFilters && (
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
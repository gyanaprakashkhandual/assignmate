"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Download,
    Share2,
    ExternalLink,
    FileText,
    MessageSquare,
    Clock,
    Zap,
    User,
    ChevronLeft,
    ChevronRight,
    Maximize2,
} from "lucide-react";
import { IPdfRecord } from "../types";

interface PdfViewerModalProps {
    pdf: IPdfRecord | null;
    allPdfs: IPdfRecord[];
    onClose: () => void;
    onDownload: (pdf: IPdfRecord) => void;
    onShare: (pdf: IPdfRecord) => void;
    onOpenChat: (sessionId: string) => void;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfViewerModal({
    pdf,
    allPdfs,
    onClose,
    onDownload,
    onShare,
    onOpenChat,
}: PdfViewerModalProps) {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const currentIndex = pdf ? allPdfs.findIndex((p) => p.id === pdf.id) : -1;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < allPdfs.length - 1;

    return (
        <AnimatePresence>
            {pdf && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 16 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-gray-100 dark:border-gray-900 pointer-events-auto overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-gray-900 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center shrink-0">
                                    <FileText size={14} className="text-gray-500 dark:text-gray-400" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {pdf.chatSession?.title ?? "Untitled chat"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
                                            <Clock size={9} />
                                            {formatDate(pdf.generatedAt)} · {formatTime(pdf.generatedAt)}
                                        </span>
                                        <span className="text-gray-200 dark:text-gray-800">·</span>
                                        <span className="text-[11px] text-gray-400 dark:text-gray-600">
                                            {formatFileSize(pdf.fileSize)}
                                        </span>
                                        <span className="text-gray-200 dark:text-gray-800">·</span>
                                        <span className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
                                            <MessageSquare size={9} />
                                            {pdf.messageCount} messages
                                        </span>
                                        <span className="text-gray-200 dark:text-gray-800">·</span>
                                        <span className={`text-[11px] font-medium flex items-center gap-0.5 ${pdf.exportedBy === "auto" ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-500"}`}>
                                            {pdf.exportedBy === "auto" ? <Zap size={9} /> : <User size={9} />}
                                            {pdf.exportedBy}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    {pdf.chatSession && (
                                        <button
                                            onClick={() => onOpenChat(pdf.chatSession!._id)}
                                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                        >
                                            <MessageSquare size={12} />
                                            Open chat
                                        </button>
                                    )}

                                    <button
                                        onClick={() => onShare(pdf)}
                                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <Share2 size={12} />
                                        Share
                                    </button>

                                    <button
                                        onClick={() => onDownload(pdf)}
                                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                                    >
                                        <Download size={12} />
                                        Download
                                    </button>

                                    <a
                                        href={pdf.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                        title="Open in new tab"
                                    >
                                        <Maximize2 size={13} />
                                    </a>

                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                {!iframeLoaded && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                            <FileText size={18} className="text-gray-400 dark:text-gray-600" />
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-600">Loading PDF…</p>
                                    </div>
                                )}
                                <iframe
                                    key={pdf.id}
                                    src={`${pdf.pdfUrl}#toolbar=1&navpanes=0`}
                                    className="w-full h-full border-0"
                                    onLoad={() => setIframeLoaded(true)}
                                    title={pdf.chatSession?.title ?? "PDF"}
                                />
                            </div>

                            {allPdfs.length > 1 && (
                                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-900 shrink-0">
                                    <button
                                        onClick={() => {
                                            setIframeLoaded(false);
                                        }}
                                        disabled={!hasPrev}
                                        className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={13} />
                                        Previous
                                    </button>

                                    <span className="text-[11px] text-gray-400 dark:text-gray-600">
                                        {currentIndex + 1} of {allPdfs.length}
                                    </span>

                                    <button
                                        onClick={() => {
                                            setIframeLoaded(false);
                                        }}
                                        disabled={!hasNext}
                                        className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                        <ChevronRight size={13} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
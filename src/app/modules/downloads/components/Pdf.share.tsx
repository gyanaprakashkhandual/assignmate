"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ExternalLink, Link } from "lucide-react";
import { IPdfRecord } from "../types";

interface PdfShareModalProps {
    pdf: IPdfRecord | null;
    onClose: () => void;
}

export function PdfShareModal({ pdf, onClose }: PdfShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (!pdf) return;
        try {
            await navigator.clipboard.writeText(pdf.pdfUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const el = document.createElement("textarea");
            el.value = pdf.pdfUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [pdf]);

    const handleNativeShare = useCallback(async () => {
        if (!pdf || !navigator.share) return;
        try {
            await navigator.share({
                title: pdf.chatSession?.title ?? "PDF Export",
                url: pdf.pdfUrl,
            });
        } catch {}
    }, [pdf]);

    return (
        <AnimatePresence>
            {pdf && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 12 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-900 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-900">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                        <Link size={14} className="text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Share PDF</p>
                                        <p className="text-[11px] text-gray-400 dark:text-gray-600 truncate max-w-[180px]">
                                            {pdf.chatSession?.title ?? "Untitled chat"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                    <p className="flex-1 text-xs text-gray-500 dark:text-gray-500 truncate font-mono">
                                        {pdf.pdfUrl}
                                    </p>
                                    <button
                                        onClick={handleCopy}
                                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                                    >
                                        <AnimatePresence mode="wait">
                                            {copied ? (
                                                <motion.span
                                                    key="check"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <Check size={12} />
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="copy"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <Copy size={12} />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                                        {copied ? "Copied!" : "Copy link"}
                                    </button>

                                    <a
                                        href={pdf.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                                    >
                                        <ExternalLink size={13} />
                                        Open
                                    </a>
                                </div>

                                {typeof navigator !== "undefined" && "share" in navigator && (
                                    <button
                                        onClick={handleNativeShare}
                                        className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        Share via…
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
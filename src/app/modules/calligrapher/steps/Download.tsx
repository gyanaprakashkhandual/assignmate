"use client";

import { motion } from "framer-motion";
import {
    Download, ExternalLink, Printer,
    PenLine, ScanLine, ArrowRight,
} from "lucide-react";

interface Props {
    onDownload: () => void;
}

const INSTRUCTIONS = [
    {
        icon: Download,
        title: "Download the template",
        desc:  "Click below to open Calligraphr and download the character sheet.",
    },
    {
        icon: Printer,
        title: "Print the sheet",
        desc:  "Print it on plain white paper. A4 or Letter size works fine.",
    },
    {
        icon: PenLine,
        title: "Fill every box",
        desc:  "Write each letter naturally — use the same pen you always use.",
    },
    {
        icon: ScanLine,
        title: "Scan or photograph it",
        desc:  "Good lighting, flat surface, no shadows. Then come back here.",
    },
] as const;

const container = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Step1Download({ onDownload }: Props) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
        >
            {/* Header */}
            <motion.div variants={item} className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                    Get your handwriting template
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    We use Calligraphr to convert your handwriting into a real font.
                    Follow these four steps, then come back to upload.
                </p>
            </motion.div>

            {/* Instruction cards */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INSTRUCTIONS.map((ins, i) => (
                    <div
                        key={i}
                        className="flex gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                            <ins.icon size={15} className="text-white dark:text-black" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-black dark:text-white">
                                {ins.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {ins.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Sample preview block */}
            <motion.div
                variants={item}
                className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-black"
            >
                <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3 font-medium">
                    What the template looks like
                </p>
                {/* Fake template grid preview */}
                <div className="grid grid-cols-13 gap-1">
                    {"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                        .split("")
                        .slice(0, 26)
                        .map((char) => (
                            <div
                                key={char}
                                className="w-7 h-7 border border-gray-200 dark:border-gray-800 rounded flex items-center justify-center"
                            >
                                <span className="text-[10px] text-gray-300 dark:text-gray-700 font-mono">
                                    {char}
                                </span>
                            </div>
                        ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-3">
                    Each box is where you write one character by hand.
                </p>
            </motion.div>

            {/* CTA */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={onDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 active:scale-95 transition-all duration-150"
                >
                    <ExternalLink size={15} />
                    Open Calligraphr &amp; Download Template
                </button>
                <button
                    onClick={onDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all duration-150"
                >
                    I already have it
                    <ArrowRight size={14} />
                </button>
            </motion.div>
        </motion.div>
    );
}
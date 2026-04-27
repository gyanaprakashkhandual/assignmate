"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    fontUrl:         string | null;
    previewSentence: string;
    onReset:         () => void;
}

const container = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Step3Complete({ fontUrl, previewSentence, onReset }: Props) {
    const router = useRouter();

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
        >
            {/* Success badge */}
            <motion.div variants={item} className="flex flex-col items-center gap-4 py-6">
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center"
                >
                    <CheckCircle2 size={30} className="text-white dark:text-black" />
                </motion.div>
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                        Your font is ready
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Every PDF you generate will now look exactly like your handwriting.
                    </p>
                </div>
            </motion.div>

            {/* Handwriting preview */}
            {fontUrl && (
                <motion.div
                    variants={item}
                    className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden"
                >
                    <div className="px-5 pt-4 pb-1">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                            Preview — your handwriting
                        </p>
                    </div>

                    {/* Lined paper look */}
                    <div className="relative px-6 py-6 overflow-hidden">
                        {/* Line rules */}
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute left-0 right-0 border-b border-blue-100 dark:border-blue-950"
                                style={{ top: `${32 + i * 28}px` }}
                            />
                        ))}
                        {/* Red margin */}
                        <div className="absolute left-12 top-0 bottom-0 border-l border-red-200 dark:border-red-900 opacity-60" />

                        <p
                            style={{ fontFamily: `url('${fontUrl}'), cursive` }}
                            className="relative text-2xl text-gray-800 dark:text-gray-200 leading-[28px] ml-6"
                        >
                            {previewSentence}
                        </p>
                    </div>

                    <div className="px-5 pb-4">
                        <p className="text-[11px] text-gray-400 dark:text-gray-600">
                            This text is rendered using your actual handwriting font.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* What happens next */}
            <motion.div
                variants={item}
                className="rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800"
            >
                {[
                    {
                        icon: Sparkles,
                        title: "Fully automatic from here",
                        desc:  "Every assignment PDF is generated in your handwriting — no extra steps needed.",
                    },
                    {
                        icon: RotateCcw,
                        title: "Want to redo your font?",
                        desc:  "You can replace your handwriting font anytime from your profile settings.",
                    },
                ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 p-4">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <Icon size={15} className="text-black dark:text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-black dark:text-white">{title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{desc}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Actions */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-80 active:scale-95 transition-all duration-150"
                >
                    Start writing assignments
                    <ArrowRight size={14} />
                </button>
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all duration-150"
                >
                    <RotateCcw size={14} />
                    Redo my font
                </button>
            </motion.div>
        </motion.div>
    );
}
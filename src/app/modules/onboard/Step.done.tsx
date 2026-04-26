"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Props {
    username: string;
    nickname: string;
}

export default function StepDone({ username, nickname }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className="flex justify-center"
            >
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
            </motion.div>

            <div>
                <h2 className="text-2xl font-bold text-black tracking-tight">
                    You're all set{nickname ? `, ${nickname}` : ""}!
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                    Welcome to Assignmate, <span className="font-medium text-black">@{username}</span>.
                    Your profile is ready.
                </p>
            </div>

            <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 text-left space-y-2">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">What's next</p>
                <ul className="space-y-1.5">
                    {["Upload your handwriting sample", "Create your first assignment", "Explore your dashboard"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-zinc-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
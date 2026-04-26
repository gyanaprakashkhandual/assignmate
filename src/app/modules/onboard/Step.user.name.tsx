"use client";

import { motion } from "framer-motion";
import { AtSign } from "lucide-react";

interface Props {
    value: string;
    onChange: (v: string) => void;
    error: string;
}

export default function StepUsername({ value, onChange, error }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-2xl font-bold text-black tracking-tight">Choose your username</h2>
                <p className="text-sm text-zinc-500 mt-1">This is your unique identity on Assignmate.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-black">Username</label>
                <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s/g, ""))}
                        placeholder="yourname"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <p className="text-xs text-zinc-400">Only lowercase letters, numbers, and underscores.</p>
            </div>
        </motion.div>
    );
}
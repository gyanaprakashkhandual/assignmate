"use client";

import { motion } from "framer-motion";
import { Smile, Briefcase, Hash } from "lucide-react";

interface Props {
    nickname: string;
    designation: string;
    age: string;
    onNicknameChange: (v: string) => void;
    onDesignationChange: (v: string) => void;
    onAgeChange: (v: string) => void;
}

export default function StepDetails({
    nickname,
    designation,
    age,
    onNicknameChange,
    onDesignationChange,
    onAgeChange,
}: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-2xl font-bold text-black tracking-tight">Tell us about yourself</h2>
                <p className="text-sm text-zinc-500 mt-1">These details help personalise your experience.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Nickname <span className="text-zinc-400">(optional)</span></label>
                    <div className="relative">
                        <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => onNicknameChange(e.target.value)}
                            placeholder="What should we call you?"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Designation <span className="text-zinc-400">(optional)</span></label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={designation}
                            onChange={(e) => onDesignationChange(e.target.value)}
                            placeholder="Student, Developer, Designer..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Age <span className="text-zinc-400">(optional)</span></label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => onAgeChange(e.target.value)}
                            placeholder="Your age"
                            min={1}
                            max={120}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
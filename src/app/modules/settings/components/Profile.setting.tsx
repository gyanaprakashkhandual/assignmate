"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, AtSign, Smile, Briefcase, Hash } from "lucide-react";
import { useProfile } from "@/app/hooks/useProfile.hooks";

export default function ProfileSettings() {
    const { profile, update, isLoading, error } = useProfile(false);

    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [designation, setDesignation] = useState("");
    const [age, setAge] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username ?? "");
            setNickname(profile.nickname ?? "");
            setDesignation(profile.designation ?? "");
            setAge(profile.age?.toString() ?? "");
        }
    }, [profile]);

    const handleSave = async () => {
        await update({
            username: username || undefined,
            nickname: nickname || undefined,
            designation: designation || undefined,
            age: age ? parseInt(age) : undefined,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-lg font-bold text-black">Profile</h2>
                <p className="text-sm text-zinc-500 mt-0.5">Update your personal information.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-black">Username</label>
                    <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-black">Nickname</label>
                    <div className="relative">
                        <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Optional"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-zinc-400"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-black">Designation</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="Optional"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-zinc-400"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-black">Age</label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Optional"
                            min={1}
                            max={120}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder-zinc-400"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                    {error}
                </p>
            )}

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                    "Saved!"
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Save Changes
                    </>
                )}
            </motion.button>
        </motion.div>
    );
}
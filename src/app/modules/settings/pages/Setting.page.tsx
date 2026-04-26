"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/Auth.context";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import SettingsNav, { SettingsTab } from "../components/Setting.nav";
import ProfileSettings from "../components/Profile.setting";
import HandwritingSettings from "../components/Handwriting.setting"; 
import SecuritySettings from "../components/Security.setting";
import DangerSettings from "../components/Danger.setting";
import { LogOut, Settings } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const { user, signOut } = useAuth();
    const { profile } = useProfile();

    const displayName = profile?.nickname || profile?.username || user?.name || "User";
    const initials = displayName.charAt(0).toUpperCase();

    const tabContent: Record<SettingsTab, React.ReactNode> = {
        profile: <ProfileSettings />,
        handwriting: <HandwritingSettings />,
        security: <SecuritySettings />,
        danger: <DangerSettings />,
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
                            <Settings className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black">Settings</h1>
                            <p className="text-xs text-zinc-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{initials}</span>
                            </div>
                            <span className="text-sm font-medium text-black">{displayName}</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={signOut}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:border-zinc-300 hover:text-black transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </motion.button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-8">
                    <aside className="w-full sm:w-48 shrink-0">
                        <SettingsNav active={activeTab} onChange={setActiveTab} />
                    </aside>

                    <main className="flex-1 min-w-0">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white rounded-2xl border border-zinc-100 p-6"
                        >
                            {tabContent[activeTab]}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
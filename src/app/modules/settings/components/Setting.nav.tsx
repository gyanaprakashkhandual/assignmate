"use client";

import { User, Image, Shield, Trash2, Palette } from "lucide-react";

export type SettingsTab = "profile" | "handwriting" | "appearance" | "security" | "danger";

interface Props {
    active: SettingsTab;
    onChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "handwriting", label: "Handwriting", icon: <Image size={16} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
    { id: "danger", label: "Danger Zone", icon: <Trash2 size={16} /> },
];

export default function SettingsNav({ active, onChange }: Props) {
    return (
        <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                        active === tab.id
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
                    } ${tab.id === "danger" ? "mt-4" : ""}`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </nav>
    );
}
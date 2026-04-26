"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "@/app/context/Theme.context";

type ThemeOption = {
    value: "light" | "dark" | "system";
    label: string;
    description: string;
    icon: React.ReactNode;
};

const options: ThemeOption[] = [
    {
        value: "light",
        label: "Light",
        description: "Clean white interface",
        icon: <Sun className="w-5 h-5" />,
    },
    {
        value: "dark",
        label: "Dark",
        description: "Easy on the eyes",
        icon: <Moon className="w-5 h-5" />,
    },
    {
        value: "system",
        label: "System",
        description: "Follows your device",
        icon: <Monitor className="w-5 h-5" />,
    },
];

export default function ThemeSettings() {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-lg font-bold text-black dark:text-white">Appearance</h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                    Choose how Assignmate looks for you.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {options.map((option) => {
                    const isActive = theme === option.value;

                    return (
                        <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setTheme(option.value)}
                            className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                                isActive
                                    ? "border-black dark:border-white bg-black dark:bg-white"
                                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                        >
                            <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                    isActive
                                        ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                }`}
                            >
                                {option.icon}
                            </div>

                            <div>
                                <p
                                    className={`text-sm font-semibold ${
                                        isActive
                                            ? "text-white dark:text-black"
                                            : "text-black dark:text-white"
                                    }`}
                                >
                                    {option.label}
                                </p>
                                <p
                                    className={`text-xs mt-0.5 ${
                                        isActive
                                            ? "text-white/70 dark:text-black/60"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    {option.description}
                                </p>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="theme-check"
                                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white dark:bg-black flex items-center justify-center"
                                >
                                    <Check className="w-3 h-3 text-black dark:text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-black dark:text-white">Current appearance</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        {theme === "system"
                            ? `System preference — currently ${resolvedTheme}`
                            : `Manually set to ${resolvedTheme}`}
                    </p>
                </div>
                <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        resolvedTheme === "dark"
                            ? "bg-zinc-800 text-zinc-200"
                            : "bg-zinc-200 text-zinc-700"
                    }`}
                >
                    {resolvedTheme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
            </div>
        </motion.div>
    );
}
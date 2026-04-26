"use client";

import { motion } from "framer-motion";
import { Unlink, Loader2, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { unlinkProvider, fetchLinkedProviders } from "@/app/lib/features/user/user.slice";
import { selectLinkedProviders, selectAuthLoading } from "@/app/lib/features/user/user.selector";
import { useEffect, useState } from "react";
import { FaChrome, FaGithub } from "react-icons/fa";

const providerMeta = {
    google: { label: "Google", icon: <FaChrome className="w-4 h-4" /> },
    github: { label: "GitHub", icon: <FaGithub className="w-4 h-4" /> },
};

export default function SecuritySettings() {
    const dispatch = useAppDispatch();
    const providers = useAppSelector(selectLinkedProviders);
    const isLoading = useAppSelector(selectAuthLoading);
    const [unlinking, setUnlinking] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchLinkedProviders());
    }, [dispatch]);

    const handleUnlink = async (provider: "google" | "github") => {
        setUnlinking(provider);
        await dispatch(unlinkProvider(provider));
        setUnlinking(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-lg font-bold text-black">Security</h2>
                <p className="text-sm text-zinc-500 mt-0.5">Manage your connected authentication providers.</p>
            </div>

            <div className="rounded-xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
                {(["google", "github"] as const).map((provider) => {
                    const meta = providerMeta[provider];
                    const linked = providers.some((p) => p.provider === provider);

                    return (
                        <div key={provider} className="flex items-center justify-between px-4 py-4 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
                                    {meta.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-black">{meta.label}</p>
                                    <p className="text-xs text-zinc-400">{linked ? "Connected" : "Not connected"}</p>
                                </div>
                            </div>

                            {linked && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleUnlink(provider)}
                                    disabled={isLoading || providers.length <= 1}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {unlinking === provider ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Unlink className="w-3.5 h-3.5" />
                                    )}
                                    Unlink
                                </motion.button>
                            )}
                        </div>
                    );
                })}
            </div>

            {providers.length <= 1 && (
                <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-2.5">
                    You must have at least one provider connected to sign in.
                </p>
            )}

            <div className="flex items-start gap-3 rounded-xl bg-zinc-50 border border-zinc-100 p-4">
                <ShieldCheck className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-500 leading-relaxed">
                    We never store your OAuth tokens. Authentication is handled securely through your provider.
                </p>
            </div>
        </motion.div>
    );
}
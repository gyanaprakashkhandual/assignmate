"use client";

import { useAuth } from "@/app/context/Auth.context";
import LandingPage from "@/app/pages/utils/Landing.page";
import DashboardPage from "@/components/pages/DashboardPage";
import { Loader2 } from "lucide-react";

export default function Page() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return isAuthenticated ? <DashboardPage /> : <LandingPage />;
}
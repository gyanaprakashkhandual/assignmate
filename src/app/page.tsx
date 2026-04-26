'use client'
import { Loader2 } from "lucide-react";
import Homepage from "./pages/core/Home.page";
import LandingPage from "./pages/utils/Landing.page";
import { useAuth } from "./context/Auth.context";

export default function Page() {
  const { isAuthenticated, isChecked } = useAuth();

  if (!isChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return isAuthenticated ? <Homepage /> : <LandingPage />;
}
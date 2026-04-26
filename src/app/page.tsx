'use client'
import { Loader2 } from "lucide-react";
import Homepage from "./pages/core/Home.page";
import LandingPage from "./pages/utils/Landing.page";
import { useAuth } from "./context/Auth.context";
import { useOnboard } from "./context/Onboard.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isAuthenticated, isChecked } = useAuth();
  const { isOnboarded, isChecking } = useOnboard();
  const router = useRouter();

  useEffect(() => {
    if (isChecked && !isChecking && isAuthenticated && !isOnboarded) {
      router.replace("/onboarding");
    }
  }, [isChecked, isChecking, isAuthenticated, isOnboarded]);

  // Show spinner while auth OR onboard is still loading
  if (!isChecked || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  // Auth done, onboard done, but needs redirect — show spinner while navigating
  if (isAuthenticated && !isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return isAuthenticated ? <Homepage /> : <LandingPage />;
}
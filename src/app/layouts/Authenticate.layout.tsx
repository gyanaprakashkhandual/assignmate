'use client'
import { Loader2 } from "lucide-react";
import Sidebar from "../components/core/Sidebar";
import { useAuth } from "../context/Auth.context";
import { usePathname } from "next/navigation";
import { useOnboard } from "../context/Onboard.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isChecked } = useAuth();
  const { isOnboarded, isChecking } = useOnboard();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding");

  // ✅ useEffect BEFORE any early returns
  useEffect(() => {
    if (isChecked && !isChecking && isAuthenticated && !isOnboarded && !isOnboardingRoute) {
      router.replace("/onboarding");
    }
  }, [isChecked, isChecking, isAuthenticated, isOnboarded, isOnboardingRoute]);

  if (isAuthRoute || isOnboardingRoute) {
    return <>{children}</>;
  }

  if (!isChecked || isChecking) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-900 dark:text-white animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-white dark:bg-gray-950">
        {children}
      </main>
    </div>
  );
}
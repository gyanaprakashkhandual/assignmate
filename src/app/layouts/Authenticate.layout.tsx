/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Sidebar from "../components/core/Sidebar";
import { useAuth } from "../context/Auth.context";
import { usePathname } from "next/navigation";
import { useOnboard } from "../context/Onboard.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "../components/utils/Loading.screen";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isChecked } = useAuth();
  const { isOnboarded, isChecking } = useOnboard();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding");

  useEffect(() => {
    if (
      isChecked &&
      !isChecking &&
      isAuthenticated &&
      !isOnboarded &&
      !isOnboardingRoute
    ) {
      router.replace("/onboarding");
    }
  }, [isChecked, isChecking, isAuthenticated, isOnboarded, isOnboardingRoute]);

  if (isAuthRoute || isOnboardingRoute) {
    return <>{children}</>;
  }

  if (!isChecked || isChecking) {
    return <LoadingScreen />;
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

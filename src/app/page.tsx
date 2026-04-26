/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import Homepage from "./pages/core/Home.page";
import LandingPage from "./pages/utils/Landing.page";
import { useAuth } from "./context/Auth.context";
import { useOnboard } from "./context/Onboard.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-[1.5px] border-zinc-200 dark:border-zinc-800"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-zinc-900 dark:border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center">
              <PenLine className="w-4 h-4 text-white dark:text-black" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-sm font-semibold text-black dark:text-white tracking-tight"
          >
            Loading
          </motion.p>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  const { isAuthenticated, isChecked } = useAuth();
  const { isOnboarded, isChecking } = useOnboard();
  const router = useRouter();

  useEffect(() => {
    if (isChecked && !isChecking && isAuthenticated && !isOnboarded) {
      router.replace("/onboarding");
    }
  }, [isChecked, isChecking, isAuthenticated, isOnboarded]);

  if (!isChecked || isChecking) return <LoadingScreen />;
  if (isAuthenticated && !isOnboarded) return <LoadingScreen />;

  return isAuthenticated ? <Homepage /> : <LandingPage />;
}

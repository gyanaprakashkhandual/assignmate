/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/Auth.context";
import BrandIcon from "@/app/components/icons/Brand.icon";

export default function CallbackPage() {
  const router = useRouter();
  const { isChecked, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isChecked) return;
    if (isAuthenticated) {
      router.replace("/");
    } else {
      router.replace("/auth");
    }
  }, [isChecked, isAuthenticated]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-16 w-16"
        >
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black dark:bg-white">
              <BrandIcon size={16} className="text-white dark:text-black" />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-sm font-semibold tracking-tight text-black dark:text-white"
          >
            Completing sign in
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-1 rounded-full bg-zinc-400 dark:bg-zinc-600"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

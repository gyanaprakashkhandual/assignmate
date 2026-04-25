"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/hooks";
import { fetchMe } from "@/app/lib/features/user/user.slice";
import { fetchMyProfile } from "@/app/lib/features/profile/profile.slice";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CallbackPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const result = await dispatch(fetchMe());
      if (fetchMe.fulfilled.match(result)) {
        await dispatch(fetchMyProfile());
        router.replace("/");
      } else {
        router.replace("/auth");
      }
    };
    init();
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-800"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-2 border-t-zinc-900 dark:border-t-zinc-100 border-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide"
        >
          Completing sign in...
        </motion.p>
      </motion.div>
    </div>
  );
}

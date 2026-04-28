"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { PenLine, ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/context/Auth.context";
import { GithubIcon, GoogleIcon } from "@/app/components/icons/Core.icon";

export default function AuthPage() {
  const { isAuthenticated, isChecked, loginWithGoogle, loginWithGithub } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isChecked) return;
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, isChecked, router]);

  if (!isChecked)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-5 h-5 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
      </div>
    );
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex">
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dvytvjplt/image/upload/v1777106482/Gemini_Generated_Image_xmaw9hxmaw9hxmaw_hih4jb.png"
          alt="Assignmate handwriting preview"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-zinc-950/20 to-zinc-950/10" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-zinc-950/10" />

        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <PenLine className="w-3.5 h-3.5 text-zinc-900" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white drop-shadow-sm">
            Assignmate
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-10 left-8 right-8"
        >
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-5">
            <p className="text-xl font-bold text-white leading-snug mb-1">
              Your handwriting. Zero effort.
            </p>
            <p className="text-sm text-white/70">
              Upload once. Generate handwritten PDFs forever.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 relative bg-white dark:bg-zinc-950 lg:max-w-120">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
                <PenLine className="w-3.5 h-3.5 text-white dark:text-zinc-900" />
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Assignmate
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                Welcome back
              </h1>
              <p
                className="text-sm text-zinc-500 dark:text-zinc-400"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Sign in to your account to continue
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={loginWithGithub}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 shadow-sm"
              >
                <GithubIcon />
                Continue with GitHub
              </motion.button>
            </div>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100 dark:border-zinc-900" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-400 dark:text-zinc-600">
                  Secure sign-in
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3.5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We never store your OAuth tokens. Your handwriting profiles
                  are private to your account only.
                </p>
              </div>
            </div>

            <div className="mt-7 pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 leading-relaxed">
                By signing in, you agree to our{" "}
                <span className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  Privacy Policy
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

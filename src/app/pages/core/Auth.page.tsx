"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { PenLine, ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/context/Auth.context";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function AuthPage() {
  const { isAuthenticated, isChecked, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isChecked) return;          // ← wait for check to complete
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, isChecked, router]);

  if (!isChecked) return null;       // ← don't render while unknown
  if (isAuthenticated) return null;  // ← don't flash login UI if authed

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

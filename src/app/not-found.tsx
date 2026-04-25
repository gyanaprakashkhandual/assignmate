"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 py-12 gap-12 lg:gap-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-4"
          >
            Error 404
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold text-zinc-900 dark:text-white leading-none tracking-tight mb-6"
          >
            Page
            <br />
            <span className="relative inline-block">
              not found.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 280 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7C50 2.5 140 1 278 7"
                  stroke="#18181b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="dark:stroke-white"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10"
            style={{ fontFamily: "'Lora', serif" }}
          >
            The page you&apos;re looking for seems to have wandered off. It may
            have been moved, deleted, or perhaps it never existed at all.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-zinc-900/20"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:border-zinc-900 dark:hover:border-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Go Back
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 32 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm lg:max-w-md shrink-0"
        >
          <div className="absolute -inset-6 rounded-3xl bg-linear-to-tr from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 blur-2xl opacity-80" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-zinc-900/15 dark:shadow-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <Image
              src="https://res.cloudinary.com/dvytvjplt/image/upload/v1777107591/Gemini_Generated_Image_t6pe9gt6pe9gt6pe_pkpnnz.png"
              alt="404 - Page not found"
              width={600}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-white/20 dark:from-zinc-950/20 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white dark:bg-zinc-900 rounded-full px-5 py-2.5 shadow-xl shadow-zinc-900/10 dark:shadow-zinc-900/40 border border-zinc-100 dark:border-zinc-800 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 animate-pulse" />
            <span
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Lost in the ink
            </span>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

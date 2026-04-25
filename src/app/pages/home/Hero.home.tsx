"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 pt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-zinc-100 dark:bg-zinc-900 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-zinc-100 dark:bg-zinc-900 blur-3xl opacity-60" />
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-zinc-900 dark:text-white" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
          <div className="flex flex-col items-start">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-6 uppercase tracking-widest"
            >
              <Sparkles className="w-3 h-3 text-zinc-500" />
              AI-Powered Handwriting
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-zinc-900 dark:text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your words.
              <br />
              <span className="relative inline-block">
                Your handwriting.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9C50 3 150 1 298 9" stroke="#18181b" strokeWidth="3" strokeLinecap="round" className="dark:stroke-white" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-lg"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Upload a photo of your handwriting. Ask any question. Get a beautifully rendered PDF that looks exactly like you wrote it — in minutes.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-zinc-900/20"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:border-zinc-900 dark:hover:border-zinc-300 transition-all duration-200"
              >
                See How It Works
              </Link>
            </motion.div>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex items-center gap-6 mt-10"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-950 bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-600 dark:to-zinc-800"
                  />
                ))}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-white">2,400+</span> students already using Assignmate
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 blur-2xl opacity-70" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-zinc-900/20 dark:shadow-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80">
                <Image
                  src="https://res.cloudinary.com/dvytvjplt/image/upload/v1777103258/Gemini_Generated_Image_czme6xczme6xczme_yfonvr.png"
                  alt="Assignmate - Handwritten document preview"
                  width={640}
                  height={480}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 to-transparent dark:from-zinc-900/30" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -left-6 top-1/4 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 shadow-xl shadow-zinc-900/10 dark:shadow-zinc-900/40 border border-zinc-100 dark:border-zinc-800 hidden sm:block"
              >
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Style Match</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">98.4% Accuracy</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute -right-6 bottom-1/4 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 shadow-xl shadow-zinc-900/10 dark:shadow-zinc-900/40 border border-zinc-100 dark:border-zinc-800 hidden sm:block"
              >
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Generated in</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Under 30s</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="relative z-10 w-full border-t border-zinc-100 dark:border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8">
            {[
              { number: "2,400+", label: "Active Users" },
              { number: "98.4%", label: "Style Accuracy" },
              { number: "50k+", label: "PDFs Generated" },
              { number: "<30s", label: "Generation Time" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.number}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
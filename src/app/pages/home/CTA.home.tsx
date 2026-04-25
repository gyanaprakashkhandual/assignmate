"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl bg-zinc-900 dark:bg-white overflow-hidden px-8 py-16 sm:px-16 sm:py-20 text-center"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-zinc-800 dark:bg-zinc-100 opacity-50 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-zinc-700 dark:bg-zinc-200 opacity-40 blur-3xl" />
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.04]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="dots"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="2"
                    cy="2"
                    r="1.5"
                    fill="white"
                    className="dark:fill-zinc-900"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-5"
            >
              Get Started Today
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white dark:text-zinc-900 mb-5 leading-tight"
            >
              Your handwriting.
              <br />
              Zero effort.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="text-base sm:text-lg text-zinc-400 dark:text-zinc-500 max-w-lg mx-auto mb-10"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Join thousands of students and professionals who are saving hours
              every week with Assignmate.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.36, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                href="/auth"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 shadow-lg"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 dark:border-zinc-300 text-zinc-300 dark:text-zinc-600 text-sm font-semibold hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import BrandIcon from "@/app/components/icons/Brand.icon";
import { motion } from "framer-motion";
import { Check, Zap, Clock, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const included = [
  "3 PDF exports every 24 hours",
  "Custom handwriting profile",
  "AI-powered assignment generation",
  "All paper styles — lined, plain, college-ruled",
  "Ink color & layout customization",
  "Assignment history & re-downloads",
];

const stats = [
  { icon: FileText, value: "3", label: "PDFs per day" },
  { icon: Clock, value: "24h", label: "Reset window" },
  { icon: Zap, value: "Free", label: "Always" },
];

export default function PlanPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Notebook ruled lines */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="w-full border-b border-zinc-100 dark:border-zinc-900"
            style={{ height: "40px" }}
          />
        ))}
        <div className="absolute left-16 top-0 h-full w-px bg-red-200 dark:bg-red-900/40 opacity-60" />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-150 h-125 rounded-full bg-zinc-100 dark:bg-zinc-800/30 blur-[140px] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Free during early access
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4"
            style={{
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.025em",
            }}
          >
            Completely free.
            <br />
            <span className="text-zinc-400 dark:text-zinc-600">Right now.</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Generate up to 3 handwritten PDFs every 24 hours — no card, no
            catch, no limits on quality.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
              className="flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60"
            >
              <Icon size={15} className="text-zinc-400 dark:text-zinc-500" />
              <span className="text-xl font-bold text-zinc-900 dark:text-white">
                {value}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7 mb-5 shadow-sm"
        >
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-5">
            Everything included
          </p>

          <ul className="space-y-3.5">
            {included.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check
                    size={11}
                    className="text-white dark:text-zinc-900"
                    strokeWidth={3}
                  />
                </div>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push("/auth")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200"
          >
            Get started for free
          </button>

          <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
            No credit card required · Resets every 24 hours
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-zinc-300 dark:text-zinc-700 mt-10"
        >
          © 2025 Assignmate. All rights reserved.
        </motion.p>
      </div>
    </main>
  );
}

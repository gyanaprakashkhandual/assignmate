"use client";

import { useRef } from "react";
import { easeInOut, motion, useInView } from "framer-motion";
import {
  ScanLine,
  Sparkles,
  FileText,
  Sliders,
  History,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: ScanLine,
    title: "Handwriting Cloning",
    description:
      "Upload a single photo of your handwriting. Our AI extracts your unique letter slant, spacing, and stroke characteristics to create a personal font profile.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Type any question or topic. Claude AI writes a well-structured, academic-quality answer tailored to your subject.",
  },
  {
    icon: FileText,
    title: "Realistic PDF Export",
    description:
      "Export multi-page PDFs with your handwriting on realistic paper backgrounds — lined, plain, or college-ruled. Indistinguishable from the real thing.",
  },
  {
    icon: Sliders,
    title: "Full Customization",
    description:
      "Control ink color, paper style, font size, line spacing, and margins. Fine-tune every visual detail before exporting.",
  },
  {
    icon: History,
    title: "Assignment History",
    description:
      "Every assignment is saved to your dashboard. Re-download any PDF at any time, or delete assignments you no longer need.",
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description:
      "All API keys stay server-side. Your data is scoped to your account only. JWT authentication and rate limiting protect your profile.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeInOut },
  },
};

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      className="py-24 lg:py-32 bg-zinc-50 dark:bg-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-4">
            Everything You Need
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-5 leading-tight">
            Built for authentic results
          </h2>
          <p
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Every feature is designed around one goal: output that is genuinely
            indistinguishable from your real handwriting.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative p-7 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-100 dark:hover:shadow-zinc-900 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2.5">
                {feature.title}
              </h3>
              <p
                className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

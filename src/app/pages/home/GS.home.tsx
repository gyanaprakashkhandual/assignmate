"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Handwriting",
    description:
      "Take a photo of anything you've written — a paragraph on plain paper is enough. Upload it to Assignmate and our AI extracts your personal style signature.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Generates Your Answer",
    description:
      "Type your question or assignment topic. Claude AI crafts a complete, well-structured academic answer, then renders it using your exact handwriting profile.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download Your PDF",
    description:
      "Preview the result, tweak ink color, paper style, and layout to your liking, then export a multi-page PDF that looks hand-written — because it is yours.",
  },
];

export default function GettingStarted() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-to-use"
      className="py-24 lg:py-32 bg-white dark:bg-zinc-950"
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
            Simple Process
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-5 leading-tight">
            Three steps to done
          </h2>
          <p
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto"
            style={{ fontFamily: "'Lora', serif" }}
          >
            From handwriting upload to finished PDF in under two minutes.
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-[calc(66%-4rem)] h-px bg-linear-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.15,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className="relative mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center shadow-lg shadow-zinc-900/20 dark:shadow-white/10">
                    <step.icon className="w-6 h-6 text-white dark:text-zinc-900" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p
                  className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 lg:mt-20 flex justify-center"
        >
          <a
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-zinc-900/20"
          >
            Start for free — no credit card needed
          </a>
        </motion.div>
      </div>
    </section>
  );
}

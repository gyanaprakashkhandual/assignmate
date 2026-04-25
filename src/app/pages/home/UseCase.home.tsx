"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Heart } from "lucide-react";

const useCases = [
  {
    icon: GraduationCap,
    tag: "Students",
    title: "Handwritten assignments, done.",
    description:
      "Need to submit handwritten homework but running out of time? Assignmate generates it in your style — perfectly matched to how you actually write.",
    highlight: "Perfect for exam revisions, essays, and worksheets.",
  },
  {
    icon: Briefcase,
    tag: "Professionals",
    title: "Personalized notes at scale.",
    description:
      "Send handwritten thank-you notes, client letters, or memos — all in your own handwriting — without ever picking up a pen.",
    highlight: "Authentic communication without the effort.",
  },
  {
    icon: Heart,
    tag: "Anyone",
    title: "Your handwriting, digitized forever.",
    description:
      "Preserve your handwriting style digitally. Create personalized cards, journaling pages, or custom stationery that genuinely looks like you.",
    highlight: "A digital extension of your personal style.",
  },
];

export default function UseCases() {
  return (
    <section className="py-24 lg:py-32 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-4">
            Who It's For
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Made for every writer
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto" style={{ fontFamily: "'Lora', serif" }}>
            Whether you are a student, a professional, or just someone who loves the feel of handwriting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.tag}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-100 dark:hover:shadow-zinc-900/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-zinc-50 dark:bg-zinc-900 -translate-y-1/2 translate-x-1/2 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors duration-300" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <uc.icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {uc.tag}
                  </span>
                </div>

                <h3
                  className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 leading-snug"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {uc.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5" style={{ fontFamily: "'Lora', serif" }}>
                  {uc.description}
                </p>
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-px bg-zinc-400 dark:bg-zinc-600 flex-shrink-0 inline-block" />
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 italic" style={{ fontFamily: "'Lora', serif" }}>
                    {uc.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
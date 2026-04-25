"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PenLine,
  FileText,
  Sparkles,
  ArrowRight,
  ScanLine,
  Download,
  Layers,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: ScanLine,
    title: "Upload Your Handwriting",
    desc: "Photograph a single page of your handwriting. Our AI maps every slant, loop, and spacing quirk.",
  },
  {
    icon: Sparkles,
    title: "AI Generates the Answer",
    desc: "Type a question or topic. Claude writes a polished, academic-grade response tailored to your prompt.",
  },
  {
    icon: PenLine,
    title: "Rendered in Your Style",
    desc: "The text is drawn onto realistic paper using your personal handwriting font with natural variation.",
  },
  {
    icon: Download,
    title: "Export as PDF",
    desc: "Download a multi-page PDF that looks exactly like you wrote it — lined, plain, or college-ruled.",
  },
];

const paperStyles = ["Lined Notebook", "Plain White", "College-Ruled"];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
            <PenLine className="w-3.5 h-3.5 text-white dark:text-zinc-900" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Inkify</span>
        </div>

        <button
          onClick={() => router.push("/auth")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors duration-200"
        >
          Sign In
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      <section className="relative pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          className="absolute top-20 right-0 w-80 h-80 rounded-full bg-zinc-100 dark:bg-zinc-900 blur-3xl opacity-60"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-zinc-50 dark:bg-zinc-900 blur-3xl opacity-40"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="relative max-w-3xl">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900"
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered Handwriting Clone
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Your handwriting.
            <br />
            <span className="text-zinc-400 dark:text-zinc-600">
              Infinitely scaled.
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed mb-10"
          >
            Upload one photo of your handwriting. Inkify clones your personal
            style and generates authentic, handwritten PDF documents on demand —
            assignments, notes, letters.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <button
              onClick={() => router.push("/auth")}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all duration-200 shadow-lg shadow-zinc-900/10"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <span className="text-xs text-zinc-400 dark:text-zinc-600">
              No credit card required
            </span>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">
            How it works
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Four steps to your document
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <f.icon
                  className="w-4.5 h-4.5 text-zinc-700 dark:text-zinc-300"
                  size={18}
                />
              </div>
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 mb-2 tabular-nums">
                0{i + 1}
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug">
                {f.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/30 p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center gap-10">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                  Paper Styles
                </span>
              </div>
              <h2
                className="text-3xl font-bold tracking-tight mb-4"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Choose your canvas
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                Every document renders on a realistic paper background. Pick
                from lined notebook, plain white, or college-ruled — each with
                authentic margins and page feel.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {paperStyles.map((style, i) => (
              <motion.div
                key={style}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
              >
                <FileText className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {style}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Ready to write?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
            Join thousands of students and professionals who use Inkify to
            produce handwritten documents that are indistinguishable from the
            real thing.
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all duration-200 shadow-xl shadow-zinc-900/10"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-100 dark:border-zinc-900 py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-900 dark:bg-white flex items-center justify-center">
              <PenLine className="w-2.5 h-2.5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-xs font-semibold text-zinc-500">Inkify</span>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Inkify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

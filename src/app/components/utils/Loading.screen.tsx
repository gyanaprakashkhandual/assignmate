"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import BrandIcon from "../icons/Brand.icon";

const loadingPhrases = [
  "Analyzing your handwriting style…",
  "Preparing your writing profile…",
  "Loading your assignments…",
  "Almost ready…",
];

const floatingWords = [
  { text: "Homework", x: "8%", y: "18%", delay: 0, rotate: -8 },
  { text: "Essay", x: "78%", y: "12%", delay: 0.4, rotate: 6 },
  { text: "Notes", x: "85%", y: "55%", delay: 0.8, rotate: -4 },
  { text: "Report", x: "5%", y: "65%", delay: 1.2, rotate: 5 },
  { text: "Assignment", x: "60%", y: "82%", delay: 0.6, rotate: -6 },
  { text: "Study", x: "20%", y: "85%", delay: 1.0, rotate: 3 },
];

export default function LoadingScreen() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % loadingPhrases.length);
    }, 1800);
    return () => clearInterval(phraseInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + Math.random() * 6;
      });
    }, 400);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-gray-950 overflow-hidden flex flex-col items-center justify-center">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft radial glow — center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-150 h-150 rounded-full bg-gray-100 dark:bg-gray-800/40 blur-[120px] opacity-60" />
      </div>

      {/* Floating handwriting-style words */}
      {floatingWords.map((word, i) => (
        <motion.span
          key={word.text}
          className="absolute text-sm font-medium text-gray-200 dark:text-gray-700 select-none pointer-events-none"
          style={{
            left: word.x,
            top: word.y,
            fontFamily: "'Georgia', serif",
            rotate: `${word.rotate}deg`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], y: [10, 0, 0, -8] }}
          transition={{
            delay: word.delay,
            duration: 5,
            repeat: Infinity,
            repeatDelay: i * 0.3 + 2,
            ease: "easeInOut",
          }}
        >
          {word.text}
        </motion.span>
      ))}

      {/* Decorative ruled lines — left side */}
      <div className="absolute left-0 top-0 h-full w-32 opacity-[0.06] dark:opacity-[0.05] pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="w-full border-b border-gray-400 dark:border-gray-500"
            style={{ marginTop: i === 0 ? "80px" : 0, height: "28px" }}
          />
        ))}
        {/* Red margin line */}
        <div className="absolute left-10 top-0 h-full w-px bg-red-300 dark:bg-red-800 opacity-60" />
      </div>

      {/* Main content card */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Icon + Brand */}
        <div className="flex flex-col items-center gap-4">
          {/* Animated icon wrapper */}
          <motion.div
            className="relative"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Soft shadow under icon */}
            <motion.div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-2 bg-gray-300 dark:bg-gray-700 rounded-full blur-sm"
              animate={{ scaleX: [1, 0.75, 1], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <BrandIcon className="w-16 h-16 drop-shadow-md" />
          </motion.div>

          {/* Brand name */}
          <div className="flex flex-col items-center gap-1">
            <h1
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Assign
              <span className="text-gray-400 dark:text-gray-500">mate</span>
            </h1>
            <p
              className="text-sm text-gray-400 dark:text-gray-500 tracking-widest uppercase"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.2em" }}
            >
              Your Handwriting, Amplified
            </p>
          </div>
        </div>

        {/* Animated pen-writing underline */}
        <motion.div className="relative w-48 h-px">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <motion.div
            className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Pen tip dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-900 dark:bg-white shadow-sm"
            style={{ left: `calc(${Math.min(progress, 100)}% - 4px)` }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Loading phrase with crossfade */}
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              className="text-sm text-gray-400 dark:text-gray-500"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {loadingPhrases[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Three feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            { icon: "✍️", label: "Handwriting Clone" },
            { icon: "📄", label: "PDF Export" },
            { icon: "🤖", label: "AI-Powered" },
          ].map((pill, i) => (
            <motion.div
              key={pill.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium"
              style={{ fontFamily: "'Georgia', serif" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.12, duration: 0.4 }}
            >
              <span>{pill.icon}</span>
              {pill.label}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        className="absolute bottom-8 text-xs text-gray-300 dark:text-gray-700 tracking-widest uppercase"
        style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.25em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        Assignmate &copy; {new Date().getFullYear()}
      </motion.p>
    </div>
  );
}

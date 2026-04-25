"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 2400, suffix: "+", label: "Active Users", description: "Students and professionals worldwide" },
  { value: 98.4, suffix: "%", label: "Style Accuracy", description: "Matched to your personal handwriting" },
  { value: 50000, suffix: "+", label: "PDFs Generated", description: "Handwritten documents created" },
  { value: 30, suffix: "s", label: "Avg Generation", description: "From topic to finished PDF" },
];

function CountUp({ target, suffix, duration = 1800 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(target * eased);
      if (progress < 1) ref.current = requestAnimationFrame(update);
    };
    ref.current = requestAnimationFrame(update);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);

  const display = target % 1 === 0 ? Math.round(count).toLocaleString() : count.toFixed(1);
  return <>{display}{suffix}</>;
}

export default function StatsNumbers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center px-4"
            >
              <p
                className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-1.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {inView ? <CountUp target={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
              </p>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{stat.label}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 hidden sm:block">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
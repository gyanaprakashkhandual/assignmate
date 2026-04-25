"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Engineering Student, IIT Bombay",
    avatar: "PS",
    text: "I was skeptical at first, but the output genuinely looks like my own handwriting. Submitted three assignments last week and my professor didn't notice a thing.",
  },
  {
    name: "Arjun Mehta",
    role: "MBA Student, ISB Hyderabad",
    avatar: "AM",
    text: "The customization options are incredible. I matched my exact pen pressure and slant. The college-ruled paper style is spot on.",
  },
  {
    name: "Sneha Rathi",
    role: "Content Writer",
    avatar: "SR",
    text: "I use it for personalized client thank-you notes. My clients always mention how thoughtful it is to receive a handwritten note. They have no idea.",
  },
  {
    name: "Rahul Desai",
    role: "High School Teacher",
    avatar: "RD",
    text: "Genuinely impressive AI. As someone who teaches writing, I expected to spot it immediately. The natural variation in letterforms fooled me completely.",
  },
  {
    name: "Kavya Nair",
    role: "Commerce Student",
    avatar: "KN",
    text: "The onboarding took two minutes. Upload a photo, type your question, download. It's that simple. Saved me hours during exam season.",
  },
  {
    name: "Dev Patel",
    role: "Freelance Designer",
    avatar: "DP",
    text: "I use it for handwritten captions in my design projects. The PDF quality is professional and the style parameters are surprisingly nuanced.",
  },
];

export default function Feedback() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="feedback" className="py-24 lg:py-32 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-5 leading-tight">
            Loved by writers
          </h2>
          <p
            className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto"
            style={{ fontFamily: "'Lora', serif" }}
          >
            From students to professionals — here is what people are saying
            about Assignmate.
          </p>
        </motion.div>

        <div
          ref={ref}
          className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.09,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="break-inside-avoid bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800"
            >
              <Quote className="w-5 h-5 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p
                className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-5"
                style={{ fontFamily: "'Lora', serif" }}
              >
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {t.role}
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

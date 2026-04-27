"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { CalligraphrStep } from "@/app/lib/types/caliligrapher.types";

interface Props {
  currentStep: CalligraphrStep;
}

const STEPS = [
  { n: 1, label: "Download Template" },
  { n: 2, label: "Upload Your Writing" },
  { n: 3, label: "Font Ready" },
] as const;

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center gap-0 w-full max-w-md mx-auto">
      {STEPS.map((step, i) => {
        const done = currentStep > step.n;
        const active = currentStep === step.n;
        const pending = currentStep < step.n;

        return (
          <div key={step.n} className="flex items-center flex-1">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: done
                    ? "#000"
                    : active
                      ? "#000"
                      : "transparent",
                  borderColor: pending ? "#d1d5db" : "#000",
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
              >
                {done ? (
                  <Check
                    size={14}
                    className="text-white dark:text-black"
                    strokeWidth={2.5}
                  />
                ) : (
                  <span
                    className={`text-xs font-semibold ${
                      active ? "text-white dark:text-black" : "text-gray-400"
                    }`}
                  >
                    {step.n}
                  </span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium tracking-wide text-center whitespace-nowrap transition-colors duration-200 ${
                  active || done
                    ? "text-black dark:text-white"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-2 mb-5">
                <div className="h-px bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-black dark:bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: currentStep > step.n ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Smile, Briefcase, Hash } from "lucide-react";

interface Props {
  nickname: string;
  designation: string;
  age: string;
  onNicknameChange: (v: string) => void;
  onDesignationChange: (v: string) => void;
  onAgeChange: (v: string) => void;
}

export default function StepDetails({
  nickname,
  designation,
  age,
  onNicknameChange,
  onDesignationChange,
  onAgeChange,
}: Props) {
  const fields = [
    {
      label: "Nickname",
      icon: Smile,
      value: nickname,
      onChange: onNicknameChange,
      placeholder: "What should we call you?",
      type: "text",
    },
    {
      label: "Designation",
      icon: Briefcase,
      value: designation,
      onChange: onDesignationChange,
      placeholder: "Student, Developer, Designer...",
      type: "text",
    },
    {
      label: "Age",
      icon: Hash,
      value: age,
      onChange: onAgeChange,
      placeholder: "Your age",
      type: "number",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">
          Tell us about yourself
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          These details help personalise your experience.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map(
          ({ label, icon: Icon, value, onChange, placeholder, type }) => (
            <div key={label} className="space-y-2">
              <label className="text-sm font-medium text-black dark:text-white">
                {label}{" "}
                <span className="text-zinc-400 dark:text-zinc-500">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  min={type === "number" ? 1 : undefined}
                  max={type === "number" ? 120 : undefined}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition"
                />
              </div>
            </div>
          ),
        )}
      </div>
    </motion.div>
  );
}

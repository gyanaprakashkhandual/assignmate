/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, AtSign, Smile, Briefcase, Hash } from "lucide-react";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import { useAlert } from "@/ui/feedback/alert/Alert.context";

export default function ProfileSettings() {
  const { profile, update, isLoading, error } = useProfile(false);
  const { addAlert } = useAlert();

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [designation, setDesignation] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setNickname(profile.nickname ?? "");
      setDesignation(profile.designation ?? "");
      setAge(profile.age?.toString() ?? "");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await update({
        username: username || undefined,
        nickname: nickname || undefined,
        designation: designation || undefined,
        age: age ? parseInt(age) : undefined,
      });
      addAlert({
        type: "success",
        title: "Profile updated",
        message: "Your changes have been saved successfully.",
        position: "top-right",
        duration: 3000,
      });
    } catch {
      addAlert({
        type: "error",
        title: "Update failed",
        message: error ?? "Something went wrong. Please try again.",
        position: "top-right",
        duration: 5000,
      });
    }
  };

  const fields = [
    {
      label: "Username",
      icon: AtSign,
      value: username,
      onChange: (v: string) => setUsername(v.toLowerCase().replace(/\s/g, "")),
      placeholder: "",
      type: "text",
    },
    {
      label: "Nickname",
      icon: Smile,
      value: nickname,
      onChange: (v: string) => setNickname(v),
      placeholder: "Optional",
      type: "text",
    },
    {
      label: "Designation",
      icon: Briefcase,
      value: designation,
      onChange: (v: string) => setDesignation(v),
      placeholder: "Optional",
      type: "text",
    },
    {
      label: "Age",
      icon: Hash,
      value: age,
      onChange: (v: string) => setAge(v),
      placeholder: "Optional",
      type: "number",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-lg font-bold text-black dark:text-white">
          Profile
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Update your personal information.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map(
          ({ label, icon: Icon, value, onChange, placeholder, type }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-sm font-medium text-black dark:text-white">
                {label}
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition placeholder-zinc-400 dark:placeholder-zinc-600"
                />
              </div>
            </div>
          ),
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isLoading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

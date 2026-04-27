"use client";
import React from "react";
import { Info, AlertTriangle, XCircle, CheckCircle, StickyNote, Lightbulb } from "lucide-react";
import { CalloutProps } from "../types";

const calloutConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500 dark:text-blue-400",
    titleColor: "text-blue-800 dark:text-blue-300",
    bodyColor: "text-blue-700 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-500 dark:text-amber-400",
    titleColor: "text-amber-800 dark:text-amber-300",
    bodyColor: "text-amber-700 dark:text-amber-400",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    iconColor: "text-red-500 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-300",
    bodyColor: "text-red-700 dark:text-red-400",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    titleColor: "text-emerald-800 dark:text-emerald-300",
    bodyColor: "text-emerald-700 dark:text-emerald-400",
  },
  note: {
    icon: StickyNote,
    bg: "bg-gray-50 dark:bg-gray-800/50",
    border: "border-gray-200 dark:border-gray-700",
    iconColor: "text-gray-500 dark:text-gray-400",
    titleColor: "text-gray-800 dark:text-gray-200",
    bodyColor: "text-gray-600 dark:text-gray-400",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-500 dark:text-purple-400",
    titleColor: "text-purple-800 dark:text-purple-300",
    bodyColor: "text-purple-700 dark:text-purple-400",
  },
};

export function Callout({ type, title, children, className = "", classNames = {} }: CalloutProps) {
  const config = calloutConfig[type] ?? calloutConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`my-4 rounded-xl border p-4 ${config.bg} ${config.border} ${classNames.callout ?? ""} ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={16} className={`mt-0.5 shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`text-sm font-semibold mb-1 ${config.titleColor} ${classNames.calloutTitle ?? ""}`}>
              {title}
            </p>
          )}
          <div className={`text-sm leading-relaxed ${config.bodyColor} ${classNames.calloutBody ?? ""}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
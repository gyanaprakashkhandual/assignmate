"use client";
import React from "react";
import { ExternalLink } from "lucide-react";
import {
  LinkProps,
  ImageProps,
  BadgeProps,
  ButtonProps,
  KbdProps,
  MarkProps,
  InlineCodeProps,
} from "../types";

export function Link({ href, children, external, className = "" }: LinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-100 ${className}`}
    >
      {children}
      {external && <ExternalLink size={11} className="shrink-0 opacity-60" />}
    </a>
  );
}

export function Image({ src, alt = "", title, className = "", classNames = {} }: ImageProps) {
  return (
    <span className={`block my-4 ${classNames.imageWrapper ?? ""}`}>
      <img
        src={src}
        alt={alt}
        title={title}
        className={`max-w-full h-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${classNames.image ?? ""} ${className}`}
        loading="lazy"
      />
      {(title || alt) && (
        <span className="block mt-1.5 text-xs text-gray-400 dark:text-gray-500 text-center">
          {title || alt}
        </span>
      )}
    </span>
  );
}

const badgeVariants = {
  default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  success: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  warning: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  error: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  info: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

const buttonVariants = {
  primary: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 border-transparent",
  secondary: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700",
  ghost: "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700",
};

export function Button({ children, href, onClick, variant = "primary", className = "" }: ButtonProps) {
  const base = `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors duration-150 ${buttonVariants[variant]} ${className}`;
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={base}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
}

export function InlineCode({ children, className = "" }: InlineCodeProps) {
  return (
    <code
      className={`font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </code>
  );
}

export function Kbd({ children, className = "" }: KbdProps) {
  return (
    <kbd
      className={`font-mono text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm ${className}`}
    >
      {children}
    </kbd>
  );
}

export function Mark({ children, className = "" }: MarkProps) {
  return (
    <mark
      className={`bg-yellow-200 dark:bg-yellow-800/50 text-black dark:text-white px-0.5 rounded ${className}`}
    >
      {children}
    </mark>
  );
}
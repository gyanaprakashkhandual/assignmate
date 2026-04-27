/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import type { Transition } from "framer-motion";
import { CodeBlockProps } from "../types";

const fadeTransition: Transition = { duration: 0.15, ease: "easeOut" };

const LANGUAGE_LABELS: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  jsx: "JSX",
  tsx: "TSX",
  py: "Python",
  python: "Python",
  rb: "Ruby",
  ruby: "Ruby",
  go: "Go",
  rs: "Rust",
  rust: "Rust",
  java: "Java",
  cpp: "C++",
  c: "C",
  cs: "C#",
  php: "PHP",
  swift: "Swift",
  kt: "Kotlin",
  kotlin: "Kotlin",
  sh: "Shell",
  bash: "Bash",
  zsh: "Zsh",
  fish: "Fish",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  less: "Less",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  xml: "XML",
  md: "Markdown",
  markdown: "Markdown",
  graphql: "GraphQL",
  gql: "GraphQL",
  dockerfile: "Dockerfile",
  toml: "TOML",
  ini: "INI",
  env: ".ENV",
  txt: "Plain Text",
  plaintext: "Plain Text",
};

function tokenizeCode(code: string, language: string): React.ReactNode[] {
  if (!language || language === "plaintext" || language === "txt") {
    return [<span key="plain">{code}</span>];
  }

  const lines = code.split("\n");
  return lines.map((line, i) => (
    <span key={i} className="block">
      {line || " "}
    </span>
  ));
}

export function CodeBlock({
  code,
  language = "",
  filename,
  showLineNumbers = false,
  className = "",
  classNames = {},
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const langLabel =
    LANGUAGE_LABELS[language.toLowerCase()] || language || "Code";
  const displayLines = code.split("\n");
  const lineCount = displayLines.length;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [code]);

  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden my-4 ${classNames.codeBlock ?? ""} ${className}`}
    >
      <div
        className={`flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 ${classNames.codeBlockHeader ?? ""}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600" />
            <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600" />
            <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600" />
          </div>
          {filename ? (
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
              {filename}
            </span>
          ) : (
            <span
              className={`text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${classNames.codeBlockLanguage ?? ""}`}
            >
              {langLabel}
            </span>
          )}
          {lineCount > 1 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-600">
              {lineCount} lines
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {lineCount > 10 && (
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-100"
              aria-label={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-100 ${classNames.codeBlockCopyButton ?? ""}`}
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={fadeTransition}
                  className="flex items-center gap-1 text-emerald-500"
                >
                  <Check size={12} />
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={fadeTransition}
                  className="flex items-center gap-1"
                >
                  <Copy size={12} />
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={`overflow-x-auto bg-white dark:bg-gray-900 ${classNames.codeBlockBody ?? ""}`}
            >
              <pre className="p-4 text-sm leading-relaxed font-mono text-gray-800 dark:text-gray-200 min-w-0">
                {showLineNumbers ? (
                  <table className="w-full border-collapse">
                    <tbody>
                      {displayLines.map((line, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                        >
                          <td className="select-none pr-4 text-right text-gray-400 dark:text-gray-600 text-xs w-8 leading-relaxed align-top">
                            {idx + 1}
                          </td>
                          <td className="leading-relaxed">
                            <code>{line || " "}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <code className="block">{code}</code>
                )}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

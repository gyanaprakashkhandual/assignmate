"use client";
import React, { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { TableProps } from "../types";
import { renderInline } from "../utils/inline";

export function Table({
  headers,
  rows,
  className = "",
  classNames = {},
}: TableProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const tsv = [headers, ...rows].map((r) => r.join("\t")).join("\n");
    navigator.clipboard.writeText(tsv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [headers, rows]);

  return (
    <div className={`my-4 ${classNames.tableWrapper ?? ""} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {rows.length} row{rows.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-100"
        >
          {copied ? (
            <Check size={11} className="text-emerald-500" />
          ) : (
            <Copy size={11} />
          )}
          {copied ? "Copied" : "Copy TSV"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table
          className={`w-full text-sm border-collapse ${classNames.table ?? ""}`}
        >
          <thead
            className={`bg-gray-50 dark:bg-gray-800/80 ${classNames.thead ?? ""}`}
          >
            <tr className={classNames.tr ?? ""}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 whitespace-nowrap ${classNames.th ?? ""}`}
                >
                  {renderInline(h, {}, `th-${i}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900 ${classNames.tbody ?? ""}`}
          >
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-75 ${classNames.tr ?? ""}`}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-2.5 text-gray-700 dark:text-gray-300 ${classNames.td ?? ""}`}
                  >
                    {renderInline(cell, {}, `td-${ri}-${ci}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

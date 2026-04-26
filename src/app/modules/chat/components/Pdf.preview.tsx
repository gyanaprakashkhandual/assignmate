"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink, FileText, AlertCircle } from "lucide-react";
import { IPdfExportResult } from "../../../lib/types/chat.types";

interface PdfPreviewPanelProps {
  pdfResult: IPdfExportResult | null;
  currentSessionPdfUrl: string | null;
}

export default function PdfPreviewPanel({ pdfResult, currentSessionPdfUrl }: PdfPreviewPanelProps) {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const pdfUrl = pdfResult?.pdfUrl || currentSessionPdfUrl;

  if (!pdfUrl) return null;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 border-t border-black/8 dark:border-white/8">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8 dark:border-white/8 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            PDF Preview
          </span>
          {pdfResult?.fileSize && (
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              · {formatBytes(pdfResult.fileSize)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
          >
            <Download className="w-3 h-3" />
            Download
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>
        </div>
      </div>

      {/* PDF embed */}
      <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 relative overflow-hidden">
        {!iframeLoaded && !iframeError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white animate-spin" />
          </div>
        )}

        {iframeError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <AlertCircle className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Can't preview PDF in browser.
            </p>
            <a
              href={pdfUrl}
              download
              className="text-sm font-medium text-black dark:text-white underline underline-offset-2"
            >
              Download instead
            </a>
          </div>
        ) : (
          <iframe
            src={pdfUrl}
            className={`w-full h-full border-0 transition-opacity duration-300 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeError(true)}
            title="PDF Preview"
          />
        )}
      </div>
    </div>
  );
}
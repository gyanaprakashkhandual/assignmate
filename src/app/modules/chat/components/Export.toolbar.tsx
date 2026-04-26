"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileDown, Loader2, CheckCircle, ExternalLink, Download, RefreshCw } from "lucide-react";
import { ICustomizations, PaperStyle, IPdfExportResult } from "../../../lib/types/chat.types";
import PdfPreviewPanel from "./Pdf.preview";

interface ExportToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  isExportingPdf: boolean;
  pdfResult: IPdfExportResult | null;
  currentSessionPdfUrl: string | null;
  onExport: (customizations: ICustomizations, paperStyle: PaperStyle) => void;
  onClearPdf: () => void;
  savedCustomizations?: ICustomizations;
  savedPaperStyle?: PaperStyle;
}

const DEFAULT: ICustomizations = {
  inkColor: "#1a1a2e",
  fontSize: 14,
  lineSpacing: 1.5,
  marginLeft: 40,
  marginTop: 30,
};

const INK_SWATCHES = [
  { label: "Navy", value: "#1a1a2e" },
  { label: "Black", value: "#0a0a0a" },
  { label: "Blue", value: "#1e40af" },
  { label: "Grey", value: "#6b7280" },
];

const PAPER_STYLES: { label: string; value: PaperStyle }[] = [
  { label: "Lined", value: "lined" },
  { label: "Plain", value: "plain" },
  { label: "College Ruled", value: "college_ruled" },
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function ExportToolbar({
  isOpen,
  onClose,
  isExportingPdf,
  pdfResult,
  currentSessionPdfUrl,
  onExport,
  onClearPdf,
  savedCustomizations,
  savedPaperStyle,
}: ExportToolbarProps) {
  const [customizations, setCustomizations] = useState<ICustomizations>(savedCustomizations ?? DEFAULT);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>(savedPaperStyle ?? "lined");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (savedCustomizations) setCustomizations(savedCustomizations);
    if (savedPaperStyle) setPaperStyle(savedPaperStyle);
  }, [savedCustomizations, savedPaperStyle]);

  useEffect(() => {
    if (pdfResult) setShowPreview(true);
  }, [pdfResult]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-neutral-900 border-l border-black/8 dark:border-white/8 flex flex-col shadow-2xl z-20"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/8 dark:border-white/8 shrink-0">
            <div className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <h3 className="font-semibold text-sm text-black dark:text-white">Export PDF</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable settings */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-5 space-y-5">

              {/* Paper Style */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Paper Style
                </label>
                <div className="flex gap-1">
                  {PAPER_STYLES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPaperStyle(p.value)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        paperStyle === p.value
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:opacity-80"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ink Color */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Ink Color
                </label>
                <div className="flex items-center gap-2">
                  {INK_SWATCHES.map((s) => (
                    <button
                      key={s.value}
                      title={s.label}
                      onClick={() => setCustomizations((c) => ({ ...c, inkColor: s.value }))}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        customizations.inkColor === s.value
                          ? "border-black dark:border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: s.value }}
                    />
                  ))}
                  <input
                    type="color"
                    value={customizations.inkColor}
                    onChange={(e) => setCustomizations((c) => ({ ...c, inkColor: e.target.value }))}
                    className="w-6 h-6 rounded-full cursor-pointer border-none"
                  />
                </div>
              </div>

              {/* Sliders */}
              {([
                { key: "fontSize" as const, label: "Font Size", min: 10, max: 24, step: 1, suffix: "px" },
                { key: "lineSpacing" as const, label: "Line Spacing", min: 1.0, max: 2.5, step: 0.1, suffix: "×" },
                { key: "marginLeft" as const, label: "Left Margin", min: 20, max: 80, step: 1, suffix: "px" },
                { key: "marginTop" as const, label: "Top Margin", min: 20, max: 60, step: 1, suffix: "px" },
              ]).map((slider) => (
                <div key={slider.key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {slider.label}
                    </label>
                    <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                      {customizations[slider.key]}{slider.suffix}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={customizations[slider.key]}
                    onChange={(e) =>
                      setCustomizations((c) => ({
                        ...c,
                        [slider.key]: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-black dark:accent-white"
                  />
                </div>
              ))}

              {/* Generate button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => onExport(customizations, paperStyle)}
                disabled={isExportingPdf}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-80 disabled:opacity-50 transition"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rendering pages…
                  </>
                ) : pdfResult ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Re-export PDF
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Generate PDF
                  </>
                )}
              </motion.button>

              {/* Export result */}
              <AnimatePresence>
                {pdfResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3.5 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        PDF ready · {formatBytes(pdfResult.fileSize)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={pdfResult.pdfUrl}
                        download
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-medium hover:opacity-80 transition"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                      <a
                        href={pdfResult.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium hover:opacity-80 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Previous export */}
              {!pdfResult && currentSessionPdfUrl && (
                <div className="border border-black/10 dark:border-white/10 rounded-xl p-3.5">
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2 font-medium uppercase tracking-wider">
                    Last Export
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={currentSessionPdfUrl}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:opacity-80 transition"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </a>
                    <a
                      href={currentSessionPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 text-xs font-medium hover:opacity-80 transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* PDF Preview embed */}
            {showPreview && (
              <PdfPreviewPanel
                pdfResult={pdfResult}
                currentSessionPdfUrl={currentSessionPdfUrl}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
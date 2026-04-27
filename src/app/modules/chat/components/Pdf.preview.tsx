"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Eye,
  Loader2,
  FileText,
  Sliders,
  ChevronDown,
  CheckCircle2,
  ImageOff,
} from "lucide-react";
import { useChat } from "@/hooks/useChat.hooks";
import { ICustomizations, PaperStyle } from "@/types/chat.types";

interface PdfPreviewProps {
  sessionId: string;
  messageId?: string; // if provided, renders preview for a specific message
  chatSessionId?: string;
}

// ── Default customization values ──────────────────────────────────────────────
const DEFAULT_CUSTOMIZATIONS: ICustomizations = {
  inkColor: "#1a1a2e",
  fontSize: 16,
  lineSpacing: 1.6,
  marginLeft: 48,
  marginTop: 40,
};

const PAPER_STYLES: {
  value: PaperStyle;
  label: string;
  description: string;
}[] = [
  { value: "lined", label: "Lined", description: "Classic ruled notebook" },
  {
    value: "college_ruled",
    label: "College Ruled",
    description: "Narrow lines, standard",
  },
  { value: "plain", label: "Plain", description: "Blank white page" },
];

// ── Customization panel ───────────────────────────────────────────────────────
function CustomizationPanel({
  customizations,
  onChange,
  paperStyle,
  onPaperStyleChange,
}: {
  customizations: ICustomizations;
  onChange: (c: ICustomizations) => void;
  paperStyle: PaperStyle;
  onPaperStyleChange: (s: PaperStyle) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border-t border-black/8 pt-4 dark:border-white/8">
        {/* Paper style */}
        <div className="mb-4">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
            Paper Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PAPER_STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => onPaperStyleChange(s.value)}
                className={`rounded-xl border px-3 py-2.5 text-left transition-all duration-150 ${
                  paperStyle === s.value
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/10 bg-white/60 text-black/70 hover:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/30"
                }`}
              >
                <p className="text-xs font-medium">{s.label}</p>
                <p
                  className={`mt-0.5 text-[10px] ${paperStyle === s.value ? "text-white/70 dark:text-black/60" : "text-black/40 dark:text-white/40"}`}
                >
                  {s.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Controls grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Ink Color */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
              Ink Color
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-white/5">
              <input
                type="color"
                value={customizations.inkColor}
                onChange={(e) =>
                  onChange({ ...customizations, inkColor: e.target.value })
                }
                className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0 outline-none"
              />
              <span className="font-mono text-xs text-black/60 dark:text-white/50">
                {customizations.inkColor}
              </span>
            </div>
          </div>

          {/* Font size */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
              Font Size — {customizations.fontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={24}
              step={1}
              value={customizations.fontSize}
              onChange={(e) =>
                onChange({ ...customizations, fontSize: +e.target.value })
              }
              className="mt-2 w-full accent-black dark:accent-white"
            />
          </div>

          {/* Line spacing */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
              Line Spacing — {customizations.lineSpacing}×
            </label>
            <input
              type="range"
              min={1.2}
              max={2.4}
              step={0.1}
              value={customizations.lineSpacing}
              onChange={(e) =>
                onChange({ ...customizations, lineSpacing: +e.target.value })
              }
              className="mt-2 w-full accent-black dark:accent-white"
            />
          </div>

          {/* Margin */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
              Left Margin — {customizations.marginLeft}px
            </label>
            <input
              type="range"
              min={24}
              max={96}
              step={4}
              value={customizations.marginLeft}
              onChange={(e) =>
                onChange({ ...customizations, marginLeft: +e.target.value })
              }
              className="mt-2 w-full accent-black dark:accent-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Preview image panel ───────────────────────────────────────────────────────
function PreviewImage({ url }: { url: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-black/8 bg-white shadow-md dark:border-white/8 dark:bg-zinc-900"
    >
      {imgError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-black/30 dark:text-white/30">
          <ImageOff size={28} strokeWidth={1.5} />
          <p className="text-xs">Preview unavailable</p>
        </div>
      ) : (
        <img
          src={url}
          alt="Handwriting preview"
          className="h-auto w-full"
          onError={() => setImgError(true)}
        />
      )}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PdfPreview({
  sessionId,
  messageId,
  chatSessionId,
}: PdfPreviewProps) {
  const [customizations, setCustomizations] = useState<ICustomizations>(
    DEFAULT_CUSTOMIZATIONS,
  );
  const [paperStyle, setPaperStyle] = useState<PaperStyle>("lined");
  const [showCustomize, setShowCustomize] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const {
    previewResult,
    pdfResult,
    isRenderingPreview,
    isExportingPdf,
    preview,
    exportCurrentSessionPdf,
    exportToPdf,
    clearPreview,
    clearPdf,
    error,
    dismissError,
  } = useChat();

  const handlePreview = useCallback(async () => {
    if (!messageId || !chatSessionId) return;
    await preview({
      sessionId,
      messageId,
      chatSessionId,
      customizations,
      paperStyle,
    });
  }, [
    sessionId,
    messageId,
    chatSessionId,
    customizations,
    paperStyle,
    preview,
  ]);

  const handleExport = useCallback(async () => {
    setExportSuccess(false);
    const result = await exportCurrentSessionPdf(customizations, paperStyle);
    if ((result as any)?.payload?.pdfUrl) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }
  }, [exportCurrentSessionPdf, customizations, paperStyle]);

  const handleDownload = useCallback(() => {
    const url = pdfResult?.pdfUrl;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `assignmate-${sessionId}.pdf`;
    a.click();
  }, [pdfResult, sessionId]);

  const previewUrl = previewResult?.previewImageUrl;
  const pdfReady = !!pdfResult?.pdfUrl;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/8 bg-white shadow-sm dark:border-white/8 dark:bg-zinc-900">
          <FileText size={15} className="text-black/60 dark:text-white/50" />
        </div>
        <div>
          <p className="text-sm font-semibold text-black dark:text-white">
            Handwriting Preview
          </p>
          <p className="text-[11px] text-black/40 dark:text-white/35">
            Render &amp; export your assignment
          </p>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-400"
          >
            <span>{error}</span>
            <button
              onClick={dismissError}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customize toggle */}
      <button
        onClick={() => setShowCustomize((p) => !p)}
        className="flex w-full items-center justify-between rounded-xl border border-black/8 bg-white/60 px-4 py-2.5 transition-all hover:bg-white dark:border-white/8 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70">
          <Sliders size={14} />
          Customize
        </div>
        <motion.div
          animate={{ rotate: showCustomize ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-black/40 dark:text-white/35" />
        </motion.div>
      </button>

      <AnimatePresence>
        {showCustomize && (
          <CustomizationPanel
            customizations={customizations}
            onChange={setCustomizations}
            paperStyle={paperStyle}
            onPaperStyleChange={setPaperStyle}
          />
        )}
      </AnimatePresence>

      {/* Preview image */}
      <AnimatePresence>
        {previewUrl && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
              Preview
            </p>
            <PreviewImage url={previewUrl} />
          </div>
        )}
      </AnimatePresence>

      {/* Export success badge */}
      <AnimatePresence>
        {exportSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            <CheckCircle2 size={15} />
            PDF generated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-2.5">
        {/* Preview button — only if messageId provided */}
        {messageId && chatSessionId && (
          <motion.button
            onClick={handlePreview}
            disabled={isRenderingPreview}
            whileTap={{ scale: 0.96 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-2.5 text-sm font-medium text-black/80 shadow-sm transition-all hover:bg-black/4 disabled:opacity-50 dark:border-white/10 dark:bg-white/6 dark:text-white/80 dark:hover:bg-white/12"
          >
            {isRenderingPreview ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Eye size={14} />
            )}
            {isRenderingPreview ? "Rendering…" : "Preview"}
          </motion.button>
        )}

        {/* Export / Download */}
        {pdfReady ? (
          <motion.button
            onClick={handleDownload}
            whileTap={{ scale: 0.96 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          >
            <Download size={14} />
            Download PDF
          </motion.button>
        ) : (
          <motion.button
            onClick={handleExport}
            disabled={isExportingPdf}
            whileTap={{ scale: 0.96 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          >
            {isExportingPdf ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileText size={14} />
            )}
            {isExportingPdf ? "Generating PDF…" : "Export PDF"}
          </motion.button>
        )}
      </div>

      {/* File size info */}
      {pdfResult && (
        <p className="text-center text-[11px] text-black/30 dark:text-white/25">
          {(pdfResult.fileSize / 1024).toFixed(1)} KB · {pdfResult.message}
        </p>
      )}
    </div>
  );
}

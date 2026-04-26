"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wand2,
  Download,
  ZoomIn,
  ZoomOut,
  PenLine,
} from "lucide-react";
import { ICustomizations, PaperStyle, IPreviewResult } from "../../../lib/types/chat.types";

interface HandwritingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  chatSessionId: string;
  sessionId: string;
  isRenderingPreview: boolean;
  previewResult: IPreviewResult | null;
  onRender: (payload: {
    sessionId: string;
    messageId: string;
    chatSessionId: string;
    customizations: ICustomizations;
    paperStyle: PaperStyle;
  }) => void;
  onClearPreview: () => void;
  onSaveSettings?: (customizations: ICustomizations, paperStyle: PaperStyle) => void;
}

const DEFAULT_CUSTOMIZATIONS: ICustomizations = {
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

export default function HandwritingPreviewModal({
  isOpen,
  onClose,
  messageId,
  chatSessionId,
  sessionId,
  isRenderingPreview,
  previewResult,
  onRender,
  onClearPreview,
  onSaveSettings,
}: HandwritingPreviewModalProps) {
  const [customizations, setCustomizations] = useState<ICustomizations>(DEFAULT_CUSTOMIZATIONS);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>("lined");
  const [zoom, setZoom] = useState<"fit" | "actual">("fit");

  const activePreviewUrl =
    previewResult?.messageId === messageId ? previewResult.previewImageUrl : null;

  const handleRender = () => {
    onRender({ sessionId, messageId, chatSessionId, customizations, paperStyle });
  };

  const handleDownload = () => {
    if (!activePreviewUrl) return;
    const a = document.createElement("a");
    a.href = activePreviewUrl;
    a.download = `handwriting-preview-${messageId}.png`;
    a.click();
  };

  useEffect(() => {
    if (!isOpen) onClearPreview();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/8 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 dark:border-white/8">
              <div className="flex items-center gap-2">
                <PenLine className="w-4.5 h-4.5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="font-semibold text-sm text-black dark:text-white">Handwriting Preview</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Left: Controls */}
              <div className="w-72 shrink-0 border-r border-black/8 dark:border-white/8 overflow-y-auto p-5 space-y-6">

                {/* Paper Style */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5">
                    Paper Style
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {PAPER_STYLES.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPaperStyle(p.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          paperStyle === p.value
                            ? "bg-black dark:bg-white text-white dark:text-black font-medium"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:opacity-80"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ink Color */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5">
                    Ink Color
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {INK_SWATCHES.map((s) => (
                      <button
                        key={s.value}
                        title={s.label}
                        onClick={() => setCustomizations((c) => ({ ...c, inkColor: s.value }))}
                        className={`w-7 h-7 rounded-full border-2 transition ${
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
                      className="w-7 h-7 rounded-full cursor-pointer border-none bg-transparent"
                      title="Custom color"
                    />
                  </div>
                </div>

                {/* Sliders */}
                {([
                  { key: "fontSize", label: "Font Size", min: 10, max: 24, step: 1, suffix: "px" },
                  { key: "lineSpacing", label: "Line Spacing", min: 1.0, max: 2.5, step: 0.1, suffix: "×" },
                  { key: "marginLeft", label: "Left Margin", min: 20, max: 80, step: 1, suffix: "px" },
                  { key: "marginTop", label: "Top Margin", min: 20, max: 60, step: 1, suffix: "px" },
                ] as const).map((slider) => (
                  <div key={slider.key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        {slider.label}
                      </label>
                      <span className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
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

                {/* Render Button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleRender}
                  disabled={isRenderingPreview}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-80 disabled:opacity-50 transition"
                >
                  <Wand2 className="w-4 h-4" />
                  {isRenderingPreview ? "Rendering…" : "Render Preview"}
                </motion.button>

                {onSaveSettings && activePreviewUrl && (
                  <button
                    onClick={() => onSaveSettings(customizations, paperStyle)}
                    className="w-full text-sm text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition text-center py-2"
                  >
                    Use these settings for PDF export
                  </button>
                )}
              </div>

              {/* Right: Preview */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Preview toolbar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8 dark:border-white/8">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoom("fit")}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        zoom === "fit"
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-neutral-500 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      Fit
                    </button>
                    <button
                      onClick={() => setZoom("actual")}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        zoom === "actual"
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-neutral-500 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      Actual
                    </button>
                  </div>

                  {activePreviewUrl && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  )}
                </div>

                {/* Preview area */}
                <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950 flex items-start justify-center p-6">
                  {isRenderingPreview ? (
                    <div className="flex flex-col items-center gap-3 mt-20 text-neutral-400 dark:text-neutral-500">
                      <div className="w-10 h-10 rounded-full border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white animate-spin" />
                      <span className="text-sm">Rendering your handwriting…</span>
                    </div>
                  ) : activePreviewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={activePreviewUrl}
                      alt="Handwriting preview"
                      className={`rounded-lg shadow-lg border border-black/10 dark:border-white/10 ${
                        zoom === "fit" ? "max-w-full max-h-full object-contain" : "w-auto"
                      }`}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 mt-20 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <PenLine className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                          Click Render to see your handwriting
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          Configure the settings on the left, then hit Render.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
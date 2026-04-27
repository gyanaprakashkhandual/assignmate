"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, Image as ImageIcon, X,
    AlertCircle, Loader2, CheckCircle2,
    ArrowRight, FileType,
} from "lucide-react";

interface Props {
    uploadedFileUrl: string | null;
    isUploading:     boolean;
    uploadProgress:  number;
    error:           string | null;
    onFileSelect:    (file: File) => void;
    onSheetUpload:   () => void;
    onFontUpload:    (file: File) => void;
    onClearFile:     () => void;
}

export default function Step2Upload({
    uploadedFileUrl,
    isUploading,
    uploadProgress,
    error,
    onFileSelect,
    onSheetUpload,
    onFontUpload,
    onClearFile,
}: Props) {
    const sheetInputRef = useRef<HTMLInputElement>(null);
    const fontInputRef  = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [mode, setMode] = useState<"sheet" | "font">("sheet");

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (!file) return;

            if (mode === "font" && file.name.endsWith(".ttf")) {
                onFontUpload(file);
            } else if (mode === "sheet") {
                onFileSelect(file);
            }
        },
        [mode, onFileSelect, onFontUpload]
    );

    const handleSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    const handleFontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFontUpload(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6"
        >
            {/* Header */}
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                    Upload your handwriting
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Upload the filled template sheet, or if you already generated
                    the font on Calligraphr, upload the TTF file directly.
                </p>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 w-fit">
                {(["sheet", "font"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                            mode === m
                                ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                        }`}
                    >
                        {m === "sheet" ? "Upload Sheet" : "Upload TTF Font"}
                    </button>
                ))}
            </div>

            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
                    isDragging
                        ? "border-black dark:border-white bg-gray-50 dark:bg-gray-900 scale-[1.01]"
                        : uploadedFileUrl && mode === "sheet"
                        ? "border-gray-200 dark:border-gray-800"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
            >
                <AnimatePresence mode="wait">
                    {/* Image preview */}
                    {uploadedFileUrl && mode === "sheet" ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative"
                        >
                            <img
                                src={uploadedFileUrl}
                                alt="Handwriting sheet preview"
                                className="w-full max-h-72 object-contain rounded-2xl"
                            />
                            <button
                                onClick={onClearFile}
                                className="absolute top-3 right-3 w-7 h-7 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:opacity-70 transition"
                            >
                                <X size={13} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-4 py-16 px-6 cursor-pointer"
                            onClick={() =>
                                mode === "font"
                                    ? fontInputRef.current?.click()
                                    : sheetInputRef.current?.click()
                            }
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                {mode === "font"
                                    ? <FileType size={22} className="text-gray-400" />
                                    : <ImageIcon size={22} className="text-gray-400" />
                                }
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-black dark:text-white">
                                    {mode === "font"
                                        ? "Drop your .ttf file here"
                                        : "Drop your filled sheet here"
                                    }
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-600">
                                    {mode === "font"
                                        ? "TTF files only"
                                        : "JPG, PNG or HEIC — max 20MB"
                                    }
                                </p>
                            </div>
                            <span className="text-xs font-medium text-black dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                Browse files
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hidden inputs */}
            <input
                ref={sheetInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSheetChange}
            />
            <input
                ref={fontInputRef}
                type="file"
                accept=".ttf"
                className="hidden"
                onChange={handleFontChange}
            />

            {/* Upload progress */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <Loader2 size={12} className="animate-spin" />
                                Uploading and processing...
                            </span>
                            <span className="text-xs font-mono text-black dark:text-white">
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className="h-1 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-black dark:bg-white rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ ease: "easeOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-xl"
                    >
                        <AlertCircle size={15} className="flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tips */}
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-4 space-y-2">
                <p className="text-xs font-semibold text-black dark:text-white uppercase tracking-widest">
                    Tips for best results
                </p>
                {[
                    "Write naturally — don't try to be neater than usual",
                    "Use the same pen you use every day",
                    "Photograph in daylight, hold the camera directly above",
                    "Make sure all boxes are filled before uploading",
                ].map((tip) => (
                    <div key={tip} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tip}</p>
                    </div>
                ))}
            </div>

            {/* Submit */}
            {mode === "sheet" && (
                <button
                    onClick={onSheetUpload}
                    disabled={!uploadedFileUrl || isUploading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 active:scale-95 transition-all duration-150"
                >
                    {isUploading ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />
                            Processing your handwriting...
                        </>
                    ) : (
                        <>
                            <Upload size={15} />
                            Generate My Handwriting Font
                            <ArrowRight size={14} />
                        </>
                    )}
                </button>
            )}
        </motion.div>
    );
}
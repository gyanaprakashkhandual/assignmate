"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Loader2, ImageIcon, CheckCircle2 } from "lucide-react";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import Image from "next/image";

export default function HandwritingSettings() {
    const { handwritingImage, hasHandwritingImage, uploadImage, removeImage, isLoading, error } = useProfile(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        await uploadImage(file);
        setUploaded(true);
        setTimeout(() => setUploaded(false), 2500);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-lg font-bold text-black">Handwriting Sample</h2>
                <p className="text-sm text-zinc-500 mt-0.5">Upload a clear image of your handwriting. This is used to generate your assignments.</p>
            </div>

            <AnimatePresence mode="wait">
                {hasHandwritingImage && handwritingImage ? (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 aspect-video w-full max-w-lg">
                            <Image
                                src={handwritingImage.url}
                                alt="Handwriting sample"
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-black hover:bg-zinc-50 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Replace
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => removeImage()}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Remove
                            </motion.button>
                        </div>
                        <p className="text-xs text-zinc-400">
                            Uploaded {new Date(handwritingImage.uploadedAt).toLocaleDateString()}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center gap-3 w-full max-w-lg aspect-video rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                                dragOver ? "border-black bg-zinc-50" : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                            }`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                            ) : uploaded ? (
                                <CheckCircle2 className="w-8 h-8 text-black" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                                        <ImageIcon className="w-5 h-5 text-zinc-500" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-black">Drop your image here</p>
                                        <p className="text-xs text-zinc-400 mt-0.5">or click to browse — PNG, JPG up to 10MB</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                    {error}
                </p>
            )}

            <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">Tips for best results</p>
                <ul className="space-y-1">
                    {[
                        "Use a white or plain background",
                        "Write in natural size — not too big or small",
                        "Good lighting, no shadows over the text",
                        "Include a full paragraph for better accuracy",
                    ].map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-xs text-zinc-500">
                            <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
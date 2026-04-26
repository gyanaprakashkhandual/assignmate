"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Loader2, ImageIcon } from "lucide-react";
import { useProfile } from "@/app/hooks/useProfile.hooks";
import { useConfirm } from "@/ui/overlay/confirm/Confirm.context";
import { useAlert } from "@/ui/feedback/alert/Alert.context";
import NextImage from "next/image";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvytvjplt/image/upload";

export default function HandwritingSettings() {
  const {
    handwritingImage,
    hasHandwritingImage,
    uploadImage,
    removeImage,
    isLoading,
  } = useProfile(false);
  const { showConfirm } = useConfirm();
  const { addAlert } = useAlert();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addAlert({
        type: "error",
        title: "Invalid file type",
        message: "Please upload a PNG or JPG image.",
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "test_case_preset");

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      await uploadImage(file, data.secure_url);

      addAlert({
        type: "success",
        title: "Handwriting uploaded",
        message: "Your handwriting sample has been saved successfully.",
        position: "top-right",
        duration: 3000,
      });
    } catch {
      addAlert({
        type: "error",
        title: "Upload failed",
        message: "Something went wrong. Please try again.",
        position: "top-right",
        duration: 5000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    const confirmed = await showConfirm({
      title: "Remove Handwriting Sample",
      message:
        "Are you sure you want to remove your handwriting sample? This may affect assignment generation.",
      confirmText: "Remove",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      await removeImage();
      addAlert({
        type: "success",
        title: "Sample removed",
        message: "Your handwriting sample has been deleted.",
        position: "top-right",
        duration: 3000,
      });
    } catch {
      addAlert({
        type: "error",
        title: "Removal failed",
        message: "Something went wrong. Please try again.",
        position: "top-right",
        duration: 5000,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const busy = isLoading || uploading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-lg font-bold text-black dark:text-white">
          Handwriting Sample
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Upload a clear image of your handwriting. This is used to generate
          your assignments.
        </p>
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
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 aspect-video w-full max-w-lg">
              <NextImage
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
                disabled={busy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                Replace
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRemove}
                disabled={busy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Remove
              </motion.button>
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Uploaded{" "}
              {new Date(handwritingImage.uploadedAt).toLocaleDateString()}
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
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !busy && fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 w-full max-w-lg aspect-video rounded-2xl border-2 border-dashed transition-all
                ${busy ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                ${
                  dragOver
                    ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-800"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
            >
              {busy ? (
                <Loader2 className="w-8 h-8 text-zinc-400 dark:text-zinc-500 animate-spin" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-black dark:text-white">
                      Drop your image here
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      or click to browse — PNG, JPG up to 10MB
                    </p>
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
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 space-y-1.5">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Tips for best results
        </p>
        <ul className="space-y-1">
          {[
            "Use a white or plain background",
            "Write in natural size — not too big or small",
            "Good lighting, no shadows over the text",
            "Include a full paragraph for better accuracy",
          ].map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

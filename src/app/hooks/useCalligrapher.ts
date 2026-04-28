// hooks/useCalligraphr.ts
"use client";

import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import {
    setStep,
    setUploadedFileUrl,
    clearUploadedFile,
    setUploading,
    setFontResult,
    setError,
    resetCalligraphr,
} from "@/app/lib/features/calligrapher/calligrapher.slice";
import {
    uploadHandwritingSheet,
    uploadFontFile,
    downloadTemplate,
} from "@/app/lib/apis/calligrapher.api";

export function useCalligraphr() {
    const dispatch = useDispatch();
    const state    = useSelector((s: RootState) => s.calligrapher);

    // File object lives in a ref — never goes into Redux
    const fileRef = useRef<File | null>(null);

    const [uploadProgress, setUploadProgress] = useState(0);

    // ── Step 1: open Calligraphr template ────────────────────────────────────
    const handleDownloadTemplate = useCallback(() => {
        downloadTemplate();
        setTimeout(() => dispatch(setStep(2)), 800);
    }, [dispatch]);

    // ── Step 2a: user selects their filled handwriting image ─────────────────
    const handleFileSelect = useCallback(
        (file: File) => {
            // Store File in ref (not Redux)
            fileRef.current = file;
            // Store only the preview URL string in Redux
            const previewUrl = URL.createObjectURL(file);
            dispatch(setUploadedFileUrl(previewUrl));
            dispatch(setError(""));
        },
        [dispatch]
    );

    // ── Clear selected file ───────────────────────────────────────────────────
    const handleClearFile = useCallback(() => {
        fileRef.current = null;
        dispatch(clearUploadedFile());
    }, [dispatch]);

    // ── Step 2b: upload the filled sheet ─────────────────────────────────────
    const handleSheetUpload = useCallback(async () => {
        if (!fileRef.current) {
            dispatch(setError("Please select your filled handwriting sheet first."));
            return;
        }

        dispatch(setUploading(true));
        setUploadProgress(0);

        try {
            const result = await uploadHandwritingSheet(
                fileRef.current,
                (pct) => setUploadProgress(pct)
            );

            dispatch(
                setFontResult({
                    fontUrl:  result.fontUrl,
                    publicId: result.publicId,
                })
            );
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error ? err.message : "Upload failed. Please try again."
                )
            );
        }
    }, [dispatch]);

    // ── Alternative: user uploads TTF directly ───────────────────────────────
    const handleFontUpload = useCallback(
        async (file: File) => {
            // TTF File also stays out of Redux
            dispatch(setUploading(true));
            try {
                const result = await uploadFontFile(file);
                dispatch(
                    setFontResult({
                        fontUrl:  result.fontUrl,
                        publicId: result.publicId,
                    })
                );
            } catch (err) {
                dispatch(
                    setError(
                        err instanceof Error ? err.message : "Font upload failed."
                    )
                );
            }
        },
        [dispatch]
    );

    const handleReset = useCallback(() => {
        fileRef.current = null;
        dispatch(resetCalligraphr());
    }, [dispatch]);

    const goToStep = useCallback(
        (s: 1 | 2 | 3) => dispatch(setStep(s)),
        [dispatch]
    );

    return {
        ...state,
        uploadProgress,
        handleDownloadTemplate,
        handleFileSelect,
        handleSheetUpload,
        handleFontUpload,
        handleClearFile,
        handleReset,
        goToStep,
    };
}
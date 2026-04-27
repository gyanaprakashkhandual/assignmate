// hooks/useCalligraphr.ts
"use client";

import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import {
    setStep,
    setUploadedFile,
    setUploading,
    setFontResult,
    setError,
    resetCalligraphr,
} from "@/app/lib/features/calligrapher/calligrapher.slice";
import {
    uploadHandwritingSheet,
    uploadFontFile,
    downloadTemplate,
} from "@/app/lib/types/caliligrapher.types";

export function useCalligraphr() {
    const dispatch = useDispatch();
    const state    = useSelector((s: RootState) => s.calligraphr);
    const [uploadProgress, setUploadProgress] = useState(0);

    // ── Step 1: open Calligraphr template ────────────────────────────────────
    const handleDownloadTemplate = useCallback(() => {
        downloadTemplate();
        // Auto advance after short delay so user sees the action
        setTimeout(() => dispatch(setStep(2)), 800);
    }, [dispatch]);

    // ── Step 2a: user selects their filled handwriting image ─────────────────
    const handleFileSelect = useCallback(
        (file: File) => {
            const url = URL.createObjectURL(file);
            dispatch(setUploadedFile({ file, url }));
            dispatch(setError(""));
        },
        [dispatch]
    );

    // ── Step 2b: upload the filled sheet ─────────────────────────────────────
    const handleSheetUpload = useCallback(async () => {
        if (!state.uploadedFile) {
            dispatch(setError("Please select your filled handwriting sheet first."));
            return;
        }

        dispatch(setUploading(true));
        setUploadProgress(0);

        try {
            const result = await uploadHandwritingSheet(
                state.uploadedFile,
                (pct) => setUploadProgress(pct)
            );

            dispatch(
                setFontResult({
                    fontUrl:  result.data.fontUrl,
                    publicId: result.data.publicId,
                })
            );
        } catch (err) {
            dispatch(
                setError(
                    err instanceof Error ? err.message : "Upload failed. Please try again."
                )
            );
        }
    }, [dispatch, state.uploadedFile]);

    // ── Alternative: user uploads TTF directly from Calligraphr ─────────────
    const handleFontUpload = useCallback(
        async (file: File) => {
            dispatch(setUploading(true));
            try {
                const result = await uploadFontFile(file);
                dispatch(
                    setFontResult({
                        fontUrl:  result.data.fontUrl,
                        publicId: result.data.publicId,
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

    const handleReset  = useCallback(() => dispatch(resetCalligraphr()), [dispatch]);
    const goToStep     = useCallback((s: 1 | 2 | 3) => dispatch(setStep(s)), [dispatch]);

    return {
        ...state,
        uploadProgress,
        handleDownloadTemplate,
        handleFileSelect,
        handleSheetUpload,
        handleFontUpload,
        handleReset,
        goToStep,
    };
}
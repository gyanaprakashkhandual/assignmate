// store/slices/calligraphrSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICalligraphrState, CalligraphrStep } from "../../types/caliligrapher.types";

// File object is NOT stored here — only serializable primitives
const initialState: ICalligraphrState = {
    currentStep:     1,
    templateUrl:     null,
    uploadedFileUrl: null,   // only the object URL string
    fontUrl:         null,
    fontPublicId:    null,
    isUploading:     false,
    isProcessing:    false,
    isComplete:      false,
    error:           null,
    previewSentence: "The quick brown fox jumps over the lazy dog",
};

const calligraphrSlice = createSlice({
    name: "calligraphr",
    initialState,
    reducers: {
        setStep(state, action: PayloadAction<CalligraphrStep>) {
            state.currentStep = action.payload;
            state.error       = null;
        },
        // Only store the preview URL string — never the File object
        setUploadedFileUrl(state, action: PayloadAction<string>) {
            state.uploadedFileUrl = action.payload;
        },
        clearUploadedFile(state) {
            state.uploadedFileUrl = null;
        },
        setUploading(state, action: PayloadAction<boolean>) {
            state.isUploading = action.payload;
        },
        setProcessing(state, action: PayloadAction<boolean>) {
            state.isProcessing = action.payload;
        },
        setFontResult(state, action: PayloadAction<{ fontUrl: string; publicId: string }>) {
            state.fontUrl      = action.payload.fontUrl;
            state.fontPublicId = action.payload.publicId;
            state.isComplete   = true;
            state.isUploading  = false;
            state.isProcessing = false;
            state.currentStep  = 3;
        },
        setError(state, action: PayloadAction<string>) {
            state.error        = action.payload;
            state.isUploading  = false;
            state.isProcessing = false;
        },
        setPreviewSentence(state, action: PayloadAction<string>) {
            state.previewSentence = action.payload;
        },
        resetCalligraphr() {
            return initialState;
        },
    },
});

export const {
    setStep,
    setUploadedFileUrl,
    clearUploadedFile,
    setUploading,
    setProcessing,
    setFontResult,
    setError,
    setPreviewSentence,
    resetCalligraphr,
} = calligraphrSlice.actions;

export default calligraphrSlice.reducer;
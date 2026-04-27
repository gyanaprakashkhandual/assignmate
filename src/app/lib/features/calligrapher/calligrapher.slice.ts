// store/slices/calligraphrSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICalligraphrState, CalligraphrStep } from "../../types/caliligrapher.types";

const initialState: ICalligraphrState = {
    currentStep:     1,
    templateUrl:     null,
    uploadedFile:    null,
    uploadedFileUrl: null,
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
        setUploadedFile(state, action: PayloadAction<{ file: File; url: string }>) {
            state.uploadedFile    = action.payload.file;
            state.uploadedFileUrl = action.payload.url;
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
    setUploadedFile,
    setUploading,
    setProcessing,
    setFontResult,
    setError,
    setPreviewSentence,
    resetCalligraphr,
} = calligraphrSlice.actions;

export default calligraphrSlice.reducer;
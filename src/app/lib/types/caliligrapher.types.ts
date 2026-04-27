export type CalligraphrStep = 1 | 2 | 3;

export interface ICalligraphrState {
    currentStep: CalligraphrStep;
    templateUrl: string | null;
    uploadedFile: File | null;
    uploadedFileUrl: string | null;
    fontUrl: string | null;
    fontPublicId: string | null;
    isUploading: boolean;
    isProcessing: boolean;
    isComplete: boolean;
    error: string | null;
    previewSentence: string;
}

export interface IUploadHandwritingResponse {
    success: boolean;
    data: {
        fontUrl: string;
        publicId: string;
        imageUrl: string;
        message: string;
    };
}

export interface IFontUploadResponse {
    success: boolean;
    data: {
        fontUrl: string;
        publicId: string;
        message: string;
    };
}
// types/calligraphr.types.ts

export type CalligraphrStep = 1 | 2 | 3;

export interface ICalligraphrState {
    currentStep:     CalligraphrStep;
    templateUrl:     string | null;
    uploadedFileUrl: string | null;  // only the object URL string, never a File
    fontUrl:         string | null;
    fontPublicId:    string | null;
    isUploading:     boolean;
    isProcessing:    boolean;
    isComplete:      boolean;
    error:           string | null;
    previewSentence: string;
}

export interface IUploadHandwritingResponse {
    success: boolean;
    data: {
        fontUrl:  string;
        publicId: string;
        imageUrl: string;
        message:  string;
    };
}

export interface IFontUploadResponse {
    success: boolean;
    data: {
        fontUrl:  string;
        publicId: string;
        message:  string;
    };
}
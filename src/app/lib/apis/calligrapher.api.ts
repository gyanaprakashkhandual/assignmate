/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../api";
import { IUploadHandwritingResponse, IFontUploadResponse } from "../types/caliligrapher.types";

const HANDWRITING_BASE = "/handwriting";

/*** Download the Calligraphr template PDF/PNG */
export async function downloadTemplate(): Promise<void> {
    // Redirects to the Calligraphr template download page
    window.open("https://www.calligraphr.com/en/webapp/app_home/?templates", "_blank");
}

/*** Upload the user's filled handwriting sheet → backend processes it */
export async function uploadHandwritingSheet(
    file: File,
    onProgress?: (pct: number) => void
): Promise<IUploadHandwritingResponse> {
    const formData = new FormData();
    formData.append("handwritingSheet", file);

    const response = await api.post<{ success: boolean; data: IUploadHandwritingResponse }>(
        `${HANDWRITING_BASE}/upload-sheet`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.lengthComputable && onProgress) {
                    const percentComplete = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    onProgress(percentComplete);
                }
            },
        }
    );

    return response.data.data;
}

/*** Upload a TTF font file directly */
export async function uploadFontFile(
    file: File
): Promise<IFontUploadResponse> {
    const formData = new FormData();
    formData.append("font", file);

    const response = await api.post<{ success: boolean; data: IFontUploadResponse }>(
        `${HANDWRITING_BASE}/upload-font`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.data;
}

/*** Get the current user's handwriting profile */
export async function getHandwritingProfile(): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>(
        `${HANDWRITING_BASE}/profile`
    );
    return response.data.data;
}
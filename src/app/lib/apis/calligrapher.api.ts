// services/calligraphr.api.ts
import { IUploadHandwritingResponse, IFontUploadResponse } from "../types/caliligrapher.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;
    return {
        Authorization: token ? `Bearer ${token}` : "",
    };
}

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
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("handwritingSheet", file);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                try {
                    const err = JSON.parse(xhr.responseText);
                    reject(new Error(err.message || "Upload failed"));
                } catch {
                    reject(new Error("Upload failed"));
                }
            }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));

        xhr.open("POST", `${BASE_URL}/handwriting/upload-sheet`);
        const headers = getAuthHeaders();
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v as string));
        xhr.send(formData);
    });
}

/*** Upload a TTF font file directly */
export async function uploadFontFile(
    file: File
): Promise<IFontUploadResponse> {
    const formData = new FormData();
    formData.append("font", file);

    const res = await fetch(`${BASE_URL}/handwriting/upload-font`, {
        method:  "POST",
        headers: getAuthHeaders(),
        body:    formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Font upload failed" }));
        throw new Error(err.message || "Font upload failed");
    }

    return res.json();
}

/*** Get the current user's handwriting profile */
export async function getHandwritingProfile() {
    const res = await fetch(`${BASE_URL}/handwriting/profile`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}
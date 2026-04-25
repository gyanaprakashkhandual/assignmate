import api from "../api";
import { IProfile, CreateProfilePayload, UpdateProfilePayload, IHandwritingImage } from "../types/profile.types";

const PROFILE_BASE = "/profile";

export const profileApi = {
    getMyProfile: async (): Promise<IProfile> => {
        const response = await api.get<{ success: boolean; data: IProfile }>(`${PROFILE_BASE}/me`);
        return response.data.data;
    },

    createProfile: async (payload: CreateProfilePayload): Promise<IProfile> => {
        const response = await api.post<{ success: boolean; data: IProfile }>(PROFILE_BASE, payload);
        return response.data.data;
    },

    updateProfile: async (payload: UpdateProfilePayload): Promise<IProfile> => {
        const response = await api.patch<{ success: boolean; data: IProfile }>(
            `${PROFILE_BASE}/me`,
            payload
        );
        return response.data.data;
    },

    deleteProfile: async (): Promise<void> => {
        await api.delete(`${PROFILE_BASE}/me`);
    },

    getProfileByUsername: async (username: string): Promise<IProfile> => {
        const response = await api.get<{ success: boolean; data: IProfile }>(
            `${PROFILE_BASE}/username/${username}`
        );
        return response.data.data;
    },

    uploadHandwritingImage: async (file: File): Promise<IHandwritingImage> => {
        const formData = new FormData();
        formData.append("handwritingImage", file);

        const response = await api.post<{ success: boolean; data: IHandwritingImage }>(
            `${PROFILE_BASE}/me/handwriting`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data.data;
    },

    deleteHandwritingImage: async (): Promise<void> => {
        await api.delete(`${PROFILE_BASE}/me/handwriting`);
    },
};
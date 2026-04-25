import api from "../api";
import { IUser, UpdateUserPayload, LinkedProvider } from "../types/user.types";

const AUTH_BASE = "/auth";
const USER_BASE = "/user";

export const userApi = {
    getMe: async (): Promise<IUser> => {
        const response = await api.get<{ success: boolean; data: IUser }>(`${USER_BASE}/me`);
        return response.data.data;
    },

    updateMe: async (payload: UpdateUserPayload): Promise<IUser> => {
        const response = await api.patch<{ success: boolean; data: IUser }>(`${USER_BASE}/me`, payload);
        return response.data.data;
    },

    deleteMe: async (): Promise<void> => {
        await api.delete(`${USER_BASE}/me`);
    },

    getLinkedProviders: async (): Promise<LinkedProvider[]> => {
        const response = await api.get<{ success: boolean; data: LinkedProvider[] }>(
            `${USER_BASE}/me/providers`
        );
        return response.data.data;
    },

    unlinkProvider: async (provider: "google" | "github"): Promise<void> => {
        await api.delete(`${USER_BASE}/me/providers/${provider}`);
    },

    getUserById: async (id: string): Promise<IUser> => {
        const response = await api.get<{ success: boolean; data: IUser }>(`${USER_BASE}/${id}`);
        return response.data.data;
    },

    initiateGoogleAuth: (): void => {
        window.location.href = `http://localhost:5000/api${AUTH_BASE}/google`;
    },

    initiateGithubAuth: (): void => {
        window.location.href = `http://localhost:5000/api${AUTH_BASE}/github`;
    },

    logout: async (): Promise<void> => {
        await api.post(`${AUTH_BASE}/logout`);
    },
};
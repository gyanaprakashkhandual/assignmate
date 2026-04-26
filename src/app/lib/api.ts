/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { clearUser } from "./features/user/user.slice";
import { clearProfile } from "./features/profile/profile.slice";

const BASE_URL = "http://localhost:5000/api";

let _store: ReturnType<typeof import("./store").store.getState> extends infer S
    ? { getState: () => S; dispatch: (action: any) => any }
    : never;

export function injectStore(store: typeof _store) {
    _store = store;
}

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // ✅ _store accessed at request time, not at module init
        const token = _store?.getState()?.auth?.token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const wasAuthenticated = _store?.getState()?.auth?.isAuthenticated;

            if (wasAuthenticated) {
                _store?.dispatch(clearUser());
                _store?.dispatch(clearProfile());

                if (typeof window !== "undefined") {
                    window.location.href = "/auth";
                }
            }
            // ❌ REMOVE the else block entirely — don't dispatch clearUser() here
            // fetchMe's own .rejected handler already sets isChecked: true
        }

        const message =
            (error.response?.data as { message?: string })?.message ??
            error.message ??
            "An unexpected error occurred";

        return Promise.reject(new Error(message));
    }
);
export default api;
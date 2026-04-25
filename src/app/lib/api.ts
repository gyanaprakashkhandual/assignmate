import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "./store";
import { clearUser } from "./features/user/user.slice";
import { clearProfile } from "./features/profile/profile.slice";

const BASE_URL = "http://localhost:5000/api";

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
        const state = store.getState();
        const token = state.auth?.token;

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
            store.dispatch(clearUser());
            store.dispatch(clearProfile());

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        const message =
            (error.response?.data as { message?: string })?.message ??
            error.message ??
            "An unexpected error occurred";

        return Promise.reject(new Error(message));
    }
);

export default api;
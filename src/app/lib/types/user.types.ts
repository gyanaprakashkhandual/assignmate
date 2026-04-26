/* eslint-disable @typescript-eslint/no-explicit-any */
export type OAuthProvider = "google" | "github";

export interface IOAuthProfile {
    provider: OAuthProvider;
    providerId: string;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface OAuthCallbackUser extends IUser {
    isNewUser: boolean;
}

export interface UpdateUserPayload {
    name?: string;
    avatar?: string;
}

export interface LinkedProvider {
    provider: OAuthProvider;
    providerId: string;
}

export interface AuthState {
    token: any;
    user: IUser | null;
    providers: LinkedProvider[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isChecked: boolean;
}
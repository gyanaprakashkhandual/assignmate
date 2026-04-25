import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectAuthState = (state: RootState) => state.auth;

export const selectUser = createSelector(selectAuthState, (auth) => auth.user);
export const selectIsAuthenticated = createSelector(selectAuthState, (auth) => auth.isAuthenticated);
export const selectAuthLoading = createSelector(selectAuthState, (auth) => auth.isLoading);
export const selectAuthError = createSelector(selectAuthState, (auth) => auth.error);
export const selectLinkedProviders = createSelector(selectAuthState, (auth) => auth.providers);
export const selectUserId = createSelector(selectUser, (user) => user?._id ?? null);
export const selectUserName = createSelector(selectUser, (user) => user?.name ?? null);
export const selectUserEmail = createSelector(selectUser, (user) => user?.email ?? null);
export const selectUserAvatar = createSelector(selectUser, (user) => user?.avatar ?? null);
export const selectIsProviderLinked = (provider: "google" | "github") =>
    createSelector(selectLinkedProviders, (providers) =>
        providers.some((p) => p.provider === provider)
    );
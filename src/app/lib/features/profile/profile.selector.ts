import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectProfileState = (state: RootState) => state.profile;

export const selectProfile = createSelector(selectProfileState, (p) => p.profile);
export const selectProfileLoading = createSelector(selectProfileState, (p) => p.isLoading);
export const selectProfileError = createSelector(selectProfileState, (p) => p.error);
export const selectUsername = createSelector(selectProfile, (profile) => profile?.username ?? null);
export const selectNickname = createSelector(selectProfile, (profile) => profile?.nickname ?? null);
export const selectDesignation = createSelector(selectProfile, (profile) => profile?.designation ?? null);
export const selectAge = createSelector(selectProfile, (profile) => profile?.age ?? null);
export const selectHandwritingImage = createSelector(
    selectProfile,
    (profile) => profile?.handwritingImage ?? null
);
export const selectHasHandwritingImage = createSelector(
    selectProfile,
    (profile) => !!profile?.handwritingImage
);
export const selectHasProfile = createSelector(selectProfile, (profile) => profile !== null);
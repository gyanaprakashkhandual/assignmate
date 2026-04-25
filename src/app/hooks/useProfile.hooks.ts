/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
    fetchMyProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    uploadHandwritingImage,
    deleteHandwritingImage,
    clearProfileError,
} from "../lib/features/profile/profile.slice";
import {
    selectProfile,
    selectProfileLoading,
    selectProfileError,
    selectUsername,
    selectNickname,
    selectDesignation,
    selectAge,
    selectHandwritingImage,
    selectHasHandwritingImage,
    selectHasProfile,
} from "../lib/features/profile/profile.selector";
import { CreateProfilePayload, UpdateProfilePayload } from "../lib/types/profile.types";

export const useProfile = (autoFetch = true) => {
    const dispatch = useAppDispatch();

    const profile = useAppSelector(selectProfile);
    const isLoading = useAppSelector(selectProfileLoading);
    const error = useAppSelector(selectProfileError);
    const username = useAppSelector(selectUsername);
    const nickname = useAppSelector(selectNickname);
    const designation = useAppSelector(selectDesignation);
    const age = useAppSelector(selectAge);
    const handwritingImage = useAppSelector(selectHandwritingImage);
    const hasHandwritingImage = useAppSelector(selectHasHandwritingImage);
    const hasProfile = useAppSelector(selectHasProfile);

    useEffect(() => {
        if (autoFetch && !profile) {
            dispatch(fetchMyProfile());
        }
    }, [autoFetch]);

    const refetch = () => dispatch(fetchMyProfile());

    const create = (payload: CreateProfilePayload) => dispatch(createProfile(payload));

    const update = (payload: UpdateProfilePayload) => dispatch(updateProfile(payload));

    const remove = () => dispatch(deleteProfile());

    const uploadImage = (file: File) => dispatch(uploadHandwritingImage(file));

    const removeImage = () => dispatch(deleteHandwritingImage());

    const dismissError = () => dispatch(clearProfileError());

    return {
        profile,
        isLoading,
        error,
        username,
        nickname,
        designation,
        age,
        handwritingImage,
        hasHandwritingImage,
        hasProfile,
        refetch,
        create,
        update,
        remove,
        uploadImage,
        removeImage,
        dismissError,
    };
};
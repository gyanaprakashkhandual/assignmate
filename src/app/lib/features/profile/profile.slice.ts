import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "../../apis/profile.api";
import { ProfileState, IProfile, CreateProfilePayload, UpdateProfilePayload, IHandwritingImage } from "../../types/profile.types";

const initialState: ProfileState = {
    profile: null,
    isLoading: false,
    error: null,
};

export const fetchMyProfile = createAsyncThunk<IProfile, void, { rejectValue: string }>(
    "profile/fetchMyProfile",
    async (_, { rejectWithValue }) => {
        try {
            return await profileApi.getMyProfile();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const createProfile = createAsyncThunk<IProfile, CreateProfilePayload, { rejectValue: string }>(
    "profile/createProfile",
    async (payload, { rejectWithValue }) => {
        try {
            return await profileApi.createProfile(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateProfile = createAsyncThunk<IProfile, UpdateProfilePayload, { rejectValue: string }>(
    "profile/updateProfile",
    async (payload, { rejectWithValue }) => {
        try {
            return await profileApi.updateProfile(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteProfile = createAsyncThunk<void, void, { rejectValue: string }>(
    "profile/deleteProfile",
    async (_, { rejectWithValue }) => {
        try {
            await profileApi.deleteProfile();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const uploadHandwritingImage = createAsyncThunk<IHandwritingImage, File, { rejectValue: string }>(
    "profile/uploadHandwritingImage",
    async (file, { rejectWithValue }) => {
        try {
            return await profileApi.uploadHandwritingImage(file);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteHandwritingImage = createAsyncThunk<void, void, { rejectValue: string }>(
    "profile/deleteHandwritingImage",
    async (_, { rejectWithValue }) => {
        try {
            await profileApi.deleteHandwritingImage();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfile(state) {
            state.profile = null;
            state.error = null;
        },
        clearProfileError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to fetch profile";
            })

            .addCase(createProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to create profile";
            })

            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to update profile";
            })

            .addCase(deleteProfile.fulfilled, (state) => {
                state.profile = null;
                state.isLoading = false;
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.error = action.payload ?? "Failed to delete profile";
            })

            .addCase(uploadHandwritingImage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(uploadHandwritingImage.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.profile) {
                    state.profile.handwritingImage = action.payload;
                }
            })
            .addCase(uploadHandwritingImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to upload handwriting image";
            })

            .addCase(deleteHandwritingImage.fulfilled, (state) => {
                if (state.profile) {
                    state.profile.handwritingImage = undefined;
                }
            })
            .addCase(deleteHandwritingImage.rejected, (state, action) => {
                state.error = action.payload ?? "Failed to delete handwriting image";
            });
    },
});

export const { clearProfile, clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
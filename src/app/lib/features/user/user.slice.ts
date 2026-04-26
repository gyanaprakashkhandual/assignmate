import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "../../apis/user.api";
import { AuthState, IUser, UpdateUserPayload, LinkedProvider } from "../../types/user.types";

const initialState: AuthState = {
    user: null,
    providers: [],
    isAuthenticated: false,
    isLoading: false,
    isChecked: false,
    error: null,
};

export const fetchMe = createAsyncThunk<IUser, void, { rejectValue: string }>(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            return await userApi.getMe();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateMe = createAsyncThunk<IUser, UpdateUserPayload, { rejectValue: string }>(
    "auth/updateMe",
    async (payload, { rejectWithValue }) => {
        try {
            return await userApi.updateMe(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteMe = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/deleteMe",
    async (_, { rejectWithValue }) => {
        try {
            await userApi.deleteMe();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchLinkedProviders = createAsyncThunk<LinkedProvider[], void, { rejectValue: string }>(
    "auth/fetchLinkedProviders",
    async (_, { rejectWithValue }) => {
        try {
            return await userApi.getLinkedProviders();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const unlinkProvider = createAsyncThunk<
    "google" | "github",
    "google" | "github",
    { rejectValue: string }
>(
    "auth/unlinkProvider",
    async (provider, { rejectWithValue }) => {
        try {
            await userApi.unlinkProvider(provider);
            return provider;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await userApi.logout();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            state.isChecked = true;
        },
        clearUser(state) {
            state.user = null;
            state.providers = [];
            state.isAuthenticated = false;
            state.error = null;
            state.isChecked = true;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isChecked = true;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.isChecked = true;
                state.error = action.payload ?? "Failed to fetch user";
            })

            .addCase(updateMe.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateMe.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Failed to update user";
            })

            .addCase(deleteMe.fulfilled, (state) => {
                state.user = null;
                state.providers = [];
                state.isAuthenticated = false;
                state.isChecked = true;
            })
            .addCase(deleteMe.rejected, (state, action) => {
                state.error = action.payload ?? "Failed to delete account";
            })

            .addCase(fetchLinkedProviders.fulfilled, (state, action) => {
                state.providers = action.payload;
            })

            .addCase(unlinkProvider.fulfilled, (state, action) => {
                state.providers = state.providers.filter((p) => p.provider !== action.payload);
            })
            .addCase(unlinkProvider.rejected, (state, action) => {
                state.error = action.payload ?? "Failed to unlink provider";
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.providers = [];
                state.isAuthenticated = false;
                state.error = null;
                state.isChecked = true;
            });
    },
});

export const { setUser, clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;
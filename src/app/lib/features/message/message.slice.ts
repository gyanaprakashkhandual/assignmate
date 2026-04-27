import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { messageApi } from "../../apis/message.api";
import {
    IMessageResponse,
    IMessageListResult,
    IGetMessagesBySessionPayload,
    IGetMessageByIdPayload,
    IDeleteMessagePayload,
} from "../../types/message.types";

interface MessageState {
    messages: IMessageResponse[];
    currentMessage: IMessageResponse | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    isLoading: boolean;
    isFetchingOne: boolean;
    isDeleting: boolean;
    error: string | null;
}

const initialState: MessageState = {
    messages: [],
    currentMessage: null,
    pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
    isLoading: false,
    isFetchingOne: false,
    isDeleting: false,
    error: null,
};

export const fetchMessagesBySession = createAsyncThunk<
    IMessageListResult,
    IGetMessagesBySessionPayload
>("messages/fetchBySession", async (payload, { rejectWithValue }) => {
    try {
        return await messageApi.getBySession(payload);
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message ?? "Failed to fetch messages");
    }
});

export const fetchMessageById = createAsyncThunk<
    IMessageResponse,
    IGetMessageByIdPayload
>("messages/fetchById", async (payload, { rejectWithValue }) => {
    try {
        return await messageApi.getById(payload);
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message ?? "Failed to fetch message");
    }
});

export const deleteMessage = createAsyncThunk<
    string,
    IDeleteMessagePayload
>("messages/delete", async (payload, { rejectWithValue }) => {
    try {
        await messageApi.delete(payload);
        return payload.messageId;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message ?? "Failed to delete message");
    }
});

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearMessageError(state) {
            state.error = null;
        },
        clearMessages(state) {
            state.messages = [];
            state.pagination = initialState.pagination;
        },
        clearCurrentMessage(state) {
            state.currentMessage = null;
        },
        appendMessage(state, action: PayloadAction<IMessageResponse>) {
            state.messages.push(action.payload);
            state.pagination.total += 1;
        },
        resetMessages() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessagesBySession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessagesBySession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload.messages;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchMessagesBySession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchMessageById.pending, (state) => {
                state.isFetchingOne = true;
                state.error = null;
            })
            .addCase(fetchMessageById.fulfilled, (state, action) => {
                state.isFetchingOne = false;
                state.currentMessage = action.payload;
            })
            .addCase(fetchMessageById.rejected, (state, action) => {
                state.isFetchingOne = false;
                state.error = action.payload as string;
            })

            .addCase(deleteMessage.pending, (state) => {
                state.isDeleting = true;
                state.error = null;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.messages = state.messages.filter((m) => m.id !== action.payload);
                if (state.currentMessage?.id === action.payload) {
                    state.currentMessage = null;
                }
                state.pagination.total = Math.max(0, state.pagination.total - 1);
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearMessageError,
    clearMessages,
    clearCurrentMessage,
    appendMessage,
    resetMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../../apis/chat.api";
import {
    ChatState,
    ICreateSessionPayload,
    ISendMessagePayload,
    IRenderPreviewPayload,
    IExportPdfPayload,
    IUpdateSessionPayload,
    IDeleteSessionPayload,
    ISearchSessionsPayload,
} from "../../types/chat.types";

const initialState: ChatState = {
    sessions: [],
    currentSession: null,
    messages: [],
    stats: null,
    pagination: null,
    previewResult: null,
    pdfResult: null,
    isLoading: false,
    isSendingMessage: false,
    isRenderingPreview: false,
    isExportingPdf: false,
    error: null,
};

export const createSession = createAsyncThunk(
    "chat/createSession",
    async (payload: ICreateSessionPayload, { rejectWithValue }) => {
        try {
            return await chatApi.createSession(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const listSessions = createAsyncThunk(
    "chat/listSessions",
    async (params: ISearchSessionsPayload | undefined, { rejectWithValue }) => {
        try {
            return await chatApi.listSessions(params);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchStats = createAsyncThunk(
    "chat/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            return await chatApi.getStats();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchSession = createAsyncThunk(
    "chat/fetchSession",
    async (sessionId: string, { rejectWithValue }) => {
        try {
            return await chatApi.getSession(sessionId);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateSession = createAsyncThunk(
    "chat/updateSession",
    async (payload: IUpdateSessionPayload, { rejectWithValue }) => {
        try {
            return await chatApi.updateSession(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteSession = createAsyncThunk(
    "chat/deleteSession",
    async (payload: IDeleteSessionPayload, { rejectWithValue }) => {
        try {
            await chatApi.deleteSession(payload);
            return payload.sessionId;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (payload: ISendMessagePayload, { rejectWithValue }) => {
        try {
            return await chatApi.sendMessage(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const renderPreview = createAsyncThunk(
    "chat/renderPreview",
    async (payload: IRenderPreviewPayload, { rejectWithValue }) => {
        try {
            return await chatApi.renderPreview(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const exportPdf = createAsyncThunk(
    "chat/exportPdf",
    async (payload: IExportPdfPayload, { rejectWithValue }) => {
        try {
            return await chatApi.exportPdf(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChatError(state) {
            state.error = null;
        },
        clearCurrentSession(state) {
            state.currentSession = null;
            state.messages = [];
        },
        clearMessages(state) {
            state.messages = [];
        },
        clearPreviewResult(state) {
            state.previewResult = null;
        },
        clearPdfResult(state) {
            state.pdfResult = null;
        },
        resetChat() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions.unshift(action.payload);
                state.currentSession = action.payload;
            })
            .addCase(createSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(listSessions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(listSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = action.payload.sessions;
                state.pagination = action.payload.pagination;
            })
            .addCase(listSessions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSession = action.payload;
            })
            .addCase(fetchSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(updateSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateSession.fulfilled, (state, action) => {
                state.isLoading = false;
                const idx = state.sessions.findIndex((s) => s.id === action.payload.id);
                if (idx !== -1) state.sessions[idx] = action.payload;
                if (state.currentSession?.id === action.payload.id) {
                    state.currentSession = action.payload;
                }
            })
            .addCase(updateSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = state.sessions.filter((s) => s.id !== action.payload);
                if (state.currentSession?.id === action.payload) {
                    state.currentSession = null;
                    state.messages = [];
                }
            })
            .addCase(deleteSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(sendMessage.pending, (state) => {
                state.isSendingMessage = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isSendingMessage = false;
                state.messages.push(...action.payload);
                if (state.currentSession) {
                    state.currentSession.messageCount += action.payload.length;
                    state.currentSession.lastMessageAt = action.payload[action.payload.length - 1].metadata.timestamp;
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isSendingMessage = false;
                state.error = action.payload as string;
            })

            .addCase(renderPreview.pending, (state) => {
                state.isRenderingPreview = true;
                state.error = null;
            })
            .addCase(renderPreview.fulfilled, (state, action) => {
                state.isRenderingPreview = false;
                state.previewResult = action.payload;
                const msg = state.messages.find((m) => m.id === action.payload.messageId);
                if (msg) msg.previewImageUrl = action.payload.previewImageUrl;
            })
            .addCase(renderPreview.rejected, (state, action) => {
                state.isRenderingPreview = false;
                state.error = action.payload as string;
            })

            .addCase(exportPdf.pending, (state) => {
                state.isExportingPdf = true;
                state.error = null;
            })
            .addCase(exportPdf.fulfilled, (state, action) => {
                state.isExportingPdf = false;
                state.pdfResult = action.payload;
                if (state.currentSession) {
                    state.currentSession.pdfUrl = action.payload.pdfUrl;
                }
            })
            .addCase(exportPdf.rejected, (state, action) => {
                state.isExportingPdf = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearChatError,
    clearCurrentSession,
    clearMessages,
    clearPreviewResult,
    clearPdfResult,
    resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
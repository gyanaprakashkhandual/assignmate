/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "../api";
import {
    IChatSessionResponse,
    IChatMessageResponse,
    IChatStats,
    ISessionListResult,
    IPreviewResult,
    IPdfExportResult,
    ICreateSessionPayload,
    ISendMessagePayload,
    IRenderPreviewPayload,
    IExportPdfPayload,
    IUpdateSessionPayload,
    IDeleteSessionPayload,
    ISearchSessionsPayload,
    IBulkDeletePayload,
    IBulkArchivePayload,
    IFilterSessionsPayload,
    IGetUserPdfsPayload,
    IPdfRecord,
    IPdfListResult,
    IBulkActionResult,
    IPagination,
} from "../types/chat.types";

const CHAT_BASE = "/chat";

export const chatApi = {
    createSession: async (payload: ICreateSessionPayload): Promise<IChatSessionResponse> => {
        const response = await api.post<{ success: boolean; data: IChatSessionResponse }>(
            `${CHAT_BASE}/session`,
            payload
        );
        return response.data.data;
    },

    listSessions: async (params?: ISearchSessionsPayload): Promise<ISessionListResult> => {
        const response = await api.get<{
            success: boolean;
            data: IChatSessionResponse[];
            pagination: ISessionListResult["pagination"];
        }>(`${CHAT_BASE}/`, { params });
        return { sessions: response.data.data, pagination: response.data.pagination };
    },

    getStats: async (): Promise<IChatStats> => {
        const response = await api.get<{ success: boolean; data: IChatStats }>(
            `${CHAT_BASE}/stats`
        );
        return response.data.data;
    },

    getSession: async (sessionId: string): Promise<IChatSessionResponse> => {
        const response = await api.get<{ success: boolean; data: IChatSessionResponse }>(
            `${CHAT_BASE}/${sessionId}`
        );
        return response.data.data;
    },

    updateSession: async ({ sessionId, ...updates }: IUpdateSessionPayload): Promise<IChatSessionResponse> => {
        const response = await api.patch<{ success: boolean; data: IChatSessionResponse }>(
            `${CHAT_BASE}/${sessionId}`,
            updates
        );
        return response.data.data;
    },

    deleteSession: async ({ sessionId, hard }: IDeleteSessionPayload): Promise<void> => {
        await api.delete(`${CHAT_BASE}/${sessionId}`, { params: hard ? { hard: "true" } : undefined });
    },

    sendMessage: async ({ sessionId, question }: ISendMessagePayload): Promise<IChatMessageResponse[]> => {
        const response = await api.post<{ success: boolean; data: IChatMessageResponse[] }>(
            `${CHAT_BASE}/${sessionId}/message`,
            { question }
        );
        return response.data.data;
    },

    renderPreview: async ({ sessionId: _sessionId, messageId, chatSessionId, customizations, paperStyle }: IRenderPreviewPayload): Promise<IPreviewResult> => {
        const response = await api.post<{ success: boolean; data: IPreviewResult }>(
            `${CHAT_BASE}/${messageId}/preview`,
            { chatSessionId, customizations, paperStyle }
        );
        return response.data.data;
    },

    exportPdf: async ({ sessionId, customizations, paperStyle }: IExportPdfPayload): Promise<IPdfExportResult> => {
        const response = await api.post<{ success: boolean; data: IPdfExportResult }>(
            `${CHAT_BASE}/${sessionId}/export`,
            { customizations, paperStyle }
        );
        return response.data.data;
    },
    softDeleteAll: async (payload: IBulkDeletePayload): Promise<IBulkActionResult> => {
        const response = await api.delete<{ success: boolean; message: string; deleted: number }>(
            `${CHAT_BASE}/bulk/soft`,
            { data: payload }
        );
        return { deleted: response.data.deleted, message: response.data.message };
    },

    permanentDeleteAll: async (payload: IBulkDeletePayload): Promise<IBulkActionResult> => {
        const response = await api.delete<{ success: boolean; message: string; deleted: number }>(
            `${CHAT_BASE}/bulk/permanent`,
            { data: payload }
        );
        return { deleted: response.data.deleted, message: response.data.message };
    },

    archiveAll: async (payload: IBulkArchivePayload): Promise<IBulkActionResult> => {
        const response = await api.patch<{ success: boolean; message: string; archived: number }>(
            `${CHAT_BASE}/bulk/archive`,
            payload
        );
        return { archived: response.data.archived, message: response.data.message };
    },

    filterSessions: async (params?: IFilterSessionsPayload): Promise<ISessionListResult> => {
        const response = await api.get<{
            success: boolean;
            data: IChatSessionResponse[];
            pagination: IPagination;
        }>(`${CHAT_BASE}/filter`, { params });
        return { sessions: response.data.data, pagination: response.data.pagination };
    },

    searchSessions: async (q: string, page?: number, limit?: number): Promise<ISessionListResult> => {
        const response = await api.get<{
            success: boolean;
            data: IChatSessionResponse[];
            pagination: IPagination;
        }>(`${CHAT_BASE}/search`, { params: { q, page, limit } });
        return { sessions: response.data.data, pagination: response.data.pagination };
    },

    getUserPdfs: async (params?: IGetUserPdfsPayload): Promise<IPdfListResult> => {
        const response = await api.get<{
            success: boolean;
            data: IPdfRecord[];
            pagination: IPagination;
        }>(`${CHAT_BASE}/pdfs`, { params });
        return { pdfs: response.data.data, pagination: response.data.pagination };
    },
};
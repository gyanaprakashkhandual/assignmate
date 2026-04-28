import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectChatState = (state: RootState) => state.chat;

export const selectSessions = createSelector(selectChatState, (chat) => chat.sessions);

export const selectCurrentSession = createSelector(selectChatState, (chat) => chat.currentSession);

export const selectMessages = createSelector(selectChatState, (chat) => chat.messages);

export const selectStats = createSelector(selectChatState, (chat) => chat.stats);

export const selectPagination = createSelector(selectChatState, (chat) => chat.pagination);

export const selectPreviewResult = createSelector(selectChatState, (chat) => chat.previewResult);

export const selectPdfResult = createSelector(selectChatState, (chat) => chat.pdfResult);

export const selectChatIsLoading = createSelector(selectChatState, (chat) => chat.isLoading);

export const selectIsSendingMessage = createSelector(selectChatState, (chat) => chat.isSendingMessage);

export const selectIsRenderingPreview = createSelector(selectChatState, (chat) => chat.isRenderingPreview);

export const selectIsExportingPdf = createSelector(selectChatState, (chat) => chat.isExportingPdf);

export const selectChatError = createSelector(selectChatState, (chat) => chat.error);

export const selectCurrentSessionId = createSelector(
    selectCurrentSession,
    (session) => session?.id ?? null
);

export const selectCurrentSessionTitle = createSelector(
    selectCurrentSession,
    (session) => session?.title ?? null
);

export const selectCurrentSessionStatus = createSelector(
    selectCurrentSession,
    (session) => session?.status ?? null
);

export const selectCurrentSessionIsStarred = createSelector(
    selectCurrentSession,
    (session) => session?.isStarred ?? false
);

export const selectCurrentSessionPdfUrl = createSelector(
    selectCurrentSession,
    (session) => session?.pdfUrl ?? null
);

export const selectCurrentSessionMessageCount = createSelector(
    selectCurrentSession,
    (session) => session?.messageCount ?? 0
);

export const selectUserMessages = createSelector(selectMessages, (messages) =>
    messages.filter((m) => m.type === "user_question")
);

export const selectAiMessages = createSelector(selectMessages, (messages) =>
    messages.filter((m) => m.type === "ai_answer")
);

export const selectMessageCount = createSelector(selectMessages, (messages) => messages.length);

export const selectHasMessages = createSelector(selectMessages, (messages) => messages.length > 0);

export const selectHasSessions = createSelector(selectSessions, (sessions) => sessions.length > 0);

export const selectActiveSessions = createSelector(selectSessions, (sessions) =>
    sessions.filter((s) => s.status === "active")
);

export const selectStarredSessions = createSelector(selectSessions, (sessions) =>
    sessions.filter((s) => s.isStarred)
);

export const selectTotalPages = createSelector(
    selectPagination,
    (pagination) => pagination?.totalPages ?? 0
);

export const selectCurrentPage = createSelector(
    selectPagination,
    (pagination) => pagination?.page ?? 1
);

export const selectTotalSessions = createSelector(
    selectPagination,
    (pagination) => pagination?.total ?? 0
);

export const selectMessageById = (messageId: string) =>
    createSelector(selectMessages, (messages) => messages.find((m) => m.id === messageId) ?? null);

export const selectSessionById = (sessionId: string) =>
    createSelector(selectSessions, (sessions) => sessions.find((s) => s.id === sessionId) ?? null);

export const selectPdfs = createSelector(selectChatState, (chat) => chat.pdfs);

export const selectPdfsPagination = createSelector(selectChatState, (chat) => chat.pdfsPagination);

export const selectIsBulkLoading = createSelector(selectChatState, (chat) => chat.isBulkLoading);

export const selectIsFetchingPdfs = createSelector(selectChatState, (chat) => chat.isFetchingPdfs);

export const selectArchivedSessions = createSelector(selectSessions, (sessions) =>
    sessions.filter((s) => s.status === "archived")
);

export const selectDeletedSessions = createSelector(selectSessions, (sessions) =>
    sessions.filter((s) => s.status === "deleted")
);

export const selectPdfById = (pdfId: string) =>
    createSelector(selectPdfs, (pdfs) => pdfs.find((p) => p.id === pdfId) ?? null);
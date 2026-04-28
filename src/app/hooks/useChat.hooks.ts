/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
    createSession,
    listSessions,
    fetchStats,
    fetchSession,
    updateSession,
    deleteSession,
    sendMessage,
    renderPreview,
    exportPdf,
    clearChatError,
    clearCurrentSession,
    clearMessages,
    clearPreviewResult,
    clearPdfResult,
    resetChat,
    softDeleteAll,
    permanentDeleteAll,
    archiveAll,
    filterSessions,
    searchSessionsThunk,
    fetchUserPdfs,
} from "../lib/features/chat/chat.slice";
import {
    selectSessions,
    selectCurrentSession,
    selectMessages,
    selectStats,
    selectPagination,
    selectPreviewResult,
    selectPdfResult,
    selectChatIsLoading,
    selectIsSendingMessage,
    selectIsRenderingPreview,
    selectIsExportingPdf,
    selectChatError,
    selectCurrentSessionId,
    selectCurrentSessionTitle,
    selectCurrentSessionStatus,
    selectCurrentSessionIsStarred,
    selectCurrentSessionPdfUrl,
    selectCurrentSessionMessageCount,
    selectUserMessages,
    selectAiMessages,
    selectMessageCount,
    selectHasMessages,
    selectHasSessions,
    selectActiveSessions,
    selectStarredSessions,
    selectTotalPages,
    selectCurrentPage,
    selectTotalSessions,
    selectPdfs,
    selectPdfsPagination,
    selectIsBulkLoading,
    selectIsFetchingPdfs,
    selectArchivedSessions,
    selectDeletedSessions,
} from "../lib/features/chat/chat.selector";
import {
    ICreateSessionPayload,
    ISendMessagePayload,
    IRenderPreviewPayload,
    IExportPdfPayload,
    IUpdateSessionPayload,
    IDeleteSessionPayload,
    ISearchSessionsPayload,
    ChatStatus,
    PaperStyle,
    ICustomizations,
    IBulkDeletePayload,
    IBulkArchivePayload,
    IFilterSessionsPayload,
    IGetUserPdfsPayload,

} from "../lib/types/chat.types";

export const useChat = (autoFetchSessions = false) => {
    const dispatch = useAppDispatch();

    const sessions = useAppSelector(selectSessions);
    const currentSession = useAppSelector(selectCurrentSession);
    const messages = useAppSelector(selectMessages);
    const stats = useAppSelector(selectStats);
    const pagination = useAppSelector(selectPagination);
    const previewResult = useAppSelector(selectPreviewResult);
    const pdfResult = useAppSelector(selectPdfResult);
    const isLoading = useAppSelector(selectChatIsLoading);
    const isSendingMessage = useAppSelector(selectIsSendingMessage);
    const isRenderingPreview = useAppSelector(selectIsRenderingPreview);
    const isExportingPdf = useAppSelector(selectIsExportingPdf);
    const error = useAppSelector(selectChatError);
    const currentSessionId = useAppSelector(selectCurrentSessionId);
    const currentSessionTitle = useAppSelector(selectCurrentSessionTitle);
    const currentSessionStatus = useAppSelector(selectCurrentSessionStatus);
    const currentSessionIsStarred = useAppSelector(selectCurrentSessionIsStarred);
    const currentSessionPdfUrl = useAppSelector(selectCurrentSessionPdfUrl);
    const currentSessionMessageCount = useAppSelector(selectCurrentSessionMessageCount);
    const userMessages = useAppSelector(selectUserMessages);
    const aiMessages = useAppSelector(selectAiMessages);
    const messageCount = useAppSelector(selectMessageCount);
    const hasMessages = useAppSelector(selectHasMessages);
    const hasSessions = useAppSelector(selectHasSessions);
    const activeSessions = useAppSelector(selectActiveSessions);
    const starredSessions = useAppSelector(selectStarredSessions);
    const totalPages = useAppSelector(selectTotalPages);
    const currentPage = useAppSelector(selectCurrentPage);
    const totalSessions = useAppSelector(selectTotalSessions);
    const pdfs = useAppSelector(selectPdfs);
    const pdfsPagination = useAppSelector(selectPdfsPagination);
    const isBulkLoading = useAppSelector(selectIsBulkLoading);
    const isFetchingPdfs = useAppSelector(selectIsFetchingPdfs);
    const archivedSessions = useAppSelector(selectArchivedSessions);
    const deletedSessions = useAppSelector(selectDeletedSessions);


    useEffect(() => {
        if (autoFetchSessions) {
            dispatch(listSessions(undefined));
        }
    }, [autoFetchSessions]);

    const create = useCallback(
        (payload: ICreateSessionPayload) => dispatch(createSession(payload)),
        [dispatch]
    );

    const fetchSessions = useCallback(
        (params?: ISearchSessionsPayload) => dispatch(listSessions(params)),
        [dispatch]
    );

    const getStats = useCallback(() => dispatch(fetchStats()), [dispatch]);

    const getSession = useCallback(
        (sessionId: string) => dispatch(fetchSession(sessionId)),
        [dispatch]
    );

    const update = useCallback(
        (payload: IUpdateSessionPayload) => dispatch(updateSession(payload)),
        [dispatch]
    );

    const remove = useCallback(
        (payload: IDeleteSessionPayload) => dispatch(deleteSession(payload)),
        [dispatch]
    );

    const send = useCallback(
        (payload: ISendMessagePayload) => dispatch(sendMessage(payload)),
        [dispatch]
    );

    const sendToCurrentSession = useCallback(
        (question: string) => {
            if (!currentSessionId) return;
            return dispatch(sendMessage({ sessionId: currentSessionId, question }));
        },
        [dispatch, currentSessionId]
    );

    const preview = useCallback(
        (payload: IRenderPreviewPayload) => dispatch(renderPreview(payload)),
        [dispatch]
    );

    const exportToPdf = useCallback(
        (payload: IExportPdfPayload) => dispatch(exportPdf(payload)),
        [dispatch]
    );

    const exportCurrentSessionPdf = useCallback(
        (customizations: ICustomizations, paperStyle: PaperStyle) => {
            if (!currentSessionId) return;
            return dispatch(exportPdf({ sessionId: currentSessionId, customizations, paperStyle }));
        },
        [dispatch, currentSessionId]
    );

    const starSession = useCallback(
        (sessionId: string) => dispatch(updateSession({ sessionId, isStarred: true })),
        [dispatch]
    );

    const unstarSession = useCallback(
        (sessionId: string) => dispatch(updateSession({ sessionId, isStarred: false })),
        [dispatch]
    );

    const archiveSession = useCallback(
        (sessionId: string) =>
            dispatch(updateSession({ sessionId, status: "archived" as ChatStatus })),
        [dispatch]
    );

    const softDeleteSession = useCallback(
        (sessionId: string) => dispatch(deleteSession({ sessionId })),
        [dispatch]
    );

    const hardDeleteSession = useCallback(
        (sessionId: string) => dispatch(deleteSession({ sessionId, hard: true })),
        [dispatch]
    );

    const softDeleteAllSessions = useCallback(
        (payload: IBulkDeletePayload) => dispatch(softDeleteAll(payload)),
        [dispatch]
    );

    const permanentDeleteAllSessions = useCallback(
        (payload: IBulkDeletePayload) => dispatch(permanentDeleteAll(payload)),
        [dispatch]
    );

    const archiveAllSessions = useCallback(
        (payload: IBulkArchivePayload) => dispatch(archiveAll(payload)),
        [dispatch]
    );

    const filter = useCallback(
        (params?: IFilterSessionsPayload) => dispatch(filterSessions(params)),
        [dispatch]
    );

    const search = useCallback(
        (q: string, page?: number, limit?: number) =>
            dispatch(searchSessionsThunk({ q, page, limit })),
        [dispatch]
    );

    const getPdfs = useCallback(
        (params?: IGetUserPdfsPayload) => dispatch(fetchUserPdfs(params)),
        [dispatch]
    );

    const dismissError = useCallback(() => dispatch(clearChatError()), [dispatch]);

    const clearSession = useCallback(() => dispatch(clearCurrentSession()), [dispatch]);

    const clearAllMessages = useCallback(() => dispatch(clearMessages()), [dispatch]);

    const clearPreview = useCallback(() => dispatch(clearPreviewResult()), [dispatch]);

    const clearPdf = useCallback(() => dispatch(clearPdfResult()), [dispatch]);

    const reset = useCallback(() => dispatch(resetChat()), [dispatch]);

    return {
        sessions,
        currentSession,
        messages,
        stats,
        pagination,
        previewResult,
        pdfResult,
        isLoading,
        isSendingMessage,
        isRenderingPreview,
        isExportingPdf,
        error,
        currentSessionId,
        currentSessionTitle,
        currentSessionStatus,
        currentSessionIsStarred,
        currentSessionPdfUrl,
        currentSessionMessageCount,
        userMessages,
        aiMessages,
        messageCount,
        hasMessages,
        hasSessions,
        activeSessions,
        starredSessions,
        totalPages,
        currentPage,
        totalSessions,
        create,
        fetchSessions,
        getStats,
        getSession,
        update,
        remove,
        send,
        sendToCurrentSession,
        preview,
        exportToPdf,
        exportCurrentSessionPdf,
        starSession,
        unstarSession,
        archiveSession,
        softDeleteSession,
        hardDeleteSession,
        dismissError,
        clearSession,
        clearAllMessages,
        clearPreview,
        clearPdf,
        reset,
        pdfs,
        pdfsPagination,
        isBulkLoading,
        isFetchingPdfs,
        archivedSessions,
        deletedSessions,
        softDeleteAllSessions,
        permanentDeleteAllSessions,
        archiveAllSessions,
        filter,
        search,
        getPdfs,
    };
};
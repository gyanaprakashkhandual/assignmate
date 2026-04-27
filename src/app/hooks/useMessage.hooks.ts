import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
    fetchMessagesBySession,
    fetchMessageById,
    deleteMessage,
    clearMessageError,
    clearMessages,
    clearCurrentMessage,
    appendMessage,
    resetMessages,
} from "../lib/features/message/message.slice";
import {
    selectMessages,
    selectCurrentMessage,
    selectMessagePagination,
    selectMessageIsLoading,
    selectMessageIsFetchingOne,
    selectMessageIsDeleting,
    selectMessageError,
    selectUserMessages,
    selectAiMessages,
    selectMessageCount,
    selectHasMessages,
    selectMessageById,
    selectMessageTotalPages,
    selectMessageCurrentPage,
    selectMessageTotal,
    selectMessagesSortedByOrder,
    selectLatestAiMessage,
    selectLatestUserMessage,
    selectIsMessageBusy,
} from "../lib/features/message/message.slector";
import {
    IGetMessagesBySessionPayload,
    IGetMessageByIdPayload,
    IDeleteMessagePayload,
    IMessageResponse,
} from "../lib/types/message.types";

export const useMessage = () => {
    const dispatch = useAppDispatch();

    const messages = useAppSelector(selectMessages);
    const currentMessage = useAppSelector(selectCurrentMessage);
    const pagination = useAppSelector(selectMessagePagination);
    const isLoading = useAppSelector(selectMessageIsLoading);
    const isFetchingOne = useAppSelector(selectMessageIsFetchingOne);
    const isDeleting = useAppSelector(selectMessageIsDeleting);
    const error = useAppSelector(selectMessageError);
    const userMessages = useAppSelector(selectUserMessages);
    const aiMessages = useAppSelector(selectAiMessages);
    const messageCount = useAppSelector(selectMessageCount);
    const hasMessages = useAppSelector(selectHasMessages);
    const totalPages = useAppSelector(selectMessageTotalPages);
    const currentPage = useAppSelector(selectMessageCurrentPage);
    const total = useAppSelector(selectMessageTotal);
    const sortedMessages = useAppSelector(selectMessagesSortedByOrder);
    const latestAiMessage = useAppSelector(selectLatestAiMessage);
    const latestUserMessage = useAppSelector(selectLatestUserMessage);
    const isBusy = useAppSelector(selectIsMessageBusy);

    const getBySession = useCallback(
        (payload: IGetMessagesBySessionPayload) => dispatch(fetchMessagesBySession(payload)),
        [dispatch]
    );

    const getById = useCallback(
        (payload: IGetMessageByIdPayload) => dispatch(fetchMessageById(payload)),
        [dispatch]
    );

    const remove = useCallback(
        (payload: IDeleteMessagePayload) => dispatch(deleteMessage(payload)),
        [dispatch]
    );

    const getMessageById = useCallback(
        (messageId: string) => selectMessageById(messageId),
        []
    );

    const append = useCallback(
        (message: IMessageResponse) => dispatch(appendMessage(message)),
        [dispatch]
    );

    const dismissError = useCallback(() => dispatch(clearMessageError()), [dispatch]);

    const clearAll = useCallback(() => dispatch(clearMessages()), [dispatch]);

    const clearCurrent = useCallback(() => dispatch(clearCurrentMessage()), [dispatch]);

    const reset = useCallback(() => dispatch(resetMessages()), [dispatch]);

    return {
        messages,
        currentMessage,
        pagination,
        isLoading,
        isFetchingOne,
        isDeleting,
        isBusy,
        error,
        userMessages,
        aiMessages,
        messageCount,
        hasMessages,
        totalPages,
        currentPage,
        total,
        sortedMessages,
        latestAiMessage,
        latestUserMessage,
        getBySession,
        getById,
        remove,
        getMessageById,
        append,
        dismissError,
        clearAll,
        clearCurrent,
        reset,
    };
};
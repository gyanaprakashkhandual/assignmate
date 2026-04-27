import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectMessageState = (state: RootState) => state.message;

export const selectMessages = (state: RootState) => state.message.messages;
export const selectCurrentMessage = (state: RootState) => state.message.currentMessage;
export const selectMessagePagination = (state: RootState) => state.message.pagination;
export const selectMessageIsLoading = (state: RootState) => state.message.isLoading;
export const selectMessageIsFetchingOne = (state: RootState) => state.message.isFetchingOne;
export const selectMessageIsDeleting = (state: RootState) => state.message.isDeleting;
export const selectMessageError = (state: RootState) => state.message.error;

export const selectUserMessages = createSelector(selectMessages, (messages) =>
    messages.filter((m) => m.type === "user_question")
);

export const selectAiMessages = createSelector(selectMessages, (messages) =>
    messages.filter((m) => m.type === "ai_answer")
);

export const selectMessageCount = createSelector(
    selectMessages,
    (messages) => messages.length
);

export const selectHasMessages = createSelector(
    selectMessages,
    (messages) => messages.length > 0
);

export const selectMessageById = (messageId: string) =>
    createSelector(selectMessages, (messages) =>
        messages.find((m) => m.id === messageId) ?? null
    );

export const selectMessageTotalPages = createSelector(
    selectMessagePagination,
    (pagination) => pagination.totalPages
);

export const selectMessageCurrentPage = createSelector(
    selectMessagePagination,
    (pagination) => pagination.page
);

export const selectMessageTotal = createSelector(
    selectMessagePagination,
    (pagination) => pagination.total
);

export const selectMessagesSortedByOrder = createSelector(selectMessages, (messages) =>
    [...messages].sort((a, b) => a.order - b.order)
);

export const selectLatestAiMessage = createSelector(selectAiMessages, (messages) =>
    messages.length > 0 ? messages[messages.length - 1] : null
);

export const selectLatestUserMessage = createSelector(selectUserMessages, (messages) =>
    messages.length > 0 ? messages[messages.length - 1] : null
);

export const selectIsMessageBusy = createSelector(
    selectMessageState,
    (state) => state.isLoading || state.isFetchingOne || state.isDeleting
);
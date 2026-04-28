import { useCallback } from "react";
import { useChat } from "@/app/hooks/useChat.hooks";
import { useAlert } from "@/ui/feedback/alert/Alert.context";
import { BulkAction } from "../types/index";

export function useHistoryActions(onSelectionClear: () => void) {
    const {
        remove,
        softDeleteAllSessions,
        permanentDeleteAllSessions,
        archiveAllSessions,
        archiveSession,
        hardDeleteSession,
        softDeleteSession,
    } = useChat();

    const { addAlert } = useAlert();

    const handleSingleSoftDelete = useCallback(
        async (sessionId: string) => {
            try {
                await softDeleteSession(sessionId);
                addAlert({ type: "success", title: "Chat deleted", duration: 3000 });
            } catch {
                addAlert({ type: "error", title: "Failed to delete chat", duration: 4000 });
            }
        },
        [softDeleteSession, addAlert]
    );

    const handleSingleHardDelete = useCallback(
        async (sessionId: string) => {
            try {
                await hardDeleteSession(sessionId);
                addAlert({ type: "success", title: "Chat permanently deleted", duration: 3000 });
            } catch {
                addAlert({ type: "error", title: "Failed to permanently delete chat", duration: 4000 });
            }
        },
        [hardDeleteSession, addAlert]
    );

    const handleSingleArchive = useCallback(
        async (sessionId: string) => {
            try {
                await archiveSession(sessionId);
                addAlert({ type: "success", title: "Chat archived", duration: 3000 });
            } catch {
                addAlert({ type: "error", title: "Failed to archive chat", duration: 4000 });
            }
        },
        [archiveSession, addAlert]
    );

    const handleBulkAction = useCallback(
        async (action: BulkAction, sessionIds: string[]) => {
            try {
                const payload = sessionIds.length > 0 ? { sessionIds } : {};
                if (action === "soft-delete") {
                    await softDeleteAllSessions(payload);
                    addAlert({ type: "success", title: `${sessionIds.length || "All"} chats deleted`, duration: 3000 });
                } else if (action === "permanent-delete") {
                    await permanentDeleteAllSessions(payload);
                    addAlert({ type: "success", title: `${sessionIds.length || "All"} chats permanently deleted`, duration: 3000 });
                } else if (action === "archive") {
                    await archiveAllSessions(payload);
                    addAlert({ type: "success", title: `${sessionIds.length || "All"} chats archived`, duration: 3000 });
                }
                onSelectionClear();
            } catch {
                addAlert({ type: "error", title: "Bulk action failed", duration: 4000 });
            }
        },
        [softDeleteAllSessions, permanentDeleteAllSessions, archiveAllSessions, addAlert, onSelectionClear]
    );

    return {
        handleSingleSoftDelete,
        handleSingleHardDelete,
        handleSingleArchive,
        handleBulkAction,
    };
}
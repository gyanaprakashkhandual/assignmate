import { useState, useCallback } from "react";
import { IChatSessionResponse } from "@/app/lib/types/chat.types";

export function useHistorySelection(sessions: IChatSessionResponse[]) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const isAllSelected = sessions.length > 0 && selectedIds.size === sessions.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < sessions.length;

    const toggleOne = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleAll = useCallback(() => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sessions.map((s) => s.id)));
        }
    }, [isAllSelected, sessions]);

    const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

    return {
        selectedIds,
        isAllSelected,
        isIndeterminate,
        toggleOne,
        toggleAll,
        clearSelection,
        hasSelection: selectedIds.size > 0,
        selectionCount: selectedIds.size,
    };
}
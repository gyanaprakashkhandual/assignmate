export type ViewMode = "list" | "chat";
export type BulkAction = "soft-delete" | "permanent-delete" | "archive";

export interface HistoryFilterState {
    status: "all" | "active" | "archived" | "deleted";
    isStarred: boolean | null;
    sortBy: "createdAt" | "updatedAt" | "title";
    sortOrder: "asc" | "desc";
}

export interface SelectionState {
    selectedIds: Set<string>;
    isAllSelected: boolean;
}
import { useState, useCallback } from "react";
import { HistoryFilterState } from "../types/index";

const defaultFilters: HistoryFilterState = {
    status: "all",
    isStarred: null,
    sortBy: "createdAt",
    sortOrder: "desc",
};

export function useHistoryFilter() {
    const [filters, setFilters] = useState<HistoryFilterState>(defaultFilters);
    const [searchQuery, setSearchQuery] = useState("");

    const updateFilter = useCallback(<K extends keyof HistoryFilterState>(
        key: K,
        value: HistoryFilterState[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
        setSearchQuery("");
    }, []);

    const hasActiveFilters =
        filters.status !== "all" ||
        filters.isStarred !== null ||
        filters.sortBy !== "createdAt" ||
        filters.sortOrder !== "desc" ||
        searchQuery.trim() !== "";

    return {
        filters,
        searchQuery,
        setSearchQuery,
        updateFilter,
        resetFilters,
        hasActiveFilters,
    };
}
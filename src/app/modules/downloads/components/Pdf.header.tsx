"use client";
import { LayoutGrid, List, RefreshCw } from "lucide-react";
import { PdfSearchBar } from "../utils/Pdf.serach.bar";
import { PdfFilterMenu } from "../utils/Pdf.filter.menu";
import { PdfFilterState, PdfViewMode } from "../types/pdf.types";

interface PdfHeaderProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    filters: PdfFilterState;
    updateFilter: <K extends keyof PdfFilterState>(key: K, value: PdfFilterState[K]) => void;
    hasActiveFilters: boolean;
    viewMode: PdfViewMode;
    onViewModeChange: (mode: PdfViewMode) => void;
    totalCount: number;
    isLoading: boolean;
    onRefresh: () => void;
}

export function PdfHeader({
    searchQuery,
    onSearchChange,
    filters,
    updateFilter,
    hasActiveFilters,
    viewMode,
    onViewModeChange,
    totalCount,
    isLoading,
    onRefresh,
}: PdfHeaderProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                        My PDFs
                    </h1>
                    {!isLoading && totalCount > 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                            {totalCount} export{totalCount !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-950 disabled:opacity-40 transition-colors"
                    >
                        <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                    </button>

                    <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-800 p-0.5">
                        <button
                            onClick={() => onViewModeChange("grid")}
                            className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150
                                ${viewMode === "grid"
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                    : "text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            <LayoutGrid size={13} />
                        </button>
                        <button
                            onClick={() => onViewModeChange("list")}
                            className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150
                                ${viewMode === "list"
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                    : "text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            <List size={13} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <PdfSearchBar value={searchQuery} onChange={onSearchChange} />
                <PdfFilterMenu
                    filters={filters}
                    updateFilter={updateFilter}
                    hasActiveFilters={hasActiveFilters}
                />
            </div>
        </div>
    );
}
"use client";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Archive,
  ShieldAlert,
  MoreHorizontal,
} from "lucide-react";
import {
  ActionMenu,
  DefaultTrigger,
  type ActionItem,
} from "@/ui/navigations/action/Action.menu.ui";
import { HistorySearchBar } from "../utils/History.search.bar";
import { HistoryFilterMenu } from "../utils/HistoryFilter.menu";
import { HistoryFilterState, BulkAction } from "../types/index";

interface HistoryHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filters: HistoryFilterState;
  updateFilter: <K extends keyof HistoryFilterState>(
    key: K,
    value: HistoryFilterState[K],
  ) => void;
  hasActiveFilters: boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggleAll: () => void;
  totalCount: number;
  isLoading: boolean;
  onNewChat: () => void;
  onBulkAll: (action: BulkAction) => void;
}

export function HistoryHeader({
  searchQuery,
  onSearchChange,
  filters,
  updateFilter,
  hasActiveFilters,
  isAllSelected,
  isIndeterminate,
  onToggleAll,
  totalCount,
  isLoading,
  onNewChat,
  onBulkAll,
}: HistoryHeaderProps) {
  const allActionsItems: ActionItem[] = [
    {
      id: "archive-all",
      label: "Archive all",
      leadingIcon: <Archive size={14} />,
      onClick: () => onBulkAll("archive"),
    },
    {
      id: "delete-all",
      label: "Delete all",
      leadingIcon: <Trash2 size={14} />,
      variant: "warning",
      dividerBefore: true,
      onClick: () => onBulkAll("soft-delete"),
    },
    {
      id: "delete-perm-all",
      label: "Delete all permanently",
      leadingIcon: <ShieldAlert size={14} />,
      variant: "danger",
      onClick: () => onBulkAll("permanent-delete"),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            Chat History
          </h1>
          {!isLoading && totalCount > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
              {totalCount} conversation{totalCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ActionMenu
            items={allActionsItems}
            align="bottom-right"
            size="md"
            trigger={
              <DefaultTrigger
                size="sm"
                label=""
                leadingIcon={<MoreHorizontal size={15} />}
                variant="ghost"
              />
            }
          />
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Plus size={13} />
            New chat
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="shrink-0 flex items-center justify-center w-8 h-9 cursor-pointer"
          onClick={onToggleAll}
          title={isAllSelected ? "Deselect all" : "Select all"}
        >
          <div
            className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all duration-150
                            ${
                              isAllSelected
                                ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
                                : isIndeterminate
                                  ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
                                  : "border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500"
                            }
                        `}
          >
            {isAllSelected && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M1.5 4.5L3.5 6.5L7.5 2.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {isIndeterminate && !isAllSelected && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M2 4.5H7"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>

        <HistorySearchBar
          value={searchQuery}
          onChange={onSearchChange}
          isLoading={isLoading}
        />

        <HistoryFilterMenu
          filters={filters}
          updateFilter={updateFilter}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  );
}

"use client";
import { useMemo } from "react";
import {
  SlidersHorizontal,
  Star,
  Clock,
  AlignLeft,
  ArrowUpDown,
  CheckCircle,
} from "lucide-react";
import {
  ActionMenu,
  IconTrigger,
  type ActionItem,
} from "@/ui/navigations/action/Action.menu.ui";
import { HistoryFilterState } from "../types/index";

interface HistoryFilterMenuProps {
  filters: HistoryFilterState;
  updateFilter: <K extends keyof HistoryFilterState>(
    key: K,
    value: HistoryFilterState[K],
  ) => void;
  hasActiveFilters: boolean;
}

export function HistoryFilterMenu({
  filters,
  updateFilter,
  hasActiveFilters,
}: HistoryFilterMenuProps) {
  const items: ActionItem[] = useMemo(
    () => [
      {
        id: "status-header",
        label: "Status",
        header: "Filter by status",
        disabled: true,
      },
      {
        id: "status-all",
        label: "All chats",
        leadingIcon:
          filters.status === "all" ? (
            <CheckCircle size={13} />
          ) : (
            <span className="w-3.25" />
          ),
        onClick: () => updateFilter("status", "all"),
      },
      {
        id: "status-active",
        label: "Active",
        leadingIcon:
          filters.status === "active" ? (
            <CheckCircle size={13} />
          ) : (
            <span className="w-3.25" />
          ),
        onClick: () => updateFilter("status", "active"),
      },
      {
        id: "status-archived",
        label: "Archived",
        leadingIcon:
          filters.status === "archived" ? (
            <CheckCircle size={13} />
          ) : (
            <span className="w-3.25" />
          ),
        onClick: () => updateFilter("status", "archived"),
      },
      {
        id: "divider-1",
        label: "",
        dividerBefore: true,
        header: "Filter by starred",
        disabled: true,
      },
      {
        id: "starred-all",
        label: "All",
        leadingIcon:
          filters.isStarred === null ? (
            <CheckCircle size={13} />
          ) : (
            <span className="w-3.25" />
          ),
        onClick: () => updateFilter("isStarred", null),
      },
      {
        id: "starred-yes",
        label: "Starred only",
        leadingIcon: (
          <Star
            size={13}
            className={
              filters.isStarred === true
                ? "fill-amber-400 text-amber-400"
                : "text-gray-400"
            }
          />
        ),
        onClick: () => updateFilter("isStarred", true),
      },
      {
        id: "divider-2",
        label: "",
        dividerBefore: true,
        header: "Sort by",
        disabled: true,
      },
      {
        id: "sort-createdAt",
        label: "Date created",
        leadingIcon: <Clock size={13} />,
        trailingIcon:
          filters.sortBy === "createdAt" ? (
            <CheckCircle size={11} />
          ) : undefined,
        onClick: () => updateFilter("sortBy", "createdAt"),
      },
      {
        id: "sort-updatedAt",
        label: "Last updated",
        leadingIcon: <ArrowUpDown size={13} />,
        trailingIcon:
          filters.sortBy === "updatedAt" ? (
            <CheckCircle size={11} />
          ) : undefined,
        onClick: () => updateFilter("sortBy", "updatedAt"),
      },
      {
        id: "sort-title",
        label: "Title",
        leadingIcon: <AlignLeft size={13} />,
        trailingIcon:
          filters.sortBy === "title" ? <CheckCircle size={11} /> : undefined,
        onClick: () => updateFilter("sortBy", "title"),
      },
      {
        id: "divider-3",
        label: "",
        dividerBefore: true,
        header: "Sort order",
        disabled: true,
      },
      {
        id: "order-desc",
        label: "Newest first",
        leadingIcon:
          filters.sortOrder === "desc" ? (
            <CheckCircle size={13} />
          ) : (
            <span className="w-3.25" />
          ),
        onClick: () => updateFilter("sortOrder", "desc"),
      },
      {
        id: "order-asc",
        label: "Oldest first",
        leadingIcon:
          filters.sortOrder === "asc" ? (
            <CheckCircle size={13} />
          ) : (
            <span className="w-3.25" />
          ),
        onClick: () => updateFilter("sortOrder", "asc"),
      },
    ],
    [filters, updateFilter],
  );

  return (
    <div className="relative">
      <ActionMenu
        items={items}
        align="bottom-right"
        size="md"
        trigger={
          <div className="relative">
            <IconTrigger
              size="md"
              icon={<SlidersHorizontal size={15} />}
              variant="default"
            />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gray-900 dark:bg-white" />
            )}
          </div>
        }
      />
    </div>
  );
}

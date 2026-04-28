"use client";
import { useMemo } from "react";
import {
  SlidersHorizontal,
  CheckCircle,
  ArrowUpDown,
  Clock,
  Zap,
  User,
} from "lucide-react";
import {
  ActionMenu,
  IconTrigger,
  type ActionItem,
} from "@/ui/navigations/action/Action.menu.ui";
import { PdfFilterState } from "../types/pdf.types";

interface PdfFilterMenuProps {
  filters: PdfFilterState;
  updateFilter: <K extends keyof PdfFilterState>(
    key: K,
    value: PdfFilterState[K],
  ) => void;
  hasActiveFilters: boolean;
}

export function PdfFilterMenu({
  filters,
  updateFilter,
  hasActiveFilters,
}: PdfFilterMenuProps) {
  const items: ActionItem[] = useMemo(
    () => [
      {
        id: "source-header",
        label: "Source",
        header: "Filter by source",
        disabled: true,
      },
      {
        id: "source-all",
        label: "All sources",
        leadingIcon:
          filters.exportedBy === "all" ? (
            <CheckCircle size={13} />
          ) : (
            <span className="w-3.25" />
          ),
        onClick: () => updateFilter("exportedBy", "all"),
      },
      {
        id: "source-manual",
        label: "Manual export",
        leadingIcon: (
          <User
            size={13}
            className={
              filters.exportedBy === "manual"
                ? "text-gray-900 dark:text-white"
                : "text-gray-400"
            }
          />
        ),
        trailingIcon:
          filters.exportedBy === "manual" ? (
            <CheckCircle size={11} />
          ) : undefined,
        onClick: () => updateFilter("exportedBy", "manual"),
      },
      {
        id: "source-auto",
        label: "Auto generated",
        leadingIcon: (
          <Zap
            size={13}
            className={
              filters.exportedBy === "auto"
                ? "text-gray-900 dark:text-white"
                : "text-gray-400"
            }
          />
        ),
        trailingIcon:
          filters.exportedBy === "auto" ? <CheckCircle size={11} /> : undefined,
        onClick: () => updateFilter("exportedBy", "auto"),
      },
      {
        id: "sort-divider",
        label: "",
        dividerBefore: true,
        header: "Sort order",
        disabled: true,
      },
      {
        id: "sort-desc",
        label: "Newest first",
        leadingIcon: <Clock size={13} />,
        trailingIcon:
          filters.sortOrder === "desc" ? <CheckCircle size={11} /> : undefined,
        onClick: () => updateFilter("sortOrder", "desc"),
      },
      {
        id: "sort-asc",
        label: "Oldest first",
        leadingIcon: <ArrowUpDown size={13} />,
        trailingIcon:
          filters.sortOrder === "asc" ? <CheckCircle size={11} /> : undefined,
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

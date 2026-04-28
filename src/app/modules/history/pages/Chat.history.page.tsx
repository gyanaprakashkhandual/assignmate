"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/app/hooks/useChat.hooks";
import { useConfirm } from "@/ui/overlay/confirm/Confirm.context";
import { useAlert } from "@/ui/feedback/alert/Alert.context";
import { HistoryHeader } from "../components/History.navbar";
import { HistoryBulkBar } from "../components/Hisotory.bullk.bar";
import { HistoryList } from "../components/History.list";
import { HistoryListSkeleton } from "../states/Loader";
import { useHistorySelection } from "../hooks/useHistorySelection.hooks";
import { useHistoryFilter } from "../hooks/useHistoryFilter.hooks";
import { useHistoryActions } from "../hooks/useHistoryAction.hooks";
import { BulkAction } from "../types/index";
import { IChatSessionResponse } from "@/app/lib/types/chat.types";

const PAGE_LIMIT = 20;

export default function ChatHistoryPage() {
  const router = useRouter();
  const { showConfirm } = useConfirm();
  const { addAlert } = useAlert();

  const {
    sessions,
    isLoading,
    fetchSessions,
    search,
    filter,
    starSession,
    unstarSession,
    pagination,
  } = useChat();

  const {
    filters,
    searchQuery,
    setSearchQuery,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  } = useHistoryFilter();

  const [displayedSessions, setDisplayedSessions] = useState<
    IChatSessionResponse[]
  >([]);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialized = useRef(false);

  const {
    selectedIds,
    isAllSelected,
    isIndeterminate,
    toggleOne,
    toggleAll,
    clearSelection,
    hasSelection,
    selectionCount,
  } = useHistorySelection(displayedSessions);

  const {
    handleSingleSoftDelete,
    handleSingleHardDelete,
    handleSingleArchive,
    handleBulkAction,
  } = useHistoryActions(clearSelection);

  const buildFilterParams = useCallback(
    (pageNum: number) => ({
      status: filters.status === "all" ? undefined : filters.status,
      isStarred: filters.isStarred ?? undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: pageNum,
      limit: PAGE_LIMIT,
    }),
    [filters],
  );

  const fetchPage = useCallback(
    async (pageNum: number, reset = false) => {
      if (pageNum > 1) setIsFetchingMore(true);

      try {
        let result: any;
        if (searchQuery.trim()) {
          result = await search(searchQuery.trim(), pageNum, PAGE_LIMIT);
        } else if (hasActiveFilters && filters.status !== "all") {
          result = await filter(buildFilterParams(pageNum));
        } else {
          result = await fetchSessions(buildFilterParams(pageNum));
        }

        const newSessions = result?.payload?.sessions ?? sessions;
        const paginationData = result?.payload?.pagination ?? pagination;

        if (reset || pageNum === 1) {
          setDisplayedSessions(newSessions);
        } else {
          setDisplayedSessions((prev) => {
            const existingIds = new Set(prev.map((s) => s.id));
            const unique = newSessions.filter(
              (s: IChatSessionResponse) => !existingIds.has(s.id),
            );
            return [...prev, ...unique];
          });
        }

        setHasMore(pageNum < (paginationData?.totalPages ?? 1));
      } finally {
        setIsFetchingMore(false);
      }
    },
    [
      searchQuery,
      hasActiveFilters,
      filters,
      buildFilterParams,
      fetchSessions,
      search,
      filter,
      sessions,
      pagination,
    ],
  );

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchPage(1, true);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchPage(1, true);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
    fetchPage(1, true);
  }, [filters]);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, false);
  }, [page, fetchPage]);

  const handleOpen = useCallback(
    (sessionId: string) => router.push(`/chat/${sessionId}`),
    [router],
  );

  const handleNewChat = useCallback(() => router.push("/chat/new"), [router]);

  const handleStar = useCallback(
    (sessionId: string) => {
      const session = displayedSessions.find((s) => s.id === sessionId);
      if (!session) return;
      if (session.isStarred) unstarSession(sessionId);
      else starSession(sessionId);
    },
    [displayedSessions, starSession, unstarSession],
  );

  const guardedSoftDelete = useCallback(
    async (sessionId: string) => {
      const ok = await showConfirm({
        title: "Delete chat?",
        message:
          "This chat will be moved to deleted. You can restore it later.",
        confirmText: "Delete",
        type: "warning",
      });
      if (ok) await handleSingleSoftDelete(sessionId);
    },
    [showConfirm, handleSingleSoftDelete],
  );

  const guardedHardDelete = useCallback(
    async (sessionId: string) => {
      const ok = await showConfirm({
        title: "Permanently delete?",
        message:
          "This action cannot be undone. The chat and all its messages will be erased forever.",
        confirmText: "Delete permanently",
        type: "danger",
      });
      if (ok) await handleSingleHardDelete(sessionId);
    },
    [showConfirm, handleSingleHardDelete],
  );

  const guardedArchive = useCallback(
    async (sessionId: string) => {
      const ok = await showConfirm({
        title: "Archive chat?",
        message: "This chat will be moved to your archive.",
        confirmText: "Archive",
        type: "info",
      });
      if (ok) await handleSingleArchive(sessionId);
    },
    [showConfirm, handleSingleArchive],
  );

  const guardedBulkAction = useCallback(
    async (action: BulkAction) => {
      const sessionIds = Array.from(selectedIds);
      const count = sessionIds.length;
      const isAll = count === 0;

      const configs: Record<
        BulkAction,
        {
          title: string;
          message: string;
          confirmText: string;
          type: "warning" | "danger" | "info";
        }
      > = {
        "soft-delete": {
          title: isAll
            ? "Delete all chats?"
            : `Delete ${count} chat${count !== 1 ? "s" : ""}?`,
          message: "Selected chats will be moved to deleted.",
          confirmText: "Delete",
          type: "warning",
        },
        "permanent-delete": {
          title: isAll
            ? "Permanently delete all?"
            : `Permanently delete ${count} chat${count !== 1 ? "s" : ""}?`,
          message:
            "This cannot be undone. All messages will be erased forever.",
          confirmText: "Delete permanently",
          type: "danger",
        },
        archive: {
          title: isAll
            ? "Archive all chats?"
            : `Archive ${count} chat${count !== 1 ? "s" : ""}?`,
          message: "Selected chats will be moved to your archive.",
          confirmText: "Archive",
          type: "info",
        },
      };

      const cfg = configs[action];
      const ok = await showConfirm(cfg);
      if (ok) await handleBulkAction(action, sessionIds);
    },
    [showConfirm, handleBulkAction, selectedIds],
  );

  const guardedBulkAll = useCallback(
    async (action: BulkAction) => {
      const configs: Record<
        BulkAction,
        {
          title: string;
          message: string;
          confirmText: string;
          type: "warning" | "danger" | "info";
        }
      > = {
        "soft-delete": {
          title: "Delete all chats?",
          message: "Every chat will be moved to deleted.",
          confirmText: "Delete all",
          type: "warning",
        },
        "permanent-delete": {
          title: "Permanently delete all?",
          message:
            "This cannot be undone. All chats and messages will be erased.",
          confirmText: "Delete all permanently",
          type: "danger",
        },
        archive: {
          title: "Archive all chats?",
          message: "Every chat will be moved to your archive.",
          confirmText: "Archive all",
          type: "info",
        },
      };

      const cfg = configs[action];
      const ok = await showConfirm(cfg);
      if (ok) await handleBulkAction(action, []);
    },
    [showConfirm, handleBulkAction],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-24">
        <HistoryHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          updateFilter={updateFilter}
          hasActiveFilters={hasActiveFilters}
          isAllSelected={isAllSelected}
          isIndeterminate={isIndeterminate}
          onToggleAll={toggleAll}
          totalCount={pagination?.total ?? displayedSessions.length}
          isLoading={isLoading}
          onNewChat={handleNewChat}
          onBulkAll={guardedBulkAll}
        />

        <div className="mt-4">
          <HistoryBulkBar
            selectionCount={selectionCount}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onToggleAll={toggleAll}
            onClearSelection={clearSelection}
            onBulkAction={guardedBulkAction}
            totalCount={displayedSessions.length}
          />

          {isLoading && displayedSessions.length === 0 ? (
            <HistoryListSkeleton count={8} />
          ) : (
            <HistoryList
              sessions={displayedSessions}
              selectedIds={selectedIds}
              onToggleSelect={toggleOne}
              onOpen={handleOpen}
              onSoftDelete={guardedSoftDelete}
              onHardDelete={guardedHardDelete}
              onArchive={guardedArchive}
              onStar={handleStar}
              hasSearch={searchQuery.trim() !== ""}
              hasFilters={hasActiveFilters}
              onReset={resetFilters}
              hasMore={hasMore}
              isFetchingMore={isFetchingMore}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
    </div>
  );
}

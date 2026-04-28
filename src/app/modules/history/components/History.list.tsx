"use client";
import { useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { IChatSessionResponse } from "@/app/lib/types/chat.types";
import { HistorySessionCard } from "./Session.card";
import { HistoryEmptyState } from "../states/History.empty.state";

interface HistoryListProps {
  sessions: IChatSessionResponse[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onSoftDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onStar: (id: string) => void;
  hasSearch: boolean;
  hasFilters: boolean;
  onReset: () => void;
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
}

export function HistoryList({
  sessions,
  selectedIds,
  onToggleSelect,
  onOpen,
  onSoftDelete,
  onHardDelete,
  onArchive,
  onStar,
  hasSearch,
  hasFilters,
  onReset,
  hasMore,
  isFetchingMore,
  onLoadMore,
}: HistoryListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
        onLoadMore();
      }
    },
    [hasMore, isFetchingMore, onLoadMore],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (sessions.length === 0) {
    return (
      <HistoryEmptyState
        hasSearch={hasSearch}
        hasFilters={hasFilters}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <AnimatePresence mode="popLayout">
        {sessions.map((session, index) => (
          <HistorySessionCard
            key={session.id}
            session={session}
            isSelected={selectedIds.has(session.id)}
            onToggleSelect={onToggleSelect}
            onOpen={onOpen}
            onSoftDelete={onSoftDelete}
            onHardDelete={onHardDelete}
            onArchive={onArchive}
            onStar={onStar}
            index={index}
          />
        ))}
      </AnimatePresence>

      <div ref={sentinelRef} className="h-4" />

      {isFetchingMore && (
        <div className="flex justify-center py-4">
          <Loader2
            size={16}
            className="animate-spin text-gray-400 dark:text-gray-600"
          />
        </div>
      )}
    </div>
  );
}

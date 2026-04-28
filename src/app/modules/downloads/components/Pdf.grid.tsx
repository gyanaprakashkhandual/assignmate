"use client";
import { useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { IPdfRecord } from "../types";
import { PdfViewMode } from "../types/pdf.types";
import { PdfCard } from "./Pdf.card";
import { PdfListRow } from "./Pdf.list";
import { PdfEmptyState } from "../state/Pdf.empty";

interface PdfGridProps {
  pdfs: IPdfRecord[];
  viewMode: PdfViewMode;
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  hasActiveFilters: boolean;
  onReset: () => void;
  onView: (pdf: IPdfRecord) => void;
  onDownload: (pdf: IPdfRecord) => void;
  onShare: (pdf: IPdfRecord) => void;
  onDelete: (pdf: IPdfRecord) => void;
  onOpenChat: (sessionId: string) => void;
}

export function PdfGrid({
  pdfs,
  viewMode,
  hasMore,
  isFetchingMore,
  onLoadMore,
  hasActiveFilters,
  onReset,
  onView,
  onDownload,
  onShare,
  onDelete,
  onOpenChat,
}: PdfGridProps) {
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

  if (pdfs.length === 0) {
    return <PdfEmptyState hasFilters={hasActiveFilters} onReset={onReset} />;
  }

  return (
    <div>
      {viewMode === "grid" ? (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {pdfs.map((pdf, index) => (
              <PdfCard
                key={pdf.id}
                pdf={pdf}
                index={index}
                onView={onView}
                onDownload={onDownload}
                onShare={onShare}
                onDelete={onDelete}
                onOpenChat={onOpenChat}
              />
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="flex flex-col gap-1.5">
            {pdfs.map((pdf, index) => (
              <PdfListRow
                key={pdf.id}
                pdf={pdf}
                index={index}
                onView={onView}
                onDownload={onDownload}
                onShare={onShare}
                onDelete={onDelete}
                onOpenChat={onOpenChat}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <div ref={sentinelRef} className="h-4" />

      {isFetchingMore && (
        <div className="flex justify-center py-6">
          <Loader2
            size={16}
            className="animate-spin text-gray-400 dark:text-gray-600"
          />
        </div>
      )}
    </div>
  );
}

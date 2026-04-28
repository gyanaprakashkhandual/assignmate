/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/ui/overlay/confirm/Confirm.context";
import { useAlert } from "@/ui/feedback/alert/Alert.context";
import { IPdfRecord } from "../types";
import { PdfViewMode } from "../types/pdf.types";
import { usePdfLibrary } from "../hooks/usePdfLibrary.hooks";
import { PdfHeader } from "../components/Pdf.header";
import { PdfGrid } from "../components/Pdf.grid";
import { PdfShareModal } from "../components/Pdf.share";
import { PdfGridSkeleton, PdfListSkeleton } from "../state/Pdf.loader";

export default function PdfLibraryPage() {
  const router = useRouter();
  const { showConfirm } = useConfirm();
  const { addAlert } = useAlert();

  const {
    pdfs,
    pagination,
    filters,
    isFetching,
    isFetchingMore,
    isInitialLoad,
    hasMore,
    hasActiveFilters,
    updateFilter,
    handleSearchChange,
    loadMore,
    resetFilters,
    refresh,
  } = usePdfLibrary();

  const [viewMode, setViewMode] = useState<PdfViewMode>("grid");
  const [shareTarget, setShareTarget] = useState<IPdfRecord | null>(null);

  const handleView = useCallback((pdf: IPdfRecord) => {
    window.open(pdf.pdfUrl, "_blank", "noopener,noreferrer");
  }, []);

  const handleDownload = useCallback(
    async (pdf: IPdfRecord) => {
      try {
        const response = await fetch(pdf.pdfUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        const filename = pdf.chatSession?.title
          ? `${pdf.chatSession.title.slice(0, 60).replace(/[^a-z0-9]/gi, "_")}.pdf`
          : `export_${pdf.id}.pdf`;
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        addAlert({
          type: "success",
          title: "Download started",
          duration: 3000,
        });
      } catch {
        addAlert({
          type: "error",
          title: "Download failed",
          message: "Could not download this PDF.",
          duration: 4000,
        });
      }
    },
    [addAlert],
  );

  const handleShare = useCallback((pdf: IPdfRecord) => {
    setShareTarget(pdf);
  }, []);

  const handleDelete = useCallback(
    async (pdf: IPdfRecord) => {
      const ok = await showConfirm({
        title: "Delete PDF record?",
        message:
          "This will remove the PDF record. The source chat will remain intact.",
        confirmText: "Delete",
        type: "danger",
      });
      if (!ok) return;
      addAlert({ type: "info", title: "PDF record removed", duration: 3000 });
      refresh();
    },
    [showConfirm, addAlert, refresh],
  );

  const handleOpenChat = useCallback(
    (sessionId: string) => {
      router.push(`/chat/${sessionId}`);
    },
    [router],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-24">
        <PdfHeader
          searchQuery={filters.q}
          onSearchChange={handleSearchChange}
          filters={filters}
          updateFilter={updateFilter}
          hasActiveFilters={hasActiveFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={pagination?.total ?? pdfs.length}
          isLoading={isFetching && isInitialLoad}
          onRefresh={refresh}
        />

        <div className="mt-5">
          {isInitialLoad ? (
            viewMode === "grid" ? (
              <PdfGridSkeleton count={12} />
            ) : (
              <PdfListSkeleton count={8} />
            )
          ) : (
            <PdfGrid
              pdfs={pdfs}
              viewMode={viewMode}
              hasMore={hasMore}
              isFetchingMore={isFetchingMore}
              onLoadMore={loadMore}
              hasActiveFilters={hasActiveFilters}
              onReset={resetFilters}
              onView={handleView}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
              onOpenChat={handleOpenChat}
            />
          )}
        </div>
      </div>

      <PdfShareModal pdf={shareTarget} onClose={() => setShareTarget(null)} />
    </div>
  );
}

export type PdfSortOrder = "asc" | "desc";
export type PdfExportedBy = "auto" | "manual";
export type PdfViewMode = "grid" | "list";

export interface PdfFilterState {
    exportedBy: PdfExportedBy | "all";
    sortOrder: PdfSortOrder;
    from: string;
    to: string;
    q: string;
}
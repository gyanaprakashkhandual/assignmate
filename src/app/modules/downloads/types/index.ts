import { IPagination } from "@/app/lib/types/chat.types";

export interface IPdfRecord {
    id: string;
    pdfUrl: string;
    pdfPublicId: string;
    fileSize: number;
    messageCount: number;
    exportedBy: "auto" | "manual";
    generatedAt: string;
    chatSession: {
        _id: string;
        title: string;
        status: "active" | "archived" | "deleted";
    } | null;
    metadata?: {
        canvasWidth?: number;
        canvasHeight?: number;
        pageCount?: number;
        paperStyle?: string;
        customizations?: Record<string, unknown>;
    };
}

export interface IPdfListResult {
    pdfs: IPdfRecord[];
    pagination: IPagination;
}

export interface IGetUserPdfsPayload {
    from?: string;
    to?: string;
    exportedBy?: "auto" | "manual";
    q?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export interface IBulkDeletePayload {
    sessionIds?: string[];
}

export interface IBulkArchivePayload {
    sessionIds?: string[];
}

export interface IBulkActionResult {
    deleted?: number;
    archived?: number;
    message: string;
}
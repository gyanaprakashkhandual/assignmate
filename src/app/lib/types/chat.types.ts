export type ChatStatus = "active" | "archived" | "deleted";
export type MessageType = "user_question" | "ai_answer";
export type PaperStyle = "lined" | "plain" | "college_ruled";
export type ExportedBy = "auto" | "manual";
export type SortBy = "createdAt" | "updatedAt" | "title";
export type SortOrder = "asc" | "desc";

export interface IHandwritingSnapshot {
    imageUrl: string;
    publicId: string;
    extractedStyles: {
        slant: number;
        spacing: number;
        strokeWeight: number;
        lineIrregularity: number;
        inkDensity: number;
        fontFamily?: string;
        fontSize?: number;
        extraData?: Record<string, unknown>;
    };
}

export interface ICustomizations {
    inkColor: string;
    fontSize: number;
    lineSpacing: number;
    marginLeft: number;
    marginTop: number;
}

export interface IChatSessionResponse {
    id: string;
    title: string;
    messageCount: number;
    pdfUrl?: string;
    isStarred: boolean;
    status: ChatStatus;
    lastMessageAt: string;
    createdAt: string;
}

export interface IChatMessageMetadata {
    timestamp: string;
    processingTimeMs?: number;
}

export interface IChatMessageResponse {
    id: string;
    chatSessionId: string;
    type: MessageType;
    content: string;
    order: number;
    previewImageUrl?: string;
    metadata: IChatMessageMetadata;
}

export interface IChatStats {
    totalSessions: number;
    activeSessions: number;
    archivedSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    totalPdfsGenerated: number;
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ISessionListResult {
    sessions: IChatSessionResponse[];
    pagination: IPagination;
}

export interface IPreviewResult {
    messageId: string;
    previewImageUrl: string;
}

export interface IPdfExportResult {
    pdfUrl: string;
    pdfPublicId: string;
    fileSize: number;
    message: string;
}

export interface ICreateSessionPayload {
    title: string;
}

export interface ISendMessagePayload {
    sessionId: string;
    question: string;
}

export interface IRenderPreviewPayload {
    sessionId: string;
    messageId: string;
    chatSessionId: string;
    customizations: ICustomizations;
    paperStyle: PaperStyle;
}

export interface IExportPdfPayload {
    sessionId: string;
    customizations: ICustomizations;
    paperStyle: PaperStyle;
}

export interface IUpdateSessionPayload {
    sessionId: string;
    title?: string;
    status?: ChatStatus;
    isStarred?: boolean;
}

export interface IDeleteSessionPayload {
    sessionId: string;
    hard?: boolean;
}

export interface ISearchSessionsPayload {
    query?: string;
    status?: ChatStatus;
    isStarred?: boolean;
    createdAfter?: string;
    createdBefore?: string;
    page?: number;
    limit?: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
}

export interface ChatState {
    sessions: IChatSessionResponse[];
    currentSession: IChatSessionResponse | null;
    messages: IChatMessageResponse[];
    stats: IChatStats | null;
    pagination: IPagination | null;
    previewResult: IPreviewResult | null;
    pdfResult: IPdfExportResult | null;
    isLoading: boolean;
    isSendingMessage: boolean;
    isRenderingPreview: boolean;
    isExportingPdf: boolean;
    error: string | null;
}
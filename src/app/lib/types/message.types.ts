export type MessageType = "user_question" | "ai_answer";

export interface IMessageMetadata {
    messageId: string;
    timestamp: Date;
    processingTimeMs?: number;
    tokensUsed?: number;
    model?: string;
}

export interface IHandwritingRenderData {
    canvasDataUrl?: string;
    previewImageUrl?: string;
    publishedAt?: Date;
}

export interface IMessageResponse {
    id: string;
    chatSessionId: string;
    type: MessageType;
    content: string;
    order: number;
    metadata: IMessageMetadata;
    handwritingRenderData: IHandwritingRenderData | null;
    createdAt: Date;
}

export interface IMessageListResult {
    messages: IMessageResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IGetMessagesBySessionPayload {
    sessionId: string;
    page?: number;
    limit?: number;
    type?: MessageType;
}

export interface IGetMessageByIdPayload {
    messageId: string;
}

export interface IDeleteMessagePayload {
    messageId: string;
}
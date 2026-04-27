import api from "../api";
import {
    IMessageResponse,
    IMessageListResult,
    IGetMessagesBySessionPayload,
    IGetMessageByIdPayload,
    IDeleteMessagePayload,
} from "../types/message.types";

const MESSAGE_BASE = "/messages";

export const messageApi = {
    getBySession: async ({
        sessionId,
        page,
        limit,
        type,
    }: IGetMessagesBySessionPayload): Promise<IMessageListResult> => {
        const response = await api.get<{
            success: boolean;
            data: IMessageResponse[];
            pagination: IMessageListResult["pagination"];
        }>(`${MESSAGE_BASE}/session/${sessionId}`, {
            params: { page, limit, type },
        });
        return { messages: response.data.data, pagination: response.data.pagination };
    },

    getById: async ({ messageId }: IGetMessageByIdPayload): Promise<IMessageResponse> => {
        const response = await api.get<{ success: boolean; data: IMessageResponse }>(
            `${MESSAGE_BASE}/${messageId}`
        );
        return response.data.data;
    },

    delete: async ({ messageId }: IDeleteMessagePayload): Promise<void> => {
        await api.delete(`${MESSAGE_BASE}/${messageId}`);
    },
};
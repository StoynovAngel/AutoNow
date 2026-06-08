import customAPI from './ApiClient';
import type { ChatbotRequest, ChatbotResponse } from '../types/chatbot';

export const sendChatbotMessage = async (
    payload: ChatbotRequest
): Promise<ChatbotResponse> => {
    const response = await customAPI.post<ChatbotResponse>(
        'api/chatbot/recommend',
        payload
    );
    return response.data;
};

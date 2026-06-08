import { VehicleType } from './vehicle';

export interface ChatbotMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatbotRequest {
    message: string;
    history: ChatbotMessage[];
}

export interface ChatbotResponse {
    reply: string;
    recommendedService: VehicleType | null;
}

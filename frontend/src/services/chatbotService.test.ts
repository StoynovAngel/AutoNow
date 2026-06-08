import { sendChatbotMessage } from './chatbotService';
import customAPI from './ApiClient';
import { VehicleType } from '../types/vehicle';

jest.mock('./ApiClient', () => ({
    __esModule: true,
    default: { post: jest.fn() },
}));

const mockedPost = customAPI.post as jest.Mock;

describe('chatbotService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POSTs to api/chatbot/recommend with the request body', async () => {
        const responseData = { reply: 'Try a taxi.', recommendedService: VehicleType.TAXI };
        mockedPost.mockResolvedValue({ data: responseData });

        const result = await sendChatbotMessage({
            message: 'I need a ride to the airport',
            history: [],
        });

        expect(mockedPost).toHaveBeenCalledWith('api/chatbot/recommend', {
            message: 'I need a ride to the airport',
            history: [],
        });
        expect(result).toEqual(responseData);
    });

    it('forwards conversation history', async () => {
        mockedPost.mockResolvedValue({
            data: { reply: 'OK', recommendedService: null },
        });

        const history = [
            { role: 'user' as const, content: 'hi' },
            { role: 'assistant' as const, content: 'hello' },
        ];

        await sendChatbotMessage({ message: 'thanks', history });

        expect(mockedPost).toHaveBeenCalledWith('api/chatbot/recommend', {
            message: 'thanks',
            history,
        });
    });

    it('passes through null recommendedService', async () => {
        mockedPost.mockResolvedValue({
            data: { reply: 'Could you tell me more?', recommendedService: null },
        });

        const result = await sendChatbotMessage({ message: 'hi', history: [] });

        expect(result.recommendedService).toBeNull();
    });
});

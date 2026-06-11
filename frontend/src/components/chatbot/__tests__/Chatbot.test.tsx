import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import Chatbot from '../Chatbot';
import { VehicleType } from '../../../types/vehicle';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../../services/chatbotService', () => ({
    sendChatbotMessage: jest.fn(),
}));

import { sendChatbotMessage } from '../../../services/chatbotService';
const mockSend = sendChatbotMessage as jest.Mock;

describe('Chatbot', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('opens the chat sheet when the FAB is pressed', () => {
        const { getByLabelText, getByPlaceholderText } = renderWithProviders(<Chatbot />);
        fireEvent.press(getByLabelText('chatbot-open'));
        expect(getByPlaceholderText('chatbot-placeholder')).toBeTruthy();
    });

    it('sends the message and shows the assistant reply', async () => {
        mockSend.mockResolvedValue({ reply: 'Try a taxi.', recommendedService: null });
        const { getByLabelText, getByPlaceholderText, getByText } = renderWithProviders(<Chatbot />);

        fireEvent.press(getByLabelText('chatbot-open'));
        fireEvent.changeText(getByPlaceholderText('chatbot-placeholder'), 'I need a ride');
        fireEvent.press(getByLabelText('chatbot-send'));

        await waitFor(() => {
            expect(mockSend).toHaveBeenCalledWith({
                message: 'I need a ride',
                history: expect.any(Array),
            });
        });
        await waitFor(() => expect(getByText('Try a taxi.')).toBeTruthy());
    });

    it('navigates to companyList when the user taps the recommendation CTA', async () => {
        mockSend.mockResolvedValue({ reply: 'Got it.', recommendedService: VehicleType.TAXI });
        const { getByLabelText, getByPlaceholderText, getByText } = renderWithProviders(<Chatbot />);

        fireEvent.press(getByLabelText('chatbot-open'));
        fireEvent.changeText(getByPlaceholderText('chatbot-placeholder'), 'airport');
        fireEvent.press(getByLabelText('chatbot-send'));

        const cta = await waitFor(() => getByText('chatbot-go-to'));
        fireEvent.press(cta);

        expect(mockNavigate).toHaveBeenCalledWith('companyList', { vehicleType: VehicleType.TAXI });
    });

    it('shows an error when the request fails', async () => {
        mockSend.mockRejectedValue(new Error('boom'));
        const { getByLabelText, getByPlaceholderText, getByText } = renderWithProviders(<Chatbot />);

        fireEvent.press(getByLabelText('chatbot-open'));
        fireEvent.changeText(getByPlaceholderText('chatbot-placeholder'), 'hi');
        fireEvent.press(getByLabelText('chatbot-send'));

        await waitFor(() => expect(getByText('chatbot-error')).toBeTruthy());
    });

    it('does not send when the input is empty', () => {
        const { getByLabelText } = renderWithProviders(<Chatbot />);
        fireEvent.press(getByLabelText('chatbot-open'));
        fireEvent.press(getByLabelText('chatbot-send'));
        expect(mockSend).not.toHaveBeenCalled();
    });
});

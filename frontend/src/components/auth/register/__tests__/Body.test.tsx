import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import Body from '../Body';

const mockRegister = jest.fn();

jest.mock('../../../../hooks/useAuth', () => ({
    useAuth: () => ({ register: mockRegister }),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe('register Body — client validation guards', () => {
    beforeEach(() => jest.clearAllMocks());

    it('does not call register when email is invalid', async () => {
        const { getAllByDisplayValue, getByText } = renderWithProviders(<Body />);
        const [emailInput, passwordInput] = getAllByDisplayValue('');
        fireEvent.changeText(emailInput, 'not-an-email');
        fireEvent.changeText(passwordInput, 'longenough');
        fireEvent.press(getByText('register-button'));
        await waitFor(() => expect(mockRegister).not.toHaveBeenCalled());
    });

    it('does not call register when password is shorter than 8 chars', async () => {
        const { getAllByDisplayValue, getByText } = renderWithProviders(<Body />);
        const [emailInput, passwordInput] = getAllByDisplayValue('');
        fireEvent.changeText(emailInput, 'user@example.com');
        fireEvent.changeText(passwordInput, 'short');
        fireEvent.press(getByText('register-button'));
        await waitFor(() => expect(mockRegister).not.toHaveBeenCalled());
    });

    it('calls register with trimmed email when input is valid', async () => {
        mockRegister.mockResolvedValue(undefined);
        const { getAllByDisplayValue, getByText } = renderWithProviders(<Body />);
        const [emailInput, passwordInput] = getAllByDisplayValue('');
        fireEvent.changeText(emailInput, '  user@example.com  ');
        fireEvent.changeText(passwordInput, 'longenough1');
        fireEvent.press(getByText('register-button'));
        await waitFor(() =>
            expect(mockRegister).toHaveBeenCalledWith('user@example.com', 'longenough1'),
        );
    });
});

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import Body from '../Body';

const mockLogin = jest.fn();

jest.mock('../../../../hooks/useAuth', () => ({
    useAuth: () => ({ login: mockLogin }),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe('login Body — client validation guards', () => {
    beforeEach(() => jest.clearAllMocks());

    it('does not call login when email is invalid', async () => {
        const { getAllByDisplayValue, getByText } = renderWithProviders(<Body />);
        const [emailInput, passwordInput] = getAllByDisplayValue('');
        fireEvent.changeText(emailInput, 'not-an-email');
        fireEvent.changeText(passwordInput, 'secret');
        fireEvent.press(getByText('login-button'));
        await waitFor(() => expect(mockLogin).not.toHaveBeenCalled());
    });

    it('does not call login when password is empty', async () => {
        const { getAllByDisplayValue, getByText } = renderWithProviders(<Body />);
        const [emailInput] = getAllByDisplayValue('');
        fireEvent.changeText(emailInput, 'user@example.com');
        fireEvent.press(getByText('login-button'));
        await waitFor(() => expect(mockLogin).not.toHaveBeenCalled());
    });

    it('calls login with trimmed email when input is valid', async () => {
        mockLogin.mockResolvedValue(undefined);
        const { getAllByDisplayValue, getByText } = renderWithProviders(<Body />);
        const [emailInput, passwordInput] = getAllByDisplayValue('');
        fireEvent.changeText(emailInput, '  user@example.com  ');
        fireEvent.changeText(passwordInput, 'secret');
        fireEvent.press(getByText('login-button'));
        await waitFor(() =>
            expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'secret'),
        );
    });
});

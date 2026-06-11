import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useResumeActiveOrder } from '../useResumeActiveOrder';
import { AuthContext } from '../../services/AuthContext';
import type { AuthContextType, User } from '../../types/auth';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../services/orderService', () => ({
    getActiveOrderByUserId: jest.fn(),
}));

import { getActiveOrderByUserId } from '../../services/orderService';
const mockGetActive = getActiveOrderByUserId as jest.Mock;

const wrapWithAuth = (user: User | null, loading = false) => {
    const value: AuthContextType = {
        user,
        loading,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
    };
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
    return Wrapper;
};

const user: User = { id: 7, username: 'a@b.c', sub: 'a@b.c', roles: [] };

describe('useResumeActiveOrder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('navigates to bookingWaiting when an active order exists', async () => {
        mockGetActive.mockResolvedValue({ id: 55, status: 'ACCEPTED' });

        renderHook(() => useResumeActiveOrder(), { wrapper: wrapWithAuth(user) });

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith('bookingWaiting', { orderId: 55 }),
        );
        expect(mockGetActive).toHaveBeenCalledWith(7);
    });

    it('does nothing when there is no active order (null)', async () => {
        mockGetActive.mockResolvedValue(null);

        renderHook(() => useResumeActiveOrder(), { wrapper: wrapWithAuth(user) });

        await waitFor(() => expect(mockGetActive).toHaveBeenCalled());
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not query when there is no logged-in user', () => {
        renderHook(() => useResumeActiveOrder(), { wrapper: wrapWithAuth(null) });

        expect(mockGetActive).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not query while auth is still loading', () => {
        renderHook(() => useResumeActiveOrder(), { wrapper: wrapWithAuth(user, true) });

        expect(mockGetActive).not.toHaveBeenCalled();
    });

    it('swallows errors silently', async () => {
        mockGetActive.mockRejectedValue(new Error('boom'));

        renderHook(() => useResumeActiveOrder(), { wrapper: wrapWithAuth(user) });

        await waitFor(() => expect(mockGetActive).toHaveBeenCalled());
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});

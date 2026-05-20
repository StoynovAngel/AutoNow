import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from './useAuth';
import { AuthProvider } from '../services/AuthContext';
import * as authService from '../services/authService';

jest.mock('../services/authService');

const mockedAuth = authService as jest.Mocked<typeof authService>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws when used outside an AuthProvider', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useAuth())).toThrow(
            /useAuth must be used within an AuthProvider/
        );
        errorSpy.mockRestore();
    });

    it('starts with no user when no stored token exists', async () => {
        mockedAuth.getStoredToken.mockResolvedValue(null);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.user).toBeNull();
    });

    it('restores the user by decoding a stored token on mount', async () => {
        const decoded = { id: 1, sub: 'a@b.com', username: 'alice', roles: [] };
        mockedAuth.getStoredToken.mockResolvedValue('jwt-token');
        mockedAuth.decodeToken.mockReturnValue(decoded);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockedAuth.decodeToken).toHaveBeenCalledWith('jwt-token');
        expect(result.current.user).toEqual(decoded);
    });

    it('logs out when the stored token cannot be decoded', async () => {
        mockedAuth.getStoredToken.mockResolvedValue('bad-token');
        mockedAuth.decodeToken.mockImplementation(() => {
            throw new Error('bad token');
        });
        mockedAuth.logout.mockResolvedValue(undefined);
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockedAuth.logout).toHaveBeenCalled();
        expect(result.current.user).toBeNull();

        warnSpy.mockRestore();
    });

    it('login sets the user from the decoded payload', async () => {
        mockedAuth.getStoredToken.mockResolvedValue(null);
        const decoded = { id: 1, sub: 'a@b.com', username: 'alice', roles: [] };
        mockedAuth.login.mockResolvedValue(decoded);

        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.login('a@b.com', 'pw');
        });

        expect(mockedAuth.login).toHaveBeenCalledWith('a@b.com', 'pw');
        expect(result.current.user).toEqual(decoded);
    });

    it('register sets the user from the decoded payload', async () => {
        mockedAuth.getStoredToken.mockResolvedValue(null);
        const decoded = { id: 2, sub: 'new@b.com', username: 'new', roles: [] };
        mockedAuth.register.mockResolvedValue(decoded);

        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.register('new@b.com', 'pw');
        });

        expect(mockedAuth.register).toHaveBeenCalledWith('new@b.com', 'pw');
        expect(result.current.user).toEqual(decoded);
    });

    it('logout clears the user', async () => {
        const decoded = { id: 1, sub: 'a@b.com', username: 'alice', roles: [] };
        mockedAuth.getStoredToken.mockResolvedValue('jwt-token');
        mockedAuth.decodeToken.mockReturnValue(decoded);
        mockedAuth.logout.mockResolvedValue(undefined);

        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.user).toEqual(decoded));

        await act(async () => {
            await result.current.logout();
        });

        expect(mockedAuth.logout).toHaveBeenCalled();
        expect(result.current.user).toBeNull();
    });
});

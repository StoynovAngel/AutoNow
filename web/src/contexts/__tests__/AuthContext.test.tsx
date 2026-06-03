import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

const user = { id: '1', email: 'a@b.com', name: 'Alice', role: 'ADMIN' };

describe('AuthContext', () => {
    it('useAuth throws when used outside AuthProvider', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useAuth())).toThrow(
            /useAuth must be used within an AuthProvider/
        );
        errorSpy.mockRestore();
    });

    it('starts unauthenticated when nothing is in localStorage', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.user).toBeNull();
        expect(result.current.accessToken).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('restores user and token from localStorage on mount', async () => {
        localStorage.setItem('accessToken', 'jwt-token');
        localStorage.setItem('userInfo', JSON.stringify(user));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.accessToken).toBe('jwt-token');
        expect(result.current.user).toEqual(user);
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('login persists user and token to localStorage', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.login(user, 'jwt-token');
        });

        expect(result.current.user).toEqual(user);
        expect(result.current.accessToken).toBe('jwt-token');
        expect(result.current.isAuthenticated).toBe(true);
        expect(localStorage.getItem('accessToken')).toBe('jwt-token');
        expect(JSON.parse(localStorage.getItem('userInfo')!)).toEqual(user);
    });

    it('logout clears state and localStorage', async () => {
        localStorage.setItem('accessToken', 'jwt-token');
        localStorage.setItem('userInfo', JSON.stringify(user));

        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

        act(() => {
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.accessToken).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('userInfo')).toBeNull();
    });

    it('does not restore when only one of token/userInfo is present', async () => {
        localStorage.setItem('accessToken', 'jwt-token');

        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.user).toBeNull();
        expect(result.current.accessToken).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });
});

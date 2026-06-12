import { describe, it, expect, vi, afterEach } from 'vitest';
import { authService } from '../auth/authService';
import apiClient from '../apiClient';

vi.mock('../apiClient', () => ({
    default: { post: vi.fn() },
}));

const mockPost = vi.mocked(apiClient.post);

afterEach(() => {
    vi.clearAllMocks();
});

describe('authService.register', () => {
    it('posts to /auth/register and returns the token', async () => {
        mockPost.mockResolvedValueOnce({ data: { token: 'jwt-abc' } });

        const result = await authService.register({ email: 'admin@example.com', password: 'Password1' });

        expect(mockPost).toHaveBeenCalledWith('/auth/register', {
            email: 'admin@example.com',
            password: 'Password1',
        });
        expect(result).toEqual({ token: 'jwt-abc' });
    });

    it('propagates errors from the API', async () => {
        mockPost.mockRejectedValueOnce(new Error('Email already exists'));

        await expect(
            authService.register({ email: 'dup@example.com', password: 'Password1' })
        ).rejects.toThrow('Email already exists');
    });
});

describe('authService.login', () => {
    it('posts to /auth/login and returns the token', async () => {
        mockPost.mockResolvedValueOnce({ data: { token: 'jwt-login' } });

        const result = await authService.login({ email: 'user@example.com', password: 'Password1' });

        expect(mockPost).toHaveBeenCalledWith('/auth/login', {
            email: 'user@example.com',
            password: 'Password1',
        });
        expect(result).toEqual({ token: 'jwt-login' });
    });
});

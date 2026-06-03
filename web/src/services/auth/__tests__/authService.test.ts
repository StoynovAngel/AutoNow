import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../authService';
import apiClient from '../../apiClient';

vi.mock('../../apiClient', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('authService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('login POSTs credentials to /auth/login and returns the token payload', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { token: 'jwt.value.sig' } });

        const result = await authService.login({ email: 'a@b.com', password: 'pw' });

        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
            email: 'a@b.com',
            password: 'pw',
        });
        expect(result).toEqual({ token: 'jwt.value.sig' });
    });

    it('login propagates errors from apiClient', async () => {
        vi.mocked(apiClient.post).mockRejectedValue(new Error('network'));

        await expect(authService.login({ email: 'a@b.com', password: 'pw' }))
            .rejects.toThrow('network');
    });
});

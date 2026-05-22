import type { InternalAxiosRequestConfig } from 'axios';
import customAPI from './ApiClient';
import storage from './storage';

describe('ApiClient', () => {
    beforeEach(async () => {
        await storage.deleteItem('jwt');
    });

    it('uses the apiUrl from expo-constants as baseURL', () => {
        expect(customAPI.defaults.baseURL).toBe('http://test-host');
    });

    it('attaches the Bearer token from storage on non-auth requests', async () => {
        await storage.setItem('jwt', 'jwt-token');

        const captured: InternalAxiosRequestConfig[] = [];
        customAPI.defaults.adapter = async (config) => {
            captured.push(config);
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
        };

        await customAPI.get('/anything');

        expect(captured[0].headers.Authorization).toBe('Bearer jwt-token');
    });

    it('does not attach a token to /auth/login', async () => {
        await storage.setItem('jwt', 'jwt-token');

        const captured: InternalAxiosRequestConfig[] = [];
        customAPI.defaults.adapter = async (config) => {
            captured.push(config);
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
        };

        await customAPI.post('api/auth/login', { email: 'a@b.com', password: 'p' });

        expect(captured[0].headers.Authorization).toBeUndefined();
    });

    it('does not attach a token to /auth/register', async () => {
        await storage.setItem('jwt', 'jwt-token');

        const captured: InternalAxiosRequestConfig[] = [];
        customAPI.defaults.adapter = async (config) => {
            captured.push(config);
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
        };

        await customAPI.post('api/auth/register', { email: 'a@b.com', password: 'p' });

        expect(captured[0].headers.Authorization).toBeUndefined();
    });

    it('does not attach an Authorization header when no token is stored', async () => {
        const captured: InternalAxiosRequestConfig[] = [];
        customAPI.defaults.adapter = async (config) => {
            captured.push(config);
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
        };

        await customAPI.get('/anything');

        expect(captured[0].headers.Authorization).toBeUndefined();
    });

    it('clears the stored token on a 401 response', async () => {
        await storage.setItem('jwt', 'jwt-token');

        customAPI.defaults.adapter = async (config) => {
            const error = new Error('unauthorized') as Error & { response?: unknown; config?: unknown };
            error.response = { status: 401, data: {}, statusText: 'Unauthorized', headers: {}, config };
            error.config = config;
            throw error;
        };

        await expect(customAPI.get('/secure')).rejects.toBeDefined();

        expect(await storage.getItem('jwt')).toBeNull();
    });
});

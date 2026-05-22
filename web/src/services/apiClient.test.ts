import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';
import apiClient from './apiClient';

describe('apiClient', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('uses the configured base URL', () => {
        expect(apiClient.defaults.baseURL).toBe('http://localhost:8080/api');
    });

    it('does not mutate axios.defaults.headers.common with Authorization', () => {
        localStorage.setItem('accessToken', 'jwt-token');
        const common = (apiClient.defaults.headers as { common?: Record<string, string> }).common ?? {};
        expect(common.Authorization).toBeUndefined();
    });

    it('attaches the Bearer token from localStorage to outgoing requests', async () => {
        localStorage.setItem('accessToken', 'jwt-token');

        const captured: InternalAxiosRequestConfig[] = [];
        apiClient.defaults.adapter = async (config) => {
            captured.push(config);
            return {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
            };
        };

        await apiClient.get('/anything');

        expect(captured[0].headers.Authorization).toBe('Bearer jwt-token');
    });

    it('does not attach an Authorization header when no token is stored', async () => {
        const captured: InternalAxiosRequestConfig[] = [];
        apiClient.defaults.adapter = async (config) => {
            captured.push(config);
            return {
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
            };
        };

        await apiClient.get('/anything');

        expect(captured[0].headers.Authorization).toBeUndefined();
    });

    it('clears auth storage when the response is a 401', async () => {
        localStorage.setItem('accessToken', 'jwt-token');
        localStorage.setItem('userInfo', '{"name":"x"}');

        // Stub window.location.href so the test does not actually navigate.
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, href: '' },
        });

        apiClient.defaults.adapter = async (config) => {
            const error = new Error('unauthorized') as Error & { response?: unknown; config?: unknown };
            error.response = { status: 401, data: {}, statusText: 'Unauthorized', headers: {}, config };
            error.config = config;
            throw error;
        };

        await expect(apiClient.get('/secure')).rejects.toBeDefined();

        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('userInfo')).toBeNull();
        expect(window.location.href).toBe('/login');

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });
});

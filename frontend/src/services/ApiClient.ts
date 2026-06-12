import axios from 'axios';
import storage from './storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://localhost:8080';

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
    onUnauthorized = handler;
};

const customAPI = axios.create({
    baseURL: apiUrl
});

customAPI.interceptors.request.use(async (config) => {
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (!isAuthEndpoint) {
        try {
            const token = await storage.getItem('jwt');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Failed to get token from storage:', error);
        }
    }
    return config;
});

customAPI.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await storage.deleteItem('jwt');
            } catch (deleteError) {
                console.warn('Failed to delete token from storage:', deleteError);
            }
            if (onUnauthorized) {
                onUnauthorized();
            }
        }
        throw error;
    }
);

export default customAPI;

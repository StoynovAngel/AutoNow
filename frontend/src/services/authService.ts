import customAPI from './ApiClient';
import storage from './storage';
import type { JwtResponse } from '../types/auth';

const decodeToken = (token: string) => {
    if (!token || typeof token !== 'string' || token.trim() === '') {
        throw new Error('Invalid token: token is empty or not a string');
    }

    const segments = token.split('.');
    if (segments.length !== 3) {
        throw new Error('Invalid token: JWT must have exactly 3 segments');
    }

    const payload = segments[1];
    if (!payload) {
        throw new Error('Invalid token: payload segment is empty');
    }

    try {
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        const decoded = JSON.parse(atob(base64));
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            throw new Error('Invalid token: token has expired');
        }
        return decoded;
    } catch (error) {
        if (error instanceof Error && error.message.startsWith('Invalid token:')) {
            throw error;
        }
        throw new Error('Invalid token: failed to decode or parse payload');
    }
};

const storeAndDecode = async (token: string) => {
    try {
        await storage.setItem('jwt', token);
    } catch (error) {
        console.warn('Failed to store token:', error);
    }
    return decodeToken(token);
};

export const login = async (email: string, password: string) => {
    const response = await customAPI.post<JwtResponse>('api/auth/login', { email, password });
    return storeAndDecode(response.data.token);
};

export const register = async (email: string, password: string) => {
    const response = await customAPI.post<JwtResponse>('api/auth/register', {
        email,
        password,
        roleNames: ['CUSTOMER'],
    });
    return storeAndDecode(response.data.token);
};

export const logout = async () => {
    try {
        await storage.deleteItem('jwt');
    } catch (error) {
        console.warn('Failed to delete token:', error);
    }
};

export const getStoredToken = async () => {
    try {
        return await storage.getItem('jwt');
    } catch (error) {
        console.warn('Failed to get stored token:', error);
        return null;
    }
};

export { decodeToken };


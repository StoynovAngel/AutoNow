import customAPI from './ApiClient';
import storage from './storage';
import type { JwtResponse } from '../types/auth';

const decodeToken = (token: string) => {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
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


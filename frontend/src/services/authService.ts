import customAPI from './ApiClient';
import * as SecureStore from 'expo-secure-store';
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

        return JSON.parse(atob(base64));
    } catch (error) {
        throw new Error('Invalid token: failed to decode or parse payload');
    }
};

export const login = async (email: string, password: string) => {
    const response = await customAPI.post<JwtResponse>('api/auth/login', {email, password});

    const token = response.data.token;
    await SecureStore.setItemAsync('jwt', token);

    return decodeToken(token);
};

export const register = async (email: string, password: string) => {
    const response = await customAPI.post<JwtResponse>('api/auth/register', {
        email,
        password,
        roleNames: ['CUSTOMER']
    });

    const token = response.data.token;
    await SecureStore.setItemAsync('jwt', token);

    return decodeToken(token);
};

export const logout = async () => {
    await SecureStore.deleteItemAsync('jwt');
};

export const getStoredToken = async () => {
    return await SecureStore.getItemAsync('jwt');
};

export { decodeToken };

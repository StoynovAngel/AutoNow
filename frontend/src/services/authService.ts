import customAPI from './ApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const decodeToken = (token: string) => {
    const payload = token.split('.')[1];
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    while (base64.length % 4 !== 0) {
        base64 += '=';
    }

    return JSON.parse(atob(base64));
};

export const login = async (email: string, password: string) => {
    const response = await customAPI.post('api/auth/login', {email, password}, {
        transformResponse: [(data) => data]
    });

    const token = response.data;
    await AsyncStorage.setItem('jwt', token);

    return decodeToken(token);
};

export const register = async (email: string, password: string) => {
    const response = await customAPI.post('api/auth/register', {
        email,
        password,
        roleNames: ['CUSTOMER']
    }, {
        transformResponse: [(data) => data]
    });

    const token = response.data;
    await AsyncStorage.setItem('jwt', token);

    return decodeToken(token);
};

export const logout = async () => {
    await AsyncStorage.removeItem('jwt');
};

export const getStoredToken = async () => {
    return await AsyncStorage.getItem('jwt');
};

export { decodeToken };

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://localhost:8080';

if (!apiUrl) {
    console.error('API URL is not configured. Please set it in app.json extra.apiUrl or API_URL environment variable.');
    throw new Error('API URL configuration missing');
}

const customAPI = axios.create({
    baseURL: apiUrl
});

customAPI.interceptors.request.use(async (config) => {
    // Don't add token for login/register endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (!isAuthEndpoint) {
        const token = await AsyncStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

customAPI.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('jwt');
        }
        throw error;
    }
);

export default customAPI;
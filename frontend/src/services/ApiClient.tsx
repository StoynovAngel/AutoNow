import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
const customAPI = axios.create({
    baseURL:  apiUrl
});

customAPI.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
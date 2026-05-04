import customAPI from './ApiClient';
import * as SecureStore from 'expo-secure-store';
import type { UserRequestDTO, JwtResponse } from '../types/auth';

export const authService = {
  register: async (credentials: UserRequestDTO): Promise<JwtResponse> => {
    const response = await customAPI.post<JwtResponse>('/auth/register', credentials);
    await SecureStore.setItemAsync('authToken', response.data.token);
    return response.data;
  },

  login: async (credentials: UserRequestDTO): Promise<JwtResponse> => {
    const response = await customAPI.post<JwtResponse>('/auth/login', credentials);
    await SecureStore.setItemAsync('authToken', response.data.token);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('authToken');
  },

  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('authToken');
  },
};

export default customAPI;

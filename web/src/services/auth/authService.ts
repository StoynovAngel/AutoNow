import apiClient from '../apiClient';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
        return data;
    },

    register: async (payload: LoginPayload): Promise<LoginResponse> => {
        const { data } = await apiClient.post<LoginResponse>('/auth/register', payload);
        return data;
    },
};

import { api } from './api';
import type { UserRequestDTO, JwtResponse } from '@shared/types';

export const authService = {
  async login(credentials: UserRequestDTO): Promise<JwtResponse> {
    const response = await api.post<JwtResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: UserRequestDTO): Promise<JwtResponse> {
    const response = await api.post<JwtResponse>('/auth/register', credentials);
    return response.data;
  },
};

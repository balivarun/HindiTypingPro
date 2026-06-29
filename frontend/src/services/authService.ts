import api from './api';
import { ApiResponse, AuthResponse } from '../types';

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password });
    return data.data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return data.data;
  },
};

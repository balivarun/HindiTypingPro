import api from './api';
import { ApiResponse, User } from '../types';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get<ApiResponse<User>>('/users/profile');
    return data.data;
  },

  updateDailyGoal: async (goal: number) => {
    const { data } = await api.put<ApiResponse<User>>(`/users/daily-goal?goal=${goal}`);
    return data.data;
  },
};

export const adminService = {
  getAllUsers: async () => {
    const { data } = await api.get<ApiResponse<User[]>>('/admin/users');
    return data.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/admin/users/${id}`);
  },

  createTest: async (test: { title: string; paragraph: string; difficulty: string }) => {
    const { data } = await api.post('/admin/tests', test);
    return data.data;
  },

  updateTest: async (id: number, test: { title: string; paragraph: string; difficulty: string }) => {
    const { data } = await api.put(`/admin/tests/${id}`, test);
    return data.data;
  },

  deleteTest: async (id: number) => {
    await api.delete(`/admin/tests/${id}`);
  },
};

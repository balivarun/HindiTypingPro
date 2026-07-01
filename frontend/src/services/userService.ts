import api from './api';
import { AdminStats, ApiResponse, Coupon, User } from '../types';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get<ApiResponse<User>>('/users/profile');
    return data.data;
  },

  updateDailyGoal: async (goal: number) => {
    const { data } = await api.put<ApiResponse<User>>(`/users/daily-goal?goal=${goal}`);
    return data.data;
  },

  updateExamInfo: async (examType: string, examDate: string) => {
    const { data } = await api.put<ApiResponse<User>>(
      `/users/exam-info?examType=${encodeURIComponent(examType)}&examDate=${examDate}`
    );
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

  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    return data.data;
  },

  getCoupons: async (): Promise<Coupon[]> => {
    const { data } = await api.get<ApiResponse<Coupon[]>>('/admin/coupons');
    return data.data;
  },

  createCoupon: async (code: string, discountPercent: number, maxUses: number | null) => {
    const { data } = await api.post<ApiResponse<Coupon>>('/admin/coupons', { code, discountPercent, maxUses });
    return data.data;
  },

  toggleCoupon: async (id: number) => {
    await api.patch(`/admin/coupons/${id}/toggle`);
  },

  deleteCoupon: async (id: number) => {
    await api.delete(`/admin/coupons/${id}`);
  },
};

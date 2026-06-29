import api from './api';
import { ApiResponse, Difficulty, TypingLayout, TypingResult, TypingTest } from '../types';

export const testService = {
  getAllTests: async (difficulty?: Difficulty) => {
    const params = difficulty ? { difficulty } : {};
    const { data } = await api.get<ApiResponse<TypingTest[]>>('/tests', { params });
    return data.data;
  },

  getRandomTest: async (difficulty?: Difficulty) => {
    const params = difficulty ? { difficulty } : {};
    const { data } = await api.get<ApiResponse<TypingTest>>('/tests/random', { params });
    return data.data;
  },

  getTestById: async (id: number) => {
    const { data } = await api.get<ApiResponse<TypingTest>>(`/tests/${id}`);
    return data.data;
  },

  saveResult: async (result: {
    testId?: number;
    speed: number;
    accuracy: number;
    mistakes: number;
    correctChars: number;
    wrongChars: number;
    totalChars: number;
    cpm: number;
    layout: TypingLayout;
    duration: number;
  }) => {
    const { data } = await api.post<ApiResponse<TypingResult>>('/results', result);
    return data.data;
  },

  getHistory: async () => {
    const { data } = await api.get<ApiResponse<TypingResult[]>>('/results/history');
    return data.data;
  },
};

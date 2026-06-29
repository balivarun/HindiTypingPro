import api from './api';
import { ApiResponse, LeaderboardEntry } from '../types';

export const leaderboardService = {
  getLeaderboard: async (sortBy: 'speed' | 'accuracy' = 'speed') => {
    const { data } = await api.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard', { params: { sortBy } });
    return data.data;
  },
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  totalTests?: number;
  averageSpeed?: number;
  averageAccuracy?: number;
  bestSpeed?: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TypingTest {
  id: number;
  title: string;
  paragraph: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
  updatedAt?: string;
}

export type TypingLayout = 'KRUTIDEV' | 'REMINGTON_GAIL' | 'INSCRIPT';

export interface TypingResult {
  id: number;
  userId: number;
  userName: string;
  testId?: number;
  testTitle?: string;
  speed: number;
  accuracy: number;
  mistakes: number;
  correctChars: number;
  wrongChars: number;
  totalChars: number;
  cpm: number;
  layout: TypingLayout;
  duration: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  speed: number;
  accuracy: number;
  layout: TypingLayout;
  achievedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type TimerOption = 60 | 300 | 600;

export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  correctChars: number;
  wrongChars: number;
  totalChars: number;
  timeElapsed: number;
}

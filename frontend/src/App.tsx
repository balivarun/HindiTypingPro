import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import HistoryPage from './pages/HistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import SkillPathPage from './pages/SkillPathPage';
import ExamModePage from './pages/ExamModePage';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              duration: 3000,
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
            } />
            <Route path="/practice" element={
              <ProtectedRoute><Layout><PracticePage /></Layout></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute><Layout><HistoryPage /></Layout></ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute><Layout><LeaderboardPage /></Layout></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><Layout><AdminPage /></Layout></ProtectedRoute>
            } />
            <Route path="/skill-path" element={
              <ProtectedRoute><Layout><SkillPathPage /></Layout></ProtectedRoute>
            } />
            <Route path="/exam" element={
              <ProtectedRoute><Layout><ExamModePage /></Layout></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

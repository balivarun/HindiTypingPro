import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Ping /api/health the moment the page loads so Render wakes up
  // before the user finishes filling in the form.
  useEffect(() => {
    let slowTimer: ReturnType<typeof setTimeout>;
    const warmUp = async () => {
      setWarmingUp(true);
      slowTimer = setTimeout(() => setSlowWarning(true), 4000);
      try {
        await api.get('/health');
      } catch {
        // Server may still be starting — login will handle the retry naturally
      } finally {
        clearTimeout(slowTimer);
        setWarmingUp(false);
        setSlowWarning(false);
      }
    };
    warmUp();
    return () => clearTimeout(slowTimer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let slowTimer: ReturnType<typeof setTimeout> | null = null;
    try {
      slowTimer = setTimeout(() => setSlowWarning(true), 5000);
      const data = await authService.login(email, password);
      login(data.token, {
        id: data.id, name: data.name, email: data.email,
        role: data.role as 'USER' | 'ADMIN', createdAt: '',
      } as User);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      if (slowTimer) clearTimeout(slowTimer);
      setSlowWarning(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 font-hindi mb-2">ह</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HindiTypingPro</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        {/* Server warm-up banner */}
        {(warmingUp || slowWarning) && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
            slowWarning
              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800'
          }`}>
            <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {slowWarning
              ? 'Server is waking up from sleep (free plan — up to 60s). Please wait…'
              : 'Connecting to server…'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || warmingUp}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {slowWarning ? 'Still connecting…' : 'Signing in…'}
              </>
            ) : warmingUp ? 'Connecting…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-600 dark:text-blue-400">
          <strong>Demo:</strong> admin@hinditypingpro.com / admin123
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

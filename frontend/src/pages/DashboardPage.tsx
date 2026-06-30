import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { testService } from '../services/testService';
import { User, TypingResult } from '../types';
import StatCard from '../components/ui/StatCard';
import StreakWidget from '../components/ui/StreakWidget';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiZap, FiTarget, FiActivity, FiAward, FiArrowRight } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DashboardPage = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [history, setHistory] = useState<TypingResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, h] = await Promise.all([userService.getProfile(), testService.getHistory()]);
        setProfile(p);
        setHistory(h);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
  );

  const recent = history.slice(0, 10).reverse();

  const chartData = {
    labels: recent.map((_, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: 'WPM',
        data: recent.map(r => r.speed),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Accuracy %',
        data: recent.map(r => r.accuracy),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.05)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {authUser?.name}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Ready for your next typing session?</p>
        </div>
        <Link
          to="/practice"
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Start Practice <FiArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tests" value={profile?.totalTests ?? 0} icon={<FiActivity />} color="text-primary-600" />
        <StatCard label="Best Speed" value={profile?.bestSpeed ?? 0} icon={<FiZap />} color="text-orange-500" suffix="WPM" />
        <StatCard label="Avg Speed" value={profile?.averageSpeed ?? 0} icon={<FiActivity />} color="text-blue-500" suffix="WPM" />
        <StatCard label="Avg Accuracy" value={`${profile?.averageAccuracy ?? 0}%`} icon={<FiTarget />} color="text-green-500" />
      </div>

      <StreakWidget
        currentStreak={profile?.currentStreak ?? 0}
        longestStreak={profile?.longestStreak ?? 0}
        todayWordCount={profile?.todayWordCount ?? 0}
        dailyGoal={profile?.dailyGoal ?? 200}
      />

      {recent.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance History</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tests</h2>
          <Link to="/history" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">View All</Link>
        </div>
        {history.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FiAward size={48} className="mx-auto mb-3 opacity-30" />
            <p>No tests yet. <Link to="/practice" className="text-primary-600 hover:underline">Start practicing!</Link></p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Layout</th>
                  <th className="px-6 py-3 text-left">Speed</th>
                  <th className="px-6 py-3 text-left">Accuracy</th>
                  <th className="px-6 py-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.slice(0, 5).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{r.layout.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary-600 dark:text-primary-400">{r.speed} WPM</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">{r.accuracy}%</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{r.duration}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

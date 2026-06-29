import React, { useEffect, useState } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { LeaderboardEntry } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getLayoutLabel } from '../utils/typingUtils';
import { FiAward } from 'react-icons/fi';

const medals = ['🥇', '🥈', '🥉'];

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'speed' | 'accuracy'>('speed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardService.getLeaderboard(sortBy)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('speed')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              sortBy === 'speed' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            By Speed
          </button>
          <button
            onClick={() => setSortBy('accuracy')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              sortBy === 'accuracy' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            By Accuracy
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FiAward size={56} className="mx-auto mb-4 opacity-30" />
          <p>No entries yet. Be the first!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 text-left">Rank</th>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Speed (WPM)</th>
                <th className="px-6 py-4 text-left">Accuracy</th>
                <th className="px-6 py-4 text-left">Layout</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {entries.map((entry) => (
                <tr key={`${entry.rank}-${entry.userId}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-lg">
                      {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{entry.userName}</td>
                  <td className="px-6 py-4 text-xl font-bold text-primary-600 dark:text-primary-400">{entry.speed}</td>
                  <td className="px-6 py-4 text-lg font-bold text-green-600 dark:text-green-400">{entry.accuracy}%</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{getLayoutLabel(entry.layout)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.achievedAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;

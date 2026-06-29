import React, { useEffect, useState } from 'react';
import { testService } from '../services/testService';
import { TypingResult } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getLayoutLabel } from '../utils/typingUtils';
import { FiCalendar, FiZap, FiTarget, FiAlertCircle } from 'react-icons/fi';

const HistoryPage = () => {
  const [history, setHistory] = useState<TypingResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testService.getHistory()
      .then(setHistory)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test History</h1>

      {history.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FiCalendar size={56} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No tests recorded yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((result, i) => (
            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                #{history.length - i}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {result.testTitle ?? 'Custom Test'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <FiCalendar size={12} />
                  {new Date(result.createdAt).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-xl font-bold text-primary-600 dark:text-primary-400">
                    <FiZap size={16} />{result.speed}
                  </div>
                  <div className="text-xs text-gray-400">WPM</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-xl font-bold text-green-600 dark:text-green-400">
                    <FiTarget size={16} />{result.accuracy}%
                  </div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-xl font-bold text-red-500">
                    <FiAlertCircle size={16} />{result.mistakes}
                  </div>
                  <div className="text-xs text-gray-400">Mistakes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-600 dark:text-gray-300">{result.cpm}</div>
                  <div className="text-xs text-gray-400">CPM</div>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {getLayoutLabel(result.layout)}
                </span>
                <div className="text-xs text-gray-400 mt-1">{result.duration}s</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

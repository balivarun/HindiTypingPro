import React from 'react';
import { TypingStats, TypingLayout } from '../../types';
import { getLayoutLabel, formatTime } from '../../utils/typingUtils';
import { FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

interface ResultModalProps {
  stats: TypingStats;
  layout: TypingLayout;
  onRetry: () => void;
  onNewTest: () => void;
  saving: boolean;
}

const ResultModal = ({ stats, layout, onRetry, onNewTest, saving }: ResultModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Test Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{getLayoutLabel(layout)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">{stats.wpm}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">WPM</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accuracy</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.cpm}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">CPM</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-red-500 dark:text-red-400">{stats.mistakes}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mistakes</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{stats.correctChars}</div>
            <div className="text-gray-400">Correct</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{stats.wrongChars}</div>
            <div className="text-gray-400">Wrong</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{formatTime(stats.timeElapsed)}</div>
            <div className="text-gray-400">Time</div>
          </div>
        </div>

        {saving && (
          <p className="text-center text-sm text-gray-400 mb-4">Saving result...</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium transition-colors"
          >
            <FiRefreshCw size={18} />
            Retry
          </button>
          <button
            onClick={onNewTest}
            className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors"
          >
            New Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;

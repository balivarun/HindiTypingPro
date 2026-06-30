import React from 'react';

interface StreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  todayWordCount: number;
  dailyGoal: number;
}

const StreakWidget = ({ currentStreak, longestStreak, todayWordCount, dailyGoal }: StreakWidgetProps) => {
  const progress = dailyGoal > 0 ? Math.min((todayWordCount / dailyGoal) * 100, 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Streak & Daily Goal</h3>
        {longestStreak > 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">Best: {longestStreak} days</span>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Streak section */}
        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label="fire">🔥</span>
          <div>
            {currentStreak > 0 ? (
              <>
                <div className="text-3xl font-bold text-orange-500">{currentStreak}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">day streak</div>
              </>
            ) : (
              <div className="text-sm font-medium text-orange-400">Start your streak today!</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />

        {/* Daily goal section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily Goal</span>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              {todayWordCount} / {dailyGoal} words
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress >= 100 && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">Goal reached!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreakWidget;

import React from 'react';
import { Difficulty, TimerOption, TypingLayout } from '../../types';
import { getLayoutLabel } from '../../utils/typingUtils';

interface TestControlsProps {
  layout: TypingLayout;
  difficulty: Difficulty;
  timerDuration: TimerOption;
  onLayoutChange: (layout: TypingLayout) => void;
  onDifficultyChange: (diff: Difficulty) => void;
  onTimerChange: (timer: TimerOption) => void;
  onNewTest: () => void;
  onReset: () => void;
  loading: boolean;
}

const LAYOUTS: TypingLayout[] = ['KRUTIDEV', 'REMINGTON_GAIL', 'INSCRIPT'];
const DIFFICULTIES: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const TIMERS: { label: string; value: TimerOption }[] = [
  { label: '1 Min', value: 60 },
  { label: '5 Min', value: 300 },
  { label: '10 Min', value: 600 },
];

const TestControls = ({
  layout, difficulty, timerDuration,
  onLayoutChange, onDifficultyChange, onTimerChange,
  onNewTest, onReset, loading,
}: TestControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Layout</label>
        <div className="flex gap-1">
          {LAYOUTS.map(l => (
            <button
              key={l}
              onClick={() => onLayoutChange(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                layout === l
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {getLayoutLabel(l)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Difficulty</label>
        <div className="flex gap-1">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                difficulty === d
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Timer</label>
        <div className="flex gap-1">
          {TIMERS.map(t => (
            <button
              key={t.value}
              onClick={() => onTimerChange(t.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timerDuration === t.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onNewTest}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'New Test'}
        </button>
      </div>
    </div>
  );
};

export default TestControls;

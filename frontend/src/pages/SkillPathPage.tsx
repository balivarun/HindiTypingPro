import React, { useEffect, useState } from 'react';
import { testService } from '../services/testService';
import { TypingResult } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiLock, FiCheckCircle, FiZap } from 'react-icons/fi';

interface Stage {
  id: number;
  name: string;
  keys: string;
  unlockWpm: number;
  unlockAccuracy?: number;
  description: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    name: 'Home Row Hero',
    keys: 'A S D F G H J K L ;',
    unlockWpm: 5,
    description: 'Master the home row, the foundation of fast typing',
  },
  {
    id: 2,
    name: 'Top Row Climber',
    keys: 'Q W E R T Y U I O P',
    unlockWpm: 15,
    description: 'Add the top row to your arsenal',
  },
  {
    id: 3,
    name: 'Bottom Row Explorer',
    keys: 'Z X C V B N M',
    unlockWpm: 25,
    description: 'Complete the alphabet coverage',
  },
  {
    id: 4,
    name: 'Speed Seeker',
    keys: 'SSC CGL cutoff',
    unlockWpm: 35,
    description: 'Match the official SSC typing speed requirement',
  },
  {
    id: 5,
    name: 'Accuracy Master',
    keys: '40 WPM + 90% accuracy',
    unlockWpm: 40,
    unlockAccuracy: 90,
    description: 'Fast AND precise — exam ready',
  },
  {
    id: 6,
    name: 'Government Exam Ready',
    keys: 'Top tier speed',
    unlockWpm: 45,
    description: 'Top tier speed for any government exam',
  },
];

const SkillPathPage = () => {
  const [history, setHistory] = useState<TypingResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testService.getHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const bestWpm = history.length > 0 ? Math.max(...history.map(r => r.speed)) : 0;
  const bestAccuracy = history.length > 0 ? Math.max(...history.map(r => r.accuracy)) : 0;

  const isStageUnlocked = (stage: Stage) => {
    if (bestWpm < stage.unlockWpm) return false;
    if (stage.unlockAccuracy && bestAccuracy < stage.unlockAccuracy) return false;
    return true;
  };

  const currentStageIndex = STAGES.findIndex(s => !isStageUnlocked(s));

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skill Path</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your typing mastery journey</p>
      </div>

      {/* Current best WPM stat card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
          <FiZap className="text-orange-500" size={28} />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Best Speed</div>
          <div className="text-4xl font-bold text-orange-500">
            {bestWpm} <span className="text-xl font-normal text-gray-400">WPM</span>
          </div>
        </div>
        {bestAccuracy > 0 && (
          <>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 mx-2" />
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Accuracy</div>
              <div className="text-4xl font-bold text-green-500">
                {bestAccuracy}<span className="text-xl font-normal text-gray-400">%</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700 z-0" />

        <div className="space-y-4 relative z-10">
          {STAGES.map((stage, index) => {
            const unlocked = isStageUnlocked(stage);
            const isCurrent = index === currentStageIndex;

            return (
              <div key={stage.id} className="flex gap-4 items-start">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
                  ${unlocked
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                    ? 'bg-white dark:bg-gray-800 border-blue-500 text-blue-500 animate-pulse ring-4 ring-blue-200 dark:ring-blue-900/50'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {unlocked ? (
                    <FiCheckCircle size={22} />
                  ) : isCurrent ? (
                    <FiZap size={22} />
                  ) : (
                    <FiLock size={20} />
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 bg-white dark:bg-gray-800 rounded-2xl p-5 border shadow-sm transition-all
                  ${unlocked
                    ? 'border-green-200 dark:border-green-800/50'
                    : isCurrent
                    ? 'border-blue-300 dark:border-blue-700'
                    : 'border-gray-100 dark:border-gray-700 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                          Stage {stage.id}
                        </span>
                        {unlocked && (
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                            Current Goal
                          </span>
                        )}
                        {!unlocked && !isCurrent && (
                          <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            Locked
                          </span>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold mt-0.5 ${
                        unlocked ? 'text-green-700 dark:text-green-400' :
                        isCurrent ? 'text-blue-700 dark:text-blue-300' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {stage.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {stage.unlockWpm} WPM
                        {stage.unlockAccuracy && <span className="text-gray-400"> + {stage.unlockAccuracy}%</span>}
                      </div>
                      <div className="text-xs text-gray-400">required</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{stage.description}</p>

                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-mono">{stage.keys}</div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        unlocked ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{
                        width: `${Math.min((bestWpm / stage.unlockWpm) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {bestWpm} / {stage.unlockWpm} WPM
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillPathPage;

import React, { useState, useEffect, useCallback } from 'react';
import { TypingLayout, TypingTest, TimerOption } from '../types';
import { testService } from '../services/testService';
import { useTypingTest } from '../hooks/useTypingTest';
import TypingArea from '../components/typing/TypingArea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiClock, FiZap, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ExamPreset {
  id: string;
  name: string;
  layout: TypingLayout;
  duration: TimerOption;
  targetWpm: number;
  description: string;
}

const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc',
    name: 'SSC CGL / CHSL',
    layout: 'KRUTIDEV',
    duration: 600,
    targetWpm: 35,
    description: 'Staff Selection Commission — Hindi Typing Test',
  },
  {
    id: 'hssc',
    name: 'HSSC (Haryana SSC)',
    layout: 'KRUTIDEV',
    duration: 300,
    targetWpm: 30,
    description: 'Haryana Staff Selection Commission',
  },
  {
    id: 'court',
    name: 'Court Typing',
    layout: 'INSCRIPT',
    duration: 600,
    targetWpm: 30,
    description: 'High Court / District Court Hindi Typing Test',
  },
  {
    id: 'dsssb',
    name: 'Delhi Subordinate Services',
    layout: 'REMINGTON_GAIL',
    duration: 300,
    targetWpm: 35,
    description: 'DSSSB Hindi Typing Examination',
  },
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const ExamModePage = () => {
  const [selectedExam, setSelectedExam] = useState<ExamPreset | null>(null);
  const [currentTest, setCurrentTest] = useState<TypingTest | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const paragraph = currentTest?.paragraph ?? '';
  const duration = selectedExam?.duration ?? 600;
  const layout = selectedExam?.layout ?? 'KRUTIDEV';

  const { typedText, status, stats, timeLeft, currentIndex, handleInput, resetTest } =
    useTypingTest(paragraph, duration, layout);

  const handleStartExam = useCallback(async (exam: ExamPreset) => {
    setSelectedExam(exam);
    setLoadingTest(true);
    setTestStarted(false);
    try {
      const test = await testService.getRandomTest();
      setCurrentTest(test);
    } catch {
      toast.error('Failed to load exam passage');
      setSelectedExam(null);
    } finally {
      setLoadingTest(false);
    }
  }, []);

  const handleBackToExams = () => {
    setSelectedExam(null);
    setCurrentTest(null);
    setTestStarted(false);
    resetTest();
  };

  const isFinished = status === 'finished';
  const passed = isFinished && selectedExam ? stats.wpm >= selectedExam.targetWpm : false;

  // Exam selection view
  if (!selectedExam) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam Mode</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Practice with real exam conditions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EXAM_PRESETS.map(exam => (
            <div
              key={exam.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{exam.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{exam.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
                  <FiZap size={13} />
                  {exam.targetWpm} WPM
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                  <FiClock size={13} />
                  {exam.duration / 60} min
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                  {exam.layout.replace('_', ' ')}
                </span>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="mt-auto w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              >
                Start Exam
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Exam interface view
  return (
    <div className="space-y-6">
      {/* EXAM MODE banner */}
      <div className="bg-red-600 text-white text-center py-2.5 rounded-xl font-bold text-sm tracking-widest uppercase">
        EXAM MODE — {selectedExam.name}
      </div>

      {loadingTest ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : isFinished ? (
        /* Result screen */
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm text-center space-y-6">
          <div className={`text-6xl font-black ${passed ? 'text-green-500' : 'text-red-500'}`}>
            {passed ? 'PASS ✓' : 'FAIL ✗'}
          </div>

          <div className="flex justify-center gap-12">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.wpm}</div>
              <div className="text-sm text-gray-400">Your WPM</div>
            </div>
            <div className="w-px bg-gray-200 dark:bg-gray-700" />
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{selectedExam.targetWpm}</div>
              <div className="text-sm text-gray-400">Required WPM</div>
            </div>
          </div>

          <div className="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <span>Accuracy: <strong className="text-gray-800 dark:text-gray-200">{stats.accuracy}%</strong></span>
            <span>Mistakes: <strong className="text-gray-800 dark:text-gray-200">{stats.mistakes}</strong></span>
          </div>

          {!passed && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You need {selectedExam.targetWpm - stats.wpm} more WPM to pass. Keep practicing!
            </p>
          )}

          <button
            onClick={handleBackToExams}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Exams
          </button>
        </div>
      ) : (
        /* Active exam */
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Countdown timer */}
            <div className={`flex items-center gap-3 rounded-xl p-4 ${
              timeLeft < 60
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <FiClock className={timeLeft < 60 ? 'text-red-500' : 'text-primary-500'} size={24} />
              <div>
                <div className={`text-2xl font-bold font-mono ${
                  timeLeft < 60 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-400">Time Left</div>
              </div>
            </div>

            {/* WPM */}
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <FiZap className="text-orange-500" size={24} />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.wpm}</div>
                <div className="text-xs text-gray-400">WPM</div>
              </div>
            </div>

            {/* Target */}
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-orange-500 font-bold text-lg">🎯</div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedExam.targetWpm}</div>
                <div className="text-xs text-gray-400">Target WPM</div>
              </div>
            </div>
          </div>

          {/* Layout locked notice */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/30 rounded-lg px-3 py-2">
            <FiAlertCircle size={13} />
            Layout locked to <strong className="text-gray-600 dark:text-gray-300">{selectedExam.layout.replace('_', ' ')}</strong> for this exam
          </div>

          {currentTest && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">{currentTest.title}</h3>
              <TypingArea
                paragraph={paragraph}
                typedText={typedText}
                currentIndex={currentIndex}
                onInput={handleInput}
                isFinished={isFinished}
              />
              {status === 'idle' && (
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                  <FiAlertCircle size={14} />
                  Click on the text area and start typing to begin the exam timer
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleBackToExams}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FiArrowLeft size={14} />
            Back to Exams
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamModePage;

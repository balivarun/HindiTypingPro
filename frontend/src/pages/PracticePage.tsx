import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, TimerOption, TypingLayout, TypingTest } from '../types';
import { testService } from '../services/testService';
import { useTypingTest } from '../hooks/useTypingTest';
import TypingArea from '../components/typing/TypingArea';
import TestControls from '../components/typing/TestControls';
import ResultModal from '../components/typing/ResultModal';
import VirtualKeyboard from '../components/typing/VirtualKeyboard';
import KeyMappingPanel from '../components/typing/KeyMappingPanel';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatTime } from '../utils/typingUtils';
import { FiClock, FiZap, FiTarget, FiAlertCircle } from 'react-icons/fi';
import { MdKeyboard, MdKeyboardHide } from 'react-icons/md';
import toast from 'react-hot-toast';

const PracticePage = () => {
  const [layout, setLayout] = useState<TypingLayout>('KRUTIDEV');
  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');
  const [timerDuration, setTimerDuration] = useState<TimerOption>(60);
  const [currentTest, setCurrentTest] = useState<TypingTest | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [pressedKey, setPressedKey] = useState('');
  const clearKeyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paragraph = currentTest?.paragraph ?? '';

  const { typedText, status, stats, timeLeft, currentIndex, handleInput, resetTest } =
    useTypingTest(paragraph, timerDuration, layout);

  // Track physical key presses and clear highlight after 200ms
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key === ' ' ? 'Space' : e.key);
      if (clearKeyTimer.current) clearTimeout(clearKeyTimer.current);
      clearKeyTimer.current = setTimeout(() => setPressedKey(''), 200);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (clearKeyTimer.current) clearTimeout(clearKeyTimer.current);
    };
  }, []);

  const fetchNewTest = useCallback(async (diff = difficulty) => {
    setLoadingTest(true);
    setShowResult(false);
    try {
      const test = await testService.getRandomTest(diff);
      setCurrentTest(test);
    } catch {
      toast.error('Failed to load test');
    } finally {
      setLoadingTest(false);
    }
  }, [difficulty]);

  useEffect(() => { fetchNewTest(); }, []);

  useEffect(() => {
    if (status === 'finished' && !showResult) {
      setShowResult(true);
      saveResult();
    }
  }, [status]);

  const saveResult = async () => {
    if (!currentTest) return;
    setSavingResult(true);
    try {
      await testService.saveResult({
        testId: currentTest.id,
        speed: stats.wpm,
        accuracy: stats.accuracy,
        mistakes: stats.mistakes,
        correctChars: stats.correctChars,
        wrongChars: stats.wrongChars,
        totalChars: stats.totalChars,
        cpm: stats.cpm,
        layout,
        duration: timerDuration - timeLeft,
      });
      toast.success('Result saved!');
    } catch {
      toast.error('Failed to save result');
    } finally {
      setSavingResult(false);
    }
  };

  const handleNewTest = () => { setShowResult(false); fetchNewTest(); };
  const handleRetry = () => { setShowResult(false); resetTest(); };
  const handleDifficultyChange = (d: Difficulty) => { setDifficulty(d); fetchNewTest(d); };

  const progress = paragraph.length > 0 ? (typedText.length / paragraph.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Typing Practice</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select your layout and start typing</p>
        </div>
        <button
          onClick={() => setShowKeyboard(v => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors border ${
            showKeyboard
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {showKeyboard ? <MdKeyboardHide size={20} /> : <MdKeyboard size={20} />}
          {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-6">
        <TestControls
          layout={layout}
          difficulty={difficulty}
          timerDuration={timerDuration}
          onLayoutChange={l => { setLayout(l); resetTest(); }}
          onDifficultyChange={handleDifficultyChange}
          onTimerChange={t => setTimerDuration(t)}
          onNewTest={handleNewTest}
          onReset={handleRetry}
          loading={loadingTest}
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <FiClock className="text-primary-500" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{formatTime(timeLeft)}</div>
              <div className="text-xs text-gray-400">Time Left</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <FiZap className="text-orange-500" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.wpm}</div>
              <div className="text-xs text-gray-400">WPM</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <FiTarget className="text-green-500" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.accuracy}%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
          </div>
        </div>

        <ProgressBar value={Math.round(progress)} max={100} />

        {loadingTest ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : currentTest ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">{currentTest.title}</h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                difficulty === 'BEGINNER' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {difficulty}
              </span>
            </div>
            <TypingArea
              paragraph={paragraph}
              typedText={typedText}
              currentIndex={currentIndex}
              onInput={handleInput}
              isFinished={status === 'finished'}
            />
            {status === 'idle' && (
              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <FiAlertCircle size={14} />
                Click on the text area and start typing to begin
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">On-Screen Keyboard</span>
              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                — Hindi / English shown for <span className="font-medium text-primary-500">{layout.replace('_', ' ')}</span> layout
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-blue-400"></span> Pressed
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-yellow-400 animate-pulse"></span> Next key
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center overflow-x-auto items-start">
            <KeyMappingPanel layout={layout} pressedKey={pressedKey} side="left" />
            <VirtualKeyboard pressedKey={pressedKey} layout={layout} nextChar={paragraph[typedText.length] ?? ''} />
            <KeyMappingPanel layout={layout} pressedKey={pressedKey} side="right" />
          </div>
        </div>
      )}

      {showResult && status === 'finished' && (
        <ResultModal
          stats={stats}
          layout={layout}
          onRetry={handleRetry}
          onNewTest={handleNewTest}
          saving={savingResult}
        />
      )}
    </div>
  );
};

export default PracticePage;

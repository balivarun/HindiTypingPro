import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, TimerOption, TypingLayout, TypingTest } from '../types';
import { testService } from '../services/testService';
import { useTypingTest } from '../hooks/useTypingTest';
import { useAuth } from '../context/AuthContext';
import TypingArea from '../components/typing/TypingArea';
import TestControls from '../components/typing/TestControls';
import ResultModal from '../components/typing/ResultModal';
import VirtualKeyboard from '../components/typing/VirtualKeyboard';
import WpmSparkline from '../components/typing/WpmSparkline';
import KeyMappingPanel from '../components/typing/KeyMappingPanel';
import PaymentWall from '../components/payment/PaymentWall';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatTime } from '../utils/typingUtils';
import { FiClock, FiZap, FiTarget, FiAlertCircle, FiEdit3, FiXCircle } from 'react-icons/fi';
import { MdKeyboard, MdKeyboardHide } from 'react-icons/md';
import toast from 'react-hot-toast';

const DAILY_LIMIT = 3;
const LS_SESSIONS_KEY = 'htp_daily_sessions';

const getTodaySessions = (): number => {
  try {
    const raw = localStorage.getItem(LS_SESSIONS_KEY);
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw);
    return date === new Date().toDateString() ? (count as number) : 0;
  } catch {
    return 0;
  }
};

const incrementSession = () => {
  const count = getTodaySessions() + 1;
  localStorage.setItem(LS_SESSIONS_KEY, JSON.stringify({ date: new Date().toDateString(), count }));
};

const PracticePage = () => {
  const { user } = useAuth();
  const [layout, setLayout] = useState<TypingLayout>('KRUTIDEV');
  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');
  const [timerDuration, setTimerDuration] = useState<TimerOption>(60);
  const [currentTest, setCurrentTest] = useState<TypingTest | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [pressedKey, setPressedKey] = useState('');
  const [customTextMode, setCustomTextMode] = useState(false);
  const [customText, setCustomText] = useState('');
  const [todaySessions, setTodaySessions] = useState(getTodaySessions);
  const [sessionCounted, setSessionCounted] = useState(false);
  const clearKeyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userLoaded = user !== null;
  const isPremium = user?.isPremium === true || user?.role === 'ADMIN';
  const sessionsLeft = DAILY_LIMIT - todaySessions;
  const dailyLimitReached = !isPremium && todaySessions >= DAILY_LIMIT;

  const activeParagraph = customTextMode && customText.trim().length > 10
    ? customText.trim()
    : currentTest?.paragraph ?? '';

  const { typedText, status, stats, timeLeft, currentIndex, wpmHistory, keyMistakes, handleInput, resetTest } =
    useTypingTest(activeParagraph, timerDuration, layout);

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
      if (!isPremium && !sessionCounted) {
        incrementSession();
        setTodaySessions(getTodaySessions());
        setSessionCounted(true);
      }
      saveResult();
    }
  }, [status]);

  const saveResult = async () => {
    if (!currentTest && !customTextMode) return;
    setSavingResult(true);
    try {
      await testService.saveResult({
        testId: currentTest?.id,
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

  const handleNewTest = () => {
    setShowResult(false);
    setSessionCounted(false);
    fetchNewTest();
  };
  const handleRetry = () => {
    setShowResult(false);
    setSessionCounted(false);
    resetTest();
  };
  const handleDifficultyChange = (d: Difficulty) => { setDifficulty(d); fetchNewTest(d); };

  const progress = activeParagraph.length > 0 ? (typedText.length / activeParagraph.length) * 100 : 0;

  // Non-premium daily limit reached
  if (userLoaded && dailyLimitReached) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Typing Practice</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">You've used all 3 free sessions today</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-center gap-3 mb-2">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">Daily free limit reached (3/3)</p>
            <p className="text-sm text-amber-700 dark:text-amber-400">Free sessions reset at midnight. Upgrade to practice unlimited!</p>
          </div>
        </div>
        <PaymentWall onSuccess={() => { setTodaySessions(0); }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Typing Practice</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select your layout and start typing</p>
        </div>
        <div className="flex items-center gap-3">
          {isPremium ? (
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400">
              Premium
            </div>
          ) : (
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
              {sessionsLeft} free session{sessionsLeft !== 1 ? 's' : ''} left today
            </div>
          )}
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

        {/* Custom text toggle (premium only) */}
        {isPremium && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCustomTextMode(v => !v); resetTest(); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                customTextMode
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <FiEdit3 size={14} />
              Custom Text
            </button>
            {customTextMode && <span className="text-xs text-gray-400">Paste your Hindi text below</span>}
          </div>
        )}

        {customTextMode && isPremium && (
          <div className="relative">
            <textarea
              value={customText}
              onChange={e => { setCustomText(e.target.value); resetTest(); }}
              placeholder="अपना हिंदी टेक्स्ट यहाँ पेस्ट करें… (Paste your Hindi text here…)"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10 text-gray-900 dark:text-white font-hindi text-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {customText && (
              <button
                onClick={() => { setCustomText(''); resetTest(); }}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiXCircle size={18} />
              </button>
            )}
          </div>
        )}

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

        <WpmSparkline wpmHistory={wpmHistory} isRunning={status === 'running'} />
        <ProgressBar value={Math.round(progress)} max={100} />

        {loadingTest ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : customTextMode && customText.trim().length > 10 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Custom Text</h3>
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">CUSTOM</span>
            </div>
            <TypingArea
              paragraph={activeParagraph}
              typedText={typedText}
              currentIndex={currentIndex}
              onInput={handleInput}
              isFinished={status === 'finished'}
            />
          </div>
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
              paragraph={activeParagraph}
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
            <VirtualKeyboard pressedKey={pressedKey} layout={layout} nextChar={activeParagraph[typedText.length] ?? ''} />
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
          keyMistakes={keyMistakes}
          wpmHistory={wpmHistory}
          userName={user?.name}
        />
      )}
    </div>
  );
};

export default PracticePage;

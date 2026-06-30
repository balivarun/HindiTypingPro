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
import PaymentModal from '../components/payment/PaymentModal';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatTime } from '../utils/typingUtils';
import { FiClock, FiZap, FiTarget, FiAlertCircle } from 'react-icons/fi';
import { MdKeyboard, MdKeyboardHide } from 'react-icons/md';
import toast from 'react-hot-toast';

const FREE_TRIAL_SECONDS = 120; // 2 minutes
const FREE_TRIAL_KEY = 'htp_free_seconds';

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
  const clearKeyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Free-trial state — premium users bypass this entirely
  const [freeSecondsUsed, setFreeSecondsUsed] = useState<number>(() =>
    parseInt(localStorage.getItem(FREE_TRIAL_KEY) || '0', 10)
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isPremium = user?.isPremium === true || user?.role === 'ADMIN';
  const trialExpired = !isPremium && freeSecondsUsed >= FREE_TRIAL_SECONDS;

  const paragraph = currentTest?.paragraph ?? '';

  const { typedText, status, stats, timeLeft, currentIndex, wpmHistory, keyMistakes, handleInput, resetTest } =
    useTypingTest(paragraph, timerDuration, layout);

  // Auto-open payment modal if trial already expired when page loads
  useEffect(() => {
    if (!isPremium && freeSecondsUsed >= FREE_TRIAL_SECONDS) {
      setShowPaymentModal(true);
    }
  }, []);

  // Count free trial seconds while test is running
  useEffect(() => {
    if (isPremium || status !== 'running') return;
    const interval = setInterval(() => {
      setFreeSecondsUsed(prev => {
        const next = prev + 1;
        localStorage.setItem(FREE_TRIAL_KEY, String(next));
        if (next >= FREE_TRIAL_SECONDS) {
          setShowPaymentModal(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, isPremium]);

  // Track physical key presses and clear highlight after 200ms
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showPaymentModal) return; // Block input while payment modal is open
      setPressedKey(e.key === ' ' ? 'Space' : e.key);
      if (clearKeyTimer.current) clearTimeout(clearKeyTimer.current);
      clearKeyTimer.current = setTimeout(() => setPressedKey(''), 200);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (clearKeyTimer.current) clearTimeout(clearKeyTimer.current);
    };
  }, [showPaymentModal]);

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

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setFreeSecondsUsed(0);
    toast.success('Welcome to Premium! Unlimited typing practice unlocked.');
  };

  const progress = paragraph.length > 0 ? (typedText.length / paragraph.length) * 100 : 0;
  const freeSecondsLeft = Math.max(0, FREE_TRIAL_SECONDS - freeSecondsUsed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Typing Practice</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select your layout and start typing</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Free trial remaining badge */}
          {!isPremium && (
            <div className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
              freeSecondsLeft <= 30
                ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
            }`}>
              Free trial: {Math.floor(freeSecondsLeft / 60)}:{String(freeSecondsLeft % 60).padStart(2, '0')} left
            </div>
          )}
          {isPremium && (
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400">
              Premium
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

            {/* Typing area — locked when trial expired */}
            {trialExpired && !showPaymentModal ? (
              <div
                className="rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 p-8 text-center cursor-pointer"
                onClick={() => setShowPaymentModal(true)}
              >
                <div className="text-3xl mb-2">🔒</div>
                <p className="font-semibold text-amber-700 dark:text-amber-400">Free trial ended</p>
                <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                  <button className="underline font-medium" onClick={() => setShowPaymentModal(true)}>
                    Upgrade to Premium (₹99)
                  </button>{' '}
                  for unlimited practice
                </p>
              </div>
            ) : (
              <TypingArea
                paragraph={paragraph}
                typedText={typedText}
                currentIndex={currentIndex}
                onInput={trialExpired ? () => {} : handleInput}
                isFinished={status === 'finished' || trialExpired}
              />
            )}

            {status === 'idle' && !trialExpired && (
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
          keyMistakes={keyMistakes}
          wpmHistory={wpmHistory}
          userName={user?.name}
        />
      )}

      {/* Payment modal — appears when free trial expires */}
      {showPaymentModal && (
        <PaymentModal onSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default PracticePage;

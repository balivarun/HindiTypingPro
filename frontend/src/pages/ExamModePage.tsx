import React, { useState, useEffect, useCallback } from 'react';
import { TypingLayout, TypingTest, TimerOption } from '../types';
import { testService } from '../services/testService';
import { useTypingTest } from '../hooks/useTypingTest';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/paymentService';
import TypingArea from '../components/typing/TypingArea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiClock, FiZap, FiAlertCircle, FiArrowLeft, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ExamPreset {
  id: string;
  name: string;
  layout: TypingLayout;
  duration: TimerOption;
  targetWpm: number;
  description: string;
  color: string;
}

const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc',
    name: 'SSC CGL / CHSL',
    layout: 'KRUTIDEV',
    duration: 600,
    targetWpm: 35,
    description: 'Staff Selection Commission — Hindi Typing Test',
    color: 'blue',
  },
  {
    id: 'hssc',
    name: 'HSSC (Haryana SSC)',
    layout: 'KRUTIDEV',
    duration: 300,
    targetWpm: 30,
    description: 'Haryana Staff Selection Commission',
    color: 'green',
  },
  {
    id: 'court',
    name: 'Court Typing',
    layout: 'INSCRIPT',
    duration: 600,
    targetWpm: 30,
    description: 'High Court / District Court Hindi Typing Test',
    color: 'purple',
  },
  {
    id: 'dsssb',
    name: 'Delhi Subordinate Services',
    layout: 'REMINGTON_GAIL',
    duration: 300,
    targetWpm: 35,
    description: 'DSSSB Hindi Typing Examination',
    color: 'orange',
  },
];

const colorMap: Record<string, string> = {
  blue:   'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  green:  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const ExamModePage = () => {
  const { user, updateUser } = useAuth();
  const isPremium = user?.isPremium === true || user?.role === 'ADMIN';
  const userLoaded = user !== null;

  const [selectedExam, setSelectedExam] = useState<ExamPreset | null>(null);
  const [currentTest, setCurrentTest] = useState<TypingTest | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  // Payment state for the inline plan section
  const [payLoading, setPayLoading] = useState(false);
  const [testOrderId, setTestOrderId] = useState<string | null>(null);

  const paragraph = currentTest?.paragraph ?? '';
  const duration = selectedExam?.duration ?? 600;
  const layout = selectedExam?.layout ?? 'KRUTIDEV';

  const { typedText, status, stats, timeLeft, currentIndex, handleInput, resetTest } =
    useTypingTest(paragraph, duration, layout);

  const activatePremium = () => {
    updateUser({ isPremium: true });
    localStorage.removeItem('htp_free_seconds');
    toast.success('Premium unlocked! All exams are now available.');
  };

  const handlePayAndStartExam = async (exam: ExamPreset) => {
    if (isPremium) {
      startExam(exam);
      return;
    }
    setPayLoading(true);
    try {
      const order = await paymentService.createOrder();

      if (order.testMode) {
        setTestOrderId(order.orderId);
        setPayLoading(false);
        return;
      }

      if (typeof window.Razorpay === 'undefined') {
        toast.error('Razorpay failed to load. Check your internet and try again.');
        setPayLoading(false);
        return;
      }

      new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'HindiTypingPro',
        description: 'Premium — Unlock All Exams',
        order_id: order.orderId,
        prefill: { name: user?.name ?? '', email: user?.email ?? '' },
        theme: { color: '#6366f1' },
        handler: async (response) => {
          try {
            await paymentService.verifyPayment(response);
            activatePremium();
            startExam(exam);
          } catch {
            toast.error('Payment verification failed. Contact support if money was deducted.');
          }
        },
        modal: { ondismiss: () => setPayLoading(false) },
      }).open();

    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not start payment. Try again.');
      setPayLoading(false);
    }
  };

  const handleTestActivateAndStart = async (exam: ExamPreset) => {
    if (!testOrderId) return;
    setPayLoading(true);
    try {
      await paymentService.testActivate(testOrderId);
      activatePremium();
      startExam(exam);
    } catch {
      toast.error('Test activation failed.');
      setPayLoading(false);
    }
  };

  const startExam = useCallback(async (exam: ExamPreset) => {
    setSelectedExam(exam);
    setLoadingTest(true);
    setTestOrderId(null);
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
    resetTest();
  };

  const isFinished = status === 'finished';
  const passed = isFinished && selectedExam ? stats.wpm >= selectedExam.targetWpm : false;

  // ── Active exam view ──────────────────────────────────────────────────────────
  if (selectedExam) {
    return (
      <div className="space-y-6">
        <div className="bg-red-600 text-white text-center py-2.5 rounded-xl font-bold text-sm tracking-widest uppercase">
          EXAM MODE — {selectedExam.name}
        </div>

        {loadingTest ? (
          <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
        ) : isFinished ? (
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
              <FiArrowLeft size={16} /> Back to Exams
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className={`flex items-center gap-3 rounded-xl p-4 ${timeLeft < 60 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                <FiClock className={timeLeft < 60 ? 'text-red-500' : 'text-primary-500'} size={24} />
                <div>
                  <div className={`text-2xl font-bold font-mono ${timeLeft < 60 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {formatTime(timeLeft)}
                  </div>
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
                <div className="text-orange-500 font-bold text-lg">🎯</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedExam.targetWpm}</div>
                  <div className="text-xs text-gray-400">Target WPM</div>
                </div>
              </div>
            </div>
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
            <button onClick={handleBackToExams} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <FiArrowLeft size={14} /> Back to Exams
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Exam selection view ───────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam Mode</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Practice under real exam conditions</p>
      </div>

      {/* ── Pricing plan section (shown to non-premium users) ── */}
      {userLoaded && !isPremium && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                PREMIUM PLAN
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                HindiTypingPro Premium
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Unlock all exams + unlimited practice + certificates
              </p>
              <div className="flex flex-wrap gap-2">
                {['All 4 Exam Modes', 'Unlimited Practice', 'WPM Certificates', 'Skill Path', 'Leaderboard'].map(f => (
                  <span key={f} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-1 rounded-full">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center flex-shrink-0">
              <div className="flex items-baseline gap-1 justify-center mb-1">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹99</span>
                <span className="text-gray-400 text-sm">one-time</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">No subscription · Lifetime access</p>

              {/* Test mode notice */}
              {testOrderId && (
                <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-2 text-xs text-amber-700 dark:text-amber-400">
                  Test mode — Razorpay keys not configured
                </div>
              )}

              {testOrderId ? (
                <button
                  onClick={() => handleTestActivateAndStart(EXAM_PRESETS[0])}
                  disabled={payLoading}
                  className="w-full min-w-[220px] py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {payLoading ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Activating…</>
                  ) : 'Simulate Payment (Test)'}
                </button>
              ) : (
                <button
                  onClick={() => handlePayAndStartExam(EXAM_PRESETS[0])}
                  disabled={payLoading}
                  className="w-full min-w-[220px] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  {payLoading ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Connecting…</>
                  ) : (
                    <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    Pay ₹99 &amp; Unlock All Exams</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Exam cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {EXAM_PRESETS.map(exam => {
          const locked = userLoaded && !isPremium;
          return (
            <div
              key={exam.id}
              className={`rounded-2xl p-6 border shadow-sm flex flex-col gap-4 transition-all ${
                locked
                  ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-80'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{exam.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{exam.description}</p>
                </div>
                {locked && (
                  <span className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-full">
                    <FiLock size={11} /> Premium
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
                  <FiZap size={13} />{exam.targetWpm} WPM
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                  <FiClock size={13} />{exam.duration / 60} min
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                  {exam.layout.replace('_', ' ')}
                </span>
              </div>

              {locked ? (
                <button
                  onClick={() => handlePayAndStartExam(exam)}
                  disabled={payLoading}
                  className="mt-auto w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {payLoading ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Connecting…</>
                  ) : (
                    <><FiLock size={14} /> Buy & Start Exam</>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => startExam(exam)}
                  className="mt-auto w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Start Exam
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamModePage;

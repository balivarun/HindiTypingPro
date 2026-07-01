import { useState, useEffect, useRef, useCallback } from 'react';
import { TypingLayout, TypingStats, TimerOption } from '../types';
import { calculateStats } from '../utils/typingUtils';

type TestStatus = 'idle' | 'running' | 'finished';

interface UseTypingTestResult {
  typedText: string;
  status: TestStatus;
  stats: TypingStats;
  timeLeft: number;
  timeElapsed: number;
  currentIndex: number;
  wpmHistory: { time: number; wpm: number }[];
  keyMistakes: Record<string, number>;
  handleInput: (value: string) => void;
  resetTest: () => void;
  startTest: () => void;
}

export const useTypingTest = (
  paragraph: string,
  timerDuration: TimerOption,
  layout: TypingLayout
): UseTypingTestResult => {
  const [typedText, setTypedText] = useState('');
  const [status, setStatus] = useState<TestStatus>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0, cpm: 0, accuracy: 100, mistakes: 0,
    correctChars: 0, wrongChars: 0, totalChars: 0, timeElapsed: 0,
  });
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number }[]>([]);
  const [keyMistakes, setKeyMistakes] = useState<Record<string, number>>({});

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref so the interval can always read the latest computed stats (wpm)
  const statsRef = useRef<TypingStats>(stats);
  // Ref to track elapsed time inside the interval without stale closure
  const elapsedRef = useRef(0);
  // Ref to detect only forward keystrokes for mistake tracking
  const prevLengthRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const elapsed = elapsedRef.current;

      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          setStatus('finished');
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed(elapsed);

      // Record WPM snapshot every 5 seconds
      if (elapsed % 5 === 0) {
        setWpmHistory(prev => [...prev, { time: elapsed, wpm: statsRef.current.wpm }]);
      }
    }, 1000);
  }, [stopTimer]);

  const handleInput = useCallback((value: string) => {
    if (status === 'finished') return;

    if (status === 'idle') {
      setStatus('running');
      startTimer();
    }

    setTypedText(value);
    const elapsed = timerDuration - timeLeft + 1;
    const newStats = calculateStats(value, paragraph, elapsed);
    statsRef.current = newStats;
    setStats(newStats);

    // Track key mistakes using codepoint arrays (handles Devanagari combining chars)
    const typedArr = [...value.normalize('NFC')];
    const paraArr = [...paragraph.normalize('NFC')];
    if (typedArr.length > prevLengthRef.current && typedArr.length <= paraArr.length) {
      const lastPos = typedArr.length - 1;
      if (typedArr[lastPos] !== paraArr[lastPos]) {
        const missedChar = paraArr[lastPos];
        setKeyMistakes(prev => ({ ...prev, [missedChar]: (prev[missedChar] || 0) + 1 }));
      }
    }
    prevLengthRef.current = typedArr.length;

    if ([...value].length >= [...paragraph].length) {
      stopTimer();
      setStatus('finished');
    }
  }, [status, paragraph, timerDuration, timeLeft, startTimer, stopTimer]);

  const startTest = useCallback(() => {
    setStatus('running');
    startTimer();
  }, [startTimer]);

  const resetTest = useCallback(() => {
    stopTimer();
    setTypedText('');
    setStatus('idle');
    setTimeLeft(timerDuration);
    setTimeElapsed(0);
    setStats({ wpm: 0, cpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, wrongChars: 0, totalChars: 0, timeElapsed: 0 });
    setWpmHistory([]);
    setKeyMistakes({});
    elapsedRef.current = 0;
    prevLengthRef.current = 0;
    statsRef.current = { wpm: 0, cpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, wrongChars: 0, totalChars: 0, timeElapsed: 0 };
  }, [stopTimer, timerDuration]);

  useEffect(() => {
    resetTest();
  }, [paragraph, timerDuration, layout]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return {
    typedText,
    status,
    stats,
    timeLeft,
    timeElapsed,
    currentIndex: typedText.length,
    wpmHistory,
    keyMistakes,
    handleInput,
    resetTest,
    startTest,
  };
};

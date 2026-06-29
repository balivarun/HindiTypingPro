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
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0, cpm: 0, accuracy: 100, mistakes: 0,
    correctChars: 0, wrongChars: 0, totalChars: 0, timeElapsed: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          setStatus('finished');
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed(prev => prev + 1);
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
    setStats(newStats);

    if (value.length >= paragraph.length) {
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
    handleInput,
    resetTest,
    startTest,
  };
};

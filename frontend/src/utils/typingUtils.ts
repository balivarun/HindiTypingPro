import { TypingLayout, TypingStats } from '../types';
import { convertToKrutidev } from './krutidev';
import { convertToRemington } from './remington';
import { convertToInscript } from './inscript';

export const convertChar = (char: string, layout: TypingLayout): string => {
  switch (layout) {
    case 'KRUTIDEV': return convertToKrutidev(char);
    case 'REMINGTON_GAIL': return convertToRemington(char);
    case 'INSCRIPT': return convertToInscript(char);
    default: return char;
  }
};

export const calculateStats = (
  typed: string,
  original: string,
  timeElapsedSeconds: number
): TypingStats => {
  let correctChars = 0;
  let wrongChars = 0;
  let mistakes = 0;

  // Split into Unicode codepoints so Devanagari combining marks are handled correctly
  const typedChars = [...typed.normalize('NFC')];
  const origChars = [...original.normalize('NFC')];
  const len = Math.min(typedChars.length, origChars.length);

  for (let i = 0; i < len; i++) {
    if (typedChars[i] === origChars[i]) {
      correctChars++;
    } else {
      wrongChars++;
      mistakes++;
    }
  }

  const totalChars = typedChars.length;
  const minutes = timeElapsedSeconds / 60;
  const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
  const cpm = minutes > 0 ? Math.round(totalChars / minutes) : 0;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

  return { wpm, cpm, accuracy, mistakes, correctChars, wrongChars, totalChars, timeElapsed: timeElapsedSeconds };
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'BEGINNER': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    case 'INTERMEDIATE': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    case 'ADVANCED': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
    default: return 'text-gray-500 bg-gray-100';
  }
};

export const getLayoutLabel = (layout: TypingLayout): string => {
  switch (layout) {
    case 'KRUTIDEV': return 'Krutidev 010';
    case 'REMINGTON_GAIL': return 'Remington Gail';
    case 'INSCRIPT': return 'Hindi InScript';
    default: return layout;
  }
};

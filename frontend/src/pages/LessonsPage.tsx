import React, { useState } from 'react';
import { useTypingTest } from '../hooks/useTypingTest';
import TypingArea from '../components/typing/TypingArea';
import { formatTime } from '../utils/typingUtils';
import { FiClock, FiZap, FiTarget, FiChevronRight, FiCheckCircle, FiLock } from 'react-icons/fi';

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  level: number;
  paragraph: string;
  tips: string[];
}

const LESSONS: Lesson[] = [
  {
    id: 'home-row',
    title: 'Home Row Keys',
    subtitle: 'Foundation — अ, स, द, फ, ज, क, ल, ः',
    icon: '🏠',
    level: 1,
    paragraph: 'अ अ अ स स स द द द फ फ फ जज जज कक कक लल लल अस दफ जक ला अस दफ जकला',
    tips: [
      'रखें उंगलियाँ होम रो पर — ASDF JKL;',
      'बायाँ हाथ: अ स द फ (A S D F)',
      'दायाँ हाथ: ज क ल ः (J K L ;)',
      'अँगूठे से स्पेस बार दबाएँ',
    ],
  },
  {
    id: 'top-row',
    title: 'Top Row Keys',
    subtitle: 'Upper row — क्ष, त्र, ज्ञ, ट, य, उ, इ, ो',
    icon: '⬆️',
    level: 2,
    paragraph: 'ट ट ट य य य उ उ उ इ इ इ ो ो ो टय उइ ओ टयउ इओट युओ इटो',
    tips: [
      'ऊपर की पंक्ति के लिए उंगलियाँ होम रो से ऊपर जाएं',
      'टाइप करने के बाद होम रो पर वापस आएं',
      'नजर टेक्स्ट पर रखें, कीबोर्ड पर नहीं',
    ],
  },
  {
    id: 'bottom-row',
    title: 'Bottom Row Keys',
    subtitle: 'Lower row — ज्ञ, ब, न, म, क्ष, त्र',
    icon: '⬇️',
    level: 3,
    paragraph: 'ब ब ब न न न म म म बन मब नम बम नब मन बनम मबन नमब',
    tips: [
      'निचली पंक्ति के लिए उंगलियाँ नीचे जाएं',
      'रिदम बनाएं — तेज नहीं, सटीक टाइप करें',
      'शुद्धता पहले, गति बाद में',
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers & Symbols',
    subtitle: 'Number row practice',
    icon: '🔢',
    level: 4,
    paragraph: 'एक दो तीन चार पांच छह सात आठ नौ दस एक दो तीन चार पांच',
    tips: [
      'संख्याओं के लिए ऊपर की उंगलियाँ खिंचाव करें',
      'शिफ्ट कुंजी सही हाथ से दबाएं',
    ],
  },
  {
    id: 'special',
    title: 'Special Characters',
    subtitle: 'Matras, Anuswar, Visarg',
    icon: '✨',
    level: 5,
    paragraph: 'आ इ ई उ ऊ ए ऐ ओ औ अं अः अँ आई उई एओ औई',
    tips: [
      'मात्राओं का अभ्यास ध्यान से करें',
      'हिंदी में सही मात्रा टाइप करना जरूरी है',
      'अनुनासिक और विसर्ग पर विशेष ध्यान दें',
    ],
  },
  {
    id: 'full-practice',
    title: 'Full Speed Practice',
    subtitle: 'Complete sentences from exam passages',
    icon: '🚀',
    level: 6,
    paragraph: 'भारत एक लोकतांत्रिक गणराज्य है। यहाँ सभी नागरिकों को समान अधिकार प्राप्त हैं। न्याय, स्वतंत्रता और समानता हमारे मूल अधिकार हैं। नियमित अभ्यास से गति और शुद्धता दोनों में सुधार होता है।',
    tips: [
      'अब पूर्ण वाक्यों का अभ्यास करें',
      'SSC-स्तर की गति लक्ष्य करें: 25+ WPM',
      'हर गलती से सीखें',
    ],
  },
];

const LESSON_LS_KEY = 'htp_lesson_progress';

const getLessonProgress = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(LESSON_LS_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const markLessonDone = (id: string) => {
  const progress = getLessonProgress();
  progress[id] = true;
  localStorage.setItem(LESSON_LS_KEY, JSON.stringify(progress));
};

const LessonPractice = ({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) => {
  const { typedText, status, stats, timeLeft, currentIndex, handleInput, resetTest } =
    useTypingTest(lesson.paragraph, 60, 'KRUTIDEV');

  if (status === 'finished') {
    markLessonDone(lesson.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          ← Back
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.icon} {lesson.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.subtitle}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Tips</h3>
        <ul className="space-y-1">
          {lesson.tips.map((tip, i) => (
            <li key={i} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {status === 'finished' ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lesson Complete!</h3>
          <div className="flex justify-center gap-8 text-sm">
            <div><div className="text-2xl font-bold text-primary-600">{stats.wpm}</div><div className="text-gray-400">WPM</div></div>
            <div><div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div><div className="text-gray-400">Accuracy</div></div>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={resetTest} className="px-5 py-2.5 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              Retry
            </button>
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
              Next Lesson
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <FiClock className="text-primary-500" size={20} />
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white font-mono">{formatTime(timeLeft)}</div>
                <div className="text-xs text-gray-400">Time Left</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <FiZap className="text-orange-500" size={20} />
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.wpm}</div>
                <div className="text-xs text-gray-400">WPM</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <FiTarget className="text-green-500" size={20} />
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.accuracy}%</div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>
          <TypingArea
            paragraph={lesson.paragraph}
            typedText={typedText}
            currentIndex={currentIndex}
            onInput={handleInput}
            isFinished={false}
            layout="INSCRIPT"
          />
          {status === 'idle' && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Click the text area and start typing</p>
          )}
        </div>
      )}
    </div>
  );
};

const LessonsPage = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const progress = getLessonProgress();

  if (activeLesson) {
    return <LessonPractice lesson={activeLesson} onBack={() => setActiveLesson(null)} />;
  }

  const completedCount = LESSONS.filter(l => progress[l.id]).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Typing Lessons</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Guided curriculum — from home row to full speed</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Your Progress</span>
          <span className="text-gray-500 dark:text-gray-400">{completedCount} / {LESSONS.length} lessons</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson cards */}
      <div className="space-y-3">
        {LESSONS.map((lesson, idx) => {
          const done = progress[lesson.id];
          const locked = idx > 0 && !progress[LESSONS[idx - 1].id];
          return (
            <button
              key={lesson.id}
              onClick={() => !locked && setActiveLesson(lesson)}
              disabled={locked}
              className={`w-full text-left rounded-2xl p-5 border transition-all flex items-center gap-4 ${
                done
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : locked
                  ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                done ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {locked ? <FiLock className="text-gray-400" size={20} /> : done ? '✅' : lesson.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{lesson.title}</span>
                  <span className="text-xs text-gray-400">Level {lesson.level}</span>
                  {done && <FiCheckCircle className="text-green-500" size={14} />}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{lesson.subtitle}</div>
              </div>
              {!locked && <FiChevronRight className="text-gray-400 flex-shrink-0" size={18} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LessonsPage;

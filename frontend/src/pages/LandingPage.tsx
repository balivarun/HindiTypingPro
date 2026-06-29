import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiTarget, FiAward, FiUsers } from 'react-icons/fi';

const features = [
  { icon: <FiZap size={28} />, title: 'Real-time Feedback', desc: 'Instant character-by-character matching with color-coded highlights' },
  { icon: <FiTarget size={28} />, title: '3 Typing Layouts', desc: 'Krutidev 010, Remington Gail, and Hindi InScript layouts' },
  { icon: <FiAward size={28} />, title: 'Leaderboard', desc: 'Compete with others and track your ranking by speed and accuracy' },
  { icon: <FiUsers size={28} />, title: 'Exam Ready', desc: 'SSC, HSSC, Court exams — curated passages at multiple difficulty levels' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block text-8xl font-bold text-primary-600 dark:text-primary-400 font-hindi mb-4">
            हिं
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            HindiTypingPro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            सरकारी परीक्षाओं के लिए हिंदी टाइपिंग अभ्यास मंच।
            SSC, HSSC, Court Typing परीक्षाओं की तैयारी करें।
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-2xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-primary-900"
            >
              Start Free Practice
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 text-lg font-semibold rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="text-primary-600 dark:text-primary-400 mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            परीक्षा के लिए तैयार हो जाएं
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              { value: '3', label: 'Typing Layouts' },
              { value: '3', label: 'Difficulty Levels' },
              { value: '3', label: 'Timer Options' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
                <div className="text-gray-500 dark:text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

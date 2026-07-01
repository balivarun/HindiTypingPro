import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LanguageContext';
import { FiSun, FiMoon, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 font-hindi">ह</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">HindiTypingPro</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm">
                  {t('dashboard')}
                </Link>
                <Link to="/practice" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm">
                  {t('practice')}
                </Link>
                <Link to="/lessons" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm">
                  {t('lessons')}
                </Link>
                <Link to="/exam" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm">
                  {t('examMode')}
                </Link>
                <Link to="/skill-path" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm">
                  {t('skillPath')}
                </Link>
                <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm">
                  {t('history')}
                </Link>
                <Link to="/leaderboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm">
                  {t('leaderboard')}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-accent-500 hover:text-accent-600 font-medium transition-colors text-sm">
                    {t('admin')}
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-hindi"
              title={lang === 'en' ? 'Switch to Hindi UI' : 'Switch to English UI'}
            >
              {lang === 'en' ? 'हि' : 'EN'}
            </button>

            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FiUser size={16} />
                  <span className="hidden sm:inline font-medium text-sm">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline text-sm">{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors text-sm">
                  {t('login')}
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm">
                  {t('register')}
                </Link>
              </div>
            )}

            <button className="md:hidden p-2 text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        {menuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-700 py-2 flex flex-col">
            {[
              { to: '/dashboard', label: t('dashboard') },
              { to: '/practice', label: t('practice') },
              { to: '/lessons', label: t('lessons') },
              { to: '/exam', label: t('examMode') },
              { to: '/skill-path', label: t('skillPath') },
              { to: '/history', label: t('history') },
              { to: '/leaderboard', label: t('leaderboard') },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-accent-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                {t('admin')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

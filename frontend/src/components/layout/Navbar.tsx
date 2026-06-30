import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 font-hindi">
              ह
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">HindiTypingPro</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/practice" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  Practice
                </Link>
                <Link to="/exam" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  Exam Mode
                </Link>
                <Link to="/skill-path" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  Skill Path
                </Link>
                <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  History
                </Link>
                <Link to="/leaderboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  Leaderboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-accent-500 hover:text-accent-600 font-medium transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FiUser size={16} />
                  <span className="hidden sm:inline font-medium">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                  Register
                </Link>
              </div>
            )}

            <button className="md:hidden p-2 text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        {menuOpen && isAuthenticated && (
          <div className="md:hidden pb-3 flex flex-col gap-2">
            <Link to="/dashboard" className="px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/practice" className="px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Practice</Link>
            <Link to="/exam" className="px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Exam Mode</Link>
            <Link to="/skill-path" className="px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Skill Path</Link>
            <Link to="/history" className="px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>History</Link>
            <Link to="/leaderboard" className="px-3 py-2 text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
            {isAdmin && <Link to="/admin" className="px-3 py-2 text-accent-500" onClick={() => setMenuOpen(false)}>Admin</Link>}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

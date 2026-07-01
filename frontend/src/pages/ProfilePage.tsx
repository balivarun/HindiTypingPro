import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatCard from '../components/ui/StatCard';
import { FiUser, FiMail, FiShield, FiCalendar, FiZap, FiTarget, FiActivity, FiBell, FiBellOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EXAM_TYPES = ['SSC CGL / CHSL', 'HSSC (Haryana SSC)', 'Court Typing', 'DSSSB', 'Other'];
const LS_REMINDER_KEY = 'htp_reminder';

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [examType, setExamType] = useState('');
  const [examDate, setExamDate] = useState('');
  const [savingExam, setSavingExam] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(() => {
    return localStorage.getItem(LS_REMINDER_KEY) === 'true';
  });

  useEffect(() => {
    userService.getProfile().then(p => {
      setProfile(p);
      if (p.examType) setExamType(p.examType);
      if (p.examDate) setExamDate(p.examDate);
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveExamInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examType || !examDate) return;
    setSavingExam(true);
    try {
      const updated = await userService.updateExamInfo(examType, examDate);
      setProfile(updated);
      toast.success('Exam info saved!');
    } catch {
      toast.error('Failed to save exam info');
    } finally {
      setSavingExam(false);
    }
  };

  const handleToggleReminder = async () => {
    if (!reminderEnabled) {
      if (!('Notification' in window)) {
        toast.error('Browser notifications not supported');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Notification permission denied');
        return;
      }
      localStorage.setItem(LS_REMINDER_KEY, 'true');
      setReminderEnabled(true);
      new Notification('HindiTypingPro Reminder', {
        body: 'Daily practice reminders enabled! We will remind you to practice at 8 PM.',
        icon: '/favicon.ico',
      });
      toast.success('Daily reminders enabled!');
    } else {
      localStorage.removeItem(LS_REMINDER_KEY);
      setReminderEnabled(false);
      toast.success('Reminders disabled');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                profile.role === 'ADMIN'
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {profile.role}
              </span>
              {profile.isPremium && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <FiMail className="text-gray-400" size={20} />
            <div>
              <div className="text-xs text-gray-400">Email</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{profile.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <FiShield className="text-gray-400" size={20} />
            <div>
              <div className="text-xs text-gray-400">Role</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{profile.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <FiCalendar className="text-gray-400" size={20} />
            <div>
              <div className="text-xs text-gray-400">Member Since</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <FiActivity className="text-gray-400" size={20} />
            <div>
              <div className="text-xs text-gray-400">Total Tests</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{profile.totalTests ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Best Speed" value={profile.bestSpeed ?? 0} icon={<FiZap />} color="text-orange-500" suffix="WPM" />
        <StatCard label="Avg Speed" value={profile.averageSpeed ?? 0} icon={<FiActivity />} color="text-primary-600" suffix="WPM" />
        <StatCard label="Avg Accuracy" value={`${profile.averageAccuracy ?? 0}%`} icon={<FiTarget />} color="text-green-500" />
      </div>

      {/* Exam date setting */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <FiCalendar className="text-indigo-500" /> Exam Countdown Setup
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Set your exam date to see a live countdown on your dashboard.
        </p>
        <form onSubmit={handleSaveExamInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Exam Type</label>
              <select
                value={examType}
                onChange={e => setExamType(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select exam…</option>
                {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingExam}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {savingExam ? 'Saving…' : 'Save Exam Info'}
          </button>
        </form>
      </div>

      {/* Daily reminder */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {reminderEnabled ? <FiBell className="text-green-500" /> : <FiBellOff className="text-gray-400" />}
              Daily Practice Reminder
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {reminderEnabled
                ? 'Browser notifications are enabled. You will be reminded to practice daily.'
                : 'Enable browser notifications to get a daily reminder to practice typing.'}
            </p>
          </div>
          <button
            onClick={handleToggleReminder}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              reminderEnabled
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {reminderEnabled ? 'Disable Reminders' : 'Enable Reminders'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

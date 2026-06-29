import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatCard from '../components/ui/StatCard';
import { FiUser, FiMail, FiShield, FiCalendar, FiZap, FiTarget, FiActivity } from 'react-icons/fi';

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile().then(setProfile).finally(() => setLoading(false));
  }, []);

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
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
              profile.role === 'ADMIN'
                ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {profile.role}
            </span>
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
    </div>
  );
};

export default ProfilePage;

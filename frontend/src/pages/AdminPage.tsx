import React, { useEffect, useState } from 'react';
import { adminService } from '../services/userService';
import { testService } from '../services/testService';
import { TypingTest, User } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiBook } from 'react-icons/fi';

const AdminPage = () => {
  const [tests, setTests] = useState<TypingTest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<'tests' | 'users'>('tests');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTest, setEditTest] = useState<TypingTest | null>(null);
  const [form, setForm] = useState({ title: '', paragraph: '', difficulty: 'BEGINNER' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, u] = await Promise.all([testService.getAllTests(), adminService.getAllUsers()]);
        setTests(t);
        setUsers(u);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTest) {
        const updated = await adminService.updateTest(editTest.id, form);
        setTests(prev => prev.map(t => t.id === editTest.id ? updated : t));
        toast.success('Test updated');
      } else {
        const created = await adminService.createTest(form);
        setTests(prev => [created, ...prev]);
        toast.success('Test created');
      }
      setShowForm(false);
      setEditTest(null);
      setForm({ title: '', paragraph: '', difficulty: 'BEGINNER' });
    } catch {
      toast.error('Failed to save test');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTest = async (id: number) => {
    if (!confirm('Delete this test?')) return;
    try {
      await adminService.deleteTest(id);
      setTests(prev => prev.filter(t => t.id !== id));
      toast.success('Test deleted');
    } catch {
      toast.error('Failed to delete test');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('tests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${tab === 'tests' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          <FiBook size={16} /> Tests ({tests.length})
        </button>
        <button
          onClick={() => setTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${tab === 'users' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          <FiUsers size={16} /> Users ({users.length})
        </button>
      </div>

      {tab === 'tests' && (
        <div className="space-y-4">
          <button
            onClick={() => { setShowForm(true); setEditTest(null); setForm({ title: '', paragraph: '', difficulty: 'BEGINNER' }); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
          >
            <FiPlus /> Add New Test
          </button>

          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{editTest ? 'Edit Test' : 'New Test'}</h3>
              <form onSubmit={handleSaveTest} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  placeholder="Hindi paragraph..."
                  value={form.paragraph}
                  onChange={e => setForm(f => ({ ...f, paragraph: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-hindi text-lg resize-none"
                />
                <select
                  value={form.difficulty}
                  onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {tests.map(test => (
              <div key={test.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{test.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      test.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-600' :
                      test.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>{test.difficulty}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-hindi line-clamp-2">{test.paragraph}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditTest(test); setForm({ title: test.title, paragraph: test.paragraph, difficulty: test.difficulty }); setShowForm(true); }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Joined</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4">
                    {user.role !== 'ADMIN' && (
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

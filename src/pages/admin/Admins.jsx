import React, { useEffect, useState } from 'react';
import { createAdmin, getAdminList, changeAdminPassword } from '../../utils/api';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordUpdates, setPasswordUpdates] = useState({});
  const [changingId, setChangingId] = useState(null);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await getAdminList();
        setAdmins(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError(err.message || 'Could not load admin users.');
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const refreshAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAdminList();
      setAdmins(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not refresh admin list.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!newEmail || !newPassword) {
      setError('Email and password are required to create a new admin.');
      return;
    }

    try {
      await createAdmin({ email: newEmail, password: newPassword });
      setSuccess('New admin account created successfully.');
      setNewEmail('');
      setNewPassword('');
      refreshAdmins();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create admin.');
    }
  };

  const handlePasswordChange = async (id) => {
    const password = passwordUpdates[id];
    if (!password || password.length < 8) {
      setError('Please supply a password with at least 8 characters.');
      return;
    }

    try {
      setChangingId(id);
      await changeAdminPassword(id, password);
      setSuccess('Password updated successfully.');
      setPasswordUpdates((prev) => ({ ...prev, [id]: '' }));
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to update password.');
    } finally {
      setChangingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 display-serif">Admin Management</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Add secure admin users and reset passwords for existing platform administrators.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 border border-slate-200 px-6 py-4 text-slate-900">
            <p className="text-xs uppercase tracking-[0.35em] font-semibold text-slate-500">Admin accounts</p>
            <p className="text-3xl font-black mt-2">{loading ? '...' : admins.length}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[2rem] bg-rose-50 border border-rose-100 p-6 text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-[2rem] bg-emerald-50 border border-emerald-100 p-6 text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_0.7fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Existing Admins</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-500">
                Loading admin list...
              </div>
            ) : admins.length === 0 ? (
              <div className="py-14 text-center text-slate-500">No admins found.</div>
            ) : (
              admins.map((admin) => (
                <div key={admin._id} className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-slate-900 font-semibold">{admin.email}</p>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mt-1">Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="New password"
                        value={passwordUpdates[admin._id] || ''}
                        onChange={(e) => setPasswordUpdates((prev) => ({ ...prev, [admin._id]: e.target.value }))}
                        className="w-full sm:w-64 px-4 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                      <button
                        onClick={() => handlePasswordChange(admin._id)}
                        disabled={changingId === admin._id}
                        className="px-5 py-3 bg-amber-500 text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-amber-600 transition-all disabled:opacity-50"
                      >
                        {changingId === admin._id ? 'Saving...' : 'Reset Password'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Create a New Admin</h2>
          <form className="space-y-5" onSubmit={handleCreateAdmin}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Email address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-3xl font-semibold uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-amber-300/30 transition-all"
            >
              Create Admin Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admins;

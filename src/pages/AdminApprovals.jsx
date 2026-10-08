import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, LogOut, ShieldCheck } from 'lucide-react';
import { API_URL } from '../api';

export default function AdminApprovals() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const me = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const authHeaders = { Authorization: `Bearer ${token}` };

  const loadPending = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/pending`, { headers: authHeaders });
      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch {
      setError('Cannot reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || me?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadPending();
  }, []);

  const act = async (id, action) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/${action}`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Action failed.');
        return;
      }
      setUsers((list) => list.filter((u) => u._id !== id));
    } catch {
      setError('Cannot reach the server.');
    }
  };

  return (
    <div className="relative min-h-screen w-full p-4 sm:p-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/sdmcet-campus.jpg')` }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Account Approvals</h1>
              <p className="text-xs text-slate-300">Signed in as {me?.name} (Administrator)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/home"
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20"
            >
              Go to portal
            </Link>
            <button
              onClick={logout}
              title="Sign out"
              className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200">
            {error}
          </div>
        )}

        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-sm font-bold mb-4">Pending requests ({users.length})</h2>

          {loading ? (
            <p className="text-xs text-slate-300">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-xs text-slate-300">No pending requests right now.</p>
          ) : (
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u._id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div>
                    <div className="text-sm font-semibold">{u.name}</div>
                    <div className="text-xs text-slate-300">{u.email}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Requested {new Date(u.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => act(u._id, 'approve')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => act(u._id, 'reject')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
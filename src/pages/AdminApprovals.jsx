import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  LogOut,
  Clock,
  MailCheck,
  AlertTriangle,
  RotateCw,
  RefreshCw,
  Users,
  UserCheck,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { API_URL } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminApprovals() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const token = localStorage.getItem('token');
  const me = JSON.parse(localStorage.getItem('user') || 'null');
  const { signOut } = useAuth();

  const logout = () => {
    signOut();
    navigate('/login');
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadData = async () => {
    setError('');
    setLoading(true);
    try {
      const [resPending, resApproved] = await Promise.all([
        fetch(`${API_URL}/admin/pending`, { headers: authHeaders }),
        fetch(`${API_URL}/admin/approved`, { headers: authHeaders }),
      ]);

      if (
        resPending.status === 401 ||
        resPending.status === 403 ||
        resApproved.status === 401 ||
        resApproved.status === 403
      ) {
        logout();
        return;
      }

      const dataPending = await resPending.json();
      const dataApproved = await resApproved.json();

      setPendingUsers(Array.isArray(dataPending) ? dataPending : []);
      setApprovedUsers(Array.isArray(dataApproved) ? dataApproved : []);
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
    loadData();
  }, []);

  const approveUser = async (id) => {
    setActionLoadingId(id);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/approve`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Approval failed.');
        return;
      }
      setMessage(data.message || 'Account approved successfully.');

      setPendingUsers((list) => list.filter((u) => u._id !== id));
      if (data.user) {
        setApprovedUsers((list) => [data.user, ...list.filter((u) => u._id !== id)]);
      }
    } catch {
      setError('Cannot reach server to approve user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const rejectUser = async (id) => {
    setActionLoadingId(id);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/reject`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Reject action failed.');
        return;
      }
      setMessage('Registration request rejected.');
      setPendingUsers((list) => list.filter((u) => u._id !== id));
    } catch {
      setError('Cannot reach server.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const resendEmail = async (id) => {
    setActionLoadingId(id);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/resend-email`, {
        method: 'POST',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to resend approval email.');
        return;
      }
      setMessage(data.message || 'Approval email resent.');
      if (data.user) {
        setApprovedUsers((list) => list.map((u) => (u._id === id ? data.user : u)));
      }
    } catch {
      setError('Cannot reach server to resend email.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full p-4 sm:p-8 select-none">
      {/* Background with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/sdmcet-campus.jpg')` }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-white">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg p-1 overflow-hidden shrink-0">
              <img src="/sdmcet-logo.png" alt="SDMCET Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Faculty Account Approvals & Governance</h1>
              <p className="text-xs text-slate-300">
                Logged in as <strong>{me?.name || 'Administrator'}</strong> ({me?.email || 'rukminibanagar@gmail.com'})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh lists"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/home"
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              Go to portal
            </Link>
            <button
              onClick={logout}
              title="Sign out"
              className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status / Feedback Banners */}
        {message && (
          <div className="mb-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3.5 bg-red-500/20 border border-red-500/40 rounded-2xl text-xs text-red-200 flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-300 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Governance Card */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending Requests ({pendingUsers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('approved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Approved Accounts ({approvedUsers.length})</span>
            </button>
          </div>

          {/* TAB 1: Pending Requests */}
          {activeTab === 'pending' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Awaiting Review ({pendingUsers.length})</span>
                </h2>
                <span className="text-xs text-slate-400">
                  Approving an account updates status in MongoDB & sends an email notification.
                </span>
              </div>

              {loading ? (
                <p className="text-xs text-slate-400 py-6 text-center">Loading pending requests...</p>
              ) : pendingUsers.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 space-y-1">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-white">All caught up!</p>
                  <p className="text-xs">No pending faculty registration requests in MongoDB.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {pendingUsers.map((u) => (
                    <li
                      key={u._id}
                      className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{u.name}</span>
                          {u.department && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {u.department}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Requested: {new Date(u.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => approveUser(u._id)}
                          disabled={actionLoadingId === u._id}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer shadow-md disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>{actionLoadingId === u._id ? 'Approving...' : 'Approve & Notify'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectUser(u._id)}
                          disabled={actionLoadingId === u._id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* TAB 2: Approved Accounts & Email Delivery Status */}
          {activeTab === 'approved' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Approved Accounts & Email Delivery Status ({approvedUsers.length})</span>
                </h2>
                <span className="text-xs text-slate-400">
                  Real-time MongoDB status & email delivery telemetry.
                </span>
              </div>

              {loading ? (
                <p className="text-xs text-slate-400 py-6 text-center">Loading approved accounts...</p>
              ) : approvedUsers.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 space-y-1">
                  <Users className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-white">No approved accounts yet</p>
                  <p className="text-xs">Once you approve pending requests, they will appear here.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {approvedUsers.map((u) => (
                    <li
                      key={u._id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/[0.08] transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* User Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{u.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Active / Approved
                            </span>
                            {u.department && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300 border border-white/15 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-orange-400" />
                                {u.department}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-300 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Approved: {u.approvedAt ? new Date(u.approvedAt).toLocaleString() : 'Yes'}
                          </div>
                        </div>

                        {/* Email Status & Resend Button */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Email Delivery Badge */}
                          {u.emailDeliveryStatus === 'sent' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <MailCheck className="w-3.5 h-3.5" />
                              <span>Email Delivered</span>
                            </span>
                          )}

                          {u.emailDeliveryStatus === 'failed' && (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40"
                              title={u.emailDeliveryError || 'Failed to send'}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Email Delivery Failed</span>
                            </span>
                          )}

                          {(!u.emailDeliveryStatus || u.emailDeliveryStatus === 'not_sent') && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300 border border-white/20">
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email Not Sent</span>
                            </span>
                          )}

                          {/* Resend Email Button */}
                          <button
                            type="button"
                            onClick={() => resendEmail(u._id)}
                            disabled={actionLoadingId === u._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <RotateCw
                              className={`w-3.5 h-3.5 ${actionLoadingId === u._id ? 'animate-spin' : ''}`}
                            />
                            <span>{actionLoadingId === u._id ? 'Sending...' : 'Resend Approval Email'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Display delivery error explanation if present */}
                      {u.emailDeliveryStatus === 'failed' && u.emailDeliveryError && (
                        <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-[11px] text-red-300">
                          <strong>Delivery Note:</strong> {u.emailDeliveryError}. The user is approved and can still log in without issue.
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
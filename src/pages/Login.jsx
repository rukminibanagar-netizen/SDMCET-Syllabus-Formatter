import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  MailCheck,
} from 'lucide-react';
import { API_URL } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [role, setRole] = useState('faculty');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check Approval Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusEmail, setStatusEmail] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide institutional email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed.');
        return;
      }
      signIn(data.token, data.user);
    } catch {
      setError('Cannot reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = () => {
    if (email) setStatusEmail(email);
    setStatusError('');
    setStatusResult(null);
    setShowStatusModal(true);
  };

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!statusEmail) {
      setStatusError('Please enter your institutional email.');
      return;
    }
    setStatusError('');
    setStatusResult(null);
    setStatusLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/check-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: statusEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          setStatusResult({ exists: false, status: 'not_found', message: data.message });
          return;
        }
        setStatusError(data.message || 'Failed to retrieve approval status.');
        return;
      }
      setStatusResult(data);
    } catch {
      setStatusError('Cannot connect to server. Please verify backend is running.');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 select-none">
      {/* 1. Full-Screen SDMCET Campus Background with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/sdmcet-campus.jpg')` }}
      >
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
      </div>

      {/* 2. Middle-Aligned Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white flex items-center justify-center shadow-lg p-1.5 overflow-hidden">
            <img src="/sdmcet-logo.png" alt="SDMCET Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SDMCET Syllabus Formatter Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Shri Dharmasthala Manjunatheshwara College of Engineering & Technology, Dharwad
          </p>
        </div>

        {/* Validation / Status Error Message */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            {error.includes('awaiting administrator approval') && (
              <button
                type="button"
                onClick={openStatusModal}
                className="text-[11px] text-orange-300 hover:text-white underline font-semibold block pt-1"
              >
                Click here to check your real-time approval status →
              </button>
            )}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Academic Role Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Academic Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-slate-800"
            >
              <option value="faculty" className="text-slate-900">Faculty</option>
              <option value="admin" className="text-slate-900">Administrator</option>
            </select>
          </div>

          {/* Institutional Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty_cse@sdmcet.ac.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Enter Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <span>{loading ? 'Signing in...' : 'Login/Signup'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Actions: Check Status & Request Account */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300">
          <button
            type="button"
            onClick={openStatusModal}
            className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Check Approval Status</span>
          </button>
          <div>
            New faculty member?{' '}
            <Link to="/signup" className="text-orange-400 font-semibold hover:underline">
              Request account
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Check Approval Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Check Approval Status</h3>
                  <p className="text-[11px] text-slate-400">Verify your registration status in MongoDB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Query Form */}
            <form onSubmit={handleCheckStatus} className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={statusEmail}
                    onChange={(e) => setStatusEmail(e.target.value)}
                    placeholder="faculty_cse@sdmcet.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {statusError && (
                <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200">
                  {statusError}
                </div>
              )}

              <button
                type="submit"
                disabled={statusLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {statusLoading ? (
                  <span>Checking database...</span>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Check Status</span>
                  </>
                )}
              </button>
            </form>

            {/* Status Result Display */}
            {statusResult && (
              <div className="mt-3 p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3 animate-fadeIn">
                {/* 1. Pending Status */}
                {statusResult.status === 'pending' && (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Status: Awaiting Administrator Approval</span>
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed space-y-1">
                      <p>
                        Account registered for <strong>{statusResult.name}</strong> ({statusResult.department || 'Faculty'}).
                      </p>
                      <p className="text-slate-300 text-[11px]">
                        Your request was registered on {new Date(statusResult.createdAt).toLocaleDateString()} and is currently pending review by the administrator. Once approved, an automated confirmation email will be sent to <strong>{statusResult.email}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Approved Status */}
                {statusResult.status === 'approved' && (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Status: Approved & Active</span>
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed space-y-1">
                      <p>
                        Welcome, <strong>{statusResult.name}</strong>! Your account has been reviewed and approved.
                      </p>
                      <p className="text-slate-300 text-[11px]">
                        You have full access to the Syllabus Formatter Studio. You may now sign in using your password.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(statusResult.email);
                        setShowStatusModal(false);
                      }}
                      className="w-full mt-1 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Proceed to Log In</span>
                    </button>
                  </div>
                )}

                {/* 3. Rejected Status */}
                {statusResult.status === 'rejected' && (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Status: Account Request Rejected</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Your registration request was rejected by the administrator. If you believe this is an error, please contact the administrator at <a href="mailto:rukminibanagar@gmail.com" className="text-orange-400 underline">rukminibanagar@gmail.com</a>.
                    </p>
                  </div>
                )}

                {/* 4. Not Found */}
                {statusResult.status === 'not_found' && (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No Account Found</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      No registered account exists with this email address. Please click below to request an account.
                    </p>
                    <Link
                      to="/signup"
                      className="inline-block mt-1 text-xs font-semibold text-orange-400 hover:underline"
                    >
                      Request a faculty account →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
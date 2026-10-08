import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { API_URL } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('faculty');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const u = data.user;
navigate(u.role === 'admin' ? '/admin' : u.termsAccepted ? '/home' : '/terms');
    } catch {
      setError('Cannot reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
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
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SDMCET Syllabus Formatter Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Shri Dharmasthala Manjunatheshwara College of Engineering & Technology, Dharwad
          </p>
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Academic Role Dropdown: Only Faculty and Administrator */}
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
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
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
<p className="text-center text-xs text-slate-300 mt-5">
  New faculty member?{' '}
  <Link to="/signup" className="text-orange-400 font-semibold hover:underline">
    Request an account
  </Link>
</p>
      </div>
    </div>
  );
}
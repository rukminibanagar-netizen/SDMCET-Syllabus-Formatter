import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Home, Info, HelpCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Hide on login & terms pages
  if (['/', '/login', '/signup', '/terms', '/admin'].includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base sm:text-lg leading-tight tracking-tight">
                SDMCET <span className="text-orange-400 font-semibold">Syllabus Formatter</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Autonomous Curriculum Engineering
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/home"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive('/home')
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>

            <Link
              to="/ug"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname.startsWith('/ug')
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> UG (8 Departments)
            </Link>

            <Link
              to="/pg"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname.startsWith('/pg')
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> PG (6 Programmes)
            </Link>

            <button
              onClick={() => alert("SDMCET Syllabus Formatter\nDepartment of Computer Science & Engineering\nUnder Guidance of Dr. R. G. Yadawad")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Info className="w-4 h-4" /> About
            </button>

            <button
              onClick={() => alert("Instructions:\n1. Choose UG or PG department.\n2. Enter syllabus parameters (COs, Units, Books) or upload document.\n3. Automatic OBE mapping calculates averages.\n4. View and print the formatted SDMCET syllabus.")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10"
            >
              <HelpCircle className="w-4 h-4" /> Help
            </button>
          </nav>

          {/* User Signout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{user?.name || 'Faculty / Author'}</div>
              <div className="text-[10px] text-slate-400">SDMCET Dharwad</div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
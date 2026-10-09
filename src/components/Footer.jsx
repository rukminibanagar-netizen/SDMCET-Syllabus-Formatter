import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  if (['/', '/login', '/signup', '/admin'].includes(location.pathname)) return null;

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">
          Shri Dharmasthala Manjunatheshwara College of Engineering & Technology, Dharwad – 580 002
        </p>
        <p>
          (An Autonomous Institution Approved by AICTE & Affiliated to VTU, Belagavi | Accredited by NBA & NAAC)
        </p>
        <p className="text-slate-400 text-[11px] pt-1">
          Minor Project - I (22UCSL505) • Design and Development of Syllabus Formatter for SDMCET
        </p>
      </div>
    </footer>
  );
}
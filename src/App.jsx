import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Home from './pages/Home';
import AdminApprovals from './pages/AdminApprovals';

function Shell() {
  const { pathname } = useLocation();
  // The home page is a full-width hero, so it skips the centred content box and the footer
  const isHome = pathname === '/home';

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed relative text-slate-800"
      style={{ backgroundImage: `url('/sdmcet-campus.jpg')` }}
    >
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <main
          className={
            isHome
              ? 'flex-grow w-full'
              : 'flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full'
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminApprovals />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!isHome && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

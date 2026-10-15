import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicOnly, RequireAuth } from './components/RouteGuards';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Home from './pages/Home';
import UGCourses from './pages/UGCourses';
import PGCourses from './pages/PGCourses';
import SyllabusStudio from './pages/SyllabusStudio';
import AdminApprovals from './pages/AdminApprovals';
import About from './pages/About';
import Help from './pages/Help';

function Shell() {
  const { pathname } = useLocation();
  // The home page is a full-width hero, so it skips the centred content box and the footer
  const isHome = pathname === '/home';
  const isFullWidth = ['/', '/login', '/signup', '/terms', '/home', '/admin'].includes(pathname);

  return (
    <div
      className="app-shell min-h-screen flex flex-col bg-cover bg-center bg-fixed relative text-slate-800"
      style={{ backgroundImage: `url('/sdmcet-campus.jpg')` }}
    >
      {/* Dark tint overlay */}
      <div className="no-print absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <main
          className={
            isFullWidth
              ? 'flex-grow w-full flex flex-col'
              : 'flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full'
          }
        >
          <Routes>
            {/* Signed-out pages */}
            <Route path="/" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

            {/* Faculty, first sign-in only */}
            <Route
              path="/terms"
              element={<RequireAuth role="faculty" termsPending><Terms /></RequireAuth>}
            />

            {/* Signed-in pages (faculty must have accepted the terms) */}
            <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
            {/* UG and PG: departments, then semesters, then schemes (each is its own page) */}
            <Route path="/ug" element={<RequireAuth><UGCourses /></RequireAuth>} />
            <Route path="/ug/:deptId" element={<RequireAuth><UGCourses /></RequireAuth>} />
            <Route path="/ug/:deptId/semester/:sem" element={<RequireAuth><UGCourses /></RequireAuth>} />
            <Route path="/pg" element={<RequireAuth><PGCourses /></RequireAuth>} />
            <Route path="/pg/:deptId" element={<RequireAuth><PGCourses /></RequireAuth>} />
            <Route path="/pg/:deptId/semester/:sem" element={<RequireAuth><PGCourses /></RequireAuth>} />
            <Route
              path="/syllabus/:category/:deptId/:sem/:schemeId"
              element={<RequireAuth><SyllabusStudio /></RequireAuth>}
            />

            {/* About and Help (the navbar links) */}
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />

            {/* Admin only */}
            <Route path="/admin" element={<RequireAuth role="admin"><AdminApprovals /></RequireAuth>} />

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
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Where each kind of person should land after signing in
export function homeFor(user) {
  if (user.role === 'admin') return '/admin';
  return user.termsAccepted ? '/home' : '/terms';
}

function Checking() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-200">
      Checking your session...
    </div>
  );
}

// For pages only signed-out people should see (login, sign up).
// Someone who is already signed in is sent to their own home page instead.
export function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Checking />;
  if (user) return <Navigate to={homeFor(user)} replace />;
  return children;
}

// For pages that need a signed-in person.
//   role         -> only this role may open the page (otherwise sent to their own home)
//   termsPending -> page is only for faculty who have not yet accepted the terms
// Every other page also makes faculty accept the terms first. Admins skip the terms.
export function RequireAuth({ children, role, termsPending = false }) {
  const { user, loading } = useAuth();

  if (loading) return <Checking />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;

  if (termsPending) {
    if (user.termsAccepted) return <Navigate to={homeFor(user)} replace />;
    return children;
  }

  if (user.role === 'faculty' && !user.termsAccepted) return <Navigate to="/terms" replace />;
  return children;
}

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { API_URL } from '../api';

const AuthContext = createContext(null);

const readToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const saveSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a saved token exists we must check it with the server before deciding anything
  const [loading, setLoading] = useState(() => !!readToken());

  // Check the saved token with the server when the app opens.
  // The server's answer (role, terms status) is used, not whatever is stored in the browser.
  useEffect(() => {
    const token = readToken();
    if (!token) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
        } else {
          // Token expired, invalid, or the account is no longer approved
          clearSession();
        }
      } catch {
        // Server unreachable: stay signed out but keep the token for next time
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sign out in every open tab when one tab signs out
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token' && !e.newValue) setUser(null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signIn = useCallback((token, nextUser) => {
    saveSession(token, nextUser);
    setUser(nextUser);
    setLoading(false);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const markTermsAccepted = useCallback(() => {
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, termsAccepted: true };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // If the token was removed by anything else, treat the person as signed out
  const activeUser = user && readToken() ? user : null;

  return (
    <AuthContext.Provider value={{ user: activeUser, loading, signIn, signOut, markTermsAccepted }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

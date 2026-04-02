'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle redirect result (fires when user returns from signInWithRedirect)
    getRedirectResult(auth).catch((err) => {
      // Silently ignore — if there's no redirect result that's fine
      if (err.code !== 'auth/null-user') {
        console.warn('Redirect result error:', err.code, err.message);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Try popup first — works when third-party cookies aren't blocked
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // If popup fails due to blocked cookies, popup blocked, or cross-origin issues,
      // fall back to full-page redirect which doesn't need third-party cookies
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/internal-error' ||
        error.code === 'auth/missing-initial-state' ||
        error.message?.includes('missing initial state') ||
        error.message?.includes('Unable to process')
      ) {
        console.log('Popup sign-in failed, falling back to redirect:', error.code);
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Redirect sign-in also failed:', redirectError);
          throw redirectError;
        }
      } else {
        console.error('Google login error:', error);
        throw error;
      }
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name
      await updateProfile(result.user, { displayName });
      // Send verification email
      await sendEmailVerification(result.user);
      return result.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const resendVerification = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (error) {
        console.error('Resend verification error:', error);
        throw error;
      }
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      signUpWithEmail,
      loginWithEmail,
      resendVerification,
      refreshUser,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

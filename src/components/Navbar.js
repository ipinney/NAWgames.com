'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';

function AuthModal({ onClose }) {
  const { loginWithGoogle, signUpWithEmail, loginWithEmail } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name.trim());
        setVerificationSent(true);
      } else {
        await loginWithEmail(email, password);
        onClose();
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already registered. Try signing in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Wrong email or password. Try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account with that email. Try signing up.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a bit and try again.');
      } else {
        setError(err.message || 'Something went wrong.');
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Try again.');
      }
    }
  };

  if (verificationSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative bg-naw-card border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
          <span className="text-4xl block mb-3">📧</span>
          <h3 className="text-white font-bold text-lg mb-2">Check Your Email!</h3>
          <p className="text-white/60 text-sm mb-4">
            We sent a verification link to <span className="text-naw-cyan">{email}</span>. Click it to verify your account, then come back and sign in.
          </p>
          <button onClick={onClose} className="text-naw-cyan text-sm hover:underline">Got it</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-naw-card border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-white/40 hover:text-white/70 text-lg">✕</button>

        <h3 className="text-white font-bold text-lg mb-1 text-center">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h3>
        <p className="text-white/40 text-xs text-center mb-5">
          {mode === 'login' ? 'Sign in to request games' : 'Sign up to request your own games'}
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          className="w-full bg-white text-gray-800 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-naw-purple focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-naw-purple focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-naw-purple focus:outline-none"
          />

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-naw-purple to-naw-cyan text-white font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-xs text-white/40">
          {mode === 'login' ? (
            <>No account? <button onClick={() => { setMode('signup'); setError(''); }} className="text-naw-cyan hover:underline">Sign up</button></>
          ) : (
            <>Already have one? <button onClick={() => { setMode('login'); setError(''); }} className="text-naw-cyan hover:underline">Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="bg-naw-card/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group shrink-0">
            <span className="text-xl sm:text-2xl">🎮</span>
            <span className="font-game text-xs sm:text-sm bg-gradient-to-r from-naw-cyan via-naw-purple to-naw-pink bg-clip-text text-transparent group-hover:from-naw-pink group-hover:via-naw-orange group-hover:to-naw-cyan transition-all duration-500">
              NAW
            </span>
            <span className="text-white/80 font-semibold text-xs tracking-wider">GAMES</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="text-white/70 hover:text-naw-cyan text-xs sm:text-sm font-medium transition-colors hidden sm:block">
              All Games
            </Link>
            <Link href="/request" className="text-white/70 hover:text-naw-orange text-xs sm:text-sm font-medium transition-colors hidden sm:block">
              Request a Game
            </Link>

            {loading ? (
              <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-naw-purple to-naw-pink flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-white/40 hover:text-white/70 text-xs transition-colors shrink-0 whitespace-nowrap"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-naw-purple/20 border border-naw-purple/30 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-naw-purple/30 transition-colors shrink-0 whitespace-nowrap"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

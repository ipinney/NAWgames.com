'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="bg-naw-card/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎮</span>
          <span className="font-game text-lg bg-gradient-to-r from-naw-cyan via-naw-purple to-naw-pink bg-clip-text text-transparent group-hover:from-naw-pink group-hover:via-naw-orange group-hover:to-naw-cyan transition-all duration-500">
            NAW
          </span>
          <span className="text-white/80 font-semibold text-sm tracking-wider">GAMES</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-white/70 hover:text-naw-cyan text-sm font-medium transition-colors"
          >
            All Games
          </Link>
          <Link
            href="/request"
            className="text-white/70 hover:text-naw-orange text-sm font-medium transition-colors"
          >
            Request a Game
          </Link>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-xs hidden sm:block">
                {user.displayName?.split(' ')[0]}
              </span>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-naw-purple"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-naw-purple flex items-center justify-center text-white text-xs font-bold">
                  {user.displayName?.[0] || '?'}
                </div>
              )}
              <button
                onClick={logout}
                className="text-white/40 hover:text-white/80 text-xs transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

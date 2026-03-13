'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function RequestPage() {
  const { user, loginWithGoogle, resendVerification, refreshUser } = useAuth();
  const [form, setForm] = useState({
    gameName: '',
    description: '',
    gameType: 'arcade',
    inspiration: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification();
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      console.error('Error resending verification:', err);
    }
    setResending(false);
  };

  const handleRefresh = async () => {
    await refreshUser();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.emailVerified) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'game_requests'), {
        ...form,
        requesterName: user.displayName || 'Anonymous',
        requesterEmail: user.email,
        requesterUid: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Something went wrong. Try again!');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold text-white mb-2">Game Requested!</h1>
          <p className="text-white/60 mb-6">
            Your game idea has been submitted. We&apos;ll start building it soon — check back for updates!
          </p>
          <a href="/" className="text-naw-cyan hover:underline">
            Back to all games
          </a>
        </div>
      </div>
    );
  }

  // User is signed in but email not verified
  const needsVerification = user && !user.emailVerified;

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="text-4xl mb-3 block">🛠️</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Request Your Own Game</h1>
          <p className="text-white/50">
            Tell us what kind of game you want and we&apos;ll build it for you!
          </p>
        </div>

        {!user ? (
          <div className="bg-naw-card rounded-2xl border border-white/10 p-8 text-center">
            <span className="text-4xl mb-4 block">🔐</span>
            <p className="text-white/60 mb-4">Sign in to request a game</p>
            <p className="text-white/40 text-sm">Use the sign-in button in the top menu</p>
          </div>
        ) : needsVerification ? (
          <div className="bg-naw-card rounded-2xl border border-yellow-500/30 p-8 text-center">
            <span className="text-4xl mb-4 block">📧</span>
            <h2 className="text-xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-white/60 mb-2">
              We sent a verification link to <span className="text-naw-cyan">{user.email}</span>
            </p>
            <p className="text-white/40 text-sm mb-6">
              Check your inbox (and spam folder) and click the link, then come back here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="bg-naw-purple text-white px-6 py-2.5 rounded-xl font-medium hover:bg-naw-purple/80 transition-colors"
              >
                I&apos;ve Verified — Check Again
              </button>
              <button
                onClick={handleResend}
                disabled={resending || resent}
                className="bg-white/10 text-white/70 px-6 py-2.5 rounded-xl font-medium hover:bg-white/15 transition-colors disabled:opacity-50"
              >
                {resent ? '✓ Email Sent!' : resending ? 'Sending...' : 'Resend Email'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-6 space-y-5">
              {/* Game Name */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Game Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.gameName}
                  onChange={(e) => setForm({ ...form, gameName: e.target.value })}
                  placeholder="e.g., Zombie Escape, Space Racer, Taco Quest..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-naw-purple focus:outline-none focus:ring-1 focus:ring-naw-purple transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Describe Your Game *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What happens in your game? What's the goal? What makes it fun?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-naw-purple focus:outline-none focus:ring-1 focus:ring-naw-purple transition-colors resize-none"
                />
              </div>

              {/* Game Type */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Game Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'arcade', label: '🕹️ Arcade', },
                    { value: 'puzzle', label: '🧩 Puzzle' },
                    { value: 'adventure', label: '⚔️ Adventure' },
                    { value: 'racing', label: '🏎️ Racing' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setForm({ ...form, gameType: type.value })}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        form.gameType === type.value
                          ? 'bg-naw-purple text-white border border-naw-purple'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspiration */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Any inspiration? (optional)
                </label>
                <input
                  type="text"
                  value={form.inspiration}
                  onChange={(e) => setForm({ ...form, inspiration: e.target.value })}
                  placeholder="e.g., Like Flappy Bird but with dragons, or Pac-Man in space..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-naw-purple focus:outline-none focus:ring-1 focus:ring-naw-purple transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-naw-purple to-naw-cyan text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : '🚀 Submit Game Request'}
            </button>

            <p className="text-white/30 text-xs text-center">
              Signed in as {user.displayName || user.email}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

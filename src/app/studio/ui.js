'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export const ADMIN_UID = 'zy8WSqtL3GUuyw89u1X1ZzENULP2';

export async function api(path, body) {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

// Read-aloud with the browser's built-in voice.
export function speak(text) {
  try {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = String(text || '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/[┌┐└┘─│]/g, ' ');
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 0.95; u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function Spinner({ label }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-naw-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        {label && <p className="text-white/40 text-sm">{label}</p>}
      </div>
    </div>
  );
}

function Title() {
  return (
    <h1 className="font-game text-lg sm:text-2xl mb-3">
      <span className="bg-gradient-to-r from-naw-orange via-naw-pink to-naw-purple bg-clip-text text-transparent">GAME STUDIO</span>
    </h1>
  );
}

function AccessRequestForm({ user, onSubmitted }) {
  const [name, setName] = useState(user?.displayName || '');
  const [nickname, setNickname] = useState('');
  const [relationship, setRelationship] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim() || !nickname.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await setDoc(doc(db, 'studio_access', user.uid), {
        name: name.trim().slice(0, 80),
        nickname: nickname.trim().replace(/[^A-Za-z0-9 '\-]/g, '').slice(0, 20),
        relationship: relationship.trim().slice(0, 500),
        email: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      onSubmitted();
    } catch (err) {
      console.error('Error submitting access request:', err);
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const field = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-naw-orange focus:outline-none focus:ring-1 focus:ring-naw-orange transition-colors';
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-naw-card rounded-2xl border border-white/10 p-6 sm:p-8">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-3">🔒</span>
          <h2 className="text-white font-bold text-xl mb-2">Request Access</h2>
          <p className="text-white/50 text-sm">
            Game Studio is for the Pinney kids and their friends. A grown-up should fill this in. We&apos;ll review it soon!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">Grown-up&apos;s name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jamie Smith" className={field} />
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">Game maker nickname</label>
            <input type="text" required maxLength={20} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g., Max or CaptainCool" className={field} />
            <p className="text-white/30 text-xs mt-1">Shown as &quot;Made by ...&quot; on published games. A first name or nickname only.</p>
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">How do you know the family?</label>
            <textarea required rows={3} value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="e.g., Nolan's friend from soccer, cousin from Dallas..." className={`${field} resize-none`} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={submitting || !name.trim() || !relationship.trim() || !nickname.trim()}
            className="w-full bg-gradient-to-r from-naw-orange to-naw-pink text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Submitting...' : 'Request Access'}
          </button>
        </form>
        <p className="text-white/30 text-xs text-center mt-4">Signed in as {user.email}</p>
      </div>
    </div>
  );
}

// Same gate as Lizard Lens: Google sign-in, request form, studio_access/{uid} status.
export function useStudioAccess() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    if (loading) return;
    if (!user) { setStatus('none'); setChecking(false); return; }
    if (user.uid === ADMIN_UID) { setStatus('approved'); setChecking(false); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'studio_access', user.uid));
        setStatus(snap.exists() ? snap.data().status : 'none');
      } catch (err) {
        console.error('Error checking access:', err);
        setStatus('none');
      }
      setChecking(false);
    })();
  }, [user, loading]);
  return { user, loading: loading || checking, status, setStatus };
}

export function StudioGate({ children }) {
  const { loginWithGoogle } = useAuth();
  const { user, loading, status, setStatus } = useStudioAccess();

  if (loading) return <Spinner label="Opening the Game Studio..." />;

  const back = (
    <div className="text-center mt-6">
      <Link href="/" className="text-white/30 hover:text-white/50 text-xs transition-colors">Back to NAW Games</Link>
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">🛠️</span>
          <Title />
          <p className="text-white/50 text-sm sm:text-base mb-2">Plan your own game with a friendly guide, then watch a robot build it!</p>
          <p className="text-white/30 text-xs">Game Studio is private. Sign in to request access.</p>
        </div>
        <div className="bg-naw-card rounded-2xl border border-white/10 p-8 text-center">
          <p className="text-white/60 mb-5 text-sm">Sign in to get started</p>
          <button onClick={loginWithGoogle}
            className="bg-white text-gray-800 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
        {back}
      </div>
    );
  }

  if (status === 'pending' || status === 'denied') {
    const pending = status === 'pending';
    return (
      <div className="max-w-lg mx-auto px-4 pt-16 pb-12 text-center">
        <span className="text-6xl block mb-4">{pending ? '⏳' : '🚫'}</span>
        <Title />
        <div className={`bg-naw-card rounded-2xl border ${pending ? 'border-yellow-500/20' : 'border-red-500/20'} p-8 mt-6`}>
          <h2 className="text-white font-bold text-lg mb-2">{pending ? 'Request Pending' : 'Access Denied'}</h2>
          <p className="text-white/50 text-sm mb-4">
            {pending
              ? "Your request has been sent! Ivan will review it and you'll be able to start making games once approved."
              : "Your request wasn't approved. If you think this is a mistake, reach out to the family directly."}
          </p>
          <p className="text-white/30 text-xs">Signed in as {user.email}</p>
        </div>
        {back}
      </div>
    );
  }

  if (status !== 'approved') {
    return (
      <div className="px-4 pt-8 pb-12">
        <div className="text-center mb-8"><Title /></div>
        <AccessRequestForm user={user} onSubmitted={() => setStatus('pending')} />
        {back}
      </div>
    );
  }

  return children(user);
}

// One creature card, rendered from data (the bestiary).
export function CreatureCard({ c, i }) {
  const kindColor = c.kind === 'boss' ? 'from-red-500/30 to-orange-500/20 border-red-400/40'
    : c.kind === 'friend' ? 'from-green-500/30 to-cyan-500/20 border-green-400/40'
      : 'from-purple-500/30 to-pink-500/20 border-purple-400/40';
  const speed = { slow: 1, medium: 2, fast: 3 }[c.speed] || 2;
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${kindColor} p-3 flex flex-col items-center text-center animate-[pop_.35s_ease-out]`} style={{ animationDelay: `${i * 60}ms` }}>
      <div className="text-5xl mb-1 drop-shadow">{c.emoji || '❓'}</div>
      <div className="text-white font-bold text-sm leading-tight">{c.name || 'Mystery'}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">{c.kind || 'enemy'}</div>
      <p className="text-white/70 text-xs leading-snug mb-2">{c.sentence}</p>
      <div className="mt-auto flex gap-2 text-[11px] text-white/60">
        <span>{'⚡'.repeat(speed)}</span>
        <span>⭐ {c.points || 10}</span>
      </div>
    </div>
  );
}

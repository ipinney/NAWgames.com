'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { collection, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { api, ADMIN_UID } from '../ui';

const badge = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  denied: 'bg-red-500/20 text-red-400',
  published: 'bg-green-500/20 text-green-400',
  held: 'bg-yellow-500/20 text-yellow-400',
  unpublished: 'bg-white/10 text-white/50',
};
const btn = 'px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50';

export default function StudioAdminPage() {
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [games, setGames] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const isAdmin = user?.uid === ADMIN_UID;

  const loadGames = async () => {
    try {
      const r = await api('/api/studio/admin');
      setGames(r.games); setBuilds(r.builds);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (loading || !isAdmin) return;
    (async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'studio_access')));
        const docs = [];
        snapshot.forEach((d) => docs.push({ id: d.id, ...d.data() }));
        const order = { pending: 0, approved: 1, denied: 2 };
        docs.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));
        setRequests(docs);
      } catch (err) { console.error('Error fetching requests:', err); }
      await loadGames();
      setFetching(false);
    })();
  }, [user, loading, isAdmin]);

  const handleAccess = async (uid, action) => {
    setActionLoading(uid);
    try {
      const ref = doc(db, 'studio_access', uid);
      if (action === 'delete') {
        await deleteDoc(ref);
        setRequests((p) => p.filter((r) => r.id !== uid));
      } else {
        await updateDoc(ref, { status: action, reviewedAt: new Date().toISOString() });
        setRequests((p) => p.map((r) => (r.id === uid ? { ...r, status: action } : r)));
      }
    } catch (err) { console.error(err); alert('Failed to update. Try again.'); }
    setActionLoading(null);
  };

  const handleGame = async (slug, action) => {
    if (action === 'delete' && !confirm('Delete this game for good?')) return;
    setActionLoading(slug);
    try { await api('/api/studio/admin', { action, slug }); await loadGames(); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-naw-orange border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-4xl block mb-3">🔒</span>
          <p className="text-white/60 text-sm">Admin access only.</p>
          <Link href="/" className="text-naw-cyan text-xs hover:underline mt-3 inline-block">Back to NAW Games</Link>
        </div>
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const held = games.filter((g) => g.status === 'held');

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/studio" className="text-white/40 hover:text-white/70 text-xs">← Back to Game Studio</Link>
        <h1 className="text-white font-bold text-xl mt-2 mb-6">Game Studio Admin</h1>

        {fetching ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-naw-orange border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <>
            {held.length > 0 && (
              <section className="mb-10">
                <h2 className="text-yellow-300 font-semibold mb-3">Held by the safety check ({held.length})</h2>
                <div className="space-y-3">
                  {held.map((g) => <GameRow key={g.slug} g={g} busy={actionLoading === g.slug} onAction={handleGame} />)}
                </div>
              </section>
            )}

            <section className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">Access requests</h2>
                <span className="text-yellow-400 text-xs">{pending.length} pending</span>
              </div>
              {requests.length === 0 ? <p className="text-white/40 text-sm">No access requests yet.</p> : (
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div key={r.id} className="bg-naw-card rounded-xl border border-white/10 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold text-sm truncate">{r.name}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge[r.status]}`}>{r.status}</span>
                          </div>
                          <p className="text-white/40 text-xs mb-1">{r.email}</p>
                          <p className="text-white/60 text-xs"><span className="text-white/30">Nickname:</span> {r.nickname}</p>
                          <p className="text-white/60 text-xs"><span className="text-white/30">How they know us:</span> {r.relationship}</p>
                        </div>
                        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                          {r.status !== 'approved' && <button onClick={() => handleAccess(r.id, 'approved')} disabled={actionLoading === r.id} className={`${btn} bg-green-500/20 text-green-400 hover:bg-green-500/30`}>Approve</button>}
                          {r.status !== 'denied' && <button onClick={() => handleAccess(r.id, 'denied')} disabled={actionLoading === r.id} className={`${btn} bg-red-500/20 text-red-400 hover:bg-red-500/30`}>{r.status === 'approved' ? 'Revoke' : 'Deny'}</button>}
                          {r.status === 'denied' && <button onClick={() => handleAccess(r.id, 'delete')} disabled={actionLoading === r.id} className={`${btn} bg-white/5 text-white/30 hover:bg-white/10`}>Delete</button>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-10">
              <h2 className="text-white font-semibold mb-3">Studio games</h2>
              {games.filter((g) => g.status !== 'held').length === 0 ? <p className="text-white/40 text-sm">No studio games yet.</p> : (
                <div className="space-y-3">
                  {games.filter((g) => g.status !== 'held').map((g) => <GameRow key={g.slug} g={g} busy={actionLoading === g.slug} onAction={handleGame} />)}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-white font-semibold mb-3">Recent build steps</h2>
              <div className="bg-naw-card rounded-xl border border-white/10 divide-y divide-white/5 text-xs">
                {builds.length === 0 && <p className="p-3 text-white/40">None yet.</p>}
                {builds.map((b) => (
                  <div key={b.id} className="p-3 flex gap-3 items-center">
                    <span className={b.status === 'done' ? 'text-green-400' : b.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}>{b.status}</span>
                    <Link href={`/studio/p/${b.projectId}`} className="text-naw-cyan hover:underline">{b.projectId.slice(0, 6)}</Link>
                    <span className="text-white/50">step {b.step}</span>
                    {b.durationS && <span className="text-white/30">{Math.round(b.durationS / 60)} min</span>}
                    <span className="text-white/30">{new Date(b.createdMs).toLocaleString()}</span>
                    {b.error && <span className="text-red-300 truncate">{b.error}</span>}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function GameRow({ g, busy, onAction }) {
  return (
    <div className="bg-naw-card rounded-xl border border-white/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm truncate">{g.title}</h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge[g.status] || badge.unpublished}`}>{g.status}</span>
            {g.test && <span className="text-[10px] text-white/40">test</span>}
          </div>
          <p className="text-white/40 text-xs mb-1">Made by {g.builder} · v{g.version}</p>
          <p className="text-white/60 text-xs line-clamp-2">{g.description}</p>
          {g.safety && !g.safety.ok && (
            <p className="text-yellow-300 text-xs mt-1">Safety: {(g.safety.reasons || []).join('; ') || 'flagged'}</p>
          )}
          <div className="flex gap-3 mt-1 text-xs">
            {g.projectId && <Link href={`/studio/p/${g.projectId}`} className="text-naw-cyan hover:underline">Project</Link>}
            {g.status === 'published' && <Link href={`/games/${g.slug}`} className="text-naw-cyan hover:underline">Play</Link>}
          </div>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          {g.status === 'published'
            ? <button onClick={() => onAction(g.slug, 'unpublish')} disabled={busy} className={`${btn} bg-red-500/20 text-red-400 hover:bg-red-500/30`}>Unpublish</button>
            : <button onClick={() => onAction(g.slug, 'publish')} disabled={busy} className={`${btn} bg-green-500/20 text-green-400 hover:bg-green-500/30`}>Publish</button>}
          <button onClick={() => onAction(g.slug, 'delete')} disabled={busy} className={`${btn} bg-white/5 text-white/40 hover:bg-white/10`}>Delete</button>
        </div>
      </div>
    </div>
  );
}

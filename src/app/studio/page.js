'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudioGate, api, Spinner, ADMIN_UID } from './ui';
import { STAGES } from '@/lib/studio/design';

function stageLabel(p) {
  if (p.publishedSlug) return '🏆 In the arcade';
  if (p.stage === 'build') return p.buildStep ? `🛠️ Build step ${p.buildStep}` : '🛠️ Building';
  const s = STAGES.find((x) => x.key === p.stage);
  return s ? `${s.emoji} ${s.label}` : p.stage;
}

function Home({ user }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [builder, setBuilder] = useState('Nolan');
  const isAdmin = user.uid === ADMIN_UID;

  useEffect(() => {
    api('/api/studio/projects').then(setData).catch((e) => setErr(e.message));
  }, []);

  const create = async () => {
    setBusy(true);
    setErr('');
    try {
      const r = await api('/api/studio/projects', { action: 'create', builder });
      router.push(`/studio/p/${r.id}`);
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  if (!data && !err) return <Spinner label="Loading your games..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-16">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-white/40 hover:text-white/70 text-sm">← Arcade</Link>
        {isAdmin && <Link href="/studio/admin" className="text-naw-cyan text-sm hover:underline">Admin</Link>}
      </div>
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-[wiggle_2s_ease-in-out_infinite]">🛠️</div>
        <h1 className="font-game text-lg sm:text-2xl mb-3">
          <span className="bg-gradient-to-r from-naw-orange via-naw-pink to-naw-purple bg-clip-text text-transparent">GAME STUDIO</span>
        </h1>
        <p className="text-white/60 text-base">Plan a game with Sparky. Then a robot builds it and you play it!</p>
      </div>

      <div className="bg-naw-card rounded-3xl border border-naw-orange/30 p-5 mb-8 text-center">
        {isAdmin && (
          <div className="mb-4">
            <p className="text-white/50 text-sm mb-2">Who is making this game?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Nolan', 'Addie', 'Wyatt', 'Ivan'].map((n) => (
                <button key={n} onClick={() => setBuilder(n)}
                  className={`studio-chip px-5 rounded-2xl text-base font-semibold border transition ${builder === n ? 'bg-naw-orange text-black border-naw-orange' : 'bg-white/5 text-white border-white/10'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={create} disabled={busy}
          className="w-full sm:w-auto px-10 py-5 rounded-3xl text-xl font-bold bg-gradient-to-r from-naw-orange to-naw-pink text-white shadow-lg shadow-pink-500/20 active:scale-95 transition disabled:opacity-50">
          {busy ? 'Getting ready...' : '✨ Make a New Game'}
        </button>
      </div>

      {err && <p className="text-red-400 text-center mb-4">{err}</p>}

      <h2 className="text-white font-bold text-lg mb-3">My Games</h2>
      {data?.projects?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.projects.map((p) => (
            <Link key={p.id} href={`/studio/p/${p.id}`}
              className="bg-naw-card rounded-2xl border border-white/10 p-4 flex items-center gap-4 hover:border-naw-orange/50 active:scale-[.98] transition">
              <span className="text-4xl">{p.emoji}</span>
              <div className="min-w-0">
                <div className="text-white font-bold truncate">{p.name}</div>
                <div className="text-white/50 text-sm">{stageLabel(p)}{isAdmin && p.builder ? ` · ${p.builder}` : ''}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-center py-8">No games yet. Tap the big button to start one!</p>
      )}
    </div>
  );
}

export default function StudioPage() {
  return <StudioGate>{(user) => <Home user={user} />}</StudioGate>;
}

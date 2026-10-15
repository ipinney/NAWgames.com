'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { api, GameCtx, GameStyles, useConfetti, useFloaters, sfx, Btn } from './ui';
import { FoxSVG } from './art';
import FlipPanel from './FlipPanel';
import Home from './Home';
import LevelScreen from './LevelScreen';
import PracticeFlip from './PracticeFlip';

const ADMIN_UID = 'zy8WSqtL3GUuyw89u1X1ZzENULP2';

export default function App() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [state, setState] = useState(null);
  const [err, setErr] = useState('');
  const [screen, setScreen] = useState({ name: 'home' });
  const flipRef = useRef(null);
  const contextRef = useRef({});
  const [confetti, fire] = useConfetti();
  const [floaters, float] = useFloaters();

  const allowed = user && user.uid === ADMIN_UID;

  useEffect(() => {
    if (!allowed) return;
    api('/api/flipper/state').then(setState).catch((e) => setErr(e.message));
  }, [allowed]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [screen]);

  if (loading) return <Shell><Center><FoxSVG size={96} className="hf-bob" /></Center></Shell>;
  if (!user) {
    return (
      <Shell>
        <Center>
          <FoxSVG size={120} className="hf-bob mx-auto" />
          <h1 className="text-3xl font-black text-white mt-4">House Flipper</h1>
          <p className="text-white/70 mt-2 mb-6">Sign in to start Flip Academy.</p>
          <Btn size="lg" onClick={() => loginWithGoogle()}>Sign in</Btn>
        </Center>
      </Shell>
    );
  }
  if (!allowed) {
    return (
      <Shell>
        <Center>
          <FoxSVG size={110} mood="asleep" className="mx-auto" />
          <h1 className="text-2xl font-black text-white mt-4">This one is private</h1>
          <p className="text-white/70 mt-2">House Flipper is Addie&apos;s project. Ask Dad if you want to see it.</p>
          <Link href="/projects/addie" className="inline-block mt-6 text-amber-300 font-bold">Back to Addie&apos;s projects</Link>
        </Center>
      </Shell>
    );
  }
  if (err) return <Shell><Center><p className="text-white">{err}</p></Center></Shell>;
  if (!state) return <Shell><Center><FoxSVG size={96} className="hf-bob" /><p className="text-white/60 mt-3 font-bold">Loading Fox Hollow...</p></Center></Shell>;

  const game = {
    profile: state.profile,
    flipDoc: state.flip,
    usage: state.usage,
    setProfile: (profile) => setState((s) => ({ ...s, profile })),
    setFlipDoc: (flip) => setState((s) => ({ ...s, flip })),
    go: (name, extra = {}) => { sfx.whoosh(); setScreen({ name, ...extra }); },
    flip: {
      ask: (t) => flipRef.current?.ask(t),
      event: (e) => flipRef.current?.event(e),
      open: () => flipRef.current?.open(),
    },
    setContext: (ctx) => { contextRef.current = ctx || {}; },
    fire, float,
    async completeLevel(n, score) {
      const d = await api('/api/flipper/state', { action: 'level_done', level: n, score });
      setState((s) => ({ ...s, profile: d.profile }));
      return d;
    },
    async save(action, body) {
      const d = await api('/api/flipper/state', { action, ...body });
      if (d.profile) setState((s) => ({ ...s, profile: d.profile, flip: d.flip !== undefined ? d.flip : s.flip }));
      return d;
    },
  };

  return (
    <GameCtx.Provider value={game}>
      <Shell>
        <GameStyles />
        {screen.name === 'home' && <Home />}
        {screen.name === 'level' && <LevelScreen key={`l${screen.n}`} n={screen.n} />}
        {screen.name === 'flip' && <PracticeFlip key={state.profile.currentFlipId || 'new'} />}
        <FlipPanel bindRef={flipRef} contextRef={contextRef} onUsage={(u) => setState((s) => ({ ...s, usage: u }))}
          greet="Addie just opened Flip Academy for the first time today. Say hi in 2 short sentences and tell her what to try next based on her progress (use get_progress)." />
        {confetti}{floaters}
      </Shell>
    </GameCtx.Provider>
  );
}

function Shell({ children }) {
  return (
    <div className="hf-root min-h-screen pb-40" style={{ background: 'linear-gradient(180deg,#0c4a6e 0%,#0f172a 60%)' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" />
      {children}
    </div>
  );
}
function Center({ children }) {
  return <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">{children}</div>;
}

'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { StudioGate, api, speak, Spinner, CreatureCard } from '../../ui';
import { STAGES, buildSteps, FEEDBACK_CHIPS, stageIndex } from '@/lib/studio/design';

function StageBar({ stage, maxStage, onGo }) {
  const cur = stage === 'build' ? STAGES.length : stageIndex(stage);
  const reached = Math.max(cur, maxStage ? stageIndex(maxStage) : 0);
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
      {STAGES.map((s, i) => {
        const done = i < reached && i !== cur, now = i === cur, open = i <= reached && !now;
        return (
          <button key={s.key} disabled={!open || stage === 'build'} onClick={() => onGo(s.key)}
            className={`shrink-0 flex flex-col items-center justify-center rounded-2xl px-3 py-2 min-w-[64px] border text-xs font-semibold transition
              ${now ? 'bg-naw-orange text-black border-naw-orange scale-105' : done ? 'bg-naw-green/20 text-naw-green border-naw-green/40' : 'bg-white/5 text-white/30 border-white/10'}`}>
            <span className="text-xl leading-none mb-0.5">{done ? '✅' : s.emoji}</span>
            {s.label}
          </button>
        );
      })}
      <div className={`shrink-0 flex flex-col items-center justify-center rounded-2xl px-3 py-2 min-w-[64px] border text-xs font-semibold
        ${stage === 'build' ? 'bg-naw-pink text-white border-naw-pink' : 'bg-white/5 text-white/30 border-white/10'}`}>
        <span className="text-xl leading-none mb-0.5">🤖</span>Build
      </div>
    </div>
  );
}

function PlanPanel({ project, onArt, artBusy }) {
  const d = project.design || {};
  const st = project.stage;
  const Box = ({ title, children }) => (
    <div className="bg-naw-card rounded-2xl border border-white/10 p-4 mb-3">
      <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">{title}</div>
      {children}
    </div>
  );
  const Pill = ({ k, v }) => v ? <div className="text-sm text-white/80"><span className="text-white/40">{k}: </span>{v}</div> : null;
  return (
    <div>
      {(d.idea?.name || d.idea?.gesture) && (
        <Box title="💡 Idea">
          <div className="text-white text-xl font-bold mb-1">{d.idea.name || '...'}</div>
          <Pill k="Fingers" v={d.idea.gesture} />
          <Pill k="Type" v={d.idea.gameType} />
        </Box>
      )}
      {(d.hero?.description || st === 'hero') && (
        <Box title="🦸 Hero">
          <div className="flex items-start gap-3">
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              {project.art?.dressed || project.art?.base
                ? <img src={project.art.dressed || project.art.base} alt="hero" className="w-full h-full object-contain" />
                : <span className="text-5xl">{d.hero?.emoji || '❔'}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-sm">{d.hero?.description || 'Tell Sparky about your hero!'}</p>
              {(d.hero?.layers || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {d.hero.layers.map((l, i) => <span key={i} className="text-[11px] bg-naw-pink/20 text-naw-pink rounded-full px-2 py-0.5">+ {l}</span>)}
                </div>
              )}
            </div>
          </div>
          {project.art?.base && project.art?.dressed && (
            <div className="flex gap-2 mt-3 items-center text-xs text-white/50">
              <img src={project.art.base} alt="plain hero" className="w-12 h-12 object-contain bg-white/5 rounded-lg" />
              <span>plain base</span><span>→</span>
              <img src={project.art.dressed} alt="hero with outfit" className="w-12 h-12 object-contain bg-white/5 rounded-lg" />
              <span>with layers</span>
            </div>
          )}
          {st === 'hero' && d.hero?.description && (
            <button onClick={onArt} disabled={artBusy}
              className="mt-3 w-full studio-chip rounded-2xl bg-naw-purple/30 border border-naw-purple/50 text-white font-semibold disabled:opacity-50">
              {artBusy ? '🎨 Drawing... (this can take a minute)' : project.art?.base ? '🎨 Draw again' : '🎨 Draw my hero'}
            </button>
          )}
          {project.art?.status === 'skipped' && st === 'hero' && (
            <p className="text-white/40 text-xs mt-2">The art robot is busy right now, so your hero uses its emoji. That works great too!</p>
          )}
        </Box>
      )}
      {(d.world?.setting || st === 'world') && (
        <Box title="🗺️ World">
          <Pill k="Where" v={d.world?.setting} />
          <div className="mt-2 space-y-1.5">
            {(d.world?.levels || []).map((l, i) => (
              <div key={i} className="flex gap-2 items-start bg-white/5 rounded-xl p-2">
                <span className="font-game text-[10px] text-naw-orange mt-1">L{i + 1}</span>
                <div><div className="text-white text-sm font-semibold">{l.name}</div><div className="text-white/50 text-xs">{l.sentence}</div></div>
              </div>
            ))}
          </div>
        </Box>
      )}
      {((d.bestiary || []).length > 0 || st === 'bestiary') && (
        <Box title="🐉 Creature Cards">
          {(d.bestiary || []).length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {d.bestiary.map((c, i) => <CreatureCard key={i} c={c} i={i} />)}
            </div>
          ) : <p className="text-white/40 text-sm">Each creature gets a card from one sentence.</p>}
        </Box>
      )}
      {((d.moves || []).length > 0 || st === 'moves') && (
        <Box title="🎵 Moves and Sounds">
          <div className="space-y-1.5">
            {(d.moves || []).map((m, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-2">
                <div className="text-white text-sm font-semibold">{m.name} <span className="text-white/40 font-normal">· {m.gesture}</span></div>
                <div className="text-white/60 text-xs">{m.sentence}</div>
                <div className="text-naw-cyan text-xs">🔊 {m.sound}</div>
              </div>
            ))}
          </div>
        </Box>
      )}
      {(d.redteam?.checks || []).length > 0 && st !== 'build' && (
        <Box title="🔍 Fun Check">
          {d.redteam.checks.map((c, i) => (
            <div key={i} className="text-sm text-white/70 flex gap-2"><span>{c.ok ? '✅' : '⚠️'}</span><span>{c.q}</span></div>
          ))}
        </Box>
      )}
      {d.mockup && (
        <Box title="📱 Game Screen Mockup">
          <pre className="text-[13px] leading-[1.25] text-white whitespace-pre overflow-x-auto font-mono">{d.mockup}</pre>
        </Box>
      )}
    </div>
  );
}

function Chat({ project, onSend, sending, autoSpeak, setAutoSpeak }) {
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const msgs = (project.chat || []).filter((m) => m.stage === project.stage);
  const last = msgs[msgs.length - 1];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs.length, sending]);

  const send = (t) => { if (!t.trim() || sending) return; onSend(t.trim()); setText(''); setTyping(false); };

  return (
    <div className="bg-naw-card rounded-3xl border border-naw-orange/20 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-2xl">🤖</span><span className="text-white font-bold">Sparky</span></div>
        <button onClick={() => setAutoSpeak(!autoSpeak)}
          className={`text-xs rounded-full px-3 py-1.5 border ${autoSpeak ? 'bg-naw-cyan/20 border-naw-cyan/50 text-naw-cyan' : 'border-white/10 text-white/40'}`}>
          {autoSpeak ? '🔊 Reading aloud' : '🔇 Read aloud off'}
        </button>
      </div>
      <div className="max-h-[42vh] overflow-y-auto space-y-2 pr-1">
        {msgs.map((m, i) => m.role === 'guide' ? (
          <div key={i} className="flex gap-2 items-start">
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-white text-base leading-snug max-w-[85%]">{m.text}</div>
            <button onClick={() => speak(m.text)} aria-label="Read aloud" className="shrink-0 w-11 h-11 rounded-full bg-white/5 border border-white/10 text-lg">🔊</button>
          </div>
        ) : (
          <div key={i} className="flex justify-end">
            <div className="bg-naw-orange text-black font-semibold rounded-2xl rounded-tr-sm px-4 py-3 text-base max-w-[85%]">{m.text}</div>
          </div>
        ))}
        {sending && <div className="text-white/40 text-sm px-2">Sparky is thinking<span className="animate-pulse">...</span></div>}
        <div ref={endRef} />
      </div>
      {last?.role === 'guide' && !sending && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(last.chips || []).map((c, i) => (
            <button key={i} onClick={() => send(c)}
              className="studio-chip rounded-2xl bg-gradient-to-br from-naw-purple/40 to-naw-pink/30 border border-naw-purple/50 text-white text-base font-semibold px-3 active:scale-95 transition">
              {c}
            </button>
          ))}
          <button onClick={() => setTyping(!typing)}
            className="studio-chip rounded-2xl bg-white/5 border border-white/10 text-white/70 text-base px-3">⌨️ Type my own</button>
        </div>
      )}
      {typing && (
        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="mt-2 flex gap-2">
          <input autoFocus value={text} onChange={(e) => setText(e.target.value)} maxLength={300}
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base focus:border-naw-orange focus:outline-none" placeholder="Type here..." />
          <button className="rounded-2xl bg-naw-orange text-black font-bold px-5">Send</button>
        </form>
      )}
    </div>
  );
}

function BuildPanel({ project, builds, previewUrl, refresh }) {
  const [chips, setChips] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const step = project.buildStep || 0;
  const STEPS = buildSteps(project.design);
  const running = builds.find((b) => b.status === 'running' || b.status === 'queued');
  const lastFailed = !running && builds.length && builds[builds.length - 1].status === 'failed';

  const toggle = (c) => setChips((x) => x.includes(c) ? x.filter((y) => y !== c) : [...x, c]);
  const sendFeedback = async (retry) => {
    setBusy(true); setErr('');
    try {
      await api('/api/studio/projects', retry ? { action: 'retry', id: project.id } : { action: 'feedback', id: project.id, chips, text });
      setChips([]); setText('');
      await refresh();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  const nextLabel = STEPS.find((s) => s.step === step + 1)?.label || 'Make my changes';

  return (
    <div className="space-y-4">
      <div className="bg-naw-card rounded-3xl border border-naw-pink/30 p-4">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {STEPS.map((s) => {
            const done = step >= s.step, now = running?.step === s.step;
            return (
              <div key={s.step} className={`rounded-2xl p-2 text-center border text-[11px] font-semibold
                ${now ? 'border-naw-orange bg-naw-orange/20 text-naw-orange animate-pulse' : done ? 'border-naw-green/40 bg-naw-green/15 text-naw-green' : 'border-white/10 text-white/30'}`}>
                <div className="text-2xl">{done ? '✅' : s.emoji}</div>{s.label}
              </div>
            );
          })}
        </div>
        {running ? (
          <div className="text-center py-3">
            <div className="text-5xl mb-2 animate-bounce">🤖</div>
            <p className="text-white font-bold text-lg">The robot is building {running.step <= 4 ? `step ${running.step}` : 'your changes'}!</p>
            <p className="text-white/50 text-sm">{running.status === 'queued' ? 'Waiting in line...' : 'This takes a few minutes. Go stretch!'}</p>
          </div>
        ) : lastFailed ? (
          <div className="text-center py-3">
            <p className="text-white font-bold">Oops, the robot tripped. 🤕</p>
            <button onClick={() => sendFeedback(true)} disabled={busy} className="mt-2 studio-chip rounded-2xl bg-naw-orange text-black font-bold px-6">Try again</button>
          </div>
        ) : null}
        {project.publishedSlug && (
          <Link href={`/games/${project.publishedSlug}`} className="block mt-2 text-center rounded-2xl bg-gradient-to-r from-naw-green to-naw-cyan text-black font-bold py-3">
            🏆 It is in the arcade! Play it there
          </Link>
        )}
        {project.safety?.status === 'held' && (
          <p className="mt-2 text-center text-yellow-300 text-sm">Your game is saved. A grown-up will check it before it goes in the arcade.</p>
        )}
      </div>

      {previewUrl && (
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-black">
          <iframe key={previewUrl} src={previewUrl} title="Playtest" className="w-full h-[70vh] sm:h-[600px]" sandbox="allow-scripts allow-pointer-lock" />
        </div>
      )}

      {!running && step > 0 && !lastFailed && (
        <div className="bg-naw-card rounded-3xl border border-white/10 p-4">
          <p className="text-white font-bold text-lg mb-1">How was it? 🎮</p>
          <p className="text-white/50 text-sm mb-3">Tap what you want, then tap the big button.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {FEEDBACK_CHIPS.map((c) => (
              <button key={c} onClick={() => toggle(c)}
                className={`studio-chip rounded-2xl border text-base font-semibold px-2 transition ${chips.includes(c) ? 'bg-naw-orange text-black border-naw-orange' : 'bg-white/5 text-white border-white/10'}`}>
                {c}
              </button>
            ))}
          </div>
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={300} placeholder="Or type an idea (optional)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base mb-3 focus:border-naw-orange focus:outline-none" />
          {err && <p className="text-red-400 text-sm mb-2">{err}</p>}
          <button onClick={() => sendFeedback(false)} disabled={busy}
            className="w-full py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-naw-orange to-naw-pink text-white active:scale-95 transition disabled:opacity-50">
            {busy ? 'Sending...' : `🤖 Build next: ${nextLabel}`}
          </button>
        </div>
      )}
    </div>
  );
}

function Project({ id }) {
  const [project, setProject] = useState(null);
  const [builds, setBuilds] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const started = useRef({});

  const refresh = useCallback(async () => {
    const r = await api(`/api/studio/projects?id=${id}`);
    setProject(r.project); setBuilds(r.builds || []);
    setPreviewUrl((old) => (old && r.previewUrl && old.split('&v=')[1] === r.previewUrl.split('&v=')[1]) ? old : r.previewUrl);
    return r.project;
  }, [id]);

  useEffect(() => {
    try { setAutoSpeak(localStorage.getItem('studio_autospeak') === '1'); } catch {}
    refresh().catch((e) => setErr(e.message));
  }, [refresh]);
  useEffect(() => { try { localStorage.setItem('studio_autospeak', autoSpeak ? '1' : '0'); } catch {} }, [autoSpeak]);

  const send = useCallback(async (text) => {
    setSending(true); setErr('');
    try {
      const r = await api('/api/studio/chat', { projectId: id, text });
      const g = r.messages.find((m) => m.role === 'guide');
      if (g && autoSpeak) speak(g.text);
      await refresh();
    } catch (e) { setErr(e.message); }
    setSending(false);
  }, [id, refresh, autoSpeak]);

  // Start each planning stage with a greeting from Sparky.
  useEffect(() => {
    if (!project || project.stage === 'build' || sending) return;
    const has = (project.chat || []).some((m) => m.stage === project.stage);
    if (!has && !started.current[project.stage]) { started.current[project.stage] = true; send(''); }
  }, [project, sending, send]);

  // Poll while the robot builds or draws.
  const building = project?.building || project?.art?.status === 'queued' || project?.art?.status === 'running';
  useEffect(() => {
    if (!building) return;
    const t = setInterval(() => refresh().catch(() => {}), 8000);
    return () => clearInterval(t);
  }, [building, refresh]);

  const go = async (stage) => {
    try { await api('/api/studio/projects', { action: 'goto', id, stage }); await refresh(); } catch (e) { setErr(e.message); }
  };
  const approve = async () => {
    setErr('');
    try { await api('/api/studio/projects', { action: 'approve', id }); await refresh(); } catch (e) { setErr(e.message); }
  };
  const art = async () => {
    try { await api('/api/studio/projects', { action: 'art', id }); await refresh(); } catch (e) { setErr(e.message); }
  };

  if (!project) return err ? <p className="text-red-400 text-center pt-20 px-4">{err}</p> : <Spinner label="Opening your game..." />;
  const d = project.design || {};

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-4 pb-16">
      <div className="flex items-center justify-between mb-3">
        <Link href="/studio" className="text-white/40 hover:text-white/70 text-sm">← My Games</Link>
        <span className="text-white/30 text-xs">Made by {project.builder}</span>
      </div>
      <h1 className="text-white text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2">
        <span>{d.hero?.emoji || '🎮'}</span><span className="truncate">{d.idea?.name || 'My New Game'}</span>
      </h1>
      <StageBar stage={project.stage} maxStage={project.maxStage} onGo={go} />
      {err && <p className="text-red-400 text-sm my-2">{err}</p>}

      {project.stage === 'build' ? (
        <div className="mt-3"><BuildPanel project={project} builds={builds} previewUrl={previewUrl} refresh={refresh} /></div>
      ) : (
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="order-1">
            <Chat project={project} onSend={send} sending={sending} autoSpeak={autoSpeak} setAutoSpeak={setAutoSpeak} />
            {project.stage === 'mockup' && d.mockup && (
              <button onClick={approve}
                className="mt-4 w-full py-5 rounded-3xl text-xl font-bold bg-gradient-to-r from-naw-green to-emerald-400 text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition">
                ✅ Approve! Build my game
              </button>
            )}
          </div>
          <div className="order-2">
            <PlanPanel project={project} onArt={art} artBusy={project.art?.status === 'queued' || project.art?.status === 'running'} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectPage() {
  const { id } = useParams();
  return <StudioGate>{() => <Project id={id} />}</StudioGate>;
}

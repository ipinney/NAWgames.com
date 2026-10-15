'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { auth } from '@/lib/firebase';
export { money } from '@/lib/flipper/calibration';

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

// ---------- Game state + Flip bus ----------
export const GameCtx = createContext(null);
export function useGame() { return useContext(GameCtx); }

// ---------- Sounds (Web Audio, synthesized) ----------
let _ac = null;
function ac() {
  if (typeof window === 'undefined') return null;
  if (!_ac) { try { _ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (_ac.state === 'suspended') _ac.resume().catch(() => {});
  return _ac;
}
function tone(freq, dur, { type = 'sine', vol = 0.18, when = 0, slide = 0 } = {}) {
  const a = ac(); if (!a) return;
  const t = a.currentTime + when;
  const o = a.createOscillator(); const g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, { vol = 0.15, when = 0, hp = 800 } = {}) {
  const a = ac(); if (!a) return;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = a.createBufferSource(); s.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = a.createGain(); g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(a.destination);
  s.start(a.currentTime + when);
}
export const sfx = {
  pop: () => tone(520, 0.08, { type: 'triangle', slide: 300 }),
  click: () => tone(880, 0.04, { type: 'square', vol: 0.06 }),
  coin: () => { tone(988, 0.08, { type: 'square', vol: 0.1 }); tone(1319, 0.2, { type: 'square', vol: 0.1, when: 0.07 }); },
  cash: () => { noise(0.06, { vol: 0.12, hp: 3000 }); tone(1568, 0.1, { type: 'triangle', when: 0.05 }); tone(2093, 0.25, { type: 'triangle', when: 0.12 }); },
  spend: () => tone(440, 0.18, { type: 'sawtooth', vol: 0.07, slide: -200 }),
  hammer: () => { noise(0.05, { vol: 0.25, hp: 400 }); tone(180, 0.08, { type: 'square', vol: 0.12 }); },
  sparkle: () => [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, 0.12, { type: 'sine', vol: 0.06, when: i * 0.05 })),
  whoosh: () => noise(0.25, { vol: 0.1, hp: 1500 }),
  bad: () => { tone(220, 0.18, { type: 'sawtooth', vol: 0.1 }); tone(165, 0.3, { type: 'sawtooth', vol: 0.1, when: 0.15 }); },
  good: () => { tone(660, 0.1, { type: 'triangle' }); tone(880, 0.16, { type: 'triangle', when: 0.09 }); },
  fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? 0.5 : 0.14, { type: 'square', vol: 0.08, when: i * 0.12 })),
  surprise: () => { tone(300, 0.1, { type: 'square', vol: 0.1 }); tone(240, 0.1, { type: 'square', vol: 0.1, when: 0.12 }); tone(300, 0.2, { type: 'square', vol: 0.1, when: 0.24 }); },
};

// ---------- Confetti burst ----------
export function useConfetti() {
  const [bursts, setBursts] = useState([]);
  const fire = (x = 50, y = 40, n = 40) => {
    const id = Math.random();
    setBursts((b) => [...b, { id, x, y, n }]);
    setTimeout(() => setBursts((b) => b.filter((q) => q.id !== id)), 1600);
  };
  const node = (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {bursts.map((b) => Array.from({ length: b.n }).map((_, i) => {
        const ang = (i / b.n) * Math.PI * 2; const dist = 120 + Math.random() * 220;
        const colors = ['#f59e0b', '#ec4899', '#22c55e', '#3b82f6', '#a855f7', '#facc15'];
        return (
          <span key={`${b.id}-${i}`} className="hf-confetti"
            style={{ left: `${b.x}%`, top: `${b.y}%`, background: colors[i % colors.length],
              '--dx': `${Math.cos(ang) * dist}px`, '--dy': `${Math.sin(ang) * dist + 160}px`, '--r': `${Math.random() * 720}deg` }} />
        );
      }))}
    </div>
  );
  return [node, fire];
}

// Floating "+$500" style text.
export function useFloaters() {
  const [items, setItems] = useState([]);
  const float = (text, x, y, color = '#22c55e') => {
    const id = Math.random();
    setItems((s) => [...s, { id, text, x, y, color }]);
    setTimeout(() => setItems((s) => s.filter((q) => q.id !== id)), 1200);
  };
  const node = (
    <div className="pointer-events-none fixed inset-0 z-[55]">
      {items.map((f) => (
        <span key={f.id} className="hf-float font-black text-2xl" style={{ left: f.x, top: f.y, color: f.color }}>{f.text}</span>
      ))}
    </div>
  );
  return [node, float];
}

// Animated number that counts toward its value.
export function CountUp({ value, format = (v) => v, className = '' }) {
  const [shown, setShown] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const from = ref.current; const to = value; const t0 = performance.now();
    let raf;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 500);
      const v = from + (to - from) * (1 - Math.pow(1 - k, 3));
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step); else ref.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={className}>{format(Math.round(shown))}</span>;
}

export function Btn({ children, onClick, color = 'orange', size = 'md', disabled, className = '', ...rest }) {
  const colors = {
    orange: 'bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-[0_5px_0_#b45309]',
    green: 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-[0_5px_0_#047857]',
    blue: 'bg-sky-400 hover:bg-sky-300 text-sky-950 shadow-[0_5px_0_#0369a1]',
    pink: 'bg-pink-400 hover:bg-pink-300 text-pink-950 shadow-[0_5px_0_#be185d]',
    gray: 'bg-slate-200 hover:bg-white text-slate-800 shadow-[0_5px_0_#64748b]',
    red: 'bg-rose-400 hover:bg-rose-300 text-rose-950 shadow-[0_5px_0_#be123c]',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-base', lg: 'px-7 py-3.5 text-lg' };
  return (
    <button
      {...rest}
      disabled={disabled}
      onClick={(e) => { if (disabled) return; sfx.click(); onClick?.(e); }}
      className={`${colors[color]} ${sizes[size]} rounded-2xl font-extrabold transition-all active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 ${className}`}
    >
      {children}
    </button>
  );
}

export function Panel({ children, className = '' }) {
  return <div className={`rounded-3xl bg-white text-slate-800 shadow-xl ${className}`}>{children}</div>;
}

export function Chip({ children, color = 'bg-slate-100 text-slate-700' }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>{children}</span>;
}

// Shared keyframes for the whole game.
export function GameStyles() {
  return (
    <style>{`
      .hf-root { font-family: 'Nunito', ui-rounded, 'Segoe UI Rounded', system-ui, sans-serif; }
      .hf-confetti { position:absolute; width:10px; height:14px; border-radius:2px; animation: hfConf 1.4s cubic-bezier(.2,.7,.4,1) forwards; }
      @keyframes hfConf { to { transform: translate(var(--dx), var(--dy)) rotate(var(--r)); opacity:0; } }
      .hf-float { position:absolute; transform:translate(-50%,-50%); animation: hfFloat 1.1s ease-out forwards; text-shadow:0 2px 0 rgba(0,0,0,.25); }
      @keyframes hfFloat { from{opacity:1; margin-top:0} to{opacity:0; margin-top:-70px} }
      .hf-pop { animation: hfPop .35s cubic-bezier(.3,1.6,.5,1); }
      @keyframes hfPop { from { transform: scale(.6); opacity:.2 } to { transform: scale(1); opacity:1 } }
      .hf-bob { animation: hfBob 2.4s ease-in-out infinite; }
      @keyframes hfBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
      .hf-shake { animation: hfShake .45s; }
      @keyframes hfShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      .hf-pulse { animation: hfPulse 1.6s ease-in-out infinite; }
      @keyframes hfPulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(251,191,36,.7)} 50%{ box-shadow: 0 0 0 10px rgba(251,191,36,0)} }
      .hf-drop { animation: hfDrop .5s cubic-bezier(.3,1.5,.5,1); }
      @keyframes hfDrop { from { transform: translateY(-40px); opacity:0 } to { transform: translateY(0); opacity:1 } }
      @media (prefers-reduced-motion: reduce) { .hf-bob,.hf-pulse,.hf-shake,.hf-pop,.hf-drop { animation:none } }
    `}</style>
  );
}

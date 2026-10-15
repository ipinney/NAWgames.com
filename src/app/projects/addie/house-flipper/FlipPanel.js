'use client';

import { useEffect, useRef, useState } from 'react';
import { api, sfx } from './ui';
import { FoxSVG } from './art';
import { auth } from '@/lib/firebase';

// Plays Flip's line: ElevenLabs through our route, or the browser voice when that is unavailable.
let currentAudio = null;
async function speakLine(text, onEnd) {
  try {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch('/api/flipper/tts', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ text }),
    });
    if (res.status === 200) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      currentAudio = a;
      a.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
      await a.play();
      return;
    }
  } catch {}
  // Browser voice fallback.
  try {
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find((x) => /Google US English|Samantha|Alex|Daniel/i.test(x.name)) || voices.find((x) => x.lang?.startsWith('en'));
    if (v) u.voice = v;
    u.rate = 1.02; u.pitch = 1.25;
    u.onend = () => onEnd?.();
    window.speechSynthesis.speak(u);
  } catch { onEnd?.(); }
}
export function stopSpeaking() {
  try { if (currentAudio) currentAudio.pause(); window.speechSynthesis?.cancel(); } catch {}
}

export default function FlipPanel({ bindRef, contextRef, onUsage, greet }) {
  const [open, setOpen] = useState(true);
  const [msgs, setMsgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [usage, setUsage] = useState({ usd: 0, warn: false, asleep: false });
  const [voiceOn, setVoiceOn] = useState(true);
  const [talking, setTalking] = useState(false);
  const recRef = useRef(null);
  const finalRef = useRef('');
  const scrollRef = useRef(null);
  const voiceRef = useRef(true);
  voiceRef.current = voiceOn;

  useEffect(() => {
    api('/api/flipper/chat').then((d) => {
      setMsgs(d.messages || []); setUsage(d.usage || {}); onUsage?.(d.usage);
      if (greet && !(d.messages || []).length && !d.usage?.asleep) setTimeout(() => bindRef?.current?.event(greet), 400);
    }).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => { scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' }); }, [msgs, busy, interim]);

  async function send({ text: t, event } = {}) {
    if (busy) return;
    if (usage.asleep && t) { setMsgs((m) => [...m, { role: 'kid', text: t }, { role: 'flip', text: 'Zzz... Flip is asleep until tomorrow. Keep playing, you can do it!' }]); return; }
    if (usage.asleep) return;
    if (t) setMsgs((m) => [...m, { role: 'kid', text: t }]);
    setBusy(true); setOpen(true);
    try {
      const d = await api('/api/flipper/chat', { text: t, event, context: contextRef.current || {} });
      setMsgs((m) => [...m, { role: 'flip', text: d.say }]);
      if (d.usage) { setUsage(d.usage); onUsage?.(d.usage); }
      sfx.pop();
      if (voiceRef.current && d.say) { setTalking(true); speakLine(d.say, () => setTalking(false)); }
    } catch (e) {
      setMsgs((m) => [...m, { role: 'flip', text: 'Oops, my hard hat slipped. Try again in a moment!' }]);
    } finally { setBusy(false); }
  }

  useEffect(() => {
    if (bindRef) bindRef.current = { ask: (t) => send({ text: t }), event: (e) => send({ event: e }), open: () => setOpen(true) };
  });

  // ---------- push to talk ----------
  function startListen() {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR || listening || busy || usage.asleep) return;
    stopSpeaking(); setTalking(false);
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = true;
    finalRef.current = '';
    rec.onresult = (e) => {
      let fin = '', inter = '';
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript; else inter += e.results[i][0].transcript;
      }
      finalRef.current = fin; setInterim((fin + ' ' + inter).trim());
    };
    rec.onerror = () => {};
    rec.onend = () => {
      setListening(false);
      const said = (finalRef.current || '').trim() || interimRef.current.trim();
      setInterim('');
      if (said) send({ text: said });
    };
    recRef.current = rec;
    try { rec.start(); setListening(true); sfx.click(); } catch {}
  }
  const interimRef = useRef('');
  interimRef.current = interim;
  function stopListen() { try { recRef.current?.stop(); } catch {} }

  // Hold space to talk (when not typing in a box).
  useEffect(() => {
    const down = (e) => {
      if (e.code !== 'Space' || e.repeat) return;
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'button' || e.target?.isContentEditable) return;
      e.preventDefault(); startListen();
    };
    const up = (e) => { if (e.code === 'Space' && listening) { e.preventDefault(); stopListen(); } };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  });

  const hasSR = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const mood = usage.asleep ? 'asleep' : busy ? 'wow' : 'happy';

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 rounded-full bg-amber-300 p-1.5 shadow-2xl hf-bob border-4 border-white" aria-label="Open Flip">
        <FoxSVG size={72} mood={mood} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden" style={{ maxHeight: 'min(560px, calc(100vh - 2rem))' }}>
      <div className="flex items-center gap-2 bg-amber-300 px-3 py-2">
        <div className={talking ? 'hf-bob' : ''}><FoxSVG size={48} mood={mood} /></div>
        <div className="flex-1 leading-tight">
          <div className="font-black text-amber-950">Flip the Fox</div>
          <div className="text-xs font-bold text-amber-900/80">
            {usage.asleep ? 'Asleep until tomorrow' : busy ? 'Thinking...' : talking ? 'Talking...' : usage.warn ? 'Getting sleepy, a few more questions today' : 'Your flipping coach'}
          </div>
        </div>
        <button onClick={() => { setVoiceOn((v) => !v); stopSpeaking(); }} className="rounded-full bg-white/70 px-2 py-1 text-xs font-black text-amber-950" aria-label="Toggle voice">
          {voiceOn ? '🔊' : '🔇'}
        </button>
        <button onClick={() => setOpen(false)} className="rounded-full bg-white/70 w-7 h-7 font-black text-amber-950" aria-label="Close Flip">–</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-amber-50 min-h-[140px]">
        {msgs.length === 0 && !busy && (
          <p className="text-sm text-slate-500 font-semibold">Hold the big orange button (or the space bar) and talk to me! You can also type.</p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'kid' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[15px] leading-snug font-semibold ${m.role === 'kid' ? 'bg-sky-500 text-white rounded-br-sm' : 'bg-white text-slate-800 border-2 border-amber-200 rounded-bl-sm'}`}>
              {m.text}
              {m.role === 'flip' && <button onClick={() => { setTalking(true); speakLine(m.text, () => setTalking(false)); }} className="ml-1 align-middle text-xs opacity-60 hover:opacity-100" aria-label="Hear again">🔁</button>}
            </div>
          </div>
        ))}
        {interim && <div className="flex justify-end"><div className="max-w-[85%] rounded-2xl px-3 py-2 text-[15px] bg-sky-200 text-sky-900 italic">{interim}</div></div>}
        {busy && <div className="flex gap-1 pl-2">{[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-amber-400 hf-bob" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
      </div>

      <div className="border-t-2 border-amber-200 p-2 bg-white space-y-2">
        {hasSR && (
          <button
            onPointerDown={(e) => { e.preventDefault(); startListen(); }}
            onPointerUp={stopListen} onPointerLeave={() => listening && stopListen()}
            disabled={busy || usage.asleep}
            className={`w-full rounded-2xl py-3 font-black text-lg select-none transition ${listening ? 'bg-rose-500 text-white scale-[1.02]' : 'bg-amber-400 text-amber-950 shadow-[0_5px_0_#b45309] active:translate-y-1 active:shadow-none'} disabled:opacity-40`}
          >
            {listening ? '🎙️ Listening... let go when done' : '🎙️ Hold to talk to Flip'}
          </button>
        )}
        <form onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (!t) return; setText(''); send({ text: t }); }} className="flex gap-2">
          <input id="hf-flip-text" value={text} onChange={(e) => setText(e.target.value)} placeholder={usage.asleep ? 'Flip is asleep' : 'Or type to Flip...'} disabled={usage.asleep}
            className="flex-1 rounded-xl border-2 border-slate-200 px-3 py-2 text-[15px] font-semibold text-slate-800 focus:border-amber-400 outline-none" maxLength={300} />
          <button type="submit" disabled={busy || !text.trim() || usage.asleep} className="rounded-xl bg-sky-500 px-3 font-black text-white disabled:opacity-40">Send</button>
        </form>
      </div>
    </div>
  );
}

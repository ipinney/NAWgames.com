'use client';

import { useEffect, useState } from 'react';

const KEY = 'dusty-inventory';

const STATES = [
  ['ok', 'Got it', 'bg-green-500/20 border-green-400/60 text-green-300'],
  ['miss', 'Missing', 'bg-naw-orange/20 border-naw-orange/60 text-naw-orange'],
  ['wrong', 'Wrong part', 'bg-naw-pink/20 border-naw-pink/60 text-naw-pink'],
  ['bad', 'Broken', 'bg-red-500/20 border-red-400/60 text-red-300'],
];
const LABEL = Object.fromEntries(STATES.map(([k, l]) => [k, l]));

export default function Receiving({ groups }) {
  const [st, setSt] = useState({});

  useEffect(() => {
    // Parts already checked in (the "in" date on the list) start as Got it.
    // Anything marked on this device wins over that.
    const base = {};
    groups.forEach((g) => g.items.forEach((it) => { if (it.in) base[it.id] = 'ok'; }));
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
    } catch (e) {}
    setSt({ ...base, ...saved });
  }, [groups]);

  function save(next) {
    setSt(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {}
  }

  function mark(id, k) {
    const next = { ...st };
    if (next[id] === k) delete next[id];
    else next[id] = k;
    save(next);
  }

  function reset() {
    save({});
  }

  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, bin: g.bin })));
  const got = all.filter((it) => st[it.id] === 'ok').length;
  const problems = all.filter((it) => st[it.id] && st[it.id] !== 'ok');
  const pct = Math.round((got / all.length) * 100);

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 bg-naw-dark/90 backdrop-blur rounded-2xl border border-white/10 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-white font-bold">
            {got} of {all.length} checked in
          </span>
          <span className={`text-sm font-semibold ${problems.length ? 'text-naw-orange' : 'text-white/40'}`}>
            {problems.length ? `${problems.length} problem${problems.length > 1 ? 's' : ''}` : 'No problems yet'}
          </span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-naw-orange to-yellow-300 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.bin} className="bg-naw-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3">
            <span className="text-yellow-300 font-bold">{g.title}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-naw-cyan/15 text-naw-cyan px-2 py-0.5 rounded-full whitespace-nowrap">
              Bin: {g.bin}
            </span>
          </div>
          <ul className="divide-y divide-white/5">
            {g.items.map((it) => {
              const s = st[it.id];
              return (
                <li key={it.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className={`text-sm font-semibold ${s === 'ok' ? 'text-white/45 line-through' : 'text-white'}`}>{it.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">
                        From: {it.from}
                        {it.in ? <span className="text-green-300/80 font-semibold"> · Checked in {new Date(it.in + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span> : null}
                      </div>
                    </div>
                    <span className="flex-none text-naw-orange text-sm font-bold tabular-nums">× {it.qty}</span>
                  </div>
                  <div className="text-white/60 text-xs mt-1.5 leading-relaxed">
                    <span className="text-naw-cyan font-semibold">Check: </span>
                    {it.check}
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {STATES.map(([k, l, on]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => mark(it.id, k)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                          s === k ? on : 'border-white/10 text-white/45 hover:text-white/80 hover:border-white/30'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="rounded-2xl border border-naw-orange/40 bg-naw-orange/10 p-4">
        <div className="text-naw-orange text-xs font-semibold">Problem list: show this to Dad the same day</div>
        {problems.length ? (
          <ul className="mt-2 space-y-1.5">
            {problems.map((it) => (
              <li key={it.id} className="text-white/85 text-sm flex gap-2">
                <span className="text-naw-orange font-semibold flex-none w-24">{LABEL[st[it.id]]}</span>
                <span>
                  {it.name} <span className="text-white/40">({it.from})</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/60 text-sm mt-1">Nothing here yet. Anything you mark Missing, Wrong part or Broken shows up in this list.</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-white/35 text-xs">Your checkmarks are saved on this device only.</p>
        <button type="button" onClick={reset} className="text-white/40 hover:text-white/80 text-xs font-semibold underline">
          Start over
        </button>
      </div>
    </div>
  );
}

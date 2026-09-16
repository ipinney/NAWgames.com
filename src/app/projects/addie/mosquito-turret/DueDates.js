'use client';

import { useEffect, useState } from 'react';
import { DUE, EVENTS, FAIR, RUBRIC, daysUntil } from './fair';

const NAME = Object.fromEntries(RUBRIC.map((r) => [r.id, r.title]));

function when(n) {
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n > 1) return `${n} days left`;
  return 'Turned in';
}

export default function DueDates({ compact = false }) {
  const [now, setNow] = useState(null);
  useEffect(() => setNow(new Date()), []);
  const nextIdx = now ? DUE.findIndex((d) => daysUntil(d.date, now) >= 0) : -1;

  return (
    <div>
      <ol className="relative border-l-2 border-white/10 ml-3 space-y-4">
        {DUE.map((d, i) => {
          const n = now ? daysUntil(d.date, now) : null;
          const past = n !== null && n < 0;
          const next = i === nextIdx;
          return (
            <li key={d.id} className="pl-6 relative">
              <span
                className={`absolute -left-[9px] top-5 w-4 h-4 rounded-full border-2 ${
                  next ? 'bg-naw-orange border-naw-orange' : past ? 'bg-naw-green border-naw-green' : 'bg-naw-dark border-white/30'
                }`}
              />
              <div
                className={`rounded-2xl border p-4 ${next ? 'bg-naw-orange/10 border-naw-orange/50' : 'bg-naw-card border-white/10'} ${
                  past ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/50 text-xs font-semibold">Part {i + 1} · {d.label}</span>
                  {n !== null && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        next ? 'bg-naw-orange text-naw-dark' : past ? 'bg-naw-green/20 text-naw-green' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {next ? `Next up · ${when(n)}` : when(n)}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mt-1">{d.title}</h3>
                <p className="text-white/60 text-sm mt-1">{d.text}</p>
                {!compact && (
                  <p className="text-white/40 text-xs mt-2">Rubric: {d.rubric.map((r) => NAME[r]).join(' · ')}</p>
                )}
                <a
                  href={`${FAIR}#${d.id}`}
                  className="mt-3 inline-flex bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-naw-cyan/25 transition-colors"
                >
                  How to do it
                </a>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        {EVENTS.map((e) => {
          const n = now ? daysUntil(e.date, now) : null;
          return (
            <div key={e.date} className="rounded-2xl border border-naw-pink/40 bg-naw-pink/10 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-naw-pink text-xs font-semibold">{e.label}</span>
                {n !== null && n >= 0 && <span className="text-xs text-white/50">{n} days</span>}
              </div>
              <div className="text-white font-bold mt-0.5">{e.title}</div>
              <div className="text-white/55 text-sm">{e.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

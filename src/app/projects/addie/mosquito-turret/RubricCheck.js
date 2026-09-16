'use client';

import { useState } from 'react';
import { RUBRIC, SCORES } from './fair';

const TONE = {
  0: 'bg-white/10 text-white/70 border-white/20',
  1: 'bg-naw-pink/20 text-naw-pink border-naw-pink/50',
  3: 'bg-naw-orange/20 text-naw-orange border-naw-orange/50',
  5: 'bg-naw-green/20 text-naw-green border-naw-green/50',
};

export default function RubricCheck() {
  const [score, setScore] = useState({});
  const total = RUBRIC.reduce((s, r) => s + (score[r.id] ?? 0), 0);
  const done = Object.keys(score).length;

  return (
    <div className="bg-naw-card rounded-2xl border border-white/10">
      <div className="divide-y divide-white/5">
        {RUBRIC.map((r, i) => (
          <div key={r.id} className="p-4 grid md:grid-cols-[1fr_auto] gap-3 md:items-center">
            <div>
              <div className="text-white font-semibold text-sm">
                <span className="text-white/40 mr-1">{i + 1}.</span>
                {r.title}
              </div>
              <div className="text-white/50 text-xs mt-0.5">{r.look}</div>
            </div>
            <div className="flex gap-1.5">
              {SCORES.map(([v, label]) => {
                const on = score[r.id] === v;
                return (
                  <button
                    key={v}
                    type="button"
                    title={label}
                    onClick={() => setScore((s) => ({ ...s, [r.id]: v }))}
                    className={`w-11 h-9 rounded-lg border text-sm font-bold transition-colors ${
                      on ? TONE[v] : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-white/10">
        <div className="text-white/50 text-xs">0 not evident · 1 not clear · 3 somewhat clear · 5 very clear</div>
        <div className="flex items-center gap-3">
          <span className="text-white text-lg font-bold tabular-nums">
            {total} <span className="text-white/40 text-sm font-semibold">/ 45</span>
          </span>
          {done > 0 && (
            <button type="button" onClick={() => setScore({})} className="text-white/40 hover:text-white/70 text-xs underline">
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

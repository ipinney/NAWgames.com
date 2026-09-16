'use client';

import { useEffect, useState } from 'react';

const KEY = 'dusty-progress';

export default function PartsCheck({ parts }) {
  const [done, setDone] = useState({});

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(KEY) || '{}') || {});
    } catch (e) {
      setDone({});
    }
  }, []);

  function toggle(k) {
    const next = { ...done };
    if (next[k]) delete next[k];
    else next[k] = 1;
    setDone(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {}
  }

  return (
    <ul className="bg-naw-card rounded-2xl border border-white/10 divide-y divide-white/5">
      {parts.map(([k, name, why, cost]) => (
        <li key={k}>
          <label className="flex items-start gap-3 px-4 py-3 cursor-pointer">
            <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} className="mt-1 h-4 w-4 accent-amber-500 flex-none" />
            <span className="flex-1">
              <span className={`block text-sm font-semibold ${done[k] ? 'text-white/40 line-through' : 'text-white'}`}>{name}</span>
              <span className="block text-white/50 text-xs mt-0.5">{why}</span>
            </span>
            <span className="text-naw-orange text-sm font-bold tabular-nums">{cost}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

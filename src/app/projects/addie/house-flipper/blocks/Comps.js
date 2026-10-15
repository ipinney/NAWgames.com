'use client';

import { useMemo, useState } from 'react';
import { comps as makeComps, compValueFor } from '@/lib/flipper/town';
import { Btn, money, sfx, CountUp } from '../ui';
import { HouseSVG } from '../art';

const HINTS = {
  'Way bigger house': 'This one is a lot bigger than your house. Is it really like yours?',
  'Not fixed up': 'This one was not fixed up when it sold. Your house will be fixed up!',
  'Different neighborhood': 'Look at the neighborhood. Is it the same as yours?',
  'Sold 2 years ago': 'This sold a long time ago. Prices change!',
};

export default function Comps({ house, onDone }) {
  const list = useMemo(() => makeComps(house), [house]);
  const [tray, setTray] = useState([]);
  const [wobble, setWobble] = useState(null);
  const [hint, setHint] = useState('');
  const [drag, setDrag] = useState(null);

  const vals = tray.map((id) => compValueFor(house, list.find((c) => c.id === id)));
  const arv = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length / 1000) * 1000 : 0;
  const traps = tray.filter((id) => !list.find((c) => c.id === id).good).length;

  function add(c) {
    if (tray.includes(c.id) || tray.length >= 5) return;
    setTray((t) => [...t, c.id]);
    if (!c.good) { sfx.surprise(); setWobble(c.id); setHint(HINTS[c.why] || 'Hmm, is this one really like your house?'); setTimeout(() => setWobble(null), 600); }
    else { sfx.coin(); setHint(''); }
  }
  function remove(id) { sfx.click(); setTray((t) => t.filter((x) => x !== id)); setHint(''); }

  return (
    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5">
      <div className="space-y-3">
        <div className="rounded-3xl bg-white p-4 text-slate-800">
          <div className="text-xs font-black text-slate-400">YOUR HOUSE, ONCE FIXED</div>
          <HouseSVG house={house} fixed="all" width={240} className="mx-auto" />
          <div className="font-black">{house.address} · {house.hoodName}</div>
          <div className="text-sm font-bold text-slate-500">{house.sqft.toLocaleString()} sq ft · {house.beds} bed · {house.baths} bath</div>
        </div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => { const c = list.find((x) => x.id === drag); if (c) add(c); setDrag(null); }}
          className={`rounded-3xl p-4 min-h-[180px] border-4 border-dashed ${drag ? 'border-amber-300 bg-amber-300/10' : 'border-white/25 bg-white/5'}`}>
          <div className="font-black text-white mb-2">Comps tray ({tray.length})</div>
          {tray.length === 0 && <div className="text-white/50 font-bold text-sm">Drag sold houses here (or tap them). Pick at least 3 good ones.</div>}
          <div className="space-y-1.5">
            {tray.map((id, i) => {
              const c = list.find((x) => x.id === id);
              return (
                <div key={id} className={`flex items-center justify-between rounded-xl bg-white px-3 py-1.5 text-sm font-bold text-slate-700 ${wobble === id ? 'hf-shake' : 'hf-pop'}`}>
                  <span>{c.address}</span>
                  <span className="text-slate-500">{money(c.price)} → <b className="text-slate-800">{money(vals[i])}</b> for your size</span>
                  <button onClick={() => remove(id)} className="ml-2 text-rose-500 font-black" aria-label="Remove">×</button>
                </div>
              );
            })}
          </div>
          {hint && <div className="mt-2 rounded-xl bg-amber-200 px-3 py-2 text-sm font-black text-amber-950">🦊 {hint}</div>}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-xs font-black text-white/60">YOUR AFTER-REPAIR VALUE (ARV)</div>
              <CountUp value={arv} format={money} className="text-4xl font-black text-amber-300" />
            </div>
            <Btn color="green" disabled={tray.length < 3} onClick={() => { sfx.fanfare(); onDone?.({ arv, comps: tray, traps }); }}>Set my price ▶</Btn>
          </div>
        </div>
      </div>

      <div>
        <div className="font-black text-white mb-2">Houses that sold nearby</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {list.map((c) => {
            const used = tray.includes(c.id);
            return (
              <div key={c.id} draggable={!used} onDragStart={() => setDrag(c.id)} onDragEnd={() => setDrag(null)}
                onClick={() => !used && add(c)}
                className={`rounded-2xl p-3 cursor-grab select-none transition ${used ? 'bg-white/20 opacity-50' : 'bg-white hover:-translate-y-1 hover:shadow-xl'}`}>
                <div className="flex justify-between items-start">
                  <div className="font-black text-slate-800">{c.address}</div>
                  <div className="text-xl font-black text-emerald-600">{money(c.price)}</div>
                </div>
                <div className="text-sm font-bold text-slate-500">{c.hood}</div>
                <div className="mt-1 grid grid-cols-2 gap-x-2 text-sm font-bold text-slate-600">
                  <span>📐 {c.sqft.toLocaleString()} sq ft</span>
                  <span>🛏️ {c.beds} bed</span>
                  <span>{c.updated ? '✨ Fixed up' : '🏚️ Not fixed up'}</span>
                  <span>📅 {c.monthsAgo} {c.monthsAgo === 1 ? 'month' : 'months'} ago</span>
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">{money(Math.round(c.price / c.sqft))} per sq ft</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

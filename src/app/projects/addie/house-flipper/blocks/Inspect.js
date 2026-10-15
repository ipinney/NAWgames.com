'use client';

import { useMemo, useState } from 'react';
import { ROOMS, COST_BOOK, MONEY, costFor } from '@/lib/flipper/calibration';
import { useGame, Btn, money, sfx, CountUp } from '../ui';
import { HouseSVG } from '../art';

const ROOM_EMOJI = { kitchen: '🍳', bath: '🛁', living: '🛋️', bedrooms: '🛏️', roof: '🏠', systems: '❄️', foundation: '🧱', outside: '🌳' };
const CLUES = {
  kitchen: { good: 'Shiny counters. Everything works.', love: 'Old cabinets and faded paint, but it all works.', rough: 'Broken cabinet doors, the stove does not turn on, and the floor is peeling.' },
  bath: { good: 'Clean tile and a strong shower.', love: 'Old yellow tile and a drippy faucet.', rough: 'The toilet wobbles, tiles are cracked, and there is a water stain.' },
  living: { good: 'Bright and clean.', love: 'Scuffed walls that need paint.', rough: 'Torn carpet, cracked window, stains on the walls.' },
  bedrooms: { good: 'Ready to move in.', love: 'Paint is chipped and marked up.', rough: 'Ripped carpet and a broken window.' },
  roof: { good: 'Straight shingles, no leaks.', love: 'A few curled shingles. It is getting old.', rough: 'There is a hole and a blue tarp on it!' },
  systems: { good: 'Cold A/C and a new electric panel.', love: 'The A/C is old and noisy.', rough: 'The A/C is broken and the wiring is very old.' },
  foundation: { good: 'Doors close nicely. Floors are flat.', love: 'One door sticks a little.', rough: 'A big crack outside and the floor slopes. A marble rolls across it!' },
  outside: { good: 'Nice paint and a tidy yard.', love: 'The yard is messy and weedy.', rough: 'Peeling paint, waist-high weeds, a broken fence.' },
};
const GRADES = [['good', 'Good', 'bg-emerald-400'], ['love', 'Needs love', 'bg-amber-400'], ['rough', 'Rough', 'bg-rose-400']];

export default function Inspect({ house, grade = true, onDone, showTruth = true }) {
  const g = useGame();
  const [phase, setPhase] = useState(grade ? 'grade' : 'budget');
  const [grades, setGrades] = useState(grade ? {} : { ...house.rooms });
  const [room, setRoom] = useState(ROOMS[0].key);
  const [plan, setPlan] = useState({}); // fixKey -> tier
  const [fundPct, setFundPct] = useState(0);
  const [shake, setShake] = useState(null);

  const graded = Object.keys(grades).length;
  const right = ROOMS.filter((r) => grades[r.key] === house.rooms[r.key]).length;

  const fixesForRoom = (rk) => ROOMS.find((r) => r.key === rk).fixes;
  const costOf = (k, tier) => costFor(k, tier, house.sqft) * (k === 'bath' ? Math.max(1, Math.round(house.baths)) : 1);
  const subtotal = Object.entries(plan).reduce((s, [k, t]) => s + costOf(k, t), 0);
  const fund = Math.round(subtotal * fundPct / 100 / 100) * 100;
  const total = subtotal + fund;

  // Which rooms are covered by the plan (for the house picture and the finish score).
  const fixedRooms = useMemo(() => {
    const out = {};
    for (const r of ROOMS) {
      if (house.rooms[r.key] === 'good') continue;
      const needs = r.fixes.filter((k) => plan[k]);
      if (needs.length) out[r.key] = true;
    }
    return out;
  }, [plan, house]);
  const badRooms = ROOMS.filter((r) => house.rooms[r.key] !== 'good');
  const coverage = badRooms.length ? Object.keys(fixedRooms).length / badRooms.length : 1;

  function setGrade(rk, v) {
    if (house.rooms[rk] === v) { sfx.good(); } else { sfx.bad(); setShake(rk); setTimeout(() => setShake(null), 450); }
    setGrades((s) => ({ ...s, [rk]: v }));
    const i = ROOMS.findIndex((r) => r.key === rk);
    if (house.rooms[rk] === v && ROOMS[i + 1] && !grades[ROOMS[i + 1].key]) setTimeout(() => setRoom(ROOMS[i + 1].key), 350);
  }
  function setTier(k, tier) {
    setPlan((p) => {
      const n = { ...p };
      if (n[k] === tier) { delete n[k]; sfx.click(); } else { n[k] = tier; sfx.hammer(); }
      return n;
    });
  }

  if (phase === 'grade') {
    const r = ROOMS.find((x) => x.key === room);
    const truth = house.rooms[room];
    return (
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
        <div className="rounded-3xl bg-white p-4">
          <HouseSVG house={house} width={300} className="mx-auto" />
          <div className="text-center font-black text-slate-800">{house.address}</div>
          <div className="text-center text-sm font-bold text-slate-500">{house.sqft.toLocaleString()} sq ft · {house.beds} bed · {house.baths} bath · built {house.built}</div>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {ROOMS.map((x) => {
              const v = grades[x.key]; const ok = v && v === house.rooms[x.key];
              return (
                <button key={x.key} onClick={() => { sfx.click(); setRoom(x.key); }}
                  className={`rounded-2xl p-2 text-center ${room === x.key ? 'ring-4 ring-amber-300' : ''} ${v ? (ok ? 'bg-emerald-100' : 'bg-rose-100') : 'bg-white'}`}>
                  <div className="text-2xl">{ROOM_EMOJI[x.key]}</div>
                  <div className="text-[11px] font-black text-slate-700 leading-tight">{x.name}</div>
                </button>
              );
            })}
          </div>
          <div className={`rounded-3xl bg-white p-5 text-slate-800 ${shake === room ? 'hf-shake' : ''}`}>
            <div className="text-4xl">{ROOM_EMOJI[room]}</div>
            <div className="text-2xl font-black">{r.name}</div>
            <p className="text-lg font-semibold text-slate-600 mt-1">&ldquo;{CLUES[room][truth]}&rdquo;</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {GRADES.map(([v, label, bg]) => (
                <button key={v} onClick={() => setGrade(room, v)}
                  className={`${bg} rounded-2xl px-4 py-2.5 font-black text-slate-900 shadow-[0_4px_0_rgba(0,0,0,.25)] active:translate-y-1 active:shadow-none ${grades[room] === v ? 'ring-4 ring-slate-900' : ''}`}>{label}</button>
              ))}
            </div>
            {grades[room] && grades[room] !== truth && <p className="mt-3 font-bold text-rose-600">Hmm, read the clue again. Try another grade!</p>}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="font-black text-white">{right} of 8 rooms graded right</div>
            <Btn color="green" disabled={right < 8} onClick={() => { sfx.sparkle(); setPhase('budget'); }}>Plan the fixes ▶</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.3fr] gap-5">
      <div className="space-y-3">
        <div className="rounded-3xl bg-white p-4">
          <HouseSVG house={house} fixed={fixedRooms} width={300} className="mx-auto" />
          <div className="text-center text-sm font-black text-slate-500">Preview: rooms you plan to fix turn bright</div>
        </div>
        <div className="rounded-3xl bg-slate-900/60 p-4 text-white">
          <div className="flex justify-between font-bold"><span>Fixes</span><CountUp value={subtotal} format={money} className="font-black" /></div>
          <div className="mt-3">
            <div className="flex justify-between font-bold"><span>Surprise fund ({fundPct}%)</span><span className="font-black">{money(fund)}</span></div>
            <input id="hf-fund" type="range" min="0" max="25" step="1" value={fundPct} onChange={(e) => setFundPct(Number(e.target.value))} className="w-full accent-amber-400" />
            <div className="text-xs font-bold text-white/60">Pros save 10 to 15 percent extra for problems they find later.</div>
          </div>
          <div className="flex justify-between text-2xl font-black mt-3 pt-3 border-t border-white/20"><span>Budget</span><CountUp value={total} format={money} className="text-amber-300" /></div>
          <div className="mt-2 h-3 rounded-full bg-white/15 overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${Math.round(coverage * 100)}%` }} /></div>
          <div className="text-xs font-bold text-white/70 mt-1">{Object.keys(fixedRooms).length} of {badRooms.length} broken rooms in the plan</div>
        </div>
        <Btn size="lg" color="green" disabled={subtotal === 0 && badRooms.length > 0} onClick={() => {
          sfx.fanfare();
          onDone?.({ items: Object.entries(plan).map(([k, t]) => ({ key: k, tier: t, cost: costOf(k, t) })), subtotal, fundPct, fund, total, fixedRooms, coverage, gradeRight: right });
        }}>Lock in my budget ▶</Btn>
      </div>
      <div className="space-y-3">
        {badRooms.map((r) => (
          <div key={r.key} className="rounded-3xl bg-white p-4 text-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{ROOM_EMOJI[r.key]}</span>
              <span className="font-black text-lg">{r.name}</span>
              <span className={`text-xs font-black rounded-full px-2 py-0.5 ${house.rooms[r.key] === 'rough' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{house.rooms[r.key] === 'rough' ? 'Rough' : 'Needs love'}</span>
              {fixedRooms[r.key] && <span className="ml-auto text-emerald-600 font-black">✓ planned</span>}
            </div>
            <div className="text-sm font-semibold text-slate-500 mb-2">{CLUES[r.key][house.rooms[r.key]]}</div>
            <div className="space-y-2">
              {fixesForRoom(r.key).map((k) => (
                <div key={k} className="flex flex-wrap items-center gap-2">
                  <span className="w-36 font-black text-sm">{COST_BOOK[k].emoji} {COST_BOOK[k].name}</span>
                  {['low', 'mid', 'high'].map((t) => (
                    <button key={t} onClick={() => setTier(k, t)}
                      className={`rounded-xl px-2.5 py-1 text-sm font-black border-2 ${plan[k] === t ? 'bg-amber-300 border-amber-500 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300'}`}>
                      {t === 'low' ? 'Basic' : t === 'mid' ? 'Good' : 'Fancy'} {money(costOf(k, t))}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        {badRooms.length === 0 && <div className="rounded-3xl bg-white p-4 font-bold text-slate-700">This house needs almost nothing! Lucky.</div>}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useGame, Btn, money, sfx, CountUp } from '../ui';
import { HouseSVG } from '../art';

const START = 200000;
const BUY = 120000;
const SELL = 190000;
const FIXES = [
  { key: 'roof', label: 'Fix the roof', cost: 12000, x: '50%', y: '18%' },
  { key: 'living', label: 'New windows', cost: 8000, x: '26%', y: '58%' },
  { key: 'outside', label: 'Paint and yard', cost: 10000, x: '80%', y: '82%' },
];
const FANCY = [
  { key: 'pool', label: 'Swimming pool', emoji: '🏊', cost: 45000, adds: 6000 },
  { key: 'gold', label: 'Gold toilet', emoji: '🚽', cost: 25000, adds: 0 },
  { key: 'chandelier', label: 'Giant chandelier', emoji: '💎', cost: 15000, adds: 1000 },
  { key: 'slide', label: 'Indoor slide', emoji: '🛝', cost: 20000, adds: 0 },
];
const SHACK = { color: '#fcd34d', roofColor: '#7c2d12', rooms: { roof: 'rough', living: 'rough', outside: 'rough' } };

export default function Level1({ onTaskDone }) {
  const g = useGame();
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState('buy'); // buy, fix, sell, result
  const [cash, setCash] = useState(START);
  const [fixed, setFixed] = useState({});
  const [fancy, setFancy] = useState([]);
  const [dragOver, setDragOver] = useState(null);
  const [results, setResults] = useState([]);

  const allFixed = FIXES.every((f) => fixed[f.key]);
  const fancyCost = FANCY.filter((f) => fancy.includes(f.key)).reduce((s, f) => s + f.cost, 0);
  const salePrice = SELL + FANCY.filter((f) => fancy.includes(f.key)).reduce((s, f) => s + f.adds, 0);

  function doBuy() {
    if (phase !== 'buy') return;
    sfx.spend(); g.float(`-${money(BUY)}`, window.innerWidth / 2, window.innerHeight / 3, '#ef4444');
    setCash((c) => c - BUY); setPhase('fix');
  }
  function doFix(f, e) {
    if (phase !== 'fix' || fixed[f.key]) return;
    sfx.hammer(); setTimeout(sfx.sparkle, 120);
    g.float(`-${money(f.cost)}`, e.clientX, e.clientY, '#ef4444');
    setCash((c) => c - f.cost); setFixed((s) => ({ ...s, [f.key]: true }));
  }
  function addFancy(f, e) {
    if (fancy.includes(f.key)) return;
    sfx.spend(); g.float(`-${money(f.cost)}`, e.clientX, e.clientY, '#ef4444');
    setCash((c) => c - f.cost); setFancy((s) => [...s, f.key]);
  }
  function doSell() {
    if (phase !== 'sell') return;
    sfx.cash(); g.float(`+${money(salePrice)}`, window.innerWidth / 2, window.innerHeight / 3, '#22c55e');
    const spent = BUY + FIXES.reduce((s, f) => s + f.cost, 0) + fancyCost;
    const profit = salePrice - spent;
    setCash((c) => c + salePrice);
    setResults((r) => [...r, { round, spent, sale: salePrice, profit, fancy: [...fancy] }]);
    setPhase('result');
    if (profit > 0) { g.fire(50, 35, 50); setTimeout(sfx.fanfare, 300); } else setTimeout(sfx.bad, 300);
    g.flip.event(round === 1
      ? `Level 1 round 1: Addie bought a shack for ${BUY}, spent 30000 on fixes, sold for ${salePrice}. Profit ${profit}. Celebrate in 2 short sentences and explain profit = sell price minus everything spent.`
      : `Level 1 round 2: Addie added fancy extras (${fancy.join(', ')}) costing ${fancyCost}. Sold for ${salePrice}. Profit ${profit}. In 2 short sentences, explain why fancy extras did not pay off.`);
  }
  function nextRound() {
    sfx.whoosh(); setRound(2); setPhase('buy'); setCash(START); setFixed({}); setFancy([]);
  }

  const pads = [
    ['buy', 'BUY', '🏷️', 'bg-sky-400', doBuy],
    ['fix', 'FIX', '🔨', 'bg-amber-400', null],
    ['sell', 'SELL', '💰', 'bg-emerald-400', doSell],
  ];

  return (
    <div className="space-y-4">
      {/* Money bar */}
      <div className="rounded-3xl bg-slate-900/60 p-4">
        <div className="flex justify-between items-end text-white">
          <div className="font-black">Round {round} · My money</div>
          <CountUp value={cash} format={money} className={`text-4xl font-black ${cash >= START ? 'text-emerald-300' : 'text-amber-300'}`} />
        </div>
        <div className="mt-2 h-6 rounded-full bg-white/10 overflow-hidden relative">
          <div className={`h-full transition-all duration-500 ${cash >= START ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, (cash / 260000) * 100)}%` }} />
          <div className="absolute top-0 bottom-0 border-l-4 border-white/80" style={{ left: `${(START / 260000) * 100}%` }} title="Where you started" />
        </div>
        <div className="text-xs font-bold text-white/60 mt-1">The white line is where you started. End past it and you made a profit!</div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="rounded-3xl bg-white p-4 relative">
          <div className="relative mx-auto" style={{ width: 340 }}
            draggable={phase === 'buy' || phase === 'sell'}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', 'house')}>
            <HouseSVG house={SHACK} fixed={phase === 'buy' ? {} : fixed} width={340} />
            {phase === 'fix' && FIXES.map((f) => !fixed[f.key] && (
              <button key={f.key} onClick={(e) => doFix(f, e)} style={{ left: f.x, top: f.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 text-white font-black px-3 py-1.5 text-sm shadow-lg hf-pulse">
                🔨 {f.label} {money(f.cost)}
              </button>
            ))}
          </div>
          <div className="text-center font-black text-slate-700 mt-1">
            {phase === 'buy' && 'Drag the house onto BUY (or tap BUY)'}
            {phase === 'fix' && (round === 1 ? 'Tap the red spots to fix the house!' : 'Fix the red spots. Want to add fancy stuff too? 👉')}
            {phase === 'sell' && 'Drag the house onto SELL (or tap SELL)'}
            {phase === 'result' && 'Done!'}
          </div>
          {phase === 'fix' && allFixed && (
            <div className="text-center mt-3"><Btn color="green" disabled={round === 2 && fancy.length === 0} onClick={() => { sfx.sparkle(); setPhase('sell'); }}>All fixed! Time to sell ▶</Btn></div>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {pads.map(([k, label, emoji, bg, act]) => (
              <button key={k}
                onDragOver={(e) => { e.preventDefault(); setDragOver(k); }} onDragLeave={() => setDragOver(null)}
                onDrop={(e) => { e.preventDefault(); setDragOver(null); act?.(); }}
                onClick={() => act?.()}
                className={`${bg} rounded-3xl py-6 text-center font-black text-slate-900 transition ${phase === k ? 'ring-8 ring-white/70 hf-pulse scale-105' : 'opacity-60'} ${dragOver === k ? 'scale-110' : ''}`}>
                <div className="text-4xl">{emoji}</div>{label}
              </button>
            ))}
          </div>

          {round === 2 && phase === 'fix' && (
            <div className="rounded-3xl bg-white p-4">
              <div className="font-black text-slate-800">Fancy extras</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {FANCY.map((f) => (
                  <button key={f.key} onClick={(e) => addFancy(f, e)} disabled={fancy.includes(f.key)}
                    className={`rounded-2xl p-2 text-left font-bold border-2 ${fancy.includes(f.key) ? 'bg-pink-100 border-pink-300' : 'bg-slate-50 border-slate-200 hover:border-pink-300'}`}>
                    <span className="text-2xl">{f.emoji}</span> {f.label}<div className="text-sm text-rose-600">{money(f.cost)}</div>
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-2">Add at least one, just to see what happens!</div>
            </div>
          )}

          {phase === 'result' && (
            <div className="rounded-3xl bg-white p-5 text-slate-800 hf-pop">
              {results.map((r) => (
                <div key={r.round} className="flex justify-between font-bold py-1 border-b border-slate-100 last:border-0">
                  <span>Round {r.round}{r.fancy.length ? ' (fancy)' : ''}</span>
                  <span className={r.profit > 0 ? 'text-emerald-600' : 'text-rose-600'}>{r.profit > 0 ? 'Profit ' : 'Lost '}{money(Math.abs(r.profit))}</span>
                </div>
              ))}
              <div className="mt-3">
                {round === 1
                  ? <Btn color="orange" onClick={nextRound}>Try round 2: fancy mode ▶</Btn>
                  : <Btn color="green" onClick={() => onTaskDone?.({ results })}>I get it! ▶</Btn>}
              </div>
            </div>
          )}
        </div>
      </div>
      {round === 2 && phase === 'fix' && allFixed && fancy.length === 0 && <p className="text-center text-amber-200 font-black">Add a fancy extra first, then sell!</p>}
    </div>
  );
}

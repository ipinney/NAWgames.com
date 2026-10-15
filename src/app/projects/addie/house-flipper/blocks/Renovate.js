'use client';

import { useMemo, useState } from 'react';
import { ROOMS, COST_BOOK } from '@/lib/flipper/calibration';
import { useGame, Btn, money, sfx, CountUp } from '../ui';
import { HouseSVG } from '../art';

const TAPS_PER_MONTH = 8;

function roomsForItem(key) { return ROOMS.filter((r) => r.fixes.includes(key)).map((r) => r.key); }

export default function Renovate({ house, budget, monthly, months, surprises = [], onDone }) {
  const g = useGame();
  const items = budget.items;
  // Spread planned fixes across the months.
  const schedule = useMemo(() => {
    const per = Math.max(1, Math.ceil(items.length / months));
    return Array.from({ length: months }, (_, m) => items.slice(m * per, (m + 1) * per).map((x) => x.key));
  }, [items, months]);

  const [month, setMonth] = useState(1);
  const [totalMonths, setTotalMonths] = useState(months);
  const [taps, setTaps] = useState(0);
  const [doneItems, setDoneItems] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [fundLeft, setFundLeft] = useState(budget.fund);
  const [extraCash, setExtraCash] = useState(0);
  const [holding, setHolding] = useState(0);
  const [card, setCard] = useState(null);
  const [seen, setSeen] = useState([]);
  const [log, setLog] = useState([]);
  const [shake, setShake] = useState(false);

  const fixed = useMemo(() => {
    const out = {};
    for (const k of doneItems) for (const rk of roomsForItem(k)) out[rk] = true;
    return out;
  }, [doneItems]);

  const thisMonthItems = (schedule[month - 1] || []).filter((k) => !skipped.includes(k));
  const monthDone = taps >= TAPS_PER_MONTH;
  const remaining = items.filter((x) => !doneItems.includes(x.key) && !skipped.includes(x.key));

  const at = (x) => Math.min(Math.max(2, x.atMonth), months);

  function tap(e) {
    if (monthDone || card) return;
    sfx.hammer();
    g.float(['Bang!', 'Tap!', '+1', 'Nice!', 'Bonk!'][taps % 5], e.clientX, e.clientY, '#f59e0b');
    const t = taps + 1;
    setTaps(t);
    if (t >= TAPS_PER_MONTH) {
      sfx.sparkle();
      setDoneItems((d) => [...new Set([...d, ...thisMonthItems])]);
      // Pay this month's bills.
      setHolding((h) => h + monthly);
      setLog((l) => [...l, `Month ${month}: ${thisMonthItems.length ? thisMonthItems.map((k) => COST_BOOK[k].name).join(', ') : 'finishing touches'} done. Bills ${money(monthly)}.`]);
    }
  }

  function nextMonth() {
    sfx.whoosh();
    const m = month + 1;
    if (m > totalMonths) {
      const badRooms = ROOMS.filter((r) => house.rooms[r.key] !== 'good');
      const covered = badRooms.filter((r) => fixed[r.key]).length;
      const finish = badRooms.length ? covered / badRooms.length : 1;
      const fixSpent = items.filter((x) => doneItems.includes(x.key)).reduce((s, x) => s + x.cost, 0);
      onDone?.({ months: totalMonths, holding, fixSpent, fundUsed: budget.fund - fundLeft, extraCash, skipped, finish, fixed, log });
      return;
    }
    setMonth(m); setTaps(0);
    const s = surprises.find((x) => at(x) === m && !seen.includes(x.key));
    if (s) { setTimeout(() => { sfx.surprise(); setShake(true); setTimeout(() => setShake(false), 500); setCard(s); }, 300); }
  }

  function resolve(how) {
    const s = card;
    setSeen((x) => [...x, s.key]);
    if (s.months) {
      setTotalMonths((t) => t + s.months);
      setLog((l) => [...l, `${s.title}: ${s.months} extra month.`]);
    }
    if (s.cost) {
      if (how === 'fund') { setFundLeft((f) => f - s.cost); sfx.spend(); }
      else if (how === 'cash') { setExtraCash((c) => c + s.cost); sfx.spend(); }
      else if (how === 'skip') {
        const victim = [...remaining].sort((a, b) => b.cost - a.cost).find((x) => x.cost >= s.cost) || remaining[remaining.length - 1];
        if (victim) { setSkipped((k) => [...k, victim.key]); setLog((l) => [...l, `Skipped ${COST_BOOK[victim.key].name} to pay for it.`]); }
      }
      setLog((l) => [...l, `${s.title}: ${money(s.cost)} (${how === 'fund' ? 'surprise fund' : how === 'cash' ? 'my savings' : 'skipped a fix'}).`]);
    }
    g.flip.event(`Surprise during renovation: "${s.title}" costing ${s.cost} and ${s.months || 0} extra months. Addie chose: ${how}. Lesson: ${s.lesson} React in 2 sentences.`);
    const nextCard = surprises.find((x) => at(x) === month && x.key !== s.key && !seen.includes(x.key));
    setCard(null);
    if (nextCard) setTimeout(() => { sfx.surprise(); setCard(nextCard); }, 700);
  }

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
      <div className={`rounded-3xl bg-white p-4 text-slate-800 relative ${shake ? 'hf-shake' : ''}`}>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-black">Month {month} of {totalMonths}</div>
          <div className="flex gap-1">{Array.from({ length: totalMonths }).map((_, i) => <span key={i} className={`w-5 h-5 rounded-md ${i < month - 1 || (i === month - 1 && monthDone) ? 'bg-emerald-400' : i === month - 1 ? 'bg-amber-300' : 'bg-slate-200'}`} />)}</div>
        </div>
        <button onClick={tap} className="block mx-auto my-2 cursor-pointer active:scale-[.98] transition" aria-label="Hammer the house">
          <HouseSVG house={house} fixed={fixed} width={360} />
        </button>
        <div className="text-center font-black text-slate-600">{monthDone ? 'This month\'s work is done!' : `Tap the house to work! 🔨 This month: ${thisMonthItems.length ? thisMonthItems.map((k) => COST_BOOK[k].name).join(', ') : 'clean up'}`}</div>
        <div className="mt-2 h-4 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-amber-400 transition-all" style={{ width: `${Math.min(100, (taps / TAPS_PER_MONTH) * 100)}%` }} /></div>
        {monthDone && <div className="mt-3 text-center"><Btn size="lg" color="green" onClick={nextMonth}>{month >= totalMonths ? 'Finish the house! ✨' : 'Next month ▶'}</Btn></div>}

        {card && (
          <div className="absolute inset-0 rounded-3xl bg-slate-900/70 flex items-center justify-center p-4">
            <div className="rounded-3xl bg-white p-5 max-w-md hf-pop">
              <div className="text-5xl">{card.emoji}</div>
              <div className="text-xs font-black text-rose-500">SURPRISE!</div>
              <div className="text-2xl font-black">{card.title}</div>
              <div className="font-bold text-slate-600 mt-1">{card.cost ? `Fixing it costs ${money(card.cost)}.` : ''} {card.months ? `It adds ${card.months} month (${money(monthly * card.months)} more in bills).` : ''}</div>
              <div className="mt-4 flex flex-col gap-2">
                {card.cost > 0 && <Btn color="green" disabled={fundLeft < card.cost} onClick={() => resolve('fund')}>Use my surprise fund ({money(fundLeft)} left)</Btn>}
                {card.cost > 0 && <Btn color="orange" onClick={() => resolve('cash')}>Pay from my savings</Btn>}
                {card.cost > 0 && remaining.length > 0 && <Btn color="gray" onClick={() => resolve('skip')}>Skip a fix to pay for it</Btn>}
                {!card.cost && <Btn color="orange" onClick={() => resolve('wait')}>Okay, we wait</Btn>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="rounded-3xl bg-slate-900/60 p-4 text-white font-bold space-y-1">
          <div className="flex justify-between"><span>Surprise fund left</span><CountUp value={fundLeft} format={money} className="font-black text-emerald-300" /></div>
          <div className="flex justify-between"><span>Extra from savings</span><CountUp value={extraCash} format={money} className="font-black text-rose-300" /></div>
          <div className="flex justify-between"><span>Bills paid so far</span><CountUp value={holding} format={money} className="font-black text-amber-300" /></div>
          <div className="flex justify-between text-sm text-white/60"><span>Bills each month</span><span>{money(monthly)}</span></div>
        </div>
        <div className="rounded-3xl bg-white p-4 text-slate-800">
          <div className="font-black mb-1">Work list</div>
          <div className="space-y-1">
            {items.map((x) => (
              <div key={x.key} className={`flex justify-between text-sm font-bold ${skipped.includes(x.key) ? 'line-through text-slate-400' : doneItems.includes(x.key) ? 'text-emerald-600' : 'text-slate-600'}`}>
                <span>{doneItems.includes(x.key) ? '✅' : skipped.includes(x.key) ? '✖️' : '⬜'} {COST_BOOK[x.key].name}</span><span>{money(x.cost)}</span>
              </div>
            ))}
          </div>
        </div>
        {log.length > 0 && <div className="rounded-3xl bg-white/10 p-3 text-white/80 text-sm font-semibold space-y-0.5 max-h-40 overflow-y-auto">{log.map((l, i) => <div key={i}>• {l}</div>)}</div>}
      </div>
    </div>
  );
}

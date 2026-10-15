'use client';

import { useEffect, useState } from 'react';
import { MONEY } from '@/lib/flipper/calibration';
import { useGame, Btn, money, sfx, CountUp } from '../ui';
import { HouseSVG } from '../art';
import { splitOutcome } from './Split';

export function plannedProfit({ arv, price, budget, finance, months }) {
  const sell = Math.round(arv * MONEY.sellCostPct);
  return Math.round(arv - sell - price - finance.closing - budget.total - finance.points - finance.monthly.total * (months + 1));
}

export function actualNumbers(d) {
  const sale = d.sale.salePrice;
  const sellCosts = d.sale.sellCosts;
  const fix = d.reno.fixSpent + d.reno.fundUsed + d.reno.extraCash;
  const holding = d.reno.holding + d.sale.sellHolding;
  const profit = sale - sellCosts - d.price - d.finance.closing - fix - d.finance.points - holding;
  return { sale, sellCosts, fix, holding, profit, months: d.reno.months + Math.ceil(d.sale.weeks / 4) };
}

export default function Report({ d, onFinish, busy }) {
  const g = useGame();
  const a = actualNumbers(d);
  const planned = d.planned;
  const win = a.profit > 0;
  const [told, setTold] = useState(false);

  useEffect(() => {
    if (win) { sfx.fanfare(); g.fire(50, 30, 90); } else sfx.bad();
    if (!told) {
      setTold(true);
      g.flip.event(`Addie finished practice flip ${d.practice}. Planned profit ${planned}, actual profit ${a.profit}. Bought for ${d.price} (max offer was ${d.maxOffer}), fix budget ${d.budget.total} vs spent ${a.fix}, bills ${a.holding}, sold for ${a.sale} vs her ARV guess ${d.arv}, ${d.reno.skipped.length} fixes skipped, ${a.months} months. ${win ? 'She made money!' : 'She lost money.'} In 3 short sentences: celebrate or comfort her, name the one thing that helped or hurt most, and one tip for next time.`);
    }
  }, []); // eslint-disable-line

  const rows = [
    ['Sold for', d.arv, a.sale, true],
    ['Selling costs (6%)', -Math.round(d.arv * MONEY.sellCostPct), -a.sellCosts],
    ['Bought for', -d.price, -d.price],
    ['Closing + points', -(d.finance.closing + d.finance.points), -(d.finance.closing + d.finance.points)],
    ['Fixes + surprises', -d.budget.total, -a.fix],
    ['Bills while you owned it', -d.finance.monthly.total * (d.months + 1), -a.holding],
  ];
  const inv = d.invest ? splitOutcome(a.profit, d.invest.invest, d.invest.sharePct) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className={`rounded-[2rem] p-6 text-center ${win ? 'bg-gradient-to-br from-emerald-300 to-sky-300' : 'bg-gradient-to-br from-rose-200 to-amber-200'}`}>
        <HouseSVG house={d.house} fixed={d.reno.fixed} width={220} className="mx-auto" />
        <div className="text-sm font-black text-slate-700">{d.house.address} · {a.months} months</div>
        <div className="text-xl font-black text-slate-800 mt-1">{win ? 'YOU MADE A PROFIT!' : 'This flip lost money'}</div>
        <CountUp value={a.profit} format={money} className={`text-6xl font-black ${win ? 'text-emerald-800' : 'text-rose-700'}`} />
        <div className="font-bold text-slate-700 mt-1">You planned {money(planned)}</div>
      </div>

      <div className="rounded-3xl bg-white p-5 text-slate-800">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-1.5 font-bold">
          <div className="text-xs font-black text-slate-400">REPORT CARD</div><div className="text-xs font-black text-slate-400 text-right">PLANNED</div><div className="text-xs font-black text-slate-400 text-right">ACTUAL</div>
          {rows.map(([k, p, act]) => {
            const better = act >= p;
            return [
              <div key={k + 'k'}>{k}</div>,
              <div key={k + 'p'} className="text-right tabular-nums text-slate-500">{money(p)}</div>,
              <div key={k + 'a'} className={`text-right tabular-nums ${act === p ? '' : better ? 'text-emerald-600' : 'text-rose-600'}`}>{money(act)}</div>,
            ];
          })}
          <div className="font-black border-t border-slate-200 pt-1.5">Profit</div>
          <div className="text-right tabular-nums font-black border-t border-slate-200 pt-1.5">{money(planned)}</div>
          <div className={`text-right tabular-nums font-black border-t border-slate-200 pt-1.5 ${win ? 'text-emerald-600' : 'text-rose-600'}`}>{money(a.profit)}</div>
        </div>
        {d.reno.skipped.length > 0 && <p className="mt-3 text-sm font-bold text-amber-700">You skipped {d.reno.skipped.length} fix{d.reno.skipped.length > 1 ? 'es' : ''}, so buyers paid a little less.</p>}
        {d.price > d.maxOffer && <p className="mt-1 text-sm font-bold text-rose-600">You paid {money(d.price - d.maxOffer)} more than your 70% rule max offer.</p>}
      </div>

      {inv && (
        <div className="rounded-3xl bg-white p-5 text-slate-800 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-pink-50 p-3"><div className="text-xs font-black text-pink-700">MOM AND DAD ({d.invest.sharePct}%)</div><div className="text-2xl font-black text-pink-700">{money(inv.investors)}</div><div className="text-xs font-bold text-slate-500">plus their {money(inv.investorsBack)} back</div></div>
          <div className="rounded-2xl bg-amber-50 p-3"><div className="text-xs font-black text-amber-700">ADDIE ({100 - d.invest.sharePct}%)</div><div className="text-2xl font-black text-amber-700">{money(inv.addie)}</div></div>
        </div>
      )}

      <div className="text-center">
        <Btn size="lg" color={win ? 'green' : 'orange'} disabled={busy} onClick={() => onFinish(a)}>{win ? 'Collect my XP! ⭐' : 'Learn from it and try again'}</Btn>
      </div>
    </div>
  );
}

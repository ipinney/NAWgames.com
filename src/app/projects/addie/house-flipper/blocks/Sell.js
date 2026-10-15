'use client';

import { useState } from 'react';
import { MONEY } from '@/lib/flipper/calibration';
import { buyerOffers } from '@/lib/flipper/town';
import { useGame, Btn, money, sfx } from '../ui';
import { HouseSVG } from '../art';

export default function Sell({ seed, house, arv, finish = 1, fixed = 'all', monthly, marketDip = false, lowball = false, onDone }) {
  const g = useGame();
  const marketMult = marketDip ? 0.95 : 1;
  const [dipSeen, setDipSeen] = useState(!marketDip);
  const [list, setList] = useState(Math.round(arv / 1000) * 1000);
  const [listed, setListed] = useState(null); // price it was listed at
  const [offers, setOffers] = useState([]);
  const [week, setWeek] = useState(0);
  const [holding, setHolding] = useState(0);
  const [msg, setMsg] = useState('');
  const [dropCount, setDropCount] = useState(0);
  const fair = Math.round(house.arv * marketMult * (0.9 + 0.1 * finish) / 1000) * 1000;
  const weekly = Math.round(monthly / 4);

  function listIt(price) {
    sfx.cash();
    setListed(price);
    setOffers(buyerOffers(`${seed}:${dropCount}`, house, price, { finish, marketMult, lowball }).map((o) => ({ ...o, week: o.week + week })));
    setMsg(`Listed at ${money(price)}! Buyers are coming to look...`);
  }
  function nextWeek() {
    sfx.whoosh();
    const w = week + 1;
    setWeek(w); setHolding((h) => h + weekly);
    const arrived = offers.filter((o) => o.week === w);
    if (arrived.length) { sfx.coin(); setMsg(`${arrived.length === 1 ? 'An offer' : `${arrived.length} offers`} came in!`); }
    else if (!offers.some((o) => o.week >= w)) setMsg(w - (listed ? 0 : 0) >= 3 ? 'No offers... is your price too high?' : 'Buyers are looking. No offers yet.');
    else setMsg('Buyers are looking...');
  }
  function accept(o) {
    sfx.fanfare(); g.fire(50, 40, 70);
    setTimeout(() => onDone?.({ salePrice: o.amount, weeks: week, sellHolding: holding, sellCosts: Math.round(o.amount * MONEY.sellCostPct), buyer: o.buyer }), 1200);
  }
  function counter(o) {
    const ask = Math.round(((o.amount + listed) / 2) / 1000) * 1000;
    if (ask <= fair * 0.99) {
      sfx.good(); setOffers((s) => s.map((x) => x.id === o.id ? { ...x, amount: ask, countered: true } : x));
      setMsg(`${o.buyer} said yes to ${money(ask)}!`);
    } else {
      sfx.bad(); setOffers((s) => s.filter((x) => x.id !== o.id));
      setMsg(`${o.buyer} said that is too much and walked away.`);
    }
  }
  function lower() {
    const p = Math.round(listed * 0.96 / 1000) * 1000;
    setDropCount((d) => d + 1); setList(p);
    setOffers([]); setListed(null);
    setMsg(`Price lowered to ${money(p)}.`);
    setTimeout(() => listIt(p), 0);
  }

  const visible = offers.filter((o) => o.week <= week);

  if (!dipSeen) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-white p-6 text-slate-800 text-center hf-pop">
        <div className="text-6xl">📉</div>
        <div className="text-xs font-black text-rose-500">MARKET NEWS</div>
        <div className="text-2xl font-black">Home prices in Fox Hollow dipped 5%</div>
        <p className="font-semibold text-slate-600 mt-2">Interest rates went up, so buyers can pay a little less. This happens in real life too. Your house might sell for less than you planned.</p>
        <div className="mt-4"><Btn color="orange" onClick={() => { setDipSeen(true); g.flip.event('The Fox Hollow market just dipped 5% right before Addie sells her practice flip 3. Explain in 2 sentences what that means and that buying under the 70% rule protects her.'); }}>Okay, let&apos;s sell</Btn></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-5">
      <div className="rounded-3xl bg-white p-4 text-slate-800 text-center relative">
        <HouseSVG house={house} fixed={fixed} width={320} className="mx-auto" />
        {listed && <div className="absolute top-6 right-6 rotate-6 rounded-lg bg-rose-500 px-3 py-1 font-black text-white shadow-lg">FOR SALE {money(listed)}</div>}
        <div className="font-black text-xl">{house.address}</div>
        <div className="font-bold text-slate-500">Your ARV guess: {money(arv)}</div>
        {finish < 1 && <div className="text-sm font-bold text-amber-600">Some rooms were not fixed, so buyers will pay a bit less.</div>}
      </div>
      <div className="space-y-3">
        {!listed ? (
          <div className="rounded-3xl bg-white p-5 text-slate-800">
            <div className="text-2xl font-black">Pick your list price</div>
            <p className="font-semibold text-slate-600">Too high and nobody makes an offer. Too low and you leave money behind.</p>
            <div className="text-4xl font-black text-emerald-600 mt-3">{money(list)}</div>
            <input id="hf-list" type="range" min={Math.round(arv * 0.85 / 1000) * 1000} max={Math.round(arv * 1.2 / 1000) * 1000} step="1000" value={list} onChange={(e) => setList(Number(e.target.value))} className="w-full accent-emerald-500" />
            <div className="mt-3"><Btn size="lg" color="green" onClick={() => listIt(list)}>Put up the For Sale sign 🪧</Btn></div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-5 text-slate-800">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-black">Week {week}</div>
              <div className="text-sm font-bold text-slate-500">Bills while waiting: {money(holding)} ({money(weekly)}/week)</div>
            </div>
            <div className="mt-2 font-bold text-sky-700">{msg}</div>
            <div className="mt-3 space-y-2">
              {visible.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-emerald-50 p-3 hf-drop">
                  <div className="flex-1"><div className="font-black">{o.buyer}</div><div className="text-2xl font-black text-emerald-600">{money(o.amount)}</div></div>
                  <Btn color="green" size="sm" onClick={() => accept(o)}>Accept</Btn>
                  {!o.countered && <Btn color="orange" size="sm" onClick={() => counter(o)}>Ask for {money(Math.round(((o.amount + listed) / 2) / 1000) * 1000)}</Btn>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn color="blue" onClick={nextWeek}>Wait a week ▶</Btn>
              {week >= 2 && <Btn color="gray" onClick={lower}>Lower price 4%</Btn>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

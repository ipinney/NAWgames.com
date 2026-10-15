'use client';

import { useState } from 'react';
import { MONEY, maxOffer } from '@/lib/flipper/calibration';
import { sellerResponse } from '@/lib/flipper/town';
import { Btn, money, sfx, CountUp } from '../ui';
import { HouseSVG } from '../art';

// 70% rule, then negotiate. tough = seller is harder (fewer rounds).
export default function Deal({ house, arv, fix, tough = false, onDone, allowWalk = true }) {
  const [step, setStep] = useState(0);         // 0..3 rule steps, 4 = negotiate
  const [offer, setOffer] = useState(0);
  const [log, setLog] = useState([]);
  const [round, setRound] = useState(1);
  const [counter, setCounter] = useState(null);
  const [mood, setMood] = useState('🙂');
  const seventy = Math.round(arv * MONEY.rule / 1000) * 1000;
  const max = maxOffer({ arv, fix });
  const maxRounds = tough ? 3 : 4;
  const h = tough ? { ...house, sellerMin: Math.round(house.sellerMin * 1.02 / 1000) * 1000 } : house;

  const steps = [
    { label: 'Your ARV (what it sells for fixed up)', value: arv },
    { label: 'Times 70%', value: seventy },
    { label: 'Minus your fix budget', value: -fix },
    { label: 'Your MAX OFFER', value: max },
  ];

  function makeOffer() {
    const amt = Math.round(offer / 1000) * 1000;
    if (!amt) return;
    const res = sellerResponse(h, amt, round);
    const entry = { you: amt, ...res };
    setLog((l) => [...l, entry]);
    if (res.accept) {
      sfx.cash(); setMood('😄');
      setTimeout(() => onDone?.({ price: res.amount, maxOffer: max, rounds: round, overMax: res.amount > max }), 1300);
    } else {
      sfx.surprise(); setMood(amt < h.sellerMin * 0.85 ? '😠' : '🤔');
      setCounter(res.counter); setRound((r) => r + 1);
    }
  }
  function acceptCounter() {
    sfx.cash(); setMood('😄');
    setLog((l) => [...l, { you: counter, accept: true, amount: counter, say: `You took ${house.seller}'s price.` }]);
    setTimeout(() => onDone?.({ price: counter, maxOffer: max, rounds: round, overMax: counter > max }), 1100);
  }

  if (step < 4) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-white p-6 text-slate-800">
        <div className="text-2xl font-black mb-1">🧮 The 70% Rule</div>
        <p className="font-semibold text-slate-600 mb-4">Pros never pay more than this. It leaves room for costs and profit. Tap to work it out.</p>
        <div className="space-y-2">
          {steps.slice(0, step + 1).map((s, i) => (
            <div key={i} className={`flex justify-between items-center rounded-2xl px-4 py-3 hf-pop ${i === 3 ? 'bg-emerald-100' : 'bg-slate-50'}`}>
              <span className="font-bold">{s.label}</span>
              <CountUp value={s.value} format={(v) => (v < 0 ? '- ' + money(-v) : money(v))} className={`text-2xl font-black ${i === 3 ? 'text-emerald-600' : ''}`} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          {step < 3 ? <Btn color="orange" onClick={() => { sfx.pop(); setStep(step + 1); }}>Next ▶</Btn>
            : <Btn color="green" onClick={() => { sfx.good(); setOffer(Math.round(max * 0.92 / 1000) * 1000); setStep(4); }}>Go meet {house.seller} ▶</Btn>}
        </div>
      </div>
    );
  }

  const done = log.some((l) => l.accept);
  const sliderMax = Math.round(house.price * 1.05 / 1000) * 1000;
  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
      <div className="rounded-3xl bg-white p-4 text-slate-800 text-center">
        <HouseSVG house={house} width={260} className="mx-auto" />
        <div className="font-black text-xl">{house.address}</div>
        <div className="font-bold text-slate-500">Asking price: <span className="text-slate-800">{money(house.price)}</span></div>
        <div className="font-bold text-emerald-600">Your max offer: {money(max)}</div>
        {house.price <= max && <div className="text-sm font-bold text-sky-600 mt-1">The asking price is already under your max. You could still try for less!</div>}
      </div>
      <div className="rounded-3xl bg-white p-5 text-slate-800">
        <div className="flex items-center gap-3">
          <div className="text-6xl">{mood}</div>
          <div>
            <div className="font-black text-xl">{house.seller}</div>
            <div className="text-sm font-bold text-slate-500">The seller · Round {Math.min(round, maxRounds)} of {maxRounds}</div>
          </div>
        </div>
        <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
          {log.map((l, i) => (
            <div key={i} className="text-sm font-bold">
              <div className="text-sky-700">You offered {money(l.you)}</div>
              <div className="text-slate-700 pl-3">{l.say}</div>
            </div>
          ))}
        </div>
        {!done && round <= maxRounds && (
          <div className="mt-4">
            <div className="flex justify-between font-black"><span>Your offer</span><span className={`text-2xl ${offer > max ? 'text-rose-600' : 'text-emerald-600'}`}>{money(offer)}</span></div>
            <input id="hf-offer" type="range" min={Math.round(house.price * 0.5 / 1000) * 1000} max={sliderMax} step="1000" value={offer} onChange={(e) => setOffer(Number(e.target.value))} className="w-full accent-amber-400" />
            {offer > max && <div className="text-sm font-bold text-rose-600">That is over your max offer!</div>}
            <div className="mt-2 flex flex-wrap gap-2">
              <Btn color="orange" onClick={makeOffer}>Make offer</Btn>
              {counter && <Btn color={counter > max ? 'red' : 'green'} onClick={acceptCounter}>Take {money(counter)}</Btn>}
            </div>
          </div>
        )}
        {!done && round > maxRounds && (
          <div className="mt-4">
            <p className="font-bold text-slate-700">{house.seller} is tired of haggling. Last price: {money(counter)}.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Btn color={counter > max ? 'red' : 'green'} onClick={acceptCounter}>Take {money(counter)}</Btn>
              {allowWalk && <Btn color="gray" onClick={() => onDone?.({ walked: true })}>Walk away</Btn>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

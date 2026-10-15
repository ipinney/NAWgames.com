'use client';

import { useState } from 'react';
import { Btn, money, sfx } from '../ui';

// Investors (Mom and Dad) put in money, get it back first, then a share of the profit.
export function splitOutcome(profit, invest, sharePct) {
  if (profit >= 0) {
    const inv = Math.round(profit * sharePct / 100);
    return { investors: inv, addie: profit - inv, investorsBack: invest };
  }
  // A loss is shared the same way, but investors can never lose more than they put in.
  const invLoss = Math.max(-invest, Math.round(profit * sharePct / 100));
  return { investors: invLoss, addie: profit - invLoss, investorsBack: invest + invLoss };
}

export default function Split({ gap, plannedProfit, onDone }) {
  const [ask, setAsk] = useState(Math.max(10000, Math.ceil(gap / 5000) * 5000));
  const [share, setShare] = useState(50);
  const [reply, setReply] = useState(null);
  const scenarios = [
    { label: 'Great flip', emoji: '🎉', profit: plannedProfit },
    { label: 'Okay flip', emoji: '🙂', profit: Math.round(plannedProfit * 0.35 / 1000) * 1000 },
    { label: 'Bad flip', emoji: '😬', profit: -Math.round(Math.max(10000, plannedProfit * 0.4) / 1000) * 1000 },
  ];

  function propose() {
    let r;
    if (ask < gap) r = { ok: false, face: '🤨', say: `You need ${money(gap)}, but you only asked for ${money(ask)}. Ask for enough to finish the job!` };
    else if (share < 25) r = { ok: false, face: '😕', say: `Only ${share}% for putting in ${money(ask)}? That is not enough for the risk. Try giving us more.` };
    else if (share > 70) r = { ok: true, face: '😁', say: `Deal! But you gave away ${share}% of the profit. Next time you could keep more for yourself.` };
    else r = { ok: true, face: '🥰', say: `That sounds fair! We put in ${money(ask)} and get ${share}% of the profit. Let's do it!` };
    setReply(r); r.ok ? sfx.fanfare() : sfx.bad();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
      <div className="rounded-3xl bg-white p-5 text-slate-800">
        <div className="flex gap-3 text-5xl">👩‍💼👨‍💼</div>
        <div className="text-2xl font-black mt-1">Investors: Mom and Dad</div>
        <p className="font-semibold text-slate-600">You are {money(gap)} short. Investors put money in, get it back when the house sells, and keep a share of the profit.</p>
        <div className="mt-4">
          <div className="flex justify-between font-black"><span>Ask them for</span><span className="text-2xl text-sky-600">{money(ask)}</span></div>
          <input id="hf-ask" type="range" min="5000" max={Math.max(20000, Math.ceil(gap * 2 / 5000) * 5000)} step="5000" value={ask} onChange={(e) => { setAsk(Number(e.target.value)); setReply(null); }} className="w-full accent-sky-500" />
        </div>
        <div className="mt-3">
          <div className="flex justify-between font-black"><span>Their share of the profit</span><span className="text-2xl text-pink-600">{share}%</span></div>
          <input id="hf-share" type="range" min="10" max="90" step="5" value={share} onChange={(e) => { setShare(Number(e.target.value)); setReply(null); }} className="w-full accent-pink-500" />
          <div className="text-xs font-bold text-slate-500">You keep {100 - share}% for finding the deal and doing the work.</div>
        </div>
        {!reply?.ok && <div className="mt-4"><Btn size="lg" color="pink" onClick={propose}>Make my proposal</Btn></div>}
        {reply && (
          <div className={`mt-4 rounded-2xl p-3 hf-pop ${reply.ok ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            <div className="flex gap-2 items-start"><span className="text-4xl">{reply.face}</span><p className="font-black text-slate-800">{reply.say}</p></div>
            {reply.ok && <div className="mt-3"><Btn color="green" onClick={() => onDone?.({ invest: ask, sharePct: share })}>Shake hands 🤝</Btn></div>}
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="font-black text-white">What everyone gets</div>
        {scenarios.map((s) => {
          const o = splitOutcome(s.profit, ask, share);
          return (
            <div key={s.label} className="rounded-3xl bg-white p-4 text-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-black text-lg">{s.emoji} {s.label}</span>
                <span className={`font-black text-lg ${s.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>Profit {money(s.profit)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-center">
                <div className="rounded-2xl bg-pink-50 p-2">
                  <div className="text-xs font-black text-pink-700">MOM AND DAD</div>
                  <div className={`text-xl font-black ${o.investors >= 0 ? 'text-pink-700' : 'text-rose-600'}`}>{o.investors >= 0 ? '+' : ''}{money(o.investors)}</div>
                  <div className="text-[11px] font-bold text-slate-500">get back {money(o.investorsBack)} of {money(ask)}</div>
                </div>
                <div className="rounded-2xl bg-amber-50 p-2">
                  <div className="text-xs font-black text-amber-700">ADDIE</div>
                  <div className={`text-xl font-black ${o.addie >= 0 ? 'text-amber-700' : 'text-rose-600'}`}>{o.addie >= 0 ? '+' : ''}{money(o.addie)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

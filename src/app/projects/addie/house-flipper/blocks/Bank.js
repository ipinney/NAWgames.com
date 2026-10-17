'use client';

import { useMemo, useState } from 'react';
import { MONEY, maxLoan, monthlyHolding } from '@/lib/flipper/calibration';
import { Btn, money, sfx, CountUp } from '../ui';

// Town Bank. cash = Addie's own money (plus investor money already raised).
export function financeNumbers({ price, fix, arv, loan, months = 4 }) {
  const closing = Math.round(price * MONEY.buyClosingPct);
  const project = price + closing + fix;
  const points = Math.round(loan * MONEY.bank.points);
  const cashNeeded = project - loan + points;
  const monthly = monthlyHolding({ price, loan });
  return { closing, project, points, cashNeeded, monthly, holdingPlan: monthly.total * months };
}

export default function Bank({ price, fix, arv, cash, required = false, months = 4, quiz = false, onDone }) {
  const max = maxLoan({ price, fix, arv });
  const [loan, setLoan] = useState(required ? Math.round(max * 0.9 / 1000) * 1000 : 0);
  const [stamp, setStamp] = useState(false);
  const [answer, setAnswer] = useState(null);
  const n = financeNumbers({ price, fix, arv, loan, months });
  const reserve = n.monthly.total * months;
  const short = n.cashNeeded + reserve - cash;
  const extra2 = n.monthly.total * 2;

  const choices = useMemo(() => {
    const right = n.cashNeeded;
    const opts = [right, right + loan, Math.max(1000, right - n.points - n.closing)];
    return [...new Set(opts.map((x) => Math.round(x / 100) * 100))].sort((a, b) => a - b);
  }, [n.cashNeeded, loan, n.points, n.closing]);

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
      <div className="rounded-3xl bg-white p-5 text-slate-800">
        <div className="flex items-center gap-3">
          <div className="text-5xl">🏦</div>
          <div>
            <div className="text-2xl font-black">Town Bank</div>
            <div className="text-sm font-bold text-slate-500">{Math.round(MONEY.bank.rate * 100)}% interest per year · {Math.round(MONEY.bank.points * 100)} points up front · lends up to 80% of cost and 70% of ARV</div>
          </div>
        </div>
        <div className="mt-4 space-y-1.5 font-bold">
          <Row k="House price" v={price} />
          <Row k="Closing costs to buy (1.5%)" v={n.closing} />
          <Row k="Fix budget" v={fix} />
          <Row k="Whole project" v={n.project} big />
        </div>
        <div className="mt-4">
          <div className="flex justify-between font-black"><span>Loan from Town Bank</span><CountUp value={loan} format={money} className="text-2xl text-sky-600" /></div>
          <input id="hf-loan" type="range" min="0" max={max} step="100" value={loan} onChange={(e) => { setLoan(Number(e.target.value)); setStamp(false); }} className="w-full accent-sky-500" />
          <div className="text-xs font-bold text-slate-400">The most the bank will lend on this deal: {money(max)}</div>
        </div>
        <div className="mt-3 rounded-2xl bg-sky-50 p-3 font-bold space-y-1">
          <Row k="Points (2% of the loan, paid now)" v={n.points} />
          <Row k="Your down payment + costs" v={n.cashNeeded} big />
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-3xl bg-white p-5 text-slate-800">
          <div className="font-black text-lg">Every month you own it</div>
          <div className="mt-2 space-y-1 font-bold text-slate-700">
            <Row k="💸 Loan interest" v={n.monthly.interest} />
            <Row k="🏛️ Property tax" v={n.monthly.tax} />
            <Row k="☂️ Insurance" v={n.monthly.insurance} />
            <Row k="💡 Lights and water" v={n.monthly.utilities} />
            <Row k="Each month" v={n.monthly.total} big />
          </div>
          <div className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 font-black text-rose-700">⏰ If it takes 2 extra months: {money(extra2)} more</div>
        </div>
        <div className="rounded-3xl bg-slate-900/60 p-4 text-white font-bold">
          <div className="flex justify-between"><span>Your money</span><span className="font-black">{money(cash)}</span></div>
          <div className="flex justify-between"><span>Down payment + costs</span><span className="font-black">{money(n.cashNeeded)}</span></div>
          <div className="flex justify-between"><span>{months} months of bills to save</span><span className="font-black">{money(reserve)}</span></div>
          {short > 0 ? <div className="mt-2 text-rose-300 font-black">You are {money(short)} short. {required ? 'Borrow more, or find investors.' : 'Try borrowing more.'}</div>
            : <div className="mt-2 text-emerald-300 font-black">You have enough money! 🎉</div>}
        </div>

        {quiz && answer === null && (
          <div className="rounded-3xl bg-amber-100 p-4 text-amber-950">
            <div className="font-black">Quick check: how much of YOUR money goes in when you buy?</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {choices.map((c) => <Btn key={c} color="gray" size="sm" onClick={() => { const ok = c === Math.round(n.cashNeeded / 100) * 100; setAnswer(ok); ok ? sfx.good() : sfx.bad(); }}>{money(c)}</Btn>)}
            </div>
          </div>
        )}
        {quiz && answer !== null && (
          <div className={`rounded-3xl p-4 font-black ${answer ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {answer ? 'Yes! Project cost, minus the loan, plus the points.' : `Not quite. It is the project cost minus the loan, plus points: ${money(n.cashNeeded)}.`}
          </div>
        )}

        {!stamp ? (
          <Btn size="lg" color="blue" disabled={(required && loan === 0) || short > 0 || (quiz && answer === null)} onClick={() => { sfx.hammer(); setTimeout(() => sfx.fanfare(), 150); setStamp(true); }}>Ask Town Bank ▶</Btn>
        ) : (
          <div className="flex items-center gap-4">
            <div className="hf-pop rotate-[-8deg] rounded-xl border-4 border-emerald-500 px-4 py-2 text-2xl font-black text-emerald-500 bg-white">APPROVED</div>
            <Btn size="lg" color="green" onClick={() => onDone?.({ loan, ...n, reserve })}>Next ▶</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ k, v, big }) {
  return (
    <div className={`flex justify-between ${big ? 'text-lg font-black border-t border-slate-200 pt-1.5' : ''}`}>
      <span>{k}</span><span>{money(v)}</span>
    </div>
  );
}

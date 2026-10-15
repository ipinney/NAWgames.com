'use client';

import { useEffect, useState } from 'react';
import { PRACTICE } from '@/lib/flipper/levels';
import { surpriseDeck } from '@/lib/flipper/town';
import { ROOMS, maxLoan } from '@/lib/flipper/calibration';
import { useGame, api, Btn, money, sfx } from './ui';
import { FoxSVG, HouseSVG } from './art';
import Hunt from './blocks/Hunt';
import Inspect from './blocks/Inspect';
import Comps from './blocks/Comps';
import Deal from './blocks/Deal';
import Bank, { financeNumbers } from './blocks/Bank';
import Split from './blocks/Split';
import Pitch from './blocks/Pitch';
import Renovate from './blocks/Renovate';
import Sell from './blocks/Sell';
import Report, { plannedProfit } from './blocks/Report';

const START_CASH = { 1: 150000, 2: 60000, 3: 40000 };
const STEPS = [
  ['find', 'Find'], ['inspect', 'Inspect'], ['price', 'Price'], ['offer', 'Offer'], ['fund', 'Fund'],
  ['pitch', 'Pitch'], ['renovate', 'Fix'], ['sell', 'Sell'], ['report', 'Report'],
];

export default function PracticeFlip() {
  const g = useGame();
  const doc = g.flipDoc;
  const cfg = PRACTICE.find((p) => p.n === doc?.practice) || PRACTICE[0];
  const [step, setStep] = useState(doc?.step || 'find');
  const [d, setD] = useState(doc?.data || {});
  const [busy, setBusy] = useState(false);
  const [grad, setGrad] = useState(false);
  const cash = START_CASH[cfg.n];
  const steps = STEPS.filter(([k]) => k !== 'pitch' || cfg.n > 1);

  useEffect(() => {
    g.setContext({ screen: `${cfg.title}`, practice: cfg.n, step, house: d.house ? { seed: d.house.seed, hood: d.house.hood, address: d.house.address } : undefined,
      numbers: { price: d.price, fix_budget: d.budget?.total, arv: d.arv, max_offer: d.maxOffer, loan: d.finance?.loan, planned_profit: d.planned } });
  }, [step, d]); // eslint-disable-line

  useEffect(() => {
    if (step === 'find' && !d.house) g.flip.event(`Addie is starting ${cfg.title}: ${cfg.blurb} She has ${money(cash)} saved. In 2 short sentences, remind her what to look for in a house to flip.`);
  }, []); // eslint-disable-line

  if (!doc) {
    return <div className="text-center text-white font-black pt-20">No flip in progress. <button className="underline" onClick={() => g.go('home')}>Back to Academy</button></div>;
  }

  function advance(nextStep, patch) {
    const nd = { ...d, ...patch };
    setD(nd); setStep(nextStep);
    api('/api/flipper/state', { action: 'flip_save', flipId: g.profile.currentFlipId, step: nextStep, data: nd }).catch(() => {});
  }

  async function finish(actual) {
    setBusy(true);
    try {
      const r = await g.save('flip_finish', { flipId: g.profile.currentFlipId,
        result: { profit: actual.profit, plannedProfit: d.planned, months: actual.months, address: d.house.address, hood: d.house.hoodName, sale: actual.sale, price: d.price } });
      if (r.graduated) { setGrad(true); g.flip.event('Addie just won her 3rd practice flip and GRADUATED from Flip Academy with her Flipper License! Celebrate big in 3 short sentences and tell her Real Deals with real Houston houses and Mom and Dad comes next.'); }
      else g.go('home');
    } catch (e) { setBusy(false); }
  }

  if (grad) return <Diploma onHome={() => g.go('home')} />;

  const months = d.house ? 3 + Math.ceil(ROOMS.filter((r) => d.house.rooms[r.key] !== 'good').length / 3) : 4;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-5">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button onClick={() => g.go('home')} className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-black text-white hover:bg-white/25">‹ Academy</button>
        <div className="text-white font-black text-lg">🏠 {cfg.title}</div>
        <div className="ml-auto text-sm font-black text-amber-200">Savings: {money(cash)}</div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {steps.map(([k, label], i) => {
          const idx = steps.findIndex(([x]) => x === step);
          return <div key={k} className={`rounded-full px-3 py-1 text-xs font-black ${i < idx ? 'bg-emerald-400 text-emerald-950' : i === idx ? 'bg-amber-300 text-amber-950' : 'bg-white/10 text-white/50'}`}>{i + 1}. {label}</div>;
        })}
      </div>

      {step === 'find' && (
        <Hunt seed={`${doc.seed}:find`} hoods={[cfg.hood]} mode="pick" context={{ screen: cfg.title, practice: cfg.n, step: 'find' }}
          onDone={({ house }) => advance('inspect', { house })} />
      )}
      {step === 'inspect' && (
        <Inspect house={d.house} grade={false} onDone={(budget) => advance('price', { budget })} />
      )}
      {step === 'price' && (
        <Comps house={d.house} onDone={({ arv, comps, traps }) => advance('offer', { arv, compsCount: comps.length, traps })} />
      )}
      {step === 'offer' && (
        <Deal house={d.house} arv={d.arv} fix={d.budget.total} tough={!!cfg.toughSeller}
          onDone={(r) => {
            if (r.walked) { sfx.whoosh(); advance('find', { house: null, budget: null, arv: null }); return; }
            advance('fund', { price: r.price, maxOffer: r.maxOffer });
          }} />
      )}
      {step === 'fund' && <FundStep cfg={cfg} d={d} cash={cash} months={months} onDone={(finance, invest) => {
        const planned = plannedProfit({ arv: d.arv, price: d.price, budget: d.budget, finance, months });
        advance(cfg.n > 1 ? 'pitch' : 'renovate', { finance, invest: invest || null, planned, months });
      }} />}
      {step === 'pitch' && (
        <Pitch audience={cfg.n === 3 ? 'Mom and Dad' : 'Town Bank'} slides={cfg.n === 3 ? 6 : 3} deal={d}
          onDone={() => advance('renovate', { pitched: true })} />
      )}
      {step === 'renovate' && (
        <Renovate house={d.house} budget={d.budget} monthly={d.finance.monthly.total} months={d.months}
          surprises={surpriseDeck(doc.seed, cfg.surprises, d.budget.subtotal)}
          onDone={(reno) => advance('sell', { reno })} />
      )}
      {step === 'sell' && (
        <Sell seed={doc.seed} house={d.house} arv={d.arv} finish={d.reno.finish} fixed={d.reno.fixed} monthly={d.finance.monthly.total}
          marketDip={!!cfg.marketDip} lowball={!!cfg.lowball} onDone={(sale) => advance('report', { sale })} />
      )}
      {step === 'report' && <Report d={{ ...d, practice: cfg.n }} busy={busy} onFinish={finish} />}
    </div>
  );
}

function FundStep({ cfg, d, cash, months, onDone }) {
  const [invest, setInvest] = useState(null);
  const max = maxLoan({ price: d.price, fix: d.budget.total, arv: d.arv });
  const atMax = financeNumbers({ price: d.price, fix: d.budget.total, arv: d.arv, loan: max, months });
  const gap = Math.max(0, atMax.cashNeeded + atMax.monthly.total * months - cash);
  const needInvestors = cfg.investors && !invest;

  if (needInvestors) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-amber-200 px-4 py-3 font-bold text-amber-950">📋 This flip is big. Even with the biggest bank loan you are {money(Math.max(gap, 20000))} short. Time to bring in investors!</div>
        <Split gap={Math.max(gap, 20000)} plannedProfit={Math.max(20000, plannedProfit({ arv: d.arv, price: d.price, budget: d.budget, finance: atMax, months }))}
          onDone={(r) => setInvest(r)} />
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-amber-200 px-4 py-3 font-bold text-amber-950">
        📋 You bought {d.house.address} for {money(d.price)}. Fix budget {money(d.budget.total)}.
        {cfg.loan === 'optional' ? ' You have enough savings to pay cash, or you can borrow. Borrowing costs interest!' : ' You need a loan from Town Bank.'}
        {invest ? ` Mom and Dad put in ${money(invest.invest)}.` : ''}
      </div>
      <Bank price={d.price} fix={d.budget.total} arv={d.arv} cash={cash + (invest?.invest || 0)} required={cfg.loan === 'required'} months={months}
        onDone={(fin) => onDone(fin, invest)} />
    </div>
  );
}

function Diploma({ onHome }) {
  const g = useGame();
  useEffect(() => {
    sfx.fanfare();
    const t = [0, 400, 800, 1200].map((ms, i) => setTimeout(() => g.fire([20, 80, 35, 65][i], 30, 80), ms));
    return () => t.forEach(clearTimeout);
  }, []); // eslint-disable-line
  return (
    <div className="max-w-3xl mx-auto px-4 pt-10">
      <div className="rounded-[2rem] border-[10px] border-amber-400 bg-amber-50 p-10 text-center text-slate-800 shadow-2xl hf-pop">
        <FoxSVG size={120} mood="wow" className="mx-auto hf-bob" />
        <div className="text-sm font-black tracking-[0.3em] text-amber-700">FLIP ACADEMY · FOX HOLLOW</div>
        <h1 className="text-5xl font-black mt-2">Flipper License</h1>
        <p className="text-xl font-bold mt-3">This certifies that</p>
        <p className="text-5xl font-black text-pink-600 mt-1">Addie Pinney</p>
        <p className="text-lg font-bold mt-3 max-w-lg mx-auto">has learned how to find, fix, price, fund, pitch and sell a house, and completed three profitable practice flips.</p>
        <div className="mt-4 flex justify-center gap-6 text-sm font-black text-slate-500">
          <span>Signed: Flip the Fox 🦊</span><span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-300 to-sky-300 p-4 font-black">🎓 Real Deals unlocked: real Houston houses with Mom and Dad!</div>
        <div className="mt-6"><Btn size="lg" color="green" onClick={onHome}>Back to the Academy</Btn></div>
      </div>
    </div>
  );
}

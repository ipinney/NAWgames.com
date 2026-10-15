'use client';

import { useEffect, useMemo, useState } from 'react';
import { LEVELS, XP } from '@/lib/flipper/levels';
import { makeHouse, rng } from '@/lib/flipper/town';
import { MONEY, maxLoan } from '@/lib/flipper/calibration';
import { useGame, Btn, money, sfx } from './ui';
import { FoxSVG } from './art';
import Level1 from './levels/Level1';
import Hunt from './blocks/Hunt';
import Inspect from './blocks/Inspect';
import Comps from './blocks/Comps';
import Deal from './blocks/Deal';
import Bank, { financeNumbers } from './blocks/Bank';
import Split from './blocks/Split';
import Pitch from './blocks/Pitch';

export default function LevelScreen({ n }) {
  const g = useGame();
  const lvl = LEVELS.find((l) => l.n === n);
  const seed = g.profile.townSeed || 'fox';
  const [phase, setPhase] = useState('intro');
  const [result, setResult] = useState(null);

  const houses = useMemo(() => ({
    l3: makeHouse(`${seed}:L3`, 'bluebonnet', { condition: 'C' }),
    l4: makeHouse(`${seed}:L4`, 'oakrow', { condition: 'B' }),
    l5: makeHouse(`${seed}:L5`, 'bluebonnet', { condition: 'C', motivated: true }),
  }), [seed]);
  const l5 = houses.l5;
  const l5fix = Math.round(l5.fixTotal * 1.12 / 100) * 100;
  const l5price = l5.sellerMin;
  const l5fin = financeNumbers({ price: l5price, fix: l5fix, arv: l5.arv, loan: maxLoan({ price: l5price, fix: l5fix, arv: l5.arv }), months: 4 });

  useEffect(() => {
    const house = n === 3 ? houses.l3 : n === 4 ? houses.l4 : n >= 5 ? l5 : null;
    g.setContext({ screen: `Level ${n}: ${lvl.title}`, level: n, step: phase, house: house ? { seed: house.seed, hood: house.hood, address: house.address } : undefined });
  }, [phase]); // eslint-disable-line

  function startTask() {
    sfx.whoosh(); setPhase('task');
    g.flip.event(`Addie is starting Level ${n} "${lvl.title}" (${lvl.skill}). Goal: ${lvl.goal} In 2 short sentences, get her excited and tell her the first thing to do on screen.`);
  }
  function taskDone(r) { sfx.fanfare(); g.fire(50, 30, 50); setResult(r); setPhase('quiz'); }

  if (phase === 'intro') {
    return (
      <Frame lvl={lvl} onHome={() => g.go('home')}>
        <div className="max-w-2xl mx-auto rounded-[2rem] bg-white p-8 text-center text-slate-800 hf-pop">
          <div className="text-7xl">{lvl.emoji}</div>
          <div className="text-sm font-black text-slate-400 mt-2">LEVEL {n}</div>
          <h1 className="text-4xl font-black">{lvl.title}</h1>
          <p className="text-xl font-bold text-slate-600 mt-2">{lvl.goal}</p>
          <div className="mt-2 text-sm font-black text-amber-600">Badge: 🏅 {lvl.badge}</div>
          <div className="mt-6"><Btn size="lg" color="green" onClick={startTask}>Let&apos;s go! ▶</Btn></div>
        </div>
      </Frame>
    );
  }

  if (phase === 'quiz') return <Frame lvl={lvl} onHome={() => g.go('home')}><Quiz lvl={lvl} seed={seed} onDone={async (score) => {
    setPhase('saving');
    try { const d = await g.completeLevel(n, score); setResult((r) => ({ ...r, score, gained: d.gained })); }
    catch { setResult((r) => ({ ...r, score, gained: 0 })); }
    setPhase('finish');
  }} /></Frame>;

  if (phase === 'saving') return <Frame lvl={lvl}><div className="text-center text-white font-black">Saving...</div></Frame>;

  if (phase === 'finish') {
    const next = LEVELS.find((l) => l.n === n + 1);
    return (
      <Frame lvl={lvl} onHome={() => g.go('home')}>
        <Finish lvl={lvl} score={result?.score || 0} gained={result?.gained || 0}
          onHome={() => g.go('home')} onNext={next ? () => g.go('level', { n: next.n }) : null} />
      </Frame>
    );
  }

  return (
    <Frame lvl={lvl} onHome={() => g.go('home')}>
      {n === 1 && <Level1 onTaskDone={taskDone} />}
      {n === 2 && <Hunt seed={`${seed}:L2`} hoods={['bluebonnet', 'oakrow', 'lantern']} mode="save" need={3} onDone={taskDone} context={{ screen: 'Level 2 House Hunter', level: 2 }} />}
      {n === 3 && <Inspect house={houses.l3} grade onDone={taskDone} />}
      {n === 4 && <Comps house={houses.l4} onDone={taskDone} />}
      {n === 5 && (
        <div className="space-y-3">
          <TeamNote>Your team already looked at <b>{l5.address}</b>: fixes cost about <b>{money(l5.fixTotal)}</b> and fixed up it should sell for about <b>{money(l5.arv)}</b>. Work out your max offer, then buy it!</TeamNote>
          <Deal house={l5} arv={l5.arv} fix={l5.fixTotal} onDone={(r) => r.walked ? null : taskDone(r)} allowWalk={false} />
        </div>
      )}
      {n === 6 && (
        <div className="space-y-3">
          <TeamNote>You bought <b>{l5.address}</b> for <b>{money(l5price)}</b>. Fixes will cost <b>{money(l5fix)}</b>. You have <b>{money(40000)}</b> saved. Borrow from Town Bank to make it work.</TeamNote>
          <Bank price={l5price} fix={l5fix} arv={l5.arv} cash={40000} required quiz months={4} onDone={taskDone} />
        </div>
      )}
      {n === 7 && (
        <div className="space-y-3">
          <TeamNote>A bigger flip in Cypress Bend needs <b>{money(30000)}</b> more than you have. If it goes great, it could make about <b>{money(48000)}</b>. Ask Mom and Dad to invest!</TeamNote>
          <Split gap={30000} plannedProfit={48000} onDone={taskDone} />
        </div>
      )}
      {n === 8 && (
        <div className="space-y-3">
          <TeamNote>Pitch the {l5.address} flip to Mom and Dad. Your numbers are filled in. Say each slide in your own words.</TeamNote>
          <Pitch audience="Mom and Dad" slides={6}
            deal={{ house: l5, price: l5price, arv: l5.arv, months: 4, compsCount: 4,
              budget: { total: l5fix, fund: l5fix - l5.fixTotal, items: [1, 2, 3, 4] },
              finance: { ...l5fin, loan: maxLoan({ price: l5price, fix: l5fix, arv: l5.arv }) },
              invest: { invest: 20000, sharePct: 40 },
              plannedProfit: Math.round(l5.arv * (1 - MONEY.sellCostPct) - l5price - l5fin.closing - l5fix - l5fin.points - l5fin.monthly.total * 5) }}
            onDone={taskDone} />
        </div>
      )}
    </Frame>
  );
}

function TeamNote({ children }) {
  return <div className="rounded-2xl bg-amber-200 px-4 py-3 font-bold text-amber-950">📋 {children}</div>;
}

function Frame({ lvl, children, onHome }) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-5">
      <div className="flex items-center gap-3 mb-4">
        {onHome && <button onClick={onHome} className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-black text-white hover:bg-white/25">‹ Academy</button>}
        <div className="text-white font-black text-lg">{lvl.emoji} Level {lvl.n}: {lvl.title}</div>
      </div>
      {children}
    </div>
  );
}

function Quiz({ lvl, seed, onDone }) {
  const order = useMemo(() => lvl.quiz.map((q, i) => {
    const r = rng(`${seed}:quiz:${lvl.n}:${i}`);
    return q.a.map((a, j) => ({ a, j })).sort(() => r() - 0.5);
  }), [lvl, seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [firstTry, setFirstTry] = useState([]);
  const [tries, setTries] = useState(0);
  const q = lvl.quiz[i];

  function pick(j) {
    if (picked === q.correct) return;
    setPicked(j);
    if (j === q.correct) { sfx.good(); if (tries === 0) setFirstTry((f) => [...f, i]); }
    else { sfx.bad(); setTries((t) => t + 1); }
  }
  function next() {
    sfx.whoosh();
    if (i < lvl.quiz.length - 1) { setI(i + 1); setPicked(null); setTries(0); }
    else onDone(firstTry.length);
  }
  return (
    <div className="max-w-2xl mx-auto rounded-[2rem] bg-white p-7 text-slate-800">
      <div className="flex justify-between text-sm font-black text-slate-400"><span>QUICK CHECK</span><span>{i + 1} / {lvl.quiz.length}</span></div>
      <div className="text-2xl font-black mt-2">{q.q}</div>
      <div className="mt-4 space-y-2">
        {order[i].map(({ a, j }) => (
          <button key={j} onClick={() => pick(j)}
            className={`w-full text-left rounded-2xl px-4 py-3 font-bold text-lg border-4 transition ${picked === j ? (j === q.correct ? 'bg-emerald-100 border-emerald-400' : 'bg-rose-100 border-rose-400 hf-shake') : 'bg-slate-50 border-slate-100 hover:border-amber-300'}`}>
            {a}
          </button>
        ))}
      </div>
      {picked !== null && picked !== q.correct && <p className="mt-3 font-bold text-rose-600">Not quite. Try another one!</p>}
      {picked === q.correct && (
        <div className="mt-4 hf-pop">
          <p className="font-bold text-emerald-700">✅ {q.why}</p>
          <div className="mt-3"><Btn color="green" onClick={next}>{i < lvl.quiz.length - 1 ? 'Next question ▶' : 'Finish level ▶'}</Btn></div>
        </div>
      )}
    </div>
  );
}

function Finish({ lvl, score, gained, onHome, onNext }) {
  const g = useGame();
  useEffect(() => { sfx.fanfare(); g.fire(30, 40, 60); setTimeout(() => g.fire(70, 40, 60), 300); }, []); // eslint-disable-line
  return (
    <div className="max-w-2xl mx-auto rounded-[2rem] bg-gradient-to-br from-amber-200 to-pink-200 p-8 text-center text-slate-800 hf-pop">
      <FoxSVG size={110} mood="wow" className="mx-auto hf-bob" />
      <div className="text-sm font-black text-slate-500">LEVEL {lvl.n} COMPLETE</div>
      <h1 className="text-4xl font-black">{lvl.title}</h1>
      <div className="text-5xl mt-3">{'⭐'.repeat(score)}<span className="opacity-20">{'⭐'.repeat(3 - score)}</span></div>
      <div className="mt-3 inline-block rounded-full bg-amber-400 px-4 py-1.5 font-black text-amber-950">🏅 {lvl.badge}</div>
      {gained > 0 && <div className="mt-2 text-2xl font-black text-emerald-700">+{gained} XP</div>}
      {score < 3 && <p className="mt-2 font-bold text-slate-600">Play again any time to get all 3 stars!</p>}
      <div className="mt-6 flex justify-center gap-3">
        <Btn color="gray" onClick={onHome}>Academy</Btn>
        {onNext ? <Btn color="green" size="lg" onClick={onNext}>Next level ▶</Btn> : <Btn color="green" size="lg" onClick={onHome}>Start practice flips! ▶</Btn>}
      </div>
    </div>
  );
}

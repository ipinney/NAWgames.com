'use client';

import { useState } from 'react';
import { useGame, Btn, money, sfx } from '../ui';
import { HouseSVG } from '../art';

const RISKS = [
  ['Repairs cost more', 'I have a surprise fund'],
  ['It takes longer', 'I planned extra months of bills'],
  ['Prices go down', 'I bought under the 70% rule'],
  ['Hidden problems', 'I inspected every room'],
  ['Buyers offer low', 'I priced it using good comps'],
];

const STARTERS = {
  house: ['This house is a great deal because', 'Neighbors\' fixed-up houses sell for more, so'],
  fix: ['The biggest fix is', 'I will make it look new by'],
  price: ['I checked sold houses nearby and', 'Fixed up, it should sell for about'],
  money: ['The bank lends most of it and', 'Your money will be used for'],
  profit: ['If it goes well, everyone earns', 'Your share would be'],
  risks: ['The biggest risk is', 'If something goes wrong, I will'],
};

export default function Pitch({ deal, audience = 'Mom and Dad', slides: nSlides = 6, onDone }) {
  const g = useGame();
  const { house, budget, arv, price, finance, invest, plannedProfit, months } = deal;
  const [text, setText] = useState({});
  const [risks, setRisks] = useState([]);
  const [present, setPresent] = useState(-1);
  const [verdict, setVerdict] = useState(null);

  const all = [
    { key: 'house', title: 'The House', body: <div className="flex gap-3 items-center"><HouseSVG house={house} width={150} /><div className="font-bold"><div className="text-xl font-black">{house.address}</div><div>{house.hoodName} · {house.sqft.toLocaleString()} sq ft · built {house.built}</div><div>Price: {money(price)}</div></div></div> },
    { key: 'fix', title: 'The Fix Plan', body: <div className="font-bold"><div>Fix budget: <b>{money(budget.total)}</b> (includes {money(budget.fund)} surprise fund)</div><div className="text-sm text-slate-500">{budget.items.length} fixes planned · about {months} months of work</div></div> },
    { key: 'price', title: 'The Sale Price', body: <div className="font-bold"><div>After-repair value: <b>{money(arv)}</b></div><div className="text-sm text-slate-500">From {deal.compsCount || 3} sold houses nearby</div></div> },
    { key: 'money', title: 'The Money', body: <div className="font-bold"><div>Whole project: {money(finance.project)}</div><div>Bank loan: {money(finance.loan)}</div>{invest ? <div>From investors: {money(invest.invest)}</div> : null}</div> },
    { key: 'profit', title: 'The Profit', body: <div className="font-bold"><div>Planned profit: <b className="text-emerald-600">{money(plannedProfit)}</b></div>{invest ? <div>Investors get their {money(invest.invest)} back plus {invest.sharePct}%: {money(Math.round(plannedProfit * invest.sharePct / 100))}</div> : null}</div> },
    { key: 'risks', title: 'Risks and My Plan', body: null },
  ];
  const slides = nSlides >= 6 ? all : [all[0], all[1], all[3]];
  const filled = slides.filter((s) => s.key === 'risks' ? risks.length >= 2 : (text[s.key] || '').trim().length >= 8).length;

  function finish() {
    const good = plannedProfit > 0 && filled === slides.length;
    const deck = slides.map((s) => ({ title: s.title, said: s.key === 'risks' ? risks.map((r) => `${r[0]}: ${r[1]}`).join('; ') : text[s.key] }));
    g.flip.event(`Addie just pitched her flip to ${audience} with ${slides.length} slides. Play ${audience === 'Town Bank' ? 'the Town Bank loan officer' : 'Mom and Dad as investors'} for ONE short reply: react to her words, ask one tough but kind question, and say yes. Her deck: ${JSON.stringify(deck).slice(0, 900)}. Numbers: price ${price}, fix ${budget.total}, ARV ${arv}, planned profit ${plannedProfit}.`);
    setVerdict(good ? 'yes' : 'maybe');
    sfx.fanfare(); g.fire(50, 35, 60);
  }

  if (present >= 0) {
    const s = slides[present];
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[2rem] bg-white p-8 text-slate-800 shadow-2xl hf-pop min-h-[340px]" key={present}>
          <div className="text-xs font-black text-slate-400">SLIDE {present + 1} OF {slides.length} · PITCH TO {audience.toUpperCase()}</div>
          <div className="text-4xl font-black mt-1 mb-4">{s.title}</div>
          {s.body}
          {s.key === 'risks'
            ? <ul className="mt-3 space-y-1 font-bold">{risks.map((r) => <li key={r[0]}>⚠️ {r[0]} → ✅ {r[1]}</li>)}</ul>
            : <p className="mt-4 text-2xl font-bold text-sky-700">&ldquo;{text[s.key]}&rdquo;</p>}
        </div>
        <div className="mt-4 flex justify-between">
          <Btn color="gray" disabled={present === 0} onClick={() => setPresent(present - 1)}>◀ Back</Btn>
          {present < slides.length - 1
            ? <Btn color="orange" onClick={() => { sfx.whoosh(); setPresent(present + 1); }}>Next slide ▶</Btn>
            : !verdict ? <Btn color="green" size="lg" onClick={finish}>Finish my pitch 🎤</Btn>
              : <Btn color="green" size="lg" onClick={() => onDone?.({ deck: slides.map((x) => x.title), verdict })}>{audience} said YES! Next ▶</Btn>}
        </div>
        {verdict && <p className="text-center text-white font-black mt-3">Listen to what Flip says {audience} think! 👉</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {slides.map((s, i) => (
          <div key={s.key} className="rounded-3xl bg-white p-4 text-slate-800">
            <div className="text-xs font-black text-slate-400">SLIDE {i + 1}</div>
            <div className="text-xl font-black mb-2">{s.title}</div>
            {s.body}
            {s.key === 'risks' ? (
              <div className="mt-2 space-y-1.5">
                <div className="text-sm font-black text-slate-600">Pick at least 2 risks and your plan for each:</div>
                {RISKS.map((r) => {
                  const on = risks.some((x) => x[0] === r[0]);
                  return (
                    <button key={r[0]} onClick={() => { sfx.click(); setRisks((rs) => on ? rs.filter((x) => x[0] !== r[0]) : [...rs, r]); }}
                      className={`w-full text-left rounded-xl px-3 py-1.5 text-sm font-bold border-2 ${on ? 'bg-amber-200 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                      ⚠️ {r[0]} → {r[1]}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {STARTERS[s.key].map((st) => <button key={st} onClick={() => setText((t) => ({ ...t, [s.key]: st + ' ' }))} className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700">{st}...</button>)}
                </div>
                <textarea id={`hf-pitch-${s.key}`} value={text[s.key] || ''} onChange={(e) => setText((t) => ({ ...t, [s.key]: e.target.value.slice(0, 200) }))}
                  rows={2} placeholder="Say it in your own words" className="w-full rounded-xl border-2 border-slate-200 p-2 font-semibold focus:border-amber-400 outline-none" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-black text-white">{filled}/{slides.length} slides ready</span>
        <Btn size="lg" color="green" disabled={filled < slides.length} onClick={() => { sfx.fanfare(); setPresent(0); }}>Present to {audience} 🎤</Btn>
      </div>
    </div>
  );
}

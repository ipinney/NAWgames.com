'use client';

import { useMemo, useState } from 'react';
import { NEIGHBORHOODS } from '@/lib/flipper/calibration';
import { listings, rng } from '@/lib/flipper/town';
import { useGame, Btn, Chip, money, sfx } from '../ui';
import { HouseSVG, TownMap } from '../art';

export const REASONS = ['Low price', 'Nice neighbors', 'Easy fixes', 'Seller in a hurry', 'Good size'];

// Map + listings. mode 'save' (save N with reasons) or 'pick' (choose 1 to buy).
export default function Hunt({ seed, hoods = Object.keys(NEIGHBORHOODS), mode = 'save', need = 3, onDone, context = {} }) {
  const g = useGame();
  const [hood, setHood] = useState(hoods[0]);
  const [active, setActive] = useState(null);
  const [saved, setSaved] = useState({}); // id -> {house, reasons}
  const [reveal, setReveal] = useState(false);

  const houses = useMemo(() => listings(seed, hood, 5), [seed, hood]);
  const pins = useMemo(() => {
    const r = rng(`${seed}:${hood}:pins`); const n = NEIGHBORHOODS[hood];
    return houses.map((h, i) => ({ id: h.id, house: h, x: n.x + (r() - 0.5) * 20, y: n.y + 4 + (r() - 0.3) * 12, saved: !!saved[h.id] }));
  }, [houses, saved, seed, hood]);
  const cur = active ? houses.find((h) => h.id === active) : null;
  const streetValue = (() => {
    const n = NEIGHBORHOODS[hood];
    return [Math.round(n.fixedPsf[0] * n.sqft[0] / 1000) * 1000, Math.round(n.fixedPsf[1] * n.sqft[1] / 1000) * 1000];
  })();

  function select(h) {
    sfx.pop(); setActive(h.id);
    g.setContext({ ...context, house: { seed: h.seed, hood: h.hood, address: h.address } });
  }

  function toggleReason(h, reason) {
    setSaved((s) => {
      const cur = s[h.id] || { house: h, reasons: [] };
      const reasons = cur.reasons.includes(reason) ? cur.reasons.filter((x) => x !== reason) : [...cur.reasons, reason];
      return { ...s, [h.id]: { house: h, reasons } };
    });
  }
  function save(h) {
    if (saved[h.id] && saved[h.id].reasons.length) return;
    sfx.coin();
    setSaved((s) => ({ ...s, [h.id]: { house: h, reasons: s[h.id]?.reasons || [] } }));
  }
  function unsave(h) { setSaved((s) => { const n = { ...s }; delete n[h.id]; return n; }); }

  const savedList = Object.values(saved);
  const readyCount = savedList.filter((x) => x.reasons.length > 0).length;

  if (reveal) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-white text-center">Flip peeks at your picks...</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {savedList.map(({ house: h, reasons }, i) => {
            const stars = h.deal > 0 ? 3 : h.deal > -25000 ? 2 : 1;
            return (
              <div key={h.id} className="rounded-3xl bg-white p-4 text-slate-800 hf-pop" style={{ animationDelay: `${i * 0.25}s` }}>
                <HouseSVG house={h} width={180} className="mx-auto" />
                <div className="font-black">{h.address}</div>
                <div className="text-sm font-bold text-slate-500">{money(h.price)} · {reasons.join(', ')}</div>
                <div className="text-2xl mt-2">{'⭐'.repeat(stars)}<span className="opacity-20">{'⭐'.repeat(3 - stars)}</span></div>
                <div className="text-sm font-bold">{stars === 3 ? 'Great find! This could make real money.' : stars === 2 ? 'Maybe. Depends on the price you can get.' : 'Priced too high for a flip.'}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center"><Btn size="lg" color="green" onClick={() => onDone?.({ saved: savedList })}>Keep going ▶</Btn></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {hoods.map((k) => (
            <button key={k} onClick={() => { sfx.click(); setHood(k); setActive(null); }}
              className={`rounded-full px-4 py-1.5 font-black text-sm ${hood === k ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'}`}>
              {NEIGHBORHOODS[k].name}
            </button>
          ))}
        </div>
        <TownMap neighborhoods={Object.fromEntries(hoods.map((k) => [k, NEIGHBORHOODS[k]]))} selected={hood} onSelect={(k) => { setHood(k); setActive(null); }}
          pins={pins} onPin={(p) => select(p.house)} activePin={active} />
        <div className="mt-3 rounded-2xl bg-white/10 p-3 text-white">
          <div className="font-black">{NEIGHBORHOODS[hood].name}</div>
          <div className="text-sm font-semibold text-white/70">{NEIGHBORHOODS[hood].blurb}</div>
          <div className="text-sm font-bold text-amber-200 mt-1">Fixed-up houses here sell for about {money(streetValue[0])} to {money(streetValue[1])}</div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {houses.map((h) => (
            <button key={h.id} onClick={() => select(h)} className={`rounded-xl px-3 py-1.5 text-sm font-black ${active === h.id ? 'bg-amber-300 text-amber-950' : saved[h.id] ? 'bg-amber-100 text-amber-900' : 'bg-white text-slate-700'}`}>
              {saved[h.id] ? '★ ' : ''}{h.address}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {cur ? (
          <div key={cur.id} className="rounded-3xl bg-white p-4 text-slate-800 hf-pop">
            <div className="flex gap-3">
              <HouseSVG house={cur} width={170} />
              <div className="flex-1">
                <div className="text-xs font-black text-slate-400">{cur.hoodName.toUpperCase()}</div>
                <div className="text-xl font-black leading-tight">{cur.address}</div>
                <div className="text-3xl font-black text-emerald-600 mt-1">{money(cur.price)}</div>
                <div className="text-sm font-bold text-slate-500">{cur.beds} bed · {cur.baths} bath · {cur.sqft.toLocaleString()} sq ft · built {cur.built}</div>
                <div className="text-sm font-bold text-slate-500">{money(Math.round(cur.price / cur.sqft))} per sq ft</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Chip color={cur.condition === 'A' ? 'bg-emerald-100 text-emerald-800' : cur.condition === 'D' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}>{cur.conditionLabel}</Chip>
                  {cur.motivated && <Chip color="bg-sky-100 text-sky-800">🏃 Seller needs to move fast!</Chip>}
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-500 mt-2">Seller: {cur.seller}</div>
            {mode === 'save' ? (
              <div className="mt-3">
                {!saved[cur.id] ? <Btn color="orange" onClick={() => save(cur)}>★ Save this house</Btn> : (
                  <div>
                    <div className="text-sm font-black text-slate-700 mb-1">Why did you save it? (pick at least one)</div>
                    <div className="flex flex-wrap gap-1.5">
                      {REASONS.map((r) => (
                        <button key={r} onClick={() => { sfx.click(); toggleReason(cur, r); }}
                          className={`rounded-full px-3 py-1 text-sm font-black border-2 ${saved[cur.id].reasons.includes(r) ? 'bg-amber-300 border-amber-400 text-amber-950' : 'bg-white border-slate-200 text-slate-600'}`}>{r}</button>
                      ))}
                    </div>
                    <button onClick={() => unsave(cur)} className="text-xs font-bold text-slate-400 mt-2 underline">Remove</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Btn color="green" onClick={() => { sfx.cash(); onDone?.({ house: cur }); }}>Plan a flip on this house ▶</Btn>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-white/10 p-6 text-center text-white/70 font-bold">Tap a pin on the map to see a house for sale.</div>
        )}

        {mode === 'save' && (
          <div className="rounded-3xl bg-amber-100 p-4">
            <div className="font-black text-amber-950">My Prospects ({readyCount}/{need})</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {savedList.length === 0 && <span className="text-sm font-bold text-amber-900/60">Saved houses show up here.</span>}
              {savedList.map(({ house: h, reasons }) => (
                <button key={h.id} onClick={() => { setHood(h.hood); select(h); }} className="rounded-xl bg-white px-2 py-1 text-sm font-black text-slate-700">
                  {h.address} {reasons.length ? '✓' : '…'}
                </button>
              ))}
            </div>
            <div className="mt-3"><Btn color="green" disabled={readyCount < need} onClick={() => { sfx.sparkle(); setReveal(true); }}>Done hunting ▶</Btn></div>
          </div>
        )}
      </div>
    </div>
  );
}

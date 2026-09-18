import { BASE, CAD, GUIDE, meta, Nav, Back, Btn, Section, Title, Steps, Cards } from '../ui';
import { PARTS, LOCAL, PLATES, MODELS, PLAN, PROGRAMS } from '../data';

export const metadata = meta(
  'Flying Mosquito: build it',
  'Shopping list, 7 print plates for the Flashforge Adventurer 5M, 3D models, the December to January build plan, and the four programs.',
  `${BASE}/build`
);

const money = (n) => `$${n.toFixed(2)}`;

export default function BuildPage() {
  const all = PARTS.flatMap(([, items]) => items);
  const total = all.reduce((s, p) => s + p[4] * p[5], 0);
  const stores = [...new Set(all.map((p) => p[2]))];
  const printMin = 9.8 + 32.9 + 8.7 + 26.0 + 76.5 + 135.7 + 53.9;
  const grams = PLATES.reduce((s, p) => s + p[4], 0);
  return (
    <div className="min-h-screen">
      <Nav current="build" />
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">
        <Back href={BASE}>Flying Mosquito</Back>
        <div className="mt-5">
          <Title size="text-2xl sm:text-3xl">BUILD IT</Title>
          <p className="text-white/70 mt-3 max-w-2xl">
            Order by November 13, build December 1 to January 24. Every step happens on a day with no MS-2000 test.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Btn href={GUIDE} primary>Step-by-step build guide</Btn>
            <Btn href="#shopping">Shopping list</Btn>
            <Btn href="#prints">Print plates</Btn>
            <Btn href="#plan">Build plan</Btn>
            <Btn href="#programs">Programs</Btn>
          </div>
        </div>

        <Section id="shopping" title="Shopping list" sub={`${all.length} kinds of parts from ${stores.length} stores, about ${money(total)} before shipping and tax. Prices checked Sep 18, 2026. Open every link again before ordering.`}>
          <div className="space-y-5">
            {PARTS.map(([group, items]) => (
              <div key={group}>
                <div className="text-lime-300 text-sm font-bold mb-2">{group}</div>
                <div className="space-y-2">
                  {items.map(([name, why, store, sku, qty, each, link, backup]) => (
                    <a key={name} href={link} target="_blank" rel="noopener noreferrer" className="block bg-naw-card rounded-2xl border border-white/10 hover:border-lime-300/40 px-4 py-3 transition-colors">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-white font-semibold text-sm">{qty > 1 ? `${qty} x ` : ''}{name}</span>
                        <span className="text-white tabular-nums text-sm font-bold">{money(qty * each)}</span>
                      </div>
                      <div className="text-white/55 text-xs mt-1">{why}</div>
                      <div className="text-white/40 text-xs mt-1">{store} · {sku} · backup: {backup}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-white font-semibold text-sm">From home or a local store (about $25)</div>
            <ul className="mt-2 space-y-1 text-white/60 text-sm list-disc pl-5">
              {LOCAL.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </div>
          <p className="text-white/45 text-xs mt-3">
            The drone and the module ship from India through Tindie; allow 3 weeks. The Amazon listings are the faster backup.
            Battery and habitat prices are estimates until the order.
          </p>
        </Section>

        <Section id="prints" title="Print plates" sub={`7 plates for the Flashforge Adventurer 5M, about ${Math.floor(printMin / 60)} hours ${Math.round(printMin % 60)} minutes and ${Math.round(grams)} g. 0.2 mm layers, no supports, 5 mm brim. The flying parts are plates 2 to 4, about 15 g once the brim comes off.`}>
          <div className="grid sm:grid-cols-2 gap-3">
            {PLATES.map(([n, title, color, time, g, file, note]) => (
              <a key={n} href={`${CAD}/plates/${file}`} download className="block bg-naw-card rounded-2xl border border-white/10 hover:border-lime-300/40 p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs font-semibold">Plate {n}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color === 'WHITE' ? 'bg-white text-naw-dark' : 'bg-white/10 text-white/60'}`}>{color}</span>
                </div>
                <div className="text-white font-bold mt-1">{title}</div>
                <div className="text-white/55 text-sm mt-1">{note}</div>
                <div className="text-lime-300/80 text-xs mt-2">{time} · {g} g · download .3mf</div>
              </a>
            ))}
          </div>
        </Section>

        <Section id="models" title="3D models" sub="Spin them, zoom in, and see the sizes. Each one also has its STL file.">
          <div className="grid sm:grid-cols-2 gap-3">
            {MODELS.map(([file, t, d]) => (
              <a key={file} href={`${CAD}/${file}`} target="_blank" rel="noopener noreferrer" className="block bg-naw-card rounded-2xl border border-naw-cyan/20 hover:border-naw-cyan/50 p-4 transition-colors">
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/55 text-sm mt-1">{d}</div>
              </a>
            ))}
          </div>
        </Section>

        <Section id="guide" title="The build guide" sub="18 steps in six parts, with safety rules, wiring maps, the code, and a fixing-it table. Same style as the MS-2000 and Dusty guides.">
          <a href={GUIDE} target="_blank" rel="noopener noreferrer" className="block group bg-naw-card rounded-2xl border border-lime-300/30 hover:border-lime-300/70 overflow-hidden transition-colors">
            <img src="/projects/addie/flymo-guide/explode.jpg" alt="The Flying Mosquito pulled apart" className="w-full h-48 object-contain bg-[#0d1b2e]" />
            <div className="p-5">
              <h3 className="text-white font-bold text-lg group-hover:text-lime-300 transition-colors">How to build the Flying Mosquito</h3>
              <p className="text-white/55 text-sm mt-1">A. Check and print · B. Can it fly? · C. Fly by itself · D. The hit sensor · E. The control box · F. Test it</p>
            </div>
          </a>
        </Section>

        <Section id="plan" title="Build plan" sub="Week by week. Each week ends with something that works.">
          <div className="space-y-6">
            {PLAN.map(([when, title, steps]) => (
              <div key={title}>
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <span className="text-lime-300 text-xs font-bold">{when}</span>
                  <span className="text-white font-bold text-lg">{title}</span>
                </div>
                <Steps items={steps} />
              </div>
            ))}
          </div>
        </Section>

        <Section id="programs" title="The four programs" sub="Three run in the box and the body. The micro:bit one is Addie's.">
          <Cards items={PROGRAMS} />
        </Section>
      </div>
    </div>
  );
}

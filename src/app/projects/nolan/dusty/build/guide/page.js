import Link from 'next/link';
import { Nav } from '../../ui';
import { F, V3D, SETTINGS, BEFORE, BATCHES } from './data';
import { FACTS, SAFETY, TOOLS, BOUGHT, SCREWS, WEEKENDS, STEPS, FIXES, WORDS } from './steps';

const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
const TITLE = 'Dusty: Build Guide';
const DESC = 'Print, clean up, check and build Dusty batch by batch: every part, every screw and every step, with 3D pictures from the real design.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://nawgames.com/projects/nolan/dusty/build/guide',
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

function Btn({ href, children, primary, download }) {
  const cls = primary
    ? 'bg-naw-orange text-naw-dark hover:bg-naw-orange/90'
    : 'bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25';
  return (
    <a
      href={href}
      {...(download ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}
      className={`${cls} inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors`}
    >
      {children}
    </a>
  );
}

const HT = `${F}/howto`;

function Parts({ parts }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
      {parts.map((p) => (
        <div key={p.k + p.name} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          <img src={`${HT}/part-${p.k}.png`} alt={`${p.name} next to a penny for size`} width={600} height={420} loading="lazy" className="w-full h-auto bg-[#0d1b2e]" />
          <div className="p-3">
            <div className="text-white font-bold">{p.name}</div>
            <p className="text-white/75 text-sm mt-1">{p.looks}</p>
            <p className="text-white/55 text-sm mt-1"><span className="text-white/40">Job: </span>{p.job}</p>
            <p className="text-sm mt-1"><span className="text-naw-orange font-semibold">Goes to: </span><span className="text-white/75">{p.goes}</span></p>
            {p.tip && <p className="text-yellow-200/80 text-xs mt-2">{p.tip}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function After({ items }) {
  return (
    <ol className="space-y-6 mt-3">
      {items.map((s, i) => (
        <li key={i}>
          <div className="flex gap-3">
            <span className="flex-none w-7 h-7 rounded-md bg-naw-cyan text-naw-dark text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
            <div className="min-w-0">
              <div className="text-white font-semibold">{s.t}</div>
              {s.tip && <p className="text-white/60 text-sm mt-1">{s.tip}</p>}
            </div>
          </div>
          <div className={`mt-3 grid gap-3 ${s.img.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {s.img.map((im) => (
              <img key={im} src={`${HT}/${im}.png`} alt={s.t} width={900} height={600} loading="lazy" className="w-full h-auto rounded-xl border border-white/10 bg-[#0d1b2e]" />
            ))}
          </div>
          {s.check && (
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              {s.check.map(([head, see, fix, kind]) => (
                <div key={head} className={`rounded-xl p-3 border ${kind === 'ok' ? 'border-naw-green/50 bg-naw-green/10' : 'border-red-400/40 bg-red-500/10'}`}>
                  <div className={`font-bold text-sm ${kind === 'ok' ? 'text-naw-green' : 'text-red-300'}`}>{head}</div>
                  <div className="text-white/70 text-xs mt-1">{see}</div>
                  <div className="text-white text-xs mt-2">{fix}</div>
                </div>
              ))}
            </div>
          )}
          {s.tip2 && <p className="text-white/60 text-sm mt-2">{s.tip2}</p>}
        </li>
      ))}
    </ol>
  );
}

function List({ items }) {
  return (
    <ol className="space-y-2 mt-2">
      {items.map(([main, tip], i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-none w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span>
            <span className="text-white text-sm">{main}</span>
            {tip && <span className="block text-white/45 text-xs mt-0.5">{tip}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}


function Pic({ src, cap, drawing }) {
  return (
    <figure className={`rounded-xl border border-white/10 overflow-hidden ${drawing ? 'bg-[#16203a] p-3' : 'bg-[#0d1b2e]'}`}>
      <img src={src} alt={cap || ''} loading="lazy" className={drawing ? 'w-full h-auto max-h-80 object-contain' : 'w-full h-auto'} />
      {cap && <figcaption className="text-white/50 text-xs px-3 py-2">{cap}</figcaption>}
    </figure>
  );
}

function Code({ rows }) {
  const tint = { event: 'bg-sky-500/25 border-sky-400/50', logic: 'bg-emerald-500/20 border-emerald-400/40' };
  return (
    <div className="mt-4 bg-[#0b1526] rounded-xl border border-white/10 p-3 space-y-1.5">
      <div className="text-white/40 text-xs font-semibold mb-1">MakeCode blocks</div>
      {rows.map(([t, note, depth, kind], i) => (
        <div key={i} style={{ marginLeft: `${(depth || 0) * 1.25}rem` }}>
          <span className={`inline-block rounded-md border px-2 py-1 text-sm font-mono text-white ${tint[kind] || 'bg-fuchsia-500/20 border-fuchsia-400/40'}`}>{t}</span>
          {note && <span className="text-white/45 text-xs ml-2">{note}</span>}
        </div>
      ))}
    </div>
  );
}

function Step({ n }) {
  const s = STEPS[n];
  return (
    <article id={`step-${n}`} className="scroll-mt-4 mt-6 bg-naw-card rounded-2xl border border-naw-orange/40 p-5">
      <div className="flex items-baseline gap-3">
        <span className="flex-none w-9 h-9 rounded-full bg-naw-orange text-naw-dark font-bold flex items-center justify-center">{n}</span>
        <div>
          <h3 className="text-white text-lg sm:text-xl font-bold">Step {n}: {s.title}</h3>
          <p className="text-white/50 text-sm">{s.time}</p>
        </div>
      </div>
      <p className="text-white/75 text-sm mt-3 leading-relaxed">{s.intro}</p>

      <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3">
        <div className="text-naw-orange text-xs font-semibold">You need</div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {s.need.map((x) => (
            <span key={x} className="bg-white/10 text-white/85 text-xs px-2 py-1 rounded-md">{x}</span>
          ))}
        </div>
      </div>

      {s.draw && (
        <div className="mt-4 grid gap-3">
          {s.draw.map(([src, cap]) => <Pic key={src} src={src} cap={cap} drawing />)}
        </div>
      )}

      <ol className="space-y-5 mt-5">
        {s.sub.map(([t, tip, img], i) => (
          <li key={i}>
            <div className="flex gap-3">
              <span className="flex-none w-7 h-7 rounded-md bg-white/10 text-white text-sm font-bold flex items-center justify-center mt-0.5">{String.fromCharCode(97 + i)}</span>
              <div className="min-w-0">
                <div className="text-white text-sm sm:text-base font-semibold">{t}</div>
                {tip && <p className="text-white/60 text-sm mt-1">{tip}</p>}
              </div>
            </div>
            {img && <div className="mt-3 sm:pl-10"><Pic src={img} /></div>}
          </li>
        ))}
      </ol>

      {s.code && <Code rows={s.code} />}

      {s.tip && (
        <div className="mt-4 rounded-xl border border-naw-cyan/40 bg-naw-cyan/10 p-3 text-sm text-white/85">{s.tip}</div>
      )}

      {s.why && (
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {s.why.map(([t, ps]) => (
            <div key={t} className="rounded-xl border border-lime-300/25 bg-lime-300/5 p-4">
              <div className="text-lime-300 text-xs font-semibold">Why it works</div>
              <div className="text-white font-bold">{t}</div>
              {ps.map((p, i) => <p key={i} className="text-white/70 text-sm mt-2 leading-relaxed">{p}</p>)}
            </div>
          ))}
        </div>
      )}

      {s.warn && (
        <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm">
          <span className="text-red-300 font-bold">Careful: </span><span className="text-white/85">{s.warn}</span>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-naw-green/40 bg-naw-green/10 p-3">
        <div className="text-naw-green text-xs font-semibold">You are done when</div>
        <div className="text-white text-sm mt-0.5">{s.done}</div>
      </div>
    </article>
  );
}

function H2({ id, kicker, children }) {
  return (
    <div id={id} className="scroll-mt-4 mt-12">
      {kicker && <div className="text-naw-cyan text-xs font-semibold tracking-wide uppercase">{kicker}</div>}
      <h2 className="text-white text-xl sm:text-2xl font-bold">{children}</h2>
    </div>
  );
}

const STEP_BATCH = { 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 4, 10: 5, 11: 5 };

export default function DustyBuildGuidePage() {
  return (
    <div className="min-h-screen">
      <Nav current="guide" />
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
        <Link href="/projects/nolan/dusty/build" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Build Dusty
        </Link>

        <h1 className="font-game text-xl sm:text-2xl glow mt-6">
          <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">BUILD GUIDE</span>
        </h1>
        <p className="text-white text-lg font-semibold mt-4 leading-snug">
          From a spool of plastic to a robot that sweeps the table and stops at the edge. Print a batch, clean it up, check
          it, then build what it unlocks.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {FACTS.map((f) => (
            <span key={f} className="bg-white/5 border border-white/15 rounded-full px-3 py-1 text-xs text-white/70">{f}</span>
          ))}
          <span className="bg-white/5 border border-white/15 rounded-full px-3 py-1 text-xs text-white/70">Rev A.5</span>
        </div>
        <div className="mt-5 rounded-2xl overflow-hidden border border-white/10">
          <img src="/projects/nolan/dusty-files/guide/g-hero.png" alt="Dusty, finished, from the front left" className="w-full h-auto bg-[#0d1b2e]" />
        </div>

        <nav className="mt-6 bg-naw-card rounded-2xl border border-white/10 p-4">
          <div className="text-white/45 text-xs font-semibold">Jump to</div>
          <div className="flex flex-wrap gap-2 mt-2 text-sm">
            {[['#start', 'Start here'], ['#parts', 'Meet the parts'], ['#screws', 'Screws'], ['#settings', 'Printer settings']].map(([h2, t]) => (
              <a key={h2} href={h2} className="bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 text-white/80">{t}</a>
            ))}
            {BATCHES.map((b) => (
              <a key={b.n} href={`#batch-${b.n}`} className="bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 text-white/80">
                <span className="text-naw-orange font-bold">B{b.n}</span> {b.title}
              </a>
            ))}
            {[['#fixing', 'Fixing it'], ['#words', 'Words']].map(([h2, t]) => (
              <a key={h2} href={h2} className="bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 text-white/80">{t}</a>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Object.keys(STEPS).map((n) => (
              <a key={n} href={`#step-${n}`} className="w-8 h-8 rounded-full bg-naw-orange/20 hover:bg-naw-orange/40 text-naw-orange text-sm font-bold flex items-center justify-center">{n}</a>
            ))}
          </div>
        </nav>

        {/* ---------- START HERE ---------- */}
        <H2 id="start" kicker="Before anything">Start here</H2>
        <section className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 p-5">
          <h3 className="text-white font-bold">Safety rules</h3>
          <ul className="mt-2 space-y-2">
            {SAFETY.map(([b, t]) => (
              <li key={b} className="text-sm"><span className="text-white font-semibold">{b}</span> <span className="text-white/65">{t}</span></li>
            ))}
          </ul>
        </section>

        <section className="mt-4 bg-naw-card rounded-2xl border border-white/10 p-5">
          <h3 className="text-white font-bold">Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {TOOLS.map(([src, n, d]) => (
              <div key={n} className="rounded-xl bg-white/5 p-3 text-center">
                <img src={src} alt="" className="w-12 h-12 mx-auto" />
                <div className="text-white text-sm font-semibold mt-1">{n}</div>
                <div className="text-white/45 text-xs">{d}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 bg-naw-card rounded-2xl border border-white/10 p-5">
          <h3 className="text-white font-bold">The plan, weekend by weekend</h3>
          <div className="mt-3 divide-y divide-white/5">
            {WEEKENDS.map(([w, what, note]) => (
              <div key={w} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2 text-sm">
                <span className="text-naw-orange font-semibold">{w}</span>
                <span><span className="text-white">{what}</span><span className="text-white/45"> · {note}</span></span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-naw-orange/40 bg-naw-orange/10 p-5">
          <h3 className="text-white font-bold">Before the first print</h3>
          <List items={BEFORE} />
        </section>

        {/* ---------- PARTS ---------- */}
        <H2 id="parts" kicker="Know your gear">Meet the parts</H2>
        <p className="text-white/60 text-sm mt-2">
          Lay everything out before you build. These are the bought parts. Every printed part has its own card, next to a
          penny, in the batch that prints it.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {BOUGHT.map(([src, name, what, job, spec]) => (
            <div key={name} className="bg-naw-card rounded-2xl border border-white/10 overflow-hidden flex">
              <div className="flex-none w-28 sm:w-32 bg-[#16203a] flex items-center justify-center p-2">
                <img src={src} alt="" className="w-full h-auto" />
              </div>
              <div className="p-3 min-w-0">
                <div className="text-white font-bold text-sm">{name}</div>
                <p className="text-white/65 text-xs mt-1">{what}</p>
                <p className="text-white/55 text-xs mt-1"><span className="text-white/40">Job: </span>{job}</p>
                <p className="text-naw-orange/80 text-[11px] font-semibold mt-1 uppercase tracking-wide">{spec}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn href={V3D}>See every part in 3D</Btn>
          <Btn href="/projects/nolan/dusty-parts-list.pdf">Parts list (PDF)</Btn>
        </div>

        <H2 id="screws" kicker="Hardware">Where every screw goes</H2>
        <p className="text-white/60 text-sm mt-2">Sort the screws into cups first: 6 mm, 8 mm, 10 mm, and one for nuts. The 6 and 8 look almost the same.</p>
        <div className="mt-3 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/45 text-xs text-left">
                <th className="px-4 py-2 font-semibold">Where</th>
                <th className="px-4 py-2 font-semibold">Screw</th>
                <th className="px-4 py-2 font-semibold">How many</th>
                <th className="px-4 py-2 font-semibold">Notes</th>
                <th className="px-4 py-2 font-semibold">Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {SCREWS.map(([w, sc, q, note, st]) => (
                <tr key={w}>
                  <td className="px-4 py-2 text-white">{w}</td>
                  <td className="px-4 py-2 font-mono whitespace-nowrap">{sc}</td>
                  <td className="px-4 py-2 tabular-nums">{q}</td>
                  <td className="px-4 py-2 text-white/60">{note}</td>
                  <td className="px-4 py-2"><a href={`#step-${st}`} className="text-naw-orange font-semibold">{st}</a></td>
                </tr>
              ))}
              <tr><td className="px-4 py-2 text-white font-bold">Total</td><td className="px-4 py-2" /><td className="px-4 py-2 font-bold">23</td><td className="px-4 py-2 text-white/60" colSpan={2}>18 × 8 mm, 3 × 6 mm, 2 × 10 mm, plus 6 nuts. Spares get lost.</td></tr>
            </tbody>
          </table>
        </div>

        <H2 id="settings" kicker="For the grown-up at the printer">Printer settings for every batch</H2>
        <section className="mt-3 bg-naw-card rounded-2xl border border-white/10 p-5">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {SETTINGS.map(([k, v]) => (
              <div key={k} className="text-sm border-l-2 border-white/10 pl-3">
                <div className="text-white/45 text-xs">{k}</div>
                <div className="text-white">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid sm:grid-cols-[1fr_1.2fr] gap-4 items-center">
            <Pic src="/projects/nolan/dusty-files/guide/draw-printer-layers.svg" cap="A 3D printer builds a part like a stack of very thin pancakes." drawing />
            <div className="text-sm text-white/70 space-y-2">
              <p><span className="text-white font-semibold">What is PLA?</span> A plastic made from plants. The printer pushes the thread into a nozzle at about 220°C, where it melts like hot glue, and draws one layer 0.2 mm thick, then the next on top.</p>
              <p><span className="text-white font-semibold">What is a brim?</span> A thin flat ring around each part, like the brim of a hat, so corners do not curl up. Peel it off afterward.</p>
              <p><span className="text-white font-semibold">PLA goes soft at about 60°C.</span> A car in the Houston sun gets hotter than that. Never leave Dusty in the car.</p>
            </div>
          </div>
        </section>

        {/* ---------- BATCHES ---------- */}
        {BATCHES.map((b) => {
          const steps = Object.keys(STEPS).map(Number).filter((n) => STEP_BATCH[n] === b.n);
          return (
            <section key={b.n} id={`batch-${b.n}`} className="mt-14 scroll-mt-4">
              <div className="flex items-baseline gap-3">
                <span className="flex-none w-10 h-10 rounded-xl bg-naw-orange text-naw-dark font-bold text-lg flex items-center justify-center">{b.n}</span>
                <div>
                  <div className="text-naw-cyan text-xs font-semibold tracking-wide uppercase">Chapter {b.n}</div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold">Batch {b.n}: {b.title}</h2>
                  <p className="text-white/50 text-sm">{b.when} · {b.time} · {b.grams} g</p>
                </div>
              </div>

              <div className="mt-4 text-white/45 text-xs font-semibold uppercase tracking-wide">1 · Print</div>
              <div className="mt-2 bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-hidden">
                <img src={`${F}/howto/plate-${b.n}.png`} alt={`Print plate for batch ${b.n}: ${b.pieces}`} width={900} height={600} className="w-full h-auto bg-[#0d1b2e]" />
                <div className="p-5">
                  <div className="text-white/45 text-xs">On the plate</div>
                  <div className="text-white text-sm font-semibold">{b.pieces}</div>
                  <p className="text-white/60 text-sm mt-2">{b.why}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Btn href={`${F}/${b.stem}.gcode`} primary download>Ready to print (.gcode)</Btn>
                    <Btn href={`${F}/${b.stem}.3mf`} download>Plate file (.3mf)</Btn>
                    <Btn href={`${F}/${b.stem}.stl`} download>Plate (.stl)</Btn>
                    <Btn href={V3D}>See the parts in 3D</Btn>
                  </div>
                  {b.need.length > 0 && <p className="text-white/50 text-xs mt-3">Have ready: {b.need.join(', ')}</p>}
                </div>
              </div>

              <div className="mt-4 bg-naw-card rounded-2xl border border-lime-300/25 p-5">
                <div className="text-lime-300 text-xs font-semibold">Learn while it prints</div>
                <h3 className="text-white font-bold">{b.learn.title}</h3>
                <List items={b.learn.items} />
              </div>

              <div className="mt-6 text-white/45 text-xs font-semibold uppercase tracking-wide">2 · Know your parts</div>
              <div className="mt-2 bg-naw-card rounded-2xl border border-white/10 p-5">
                <p className="text-white/55 text-sm">
                  Every piece from this plate, next to a penny for size. The colors in the pictures only tell the parts apart:
                  yours come out the color of your filament.
                </p>
                <Parts parts={b.parts} />
                {b.boxParts && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-2">
                    {b.boxParts.map(([n, d]) => (
                      <div key={n} className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm">
                        <div className="text-white font-bold">{n}</div>
                        <div className="text-white/65 mt-0.5">{d}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 text-white/45 text-xs font-semibold uppercase tracking-wide">3 · Clean up and check</div>
              <div className="mt-2 bg-naw-card rounded-2xl border border-naw-cyan/30 p-5">
                <h3 className="text-naw-cyan font-bold">When it is done printing</h3>
                <After items={b.after} />
              </div>
              <div className="mt-4 rounded-2xl border border-naw-green/40 bg-naw-green/10 p-4">
                <div className="text-naw-green text-xs font-semibold">Ready to move on when</div>
                <div className="text-white text-sm mt-0.5">{b.gate}</div>
              </div>

              {steps.length > 0 && (
                <>
                  <div className="mt-8 text-white/45 text-xs font-semibold uppercase tracking-wide">4 · Build</div>
                  <p className="text-white/60 text-sm mt-1">This batch unlocks Steps {steps[0]}{steps.length > 1 ? ` to ${steps[steps.length - 1]}` : ''}.</p>
                  {steps.map((n) => <Step key={n} n={n} />)}
                </>
              )}
            </section>
          );
        })}

        {/* ---------- FIXING / WORDS ---------- */}
        <H2 id="fixing" kicker="When it misbehaves">Fixing it</H2>
        <div className="mt-3 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/45 text-xs text-left">
                <th className="px-4 py-2 font-semibold">What you see</th>
                <th className="px-4 py-2 font-semibold">Most likely cause</th>
                <th className="px-4 py-2 font-semibold">What to do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {FIXES.map(([a, b, c]) => (
                <tr key={a}>
                  <td className="px-4 py-2 text-white">{a}</td>
                  <td className="px-4 py-2 text-white/60">{b}</td>
                  <td className="px-4 py-2 text-white/80">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2 id="words" kicker="Say these like you mean them">Words to know</H2>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {WORDS.map(([w, d]) => (
            <div key={w} className="bg-naw-card rounded-xl border border-white/10 p-3 text-sm">
              <span className="text-white font-bold">{w}</span> <span className="text-white/65">{d}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <Btn href={V3D}>3D model of every part</Btn>
          <Btn href="/projects/nolan/dusty-parts-list.pdf">Parts list PDF</Btn>
          <Link href="/projects/nolan/dusty/changes" className="bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25 inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold">Change orders and history</Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { A, BASE, MS, CAD, GUIDE, meta, Nav, Back, Btn, Section, Title, Cards } from './ui';
import { PHASES } from './data';

export const metadata = meta(
  'Flying Mosquito: the MS-2000 bonus project',
  'A tiny 3D printed drone mosquito that takes off from its pad, flies around a test zone by itself, and radios back every time the MS-2000 laser hits it.',
  BASE
);

const DOT = {
  done: 'bg-naw-green border-naw-green',
  now: 'bg-lime-300 border-lime-300',
  next: 'bg-naw-dark border-white/30',
};

const PAGES = [
  [`${BASE}/design`, 'Design', 'How it works, the requirements, the four designs, the weight budget, the radio plan, and the risks.'],
  [`${BASE}/experiment`, 'Can it fly?', 'Our own math on push, the maker\u2019s safety margin and battery time, a prediction, and the experiment that tests it.'],
  [GUIDE, 'Build guide', '18 steps from a box of parts to a flying target: safety, wiring maps, the code, and fixing it.'],
  [`${BASE}/build`, 'Build', 'Everything to buy, the 7 print plates, the 3D models, the build plan week by week, and the programs.'],
  [`${BASE}/learn`, 'Learn the science', 'How a drone flies: lift, thrust, spinning props, balance, the floor camera, batteries, radio, and real mosquitoes.'],
  [`${BASE}/changes`, 'Changes and lessons', 'The project history, the lessons from Dusty and the MS-2000, and how changes get made after the design is locked.'],
  [`${CAD}/flymo-drone-3d.html`, 'See it in 3D', 'The whole drone in color. Tap a part to learn what it does, or pull it apart with Explode.'],
  [MS, 'The MS-2000', 'The laser turret this mosquito is built to dodge. Addie\u2019s science fair project.'],
];

const QUICK = [
  ['About 87 g', 'Takeoff weight with the battery, guard, and body'],
  ['147 mm', 'Across, guard included. Smaller than a hand spread wide'],
  ['30 seconds', 'One run: take off, fly the pattern, land on the pad'],
  ['About $250', 'Parts from six stores, plus local supplies'],
];

export default function FlyingMosquitoPage() {
  return (
    <div className="min-h-screen">
      <Nav current="overview" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-400/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-8">
          <Back href={A}>Addie&apos;s Projects</Back>
          <div className="grid md:grid-cols-2 gap-6 items-center mt-6">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-naw-pink/20 text-naw-pink text-xs font-semibold px-2 py-0.5 rounded-full">Bonus project</span>
                <span className="bg-naw-orange/20 text-naw-orange text-xs font-semibold px-2 py-0.5 rounded-full">Build starts December</span>
                <span className="bg-naw-cyan/20 text-naw-cyan text-xs font-semibold px-2 py-0.5 rounded-full">Design A, Rev A</span>
              </div>
              <div className="mt-4">
                <Title>FLYING MOSQUITO</Title>
              </div>
              <div className="text-lime-300 text-sm font-bold tracking-widest mt-2">A TARGET FOR THE MS-2000</div>
              <p className="text-white text-lg sm:text-xl font-semibold mt-4 leading-snug">
                Press the big button. A tiny drone mosquito takes off from its pad, flies around its net by itself, and
                radios back every time the MS-2000 laser tags its glowing window.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <Btn href={`${BASE}/design`} primary>The design</Btn>
                <Btn href={`${BASE}/experiment`}>Can it fly?</Btn>
                <Btn href={GUIDE}>Build guide</Btn>
                <Btn href={`${BASE}/learn`}>How drones fly</Btn>
                <Btn href={`${CAD}/flymo-drone-3d.html`}>See it in 3D</Btn>
              </div>
            </div>
            <a href={`${CAD}/flymo-drone-3d.html`} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-white/10 bg-[#0d1b2e]">
              <img src="/projects/addie/flymo-hero.jpg" alt="3D model of the Flying Mosquito drone" width={720} height={408} className="w-full h-auto" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {QUICK.map(([n, t]) => (
              <div key={n} className="rounded-2xl border border-lime-300/25 bg-lime-300/5 p-4">
                <div className="text-lime-300 text-xl font-bold">{n}</div>
                <div className="text-white/55 text-xs mt-1">{t}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-2xl border border-naw-cyan/30 bg-naw-cyan/10 p-4">
              <div className="text-naw-cyan text-xs font-semibold">The engineering goal</div>
              <div className="text-white font-semibold mt-1">Build a tiny mosquito that flies by itself and knows when it has been hit.</div>
              <div className="text-white/55 text-sm mt-1">Then find out: does the MS-2000 hit a free flyer as often as the mosquito on the fishing line?</div>
            </div>
            <div className="rounded-2xl border border-naw-green/30 bg-naw-green/10 p-4">
              <div className="text-naw-green text-xs font-semibold">Why it is a bonus</div>
              <div className="text-white/85 text-sm mt-1">
                The MS-2000 is Addie&apos;s science fair project and always comes first. The flyer is built in December and
                January on days with no MS-2000 test, and only goes to the fair if drones are allowed.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="Where we are" sub="Green is done, lime is now.">
          <ol className="relative border-l-2 border-white/10 ml-3 space-y-3">
            {PHASES.map((p, i) => {
              const Wrap = p.link ? 'a' : 'div';
              return (
                <li key={p.title} className="pl-6 relative">
                  <span className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 ${DOT[p.status]}`} />
                  <Wrap
                    {...(p.link ? { href: p.link } : {})}
                    className={`block rounded-2xl border px-4 py-3 transition-colors ${
                      p.status === 'now' ? 'bg-lime-300/10 border-lime-300/50' : 'bg-naw-card border-white/10'
                    } ${p.status === 'done' ? 'opacity-60' : ''} ${p.link ? 'hover:border-white/30' : ''}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white/50 text-xs font-semibold">Step {i + 1} · {p.when}</span>
                      {p.status === 'now' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-lime-300 text-naw-dark">Now</span>}
                      {p.status === 'done' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-green/20 text-naw-green">Done</span>}
                    </div>
                    <div className="text-white font-bold mt-0.5">{p.title}</div>
                    <div className="text-white/55 text-sm">{p.text}</div>
                  </Wrap>
                </li>
              );
            })}
          </ol>
        </Section>

        <Section title="Rules to remember">
          <Cards items={[
            ['Props stay in the net', 'The drone only flies inside the net with its guard on. Hands out while the props spin.'],
            ['A grown-up handles the batteries', 'LiPo batteries charge on a hard surface with a grown-up nearby, and get unplugged after every flight.'],
            ['Never look into the laser', 'Same rule as the MS-2000. The arm switch stays off until go time.'],
            ['The MS-2000 comes first', 'No flyer work on an MS-2000 test day, and nothing that changes the turret before the fair.'],
          ]} />
        </Section>

        <Section title="Project pages">
          <div className="grid sm:grid-cols-2 gap-4">
            {PAGES.map(([href, t, d]) => {
              const internal = href.startsWith('/projects/addie/flying-mosquito') || href === MS;
              const cls = 'group bg-naw-card rounded-2xl border border-lime-300/25 p-5 hover:border-lime-300/60 transition-colors';
              const inner = (
                <>
                  <h3 className="text-white font-bold text-lg group-hover:text-lime-300 transition-colors">{t}</h3>
                  <p className="text-white/55 text-sm mt-1">{d}</p>
                </>
              );
              return internal ? (
                <Link key={href} href={href} className={cls}>{inner}</Link>
              ) : (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}

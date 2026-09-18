import Link from 'next/link';

const A = '/projects/addie';
const BASE = '/projects/addie/flying-mosquito';
const MS = '/projects/addie/mosquito-turret';
const OG = 'https://nawgames.com/projects/addie/ms2000-og.png';
const TITLE = 'Flying Mosquito: the MS-2000 bonus project';
const DESC =
  'A tiny 3D printed drone mosquito that takes off from its base, flies around a small test zone by itself, and radios back every time the MS-2000 laser hits it.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `https://nawgames.com${BASE}`,
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'The MS-2000 Mosquito Shooter and its flying mosquito target' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

// status: done | now | next
const PHASES = [
  { title: 'Brainstorm', when: 'Sep 18, 2026', status: 'done', text: 'A mosquito that really flies, so the MS-2000 has a harder target than one on a fishing line.' },
  { title: 'Requirements', when: 'Sep 18, 2026', status: 'done', text: 'First draft below. Every number has a reason. Dad approves the final list.', link: '#requirements' },
  { title: 'Pick a design', when: 'Sep 18, 2026', status: 'done', text: 'Design A, the Free Flyer: a tiny ESP32 drone that holds its own position. Design C, the Boom Flyer, is the fallback.', link: '#designs' },
  { title: 'Name it', when: 'Anytime', status: 'now', text: 'Addie names the flyer, like she named the MS-2000.' },
  { title: 'MS-2000 comes first', when: 'Until Feb 3, 2027', status: 'now', text: 'The science fair project gets finished first. This page waits in the background.', link: MS },
  { title: 'Lock the design', when: 'After the fair', status: 'next', text: 'Final requirements, budget, and the radio plan. After this, every change gets a change order.' },
  { title: 'Parts list', when: 'After the fair', status: 'next', text: 'Real parts with real sizes and prices, a backup store for each, every link opened before ordering.' },
  { title: '3D print design', when: 'After the fair', status: 'next', text: 'Mosquito shell, prop guards, hit pod, and launch pad. A 10 minute fit-check print first.' },
  { title: 'Build and teach it to fly', when: 'Spring 2027', status: 'next', text: 'Hover in place first, then a flight pattern, then the hit sensor and the radio.' },
  { title: 'MS-2000 vs the Flying Mosquito', when: 'Spring 2027', status: 'next', text: 'Can the turret hit something that flies by itself? Count the hits.' },
];

const HOW = [
  ['Press the button on the base', 'The launch pad tells the drone to go. It also tells the MS-2000 wand that a run started.'],
  ['It takes off and holds still', 'A little camera on the bottom watches the floor and a distance sensor measures height, so it can hover without a person steering.'],
  ['It flies its pattern', 'Slow loops and bobs inside a small test zone, 3 feet in front of the turret, inside a net.'],
  ['The laser tags it', 'A light sensor behind a white window on the mosquito sees the red dot.'],
  ['It radios HIT back', 'The drone tells the base, and the base sends HIT to the MS-2000 on the same radio group the wand already uses. The wand saves it as data.'],
  ['It lands on its pad', 'When the run is over, it comes down and waits for the next press.'],
];

const LESSONS = [
  ['The laser and the camera only line up at 3 feet', 'The test zone goes from 2 to 4 feet, so the dot can land about 13 mm away from where the camera aims. The hit window has to be at least 40 mm wide.', 'MS-2000'],
  ['Keep the radio the same', 'The wand already saves GO, STOP, and HIT on radio group 7. If the flyer speaks the same way, the turret code does not change.', 'MS-2000'],
  ['Measure the space before picking a part', 'A tiny drone can only carry a few grams. Weigh the hit pod on paper before designing it.', 'Dusty'],
  ['Every number needs a reason', 'Each requirement below says why it has that number.', 'Dusty'],
  ['Think about using it, not just building it', 'Where does it charge? What happens when it crashes? Who reaches the button?', 'Dusty'],
  ['Test your own design', 'The experiment should change something about the flyer, like its speed or its pattern.', 'MS-2000'],
  ['Look at a photo of the real part', 'Check the real board and holes before drawing anything, then calipers when it arrives.', 'Both'],
  ['Print a small test first', 'A 10 minute fit-check print before the long ones.', 'Dusty'],
];

const REQS = [
  ['Flies by itself during a run', 'Nobody steers it. That is the whole point of the bonus project.'],
  ['Stays in a zone about 2 ft wide, 2 ft deep, and 1.5 ft tall, centered 3 ft from the turret', 'That is where the laser and the camera line up, and it fits in the camera view.'],
  ['Hit window at least 40 mm wide, whole hit pod 5 g or less', 'It has to catch a dot that can be 13 mm off, and a tiny drone cannot carry much.'],
  ['Sends HIT on micro:bit radio group 7 within half a second', 'So the MS-2000 wand saves it with no new code on the turret.'],
  ['A base with a push button start and a launch pad', 'One press starts a run. The flyer sits on the pad between runs.'],
  ['Guards on every propeller, and it flies inside a net', 'Spinning props and kids do not mix, and the net catches crashes and stops the laser.'],
  ['At least 5 minutes of flying per charge, charged by USB', 'Enough for five 30 second runs plus setup.'],
  ['Slow enough for the turret to follow', 'The turret fires at most once a second. The top speed gets set by a first test.'],
  ['Budget', 'Dad sets it when the design is locked.'],
];

const DESIGNS = [
  {
    key: 'A',
    name: 'Free Flyer',
    picked: true,
    text: 'A palm size ESP32 drone (LiteWing) with a bottom camera and a height sensor so it can hold its place. We print a mosquito shell, prop guards, a hit pod, and a launch pad. A second ESP32 in the base talks to the drone and hands HIT to a micro:bit.',
    good: 'Really flies by itself. Small. The cheapest way to get true hands-off flight.',
    hard: 'The most code, and it needs tuning so it does not drift.',
  },
  {
    key: 'B',
    name: 'Crazyflie',
    text: 'The same idea on a Crazyflie, a tiny research drone with a flow sensor. Flight paths are written in Python on a laptop.',
    good: 'The steadiest flying and the best instructions. The smallest.',
    hard: 'Costs several times more, and a laptop has to sit at the demo.',
  },
  {
    key: 'C',
    name: 'Boom Flyer',
    fallback: true,
    text: 'The mosquito rides on the end of a light rod that spins on the base. Little motors push it around in circles and make it bob up and down. A micro:bit in the base runs everything.',
    good: 'All MakeCode, so Addie codes it. Cheap, safe, and the same speed every time.',
    hard: 'It does not really fly free, and the camera can see the rod.',
  },
  {
    key: 'D',
    name: 'micro:bit Drone',
    text: 'An Air:bit drone kit that uses a micro:bit as its brain, with a 3D printed mosquito frame.',
    good: 'Addie codes it in MakeCode and it already speaks micro:bit radio.',
    hard: 'It cannot hold its place by itself, so a person has to fly it. The biggest one.',
  },
];

const LOG = [
  ['Sep 18, 2026', 'Decision', 'Design A, the Free Flyer, picked. Design C is the fallback.'],
  ['Sep 18, 2026', 'Plan', 'Four designs compared: Free Flyer, Crazyflie, Boom Flyer, and micro:bit Drone.'],
  ['Sep 18, 2026', 'Plan', 'First requirements written, using lessons from Dusty and the MS-2000.'],
  ['Sep 18, 2026', 'Plan', 'Project started as its own project, to build after the science fair.'],
];

const DOT = {
  done: 'bg-naw-green border-naw-green',
  now: 'bg-naw-pink border-naw-pink',
  next: 'bg-naw-dark border-white/30',
};

const TAG = {
  Decision: 'bg-naw-pink/20 text-naw-pink',
  Plan: 'bg-naw-cyan/20 text-naw-cyan',
  Change: 'bg-naw-orange/20 text-naw-orange',
};

function Section({ id, title, sub, children }) {
  return (
    <section id={id} className="mt-12 scroll-mt-16">
      <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
      {sub && <p className="text-white/50 text-sm mt-1 max-w-2xl">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Chip({ href, children, primary }) {
  const cls = primary
    ? 'bg-naw-pink text-naw-dark hover:bg-naw-pink/90'
    : 'bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25';
  return (
    <a href={href} className={`${cls} px-3.5 py-2 inline-flex items-center rounded-lg text-sm font-semibold transition-colors`}>
      {children}
    </a>
  );
}

export default function FlyingMosquitoPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-400/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-8">
          <Link href={A} className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Addie&apos;s Projects
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="bg-naw-pink/20 text-naw-pink text-xs font-semibold px-2 py-0.5 rounded-full">Bonus project</span>
              <span className="bg-naw-orange/20 text-naw-orange text-xs font-semibold px-2 py-0.5 rounded-full">After the science fair</span>
              <span className="bg-naw-cyan/20 text-naw-cyan text-xs font-semibold px-2 py-0.5 rounded-full">Design A picked</span>
            </div>
            <h1 className="font-game text-3xl sm:text-4xl glow mt-4">
              <span className="bg-gradient-to-r from-lime-300 to-naw-pink bg-clip-text text-transparent">FLYING MOSQUITO</span>
            </h1>
            <div className="text-lime-300 text-sm font-bold tracking-widest mt-2">A TARGET FOR THE MS-2000</div>
            <p className="text-white text-lg sm:text-xl font-semibold mt-4 leading-snug">
              The smallest mosquito we can build that really flies. Press the button, it takes off, flies around its test zone
              by itself, and radios back every time the MS-2000 laser tags it.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <Chip href="#designs" primary>The designs</Chip>
              <Chip href="#requirements">Requirements</Chip>
              <Chip href="#lessons">Lessons we are using</Chip>
              <Chip href={MS}>The MS-2000</Chip>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="rounded-2xl border border-naw-cyan/30 bg-naw-cyan/10 p-4">
              <div className="text-naw-cyan text-xs font-semibold">The engineering goal</div>
              <div className="text-white font-semibold mt-1">Build a tiny mosquito that flies by itself and knows when it has been hit.</div>
              <div className="text-white/55 text-sm mt-1">Then find out: can the MS-2000 hit something that flies on its own?</div>
            </div>
            <div className="rounded-2xl border border-naw-green/30 bg-naw-green/10 p-4">
              <div className="text-naw-green text-xs font-semibold">Why it is a bonus</div>
              <div className="text-white/85 text-sm mt-1">
                The MS-2000 gets finished first for the St. Rose fair on Feb 3. This one gets built after, with the same
                steps: requirements, designs, pick, lock, parts, build.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="Where we are" sub="Green is done, pink is now.">
          <ol className="relative border-l-2 border-white/10 ml-3 space-y-3">
            {PHASES.map((p, i) => {
              const Wrap = p.link ? 'a' : 'div';
              return (
                <li key={p.title} className="pl-6 relative">
                  <span className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 ${DOT[p.status]}`} />
                  <Wrap
                    {...(p.link ? { href: p.link } : {})}
                    className={`block rounded-2xl border px-4 py-3 transition-colors ${
                      p.status === 'now' ? 'bg-naw-pink/10 border-naw-pink/50' : 'bg-naw-card border-white/10'
                    } ${p.status === 'done' ? 'opacity-60' : ''} ${p.link ? 'hover:border-white/30' : ''}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white/50 text-xs font-semibold">Step {i + 1} · {p.when}</span>
                      {p.status === 'now' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-pink text-naw-dark">Now</span>}
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

        <Section id="how" title="How it will work" sub="Design A, one run from start to finish.">
          <ol className="grid sm:grid-cols-2 gap-3">
            {HOW.map(([t, d], i) => (
              <li key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4 flex gap-3">
                <span className="flex-none w-7 h-7 rounded-lg bg-lime-300/20 text-lime-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block text-white font-bold">{t}</span>
                  <span className="block text-white/55 text-sm mt-0.5">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="designs" title="The designs" sub="Four ways to build a flying target. A is picked. C is the backup, like Design B was for the MS-2000.">
          <div className="grid sm:grid-cols-2 gap-4">
            {DESIGNS.map((d) => (
              <div
                key={d.key}
                className={`rounded-2xl border p-5 ${
                  d.picked ? 'bg-naw-pink/10 border-naw-pink/60' : d.fallback ? 'bg-naw-card border-naw-cyan/40' : 'bg-naw-card border-white/10 opacity-75'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-game text-xs text-white/60">Design {d.key}</span>
                  {d.picked && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-pink text-naw-dark">Picked</span>}
                  {d.fallback && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-cyan/20 text-naw-cyan">Backup</span>}
                </div>
                <h3 className="text-white font-bold text-lg mt-1">{d.name}</h3>
                <p className="text-white/65 text-sm mt-1">{d.text}</p>
                <div className="mt-3 text-sm">
                  <span className="text-naw-green font-semibold">Good: </span>
                  <span className="text-white/60">{d.good}</span>
                </div>
                <div className="mt-1 text-sm">
                  <span className="text-naw-orange font-semibold">Hard: </span>
                  <span className="text-white/60">{d.hard}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="requirements" title="Requirements (first draft)" sub="What it must do, with a number and a reason for each. These get final when the design is locked.">
          <ol className="space-y-2">
            {REQS.map(([r, why], i) => (
              <li key={r} className="bg-naw-card rounded-2xl border border-white/10 px-4 py-3 flex gap-3">
                <span className="flex-none w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <span>
                  <span className="block text-white text-sm font-semibold">{r}</span>
                  <span className="block text-white/50 text-xs mt-0.5">Why: {why}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="lessons" title="Lessons we are using" sub="What Dusty and the MS-2000 taught us, used before anything gets built.">
          <div className="grid sm:grid-cols-2 gap-3">
            {LESSONS.map(([t, d, from]) => (
              <div key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60">{from}</span>
                </div>
                <div className="text-white font-bold mt-2">{t}</div>
                <div className="text-white/55 text-sm mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="history" title="Project history" sub="One line for every decision or change, newest first.">
          <div className="space-y-2">
            {LOG.map(([date, tag, text], i) => (
              <div key={i} className="flex flex-wrap sm:flex-nowrap items-start gap-2 sm:gap-3 bg-naw-card rounded-xl border border-white/10 px-4 py-3">
                <span className="text-white/45 text-xs font-semibold w-24 flex-none mt-0.5">{date}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-none ${TAG[tag]}`}>{tag}</span>
                <span className="text-white/75 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

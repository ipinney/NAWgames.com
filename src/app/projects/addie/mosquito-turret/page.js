import Link from 'next/link';
import { A, BASE, CAD, PLAN, PARTS_PDF, GUIDE, meta, Nav, Back, Btn, Section, Title } from './ui';
import { FAIR } from './fair';
import DueDates from './DueDates';

export const metadata = meta(
  "MS-2000 Mosquito Shooter: Addie's science fair project",
  'A laser turret that learns a fake mosquito, follows it, and proves every hit with a sensor. Parts list, 3D print files, build plan, and the science behind it.',
  BASE
);

// status: done | now | next
const PHASES = [
  { title: 'Brainstorm', when: 'Sep 15', status: 'done', text: 'Air cannon, vacuum, and light beam ideas. The family picked lasers.', link: `${PLAN}#requirements` },
  { title: 'Requirements', when: 'Sep 15', status: 'done', text: 'Laser, sound effects, a trainable mosquito on a fishing line, proven hits, and data it saves by itself.', link: `${PLAN}#requirements` },
  { title: 'Pick a design', when: 'Sep 15', status: 'done', text: 'Addie picked Design A, the Pan and Tilt Camera Turret.', link: `${PLAN}#pick` },
  { title: 'Lock in the design', when: 'Sep 16', status: 'done', text: 'Design A locked. Still to do by hand: why Design A and a labeled drawing, both in the journal. Ask Miss Taggart about laser rules.', link: `${PLAN}#design` },
  { title: '3D print design', when: 'Sep 16', status: 'done', text: '12 printed parts on five print plates, about 10 hours and 320 g of PLA. Checked with calipers when the parts arrive.', link: `${BASE}/build/batches` },
  { title: 'Order the parts', when: 'By Sep 30', status: 'now', text: 'About $192 from DFRobot and DigiKey, plus batteries and craft supplies. Start the journal now.', link: `${BASE}/build#shopping` },
  { title: 'Print and build', when: 'Oct 1 to Nov 13', status: 'next', text: 'Mosquito and wand first, then the pan and tilt head, then the backdrop and pendulum, then the code and sounds.', link: `${BASE}/build` },
  { title: 'Teach the camera and practice', when: 'Nov 14 to Dec 11', status: 'next', text: 'Train the camera, pick the hit threshold, and make sure the data saves. The question (Nov 18), research (Dec 2), and hypothesis (Dec 9) are due at school in these weeks.', link: `${FAIR}#question` },
  { title: 'Experiments', when: 'Dec 12 to Jan 15', status: 'next', text: 'Speed, distance, and light. 45 runs, one test per day, over winter break. Due Jan 19, so a few days are left for redos.', link: `${FAIR}#experiments` },
  { title: 'Data and conclusion', when: 'Jan 16 to Jan 25', status: 'next', text: 'Averages, three bar graphs, and the conclusion. Due Jan 25.', link: `${FAIR}#results` },
  { title: 'Board and demo', when: 'Jan 26 to Feb 1', status: 'next', text: 'Trifold board, finished journal, and the 30-second demo. Due Feb 1. Exhibition Feb 3 at 2:00 PM.', link: `${FAIR}#final` },
  { title: 'Archdiocesan fair', when: 'Feb 25', status: 'next', text: 'If the MS-2000 is picked as a St. Rose winner.' },
];

const RULES = [
  ['Never look into the laser', 'Even a weak laser is not for eyes. Point it only at the backdrop and the mosquito.'],
  ['The arm switch is off until go time', 'The laser cannot fire unless the red arm switch is on. A grown-up turns it on.'],
  ['The journal is cursive, by hand', 'Write in it every day you work on the project. It gets its own grade.'],
  ['Addie writes it', 'The research, question, hypothesis, and conclusion are in her own words.'],
  ['Every run counts', 'Five runs for every setting. Only redo a run if something broke, and write down why.'],
  ['One test per day', 'Same room, same batteries, same person holding the line. Take a photo of each setup.'],
];

const PAGES = [
  {
    href: FAIR,
    title: 'Fair guide',
    text: 'The six graded parts, what each one needs, the journal, the board, the judges, and the rubric.',
    color: 'pink',
  },
  {
    href: `${BASE}/make`,
    title: 'Build your own',
    text: 'For any kid: start with a micro:bit hit detector, then a camera tracker, then the full turret.',
    color: 'pink',
  },
  {
    href: `${BASE}/learn`,
    title: 'Learn the science',
    text: 'Mosquitoes, lasers, how a camera learns, servos, sensors, pendulums, and how to run a fair test.',
    color: 'pink',
  },
  {
    href: `${BASE}/build`,
    title: 'Build the MS-2000',
    text: 'Everything to buy, the 3D printed parts, the 3D models, and the build steps.',
    color: 'pink',
  },
  {
    href: GUIDE,
    title: 'Build guide',
    text: 'Step by step: every part, wiring maps, diagrams, and the MakeCode programs.',
    color: 'pink',
  },
  {
    href: PLAN,
    title: 'The full plan',
    text: 'The design choices, the lethality math, the experiment rules, and the demo script.',
  },
  {
    href: PARTS_PDF,
    title: 'Parts list (PDF)',
    text: 'Every part with a primary and a backup source, prices, and links. Print it for the order.',
  },
];

const DOT = {
  done: 'bg-naw-green border-naw-green',
  now: 'bg-naw-pink border-naw-pink',
  next: 'bg-naw-dark border-white/30',
};

export default function MosquitoTurretPage() {
  return (
    <div className="min-h-screen">
      <Nav current="overview" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-pink/15 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-8">
          <Back href={A}>Addie&apos;s Projects</Back>
          <div className="grid md:grid-cols-2 gap-6 items-center mt-6">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-naw-pink/20 text-naw-pink text-xs font-semibold px-2 py-0.5 rounded-full">Science Fair</span>
                <span className="bg-naw-orange/20 text-naw-orange text-xs font-semibold px-2 py-0.5 rounded-full">3rd grade</span>
                <span className="bg-naw-cyan/20 text-naw-cyan text-xs font-semibold px-2 py-0.5 rounded-full">Due Feb 1, 2027</span>
              </div>
              <div className="mt-4">
                <Title>MS-2000</Title>
              </div>
              <div className="text-lime-300 text-sm font-bold tracking-widest mt-2">MOSQUITO SHOOTER</div>
              <p className="text-white text-lg sm:text-xl font-semibold mt-4 leading-snug">
                My invention: a laser turret that learns what a mosquito looks like, follows it, and tags it with a pew. The
                mosquito&apos;s eyes flash on every hit, and every hit is saved as data.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <Btn href={FAIR} primary>Fair guide</Btn>
                <Btn href={`${BASE}/build`}>Build it</Btn>
                <Btn href={`${BASE}/make`}>Build your own</Btn>
                <Btn href={`${CAD}/ms2000-turret-3d.html`}>See it in 3D</Btn>
              </div>
            </div>
            <a
              href={`${CAD}/ms2000-turret-3d.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-white/10 bg-[#0d1b2e]"
            >
              <img src="/projects/addie/ms2000-hero.png" alt="3D model of the MS-2000 turret" width={720} height={630} className="w-full h-auto" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="rounded-2xl border border-naw-cyan/30 bg-naw-cyan/10 p-4">
              <div className="text-naw-cyan text-xs font-semibold">The big question</div>
              <div className="text-white font-semibold mt-1">Does a faster mosquito get hit less?</div>
              <div className="text-white/55 text-sm mt-1">Also tested: how far away it is, and how bright the room is.</div>
            </div>
            <div className="rounded-2xl border border-naw-green/30 bg-naw-green/10 p-4">
              <div className="text-naw-green text-xs font-semibold">The big idea</div>
              <div className="text-white/85 text-sm mt-1">
                Scientists built a real laser fence that zaps mosquitoes. Killing one takes about 14 watts. The MS-2000 uses a
                safe 0.001 watt laser, 14,000 times weaker, and proves each hit with a light sensor inside the mosquito.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="School due dates" sub="St. Rose 3rd grade. Six parts, each graded on its own. The orange one is next.">
          <DueDates compact />
        </Section>

        <Section title="Where we are" sub="The build plan, fitted around the school dates. Green is done, pink is now.">
          <ol className="relative border-l-2 border-white/10 ml-3 space-y-3">
            {PHASES.map((p, i) => {
              const Wrap = p.link ? 'a' : 'div';
              const ext = p.link && !p.link.startsWith(BASE);
              return (
                <li key={p.title} className="pl-6 relative">
                  <span className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 ${DOT[p.status]}`} />
                  <Wrap
                    {...(p.link ? { href: p.link } : {})}
                    {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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

        <Section title="Rules to remember">
          <div className="grid sm:grid-cols-2 gap-3">
            {RULES.map(([t, d]) => (
              <div key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/55 text-sm mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Project pages">
          <div className="grid sm:grid-cols-2 gap-4">
            {PAGES.map((s) => {
              const internal = s.href.startsWith(BASE);
              const cls = `group bg-naw-card rounded-2xl border p-5 transition-colors ${
                s.color ? 'border-naw-pink/30 hover:border-naw-pink/60' : 'border-naw-cyan/20 hover:border-naw-cyan/40'
              }`;
              const inner = (
                <>
                  <h3 className={`text-white font-bold text-lg transition-colors ${s.color ? 'group-hover:text-naw-pink' : 'group-hover:text-naw-cyan'}`}>{s.title}</h3>
                  <p className="text-white/55 text-sm mt-1">{s.text}</p>
                </>
              );
              return internal ? (
                <Link key={s.href} href={s.href} className={cls}>{inner}</Link>
              ) : (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              );
            })}
          </div>
        </Section>

        <Section title="The turret">
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href={`${BASE}/build`}
              className="group bg-naw-card rounded-2xl border border-naw-pink/30 overflow-hidden hover:border-naw-pink/60 transition-colors"
            >
              <img src="/projects/addie/ms2000-cad/plates/ms2000-plate-3-turret-and-wand.png" alt="Print plate with the turret head, turntable, and wand" className="w-full h-44 object-cover bg-[#0d1b2e]" />
              <div className="p-5">
                <h3 className="text-white font-bold text-lg group-hover:text-naw-pink transition-colors">Build the MS-2000</h3>
                <p className="text-white/55 text-sm mt-1">
                  The parts to buy, the 12 printed parts, the print plan, and the build steps. Built in October and November.
                </p>
              </div>
            </Link>
            <a
              href={`${CAD}/ms2000-3d.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-naw-card rounded-2xl border border-naw-cyan/20 p-5 hover:border-naw-cyan/40 transition-colors flex flex-col justify-center"
            >
              <h3 className="text-white font-bold text-lg group-hover:text-naw-cyan transition-colors">See the whole setup in 3D</h3>
              <p className="text-white/55 text-sm mt-1">
                The turret, the mosquito on its fishing line, the wand, the pendulum, and the backdrop. Spin it and use it to
                draw the labeled sketch for the board.
              </p>
              <span className="mt-4 text-naw-cyan text-sm font-semibold">Open the 3D model</span>
            </a>
          </div>
        </Section>
      </div>
    </div>
  );
}

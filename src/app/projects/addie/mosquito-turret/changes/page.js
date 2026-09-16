import { BASE, GUIDE, meta, Nav, Back, Btn, Section, Title } from '../ui';
import { LOCKED, MOCS, LOG, LESSONS, NEXT } from './data';

export const metadata = meta(
  'MS-2000: changing the plan, and what we learned',
  'How engineers change a locked design without breaking it, the three change orders on the MS-2000, the project history, and lessons for the next project.',
  `${BASE}/changes`
);

const WHY = [
  ['Everything is connected', 'Moving the laser aim from 5 feet to 3 feet changed a 3D part, five print plates, the build guide, the tests, and the fair board.'],
  ['You remember why', 'At the fair, a judge may ask why there is no light test. The change order has the answer, months later.'],
  ['Everyone has the same plan', 'The parts list, 3D model, print files, build guide, and web pages all change together, so nobody builds from an old page.'],
  ['Surprises show up early', 'Checking on paper found that the big backdrop would not fit the fair table. Finding that in the Parish Hall would have been too late.'],
];

const STEPS = [
  ['Say what you want and why', 'One or two sentences. "The fair table is 3 feet wide, so the laser should be aimed for 3 feet, not 5."'],
  ['Check what it touches', 'Parts, wiring, space, safety, cost, the schedule, and the experiment. Measure and do the math. Do not guess.'],
  ['Compare the choices', 'Write down at least two ways to solve it, and why you picked one.'],
  ['Get a yes', 'Dad approves it. Now it is part of the locked design.'],
  ['Update everything and test it', '3D model, print files, parts list, build guide, and web pages. Then write the tests that prove it works.'],
];

const TAG = {
  Change: 'bg-naw-pink/20 text-naw-pink',
  Decision: 'bg-naw-cyan/20 text-naw-cyan',
  Design: 'bg-white/10 text-white/80',
  Fix: 'bg-red-500/20 text-red-300',
  Plan: 'bg-lime-400/15 text-lime-300',
};

const STATUS = {
  Draft: 'bg-white/10 text-white/70',
  Approved: 'bg-lime-400/15 text-lime-300',
  Done: 'bg-naw-cyan/20 text-naw-cyan',
};

const nextId = `MOC-${String(MOCS.length + 1).padStart(3, '0')}`;

function Cards({ items, accent }) {
  const border = accent ? 'border-naw-pink/30' : 'border-naw-cyan/20';
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map(([t, d]) => (
        <div key={t} className={`bg-naw-card rounded-2xl border ${border} p-4`}>
          <div className="text-white font-bold">{t}</div>
          <div className="text-white/60 text-sm mt-1 leading-relaxed">{d}</div>
        </div>
      ))}
    </div>
  );
}

function Bullets({ items }) {
  return (
    <ul className="space-y-1.5 mt-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2 text-sm text-white/80 leading-relaxed">
          <span className="flex-none w-1.5 h-1.5 rounded-full bg-white/40 mt-2" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Moc({ m }) {
  return (
    <article id={m.id.toLowerCase()} className="scroll-mt-16 bg-naw-card rounded-2xl border border-naw-pink/30 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="bg-naw-pink text-naw-dark text-xs font-bold px-2 py-0.5 rounded-full">{m.id}</span>
        <span className={`${STATUS[m.status]} text-xs font-semibold px-2 py-0.5 rounded-full`}>{m.status}</span>
        <span className="text-white/45 text-xs">{m.date} &middot; approved by {m.approver}</span>
      </div>
      <h3 className="text-white text-lg font-bold mt-2 leading-snug">{m.title}</h3>

      <div className="grid sm:grid-cols-2 gap-3 mt-4 [&>*]:min-w-0">
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="text-white/45 text-xs font-semibold">Before</div>
          <Bullets items={m.was} />
        </div>
        <div className="rounded-xl bg-naw-pink/5 border border-naw-pink/25 p-3">
          <div className="text-naw-pink text-xs font-semibold">After</div>
          <Bullets items={m.now} />
        </div>
      </div>

      <h4 className="text-white font-bold mt-5">Why</h4>
      <p className="text-white/70 text-sm mt-1 leading-relaxed">{m.why}</p>

      {m.options.length > 0 && (
        <>
          <h4 className="text-white font-bold mt-5">Choices we compared</h4>
          <div className="mt-2 space-y-2">
            {m.options.map(([c, r, picked]) => (
              <div key={c} className={`rounded-xl border p-3 text-sm ${picked ? 'border-lime-300/40 bg-lime-400/10' : 'border-white/10 bg-white/5'}`}>
                <span className={picked ? 'text-white font-semibold' : 'text-white/80'}>{c}</span>
                <span className={`block mt-0.5 text-xs ${picked ? 'text-lime-300 font-semibold' : 'text-white/50'}`}>{r}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {m.found.length > 0 && (
        <>
          <h4 className="text-white font-bold mt-5">What checking it found</h4>
          <div className="mt-2">
            <Cards items={m.found} accent />
          </div>
        </>
      )}

      <h4 className="text-white font-bold mt-5">What had to be updated</h4>
      <div className="flex flex-wrap gap-2 mt-2">
        {m.touched.map((t) => (
          <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
        ))}
      </div>

      <h4 className="text-white font-bold mt-5">Tests that prove it works</h4>
      <p className="text-white/45 text-xs mt-0.5">Run these when the parts arrive and the MS-2000 is built.</p>
      <ul className="space-y-1.5 mt-2">
        {m.tests.map((t) => (
          <li key={t} className="flex gap-2 text-sm text-white/80 leading-relaxed">
            <span className="flex-none w-4 h-4 rounded border border-white/30 mt-0.5" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        {m.link && <Btn href={m.link.href} small>{m.link.label}</Btn>}
        {m.commits.length > 0 && <span className="text-white/35 text-xs font-mono">commit {m.commits.join(', ')}</span>}
      </div>
    </article>
  );
}

export default function ChangesPage() {
  return (
    <div className="min-h-screen">
      <Nav current="changes" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-pink/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-8">
          <Back href={BASE}>MS-2000</Back>
          <div className="mt-6">
            <Title size="text-xl sm:text-2xl">CHANGING THE PLAN</Title>
          </div>
          <p className="text-white text-lg font-semibold mt-4 leading-snug">
            Engineers change their designs all the time. The trick is changing one thing without breaking something else.
          </p>
          <p className="text-white/55 text-sm mt-2 leading-relaxed max-w-2xl">
            This page explains how real engineers handle a change, shows every change made to the MS-2000 since the design
            was locked on {LOCKED}, keeps the history of every decision, and saves what we learned for the next project.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {MOCS.map((m) => (
              <a key={m.id} href={`#${m.id.toLowerCase()}`} className="bg-naw-pink/15 border border-naw-pink/40 text-naw-pink hover:bg-naw-pink/25 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                {m.id}
              </a>
            ))}
            <a href="#history" className="bg-white/5 border border-white/15 text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">History</a>
            <a href="#lessons" className="bg-white/5 border border-white/15 text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">Lessons</a>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section title="What is Management of Change?">
          <div className="bg-naw-card rounded-2xl border border-naw-pink/30 p-5">
            <p className="text-white leading-relaxed">
              <b>Management of Change</b>, or <b>MOC</b>, is a simple rule: once a design is decided, you do not just swap
              a part. You write down the change, check everything it touches, get a yes from the person in charge, and then
              update every plan and drawing. Each one gets a number, like MOC-001, and is called a change order.
            </p>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              Think of a birthday party. Moving it from the backyard to the park sounds easy. But now the invitations have
              the wrong address, the cake needs a cooler, and the pi&ntilde;ata needs a tree. A good planner thinks it all
              through before telling anyone. Factories, refineries, and airplane makers use MOC because a small change they
              did not think through can cause a big problem.
            </p>
          </div>
        </Section>

        <Section title="Why it matters">
          <Cards items={WHY} />
        </Section>

        <Section title="The five steps" sub="Use these for any change after the design is locked. A loose screw or a typo does not need one. A different part, size, test, or aim does.">
          <ol className="space-y-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4 bg-naw-card rounded-2xl border border-white/10 p-4">
                <span className="flex-none w-8 h-8 rounded-full bg-naw-pink text-naw-dark font-bold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block text-white font-bold">{t}</span>
                  <span className="block text-white/60 text-sm mt-0.5 leading-relaxed">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-2xl border border-naw-pink/30 bg-naw-pink/10 p-4 text-sm text-white/80 leading-relaxed">
            <b className="text-naw-pink">Where it fits in our process:</b> brainstorm, requirements, pick a design,{' '}
            <b>lock the design</b>, order the parts, build. The MS-2000 design was locked on {LOCKED}. Everything after
            that goes through these five steps before anything is ordered or printed.
          </div>
        </Section>

        <Section title="Our change orders" sub={`${MOCS.length} changes since the lock, newest last. The next one will be ${nextId}.`}>
          <div className="space-y-5">
            {MOCS.map((m) => (
              <Moc key={m.id} m={m} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <Btn href={GUIDE} primary>Build guide</Btn>
            <Btn href={`${BASE}/build`}>Build page</Btn>
          </div>
        </Section>

        <Section id="history" title="Project history" sub="Every decision and change, newest first. Add a line whenever the plan changes.">
          <div className="bg-naw-card rounded-2xl border border-naw-cyan/20 divide-y divide-white/5">
            {LOG.map(([d, tag, text, commit], i) => (
              <div key={i} className="grid grid-cols-[3.5rem_1fr] gap-3 px-4 py-3">
                <span className="text-white/55 text-sm tabular-nums">{d}</span>
                <span className="text-sm leading-relaxed min-w-0">
                  <span className={`${TAG[tag]} text-xs font-semibold px-2 py-0.5 rounded-full mr-2`}>{tag}</span>
                  <span className="text-white/80">{text}</span>
                  {commit && <span className="block text-white/30 text-xs font-mono mt-0.5">{commit}</span>}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="lessons" title="Lessons learned so far" sub="What we would do the same way, or differently, next time.">
          <Cards items={LESSONS} />
        </Section>

        <Section title="Checklist for the next project">
          <ol className="bg-naw-card rounded-2xl border border-naw-pink/30 p-5 space-y-2">
            {NEXT.map((t, i) => (
              <li key={t} className="flex gap-3 text-sm text-white/85">
                <span className="flex-none w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="pt-0.5">{t}</span>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}

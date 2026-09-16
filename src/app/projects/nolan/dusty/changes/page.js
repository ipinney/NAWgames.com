import Link from 'next/link';
import { Nav } from '../ui';

const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
const TITLE = 'Dusty: changing the plan, and what we learned';
const DESC = 'How engineers change a design without breaking it, the change we made to Dusty, the project history, and lessons for the next project.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://nawgames.com/projects/nolan/dusty/changes',
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

const WHY = [
  ['Everything is connected', 'Change one part and it can bump into three others. A bigger battery can block a screw, add weight, and change how fast the robot drives.'],
  ['You remember why', 'Weeks later, nobody remembers why a part is the way it is. The change order says what changed, why, and who said yes.'],
  ['Everyone has the same plan', 'The parts list, the 3D model, the print files and the build guide all get updated together, so nobody builds from an old page.'],
  ['Surprises show up early', 'Checking a change on paper costs minutes. Finding the problem after printing costs hours and plastic.'],
];

const STEPS = [
  ['Say what you want and why', 'Write one or two sentences. "Swapping AA batteries is hard and a set only lasts 90 minutes. I want a cheap way to charge Dusty with a USB-C cable instead."'],
  ['Check what it touches', 'Space, wiring, weight, safety, cost, the schedule, and the experiment. Measure, do not guess.'],
  ['Pick the parts', 'Find real parts with real sizes and prices from stores you can check. Write down a backup.'],
  ['Get a yes, then lock it', 'The person in charge approves it. Now the design is locked. Any new change starts a new change order.'],
  ['Update everything and test it', 'Model, print files, parts list, build steps. Then list the tests that prove the change works.'],
];

const FOUND = [
  ['The power bank did not fit', 'Every bank we found was at least 90 mm long, and the space for the batteries was only 62 mm. We turned the bank sideways and gave it its own printed sleeve.'],
  ['The plug stuck out too far', 'A straight USB plug made Dusty wider than 5 inches. A small 90 degree adapter turns the cable so it runs along the side.'],
  ['The sleeve could not print with the base', 'The base prints upside down, so a tall sleeve on top would hang in the air. The sleeve became its own part that screws on.'],
  ['The charge lights got hidden', 'The circuit board sits right over the lights on the power bank. Now we charge before every session, or slide the bank out to check.'],
  ['Dusty got heavier', 'The sleeve and the cable add about 50 grams. Our 300 gram limit had no reason behind it, so Dad raised it to 400 grams. The real safety test is whether Dusty still stops at the edge 20 times out of 20.'],
];

const TOUCHED = ['3D model and all 19 print files', 'Parts list', 'Build guide step 4', 'Screw count (19 to 23)', 'Robot height (65 to 75 mm)', 'Weight limit', 'Test plan'];

// Newest first. Add a line every time something about the plan changes.
const LOG = [
  ['Sep 16', 'Plan', 'Parts ordered and arriving in separate boxes. Added the Inventory page: a check-in list for every part, what to do if one is wrong, and how to keep them organized.'],
  ['Sep 15', 'Change', 'MOC-002: Button B changes from an expanding spiral to Spot Clean, which sweeps a 1 foot square in front of Dusty in rows. Experiment B becomes a spill race: Spot Clean against random bounce on the same 5 g spill. Code and plan only, no parts.'],
  ['Sep 15', 'Change', 'Weight limit raised from 300 g to 400 g (change order MOC-001, Rev D.1).'],
  ['Sep 15', 'Change', 'MOC-001: USB-C power bank in a printed sleeve replaces the 4 AA battery pack. Deck 10.5 mm higher, two posts instead of four, keeper bar added. Print total goes from 77 g to 101 g.'],
  ['Sep 15', 'Design', 'Crumb tray Rev B: only the front edge touches the table, and the bottom slopes up toward the back so it does not drag.'],
  ['Sep 15', 'Plan', 'Five print batches, each followed by the build steps it unlocks. A 10 minute fit-check print goes first.'],
  ['Sep 15', 'Fix', 'The 3D model had the micro:bit standing up. The real one lies flat in its connector. Model and guide corrected.'],
  ['Sep 15', 'Decision', 'Kept the design as is for the speed experiment. No swappable sensor arms.'],
  ['Sep 15', 'Decision', 'Brush: pipe cleaners on a printed roller, turned by printed gears, with a plain on/off switch.'],
  ['Sep 15', 'Change', 'Chassis switched from foam board to a fully 3D printed design.'],
  ['Sep 14', 'Decision', 'Spot Clean mode instead of a crumb sensor. The sensor did not fit the parts we already had.'],
  ['Sep 14', 'Plan', 'Parts list checked link by link. Two stores turned out to be dead ends and were replaced.'],
  ['Sep 14', 'Decision', 'The robot is named Dusty.'],
  ['Sep 14', 'Decision', 'Picked the crumb-sweeping robot with cliff detection from a list of cleaning robot ideas.'],
];

const LESSONS = [
  ['Measure the space before picking a part', 'We picked a power bank before checking the room it had. A two-minute check with the 3D model would have shown it could not go lengthwise.'],
  ['Every number needs a reason', 'The 300 gram limit was a guess. When we needed to change it, there was nothing behind it. Write down why each limit exists.'],
  ['Check sizes from two places', 'Anker says the bank is 22 mm thick. The store says 0.9 inches, which is almost 23 mm. When two sources disagree, design for the bigger one.'],
  ['Think about using it, not just building it', 'Where will you plug in the charger? Can you reach the button? Can you see the lights? Those questions found real problems.'],
  ['Check the real part against the model', 'The micro:bit was drawn standing up. Looking at a photo of the real part caught it before anything was printed.'],
  ['Print a small test first', 'A 10 minute fit-check print tells you if the holes come out the right size before a 90 minute print.'],
  ['Check links before ordering', 'Two stores on the first parts list could not take orders. Opening every link first saved a wasted order.'],
  ['Decide what the experiment needs early', 'The speed test needs steady power. That turned out to be a good reason for the power bank, not just an easier way to charge.'],
];

const NEXT = [
  'Write the goal and the big question on one page before picking parts.',
  'Give every requirement a number and a reason.',
  'Make a 3D model and check that every part fits before ordering.',
  'Order everything in one go, one order per store.',
  'Print or build a small test piece first.',
  'Lock the design, then use a change order for anything after that.',
  'Keep this history log up to date: one line for each decision or change.',
  'Leave empty weekends at the end for surprises.',
];

function Section({ title, sub, children }) {
  return (
    <section className="mt-12">
      <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
      {sub && <p className="text-white/50 text-sm mt-1 max-w-2xl">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Cards({ items, accent = 'cyan' }) {
  const border = accent === 'orange' ? 'border-naw-orange/30' : 'border-naw-cyan/20';
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

const TAG = {
  Change: 'bg-naw-orange/20 text-naw-orange',
  Decision: 'bg-naw-cyan/20 text-naw-cyan',
  Design: 'bg-white/10 text-white/80',
  Fix: 'bg-red-500/20 text-red-300',
  Plan: 'bg-green-500/15 text-green-300',
};

export default function DustyChangesPage() {
  return (
    <div className="min-h-screen">
      <Nav current="changes" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-cyan/15 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10">
          <Link href="/projects/nolan/dusty" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dusty
          </Link>
          <h1 className="font-game text-xl sm:text-2xl glow mt-6">
            <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">CHANGING THE PLAN</span>
          </h1>
          <p className="text-white text-lg font-semibold mt-4 leading-snug">
            Engineers change their designs all the time. The trick is changing one thing without breaking something else.
          </p>
          <p className="text-white/55 text-sm mt-2 leading-relaxed max-w-2xl">
            This page explains how real engineers handle a change, shows the change we made to Dusty, keeps the history of
            every decision, and saves what we learned for the next project.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section title="What is Management of Change?">
          <div className="bg-naw-card rounded-2xl border border-naw-cyan/30 p-5">
            <p className="text-white leading-relaxed">
              <b>Management of Change</b>, or <b>MOC</b>, is a simple rule: once a design is decided, you do not just swap
              a part. You write down the change, check everything it touches, get a yes from the person in charge, and then
              update every plan and drawing.
            </p>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              Think of a recipe. Swapping sugar for honey sounds easy, but honey is wet, so now the flour is wrong, the oven
              time is wrong, and the cookies spread. A good cook thinks it through before pouring. Factories, refineries and
              airplane makers use MOC because a small change they did not think through can cause a big problem.
            </p>
          </div>
        </Section>

        <Section title="Why it matters">
          <Cards items={WHY} />
        </Section>

        <Section title="The five steps" sub="Use these for any change after the design is locked. A loose screw or a typo does not need one. A different part, size, power source or plan does.">
          <ol className="space-y-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4 bg-naw-card rounded-2xl border border-white/10 p-4">
                <span className="flex-none w-8 h-8 rounded-full bg-naw-orange text-naw-dark font-bold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block text-white font-bold">{t}</span>
                  <span className="block text-white/60 text-sm mt-0.5 leading-relaxed">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-2xl border border-naw-orange/30 bg-naw-orange/10 p-4 text-sm text-white/80 leading-relaxed">
            <b className="text-naw-orange">Where it fits in our process:</b> pick the idea, design it, <b>lock the design</b>,
            order the parts, build. After the lock, every change goes through these five steps before anything is ordered or
            printed.
          </div>
        </Section>

        <Section title="Our example: change order MOC-001" sub="Sep 15, 2026. Replace the 4 AA battery pack with a USB-C power bank.">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">The problem</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Taking batteries in and out of Dusty was hard, and one set of AA batteries only lasts about 90 minutes. We needed a cheap, long-term way to charge quickly.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">The idea</div>
              <div className="text-white text-sm mt-1 leading-relaxed">A power bank that stays inside and charges with a phone charger.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">A bonus</div>
              <div className="text-white text-sm mt-1 leading-relaxed">It gives a steady 5 volts, so batteries running down cannot mess up the speed test.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Options we compared</h3>
          <p className="text-white/60 text-sm mt-1 leading-relaxed">
            Regular AA batteries, rechargeable AA batteries, AA batteries with their own USB-C plug, a bare lithium battery
            with a charging board, and a store-bought power bank. Only the power bank charges without taking anything out,
            and it is sealed and made safe by the company that builds it. It cost about $24.
          </p>
          <h3 className="text-white font-bold mt-6">What checking it found</h3>
          <p className="text-white/50 text-sm mt-1">Each of these would have been a nasty surprise on build day.</p>
          <div className="mt-3">
            <Cards items={FOUND} accent="orange" />
          </div>
          <h3 className="text-white font-bold mt-6">What had to be updated</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {TOUCHED.map((t) => (
              <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-4 leading-relaxed">
            The change order went through four versions (A, B, C and D) as we learned more, then Dad approved and locked it.
            The tests that prove it works: the bank fits, it stays on while driving, a stalled wheel does not reset the
            micro:bit, it runs longer than 20 minutes, Dusty still stops at the edge 20 out of 20 times, and it weighs under
            400 grams.
          </p>
          <div className="mt-4">
            <Link href="/projects/nolan/dusty/build" className="bg-naw-orange text-naw-dark hover:bg-naw-orange/90 inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors">
              See the new design
            </Link>
          </div>
        </Section>

        <Section title="Project history" sub="Every decision and change, newest first. Add a line whenever the plan changes.">
          <div className="bg-naw-card rounded-2xl border border-naw-cyan/20 divide-y divide-white/5">
            {LOG.map(([d, tag, text], i) => (
              <div key={i} className="grid grid-cols-[4rem_1fr] gap-3 px-4 py-3">
                <span className="text-white/55 text-sm tabular-nums">{d}</span>
                <span className="text-sm leading-relaxed">
                  <span className={`${TAG[tag]} text-xs font-semibold px-2 py-0.5 rounded-full mr-2`}>{tag}</span>
                  <span className="text-white/80">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Lessons learned" sub="What we would do the same way, or differently, next time.">
          <Cards items={LESSONS} />
        </Section>

        <Section title="Checklist for the next project">
          <ol className="bg-naw-card rounded-2xl border border-naw-orange/30 p-5 space-y-2">
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

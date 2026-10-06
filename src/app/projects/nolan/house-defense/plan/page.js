import Link from 'next/link';
import { Nav, Hero, Section, Cards, meta, BASE } from '../ui';

export const metadata = meta(
  'House Defense: how we run it',
  'The gates, the change order process, and the lessons from Dusty turned into a checklist for each gate.',
  `${BASE}/plan`
);

const HOW = [
  ['Gates, not due dates', 'A gate is a checkpoint with a pass mark. We do not move on until the pass mark is met and Dad says yes. No rushing a gate to hit a date.'],
  ['One log for everything', 'Every decision, change, fix and test result gets one line in the log the day it happens. Started on day one, not filled in later.'],
  ['Lock, then change orders', 'Before G1 we can change anything. After the design is locked at G1, every change goes through a change order (MOC).'],
  ['Every file has a revision', 'File names carry the revision, like defense-box-revA2.stl. When a new revision comes out, the old file is deleted so nobody builds from it.'],
];

const MOC = [
  ['Say what you want and why', 'One or two sentences. What is wrong now and what you want instead.'],
  ['Check what it touches', 'Space, wiring, weight, power, water, safety, cost, the schedule and the field test. Measure, do not guess.'],
  ['Pick the parts', 'Real parts with real sizes and prices from stores you can check. Write down a backup.'],
  ['Get a yes, then lock it', 'Dad approves it. It gets the next number: MOC-001, MOC-002 and so on.'],
  ['Update everything and test it', 'Model, print files, parts list, build steps and this site, all in the same sitting. Then the tests that prove it works.'],
];

// Lessons from Dusty, each placed at the gate where it gets checked.
const CHECKS = [
  ['G0 Scope', [
    ['Every number needs a reason', 'Dusty: the 300 g limit was a guess and had nothing behind it when we needed to change it.'],
    ['Decide what the test needs early', 'Dusty: the speed test needed steady power, which decided the battery. Here: the field test needs a count of visits before we build.'],
    ['Name things so they never flip', 'Dusty: left and right swapped depending on where you stood. Name each spot in the yard and each side of the box once and keep it.'],
  ]],
  ['G1 Design lock', [
    ['Measure the space before picking a part', 'Dusty: the power bank did not fit lengthwise. A two-minute check in the model would have shown it.'],
    ['Model the cables and plugs too', 'Dusty: the motor plug hit the base because the model only had the motor.'],
    ['Check sizes from two places', 'Dusty: Anker and the store disagreed on the bank thickness. Design for the bigger one.'],
    ['Check the real part against the model', 'Dusty: the micro:bit was drawn standing up. A photo of the real part caught it.'],
    ['Think about using it, not just building it', 'Where does it charge? Can you reach the switch? Can you see the lights? Outside, also: rain and heat.'],
    ['Use the holes the part came with', 'Dusty: screws into the board’s own mounting holes beat zip ties. Use the maker’s drawing for positions.'],
    ['Write the rules down before asking for code', 'A spec file with pins, measured numbers and safety rules that Claude reads every time.'],
  ]],
  ['G2 Order', [
    ['Check every link before ordering', 'Dusty: two stores on the first list could not take orders.'],
    ['One order per store, all at once', 'Dusty: parts came in separate boxes over days. A check-in list for every part.'],
  ]],
  ['G3 Build', [
    ['Print a small test first', 'Dusty: the 10 minute fit check failed and saved a 90 minute print.'],
    ['Test several sizes at once', 'Dusty: five sizes on one print, pick the winner.'],
    ['Check every wire against the color chart', 'Dusty: black was not ground on those motors. Read the chart, not habit.'],
    ['Split the problem in half', 'Dusty: the screen worked, so the problem was power or wires, not code.'],
    ['A change is not done until every page matches', 'Dusty: MOC-007 was approved but the guide said zip ties for three days.'],
  ]],
];

export default function PlanPage() {
  return (
    <div className="min-h-screen">
      <Nav current="plan" />
      <Hero tag="Planning guide" title="HOW WE RUN IT">
        <p className="text-white/70 mt-4">
          How real engineers run a project when nobody hands them a packet: write your own brief, check in at gates, and
          control every change after the design is locked.
        </p>
      </Hero>
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="The four habits">
          <Cards items={HOW} />
        </Section>

        <Section title="Change orders (MOC)" sub="Management of Change: once the design is locked at G1, nothing gets swapped without these five steps. A loose screw or a typo does not need one. A different part, size, power source or plan does.">
          <ol className="space-y-2">
            {MOC.map(([t, d], i) => (
              <li key={t} className="bg-naw-card rounded-xl border border-white/10 p-4 flex gap-4">
                <span className="text-naw-orange font-game text-sm">{i + 1}</span>
                <div>
                  <div className="text-white font-bold">{t}</div>
                  <div className="text-white/60 text-sm mt-1">{d}</div>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-white/50 text-sm mt-3">
            See the full examples on <Link href="/projects/nolan/dusty/changes" className="text-naw-cyan">Dusty&apos;s change orders</Link>.
          </p>
        </Section>

        <Section title="Dusty's lessons, gate by gate" sub="Everything we learned the hard way on Dusty, placed at the gate where it gets checked. A gate does not pass until its list is done.">
          <div className="space-y-6">
            {CHECKS.map(([gate, items]) => (
              <div key={gate}>
                <div className="text-naw-orange font-bold mb-2">{gate}</div>
                <Cards items={items} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

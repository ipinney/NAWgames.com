import { BASE, MS, meta, Nav, Back, Section, Title, Cards, Steps } from '../ui';
import { LOG, LESSONS } from '../data';

export const metadata = meta(
  'Flying Mosquito: changes and lessons',
  'The Flying Mosquito project history, the lessons carried over from Dusty and the MS-2000, and how changes get made once the design is locked.',
  `${BASE}/changes`
);

const TAG = {
  Decision: 'bg-lime-300/20 text-lime-300',
  Plan: 'bg-naw-cyan/20 text-naw-cyan',
  Design: 'bg-naw-pink/20 text-naw-pink',
  Change: 'bg-naw-orange/20 text-naw-orange',
  Fix: 'bg-red-500/20 text-red-300',
};

const MOC = [
  ['Say what you want and why', 'One or two sentences.'],
  ['Check what it touches', 'Weight, space, wiring, the radio, safety, cost, the schedule. Measure, do not guess.'],
  ['Pick the parts', 'Real parts, real sizes, a backup store.'],
  ['Get a yes, then lock it', 'Dad approves. Any new change starts a new change order.'],
  ['Update everything and test it', '3D model, print files, parts list, these pages. Then the tests that prove it works.'],
];

export default function ChangesPage() {
  return (
    <div className="min-h-screen">
      <Nav current="changes" />
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">
        <Back href={BASE}>Flying Mosquito</Back>
        <div className="mt-5">
          <Title size="text-2xl sm:text-3xl">CHANGES AND LESSONS</Title>
          <p className="text-white/70 mt-3 max-w-2xl">
            The design is not locked yet. Once Dad approves the requirements and the budget, every change after that gets a
            change order (MOC), the same way as Dusty and the <a href={`${MS}/changes`} className="text-lime-300 hover:underline">MS-2000</a>.
            The first one will be MOC-001.
          </p>
        </div>

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

        <Section id="lessons" title="Lessons we are using" sub="What Dusty and the MS-2000 taught us, used before anything gets built.">
          <Cards items={LESSONS.map(([t, d, from]) => [t, d, from])} />
        </Section>

        <Section id="moc" title="How a change order works">
          <Steps items={MOC} />
        </Section>
      </div>
    </div>
  );
}

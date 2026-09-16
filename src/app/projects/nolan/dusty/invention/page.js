import { BASE, GUIDE, P, meta, Nav, Hero, Section, Card, Box, Btn } from '../ui';
import PartsCheck from './PartsCheck';

export const metadata = meta(
  'Dusty: the invention and the experiment',
  'What Dusty does, the speed experiment, how the edge sensor gets there first, the parts, the weekend plan, and what could go wrong.',
  `${BASE}/invention`
);

const CHIPS = [
  ['idea', 'What it does'],
  ['experiment', 'The experiment'],
  ['how', 'How it works'],
  ['parts', 'Parts'],
  ['plan', 'The plan'],
  ['watch-out', 'Watch out'],
  ['my-calls', 'My calls'],
];

const TILES = [
  ['Sweeps', 'A spinning brush at the front flicks crumbs up into a little tray, the same way a dustpan works.'],
  ['Sees the edge', 'Two invisible infrared beams point down at the table. When the bounce stops coming back, the table is gone.'],
  ['Stops in time', 'It backs up, spins a random amount, and drives off in a new direction. It has 62 mm to stop. Driving slowly, it only needs about 8.'],
];

const EXPERIMENT = [
  ['What I change', 'Motor speed. Four settings, from slow to full power.'],
  ['What I measure', 'How many millimeters it takes to stop, and how many times out of 20 it falls. The falls count is the proof it is safe.'],
  ['What stays the same', 'Same table, same power bank, same sensor height, same running start.'],
  ['My prediction', 'Stopping distance grows faster than speed. Slow, it needs about 8 mm. Full speed, about 38 mm. It has 62 mm, so it never falls, and the chart shows the speed where it finally would.'],
];

const PARTS = [
  ['p1', 'micro:bit v2', 'The brain. It has 25 little lights on the front so I can see what it is thinking.', '$18'],
  ['p2', 'SparkFun moto:bit motor board', 'The micro:bit is too weak to run motors by itself. This does the heavy lifting.', '$29'],
  ['p3', '2 × N20 gear motors, 32 mm wheels, brackets', 'One motor per side. Run them opposite directions and the robot spins in place.', '$35'],
  ['p4', 'Ball caster', 'A little rolling ball at the back so the robot does not tip over backward.', '$3'],
  ['p5', '2 × QTR-1A infrared sensors', 'The cliff detectors. One at each front corner, because corners sneak up on one side first.', '$6'],
  ['p6', 'Roller lever microswitch', 'A whisker that rolls on the table. Backup in case the infrared gets fooled.', '$2'],
  ['p7', '130 motor, rocker switch, pipe cleaners', 'The sweeper. Printed gears slow the motor down so the brush can flick crumbs into the tray.', '$6'],
  ['p8', 'USB-C power bank, cable and switch', 'Charges with a phone charger right inside Dusty. Holds a steady 5 volts.', '$40'],
  ['p9', 'PLA filament, M2 screws and nuts, zip ties, tape', 'The body is 3D printed. About 101 grams of plastic, held together with tiny screws.', '$15'],
];

const WEEKS = [
  ['Week of Sep 14', 'Order the parts and print the body', 'Order everything at once. While the box is on the way, print the first three batches of body parts.', 'Parts ordered, batches 1 to 3 printed'],
  ['Sep 19-20', 'Make it drive', 'Printed base, two motors, wheels, the caster, the power bank, micro:bit. No sensors and no brush yet. Just forward, backward, and spin.', 'It drives across the kitchen floor'],
  ['Sep 26-27', 'Teach it about edges', 'Mount the sensors out front, wire the whisker, write the code that stops and turns. Then put it on the table and find out.', '20 tries, 20 stops, written down'],
  ['Oct 3-4', 'Make it clean', 'Add the brush and the tray. Weigh out 5 grams of crushed cereal, run the robot, then weigh what ended up in the tray.', 'A number for how much it caught'],
  ['Oct 10-11', 'Run the experiment', 'Four speeds, 20 runs each, measuring how far it takes to stop and counting the falls. Then the spill race.', 'A data table and two charts'],
  ['Oct 17-18', 'Fix and finish', 'Reprint any part that broke or wore out. Give Dusty a face on the LED screen.', 'It passes every test again'],
  ['Oct 24-25', 'Build the display board', 'Question, prediction, method, graphs, photos, and Dusty on the table. Practice saying the whole thing out loud.', 'I can explain it without notes'],
  ['Oct 31-Nov 1', 'Spare weekend', 'Halloween. Left empty on purpose.', null],
  ['Nov 7-8', 'Spare weekend', 'For whatever broke, or for redoing a test that came out messy.', null],
  ['Nov 14-15', 'Last check', 'Charge the power bank, run the demo three times, pack it up carefully.', null],
  ['Mon Nov 16', 'Turn it in', 'Robot, display board, and the packet.', 'It is handed in'],
];

const PROBLEMS = [
  ['A dark table looks like a cliff', 'Black placemats swallow the light, so the robot thinks the table ended and refuses to move.', 'Press A to calibrate it on whatever table it is sitting on.'],
  ['Shiny tables bounce light sideways', 'Glass is the worst case. The light hits it like a mirror and goes off at an angle instead of coming back.', 'Test on glass early and say honestly that it does not work there.'],
  ['The brush throws crumbs on the sensors', 'One crumb sitting on a sensor blinds it completely.', 'Put the sensors in front of the brush, never behind it.'],
  ['The battery runs out at the fair', 'The power bank keeps Dusty at full speed, then stops all at once. Its charge lights are hidden inside Dusty.', 'Charge it the night before. A full charge runs Dusty for hours.'],
];

const CALLS = [
  ['The name: Dusty', 'Picked. It goes on the display board, on the LED face, and on the robot itself.'],
  ['The face', '25 LEDs on the front of the micro:bit. Eyes, a mood, a battery meter, whatever I want.'],
  ['The brush', 'Pipe cleaners on a printed roller. Trim the length until the bristles just touch the table.'],
  ['How it searches', 'Random bouncing on button A for the whole table. Spot Clean on button B sweeps a 1 foot square in front of Dusty, for a spill. Racing the two is my second experiment.'],
];

function EdgeDiagram() {
  const mono = { fontFamily: 'ui-monospace, monospace', fontSize: 11 };
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 700 250" className="block w-full min-w-[480px] h-auto" role="img" aria-label="Side view of Dusty near a table edge. The sensor is 62 mm in front of the wheel; at slow speed Dusty needs 8 mm to stop.">
        <rect x="20" y="168" width="480" height="13" fill="#ffffff" fillOpacity=".12" />
        <line x1="20" y1="168" x2="500" y2="168" stroke="#ffffff" strokeOpacity=".5" strokeWidth="2.5" />
        <line x1="500" y1="168" x2="500" y2="181" stroke="#ffffff" strokeOpacity=".5" strokeWidth="2.5" />
        <text x="30" y="160" fill="#ffffff" fillOpacity=".4" {...mono}>TABLE</text>
        <text x="514" y="196" fill="#f59e0b" {...mono}>EDGE</text>
        <rect x="336" y="96" width="140" height="44" rx="6" fill="#06b6d4" fillOpacity=".35" stroke="#06b6d4" />
        <text x="356" y="124" fill="#ffffff" fontSize="17" fontWeight="700">DUSTY</text>
        <rect x="342" y="140" width="46" height="9" fill="#ffffff" fillOpacity=".3" />
        <text x="330" y="148" fill="#ffffff" fillOpacity=".4" textAnchor="end" {...mono} fontSize={10}>TRAY</text>
        <circle cx="444" cy="152" r="16" fill="#0f0b1a" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="444" cy="152" r="3.5" fill="#ffffff" fillOpacity=".6" />
        <circle cx="358" cy="161" r="7" fill="#0f0b1a" stroke="#ffffff" strokeOpacity=".6" strokeWidth="2" />
        <circle cx="422" cy="156" r="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 4" />
        <line x1="476" y1="118" x2="500" y2="118" stroke="#ffffff" strokeOpacity=".6" strokeWidth="3" />
        <rect x="490" y="118" width="20" height="13" rx="2" fill="#f59e0b" />
        <text x="520" y="115" fill="#f59e0b" {...mono}>SENSOR</text>
        <path d="M500,131 L490,214 L516,214 Z" fill="#f59e0b" opacity="0.18" />
        <line x1="500" y1="131" x2="493" y2="214" stroke="#f59e0b" strokeDasharray="4 4" />
        <line x1="500" y1="131" x2="513" y2="214" stroke="#f59e0b" strokeDasharray="4 4" />
        <text x="524" y="218" fill="#f59e0b" {...mono}>NOTHING BOUNCES BACK</text>
        <line x1="444" y1="168" x2="444" y2="242" stroke="#ffffff" strokeOpacity=".2" />
        <line x1="500" y1="181" x2="500" y2="242" stroke="#ffffff" strokeOpacity=".2" />
        <line x1="444" y1="236" x2="500" y2="236" stroke="#fde047" strokeWidth="1.5" />
        <text x="472" y="230" fill="#fde047" textAnchor="middle" {...mono}>62 mm head start</text>
        <line x1="466" y1="168" x2="466" y2="208" stroke="#ffffff" strokeOpacity=".2" />
        <line x1="444" y1="204" x2="466" y2="204" stroke="#06b6d4" strokeWidth="2" />
        <text x="438" y="208" fill="#06b6d4" textAnchor="end" {...mono}>8 mm to stop (slow)</text>
      </svg>
    </div>
  );
}

export default function InventionPage() {
  return (
    <div className="min-h-screen">
      <Nav current="invention" />
      <Hero
        title="THE INVENTION"
        lead="A little robot that lives on the table, sweeps up crumbs, and stops itself right at the edge instead of driving off."
        sub="What it does, the experiment, the parts, and the plan to get it done."
        badge="Due Monday, November 16"
        chips={CHIPS}
      />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section id="idea" n={1} title="What it does" big="A robot vacuum would drive right off a table. Dusty is built for that job.">
          <div className="grid md:grid-cols-3 gap-3">
            {TILES.map(([t, d]) => (
              <Card key={t}>
                <div className="text-yellow-300 font-bold">{t}</div>
                <div className="text-white/70 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="experiment" n={2} title="The question I am answering" big="A robot alone is a cool thing. A robot plus a graph is a science project.">
          <Box tone="tip" title="The question">
            <p className="text-white text-base font-semibold">How fast can a robot drive and still stop before it falls off the table?</p>
            <p>Going faster means less time to react. That is true for elevators, for cars that brake by themselves, and for my robot.</p>
          </Box>
          <div className="grid sm:grid-cols-2 gap-3">
            {EXPERIMENT.map(([t, d]) => (
              <Card key={t}>
                <div className="text-naw-orange text-xs font-semibold">{t}</div>
                <div className="text-white/80 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn href={`${BASE}/learn#stopping`}>The science of stopping distance</Btn>
            <Btn href={`${BASE}/learn#fair-test`}>How to run a fair test</Btn>
          </div>
        </Section>

        <Section id="how" n={3} title="The sensor gets there first" big="The sensor sits 62 mm in front of the wheels. That head start is the whole trick.">
          <Card>
            <EdgeDiagram />
            <p className="text-white/60 text-sm mt-3">By the time the wheels reach the edge, the robot has already stopped.</p>
          </Card>
        </Section>

        <Section id="parts" n={4} title="Parts to order" big="Check them off as they show up in the mail.">
          <PartsCheck parts={PARTS} />
          <div className="flex justify-between bg-naw-card rounded-2xl border border-white/10 px-4 py-3">
            <span className="text-white font-bold">Total</span>
            <span className="text-naw-orange font-bold">About $150</span>
          </div>
          <p className="text-white/40 text-xs">Prices are rough. The parts list PDF has the real ones, plus a backup for every part.</p>
          <div className="flex flex-wrap gap-2">
            <Btn href={`${P}/dusty-parts-list.pdf`} primary newTab>Parts list (PDF)</Btn>
            <Btn href={`${BASE}/inventory#checklist`}>Check in the boxes</Btn>
            <Btn href={GUIDE}>Step by step build guide</Btn>
            <Btn href={`${BASE}/build`}>Build page and 3D models</Btn>
          </div>
        </Section>

        <Section id="plan" n={5} title="Six weekends, then three spare" big="Every weekend ends with something that works. The spare weekends are on purpose.">
          <div className="space-y-2">
            {WEEKS.map(([when, t, d, goal]) => {
              const spare = !goal;
              const due = when.startsWith('Mon');
              return (
                <div
                  key={when}
                  className={`grid grid-cols-[6.5rem_1fr] gap-4 rounded-2xl border p-4 ${
                    due ? 'border-naw-orange/50 bg-naw-orange/10' : spare ? 'border-dashed border-white/15' : 'border-white/10 bg-naw-card'
                  }`}
                >
                  <span className="text-naw-orange text-sm font-bold">{when}</span>
                  <span>
                    <span className={`block font-bold ${spare ? 'text-white/60' : 'text-white'}`}>{t}</span>
                    <span className="block text-white/60 text-sm mt-0.5">{d}</span>
                    {goal && <span className="inline-block mt-2 text-xs font-semibold text-yellow-300">Done when: {goal}</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <Btn href={`${BASE}/build/batches`}>Print and build plan, batch by batch</Btn>
        </Section>

        <Section id="watch-out" n={6} title="Things that will probably go wrong" big="Written down now, so when they happen, they were planned for.">
          <div className="grid sm:grid-cols-2 gap-3">
            {PROBLEMS.map(([t, d, fix]) => (
              <Card key={t}>
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/60 text-sm mt-1">{d}</div>
                <div className="text-naw-cyan text-sm font-semibold mt-2">Fix: {fix}</div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="my-calls" n={7} title="Stuff I get to decide">
          <div className="grid sm:grid-cols-2 gap-3">
            {CALLS.map(([t, d]) => (
              <Card key={t}>
                <div className="text-yellow-300 font-bold">{t}</div>
                <div className="text-white/70 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn href={`${BASE}/packet`} primary>Packet guide</Btn>
            <Btn href={`${BASE}/research`}>Research notes</Btn>
            <Btn href={`${BASE}/changes`}>Changes and lessons</Btn>
          </div>
        </Section>
      </div>
    </div>
  );
}

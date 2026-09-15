import Link from 'next/link';

const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
const TITLE = 'Dusty: print and build plan';
const DESC = 'Five print batches, each followed by the build steps it unlocks. Plate files set up for the FlashForge Adventurer 5M.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://nawgames.com/projects/nolan/dusty/build/batches',
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

const F = '/projects/nolan/dusty-files';
const G = '/projects/nolan/dusty-build-guide.html';
const V3D = `${F}/dusty-components-3d.html`;

const SETTINGS = [
  ['Printer', 'FlashForge Adventurer 5M, 0.4 mm nozzle, textured PEI plate'],
  ['Software', 'Easiest: the .gcode is already sliced for the Adventurer 5M with every setting below. Put it on a USB stick or send it from FlashPrint. The .3mf opens in Flash Studio or OrcaSlicer to change settings.'],
  ['Material', 'Flashforge Generic PLA profile: nozzle 220°C, bed 60°C'],
  ['Layers', '0.2 mm, 3 walls, 5 top and 4 bottom layers, 20% gyroid infill'],
  ['Brim', '5 mm, except none on the three gears and 8 mm on the tall roller'],
  ['Speed', 'Normal, except plates 1 and 4 run slower for the small gears and the roller'],
  ['Supports', 'Off. Nothing needs them.'],
  ['Hole size', 'X-Y hole compensation 0. Batch 1 tells you if it needs to change.'],
];

const BATCHES = [
  {
    n: 1,
    stem: 'dusty-plate-1-fit-check',
    title: 'Fit check',
    when: 'Wed Sep 16, after the M2 screws arrive',
    time: 'About 10 minutes',
    pieces: 'Motor gear, washer, axle collar, 2 dowels, 1 deck post',
    why: 'Six tiny parts that test whether this printer makes holes the right size. Finding out now takes 10 minutes. Finding out after the base takes an hour and a half.',
    need: ['M2 screws', '130 brush motor'],
    printing: [
      'Unbox everything that has arrived and check it against the parts list.',
      'Sort the M2 screws into three cups: 6 mm, 8 mm and 10 mm. Put the nuts in a fourth.',
    ],
    after: [
      ['Twist an M2 × 8 screw into the small hole in the top of the deck post.', 'It should bite and hold. If it spins loose, the holes print too big. If it will not start, too small. Either way, a grown-up changes X-Y hole compensation in the printer software (Quality tab): -0.05 if loose, +0.05 if tight. Print this plate again, and use the same number for every plate after.'],
      ['Push the motor gear onto the 130 motor shaft.', 'Snug, and it should not turn on the shaft when you hold the gear. A little loose is OK; a drop of superglue fixes it in Batch 4.'],
      ['Put the washer, collar, dowels and motor gear in a cup labeled BATCH 4. Keep the post with the deck parts.', ''],
    ],
    gate: 'The screw bites and the gear is snug. Print Batch 2 with the same settings.',
    build: [],
  },
  {
    n: 2,
    stem: 'dusty-plate-2-base',
    title: 'Base plate',
    when: 'Wed Sep 16 or Thu Sep 17',
    time: 'About 1.5 hours',
    pieces: 'Base plate (upside down), 3 deck posts, and a loose support block',
    why: 'The part everything else bolts to. It prints upside down so the top comes out perfectly flat.',
    need: [],
    printing: [
      'Read Steps 2 and 3 of the build guide so you know where the motors and caster go.',
      'Solder practice: a grown-up warms up the iron on a spare header pin (the sensors come later).',
    ],
    after: [
      ['Wait for the bed to cool, then pop the base off and peel away the brim.', ''],
      ['Lift off the small loose block that was standing under the gear peg.', 'It was only there to hold the peg up while it printed. Check the peg is round and smooth.'],
      ['Run an M2 screw into each small pilot hole once, then back it out.', 'Four under the motor pads, two in the caster posts, one in the end of the gear peg.'],
      ['Push the four posts into their holes to check they fit, then take them out again.', ''],
    ],
    gate: 'The base is clean and the posts fit. Print Batch 3.',
    build: [
      [2, 'Mount the motors and wheels', 'Two N20 motors and brackets, two wheels, four M2 × 8'],
      [3, 'Add the ball caster', 'Ball caster, two M2 × 8'],
    ],
  },
  {
    n: 3,
    stem: 'dusty-plate-3-deck-and-arms',
    title: 'Deck and sensor arms',
    when: 'Thu Sep 17 or Fri Sep 18',
    time: 'About 40 minutes',
    pieces: 'Deck, right sensor arm, left sensor arm (the one with the switch pad)',
    why: 'The deck is needed for the first drive on Saturday. The arms print now too, so the sensor weekend has nothing left to print.',
    need: [],
    printing: [
      'Put the motors and caster on the base (Steps 2 and 3) if those parts have arrived.',
      'Stick the hook-and-loop tape on the base and on the battery holder.',
    ],
    after: [
      ['Clean up the deck and slide the moto:bit between the guides to check the fit.', 'It should slide in with light pressure and touch the stop at the back.'],
      ['Hold each sensor arm against its ear on the base and push an M2 × 8 through the slot.', 'Just a test. Take them off again and put them in a cup labeled SENSORS.'],
    ],
    gate: 'The moto:bit fits the deck. That is everything for the first drive.',
    build: [
      [4, 'Add the deck, the brain and the power', 'Four posts, deck, moto:bit, micro:bit, battery holder and 4 AA, tape, two zip ties, Y splitter, four M2 × 8'],
      [5, 'Wire the motors and make it drive', 'Laptop, micro-USB cable'],
      [6, 'Mount the sensor arms (Sat Sep 26)', 'Both arms, two QTR-1A sensors, soldering, 2 × M2 × 8 and 2 × M2 × 6 with nuts, six jumper wires'],
      [7, 'Teach Dusty about edges (Sep 26 and 27)', ''],
      [8, 'Add the whisker (Sun Sep 27)', 'Whisker switch, soldering, 2 × M2 × 10 with nuts, two jumper wires'],
    ],
  },
  {
    n: 4,
    stem: 'dusty-plate-4-brush-drive',
    title: 'Brush drive',
    when: 'Any evening the week of Sep 21',
    time: 'About 1 hour',
    pieces: 'Brush motor mount, big gear, roller gear, brush roller (standing up), axle (lying flat)',
    why: 'Everything for the brush except the small pieces from Batch 1. Printed a week early so there is time to fix a gear before Oct 3.',
    need: [],
    printing: [
      'Cut about 20 pipe cleaner pieces, each 30 mm long.',
      'Watch the first layers of the roller. It is tall and thin, and it must stick well.',
    ],
    after: [
      ['Check the gear teeth are clean.', 'The gears print with no brim, so there is nothing to trim. If a tooth has a stray string, a grown-up cleans it with a hobby knife.'],
      ['Slide the axle through the roller and the roller gear.', 'The flat side of the axle matches the flat inside each one. They should slide on, not wobble.'],
      ['Slide the big gear onto the peg on the base and spin it.', 'It should spin freely. If it drags, sand the inside of the hole a little.'],
      ['Hold the motor gear from Batch 1 against the big gear and turn it.', 'The teeth should roll together without jamming.'],
    ],
    gate: 'The axle fits and the big gear spins freely. Everything waits in the BATCH 4 cup for Oct 3.',
    build: [
      [9, 'Build the brush and the gears (Sat Oct 3)', '130 motor, rocker switch, pipe cleaners, two zip ties, screw-terminal jack, 2 × M2 × 8, 1 × M2 × 6, and the Batch 1 cup'],
    ],
  },
  {
    n: 5,
    stem: 'dusty-plate-5-tray',
    title: 'Crumb tray',
    when: 'After Batch 4, any day before Oct 4',
    time: 'About 20 minutes',
    pieces: 'Crumb tray',
    why: 'Last, because it sits right behind the brush. If the brush needed changes, the tray can change too.',
    need: [],
    printing: [
      'Crush some cereal and weigh out 5 grams for the sweep test.',
    ],
    after: [
      ['Turn Dusty upside down on a towel and press the tray on until the back clicks.', 'The two side bumps click too. Push the back wall forward a little to take it off.'],
    ],
    gate: 'All 19 pieces printed. Dusty is complete.',
    build: [
      [10, 'Slide in the tray and test the sweep (Sun Oct 4)', 'Kitchen scale, 5 g of crushed cereal'],
      [11, 'Two brains, then run the experiment (Oct 10 and 11)', 'Fresh batteries, ruler, notebook'],
    ],
  },
];

const TIMELINE = [
  ['Wed Sep 16', 'Print 1, then 2', 'Fit check, then the base'],
  ['Thu Sep 17', 'Print 3', 'Deck and sensor arms'],
  ['Sat Sep 19', 'Build', 'Steps 2 to 5: first drive'],
  ['Week of Sep 21', 'Print 4, then 5', 'Brush drive, then tray'],
  ['Sep 26 and 27', 'Build', 'Steps 6 to 8: sensors and whisker'],
  ['Oct 3 and 4', 'Build', 'Steps 9 and 10: brush, gears, tray'],
  ['Oct 10 and 11', 'Test', 'Step 11: the experiment'],
];

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

export default function DustyBatchesPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-20">
        <Link href="/projects/nolan/dusty/build" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Build Dusty
        </Link>

        <h1 className="font-game text-xl sm:text-2xl glow mt-6">
          <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">PRINT AND BUILD PLAN</span>
        </h1>
        <p className="text-white text-lg font-semibold mt-4 leading-snug">
          Five print batches. Each one gives you the parts for the next few build steps.
        </p>
        <p className="text-white/55 text-sm mt-2 leading-relaxed">
          Print a batch, check it, build what it unlocks, then print the next. Small test parts go first, the big base
          second, and the tray last. All 19 pieces use about 77 g of PLA.
        </p>

        <section className="mt-8 bg-naw-card rounded-2xl border border-white/10 p-5">
          <h2 className="text-white font-bold text-lg">The calendar</h2>
          <div className="mt-3 divide-y divide-white/5">
            {TIMELINE.map(([d, what, detail]) => (
              <div key={d} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2 text-sm">
                <span className="text-white/60 tabular-nums">{d}</span>
                <span>
                  <span className={what === 'Build' || what === 'Test' ? 'text-naw-orange font-semibold' : 'text-naw-cyan font-semibold'}>{what}</span>
                  <span className="text-white/70"> · {detail}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 bg-naw-card rounded-2xl border border-white/10 p-5">
          <h2 className="text-white font-bold text-lg">Printer settings for every batch</h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-3">
            {SETTINGS.map(([k, v]) => (
              <div key={k} className="text-sm border-l-2 border-white/10 pl-3">
                <div className="text-white/45 text-xs">{k}</div>
                <div className="text-white">{v}</div>
              </div>
            ))}
          </div>
          <p className="text-white/45 text-xs mt-3">
            Each plate leaves at least 15 mm between parts and 10 mm from the bed edge, so every brim fits. The times below are the slicer's
            estimates for the Adventurer 5M, about 3.5 hours in all.
          </p>
        </section>

        {BATCHES.map((b) => (
          <section key={b.n} id={`batch-${b.n}`} className="mt-10 scroll-mt-4">
            <div className="flex items-baseline gap-3">
              <span className="flex-none w-10 h-10 rounded-xl bg-naw-orange text-naw-dark font-bold text-lg flex items-center justify-center">
                {b.n}
              </span>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">Batch {b.n}: {b.title}</h2>
                <p className="text-white/50 text-sm">{b.when} · {b.time}</p>
              </div>
            </div>

            <div className="mt-4 bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-hidden">
              <img src={`${F}/${b.stem}.png`} alt={`Print plate for batch ${b.n}: ${b.pieces}`} width={900} height={600} className="w-full h-auto bg-[#0d1b2e]" />
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
                {b.need.length > 0 && (
                  <p className="text-white/50 text-xs mt-3">Have ready: {b.need.join(', ')}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
                <h3 className="text-naw-cyan font-bold">While it prints</h3>
                <List items={b.printing.map((t) => [t, ''])} />
              </div>
              <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
                <h3 className="text-naw-cyan font-bold">When it is done</h3>
                <List items={b.after} />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-naw-green/40 bg-naw-green/10 p-4">
              <div className="text-naw-green text-xs font-semibold">Ready for the next batch when</div>
              <div className="text-white text-sm mt-0.5">{b.gate}</div>
            </div>

            {b.build.length > 0 && (
              <div className="mt-4 bg-naw-card rounded-2xl border border-naw-orange/30 p-5">
                <h3 className="text-naw-orange font-bold">Now you can build</h3>
                <div className="mt-2 space-y-2">
                  {b.build.map(([step, title, parts]) => (
                    <a
                      key={step}
                      href={`${G}#step-${step}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl bg-white/5 hover:bg-white/10 transition-colors px-4 py-3"
                    >
                      <span className="text-white font-semibold text-sm">Step {step}: {title}</span>
                      {parts && <span className="block text-white/45 text-xs mt-0.5">{parts}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

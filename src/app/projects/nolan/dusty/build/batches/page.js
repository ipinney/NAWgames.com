import Link from 'next/link';
import { Nav } from '../../ui';

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

const BEFORE = [
  ['Unbox everything that has arrived and check it against the parts list.', ''],
  ['Sort the M2 screws into three cups: 6 mm, 8 mm and 10 mm. Put the nuts in a fourth.', ''],
  ['Before Batch 3, measure the power bank and the 90 degree USB adapter with a ruler or calipers.', 'The bank must fit inside 104 x 48 x 29 mm, and the adapter must stick out less than 28 mm. If anything is off, the sleeve gets fixed before it prints.'],
];

const BATCHES = [
  {
    n: 1,
    stem: 'dusty-plate-1-fit-check',
    title: 'Fit check',
    when: 'Wed Sep 16, after the M2 screws arrive',
    time: 'About 15 minutes',
    pieces: 'Motor gear, washer, axle collar, 2 dowels, 1 deck post',
    why: 'Six tiny parts that test whether this printer makes holes the right size. Finding out now takes 10 minutes. Finding out after the base takes an hour and a half.',
    need: ['M2 screws', '130 brush motor'],
    grams: 1.6,
    learn: {
      title: 'How a 3D printer builds',
      items: [
        ['Watch the first layer go down. It should be flat and squished, not round like spaghetti.', 'The first layer is the most important one. If it does not stick, nothing above it will.'],
        ['Each layer is 0.2 mm thick. The deck post is 35 mm tall. How many layers is that?', 'Answer: 35 divided by 0.2 is 175 layers.'],
      ],
    },
    parts: [
      { k: 'pinion', name: 'Motor gear', looks: 'Small gear, 11 mm across and 3 mm thick. 12 teeth and a tiny round hole in the middle.', job: 'Pushes onto the metal shaft of the brush motor and turns the big gear.', goes: 'BATCH 4 cup, after the test in step 2' },
      { k: 'washer', name: 'Washer', looks: 'Thin flat ring, 8 mm across and 1 mm thick. Round hole. The thinnest part on the plate.', job: 'Sits on the end of the gear peg under a screw so the big gear cannot slide off.', goes: 'BATCH 4 cup' },
      { k: 'collar', name: 'Axle collar', looks: 'Thick ring, 8 mm across and 3 mm thick. The hole has one flat side, like a letter D.', job: 'Slides onto the left end of the brush axle so the axle cannot slide out.', goes: 'BATCH 4 cup', tip: 'Washer or collar? The collar is three times thicker and its hole has a flat side.' },
      { k: 'dowel', name: 'Dowels (2)', looks: 'Two tiny pins, 3 mm across and 3.4 mm tall, about the size of a grain of rice.', job: 'Hold the brush motor mount in exactly the right spot on the base.', goes: 'BATCH 4 cup', tip: 'The easiest parts to lose. Put them in the cup first.' },
      { k: 'post', name: 'Deck post', looks: 'Round stick, 35 mm long. One end has a skinny peg. The other end has a tiny hole for a screw.', job: 'Holds up the front of the deck. The peg goes down into the base, and a screw goes into the top.', goes: 'Keep it with the deck parts. Batch 2 prints the second post.', tip: 'It prints standing peg up, so it comes off the printer upside down.' },
    ],
    boxParts: [
      ['M2 × 8 screw', 'M2 means the screw is 2 mm thick. 8 means it is 8 mm long, measured from under the head to the tip. It is in the 8 mm cup.'],
      ['130 brush motor', 'The silver motor with two metal tabs on the back and a thin metal shaft sticking out the front.'],
    ],
    after: [
      {
        t: 'Find the deck post. The end with the tiny hole is the top. Twist an M2 × 8 screw into that hole, turning clockwise, about three turns.',
        tip: 'Use a small Phillips screwdriver. Push down gently while you turn. Then check the result in the table below.',
        img: ['b1-s1'],
        check: [
          ['It bites and holds', 'The screw gets harder to turn and stays put when you let go.', 'Perfect. Change nothing.', 'ok'],
          ['It spins loose', 'The screw turns but never grips, or drops right in.', 'Holes print too big. A grown-up sets X-Y hole compensation to -0.05 in the printer software (Quality tab) and prints this plate again.', 'bad'],
          ['It will not start', 'Even pushing down, the screw will not go in.', 'Holes print too small. A grown-up sets X-Y hole compensation to +0.05 and prints this plate again.', 'bad'],
        ],
        tip2: 'Whatever number works, use it for every plate after this one.',
      },
      {
        t: 'Push the motor gear onto the metal shaft of the 130 motor.',
        tip: 'Set the back of the motor on the table and press the gear straight down with your thumb. Stop when the tip of the shaft just peeks through the gear, leaving a small gap between the gear and the motor. Then hold the gear and try to turn the shaft: the gear should not slip. A little loose is OK; a drop of superglue fixes it in Batch 4.',
        img: ['b1-s2', 'b1-s2b'],
      },
      {
        t: 'Put the motor gear, washer, collar and both dowels in a cup labeled BATCH 4. Keep the deck post with the deck parts.',
        tip: 'Wiggle the gear back off the shaft first. It goes on for good in Batch 4.',
        img: ['b1-s3'],
      },
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
    pieces: 'Base plate (upside down), 1 deck post, and a loose support block',
    why: 'The part everything else bolts to. It prints upside down so the top comes out perfectly flat.',
    need: [],
    grams: 36.7,
    learn: {
      title: 'Meet the micro:bit',
      items: [
        ['Open makecode.microbit.org and make the micro:bit show a heart when you press button A.', 'Code is a list of steps the computer follows exactly, in order.'],
        ['Read Steps 2 and 3 of the build guide so you know where the motors and caster go.', ''],
        ['Solder practice: a grown-up warms up the iron on a spare header pin.', 'The sensors get soldered later, so practice now while nothing is at stake.'],
      ],
    },
    parts: [
      { k: 'base', name: 'Base plate', looks: 'The biggest part, 85 × 122 mm, with walls and posts sticking up. It prints upside down, so the flat side on the bed is the top of the robot.', job: 'Everything bolts to it: the wheel motors, the caster, the brush, the sensors and the battery sleeve.', goes: 'Build Steps 2 and 3' },
      { k: 'post', name: 'Deck post (second one)', looks: 'Same as the post from Batch 1: skinny peg on one end, tiny screw hole on the other.', job: 'Holds up the front of the deck.', goes: 'Keep both posts with the deck parts' },
      { k: 'support', name: 'Support block', looks: 'Small loose block, about 9 × 4 × 6 mm, standing just under the gear peg on the base.', job: 'Only holds the peg up while it prints. It is not part of Dusty.', goes: 'Trash' },
    ],
    after: [
      { t: 'Wait for the bed to cool, then lift the base off and peel away the brim.', tip: 'The brim is the thin one-layer sheet around the bottom edge. It peels off like tape. Cool plastic pops off by itself; warm plastic bends.', img: ['b2-s1'] },
      { t: 'Lift off the small loose block that was standing under the gear peg, and throw it away.', tip: 'It was only there to hold the peg up while it printed. Check the peg is round and smooth.', img: ['b2-s2'] },
      { t: 'Run an M2 × 8 screw into each small pilot hole once, then back it out.', tip: 'Four holes on the motor pads, two in the caster posts, one in the end of the gear peg. This cuts the threads now, so the real screws go in easily later. The four bigger holes for the battery sleeve are plain through-holes: skip them.', img: ['b2-s3'] },
      { t: 'Push both deck posts, peg end down, into their holes near the front to check they fit. Then take them out again.', tip: '', img: ['b2-s4'] },
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
    title: 'Deck, battery sleeve and sensor arms',
    when: 'Thu Sep 17 or Fri Sep 18',
    time: 'About 1 hour 45 minutes',
    pieces: 'Deck, battery sleeve (standing on its end), keeper bar, right sensor arm, left sensor arm (the one with the switch pad)',
    why: 'The deck and the battery sleeve are needed for the first drive on Saturday. The arms print now too, so the sensor weekend has nothing left to print.',
    need: [],
    grams: 42.5,
    learn: {
      title: 'How a power bank works',
      items: [
        ['Plug the power bank into a USB-C charger and watch the four blue lights.', 'Each light is about a quarter full. When all four stay on, it is charged.'],
        ['The bank holds 5,200 mAh. Dusty uses about 450 mA. Roughly how many hours is that?', 'Answer: 5,200 divided by 450 is about 11, but the bank loses some energy changing its voltage, so plan on 6 to 7 hours.'],
        ['Put the motors and caster on the base (Steps 2 and 3) if those parts have arrived.', ''],
      ],
    },
    parts: [
      { k: 'deck', name: 'Deck', looks: 'Flat shelf, 79 × 77 mm, with a square window in the middle and raised guides along both sides.', job: 'Holds the moto:bit board on top of the robot.', goes: 'Build Step 4' },
      { k: 'sleeve', name: 'Battery sleeve', looks: 'Long box, 106 mm, open at one end and closed at the other, with windows in the sides. It prints standing on its closed end.', job: 'The power bank slides inside. The back of the deck rests on top of it.', goes: 'Build Step 4' },
      { k: 'keeper', name: 'Keeper bar', looks: 'Thin bar, 54 mm long, with a flat head on one end.', job: 'Slides through the back wall of the sleeve so the power bank cannot slide out.', goes: 'Build Step 4' },
      { k: 'carrier_R', name: 'Right sensor arm', looks: 'L shape, 27 mm tall, with a slot in the tall side and a small frame at the foot.', job: 'Holds a cliff sensor face down just above the table.', goes: 'SENSORS cup, Build Step 6' },
      { k: 'carrier_L', name: 'Left sensor arm', looks: 'Same as the right arm, plus an extra pad with two holes on the outside.', job: 'Holds the other cliff sensor. The pad holds the whisker switch.', goes: 'SENSORS cup, Build Steps 6 and 8', tip: 'Right or left? Only the left arm has the pad with two holes.' },
    ],
    after: [
      { t: 'Clean up the deck and slide the moto:bit between the guides to check the fit.', tip: 'It should slide in with light pressure and touch the stop at the back.', img: ['b3-s1'] },
      { t: 'Slide the power bank into the sleeve from the open end, USB ports facing out, all the way to the closed end. Then push the keeper bar in through the slot in the back wall until its head sits flat.', tip: 'If the bank rattles, a grown-up adds a strip of foam tape to the floor rib.', img: ['b3-s2'] },
      { t: 'Hold each sensor arm against its ear on the base and push an M2 × 8 screw through the slot.', tip: 'Just a test fit. Take them off again and put both arms in a cup labeled SENSORS.', img: ['b3-s3'] },
    ],
    gate: 'The moto:bit fits the deck and the bank fits the sleeve. That is everything for the first drive.',
    build: [
      [4, 'Add the deck, the brain and the power', 'Two posts, battery sleeve, keeper bar, deck, power bank, 90° USB adapter, USB to barrel cable, in-line switch, Y splitter, moto:bit, micro:bit, foam tape, two zip ties, eight M2 × 8'],
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
    grams: 13.6,
    learn: {
      title: 'Gears trade speed for strength',
      items: [
        ['Look at the plate picture. The motor gear has 12 teeth and the big gear has 36. How many times does the motor turn for one turn of the big gear?', 'Answer: 36 divided by 12 is 3. Slower, but three times stronger.'],
        ['The small gear has 10 teeth and the roller gear has 18. Multiply both steps together.', 'Answer: 3 times 1.8 is 5.4. The brush turns 5.4 times slower than the motor.'],
        ['Cut about 20 pipe cleaner pieces, each 30 mm long.', 'Watch the first layers of the roller while you cut. It is tall and thin, and it must stick well.'],
      ],
    },
    parts: [
      { k: 'cradle', name: 'Motor mount', looks: 'Open box, 29 × 26 × 17 mm, with a round opening shaped to fit the motor.', job: 'Holds the 130 brush motor and the brush on/off switch. The two dowels from Batch 1 line it up on the base.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'compound', name: 'Big gear', looks: 'Two gears joined together: a big one with 36 teeth and a small one with 10 teeth, and five round holes.', job: 'Spins on the gear peg. It slows the motor down and makes it stronger.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'roller_gear', name: 'Roller gear', looks: 'Gear with 18 teeth, 25 mm across. Its hole has a flat side, like a D.', job: 'Sits on the end of the axle and turns the brush roller.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'roller', name: 'Brush roller', looks: 'Tube, 52 mm long and 14 mm thick, with 7 small holes going across it.', job: 'Pipe cleaner pieces go through the holes to make the brush.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'axle', name: 'Axle', looks: 'Long thin rod, 75 mm, with one flat side.', job: 'Goes through the roller and the roller gear so they turn together.', goes: 'BATCH 4 cup, Build Step 9' },
    ],
    after: [
      { t: 'Check the gear teeth are clean.', tip: 'The gears print with no brim, so there is nothing to trim. If a tooth has a stray string, a grown-up cleans it with a hobby knife.', img: ['b4-s1'] },
      { t: 'Slide the axle through the roller, then put the roller gear on the end.', tip: 'Line up the flat side of the axle with the flat inside each part. They should slide on, not wobble.', img: ['b4-s2'] },
      { t: 'Slide the big gear onto the gear peg on the base and spin it.', tip: 'It should spin freely. If it drags, sand the inside of the hole a little.', img: ['b4-s3'] },
      { t: 'Hold the motor gear from Batch 1 against the big gear and turn it.', tip: 'The teeth should roll together without jamming.', img: ['b4-s4'] },
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
    time: 'About 15 minutes',
    pieces: 'Crumb tray',
    why: 'Last, because it sits right behind the brush. If the brush needed changes, the tray can change too.',
    need: [],
    grams: 7.0,
    learn: {
      title: 'Measure like a scientist',
      items: [
        ['Put a small bowl on the kitchen scale and press the zero (tare) button.', 'Now the scale only counts what you add, not the bowl.'],
        ['Crush some cereal and weigh out exactly 5 grams for the sweep test.', 'Saying "Dusty picked up 3.8 of 5 grams" is a measurement. "It cleans pretty well" is an opinion.'],
      ],
    },
    parts: [
      { k: 'tray', name: 'Crumb tray', looks: 'Shallow tray, 57 × 42 mm, with a thin front edge, a taller back wall and a tab on each side.', job: 'Catches the crumbs the brush flicks back.', goes: 'Build Step 10' },
    ],
    after: [
      { t: 'Check the bottom of the tray is flat and the front edge is thin and clean.', tip: 'The tray prints tipped back a little so its sloped bottom lies flat on the bed. Trim any brim off the front edge, because that edge rides on the table.', img: ['b5-s1'] },
      { t: 'Turn Dusty upside down on a towel and press the tray on until the back clicks.', tip: 'The two side bumps click too. To take it off, push the back wall forward a little.', img: ['b5-s2'] },
    ],
    gate: 'All 19 pieces printed. Dusty is complete.',
    build: [
      [10, 'Slide in the tray and test the sweep (Sun Oct 4)', 'Kitchen scale, 5 g of crushed cereal'],
      [11, 'Two brains, then run the experiment (Oct 10 and 11)', 'Charged power bank, ruler, notebook, masking tape for a 1 foot square, 5 g of crushed cereal'],
    ],
  },
];

const TIMELINE = [
  ['Wed Sep 16', 'Print 1, then 2', 'Fit check, then the base'],
  ['Thu Sep 17', 'Print 3', 'Deck, battery sleeve and sensor arms'],
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

export default function DustyBatchesPage() {
  return (
    <div className="min-h-screen">
      <Nav current="print" />
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
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
          Five print batches. Each one comes with something to learn while it prints, and unlocks the next build steps.
        </p>
        <p className="text-white/55 text-sm mt-2 leading-relaxed">
          Print a batch, check it, build what it unlocks, then print the next. Small test parts go first, the big base
          second, and the tray last. All 19 pieces use about 101 g of PLA.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2">
          {BATCHES.map((b) => (
            <a key={b.n} href={`#batch-${b.n}`} className="bg-naw-card border border-white/10 hover:border-naw-orange/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">
              <span className="text-naw-orange font-bold">{b.n}</span> {b.title}
            </a>
          ))}
        </nav>

        <section className="mt-6 bg-naw-card rounded-2xl border border-white/10 p-5">
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
            estimates for the Adventurer 5M, about 4.5 hours in all.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-naw-orange/40 bg-naw-orange/10 p-5">
          <h2 className="text-white font-bold text-lg">Before the first print</h2>
          <List items={BEFORE} />
        </section>

        {BATCHES.map((b) => (
          <section key={b.n} id={`batch-${b.n}`} className="mt-10 scroll-mt-4">
            <div className="flex items-baseline gap-3">
              <span className="flex-none w-10 h-10 rounded-xl bg-naw-orange text-naw-dark font-bold text-lg flex items-center justify-center">
                {b.n}
              </span>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">Batch {b.n}: {b.title}</h2>
                <p className="text-white/50 text-sm">{b.when} · {b.time} · {b.grams} g</p>
              </div>
            </div>

            <div className="mt-4 bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-hidden">
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
                {b.need.length > 0 && (
                  <p className="text-white/50 text-xs mt-3">Have ready: {b.need.join(', ')}</p>
                )}
              </div>
            </div>

            <div className="mt-4 bg-naw-card rounded-2xl border border-lime-300/25 p-5">
              <div className="text-lime-300 text-xs font-semibold">Learn while it prints</div>
              <h3 className="text-white font-bold">{b.learn.title}</h3>
              <List items={b.learn.items} />
            </div>

            <div className="mt-4 bg-naw-card rounded-2xl border border-white/10 p-5">
              <h3 className="text-naw-cyan font-bold">Know your parts</h3>
              <p className="text-white/55 text-sm mt-1">
                Every piece from this plate, next to a penny for size. The colors in the pictures are only there to tell the parts apart.
                Your parts all come out the color of your filament.
              </p>
              <Parts parts={b.parts} />
              {b.boxParts && (
                <div className="mt-4">
                  <div className="text-white/45 text-xs">Also from the parts box for this batch</div>
                  <div className="grid sm:grid-cols-2 gap-2 mt-1">
                    {b.boxParts.map(([n, d]) => (
                      <div key={n} className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm">
                        <div className="text-white font-bold">{n}</div>
                        <div className="text-white/65 mt-0.5">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 bg-naw-card rounded-2xl border border-naw-cyan/30 p-5">
              <h3 className="text-naw-cyan font-bold">When it is done</h3>
              <After items={b.after} />
            </div>

            {b.n === 1 && (
              <div className="mt-4 bg-naw-card rounded-2xl border border-yellow-300/40 p-5">
                <div className="text-yellow-200 text-xs font-semibold">If both fits were too tight</div>
                <h3 className="text-white font-bold">Fit check 2: five sizes of each</h3>
                <p className="text-white/65 text-sm mt-1">
                  Five deck posts and five motor gears, each a little bigger than the last. Print it with the same settings
                  (about 35 minutes, 6 g). Try every one and pick the smallest that works.
                </p>
                <img src={`${F}/dusty-fit-check-2.png`} alt="Fit check 2 plate: five posts and five motor gears, numbered 1 to 5" width={1100} height={650} loading="lazy" className="w-full h-auto rounded-xl border border-white/10 bg-[#0d1b2e] mt-3" />
                <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-white font-bold">Posts: count the grooves</div>
                    <div className="text-white/65 mt-0.5">1 groove = #1 (hole 1.9 mm) up to 5 grooves = #5 (2.3 mm). The first plate was 1.8 mm. Pick the one where the screw starts and then bites.</div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-white font-bold">Gears: count the dimples</div>
                    <div className="text-white/65 mt-0.5">1 dimple = #1 (hole 1.95 mm) up to 5 dimples = #5 (2.15 mm). The first plate was 1.85 mm. Pick the one that pushes on with your thumb and does not slip.</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Btn href={`${F}/dusty-fit-check-2.gcode`} primary download>Ready to print (.gcode)</Btn>
                  <Btn href={`${F}/dusty-fit-check-2.3mf`} download>Plate file (.3mf)</Btn>
                  <Btn href={`${F}/dusty-fit-check-2.stl`} download>Plate (.stl)</Btn>
                </div>
                <p className="text-white/45 text-xs mt-3">Tell us the two winning numbers and the design gets updated to match before Batch 2 prints again.</p>
              </div>
            )}

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

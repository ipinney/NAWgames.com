import Link from 'next/link';
import { BASE, Nav, Back } from '../ui';

const P = '/projects/nolan';
const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
const TITLE = 'Dusty: learn the science';
const DESC =
  'How a table-sweeping robot works, for kids: the micro:bit and code, motors and the H-bridge, infrared cliff sensors, calibration, gears, power banks, 3D printing, stopping distance, and how to run a fair test.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `https://nawgames.com${BASE}/learn`,
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

const TOPICS = [
  {
    id: 'crumbs',
    title: 'Crumbs and the robot that came first',
    big: 'Robot vacuums clean floors. Nobody built one for the table.',
    body: [
      'Ants and cockroaches find food by scouting. When one scout finds crumbs, it leaves a scent trail so the rest of the colony can follow. That is why the first step against bugs is always the same: clean up right after eating.',
      'Most people brush crumbs off the table with a hand. The crumbs land on the floor. The mess did not leave the house, it just moved somewhere harder to reach. Dusty catches crumbs in a tray you dump in the trash.',
      'The first Roomba robot vacuum went on sale in September 2002 for about $199. Before it was called Roomba, the team called it DustPuppy. It had three separate systems just to keep it from falling down stairs, because falling is the biggest danger for any driving robot.',
    ],
    words: [
      ['Invention', 'A new thing, or a new way of doing something, that solves a problem.'],
      ['Autonomous', 'It decides for itself. No remote control, no driver.'],
    ],
    tryit: 'After dinner, count how many crumbs are left on the table. Then brush them off with your hand and count how many ended up on the floor.',
    fact: 'Before it was the Roomba, the robot vacuum was called DustPuppy. Dusty is in good company.',
  },
  {
    id: 'brain',
    title: 'The brain: micro:bit and code',
    big: 'A microcontroller is a tiny computer that does one job forever.',
    body: [
      'A laptop can do millions of different things. A microcontroller does one job, very reliably, using almost no electricity. There is one in a microwave, one in a car key, and dozens in the car itself.',
      'The micro:bit is a microcontroller you can reprogram. Its 25 red LEDs can scroll sensor numbers, so you can read them at the table with no laptop. Button A runs random bounce and button B runs Spot Clean. When you load code, it stays. Switch Dusty on a week later and the program starts right away.',
      'Code is a list of steps the computer follows exactly, in order. Dusty’s code uses three big ideas. A loop repeats steps forever. An if checks something and decides what to do. A variable is a box that remembers a number, like the threshold.',
    ],
    words: [
      ['Microcontroller', 'A small computer that runs one program forever.'],
      ['Loop', 'Steps that repeat.'],
      ['If / then', 'A decision: if this is true, then do that.'],
      ['Variable', 'A named box that holds a number.'],
    ],
    visual: 'code',
    tryit: 'At makecode.microbit.org, make the micro:bit show a heart when you press button A. That is your first if/then.',
    fact: 'The micro:bit is about 4 cm by 5 cm, smaller than a credit card.',
  },
  {
    id: 'motors',
    title: 'Motors and the H-bridge',
    big: 'The micro:bit can point, but it cannot lift. The motor board does the lifting.',
    body: [
      'A micro:bit pin gives about enough electricity to light a small LED, roughly 1/100th of what a motor wants. Wire a motor straight to it and you get a broken micro:bit, not a slow robot.',
      'The moto:bit board has a circuit called an H-bridge: four electronic switches in the shape of the letter H, with the motor in the middle. Close one pair and the motor spins forward. Close the other pair and it spins backward. The micro:bit only says which pair.',
      'To run a motor at 40%, the board flicks the power fully on and off hundreds of times a second, on 40% of the time. The motor acts like it gets 40% of the power. This is called PWM. At 40%, Dusty drives about 7 centimeters per second.',
    ],
    words: [
      ['H-bridge', 'Four switches that let a motor spin either direction.'],
      ['PWM', 'Pulse width modulation. Flicking power on and off very fast to run a motor slower.'],
    ],
    visual: 'pwm',
    tryit: 'Load the motor test at 40, then at 80. Time how long Dusty takes to cross a ruler at each speed.',
    fact: 'A dimmer switch for room lights uses the same on-off trick as PWM.',
  },
  {
    id: 'wheels',
    title: 'Wheels, steering and three feet',
    big: 'Dusty steers with no steering wheel. It just runs its two wheels differently.',
    body: [
      'Both wheels forward at the same speed: straight. One faster than the other: a curve. One forward and one backward: a spin in place. This is called differential drive.',
      'Each N20 motor has a gearbox with a 298:1 ratio. The motor spins 298 times for one turn of the wheel. The gears trade speed for strength, so a tiny motor can push the whole robot.',
      'Dusty stands on two wheels and one ball caster. Three points always sit flat, even on a bumpy table. Four wheels would rock whenever the table was not perfectly flat.',
    ],
    words: [
      ['Differential drive', 'Steering by running two wheels at different speeds.'],
      ['Caster', 'A ball or wheel that rolls in any direction to hold up one end.'],
    ],
    tryit: 'Set the left motor to 40 and the right to 20. Which way does Dusty curve? Now swap them.',
    fact: 'Camera tripods have three legs for the same reason Dusty has three feet.',
  },
  {
    id: 'infrared',
    title: 'Seeing the edge with infrared',
    big: 'Shine light down, measure the bounce. No bounce means no table.',
    body: [
      'Each cliff sensor has two tiny bumps. One is an infrared LED that shines invisible light straight down. The other measures how much light comes back.',
      'On the table, the light bounces straight back up. Past the edge, it shines into empty air and almost nothing comes back. That sudden drop is how Dusty knows the table ended.',
      'The sensor works best about 3 mm above the table and gets unreliable past 6 mm. Two US pennies stacked up are almost exactly 3 mm, so they set the height. The sensors sit 62 mm in front of the wheels, which gives Dusty a head start to stop.',
    ],
    words: [
      ['Infrared', 'Light just past red that eyes cannot see. TV remotes use it.'],
      ['Reflectance sensor', 'An emitter and a detector together. It shines light and measures the bounce.'],
    ],
    visual: 'reflect',
    tryit: 'Point a TV remote at a phone camera and press a button. The camera can see the infrared flashes your eyes cannot.',
    fact: 'Dark surfaces fool real Roombas too. Some refuse to drive onto black rugs because they think the rug is a cliff.',
  },
  {
    id: 'calibrate',
    title: 'Numbers, thresholds and calibration',
    big: 'Dusty measures the table it is sitting on, then decides for itself what a cliff looks like.',
    body: [
      'A button is digital: pressed or not, yes or no. The sensor is analog: it has a whole range of answers. The micro:bit turns it into a number from 0 to 1023. For Dusty’s sensors, a low number means lots of light came back, and a high number means almost none did.',
      'A threshold is the line between table and cliff. On white paper the table might read 200 and the edge 900. Dark wood might read 650 on the table. A fixed line at 500 would make Dusty think the dark table was already a cliff.',
      'So Dusty calibrates. Press A while it sits still, and it reads the table and sets the threshold 200 above that. Same code, any table.',
    ],
    words: [
      ['Analog', 'A measurement with a whole range of answers, not just yes or no.'],
      ['Threshold', 'The cutoff number. Above it means cliff, below it means table.'],
      ['Calibration', 'Measuring the surface at startup so the threshold fits that table.'],
    ],
    visual: 'numbers',
    tryit: 'Scroll the sensor number on the LEDs. Write down the reading on white paper, on wood, on a black placemat, and held over the edge.',
    fact: 'Scientists calibrate scales, thermometers, and telescopes before they trust a measurement.',
  },
  {
    id: 'whisker',
    title: 'Redundancy: the whisker',
    big: 'Two sensors that fail for different reasons.',
    body: [
      'The whisker is a small switch with a springy arm and a little wheel. The wheel rolls on the table and holds the arm pushed in. When the table ends, the arm drops, the switch clicks, and the motors stop.',
      'Infrared can be fooled by a black placemat. The whisker cannot, because it touches instead of looking. Having two different systems do the same job, so one can catch what the other misses, is called redundancy.',
      'The test: cover both infrared sensors with tape. If Dusty still stops at the edge, the whisker works on its own.',
    ],
    words: [
      ['Redundancy', 'Two systems that fail for different reasons, so one catches what the other misses.'],
      ['Switch', 'A part that opens or closes a circuit.'],
    ],
    tryit: 'When a judge asks "what if the sensor is wrong?", practice answering with the word redundancy.',
    fact: 'Airplanes have two or three of almost every important system for the same reason.',
  },
  {
    id: 'gears',
    title: 'Gears: trading speed for strength',
    big: 'The brush gears make the roller 5.4 times slower and about 5.4 times stronger.',
    body: [
      'When two gears touch, their teeth pass one for one. The motor gear has 12 teeth and the big gear has 36, so the motor goes around 3 times for one turn of the big gear.',
      'A small 10-tooth gear is stuck to the big gear. It drives the 18-tooth roller gear, which slows things down again by 18 ÷ 10 = 1.8. The two slow-downs multiply: 3 × 1.8 = 5.4.',
      'The 130 motor spins about 8,000 to 10,000 times a minute. Divided by 5.4, the roller turns about 1,500 to 1,800 times a minute, with enough turning strength to push through a pile of cereal.',
    ],
    words: [
      ['Gear ratio', 'How many turns in for one turn out. The brush gears are 5.4 to 1.'],
      ['Torque', 'Turning strength.'],
      ['Gearing down', 'Using gears to trade speed for strength.'],
    ],
    visual: 'gears',
    tryit: 'Put a marker dot on the motor gear and the roller gear. Turn the roller once by hand and count the motor gear turns. You should get about five and a half.',
    fact: 'A bicycle does the same thing. The low gear makes hills easier by trading speed for strength.',
  },
  {
    id: 'power',
    title: 'Power: volts and the power bank',
    big: 'A power bank holds a steady 5 volts until it is empty.',
    body: [
      'Volts are like the push behind electricity. Four AA batteries start near 6 volts and fade as they run down, so Dusty would get slower all day. Speed is what the experiment measures, so a steady 5 volts keeps the test fair.',
      'Battery size is measured in milliamp hours (mAh). The bank holds 5,200 mAh and Dusty uses about 450 milliamps. 5,200 ÷ 450 is about 11 hours, but the bank loses some energy changing its voltage, so plan on 6 to 7 hours.',
      'The power bank is a lithium battery. Never crush, pierce or drop it. If it gets hot, swells or smells, a grown-up takes it out.',
    ],
    words: [
      ['Volt', 'A unit for how hard electricity is pushed.'],
      ['Milliamp hour', 'How much charge a battery holds.'],
      ['Circuit', 'A complete loop that electricity flows around.'],
    ],
    tryit: 'Charge the bank and watch the four blue lights. Each light is about a quarter full.',
    fact: 'AA batteries lasted Dusty only about 90 minutes. That is why the power bank change (MOC-001) happened.',
  },
  {
    id: 'printing',
    title: '3D printing and PLA',
    big: 'A 3D printer builds a part like a stack of very thin pancakes.',
    body: [
      'PLA is a plastic made from plants, usually corn or sugarcane. The printer pushes a thread of it into a nozzle at about 220°C, where it melts like hot glue, and draws one layer 0.2 mm thick. Then it draws the next layer on top.',
      'The base plate is 28 mm tall. 28 ÷ 0.2 = 140 layers. All 19 printed pieces use about 101 grams of PLA.',
      'The screw holes print a little smaller than the M2 screws, 1.8 mm instead of 2 mm. The screw cuts its own thread as it turns. The small print in Batch 1 checks that holes come out the right size before the long print.',
    ],
    words: [
      ['PLA', 'A plastic made from plants. The printer melts it and builds parts in layers.'],
      ['Layer', 'One thin slice of a 3D print, 0.2 mm on Dusty.'],
      ['Pilot hole', 'A hole a bit smaller than the screw, so the screw cuts its own thread.'],
      ['Fit check', 'Testing the part everything else depends on before making the rest.'],
    ],
    tryit: 'The deck post is 35 mm tall. How many 0.2 mm layers is that? (Answer: 175.)',
    fact: 'PLA goes soft at about 60°C. A car in the Houston sun gets hotter than that inside, so Dusty never stays in the car.',
  },
  {
    id: 'stopping',
    title: 'Stopping distance',
    big: 'The faster you go, the more room you need to stop.',
    body: [
      'Nothing stops instantly. A robot keeps rolling while its code notices the edge and while the motors slow down. A faster robot covers more ground in that time and has more motion to get rid of.',
      'Dusty’s sensors are 62 mm ahead of its wheels. That head start is the room it has to stop. The prediction: at slow speed it needs about 8 mm, and at full speed about 38 mm, so it should never fall.',
      'The experiment tests four speeds (25, 50, 75 and 100), 20 runs each, measuring how far the sensor goes past the edge and counting falls. If the numbers climb toward 62, the chart can predict the speed where Dusty would finally fall.',
    ],
    words: [
      ['Stopping distance', 'How far something travels after it starts to stop.'],
      ['Prediction', 'Your best guess before you test, and why. Also called a hypothesis.'],
    ],
    visual: 'stop',
    tryit: 'Roll a toy car down a ramp from low and from high. Mark where it stops each time. Which one needs more room?',
    fact: 'Cars that brake by themselves use the same idea: see the problem early enough to stop in time.',
  },
  {
    id: 'patterns',
    title: 'Search patterns: bounce or rows',
    big: 'Simple random driving works. Rows work better on a small spill.',
    body: [
      'The first Roomba had no map. It drove straight, turned a random amount at an obstacle, and drove again. Bounce around long enough and you cover the whole room. It sold about a million a year. That is Dusty’s button A.',
      'Spot Clean on button B sweeps a 1 foot square in rows, like mowing a lawn. The brush is 52 mm wide and the rows are 40 mm apart, so each row overlaps the last by 12 mm and no stripe is missed. 305 mm ÷ 40 mm is about 8 rows.',
      'The spill race: 5 grams of cereal in a taped square, Spot Clean against random bounce for the same time, then weigh what each caught.',
    ],
    words: [
      ['Algorithm', 'A step-by-step plan for solving a problem.'],
      ['Overlap', 'The part covered twice, so nothing gets missed.'],
    ],
    visual: 'spot',
    tryit: 'Draw a square on paper and cover it with a pencil in rows. Then cover another one by scribbling in random directions. Which looks cleaner?',
    fact: 'An expensive robot vacuum from 2002 mapped the room with sound, like a bat, and cost about seven times more than the Roomba.',
  },
  {
    id: 'fair-test',
    title: 'Running a fair test',
    big: 'Change one thing, measure what happens, and keep everything else the same.',
    body: [
      'In the speed test, the thing you change is motor speed. The things you measure are stopping distance in millimeters and falls out of 20. Everything else stays the same: the table, the charged power bank, the 3 mm sensor height, and the running start.',
      'To find an average, add up the runs and divide by how many there are. Then make a chart with speed along the bottom and stopping distance up the side.',
      'Saying "Dusty cleans pretty well" is an opinion. Saying "Dusty picked up 3.8 grams out of 5, which is 76 percent" is a measurement. Science runs on measurements.',
    ],
    words: [
      ['Variable you change', 'What you change on purpose (motor speed, or the search pattern).'],
      ['Variable you measure', 'What you count (millimeters to stop, falls, grams picked up).'],
      ['Controlled variables', 'Everything you keep the same (table, power bank, sensor height, light).'],
    ],
    visual: 'average',
    tryit: 'Write your prediction before any runs: "I think doubling the speed will make the stopping distance (more than / less than / exactly) double because..."',
    fact: 'Every run counts, even the bad ones. Only redo a run if something broke, and write down what happened.',
  },
  {
    id: 'engineering',
    title: 'How engineers invent',
    big: 'Ask, imagine, plan, create, test, improve. Then do it again.',
    body: [
      'Dusty has used every step: asking how to keep crumbs off the table, imagining a list of cleaning robots, planning the design, and now building it.',
      'Once a design is locked, changes go through a change order. It says what changes, why, what else it touches, and who said yes. Dusty has had two so far: the USB-C power bank (MOC-001) and Spot Clean on button B (MOC-002).',
      'Testing always finds problems. That is good. Keep notes and photos of what went wrong and how it got fixed. Judges love that.',
    ],
    words: [
      ['Prototype', 'The first one you build to find out what is wrong with the idea.'],
      ['Requirement', 'Something the invention must do, with a number and a reason.'],
      ['Change order', 'A written record of a change to a locked design, and why.'],
    ],
    tryit: 'Write down why you picked the table robot over the other cleaning robot ideas. That goes in the packet and on the board.',
    fact: 'The first design is almost never the final one. Dusty started as foam board and became a 3D printed robot.',
  },
];

const GLOSSARY = TOPICS.flatMap((t) => t.words).sort((a, b) => a[0].localeCompare(b[0]));

function Code() {
  const lines = [
    ['on button A pressed', 'text-naw-orange'],
    ['  read the table, set threshold', 'text-white/80'],
    ['forever', 'text-naw-orange'],
    ['  if a sensor reads above threshold', 'text-naw-cyan'],
    ['    stop both motors', 'text-white/80'],
    ['    back up, spin a random amount', 'text-white/80'],
    ['  else', 'text-naw-cyan'],
    ['    both motors forward at 40', 'text-yellow-300'],
  ];
  return (
    <pre className="bg-naw-dark rounded-xl border border-white/10 p-4 text-sm leading-6 overflow-x-auto">
      {lines.map(([l, c]) => (
        <div key={l} className={c}>{l}</div>
      ))}
    </pre>
  );
}

function Pwm() {
  const rows = [['25%', 25], ['40%', 40], ['75%', 75]];
  return (
    <div className="space-y-3">
      <div className="text-white/60 text-xs">Power on (bright) and off (dark), one short slice of time</div>
      {rows.map(([label, pct]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-10 text-white text-sm tabular-nums">{label}</span>
          <div className="flex-1 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-5 rounded bg-white/5 overflow-hidden">
                <div className="h-5 bg-naw-orange" style={{ width: `${pct}%` }} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-white/40 text-xs">The real board does this hundreds of times every second.</p>
    </div>
  );
}

function Reflect() {
  const rows = [
    ['White or light surface', '60 to 80%', 70, 'bg-yellow-300'],
    ['Black surface', '10 to 20%', 15, 'bg-naw-orange'],
    ['Past the table edge', 'almost none', 2, 'bg-naw-pink'],
  ];
  return (
    <div className="space-y-2">
      <div className="text-white/60 text-xs">How much infrared light bounces back</div>
      {rows.map(([label, val, v, c]) => (
        <div key={label}>
          <div className="flex justify-between text-xs text-white/60"><span>{label}</span><span>{val}</span></div>
          <div className="h-3 rounded-full bg-white/5 mt-1"><div className={`h-3 rounded-full ${c}`} style={{ width: `${Math.max(v, 2)}%` }} /></div>
        </div>
      ))}
      <p className="text-white/40 text-xs">A black placemat is much closer to a cliff than white paper is.</p>
    </div>
  );
}

function Numbers() {
  const x = (v) => 10 + (v / 1023) * 300;
  return (
    <svg viewBox="0 0 320 120" className="w-full max-w-sm" role="img" aria-label="Number line from 0 to 1023: table reads 200, threshold 400, edge reads 900">
      <rect x="10" y="50" width={x(400) - 10} height="14" rx="3" fill="#06b6d4" fillOpacity=".35" />
      <rect x={x(400)} y="50" width={310 - x(400)} height="14" rx="3" fill="#ec4899" fillOpacity=".35" />
      <text x="14" y="44" fill="#06b6d4" fontSize="11">table</text>
      <text x="306" y="44" fill="#ec4899" fontSize="11" textAnchor="end">cliff</text>
      <line x1={x(400)} y1="30" x2={x(400)} y2="76" stroke="#f59e0b" strokeWidth="2" />
      <text x={x(400)} y="24" fill="#f59e0b" fontSize="11" textAnchor="middle">threshold 400</text>
      <circle cx={x(200)} cy="57" r="5" fill="#fde047" />
      <text x={x(200)} y="92" fill="#fde047" fontSize="11" textAnchor="middle">table 200</text>
      <circle cx={x(900)} cy="57" r="5" fill="#fde047" />
      <text x={x(900)} y="92" fill="#fde047" fontSize="11" textAnchor="middle">edge 900</text>
      <text x="10" y="114" fill="#ffffff" fillOpacity=".5" fontSize="11">0</text>
      <text x="310" y="114" fill="#ffffff" fillOpacity=".5" fontSize="11" textAnchor="end">1023</text>
      <text x="160" y="114" fill="#ffffff" fillOpacity=".5" fontSize="11" textAnchor="middle">threshold = table + 200</text>
    </svg>
  );
}

function Gears() {
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 300 120" className="w-full max-w-sm" role="img" aria-label="Motor gear 12 teeth drives big gear 36 teeth; small gear 10 teeth on the big gear drives roller gear 18 teeth">
        <circle cx="40" cy="60" r="16" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 3" />
        <text x="40" y="64" fill="#f59e0b" fontSize="11" textAnchor="middle">12</text>
        <circle cx="112" cy="60" r="48" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="4 3" />
        <circle cx="112" cy="60" r="14" fill="none" stroke="#fde047" strokeWidth="3" strokeDasharray="4 3" />
        <text x="112" y="30" fill="#06b6d4" fontSize="11" textAnchor="middle">36</text>
        <text x="112" y="64" fill="#fde047" fontSize="11" textAnchor="middle">10</text>
        <circle cx="152" cy="60" r="26" fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="4 3" />
        <text x="152" y="64" fill="#ec4899" fontSize="11" textAnchor="middle">18</text>
        <text x="40" y="100" fill="#ffffff" fillOpacity=".6" fontSize="10" textAnchor="middle">motor</text>
        <text x="160" y="100" fill="#ffffff" fillOpacity=".6" fontSize="10" textAnchor="middle">roller</text>
        <text x="228" y="56" fill="#ffffff" fontSize="12">36 ÷ 12 = 3</text>
        <text x="228" y="74" fill="#ffffff" fontSize="12">18 ÷ 10 = 1.8</text>
      </svg>
      <div className="text-white text-sm tabular-nums">3 × 1.8 = <b className="text-yellow-300">5.4 times slower</b>, about 5.4 times stronger</div>
    </div>
  );
}

function Stop() {
  const rows = [
    ['Slow (prediction)', 8, 'bg-naw-cyan'],
    ['Full speed (prediction)', 38, 'bg-naw-orange'],
    ['Head start it has', 62, 'bg-naw-pink'],
  ];
  return (
    <div className="space-y-2">
      <div className="text-white/60 text-xs">Millimeters to stop</div>
      {rows.map(([label, mm, c]) => (
        <div key={label}>
          <div className="flex justify-between text-xs text-white/60"><span>{label}</span><span className="tabular-nums">{mm} mm</span></div>
          <div className="h-3 rounded-full bg-white/5 mt-1"><div className={`h-3 rounded-full ${c}`} style={{ width: `${(mm / 62) * 100}%` }} /></div>
        </div>
      ))}
      <p className="text-white/40 text-xs">If a bar ever reaches the pink one, Dusty falls.</p>
    </div>
  );
}

function Spot() {
  // 8 rows across a 1 ft square, boustrophedon
  const s = 200;
  const o = 20;
  const gap = s / 8;
  let d = '';
  for (let i = 0; i < 8; i++) {
    const y = o + s - gap / 2 - i * gap;
    const [a, b] = i % 2 === 0 ? [o + 8, o + s - 8] : [o + s - 8, o + 8];
    d += `${i === 0 ? 'M' : 'L'}${a} ${y} L${b} ${y} `;
  }
  return (
    <svg viewBox="0 0 240 250" className="w-full max-w-[16rem]" role="img" aria-label="Spot Clean path: 8 back-and-forth rows filling a 1 foot square">
      <rect x={o} y={o} width={s} height={s} fill="none" stroke="#ffffff" strokeOpacity=".35" strokeDasharray="5 4" />
      <path d={d} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" />
      <circle cx={o + 8} cy={o + s - gap / 2} r="6" fill="#fde047" />
      <text x={o} y={o + s + 18} fill="#fde047" fontSize="11">start</text>
      <text x={o + s} y={o + s + 18} fill="#ffffff" fillOpacity=".55" fontSize="11" textAnchor="end">1 ft square, 8 rows</text>
    </svg>
  );
}

function Average() {
  const runs = [3.6, 4.0, 3.8];
  return (
    <div>
      <div className="text-white/60 text-xs">Example: grams picked up out of 5, three tries</div>
      <div className="flex items-end gap-3 h-24 mt-2">
        {runs.map((r, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="w-full rounded-t bg-naw-orange/70" style={{ height: `${(r / 5) * 100}%` }} />
            <span className="text-white/50 text-xs mt-1 tabular-nums">{r.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <div className="text-white text-sm mt-2 tabular-nums">
        3.6 + 4.0 + 3.8 = 11.4, and 11.4 ÷ 3 = <b className="text-yellow-300">3.8 g</b>
      </div>
      <div className="text-white/60 text-xs mt-1 tabular-nums">3.8 ÷ 5 = 0.76, so Dusty caught 76%</div>
    </div>
  );
}

const VISUALS = { code: Code, pwm: Pwm, reflect: Reflect, numbers: Numbers, gears: Gears, stop: Stop, spot: Spot, average: Average };

function Btn({ href, children, primary, internal }) {
  const cls = `${
    primary ? 'bg-naw-orange text-naw-dark hover:bg-naw-orange/90' : 'bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25'
  } inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors`;
  return internal ? <Link href={href} className={cls}>{children}</Link> : <a href={href} className={cls}>{children}</a>;
}

export default function DustyLearnPage() {
  return (
    <div className="min-h-screen">
      <Nav current="learn" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-300/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-6">
          <Back />
          <h1 className="font-game text-2xl sm:text-3xl glow mt-5">
            <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">LEARN THE SCIENCE</span>
          </h1>
          <p className="text-white text-lg font-semibold mt-4 leading-snug">
            Every part of Dusty is real science. Here is how each piece works, words to know, and something to try.
          </p>
          <p className="text-white/55 text-sm mt-2">Good for the packet, the board, the judges&apos; questions, and the build.</p>
          <nav className="mt-6 flex flex-wrap gap-2">
            {TOPICS.map((t, i) => (
              <a key={t.id} href={`#${t.id}`} className="bg-naw-card border border-white/10 hover:border-yellow-300/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">
                <span className="text-yellow-300 font-bold">{i + 1}</span> {t.title}
              </a>
            ))}
            <a href="#words" className="bg-naw-card border border-white/10 hover:border-yellow-300/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">
              All the words
            </a>
          </nav>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {TOPICS.map((t, i) => {
          const V = t.visual && VISUALS[t.visual];
          return (
            <section key={t.id} id={t.id} className="mt-10 scroll-mt-4">
              <div className="flex items-baseline gap-3">
                <span className="flex-none w-10 h-10 rounded-xl bg-yellow-300 text-naw-dark font-bold text-lg flex items-center justify-center">{i + 1}</span>
                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold">{t.title}</h2>
                  <p className="text-yellow-300 text-sm font-semibold">{t.big}</p>
                </div>
              </div>

              <div className="mt-4 bg-naw-card rounded-2xl border border-white/10 p-5">
                <div className={V ? 'grid md:grid-cols-[1fr_18rem] gap-6' : ''}>
                  <div className="space-y-3">
                    {t.body.map((p, j) => (
                      <p key={j} className="text-white/80 text-[15px] leading-relaxed">{p}</p>
                    ))}
                  </div>
                  {V && (
                    <div className="self-center">
                      <V />
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {t.words.map(([w, d]) => (
                    <div key={w} className="rounded-xl bg-white/5 px-3 py-2 text-sm max-w-xs">
                      <span className="text-naw-cyan font-semibold">{w}: </span>
                      <span className="text-white/70">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="rounded-2xl border border-naw-orange/40 bg-naw-orange/10 p-4">
                  <div className="text-naw-orange text-xs font-semibold">Try it</div>
                  <div className="text-white text-sm mt-1">{t.tryit}</div>
                </div>
                <div className="rounded-2xl border border-naw-cyan/40 bg-naw-cyan/10 p-4">
                  <div className="text-naw-cyan text-xs font-semibold">Did you know?</div>
                  <div className="text-white text-sm mt-1">{t.fact}</div>
                </div>
              </div>
            </section>
          );
        })}

        <section id="words" className="mt-12 scroll-mt-4">
          <h2 className="text-white text-xl sm:text-2xl font-bold">All the words</h2>
          <p className="text-white/50 text-sm mt-1">Use these in the packet, on the board, and when the judges ask questions.</p>
          <div className="mt-5 bg-naw-card rounded-2xl border border-white/10 divide-y divide-white/5">
            {GLOSSARY.map(([w, d]) => (
              <div key={w} className="px-4 py-2.5 grid sm:grid-cols-[12rem_1fr] gap-x-4 text-sm">
                <span className="text-white font-semibold">{w}</span>
                <span className="text-white/60">{d}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Btn href={`${BASE}/build`} primary internal>Build it</Btn>
            <Btn href={`${BASE}/research`} internal>Research notes</Btn>
            <Btn href={`${BASE}/packet`} internal>Packet guide</Btn>
            <Btn href={`${BASE}/invention#experiment`} internal>The experiment</Btn>
          </div>
        </section>
      </div>
    </div>
  );
}

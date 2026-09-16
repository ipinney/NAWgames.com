import { BASE, PLAN, meta, Nav, Back, Btn, Title } from '../ui';

export const metadata = meta(
  'MS-2000: learn the science',
  'How a laser mosquito turret works, for kids: mosquitoes, lasers and laser safety, how a camera learns, servos and aiming, sensors and circuits, sound, pendulums, and how to run a fair test.',
  `${BASE}/learn`
);

const TOPICS = [
  {
    id: 'mosquitoes',
    title: 'Mosquitoes',
    big: 'The tiny bug that is the deadliest animal on Earth.',
    body: [
      'There are more than 3,500 kinds of mosquitoes. Only the females bite. They need the protein in blood to make their eggs. Males drink flower nectar.',
      'Mosquitoes find people by smelling the carbon dioxide we breathe out, then following our body heat and skin smell.',
      'Some mosquitoes carry germs that cause malaria, dengue, and Zika. Malaria alone kills about 600,000 people a year, most of them young children. That is why scientists keep inventing new ways to stop mosquitoes.',
    ],
    words: [
      ['Species', 'One kind of living thing.'],
      ['Disease', 'An illness. Some are spread by germs that ride inside mosquitoes.'],
    ],
    tryit: 'The buzz you hear is a mosquito\u2019s wings beating about 500 times every second. Count how many times you can flap your arms in one second.',
    fact: 'A mosquito flies about 1 mile per hour. You walk about 3 times faster.',
  },
  {
    id: 'lasers',
    title: 'Light and lasers',
    big: 'A laser makes light that is one color and stays in a narrow beam.',
    body: [
      'A flashlight sprays light in every direction and in many colors mixed together. A laser makes light that is all one color and all goes the same way, so the beam stays thin even far away.',
      'Our laser is red, with a wavelength of 650 nanometers. Laser power is measured in watts. Our laser is less than 1 milliwatt, which is less than one thousandth of a watt.',
      'Lasers are sorted into safety classes. Class 2 lasers are visible and under 1 milliwatt. If one flashes in your eye by accident, you blink in about a quarter of a second, and that protects you. You should still never look into any laser.',
    ],
    words: [
      ['Laser', 'Stands for Light Amplification by Stimulated Emission of Radiation.'],
      ['Watt', 'A unit that measures power. A small night light uses about 1 watt.'],
      ['Milliwatt', 'One thousandth of a watt.'],
    ],
    visual: 'power',
    tryit: 'In a dark room, shine a flashlight at a wall from across the room. Look how wide the spot gets. A laser dot would stay about as small as a pea.',
    fact: 'The first laser was built in 1960. Now lasers are in barcode scanners, printers, and car headlights.',
  },
  {
    id: 'real-turret',
    title: 'The real laser fence',
    big: 'Scientists already built a machine that shoots mosquitoes with lasers.',
    body: [
      'Engineers at a lab called Intellectual Ventures built the Photonic Fence. Cameras watch the air, a computer finds each flying bug, and a laser zaps the mosquitoes. It can even tell a mosquito from a bee by how fast its wings beat.',
      'In 2020, scientists measured how much laser light it takes to kill a mosquito. Using their numbers, a laser would need about 14 watts to kill one in a quick 25 millisecond flash.',
      'The MS-2000 uses 0.001 watts. 14 divided by 0.001 is 14,000. So our laser is about 14,000 times too weak to hurt a mosquito. That is on purpose. Instead of killing it, the MS-2000 proves it could hit it, every time.',
    ],
    words: [
      ['Prototype', 'A first working model of an invention, used to test the idea.'],
      ['Lethal', 'Strong enough to kill.'],
    ],
    tryit: 'Multiply it out: if 1 milliwatt were 1 step, how many steps would 14 watts be? (Answer: 14,000 steps. That is about 5 miles of kid steps.)',
    fact: 'A 14 watt laser is Class 4, the most dangerous class. Science fairs do not allow them.',
  },
  {
    id: 'camera',
    title: 'How a camera learns',
    big: 'The HuskyLens learns what the mosquito looks like from examples.',
    body: [
      'A camera picture is made of tiny colored dots called pixels. The HuskyLens sees a picture 320 pixels wide and 240 pixels tall, many times every second.',
      'When you press its learn button, it studies the mosquito from lots of pictures. After that it can find the mosquito in new pictures and draw a box around it. Learning from examples instead of being told exact rules is called machine learning.',
      'The HuskyLens tells the micro:bit where the middle of the box is. The middle of the whole screen is at 160 across and 120 down. If the mosquito is at 200 across, it is 40 pixels to the right of center.',
    ],
    words: [
      ['Pixel', 'One tiny dot in a digital picture.'],
      ['Machine learning', 'A computer learning a pattern from examples.'],
      ['Coordinates', 'Two numbers that say where something is: across, then down.'],
    ],
    visual: 'screen',
    tryit: 'Teach the HuskyLens a toy. Then show it a different toy. Does it get fooled? Teach it from more sides and try again.',
    fact: 'The camera works best with good light and a plain background. That is why the MS-2000 uses a black backdrop.',
  },
  {
    id: 'aiming',
    title: 'Aiming with servos',
    big: 'Two servos point the head: one turns left and right, one tilts up and down.',
    body: [
      'A servo is a small motor that turns to an exact angle, from 0 to 180 degrees, and holds it there. Turning left and right is called pan. Turning up and down is called tilt.',
      'The micro:bit aims with a feedback loop. It looks where the mosquito is, turns a little toward it, looks again, and turns again, many times a second. The farther off center the mosquito is, the bigger the turn. When it is close to the middle, the turret fires.',
      'Our servos have a clutch inside. If someone grabs the turret, the clutch slips instead of breaking the gears.',
    ],
    words: [
      ['Degree', 'A unit for measuring turns. A full circle is 360 degrees.'],
      ['Feedback loop', 'Check, adjust, check again, over and over.'],
      ['Pan and tilt', 'Left and right, and up and down.'],
    ],
    tryit: 'Close your eyes, have someone hold up a toy, open your eyes and point at it. You just did a feedback loop: look, move, check.',
    fact: 'Security cameras, telescopes, and movie cameras all use pan and tilt heads.',
  },
  {
    id: 'brain',
    title: 'The brains: micro:bit and code',
    big: 'Code is a list of steps a computer follows exactly, in order.',
    body: [
      'The MS-2000 has two micro:bits. The turret one reads the camera, moves the servos, and fires the laser. The wand one feels hits, flashes the eyes, and saves the data. They talk to each other by radio.',
      'The code uses three big ideas. A loop repeats steps forever. An if checks something and decides what to do. A variable is a box that remembers a number, like how many hits so far.',
      'The laser is switched by a relay. A relay is a switch flipped by a small electromagnet. Listen for the click when it fires.',
    ],
    words: [
      ['Loop', 'Steps that repeat.'],
      ['If / then', 'A decision: if this is true, then do that.'],
      ['Variable', 'A named box that holds a number.'],
    ],
    visual: 'code',
    tryit: 'Write the turret steps on paper as if/then sentences, like "if the mosquito is right of center, then turn right."',
    fact: 'The micro:bit radio can reach about 20 meters, farther than the whole science fair table.',
  },
  {
    id: 'sensor',
    title: 'Proving a hit',
    big: 'A light sensor inside the mosquito turns light into a number.',
    body: [
      'The light sensor lets more electricity through when more light shines on it. The micro:bit reads that as a number from 0, fully dark, up to 1023, very bright.',
      'The front of the mosquito pod is thin white plastic. When the laser dot lands on it, the whole cup glows, and the sensor inside sees the number jump. The code picks a threshold: a number higher than the room light but lower than a laser hit. Above the threshold means HIT.',
      'On a hit, two red LEDs flash as the mosquito\u2019s eyes. Each LED has a 220 ohm resistor so too much electricity cannot burn it out.',
    ],
    words: [
      ['Sensor', 'A part that notices something, like light, and turns it into a signal.'],
      ['Threshold', 'The line between yes and no.'],
      ['Circuit', 'A complete loop that electricity flows around.'],
      ['Resistor', 'A part that slows down electricity.'],
    ],
    tryit: 'With the wand code running, read the number in room light, with the lamp off, and with the laser on the pod. Write all three down. Pick your threshold.',
    fact: 'Because the light level is saved on every run, the data can show if a bright room made hits harder to notice.',
  },
  {
    id: 'sound',
    title: 'Sound effects',
    big: 'Sound is air shaking. Faster shaking makes a higher pitch.',
    body: [
      'A speaker has a paper or plastic cone that moves back and forth very fast. That pushes the air, and the air carries the shaking to your ears.',
      'How many times it shakes each second is called frequency, measured in hertz. A low boom is slow shaking. A high beep is fast shaking. A laser pew is a high pitch that slides down quickly.',
      'The MS-2000 plays a pew or a boom when it fires (you pick with a button), a beep when it locks on, a splat on the wand when it hits, and a victory song at the end.',
    ],
    words: [
      ['Frequency', 'How many times something shakes each second.'],
      ['Hertz', 'The unit for frequency. 1 hertz is one shake per second.'],
      ['Pitch', 'How high or low a sound is.'],
    ],
    tryit: 'In MakeCode, play a tone at 500 hertz. That is close to a mosquito buzz. Now try 100 and 2000.',
    fact: 'People can hear from about 20 hertz up to about 20,000 hertz. Many grown-ups cannot hear the highest ones anymore.',
  },
  {
    id: 'pendulum',
    title: 'The pendulum: making speed',
    big: 'The higher you pull it back, the faster it swings through the bottom.',
    body: [
      'To test a fast mosquito and a slow one, the mosquito hangs from a line and swings like a pendulum. Pulling it back to a higher angle gives it more energy, so it moves faster at the bottom of the swing.',
      'The pivot has marks at 10, 20, and 30 degrees, so every run starts from exactly the same place. That makes the test fair.',
      'Here is something neat: at these small angles, the time for one swing stays almost the same. Only the speed changes. Galileo discovered this more than 400 years ago.',
    ],
    words: [
      ['Pendulum', 'A weight that swings back and forth from a fixed point.'],
      ['Energy', 'What something needs to move or change.'],
    ],
    visual: 'pendulum',
    tryit: 'Swing the mosquito from 10 degrees and from 30. Count swings in 10 seconds each time. Are the counts close?',
    fact: 'Pendulums kept time in clocks for almost 300 years.',
  },
  {
    id: 'fair-test',
    title: 'Running a fair test',
    big: 'Change one thing, measure what happens, and keep everything else the same.',
    body: [
      'The main question is: does a faster mosquito get hit less? There are three tests: speed (10, 20, 30 degrees), distance (3, 5, 7 feet), and light (room lights, one lamp, lights off).',
      'Each setting gets 5 runs, and each run lasts 30 seconds. 3 tests, 3 settings each, 5 runs each: 3 × 3 × 5 = 45 runs. The wand saves the test, setting, run number, hits, time to first hit, and light level for every run.',
      'To find the average, add up the 5 runs and divide by 5. Then make one bar graph for each test, with one bar for each setting.',
    ],
    words: [
      ['Variable you change', 'What you change on purpose (the swing angle).'],
      ['Variable you measure', 'What you count (hits, and time to first hit).'],
      ['Controlled variables', 'Everything you keep the same (room, batteries, who holds the line).'],
      ['Hypothesis', 'Your best guess before you test, and why.'],
    ],
    visual: 'average',
    tryit: 'Write your hypothesis now, before any runs: "I think a faster mosquito will get hit (more / less / the same) because..."',
    fact: 'Every run counts, even the bad ones. Only redo a run if something broke, and write down what happened.',
  },
  {
    id: 'engineering',
    title: 'How engineers invent',
    big: 'Ask, imagine, plan, create, test, improve. Then do it again.',
    body: [
      'Engineers follow a loop called the engineering design process. The MS-2000 has used every step: asking how to stop mosquitoes, imagining an air cannon, a vacuum, and lasers, planning three designs and picking one, and now creating it.',
      'Testing always finds problems. That is good. Each problem fixed makes the invention better. Keep notes and photos of what went wrong and how it got fixed; judges love that.',
    ],
    words: [
      ['Requirement', 'Something the invention must do.'],
      ['Trade-off', 'Giving up a little of one thing to get more of another.'],
    ],
    tryit: 'Write down why you picked Design A over B and C. That goes on the board.',
    fact: 'The first design is almost never the final one. The MS-2000 plan was rewritten six times before anything was printed.',
  },
];

const GLOSSARY = TOPICS.flatMap((t) => t.words).sort((a, b) => a[0].localeCompare(b[0]));

function PowerBars() {
  // log scale: 1 mW to 14 W
  const rows = [
    ['MS-2000 laser', '0.001 W', 1, 'bg-lime-300'],
    ['Class 3R limit', '0.005 W', 5, 'bg-naw-orange'],
    ['Enough to kill a mosquito', '14 W', 14000, 'bg-naw-pink'],
  ];
  const w = (v) => `${Math.max(3, (Math.log10(v) / Math.log10(14000)) * 100)}%`;
  return (
    <div className="space-y-2">
      {rows.map(([label, val, v, c]) => (
        <div key={label}>
          <div className="flex justify-between text-xs text-white/60"><span>{label}</span><span className="tabular-nums">{val}</span></div>
          <div className="h-3 rounded-full bg-white/5 mt-1"><div className={`h-3 rounded-full ${c}`} style={{ width: w(v) }} /></div>
        </div>
      ))}
      <p className="text-white/40 text-xs">Each step along the bar is 10 times more power.</p>
    </div>
  );
}

function Screen() {
  return (
    <svg viewBox="0 0 340 270" className="w-full max-w-sm" role="img" aria-label="Camera screen 320 by 240 with the center at 160, 120 and the mosquito 40 pixels to the right">
      <rect x="10" y="10" width="320" height="240" rx="6" fill="#0d1b2e" stroke="#06b6d4" strokeOpacity=".5" />
      <line x1="170" y1="10" x2="170" y2="250" stroke="#ffffff" strokeOpacity=".15" strokeDasharray="4 4" />
      <line x1="10" y1="130" x2="330" y2="130" stroke="#ffffff" strokeOpacity=".15" strokeDasharray="4 4" />
      <circle cx="170" cy="130" r="4" fill="#bef264" />
      <text x="176" y="146" fill="#bef264" fontSize="11">center 160, 120</text>
      <rect x="192" y="96" width="36" height="36" fill="none" stroke="#ec4899" strokeWidth="2" />
      <circle cx="210" cy="114" r="3" fill="#ec4899" />
      <text x="192" y="90" fill="#ec4899" fontSize="11">mosquito 200, 104</text>
      <line x1="174" y1="114" x2="203" y2="114" stroke="#f59e0b" strokeWidth="2" />
      <text x="166" y="110" fill="#f59e0b" fontSize="11" textAnchor="end">40 right, 16 up</text>
      <text x="14" y="266" fill="#ffffff" fillOpacity=".5" fontSize="11">320 pixels wide × 240 tall</text>
    </svg>
  );
}

function Code() {
  const lines = [
    ['forever', 'text-naw-pink'],
    ['  if camera sees the mosquito', 'text-naw-cyan'],
    ['    turn pan toward it a little', 'text-white/80'],
    ['    turn tilt toward it a little', 'text-white/80'],
    ['    if it is near the center', 'text-naw-cyan'],
    ['      fire the laser, play pew', 'text-lime-300'],
    ['    else', 'text-naw-cyan'],
    ['      laser off', 'text-white/80'],
  ];
  return (
    <pre className="bg-naw-dark rounded-xl border border-white/10 p-4 text-sm leading-6 overflow-x-auto">
      {lines.map(([l, c]) => (
        <div key={l} className={c}>{l}</div>
      ))}
    </pre>
  );
}

function Pendulum() {
  const rows = [['10°', 1], ['20°', 2], ['30°', 3]];
  return (
    <div className="space-y-2">
      <div className="text-white/60 text-xs">Speed at the bottom of the swing</div>
      {rows.map(([a, x]) => (
        <div key={a} className="flex items-center gap-3">
          <span className="w-9 text-white text-sm tabular-nums">{a}</span>
          <div className="flex-1 h-4 rounded-full bg-white/5"><div className="h-4 rounded-full bg-naw-cyan" style={{ width: `${x * 33}%` }} /></div>
          <span className="w-16 text-white/70 text-sm">{x === 1 ? 'slow' : `${x}× faster`}</span>
        </div>
      ))}
      <p className="text-white/40 text-xs">Twice the angle, about twice the speed. Three times, about three times.</p>
    </div>
  );
}

function Average() {
  const runs = [4, 5, 3, 4, 4];
  return (
    <div>
      <div className="text-white/60 text-xs">Example: hits in 5 runs at 10 degrees</div>
      <div className="flex items-end gap-2 h-24 mt-2">
        {runs.map((r, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="w-full rounded-t bg-naw-pink/70" style={{ height: `${r * 18}%` }} />
            <span className="text-white/50 text-xs mt-1">{r}</span>
          </div>
        ))}
      </div>
      <div className="text-white text-sm mt-2 tabular-nums">4 + 5 + 3 + 4 + 4 = 20, and 20 ÷ 5 = <b className="text-lime-300">4 hits</b> on average</div>
    </div>
  );
}

const VISUALS = { power: PowerBars, screen: Screen, code: Code, pendulum: Pendulum, average: Average };

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      <Nav current="learn" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-300/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-8">
          <Back href={BASE}>MS-2000</Back>
          <div className="mt-6">
            <Title size="text-2xl sm:text-3xl">LEARN THE SCIENCE</Title>
          </div>
          <p className="text-white text-lg font-semibold mt-4 leading-snug">
            Everything inside the MS-2000 is real science. Here is how each part works, words to know, and something to try.
          </p>
          <p className="text-white/55 text-sm mt-2">Good for the board, for judges&apos; questions, and for the build.</p>
          <nav className="mt-6 flex flex-wrap gap-2">
            {TOPICS.map((t, i) => (
              <a key={t.id} href={`#${t.id}`} className="bg-naw-card border border-white/10 hover:border-lime-300/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">
                <span className="text-lime-300 font-bold">{i + 1}</span> {t.title}
              </a>
            ))}
            <a href="#words" className="bg-naw-card border border-white/10 hover:border-lime-300/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">
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
                <span className="flex-none w-10 h-10 rounded-xl bg-lime-300 text-naw-dark font-bold text-lg flex items-center justify-center">{i + 1}</span>
                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold">{t.title}</h2>
                  <p className="text-lime-300 text-sm font-semibold">{t.big}</p>
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
                <div className="rounded-2xl border border-naw-pink/40 bg-naw-pink/10 p-4">
                  <div className="text-naw-pink text-xs font-semibold">Try it</div>
                  <div className="text-white text-sm mt-1">{t.tryit}</div>
                </div>
                <div className="rounded-2xl border border-naw-orange/40 bg-naw-orange/10 p-4">
                  <div className="text-naw-orange text-xs font-semibold">Did you know?</div>
                  <div className="text-white text-sm mt-1">{t.fact}</div>
                </div>
              </div>
            </section>
          );
        })}

        <section id="words" className="mt-12 scroll-mt-4">
          <h2 className="text-white text-xl sm:text-2xl font-bold">All the words</h2>
          <p className="text-white/50 text-sm mt-1">Use these on the board and when the judges ask questions.</p>
          <div className="mt-5 bg-naw-card rounded-2xl border border-white/10 divide-y divide-white/5">
            {GLOSSARY.map(([w, d]) => (
              <div key={w} className="px-4 py-2.5 grid sm:grid-cols-[12rem_1fr] gap-x-4 text-sm">
                <span className="text-white font-semibold">{w}</span>
                <span className="text-white/60">{d}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Btn href={`${BASE}/build`} primary>Build it</Btn>
            <Btn href={`${PLAN}#experiment`}>Experiment rules in the full plan</Btn>
          </div>
        </section>
      </div>
    </div>
  );
}

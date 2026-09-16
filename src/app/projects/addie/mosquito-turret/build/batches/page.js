import { BASE, CAD, meta, Nav, Back, Btn, Title, Steps } from '../../ui';

export const metadata = meta(
  'MS-2000: print and build plan',
  'Five print batches for the Flashforge Adventurer 5M, what to learn while each one prints, and the build steps each batch unlocks.',
  `${BASE}/build/batches`
);

const PL = `${CAD}/plates`;

const SETTINGS = [
  ['Printer', 'Flashforge Adventurer 5M, 0.4 mm nozzle, textured PEI plate'],
  ['Software', 'Open the .3mf in Flash Studio (or OrcaSlicer). Every setting below is already saved in it. Slice, then send it to the printer.'],
  ['Material', 'Generic PLA. Any color, except batch 1, which must be white.'],
  ['Layers', '0.2 mm, 3 walls, 15% gyroid infill'],
  ['Brim', '5 mm, except none on the pivot pin and the cable clips'],
  ['Supports', 'Off. Nothing needs them.'],
];

const BEFORE = [
  ['Unbox everything and check it against the shopping list.', ''],
  ['Measure the Xia mi board, a servo, the wand battery pack, the arm switch, the power bank, the in-line switch, and the charge port with calipers.', 'The print files use numbers from datasheets and photos. If a part is off by more than half a millimeter, the files get fixed before printing.'],
  ['Sort the M2 screws by length into cups.', ''],
];

const BATCHES = [
  {
    n: 1,
    plate: 4,
    stem: 'ms2000-plate-4-white',
    title: 'The white pod and cable clips',
    time: 'About 35 minutes',
    grams: 11,
    pieces: 'Sensor pod front (the white cup) and 11 cable clips',
    why: 'Short and small, so it is a good first test of the printer. It has to be white: white plastic lets light spread through it, so the whole cup glows when the laser dot lands anywhere on its face.',
    white: true,
    learn: {
      title: 'Why white?',
      items: [
        ['Hold a flashlight behind a white sheet of paper, then a black one.', 'Which one lets light through? White scatters light. Black soaks it up and turns it into a tiny bit of heat.'],
        ['Write down what you saw. That is your first science note.', ''],
      ],
    },
    after: [
      ['Peel the cup off the bed and hold it up to a lamp.', 'The face should glow evenly. If you can see holes, a grown-up prints it again a little slower.'],
      ['Snap a cable clip onto a piece of fishing line.', 'It should slide along the line without falling off.'],
      ['Put the cup and clips in a bag labeled MOSQUITO.', ''],
    ],
    gate: 'The cup glows and the clips hold the line.',
    build: [],
  },
  {
    n: 2,
    plate: 3,
    stem: 'ms2000-plate-3-turret-and-wand',
    title: 'Turret head, turntable, and wand',
    time: 'About 3.5 hours',
    grams: 77,
    pieces: 'Turntable and tilt yoke, camera and laser head, pivot pin, wand handle, sensor pod back',
    why: 'The moving parts of the turret, plus the wand and the back of the pod. After this batch the mosquito and wand can be built.',
    learn: {
      title: 'Meet the micro:bit',
      items: [
        ['Open makecode.microbit.org and make the micro:bit show a heart when you press button A.', 'Code is a list of steps the computer follows exactly.'],
        ['Add "show number light level" inside a forever loop. Cover the LEDs with your hand.', 'The number goes down in the dark. The light sensor in the mosquito works the same way.'],
      ],
    },
    after: [
      ['Pop the parts off and peel away the brim.', ''],
      ['Push the pivot pin through the left side of the yoke.', 'It should turn without wobbling.'],
      ['Press the pod back into the white cup.', 'It should fit snug.'],
      ['Set the micro:bit on the wand handle.', 'The holes in the micro:bit edge line up with the round bosses.'],
    ],
    gate: 'The pin turns and the pod closes. The mosquito and wand can be built now.',
    build: [
      [1, 'Check the parts'],
      [2, 'Make the mosquito'],
      [3, 'Make the wand'],
    ],
  },
  {
    n: 3,
    plate: 1,
    stem: 'ms2000-plate-1-base-shell',
    title: 'Base shell',
    time: 'About 3 hours 15 minutes',
    grams: 131,
    pieces: 'The base shell, printed upside down',
    why: 'The biggest part. It prints upside down so the deck the turntable sits on comes out flat.',
    learn: {
      title: 'Teach a camera',
      items: [
        ['Plug the HuskyLens into a USB power bank. Pick Object Tracking on its screen.', 'HuskyLens can run on USB power by itself, no board needed.'],
        ['Point it at a toy and press the learn button. Move the toy around.', 'A box follows the toy. The camera learned what it looks like from the pictures it took.'],
      ],
    },
    after: [
      ['Let the bed cool, then lift the shell off and peel away the brim.', ''],
      ['Check the charge port and the in-line switch line up with their holes in the right wall.', 'The power bank sits inside now, so there is no side bay. Its cradle is on the floor plate in batch 4.'],
      ['Check the arm switch and speaker fit their holes in the back wall.', ''],
    ],
    gate: 'The charge port and switch fit the right wall.',
    build: [],
  },
  {
    n: 4,
    plate: 2,
    stem: 'ms2000-plate-2-floor-and-foot',
    title: 'Floor plate and one backdrop foot',
    time: 'About 1 hour 55 minutes',
    grams: 72,
    pieces: 'Floor plate and one backdrop foot',
    why: 'The floor closes up the base, so after this batch the whole turret can be built.',
    learn: {
      title: 'Make a servo move',
      items: [
        ['Plug a servo into the board and code it: servo to 0, pause, servo to 180.', 'A servo turns to the exact angle you ask for, then holds it.'],
        ['Try 90. Where does it point?', 'Pan means turning left and right. Tilt means turning up and down.'],
      ],
    },
    after: [
      ['Screw the Xia mi board onto the floor posts.', 'If the holes do not line up, the floor gets reprinted with the measured spacing.'],
      ['Check the power bank drops into its cradle on the right half, ports facing the front.', 'The strap goes through the two slots in the floor.'],
      ['Screw the floor into the shell from underneath.', ''],
    ],
    gate: 'The board and power bank fit the floor, and the floor fits the shell.',
    learn2: {
      title: 'How a power bank works',
      items: [
        ['Plug the power bank into a USB-C phone charger and watch its four lights.', 'Each light is about a quarter full. When all four stay on, it is charged. Inside the turret the lights are hidden, so charge it before every session.'],
        ['Why does a power bank make the speed test fairer than AA batteries?', 'Batteries slowly lose voltage as they drain, so servos slow down. The bank gives a steady 5 volts, so the servos move at the same speed on run 1 and run 30.'],
      ],
    },
    build: [
      [4, 'Build the base'],
      [5, 'Build the pan and tilt head'],
      [6, 'Teach the camera'],
      [8, 'Code the turret'],
      [9, 'Add the sounds'],
    ],
  },
  {
    n: 5,
    plate: 5,
    stem: 'ms2000-plate-5-backdrop',
    title: 'Pendulum pivot, backdrop clip, second foot',
    time: 'About 1.5 hours',
    grams: 44,
    pieces: 'Pendulum pivot, backdrop clip, second backdrop foot',
    why: 'The test stand. The pivot has notches for 10, 20, and 30 degrees so every swing starts from the same place.',
    learn: {
      title: 'Swing a pendulum',
      items: [
        ['Tie a washer to a string. Pull it back a little and let go. Then pull it back a lot.', 'Which one moves faster at the bottom? A bigger pull-back means more speed.'],
        ['Count swings for 10 seconds both times.', 'Surprise: the number is almost the same. Galileo noticed this more than 400 years ago.'],
      ],
    },
    after: [
      ['Push both feet onto the bottom of the black foam board.', ''],
      ['Push the clip onto the top edge and slide the dowel in.', 'The dowel should stick straight out toward where the turret will sit.'],
      ['Clamp the pivot on the end of the dowel and loop the line over the peg.', ''],
    ],
    gate: 'All 12 printed parts are done. The MS-2000 is ready for its first full test.',
    build: [
      [7, 'Set up the backdrop and pendulum'],
      [10, 'First full test'],
    ],
  },
];

const TOTAL_G = BATCHES.reduce((s, b) => s + b.grams, 0);

export default function BatchesPage() {
  return (
    <div className="min-h-screen">
      <Nav current="print" />
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
        <Back href={`${BASE}/build`}>Build it</Back>

        <div className="mt-6">
          <Title size="text-xl sm:text-2xl">PRINT PLAN</Title>
        </div>
        <p className="text-white text-lg font-semibold mt-4 leading-snug">
          Five print batches. Each one comes with something to learn while it prints, and unlocks the next build steps.
        </p>
        <p className="text-white/55 text-sm mt-2 leading-relaxed">
          Start after the parts arrive and are measured. Small white parts first, the turret and wand second, the base third.
          About 10 hours 45 minutes of printing and {TOTAL_G} g of PLA in all. Order is by batch; the file names keep their plate numbers.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2">
          {BATCHES.map((b) => (
            <a key={b.n} href={`#batch-${b.n}`} className="bg-naw-card border border-white/10 hover:border-naw-pink/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">
              <span className="text-naw-pink font-bold">{b.n}</span> {b.title}
            </a>
          ))}
        </nav>

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
            Times and grams are the slicer&apos;s estimates. Batch 2 has slower walls saved in its file for the thin head frame.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-naw-orange/40 bg-naw-orange/10 p-5">
          <h2 className="text-white font-bold text-lg">Before the first print</h2>
          <Steps items={BEFORE} />
        </section>

        {BATCHES.map((b) => (
          <section key={b.n} id={`batch-${b.n}`} className="mt-10 scroll-mt-4">
            <div className="flex items-baseline gap-3">
              <span className="flex-none w-10 h-10 rounded-xl bg-naw-pink text-naw-dark font-bold text-lg flex items-center justify-center">{b.n}</span>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">
                  Batch {b.n}: {b.title}
                  {b.white && <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-white text-naw-dark align-middle">WHITE PLA</span>}
                </h2>
                <p className="text-white/50 text-sm">{b.time} · {b.grams} g · plate file {b.plate}</p>
              </div>
            </div>

            <div className="mt-4 bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-hidden">
              <img src={`${PL}/${b.stem}.png`} alt={`Print plate for batch ${b.n}: ${b.pieces}`} width={900} height={600} className="w-full h-auto bg-[#0d1b2e]" />
              <div className="p-5">
                <div className="text-white/45 text-xs">On the plate</div>
                <div className="text-white text-sm font-semibold">{b.pieces}</div>
                <p className="text-white/60 text-sm mt-2">{b.why}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Btn href={`${PL}/${b.stem}.3mf`} primary download small>Plate file (.3mf)</Btn>
                  <Btn href={`${CAD}/index.html`} small>See the parts in 3D</Btn>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-naw-card rounded-2xl border border-lime-300/25 p-5">
                <div className="text-lime-300 text-xs font-semibold">Learn while it prints</div>
                <h3 className="text-white font-bold">{b.learn.title}</h3>
                <Steps items={b.learn.items} />
              </div>
              <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
                <h3 className="text-naw-cyan font-bold">When it is done</h3>
                <Steps items={b.after} />
              </div>
            </div>

            {b.learn2 && (
              <div className="mt-4 bg-naw-card rounded-2xl border border-lime-300/25 p-5">
                <div className="text-lime-300 text-xs font-semibold">Learn while it prints</div>
                <h3 className="text-white font-bold">{b.learn2.title}</h3>
                <Steps items={b.learn2.items} />
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-naw-green/40 bg-naw-green/10 p-4">
              <div className="text-naw-green text-xs font-semibold">Ready for the next batch when</div>
              <div className="text-white text-sm mt-0.5">{b.gate}</div>
            </div>

            {b.build.length > 0 && (
              <div className="mt-4 bg-naw-card rounded-2xl border border-naw-pink/30 p-5">
                <h3 className="text-naw-pink font-bold">Now you can build</h3>
                <div className="mt-2 space-y-2">
                  {b.build.map(([step, title]) => (
                    <a key={step} href={`${BASE}/build#steps`} className="block rounded-xl bg-white/5 hover:bg-white/10 transition-colors px-4 py-3">
                      <span className="text-white font-semibold text-sm">Step {step}: {title}</span>
                      <span className="block text-white/40 text-xs mt-0.5">Instructions coming soon</span>
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

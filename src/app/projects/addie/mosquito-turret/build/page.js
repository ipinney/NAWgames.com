import { BASE, CAD, PARTS_PDF, GUIDE, meta, Nav, Back, Btn, Section, Title } from '../ui';
import { BUY, LOCAL } from '../parts';

export const metadata = meta(
  'Build the MS-2000: parts, print files and 3D models',
  "Addie's laser mosquito turret. Everything to buy, 12 printed parts on five plates, 3D viewers, and the build steps.",
  `${BASE}/build`
);

const STEPS = [
  {
    title: 'Get the parts',
    text: 'Two micro:bits, a board, an AI camera, three servos, a tiny laser, light sensors, a speaker, and a rechargeable power bank. About $224 from four stores.',
    action: { href: '#shopping', label: 'Shopping list' },
  },
  {
    title: 'Print in five batches',
    text: '12 printed parts on five plates. About 10 hours 45 minutes and 335 g of PLA. One plate must be white.',
    action: { href: `${BASE}/build/batches`, label: 'Print plan' },
  },
  {
    title: 'Put it together',
    text: 'The mosquito and wand, then the turret head, then the backdrop and pendulum, then the code and sounds.',
    action: { href: GUIDE, label: 'Build guide', primary: true },
  },
  {
    title: 'Teach it and test it',
    text: 'Train the camera on the mosquito, check every hit is saved, then run the 30 experiment runs.',
    action: { href: `${BASE}/learn#fair-test`, label: 'How to test' },
  },
];

// what happens, in order, when the MS-2000 fires
const FLOW = [
  ['See', 'HuskyLens camera', 'Finds the mosquito it learned and reports where it is on the screen.'],
  ['Think', 'Turret micro:bit', 'Works out which way to turn so the mosquito is in the middle.'],
  ['Aim', 'Pan and tilt servos', 'Turn the head left, right, up, and down, a little at a time.'],
  ['Fire', 'Relay and laser', 'When the mosquito is centered, the relay clicks the laser on. Pew!'],
  ['Feel', 'Light sensor in the mosquito', 'The white pod glows when the dot hits it. The sensor notices.'],
  ['Prove', 'Wand micro:bit', 'Flashes the red eyes, plays a splat, saves the hit, and radios the turret.'],
  ['Cheer', 'Speaker', 'The turret plays the victory sound.'],
];

const VIEWERS = [
  { title: 'The turret', text: 'Every part in place. Tap a name to light it up, or pull the turret apart.', open: `${CAD}/ms2000-turret-3d.html` },
  { title: 'The whole setup', text: 'Turret, backdrop, pendulum, the mosquito on its line, the wand, and the laser beam.', open: `${CAD}/ms2000-3d.html` },
  { title: 'Bought parts', text: 'Every part we buy, with its size. Numbers get checked with calipers when they arrive.', open: `${CAD}/ms2000-components.html` },
  { title: 'Every printed part', text: 'A 3D viewer for each of the 12 printed parts, with notes on what each one does.', open: `${CAD}/index.html` },
];

// [stl stem, name, what it does, qty, plate, white]
const PRINTS = [
  ['p1-base-shell', 'Base shell', 'The body. Holds the board, power bank, speaker, arm switch, side switch, and charge port.', 1, 1],
  ['p1-floor-plate', 'Floor plate', 'The bottom. The board and power bank sit on it.', 1, 2],
  ['p2-turntable-yoke', 'Turntable and tilt yoke', 'Spins left and right on the pan servo and holds the head.', 1, 3],
  ['p3-pivot-pin', 'Pivot pin', 'The axle on the left side of the head.', 1, 3],
  ['p4-head', 'Camera and laser head', 'Holds the camera and the laser, lined up to meet 3 feet away.', 1, 3],
  ['p5-wand', 'Wand handle', 'Holds the wand micro:bit and batteries on the fishing rod.', 1, 3],
  ['p6-pod-cap', 'Sensor pod, back', 'Holds the light sensor inside the mosquito.', 1, 3],
  ['p6-pod-cup', 'Sensor pod, front', 'The white cup that glows when the laser hits it.', 1, 4, true],
  ['p8-clips', 'Cable clips', 'Keep the thin cable next to the fishing line.', 1, 4, true],
  ['p7-backdrop-foot', 'Backdrop foot', 'Holds the black poster board up.', 2, '2, 5'],
  ['p7-pendulum-pivot', 'Pendulum pivot', 'Where the line swings from. Marks 10, 20, and 30 degrees.', 1, 5],
  ['p7-backdrop-clip', 'Backdrop clip', 'Holds the dowel straight out from the board.', 1, 5],
];

const TOOLS = [
  ['3D printer', 'Flashforge Adventurer 5M, with any color PLA plus a little white'],
  ['Soldering iron', 'For the sensor and LED wires. A grown-up does the soldering.'],
  ['Small screwdrivers', 'For the M2 screws and the HuskyLens M3 screws'],
  ['Calipers or a ruler', 'To check the parts match the drawings before printing'],
  ['Hot glue gun', 'For the stuffed mosquito and the backdrop'],
  ['Laptop with MakeCode', 'makecode.microbit.org, free in the browser, plus a micro-USB cable'],
];

// build guide chapters, anchors in GUIDE
const GUIDE_PARTS = [
  { part: 'A', title: 'Check and print', steps: [[1, 'Unbox and measure'], [2, 'Print in five batches']] },
  { part: 'B', title: 'The mosquito and the wand', steps: [[3, 'Wire the mosquito pod'], [4, 'Build the wand'], [5, 'Code the wand: prove a hit']] },
  { part: 'C', title: 'The turret', steps: [[6, 'Fill the base'], [7, 'Center the servos first'], [8, 'Build the pan and tilt head'], [9, 'Wire the turret and close it up']] },
  { part: 'D', title: 'Teach it and code it', steps: [[10, 'Teach the camera the mosquito'], [11, 'Code the turret: follow'], [12, 'Lock on, fire, and make the sounds'], [13, 'Line up the laser']] },
  { part: 'E', title: 'The test rig and the data', steps: [[14, 'Set up the backdrop and pendulum'], [15, 'Code the wand: the run recorder'], [16, 'The first full test']] },
];

function money(n) {
  return n == null ? 'at checkout' : `$${n.toFixed(2)}`;
}

export default function BuildPage() {
  const sections = [...new Set(BUY.map((b) => b.sec))];
  const total = BUY.reduce((s, b) => s + (b.price || 0), 0);
  const byStore = BUY.reduce((m, b) => ({ ...m, [b.vendor]: (m[b.vendor] || 0) + (b.price || 0) }), {});
  const stores = Object.keys(byStore).map((v) => `${v} (${money(byStore[v])})`);
  const storeList = stores.length > 1 ? `${stores.slice(0, -1).join(', ')}${stores.length > 2 ? ',' : ''} and ${stores[stores.length - 1]}` : stores.join('');
  return (
    <div className="min-h-screen">
      <Nav current="build" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-pink/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-8">
          <Back href={BASE}>MS-2000</Back>
          <div className="grid md:grid-cols-2 gap-6 items-center mt-6">
            <div>
              <Title size="text-2xl sm:text-3xl">BUILD IT</Title>
              <p className="text-white text-lg font-semibold mt-4 leading-snug">
                Everything to build the MS-2000: the parts to buy, the 3D printed body, and the steps to put it together.
              </p>
              <p className="text-white/55 text-sm mt-3 leading-relaxed">
                A micro:bit reads an AI camera and turns two servos to keep the mosquito centered, then switches on a safe
                Class 2 laser. A second micro:bit in the wand feels each hit through a light sensor and saves it as data.
              </p>
              <p className="text-white/45 text-xs mt-3 leading-relaxed">
                The design is locked. Any change to parts, sizes, or aim goes through a{' '}
                <a href={`${BASE}/changes`} className="text-naw-pink hover:underline">change order</a> first.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <Btn href={GUIDE} primary>Build guide</Btn>
                <Btn href={`${BASE}/build/batches`}>Print plan</Btn>
                <Btn href={PARTS_PDF}>Parts list (PDF)</Btn>
                <Btn href={`${CAD}/ms2000-turret-3d.html`}>Explore in 3D</Btn>
              </div>
            </div>
            <a href={`${CAD}/ms2000-3d.html`} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-white/10 bg-[#0d1b2e]">
              <img src="/projects/addie/ms2000-hero.png" alt="3D model of the MS-2000 turret" width={720} height={630} className="w-full h-auto" />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="Four steps" sub="A grown-up helps with the printer, the soldering iron, and the laser.">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="bg-naw-card rounded-2xl border border-naw-pink/20 p-5 flex flex-col">
                <span className="w-8 h-8 rounded-full bg-naw-pink text-naw-dark font-bold flex items-center justify-center">{i + 1}</span>
                <h3 className="text-white font-bold text-lg mt-3">{s.title}</h3>
                <p className="text-white/55 text-sm mt-1 flex-1">{s.text}</p>
                <div className="mt-4">
                  {s.action.href.startsWith('#') ? (
                    <a href={s.action.href} className="bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25 inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors">
                      {s.action.label}
                    </a>
                  ) : (
                    <Btn href={s.action.href} primary={s.action.primary}>{s.action.label}</Btn>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="How the parts work together" sub="Seven parts, one after another, in less than a second.">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FLOW.map(([verb, part, text], i) => (
              <li key={verb} className="bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-naw-pink font-game text-[10px]">{i + 1}</span>
                  <span className="text-lime-300 font-bold uppercase tracking-wider text-sm">{verb}</span>
                </div>
                <div className="text-white font-semibold mt-1">{part}</div>
                <div className="text-white/55 text-sm mt-1">{text}</div>
              </li>
            ))}
          </ol>
          <p className="text-white/45 text-xs mt-3">Want to know why each one works? It is all on the Learn the science page.</p>
        </Section>

        <Section
          id="shopping"
          title="Shopping list"
          sub={`Order from ${storeList}. ${money(total)} before shipping and tax. The PDF has a backup source for every part.`}
        >
          <div className="space-y-4">
            {sections.map((sec) => (
              <div key={sec} className="bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-hidden">
                <div className="px-4 py-2.5 text-naw-cyan font-bold text-sm border-b border-white/5">{sec}</div>
                <div className="divide-y divide-white/5">
                  {BUY.filter((b) => b.sec === sec).map((b) => (
                    <div key={b.pn} className="px-4 py-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
                      <div>
                        <span className="text-white font-semibold">{b.name}</span>
                        <span className="text-white/40 text-sm"> × {b.qty}</span>
                      </div>
                      <div className="text-white tabular-nums text-sm text-right">{money(b.price)}</div>
                      <div className="text-white/55 text-sm col-span-2 sm:col-span-1">{b.role}</div>
                      <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-naw-cyan text-sm font-semibold hover:underline col-span-2 sm:col-span-1 sm:text-right whitespace-nowrap">
                        {b.vendor} {b.pn}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
              <h3 className="text-white font-bold">From the store or at home</h3>
              <div className="mt-2 divide-y divide-white/5">
                {LOCAL.map((l) => (
                  <div key={l.name} className="py-2 text-sm">
                    <div className="text-white">{l.name}</div>
                    <div className="text-white/45 text-xs">{l.qty} · {l.where}</div>
                  </div>
                ))}
              </div>
              <p className="text-white/45 text-xs mt-2">About $30 in all.</p>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
              <h3 className="text-white font-bold">Tools</h3>
              <div className="mt-2 divide-y divide-white/5">
                {TOOLS.map(([t, d]) => (
                  <div key={t} className="py-2 text-sm">
                    <div className="text-white">{t}</div>
                    <div className="text-white/45 text-xs">{d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl border border-naw-orange/40 bg-naw-orange/10 p-3 text-sm text-white/80">
                Only buy the Class 2 laser on the list (under 1 mW). A 5 mW hobby laser is Class 3R and is not the same thing.
              </div>
            </div>
          </div>
        </Section>

        <Section title="3D models" sub="Spin them with a finger or a mouse. They open in any web browser.">
          <div className="grid sm:grid-cols-2 gap-4">
            {VIEWERS.map((v) => (
              <div key={v.title} className="bg-naw-card rounded-2xl border border-naw-cyan/20 p-5 flex flex-col">
                <h3 className="text-white font-bold text-lg">{v.title}</h3>
                <p className="text-white/55 text-sm mt-1 flex-1">{v.text}</p>
                <div className="mt-4">
                  <Btn href={v.open} primary>Open</Btn>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Print files"
          sub="12 parts. The print plan has them already laid out on five plates for the Adventurer 5M. Single STL files are here for reprinting one part."
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <Btn href={`${BASE}/build/batches`} primary>Print plan with plate files</Btn>
          </div>
          <div className="bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-left">
                  <th className="px-4 py-3 font-semibold">Part</th>
                  <th className="px-2 py-3 font-semibold">Qty</th>
                  <th className="hidden sm:table-cell px-2 py-3 font-semibold">Plate</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {PRINTS.map(([stem, name, what, qty, plate, white]) => (
                  <tr key={stem} className="border-t border-white/5 align-top">
                    <td className="px-4 py-2.5">
                      <div className="text-white font-medium">
                        {name}
                        {white && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-naw-dark align-middle">WHITE</span>}
                      </div>
                      <div className="text-white/50 text-xs mt-0.5">{what}<span className="sm:hidden"> Plate {plate}.</span></div>
                    </td>
                    <td className="px-2 py-2.5 text-white/70 tabular-nums">{qty}</td>
                    <td className="hidden sm:table-cell px-2 py-2.5 text-white/70">{plate}</td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <a href={`${CAD}/ms2000-${stem}.html`} target="_blank" rel="noopener noreferrer" className="text-naw-cyan font-semibold hover:underline mr-3">
                        3D
                      </a>
                      <a href={`${CAD}/stl/ms2000-${stem}.stl`} download className="text-naw-cyan font-semibold hover:underline">
                        STL
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-xs mt-3">
            Also needed and not printed: the M2 screw kit, the HuskyLens M3 screws (in its box), servo horn screws (in the servo
            bags), zip ties, and hook-and-loop tape.
          </p>
        </Section>

        <Section id="steps" title="Build steps" sub="Sixteen steps in five parts, with diagrams, wiring maps, and the MakeCode programs. Built October to mid-November, practice until December 11.">
          <a
            href={GUIDE}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-naw-pink/40 bg-naw-pink/10 hover:border-naw-pink/70 p-5 transition-colors"
          >
            <div className="text-naw-pink text-xs font-semibold">Open the full guide</div>
            <div className="text-white font-bold text-lg mt-0.5 group-hover:text-naw-pink transition-colors">How to build the MS-2000</div>
            <div className="text-white/60 text-sm mt-1">Safety, tools, every part explained, two wiring maps, a screw table, 16 steps, 7 programs, fixes, and the words to know.</div>
          </a>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {GUIDE_PARTS.map((g) => (
              <div key={g.part} className="bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-lime-300 text-naw-dark font-bold text-sm flex items-center justify-center">{g.part}</span>
                  <span className="text-white font-bold">{g.title}</span>
                </div>
                <ol className="mt-3 space-y-1">
                  {g.steps.map(([n, t]) => (
                    <li key={n}>
                      <a href={`${GUIDE}#step-${n}`} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-sm text-white/70 hover:text-white">
                        <span className="flex-none w-6 text-naw-pink font-bold tabular-nums">{n}</span>
                        <span>{t}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

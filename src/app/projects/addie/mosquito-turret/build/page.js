import { BASE, CAD, PARTS_PDF, meta, Nav, Back, Btn, Section, Title, Placeholder } from '../ui';
import { BUY, LOCAL } from '../parts';

export const metadata = meta(
  'Build the MS-2000: parts, print files and 3D models',
  "Addie's laser mosquito turret. Everything to buy, 12 printed parts on five plates, 3D viewers, and the build steps.",
  `${BASE}/build`
);

const STEPS = [
  {
    title: 'Get the parts',
    text: 'Two micro:bits, a board, an AI camera, three servos, a tiny laser, light sensors, a speaker, and batteries. About $192 from two stores.',
    action: { href: '#shopping', label: 'Shopping list' },
  },
  {
    title: 'Print in five batches',
    text: '12 printed parts on five plates. About 10 hours and 320 g of PLA. One plate must be white.',
    action: { href: `${BASE}/build/batches`, label: 'Print plan', primary: true },
  },
  {
    title: 'Put it together',
    text: 'The mosquito and wand, then the turret head, then the backdrop and pendulum, then the code and sounds.',
    action: { href: '#steps', label: 'Build steps' },
  },
  {
    title: 'Teach it and test it',
    text: 'Train the camera on the mosquito, check every hit is saved, then run the 45 experiment runs.',
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
  ['p1-base-shell', 'Base shell', 'The body. Holds the board, battery pack, speaker, and arm switch.', 1, 1],
  ['p1-floor-plate', 'Floor plate', 'The bottom. The board and battery pack sit on it.', 1, 2],
  ['p2-turntable-yoke', 'Turntable and tilt yoke', 'Spins left and right on the pan servo and holds the head.', 1, 3],
  ['p3-pivot-pin', 'Pivot pin', 'The axle on the left side of the head.', 1, 3],
  ['p4-head', 'Camera and laser head', 'Holds the camera and the laser, lined up to meet 5 feet away.', 1, 3],
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

const PLANNED = [
  ['Check the parts', 'Unbox, check the list, measure the board and servos, and fix the print files if anything is off.'],
  ['Make the mosquito', 'Sensor pod, red eyes, and the cable down the fishing line.'],
  ['Make the wand', 'micro:bit and batteries on the handle. Code it to feel a hit and save it.'],
  ['Build the base', 'Board, battery pack, speaker, and the laser arm switch.'],
  ['Build the pan and tilt head', 'Servos, turntable, camera, and laser.'],
  ['Teach the camera', 'Show HuskyLens the mosquito from different sides until it knows it.'],
  ['Set up the backdrop and pendulum', 'Poster board, feet, dowel, and the pivot with its angle marks.'],
  ['Code the turret', 'Follow the mosquito, fire when centered, and talk to the wand by radio.'],
  ['Add the sounds', 'Pew or boom, lock-on beep, splat, and the victory song.'],
  ['First full test', 'Five practice runs. Check the data file opens as a table.'],
];

function money(n) {
  return n == null ? 'at checkout' : `$${n.toFixed(2)}`;
}

export default function BuildPage() {
  const sections = [...new Set(BUY.map((b) => b.sec))];
  const total = BUY.reduce((s, b) => s + (b.price || 0), 0);
  const byStore = BUY.reduce((m, b) => ({ ...m, [b.vendor]: (m[b.vendor] || 0) + (b.price || 0) }), {});
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
              <div className="flex flex-wrap gap-2 mt-5">
                <Btn href={`${BASE}/build/batches`} primary>Print plan</Btn>
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
          sub={`Order from DFRobot (${money(byStore.DFRobot)}) and DigiKey (${money(byStore.DigiKey)}). ${money(total)} before shipping and tax. The PDF has a backup source for every part.`}
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
              <p className="text-white/45 text-xs mt-2">About $35 in all.</p>
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

        <Section id="steps" title="Build steps" sub="Addie writes these as she builds, with photos. Here is the plan for October and November.">
          <Placeholder title="Addie's build instructions">
            Step-by-step instructions with photos go here once the parts arrive and the build starts.
          </Placeholder>
          <ol className="mt-4 grid sm:grid-cols-2 gap-3">
            {PLANNED.map(([t, d], i) => (
              <li key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4 flex gap-3 opacity-80">
                <span className="flex-none w-8 h-8 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block text-white font-semibold">{t}</span>
                  <span className="block text-white/50 text-sm mt-0.5">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}

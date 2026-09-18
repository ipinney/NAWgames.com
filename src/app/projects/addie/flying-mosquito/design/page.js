import { BASE, CAD, meta, Nav, Back, Btn, Section, Title, Cards } from '../ui';
import { REQS, WEIGHTS, RISKS } from '../data';

export const metadata = meta(
  'Flying Mosquito: the design',
  'How the Flying Mosquito works: the drone, the hit window, the control box, the radio plan to the MS-2000, the weight budget, and the risks.',
  `${BASE}/design`
);

const HOW = [
  ['Press GO on the control box', 'The Pi in the box checks the battery and tells the micro:bit. The micro:bit radios GO to the MS-2000, so the turret starts its run.'],
  ['It takes off and holds still', 'The Pi talks to the drone over the drone\u2019s own WiFi. A camera under the drone watches the floor and a laser range finder measures height, so it hovers without anyone steering.'],
  ['It flies its pattern', 'Slow loops and bobs inside the net, about 3 feet from the turret, with the white window always facing the turret.'],
  ['The laser tags the window', 'The whole white face glows. A light sensor behind it feels the glow.'],
  ['HIT goes back to the turret', 'The XIAO radio in the body tells the Pi, the Pi tells the micro:bit, and the micro:bit radios HIT on group 7. The turret cheers, and the box saves the hit.'],
  ['It lands on its pad', 'After 30 seconds the drone comes down onto the cone cups and the box sends STOP.'],
];

const PIECES = [
  ['LiteWing drone', 'A drone whose frame is its circuit board: ESP32-S3 computer, motion sensor, 4 motors, 55 mm props. 100 x 100 mm and about 45 g. Flown from Python with the same library as the Crazyflie research drone.', 'Bought'],
  ['Positioning module', 'Plugs in under the drone. A floor camera (like a computer mouse) and a laser range finder, so the drone can hold its spot. 8 g.', 'Bought'],
  ['F1 prop guard and legs', 'A fence around the outside of all four props, collars that push onto the motors, and four legs to land on. It never touches the board. 6.9 g.', 'Printed'],
  ['F2 mosquito body and hit window', 'A white 40 mm window on the front (0.8 mm thick so it glows), the light sensor behind it, the XIAO radio inside, and a tail. The battery strap threads through its floor. 8.1 g.', 'Printed'],
  ['F4 launch pad', 'A 150 mm square with four cone cups. The legs drop into the cups, so every run starts in the same spot, facing the turret.', 'Printed'],
  ['F5 control box', 'Sits outside the net. micro:bit window and the big GO button on top; Pi Zero 2 W and a power bank inside; charge port and power switch on the sides.', 'Printed'],
  ['The net', 'A pop-up bug habitat with the front panel rolled open toward the turret. It holds the flight mat, the pad, and any crash.', 'Bought'],
];

const DESIGNS = [
  { key: 'A', name: 'Free Flyer', picked: true, text: 'A palm size ESP32 drone (LiteWing) with a floor camera and a height sensor so it can hold its place. Printed shell, guard, hit pod and pad.', good: 'Really flies by itself. Small. The cheapest way to get true hands-off flight.', hard: 'The most code, and it has to be tuned so it does not drift.' },
  { key: 'B', name: 'Crazyflie', text: 'The same idea on a Crazyflie research drone with a flow sensor.', good: 'The steadiest flying and the best instructions. The smallest.', hard: 'Costs several times more, and needs a laptop at the demo.' },
  { key: 'C', name: 'Boom Flyer', fallback: true, text: 'The mosquito rides on the end of a light rod that spins on the base. A micro:bit runs everything.', good: 'All MakeCode, cheap, safe, the same speed every time.', hard: 'It does not really fly free, and the camera sees the rod.' },
  { key: 'D', name: 'micro:bit Drone', text: 'An Air:bit drone kit with a micro:bit brain and a printed mosquito frame.', good: 'Addie codes it in MakeCode and it already speaks micro:bit radio.', hard: 'It cannot hold its place by itself, so a person has to fly it. The biggest.' },
];

const RADIO = [
  ['Drone WiFi', 'The drone makes its own WiFi network. The Pi joins it to fly the drone, and the XIAO joins it to report hits.'],
  ['USB', 'The Pi and the micro:bit in the box talk over a USB cable.'],
  ['micro:bit radio, group 7', 'The micro:bit sends GO, HIT and STOP, exactly like the MS-2000 wand. The turret already knows these words.'],
];

export default function DesignPage() {
  const payload = WEIGHTS.filter((w) => w[3]).reduce((s, w) => s + w[1], 0);
  const total = WEIGHTS.reduce((s, w) => s + w[1], 0);
  return (
    <div className="min-h-screen">
      <Nav current="design" />
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">
        <Back href={BASE}>Flying Mosquito</Back>
        <div className="mt-5">
          <Title size="text-2xl sm:text-3xl">THE DESIGN</Title>
          <p className="text-white/70 mt-3 max-w-2xl">
            Design A, the Free Flyer, Rev A. The parts, how they work together, and what we still have to prove before
            ordering. Numbers marked as estimates get checked with calipers and a scale when the parts arrive.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Btn href={`${CAD}/flymo-drone-3d.html`} primary>See it in 3D</Btn>
            <Btn href="#requirements">Requirements</Btn>
            <Btn href="#weight">Weight budget</Btn>
            <Btn href="#risks">Risks</Btn>
          </div>
        </div>

        <Section id="how" title="How one run works">
          <ol className="grid sm:grid-cols-2 gap-3">
            {HOW.map(([t, d], i) => (
              <li key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4 flex gap-3">
                <span className="flex-none w-7 h-7 rounded-lg bg-lime-300/20 text-lime-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block text-white font-bold">{t}</span>
                  <span className="block text-white/55 text-sm mt-0.5">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="pieces" title="The pieces" sub="F numbers are the printed parts.">
          <Cards items={PIECES} />
        </Section>

        <Section id="radio" title="Who talks to whom" sub="Three links carry a hit from the mosquito to the turret in well under half a second.">
          <div className="rounded-2xl border border-white/10 bg-naw-card p-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm whitespace-nowrap">
              {['Light sensor', 'XIAO (in the body)', 'Pi (in the box)', 'micro:bit (in the box)', 'MS-2000 turret'].map((t, i, arr) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-lime-300/15 text-lime-200 font-semibold">{t}</span>
                  {i < arr.length - 1 && <span className="text-white/40">{['wire', 'drone WiFi', 'USB', 'radio 7'][i]} &rarr;</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <Cards items={RADIO} cols="sm:grid-cols-3" />
          </div>
        </Section>

        <Section id="requirements" title="Requirements" sub="What it must do, why, and how Rev A does it. Final once Dad approves them and the budget.">
          <ol className="space-y-2">
            {REQS.map(([r, why, how], i) => (
              <li key={r} className="bg-naw-card rounded-2xl border border-white/10 px-4 py-3 flex gap-3">
                <span className="flex-none w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <span>
                  <span className="block text-white text-sm font-semibold">{r}</span>
                  <span className="block text-white/50 text-xs mt-0.5">Why: {why}</span>
                  <span className="block text-lime-200/80 text-xs mt-0.5">Rev A: {how}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="weight" title="Weight budget" sub="A drone can only lift so much. The LiteWing lifts about 25 g extra with 55 mm props.">
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/60 text-xs">
                <tr><th className="text-left px-4 py-2">Part</th><th className="text-right px-4 py-2">Grams</th><th className="text-left px-4 py-2 hidden sm:table-cell">From</th></tr>
              </thead>
              <tbody>
                {WEIGHTS.map(([n, g, src, added]) => (
                  <tr key={n} className="border-t border-white/5">
                    <td className="px-4 py-2 text-white/80">{n}{added && <span className="ml-2 text-[10px] font-bold text-lime-300">ADDED</span>}</td>
                    <td className="px-4 py-2 text-right text-white tabular-nums">{g.toFixed(1)}</td>
                    <td className="px-4 py-2 text-white/45 hidden sm:table-cell">{src}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/15 bg-lime-300/5">
                  <td className="px-4 py-2 text-lime-200 font-semibold">Added load (rated about 25 g)</td>
                  <td className="px-4 py-2 text-right text-lime-200 font-bold tabular-nums">{payload.toFixed(1)}</td>
                  <td className="px-4 py-2 hidden sm:table-cell" />
                </tr>
                <tr className="border-t border-white/5">
                  <td className="px-4 py-2 text-white font-semibold">Takeoff weight</td>
                  <td className="px-4 py-2 text-right text-white font-bold tabular-nums">{total.toFixed(1)}</td>
                  <td className="px-4 py-2 hidden sm:table-cell" />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-white/55 text-sm mt-3">
            Rev A is about 1 g over. The December lift test decides: if the drone climbs well and flies 5 minutes, it stays.
            If not, the fix is 65 mm props, which the LiteWing supports, and a bigger guard. That would be the first change order.
          </p>
        </Section>

        <Section id="designs" title="The four designs" sub="A is picked. C is the backup, like Design B was for the MS-2000.">
          <div className="grid sm:grid-cols-2 gap-4">
            {DESIGNS.map((d) => (
              <div key={d.key} className={`rounded-2xl border p-5 ${d.picked ? 'bg-lime-300/10 border-lime-300/60' : d.fallback ? 'bg-naw-card border-naw-cyan/40' : 'bg-naw-card border-white/10 opacity-75'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-game text-xs text-white/60">Design {d.key}</span>
                  {d.picked && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-lime-300 text-naw-dark">Picked</span>}
                  {d.fallback && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-cyan/20 text-naw-cyan">Backup</span>}
                </div>
                <h3 className="text-white font-bold text-lg mt-1">{d.name}</h3>
                <p className="text-white/65 text-sm mt-1">{d.text}</p>
                <div className="mt-3 text-sm"><span className="text-naw-green font-semibold">Good: </span><span className="text-white/60">{d.good}</span></div>
                <div className="mt-1 text-sm"><span className="text-naw-orange font-semibold">Hard: </span><span className="text-white/60">{d.hard}</span></div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="risks" title="Risks and how we handle them">
          <div className="grid sm:grid-cols-2 gap-3">
            {RISKS.map(([t, what, fix]) => (
              <div key={t} className="bg-naw-card rounded-2xl border border-naw-orange/25 p-4">
                <div className="text-naw-orange font-bold">{t}</div>
                <div className="text-white/65 text-sm mt-1">{what}</div>
                <div className="text-white/50 text-sm mt-1"><span className="text-white/70 font-semibold">Plan: </span>{fix}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

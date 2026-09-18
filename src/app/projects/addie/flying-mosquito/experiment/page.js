import { BASE, meta, Nav, Back, Btn, Section, Title, Cards } from '../ui';

export const metadata = meta(
  'Can it fly? The Flying Mosquito lift experiment',
  'Our own math on the Flying Mosquito: how much push four tiny props make, the maker\u2019s safety margin, how long a battery lasts, a prediction, and the experiment that tests it.',
  `${BASE}/experiment`
);

// ---- the model (same numbers as the calculations below) ----
const G = 9.81, RHO = 1.2, D = 0.055, AREA = Math.PI * (D / 2) ** 2;
const EFF = 0.28, ELEC = 0.7, USABLE_AH = 0.48, VOLT = 3.7, TMAX = 120, BASE_G = 61;
function predict(added) {
  const w = BASE_G + added;
  const tRotor = (w / 1000) * G / 4;
  const airW = 4 * tRotor ** 1.5 / Math.sqrt(2 * RHO * AREA);
  const battW = airW / EFF + ELEC;
  const amps = battW / VOLT;
  return { added, w, airW, battW, amps, min: (USABLE_AH / amps) * 60, tw: TMAX / w, power: 100 * Math.sqrt(w / TMAX) };
}
const ROWS = [0, 10, 20, 25, 30, 35, 40].map(predict);
const FULL = predict(26);

const STEPS = [
  {
    n: 1, title: 'Weigh everything', kid: 'Add up every part. The drone and battery are 61 g. Everything we add (the floor camera module, guard, body, window, radio, sensor, wings) is 26 g. Takeoff weight: 87 g.',
    math: '45 g drone + 16 g battery + 26 g added = 87 g',
  },
  {
    n: 2, title: 'How hard can four props push?', kid: 'A prop pushes harder when it is bigger and when it spins faster. Doubling the speed makes 4 times the push. Loaded down, these motors spin about 33,000 times a minute (the box says 45,000 with nothing on them).',
    math: 'Push = Ct x air density x (turns per second)\u00b2 x (prop size)\u2074\n= 0.09 x 1.2 x 550\u00b2 x 0.055\u2074 = about 30 g per prop\n4 props: about 120 g (anywhere from 100 to 135 g, because Ct and the speed are guesses)',
  },
  {
    n: 3, title: 'Compare push to weight', kid: 'Divide the most push by the weight. That is the thrust-to-weight ratio. Under 1, it cannot take off. 1 to 1.3, it lifts but wobbles and cannot catch itself. 1.5 to 2 flies well. Over 2 is zippy.',
    math: `120 g / 87 g = ${FULL.tw.toFixed(2)}`,
  },
  {
    n: 4, title: 'Find the maker\u2019s safety margin', kid: 'The maker says 25 g extra. Using our numbers, 25 g extra makes 86 g, and 120 / 86 = 1.4. So their rating keeps about 40% extra push in reserve for climbing, turning and fighting bumps. That reserve is the safety factor. Our 26 g uses up 1 g of it.',
    math: 'Can take off at all: 120 g total = 59 g added (ratio 1.0)\nStill steady: about 100 g total = about 39 g added (ratio 1.2)',
  },
  {
    n: 5, title: 'How much power to hover?', kid: 'To hover, the props throw air down fast enough to hold the drone up. Physics (called momentum theory) says how much power that takes. Tiny motors and props waste most of their power as heat and swirls, so the battery has to give about 3.5 times more.',
    math: `Air power = 4 x (push per prop)\u00b9\u00b7\u2075 / \u221a(2 x air density x prop area) = ${FULL.airW.toFixed(1)} W\nBattery power = ${FULL.airW.toFixed(1)} W / 0.28 + 0.7 W for the computers = ${FULL.battW.toFixed(1)} W\nCurrent = ${FULL.battW.toFixed(1)} W / 3.7 V = ${FULL.amps.toFixed(1)} A`,
  },
  {
    n: 6, title: 'How long will the battery last?', kid: 'A 600 mAh battery holds 600 milliamps for one hour. We only use 80% of it to keep the battery healthy. Heavier means more power, and the power grows faster than the weight: 10% heavier costs about 15% of the flying time.',
    math: `480 mAh / ${(FULL.amps * 1000).toFixed(0)} mA = ${(USABLE_AH / FULL.amps).toFixed(3)} hours = ${FULL.min.toFixed(1)} minutes\nFlying time goes with (1 / weight)\u00b9\u00b7\u2075`,
  },
  {
    n: 7, title: 'Is the battery strong enough?', kid: 'The C rating says how fast a battery can give its energy. Our battery is rated 20C.',
    math: `${FULL.amps.toFixed(1)} A / 0.6 Ah = ${(FULL.amps / 0.6).toFixed(1)}C to hover. 20C allows 12 A. Plenty of room.`,
  },
];

const GUESSES = [
  ['Prop push number (Ct) 0.08 to 0.10', 'Every prop shape is different. Test A measures the real push.'],
  ['Loaded motor speed about 33,000 rpm', 'Nobody lists it for this motor and prop. Test A shows it indirectly.'],
  ['Efficiency 28%', 'Tiny brushed motors and props lose a lot. Test B shows the real number from the battery.'],
  ['Battery 600 mAh, 16 g', 'Depends on the pack we buy. We weigh it and read the label.'],
];

function Chart() {
  const W = 560, H = 260, L = 48, R = 16, T = 16, B = 40;
  const xs = (a) => L + (a / 40) * (W - L - R);
  const ys = (m) => T + (1 - m / 10) * (H - T - B);
  const pts = Array.from({ length: 41 }, (_, a) => predict(a));
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${xs(p.added).toFixed(1)},${ys(p.min).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Predicted flying time falls from about 9 minutes with nothing added to about 4.4 minutes with 40 grams added">
      {[0, 2, 4, 6, 8, 10].map((m) => (
        <g key={m}>
          <line x1={L} x2={W - R} y1={ys(m)} y2={ys(m)} stroke="rgba(255,255,255,0.08)" />
          <text x={L - 8} y={ys(m) + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.5)">{m}</text>
        </g>
      ))}
      {[0, 10, 20, 25, 30, 40].map((a) => (
        <text key={a} x={xs(a)} y={H - B + 16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)">{a}</text>
      ))}
      <rect x={xs(25)} y={T} width={xs(40) - xs(25)} height={H - T - B} fill="rgba(245,158,11,0.08)" />
      <text x={xs(32.5)} y={T + 14} textAnchor="middle" fontSize="11" fill="rgba(245,158,11,0.8)">past the rating</text>
      <path d={path} fill="none" stroke="#bef264" strokeWidth="3" />
      <line x1={xs(26)} x2={xs(26)} y1={T} y2={H - B} stroke="#ec4899" strokeDasharray="4 4" />
      <circle cx={xs(26)} cy={ys(FULL.min)} r="5" fill="#ec4899" />
      <text x={xs(26) - 6} y={ys(FULL.min) - 10} textAnchor="end" fontSize="12" fill="#f9a8d4">Rev A: {FULL.min.toFixed(1)} min</text>
      <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.7)">Grams added to the drone</text>
      <text x={14} y={(T + H - B) / 2} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.7)" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>Minutes of hovering</text>
    </svg>
  );
}

const VARS = [
  ['What we change', 'Added weight: 0, 10, 20, 25, 30 and 35 g, using US nickels taped to the middle of the body. A nickel weighs exactly 5.000 g.'],
  ['What we measure', 'Minutes of hovering until the low-battery light, the motor power % from the laptop log, and the battery voltage.'],
  ['What we keep the same', 'Battery charged full (4.2 V) and cooled before every flight, hover height 30 cm, the same room, the flight mat, the guard on, batteries used in the same order.'],
  ['How many times', '3 flights at each weight: 18 flights. Plus the push test.'],
];

const TEST_A = [
  ['Strap the drone to a heavy block, props on and guard on', 'The block (a 500 g can or a brick in a bag) sits on a kitchen scale. The drone is strapped to the block so it cannot lift off.'],
  ['Zero the scale', 'The scale now reads 0 with the drone and block on it.'],
  ['A grown-up runs the motors at 25%, 50%, 75% and 100% for 3 seconds each from the laptop', 'The props push up, so the scale reads less than zero. That minus number is the push, in grams.'],
  ['Do it 3 times and average', 'Write every reading in the journal.'],
];

const TEST_B = [
  ['Charge the battery to 4.2 V and let it cool 10 minutes', 'Same start every time.'],
  ['Tape on the nickels for this weight and weigh the whole drone', 'Write the real grams.'],
  ['Press GO in hover mode: take off to 30 cm and hold still', 'The laptop saves battery voltage and motor power 10 times a second.'],
  ['Stop the timer when the red low-battery light comes on; the drone lands', 'That time is the flying time.'],
  ['Swap batteries, change the weight, repeat', 'Weights in a mixed-up order, so a tired battery does not always land on the heavy flights.'],
];

const SOURCES = [
  ['LiteWing wiki: 45 g, about 25 g payload with 55 mm props, 1S LiPo 20C or more', 'https://circuitdigest.com/wiki/litewing/'],
  ['NASA Glenn: propeller thrust and momentum (actuator disk) theory', 'https://www.grc.nasa.gov/www/k-12/airplane/propth.html'],
  ['US Mint: coin specifications (nickel 5.000 g)', 'https://www.usmint.gov/learn/coins-and-medals/circulating-coins'],
];

export default function ExperimentPage() {
  return (
    <div className="min-h-screen">
      <Nav current="experiment" />
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">
        <Back href={BASE}>Flying Mosquito</Back>
        <div className="mt-5">
          <Title size="text-2xl sm:text-3xl">CAN IT FLY?</Title>
          <p className="text-white text-lg font-semibold mt-3 max-w-3xl leading-snug">
            The maker says the drone can carry 25 grams. Ours needs 26. Is there a safety margin? What happens if we work
            the motors harder? We do the math ourselves, make a prediction, and then test it.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Btn href="#math" primary>Our math</Btn>
            <Btn href="#prediction">Prediction</Btn>
            <Btn href="#experiment">The experiment</Btn>
            <Btn href="#decide">What it decides</Btn>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="rounded-2xl border border-naw-cyan/30 bg-naw-cyan/10 p-4">
            <div className="text-naw-cyan text-xs font-semibold">Engineering question</div>
            <div className="text-white font-semibold mt-1">Can the Flying Mosquito lift everything we put on it?</div>
          </div>
          <div className="rounded-2xl border border-lime-300/30 bg-lime-300/10 p-4">
            <div className="text-lime-300 text-xs font-semibold">Science question</div>
            <div className="text-white font-semibold mt-1">How does added weight change how long the Flying Mosquito can fly and how hard its motors work?</div>
          </div>
        </div>

        <Section id="math" title="Our math, step by step" sub="Kid version on the left, the numbers on the right. Every step can be checked with a calculator.">
          <div className="space-y-3">
            {STEPS.map((s) => (
              <div key={s.n} className="grid md:grid-cols-5 gap-3 bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-lime-300/20 text-lime-300 text-sm font-bold flex items-center justify-center">{s.n}</span>
                    <span className="text-white font-bold">{s.title}</span>
                  </div>
                  <p className="text-white/70 text-sm mt-2 leading-relaxed">{s.kid}</p>
                </div>
                <pre className="md:col-span-2 whitespace-pre-wrap text-lime-100/90 text-xs leading-relaxed bg-black/30 rounded-xl p-3 font-mono">{s.math}</pre>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-white font-semibold text-sm mb-2">Guesses inside the math (the experiment checks each one)</div>
            <Cards items={GUESSES} />
          </div>
        </Section>

        <Section id="table" title="Heavier means shorter flights" sub="Our model for different added weights. Our Rev A adds 26 g.">
          <div className="rounded-2xl border border-white/10 bg-naw-card p-3">
            <Chart />
          </div>
          <div className="rounded-2xl border border-white/10 overflow-x-auto mt-4">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-white/5 text-white/60 text-xs">
                <tr>
                  <th className="text-left px-3 py-2">Added</th><th className="text-right px-3 py-2">Takeoff</th><th className="text-right px-3 py-2">Push / weight</th>
                  <th className="text-right px-3 py-2">Motor power</th><th className="text-right px-3 py-2">Current</th><th className="text-right px-3 py-2">Minutes</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.added} className={`border-t border-white/5 ${r.added === 25 ? 'bg-lime-300/5' : ''} ${r.added > 25 ? 'text-naw-orange/90' : 'text-white/80'}`}>
                    <td className="px-3 py-2">{r.added} g{r.added === 25 ? ' (rating)' : ''}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.w} g</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.tw.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">about {Math.round(r.power)}%</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.amps.toFixed(1)} A</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.min.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/55 text-sm mt-3">
            Working the motors harder does buy more lift, but it costs battery fast and leaves less push for steering. Past
            about 35 g added, the drone is using nearly 90% of its power just to hang in the air, with little left to catch
            itself when it tips.
          </p>
        </Section>

        <Section id="prediction" title="Our prediction">
          <div className="rounded-2xl border-2 border-naw-pink/50 bg-naw-pink/10 p-5">
            <p className="text-white text-lg font-semibold leading-snug">
              If we add more weight, then the Flying Mosquito will fly for less time and its motors will work harder,
              because it has to push more air down every second to stay up.
            </p>
            <ul className="mt-3 space-y-1.5 text-white/80 text-sm list-disc pl-5">
              <li>The four props together push about 120 g at full power (between 100 and 135 g).</li>
              <li>With everything on (26 g added, 87 g total) it flies, but a little slow to climb: about {Math.round(FULL.power)}% power to hover and about {FULL.min.toFixed(1)} minutes per battery.</li>
              <li>With nothing added it hovers about 9 minutes. Each 10 g added costs roughly a minute.</li>
              <li>It can still hover with 35 g added, but wobbles. With about 60 g added it cannot take off at all.</li>
            </ul>
          </div>
        </Section>

        <Section id="experiment" title="The experiment" sub="Two tests. Run in December (Dec 7 to 13) before the body and guard are final, so the answer can still change the design. No MS-2000 test days.">
          <Cards items={VARS} />
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div className="rounded-2xl border border-white/10 bg-naw-card p-4">
              <div className="text-lime-300 text-xs font-bold">TEST A</div>
              <div className="text-white font-bold text-lg">The push test (kitchen scale)</div>
              <ol className="mt-3 space-y-2">
                {TEST_A.map(([t, d], i) => (
                  <li key={i} className="text-sm"><span className="text-white font-semibold">{i + 1}. {t}</span><span className="block text-white/55">{d}</span></li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-white/10 bg-naw-card p-4">
              <div className="text-lime-300 text-xs font-bold">TEST B</div>
              <div className="text-white font-bold text-lg">The hover test (weight vs time)</div>
              <ol className="mt-3 space-y-2">
                {TEST_B.map(([t, d], i) => (
                  <li key={i} className="text-sm"><span className="text-white font-semibold">{i + 1}. {t}</span><span className="block text-white/55">{d}</span></li>
                ))}
              </ol>
            </div>
          </div>
          <div className="rounded-2xl border border-naw-orange/30 bg-naw-orange/10 p-4 mt-4 text-sm text-white/80">
            <span className="text-naw-orange font-bold">Safety: </span>
            Guard on, net closed, hands away while the props spin. A grown-up runs the motors and handles the batteries.
            Stop the moment anything smells hot or a battery puffs up.
          </div>
          <div className="mt-5">
            <div className="text-white font-semibold text-sm mb-2">Data sheet for the journal</div>
            <div className="rounded-2xl border border-white/10 overflow-x-auto">
              <table className="w-full text-xs min-w-[560px]">
                <thead className="bg-white/5 text-white/60">
                  <tr>{['Nickels', 'Added g', 'Real total g', 'Flight 1 min', 'Flight 2 min', 'Flight 3 min', 'Average', 'Motor %', 'Predicted min'].map((h) => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[0, 10, 20, 25, 30, 35].map((a) => (
                    <tr key={a} className="border-t border-white/5 text-white/70">
                      <td className="px-2 py-2">{a / 5}</td><td className="px-2 py-2">{a}</td>
                      {Array.from({ length: 6 }).map((_, i) => <td key={i} className="px-2 py-2 text-white/20">____</td>)}
                      <td className="px-2 py-2 text-lime-200">{predict(a).min.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white/45 text-xs mt-2">
              Graphs for the board: a line graph of minutes vs grams added (our prediction as a line, the real averages as dots),
              and a bar graph of push at 25, 50, 75 and 100% power.
            </p>
          </div>
        </Section>

        <Section id="decide" title="What the answer decides">
          <Cards items={[
            ['Keep Rev A', 'Full push of 115 g or more, and 5 minutes or more with 26 g added. Build as designed.'],
            ['Go lighter', 'Full push 105 to 115 g, or 4 to 5 minutes. Thinner guard, drop the wings, smaller battery: change order MOC-001.'],
            ['Bigger props', 'Full push under 105 g, or under 4 minutes. 65 mm props (the LiteWing supports them) and a bigger guard: change order MOC-001.'],
            ['Was the math right?', 'Put the real numbers next to the prediction. If they are off, find which guess was wrong. That is the conclusion.'],
          ]} />
        </Section>

        <Section id="fair" title="For Addie's science fair">
          <p className="text-white/70 text-sm max-w-3xl leading-relaxed">
            This is a real experiment: one thing changed on purpose (weight), the results measured (time and power), everything
            else kept the same, and each flight done 3 times. It can be a bonus experiment next to the MS-2000, with its own
            prediction, data table, graph and conclusion in the journal. The MS-2000 stays the main project, and the flyer only
            comes to the fair if Miss Taggart allows drones.
          </p>
        </Section>

        <Section id="sources" title="Sources">
          <ul className="space-y-1.5">
            {SOURCES.map(([t, u]) => (
              <li key={u}><a href={u} target="_blank" rel="noopener noreferrer" className="text-naw-cyan text-sm hover:underline">{t}</a></li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

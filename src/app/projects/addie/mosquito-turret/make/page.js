import { BASE, CAD, PARTS_PDF, meta, Nav, Back, Btn, Section, Title, Steps } from '../ui';
import { BUY } from '../parts';

export const metadata = meta(
  'Build your own laser turret: three levels for kids',
  'Start with a micro:bit hit detector, move up to a camera that follows a toy, then build the full MS-2000 laser mosquito turret. Free plans, code, print files, and science fair ideas.',
  `${BASE}/make`
);

const price = (pn) => BUY.find((b) => b.pn === pn)?.price || 0;
const MB = price('MBT0039') / 2;
const L2 = MB + price('MBT0042') + price('SEN0305') + (price('SER0049') / 3) * 2 + price('FIT0918');
const L3 = BUY.reduce((s, b) => s + (b.price || 0), 0);
const usd = (n) => `about $${Math.round(n / 5) * 5}`;

const LEVELS = [
  {
    n: 1,
    id: 'level-1',
    title: 'Hit Detector',
    tag: 'Start here',
    cost: `${usd(MB)} (one micro:bit V2)`,
    time: '30 minutes',
    you: 'A micro:bit V2, a USB cable, a computer, and a flashlight.',
    learn: ['Light sensors', 'Thresholds', 'Variables and if/then', 'Sound'],
  },
  {
    n: 2,
    id: 'level-2',
    title: 'Camera Tracker',
    tag: 'No laser',
    cost: `${usd(L2)}`,
    time: 'A weekend',
    you: 'Level 1 plus an AI camera, an expansion board, two servos, and a battery pack.',
    learn: ['Machine learning', 'Pixels and coordinates', 'Servos', 'Feedback loops'],
  },
  {
    n: 3,
    id: 'level-3',
    title: 'The full MS-2000',
    tag: 'With a grown-up',
    cost: `${usd(L3)} plus batteries and craft supplies`,
    time: 'About 6 weeks of weekends',
    you: 'A 3D printer, a soldering iron, and a grown-up for the laser.',
    learn: ['Everything above', 'Lasers and laser safety', 'Radio', 'Data logging', 'Pendulums'],
  },
];

const L1_CODE = `let hits = 0
input.lightLevel()
basic.pause(1000)

input.onButtonPressed(Button.A, function () {
    hits = 0
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
    basic.clearScreen()
})

input.onButtonPressed(Button.B, function () {
    basic.showNumber(hits)
    basic.pause(1000)
    basic.clearScreen()
})

basic.forever(function () {
    if (input.lightLevel() > 150) {
        hits += 1
        music.playTone(988, music.beat(BeatFraction.Sixteenth))
        basic.showIcon(IconNames.Target)
        basic.pause(300)
        basic.clearScreen()
        basic.pause(400)
    }
})`;

const L1_STEPS = [
  ['Open makecode.microbit.org and start a new project.', 'It is free and runs in the web browser.'],
  ['Find your threshold first.', 'Make a tiny program: forever, show number (light level). Write down the number in room light, then with the flashlight right on the micro:bit. Pick a number between them.'],
  ['Click the JavaScript tab and paste the code below.', 'Change 150 to your threshold. Click Blocks to see it as blocks.'],
  ['Download it to the micro:bit.', 'Plug in the USB cable and drag the file onto the MICROBIT drive.'],
  ['Shine the flashlight on the LED side.', 'The micro:bit beeps and shows a target. That is a hit.'],
  ['Press B to see your score, A to reset.', 'Now it is a game: can a friend hit it while you move it around?'],
];

const L1_TRY = [
  'Does standing farther away change the light number? Measure at 1, 2, and 3 steps.',
  'Does a red, blue, or white light give a bigger number?',
  'Can you score more hits in 30 seconds when the micro:bit is still or moving?',
];

const L2_PSEUDO = [
  ['start', 'text-naw-pink'],
  ['  pan = 90, tilt = 90', 'text-white/80'],
  ['forever', 'text-naw-pink'],
  ['  ask the camera for the learned object', 'text-naw-cyan'],
  ['  if it sees it', 'text-naw-cyan'],
  ['    if x > 170: pan = pan - 2', 'text-white/80'],
  ['    if x < 150: pan = pan + 2', 'text-white/80'],
  ['    if y > 130: tilt = tilt + 2', 'text-white/80'],
  ['    if y < 110: tilt = tilt - 2', 'text-white/80'],
  ['    servo P1 to pan, servo P2 to tilt', 'text-lime-300'],
  ['    if 150 < x < 170 and 110 < y < 130: beep, locked on!', 'text-lime-300'],
];

const L2_STEPS = [
  ['Plug the micro:bit into the expansion board.', 'We use the DFRobot Xia mi board. It has a HuskyLens port and 5 V servo pins.'],
  ['Connect the HuskyLens to the HuskyLens port, the pan servo to P1, and the tilt servo to P2.', 'Tape or rubber band the camera onto the tilt servo, and the tilt servo onto the pan servo.'],
  ['On the HuskyLens, pick Object Tracking. Point it at a toy and hold the learn button.', 'Move the toy closer and farther, and turn it, while it learns. A box appears around it when it knows it.'],
  ['In MakeCode, add the HuskyLens extension.', 'Extensions, then search HuskyLens. It gives blocks for the X and Y of the box.'],
  ['Build the program on the right with blocks.', 'Servos use the "servo write pin" block from Pins.'],
  ['Move the toy slowly. The camera follows.', 'If it turns the wrong way, swap the + and the - for that servo.'],
];

const L3_STEPS = [
  ['Buy the parts', 'Every part, two stores, with a backup for each.', [[`${BASE}/build#shopping`, 'Shopping list'], [PARTS_PDF, 'Parts list PDF']]],
  ['Print the body', '12 parts on five plates, about 10 hours of printing.', [[`${BASE}/build/batches`, 'Print plan']]],
  ['Look at it in 3D first', 'Spin it, tap a part, pull it apart.', [[`${CAD}/ms2000-turret-3d.html`, 'Turret in 3D'], [`${CAD}/ms2000-3d.html`, 'Whole setup']]],
  ['Build and code it', 'Addie adds the build steps and the code as she builds.', [[`${BASE}/build#steps`, 'Build steps']]],
  ['Learn how it works', 'Eleven short lessons with things to try.', [[`${BASE}/learn`, 'Learn the science']]],
];

const QUESTIONS = [
  ['Does a faster target get hit less?', 'The MS-2000 question. Swing the target from different heights.'],
  ['Does the camera learn better from more angles?', 'Teach it from 1 side, then 4 sides. Count how often it loses the target.'],
  ['Does the background color matter?', 'Try a black, white, and busy backdrop.'],
  ['Does target size matter?', 'Small, medium, and large targets. Time to first lock-on.'],
  ['Does target color matter?', 'Same toy in three colors, or colored paper covers.'],
  ['Do weak batteries make it miss more?', 'Fresh batteries against used ones. Count hits.'],
];

const GROWNUPS = [
  ['Laser class', 'Use only a laser labeled Class 2 (under 1 mW) from a known maker. Cheap laser pointers are often stronger than their label. Most school fairs do not allow anything above Class 3R; ask your fair first.'],
  ['Never at eyes', 'Mount the laser so it only points at the backdrop. The MS-2000 has an arm switch a grown-up controls.'],
  ['Soldering', 'The sensor and LED wires need soldering. A grown-up does it or supervises closely.'],
  ['School rules', 'Many fairs want the student to do the writing and a handwritten journal. These pages give the plan; the words should be the kid\u2019s.'],
  ['Free to use', 'Plans, print files, and code here are free for personal and school projects.'],
];

function Code({ text }) {
  return (
    <pre className="bg-naw-dark rounded-xl border border-white/10 p-4 text-xs sm:text-sm leading-6 overflow-x-auto text-white/85"><code>{text}</code></pre>
  );
}

function Pseudo() {
  return (
    <pre className="bg-naw-dark rounded-xl border border-white/10 p-4 text-xs sm:text-sm leading-6 overflow-x-auto">
      {L2_PSEUDO.map(([l, c]) => <div key={l} className={c}>{l}</div>)}
    </pre>
  );
}

function LevelHead({ lv }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="flex-none w-10 h-10 rounded-xl bg-naw-cyan text-naw-dark font-bold text-lg flex items-center justify-center">{lv.n}</span>
      <div>
        <h2 className="text-white text-xl sm:text-2xl font-bold">Level {lv.n}: {lv.title}</h2>
        <p className="text-naw-cyan text-sm font-semibold">{lv.cost} · {lv.time}</p>
      </div>
    </div>
  );
}

export default function MakePage() {
  return (
    <div className="min-h-screen">
      <Nav current="make" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-cyan/15 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-8">
          <Back href={BASE}>MS-2000</Back>
          <div className="mt-6">
            <Title size="text-2xl sm:text-3xl">BUILD YOUR OWN</Title>
          </div>
          <p className="text-white text-lg font-semibold mt-4 leading-snug">
            Want a turret of your own? Start small and level up. Each level teaches something new and makes a good science fair project by itself.
          </p>

          <div className="grid md:grid-cols-3 gap-3 mt-6">
            {LEVELS.map((lv) => (
              <a key={lv.id} href={`#${lv.id}`} className="group bg-naw-card rounded-2xl border border-naw-cyan/20 hover:border-naw-cyan/50 p-4 transition-colors flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-naw-cyan font-bold">Level {lv.n}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">{lv.tag}</span>
                </div>
                <div className="text-white font-bold text-lg mt-1 group-hover:text-naw-cyan transition-colors">{lv.title}</div>
                <div className="text-white/55 text-sm mt-1 flex-1">{lv.you}</div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {lv.learn.map((w) => <span key={w} className="text-[11px] px-2 py-0.5 rounded-full bg-lime-300/10 text-lime-300">{w}</span>)}
                </div>
                <div className="text-white/40 text-xs mt-3">{lv.cost} · {lv.time}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <section id={LEVELS[0].id} className="mt-12 scroll-mt-16">
          <LevelHead lv={LEVELS[0]} />
          <p className="text-white/70 text-sm mt-3 max-w-2xl">
            The micro:bit&apos;s LED screen can also sense light. Shine a flashlight on it and it counts a hit, just like the mosquito in the MS-2000.
          </p>
          <div className="grid md:grid-cols-2 gap-5 mt-5 [&>*]:min-w-0">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
              <Steps items={L1_STEPS} />
            </div>
            <div>
              <Code text={L1_CODE} />
              <p className="text-white/40 text-xs mt-2">The first light reading after power-on is always 0, so the code reads it once and waits.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-naw-pink/40 bg-naw-pink/10 p-4 mt-4">
            <div className="text-naw-pink text-xs font-semibold">Test it like a scientist</div>
            <ul className="mt-1 space-y-1">
              {L1_TRY.map((t) => <li key={t} className="text-white text-sm">{t}</li>)}
            </ul>
          </div>
        </section>

        <section id={LEVELS[1].id} className="mt-14 scroll-mt-16">
          <LevelHead lv={LEVELS[1]} />
          <p className="text-white/70 text-sm mt-3 max-w-2xl">
            An AI camera learns a toy, and two servos turn it to keep the toy in the middle of the screen. This is the MS-2000 without the laser.
          </p>
          <div className="grid md:grid-cols-2 gap-5 mt-5 [&>*]:min-w-0">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
              <Steps items={L2_STEPS} />
            </div>
            <div>
              <div className="text-white/50 text-xs font-semibold mb-2">The program, in plain words. The middle of the screen is x 160, y 120.</div>
              <Pseudo />
              <div className="flex flex-wrap gap-2 mt-3">
                <Btn href={`${BASE}/learn#camera`} small>How the camera learns</Btn>
                <Btn href={`${BASE}/learn#aiming`} small>How servos aim</Btn>
                <Btn href="https://learn.dfrobot.com/makelog-308707.html" small>DFRobot HuskyLens guide</Btn>
              </div>
            </div>
          </div>
          <div className="bg-naw-card rounded-2xl border border-white/10 p-4 mt-4">
            <div className="text-white/50 text-xs font-semibold">Parts for Level 2</div>
            <div className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {[['MBT0039', 1], ['MBT0042', 1], ['SEN0305', 1], ['SER0049', 2], ['FIT0918', 1]].map(([pn, q]) => {
                const b = BUY.find((x) => x.pn === pn);
                if (!b) return null;
                return (
                  <a key={pn} href={b.url} target="_blank" rel="noopener noreferrer" className="flex justify-between gap-3 py-1 text-white/75 hover:text-white">
                    <span>{q} × {b.name.replace(/ \(.*\)/, '')}</span>
                    <span className="text-white/40">{b.vendor}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section id={LEVELS[2].id} className="mt-14 scroll-mt-16">
          <LevelHead lv={LEVELS[2]} />
          <p className="text-white/70 text-sm mt-3 max-w-2xl">
            Add a safe laser, a mosquito that feels every hit, a wand that saves the data, sound effects, and a 3D printed body. Everything Addie uses is here.
          </p>
          <div className="space-y-3 mt-5">
            {L3_STEPS.map(([t, d, links], i) => (
              <div key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="flex-none w-8 h-8 rounded-full bg-naw-pink text-naw-dark font-bold flex items-center justify-center">{i + 1}</span>
                <div className="flex-1">
                  <div className="text-white font-bold">{t}</div>
                  <div className="text-white/55 text-sm">{d}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {links.map(([h, l]) => <Btn key={h} href={h} small>{l}</Btn>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Section id="questions" title="Science fair questions you can test" sub="Any level can answer a real question. Change one thing, count what happens, five runs each.">
          <div className="grid sm:grid-cols-2 gap-3">
            {QUESTIONS.map(([q, d]) => (
              <div key={q} className="bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="text-white font-bold">{q}</div>
                <div className="text-white/55 text-sm mt-1">{d}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Btn href={`${BASE}/learn#fair-test`}>How to run a fair test</Btn>
          </div>
        </Section>

        <Section id="grownups" title="For grown-ups">
          <div className="grid sm:grid-cols-2 gap-3">
            {GROWNUPS.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-naw-orange/40 bg-naw-orange/10 p-4">
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/65 text-sm mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

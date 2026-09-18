import { BASE, meta, Nav, Back, Section, Title } from '../ui';

export const metadata = meta(
  'Flying Mosquito: how drones fly',
  'The science behind the Flying Mosquito: lift and thrust, why props spin both ways, how a drone tilts to move, keeping balance, the floor camera, batteries, radio, and how real mosquitoes fly.',
  `${BASE}/learn`
);

const TOPICS = [
  {
    id: 'lift', title: 'Pushing air down to go up', color: 'lime',
    body: [
      'A drone does not float. Its propellers throw air down, and the air pushes the drone up. Scientists call that push thrust. This is Newton\u2019s third law: every push has an equal push back.',
      'To hover, the four props together must push up exactly as hard as the drone weighs. Our Flying Mosquito weighs about 87 grams, so its props have to push about 87 grams of force just to stay still.',
      'To climb, turn, and fight a wobble it needs extra push. Drone builders compare the most push the motors can make to the drone\u2019s weight. That is the thrust-to-weight ratio. Around 2 to 1 flies well. Close to 1 to 1, it can barely lift off.',
    ],
    fact: ['Try it', 'Hold a paper strip under a desk fan blowing down. Feel how hard the air pushes. Now picture four fans holding up a 87 gram drone.'],
  },
  {
    id: 'weight', title: 'Why every gram matters', color: 'lime',
    body: [
      'The LiteWing weighs 45 grams and can carry about 25 grams more. Our guard, body, window, sensor, and radio add about 26 grams. That is 1 gram over, about the weight of a paperclip.',
      'Extra weight means the motors spin faster just to hover. Faster motors use the battery up sooner and leave less push for turning. That is why every printed part was weighed in the computer before it was printed, and why the wings are thin clear plastic instead of printed.',
      'If the lift test fails, bigger 65 mm props move more air with each turn, which gives more push. That is our backup plan.',
    ],
    fact: ['Number to know', 'About 25 grams: the most the LiteWing can carry with its 55 mm props.'],
  },
  {
    id: 'spin', title: 'Why two props spin one way and two the other', color: 'cyan',
    body: [
      'When a motor spins a prop to the right, the prop pushes the motor to the left. That twist is called torque. If all four props spun the same way, the whole drone would twirl around like a top.',
      'So two props spin clockwise and two spin counterclockwise, on opposite corners. Their twists cancel out and the drone points where it should.',
      'That is also why the props are not all the same. Each one is shaped to push air down when it spins its own way. Put one on the wrong motor and the drone flips on takeoff.',
    ],
    fact: ['Look closely', 'On the LiteWing board, each motor spot is marked with which way it spins and which prop goes there.'],
  },
  {
    id: 'move', title: 'Tilting to move', color: 'cyan',
    body: [
      'A drone has no wheels or rudder. It moves by changing how fast each motor spins.',
      'Roll and pitch: speed up the two motors on one side and slow the other two. The drone tips, its push leans sideways, and it slides that way. Tip forward to go forward.',
      'Yaw: speed up the two clockwise props and slow the two counterclockwise props. The twists no longer cancel, so the drone turns in place. Our flight script uses yaw to keep the white window facing the turret the whole time.',
      'Up and down: all four motors faster or slower together.',
    ],
    fact: ['Three words', 'Roll (tip side to side), pitch (tip nose up or down), yaw (turn like a spinning chair).'],
  },
  {
    id: 'props', title: 'Propellers are spinning wings', color: 'cyan',
    body: [
      'Look at a prop from the side and each blade is shaped like a tiny airplane wing, and it is twisted. As it spins, it scoops air and throws it down.',
      'How far a prop would move forward in one turn, if it were a screw in wood, is called its pitch. More pitch or a bigger prop moves more air, which means more push, but the motor has to work harder.',
      'Props also make wind, called prop wash. That is why the mosquito body sits in the middle where no prop spins under it, and why the wings are tiny.',
    ],
    fact: ['Ground effect', 'Right above the floor, the air pushed down has nowhere to go and pushes back up. Drones float a little easier when they are very low. Ours takes off and lands through it every run.'],
  },
  {
    id: 'balance', title: 'Staying balanced', color: 'pink',
    body: [
      'A drone is like balancing a broom on your hand. It wants to fall over all the time. The LiteWing has a tiny chip with a gyroscope (feels turning) and an accelerometer (feels tilting and gravity).',
      'Hundreds of times every second, the computer reads the chip, figures out how tipped the drone is, and changes the four motor speeds to fix it. Reading, deciding, fixing, over and over, is called a feedback loop.',
      'The fix uses three questions, called PID: How far off am I? (P) How long have I been off? (I) How fast is it getting worse? (D). Tuning those three numbers is what makes a drone feel smooth or shaky.',
    ],
    fact: ['Try it', 'Balance a broom on your palm with your eyes open, then try it with your eyes closed. Without the "sensor" you cannot fix the wobble.'],
  },
  {
    id: 'where', title: 'Knowing where it is without GPS', color: 'pink',
    body: [
      'GPS does not work well indoors, so the positioning module uses two tricks.',
      'Height: a tiny laser range finder shines invisible light at the floor and times how long it takes to bounce back. Light is so fast that at 40 cm high the round trip takes less than 3 billionths of a second. The chip measures that anyway. This is called time of flight.',
      'Sliding: a small camera looks at the floor, like the sensor under a computer mouse. When the floor pattern moves in the picture, the drone knows it is sliding and pushes back. This is called optical flow.',
      'Adding up lots of small moves to know where you are is called dead reckoning. Tiny errors add up, so the drone slowly drifts. A plain or shiny floor gives the camera nothing to see, and the drift gets worse. That is why we fly over a flight mat with a bold pattern.',
    ],
    fact: ['Invisible laser', 'The height laser is a Class 1 laser at 940 nanometers, which is infrared. Safe for eyes and invisible. The MS-2000 laser is red and visible.'],
  },
  {
    id: 'battery', title: 'Batteries: the fuel tank', color: 'orange',
    body: [
      'The drone runs on a lithium polymer (LiPo) battery. One cell gives 3.7 volts when it is half full and 4.2 volts when it is full.',
      'mAh (milliamp hours) says how much energy is inside. A 600 mAh battery could give 600 milliamps for one hour. Our four motors pull much more than that, so a battery lasts only a few minutes of flying.',
      'The C rating says how fast the battery can give up its energy. A 600 mAh battery at 20C can give 12 amps. The LiteWing needs at least 20C, or the voltage drops when the motors speed up and the drone gets wobbly.',
      'LiPo batteries are powerful, so they need care: a grown-up charges them on a hard surface, never crush or poke them, unplug after flying, and stop using any battery that puffs up.',
    ],
    fact: ['Why three batteries', 'One flies while one cools down and one charges. Five 30 second runs fit in one battery with room to spare.'],
  },
  {
    id: 'radio', title: 'How a hit gets to the turret', color: 'orange',
    body: [
      'Radios send messages with invisible waves. WiFi, the micro:bit radio, and Bluetooth all use waves that wiggle about 2.4 billion times a second.',
      'A hit travels three hops: the light sensor wire to the XIAO, the drone\u2019s WiFi to the Pi, a USB cable to the micro:bit, and the micro:bit radio to the turret. Each hop takes only a few thousandths of a second, so the whole trip is well under half a second.',
      'The messages are plain words: GO, HIT, STOP. The turret already understands them from the MS-2000 wand. Using words everyone already knows is called a protocol.',
    ],
    fact: ['Same group', 'Radio group 7 is like a walkie-talkie channel. Only micro:bits on group 7 hear the message.'],
  },
  {
    id: 'mosquito', title: 'How real mosquitoes fly', color: 'lime',
    body: [
      'A mosquito weighs about 2 to 3 milligrams. Our Flying Mosquito weighs about 87 grams, roughly 35,000 times more.',
      'Mosquito wings beat about 600 to 800 times a second, which makes the high buzz you hear. Scientists filming mosquitoes found their wings flap in very short strokes, only about 40 degrees, much shorter than other insects, and use tricks with the air at each end of the stroke to make extra lift.',
      'Mosquitoes fly slowly, around 1 to 1.5 miles per hour. That is about the speed we start the Flying Mosquito at, so the turret gets a fair chance.',
      'Tiny things feel air differently. To a mosquito the air feels thick, a bit like honey feels to us. That is why tiny insects flap so fast, and why a drone cannot just be shrunk down to mosquito size.',
    ],
    fact: ['Built-in gyroscope', 'Most insects have 4 wings. Mosquitoes, like all flies, have 2 wings plus 2 tiny knobs called halteres that help them balance, a lot like the drone\u2019s gyroscope.'],
  },
  {
    id: 'safety', title: 'Flying safely', color: 'pink',
    body: [
      'Props spin thousands of times a minute. Even small props can cut a finger, so ours have a guard around the outside and only fly inside a net.',
      'The drone only takes off from its pad, with the net zipped except the front, and nobody reaches in while the props spin. A long press on GO lands it right away.',
      'Three kinds of light are in this project: the MS-2000 red laser (never look into it), the drone\u2019s invisible height laser (Class 1, eye safe), and the glowing white window.',
    ],
  },
];

const WORDS = [
  ['Thrust', 'The push from the props.'], ['Thrust-to-weight ratio', 'Most push divided by weight.'], ['Torque', 'A twisting push.'],
  ['Roll, pitch, yaw', 'Tip sideways, tip nose up or down, turn in place.'], ['Pitch (prop)', 'How far one turn of a prop would move it forward.'],
  ['Prop wash', 'The wind a prop makes.'], ['Ground effect', 'Extra push when a drone is close to the floor.'],
  ['Gyroscope', 'A sensor that feels turning.'], ['Accelerometer', 'A sensor that feels tilting, speeding up, and gravity.'],
  ['Feedback loop', 'Measure, decide, fix, repeat.'], ['PID', 'A way to decide how hard to fix something: how far off, how long, how fast.'],
  ['Optical flow', 'Seeing movement by watching a picture slide.'], ['Time of flight', 'Measuring distance by timing a bounce of light.'],
  ['Dead reckoning', 'Adding up small moves to know where you are.'], ['LiPo', 'Lithium polymer battery.'],
  ['mAh', 'How much energy a battery holds.'], ['C rating', 'How fast a battery can give its energy.'], ['Protocol', 'The agreed words two machines use.'],
];

const SOURCES = [
  ['LiteWing wiki (CircuitDigest): specs, payload, battery guide, positioning module', 'https://circuitdigest.com/wiki/litewing/'],
  ['Bomphrey et al., Smart wing rotation and trailing-edge vortices enable high frequency mosquito flight, Nature 2017', 'https://www.nature.com/articles/nature21727'],
  ['Crazyflie Python library (cflib), used by the LiteWing', 'https://github.com/bitcraze/crazyflie-lib-python'],
];

const COLORS = {
  lime: 'border-lime-300/30 text-lime-300', cyan: 'border-naw-cyan/30 text-naw-cyan',
  pink: 'border-naw-pink/30 text-naw-pink', orange: 'border-naw-orange/30 text-naw-orange',
};

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      <Nav current="learn" />
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">
        <Back href={BASE}>Flying Mosquito</Back>
        <div className="mt-5">
          <Title size="text-2xl sm:text-3xl">HOW DRONES FLY</Title>
          <p className="text-white/70 mt-3 max-w-2xl">
            The science inside the Flying Mosquito: pushing air, spinning props, staying balanced, knowing where you are,
            and how a real mosquito does it all with two wings.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {TOPICS.map((t, i) => (
              <a key={t.id} href={`#${t.id}`} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white">
                {i + 1}. {t.title}
              </a>
            ))}
            <a href="#words" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white">Words</a>
          </div>
        </div>

        {TOPICS.map((t, i) => (
          <Section key={t.id} id={t.id} title={`${i + 1}. ${t.title}`}>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                {t.body.map((p) => <p key={p.slice(0, 30)} className="text-white/75 leading-relaxed">{p}</p>)}
              </div>
              {t.fact && (
                <div className={`rounded-2xl border bg-naw-card p-4 h-fit ${COLORS[t.color]}`}>
                  <div className="text-xs font-bold">{t.fact[0]}</div>
                  <div className="text-white/75 text-sm mt-1">{t.fact[1]}</div>
                </div>
              )}
            </div>
          </Section>
        ))}

        <Section id="words" title="Words to know">
          <div className="grid sm:grid-cols-2 gap-2">
            {WORDS.map(([w, d]) => (
              <div key={w} className="bg-naw-card rounded-xl border border-white/10 px-4 py-2.5">
                <span className="text-white font-semibold text-sm">{w}: </span>
                <span className="text-white/60 text-sm">{d}</span>
              </div>
            ))}
          </div>
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

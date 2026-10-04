import Link from 'next/link';
import { Nav } from '../ui';

const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
const TITLE = 'Dusty: changing the plan, and what we learned';
const DESC = 'How engineers change a design without breaking it, the change we made to Dusty, the project history, and lessons for the next project.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://nawgames.com/projects/nolan/dusty/changes',
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

const WHY = [
  ['Everything is connected', 'Change one part and it can bump into three others. A bigger battery can block a screw, add weight, and change how fast the robot drives.'],
  ['You remember why', 'Weeks later, nobody remembers why a part is the way it is. The change order says what changed, why, and who said yes.'],
  ['Everyone has the same plan', 'The parts list, the 3D model, the print files and the build guide all get updated together, so nobody builds from an old page.'],
  ['Surprises show up early', 'Checking a change on paper costs minutes. Finding the problem after printing costs hours and plastic.'],
];

const STEPS = [
  ['Say what you want and why', 'Write one or two sentences. "Swapping AA batteries is hard and a set only lasts 90 minutes. I want a cheap way to charge Dusty with a USB-C cable instead."'],
  ['Check what it touches', 'Space, wiring, weight, safety, cost, the schedule, and the experiment. Measure, do not guess.'],
  ['Pick the parts', 'Find real parts with real sizes and prices from stores you can check. Write down a backup.'],
  ['Get a yes, then lock it', 'The person in charge approves it. Now the design is locked. Any new change starts a new change order.'],
  ['Update everything and test it', 'Model, print files, parts list, build steps. Then list the tests that prove the change works.'],
];

const FOUND = [
  ['The power bank did not fit', 'Every bank we found was at least 90 mm long, and the space for the batteries was only 62 mm. We turned the bank sideways and gave it its own printed sleeve.'],
  ['The plug stuck out too far', 'A straight USB plug made Dusty wider than 5 inches. A small 90 degree adapter turns the cable so it runs along the side.'],
  ['The sleeve could not print with the base', 'The base prints upside down, so a tall sleeve on top would hang in the air. The sleeve became its own part that screws on.'],
  ['The charge lights got hidden', 'The circuit board sits right over the lights on the power bank. Now we charge before every session, or slide the bank out to check.'],
  ['Dusty got heavier', 'The sleeve and the cable add about 50 grams. Our 300 gram limit had no reason behind it, so Dad raised it to 400 grams. The real safety test is whether Dusty still stops at the edge 20 times out of 20.'],
];

const TOUCHED = ['3D model and all 19 print files', 'Parts list', 'Build guide step 4', 'Screw count (19 to 23)', 'Robot height (65 to 75 mm)', 'Weight limit', 'Test plan'];

// Newest first. Add a line every time something about the plan changes.
const LOG = [
  ['Oct 4', 'Plan', 'Test T2 Wheels passed. Button A turns the port wheel and button B the starboard wheel. The port wheel ran backward, because the two motors face opposite ways, so the code sets the port (LEFT) motor to invert. Spec: Invert LEFT (port) = yes, Invert RIGHT (starboard) = no.'],
  ['Oct 4', 'Decision', 'Sides are called port and starboard from now on. Port is Dusty\u2019s own left and starboard its own right, as if you were riding on Dusty facing the way it drives. That never changes when you turn Dusty around or look at it from the front. The moto:bit LEFT terminal drives the port wheel and RIGHT drives the starboard wheel. Test T2 now shows P and S.'],
  ['Oct 4', 'Fix', 'Test T2 Wheels: the micro:bit showed L and R but neither wheel turned. Cause: the black wire from each motor was in the moto:bit terminal instead of the white one. On these motors red and white run the motor; black is ground for the little encoder board, so the motor never got a full circuit. Fixed by putting red and white in the terminals and taping back black, blue, yellow and green. Both wheels turn. The test program also now waits half a second before turning the motors on and turns them on again at every button press.'],
  ['Sep 30', 'Change', 'MOC-008: Dusty is coded with Claude instead of hand-built MakeCode blocks. Nolan writes the spec file and the tests, Claude writes the code, Nolan reads every line in the Blocks view before flashing. Code Lab added to the Build Guide with test programs T1 to T9 in steps 4, 5, 7, 8 and 11. Calibration moves from button A to switch-on. R6 becomes: explain every wire and every line. Plan and code only, no parts or print files.'],
  ['Sep 30', 'Change', 'MOC-007 published: the moto:bit screws onto four printed risers on the deck instead of zip ties. Only the deck changed: the deck file and Plate 3 are revA7, every other file keeps its revision. Deck-only print file added. Build Guide step 4, the Batch 3 check, the screw map (23 to 27) and the pictures updated. Approved Sep 27; the site update waited until the server connection was back.'],
  ['Sep 27', 'Plan', 'Size limit (under 5 by 5 inches) is measured on the robot itself, not the power cord. The straight power plug on the moto:bit sticks out about 20 mm past the left wheel, which is fine under this rule. Dusty measures 121 by 126 mm.'],
  ['Sep 27', 'Change', 'MOC-006: the deck fits the real moto:bit. The left side guide stops at y 88 so the power socket has room, and both zip tie slots moved (the front tie could not get under the deck past the battery sleeve wall, and the back tie pressed on the power socket). Only the deck changed: the deck file and Plate 3 are revA6, every other file stays revA5. Build Guide step 4 updated.'],
  ['Sep 27', 'Change', 'MOC-005: a window in the base for the little board and plug on each wheel motor, the old motor wire slot removed, and a small pocket under the battery sleeve over each window. Motor measured at 33 mm long with its plug (the model said 37). All 5 plates re-sliced. Every download now has revA5 in its name, and the old files were deleted. Build Guide steps 2, 4 and 5 updated, with the motor wire colors.'],
  ['Sep 27', 'Plan', 'Print plan and build guide merged into one Build Guide: each batch is a chapter (print, know your parts, clean up and check, then the build steps it unlocks), with 3D pictures from the Rev A.3 design and the original drawings.'],
  ['Sep 27', 'Change', 'MOC-004: screw lead-in (45 degree chamfer, 4.2 mm wide, 1 mm deep) on the deck post tops, motor pad and caster screw holes, and the post holes in the base made smaller, 4.30 to 3.95 mm. All print files re-sliced (Rev A.3).'],
  ['Sep 27', 'Plan', 'Fit check 4: three more base pieces at 4.05, 4.00 and 3.95 mm. Number 6 (3.95) was snug.'],
  ['Sep 27', 'Plan', 'Fit check 3: base pieces at 4.20, 4.15 and 4.10 mm were all still loose. Of three screw lead-ins, number 2 (big 45 degree chamfer) started the screw best.'],
  ['Sep 26', 'Plan', 'Two hole test pieces added to Batch 1: a corner of the real deck and a patch of the real base. They check the screw and post holes before the big prints.'],
  ['Sep 26', 'Change', 'MOC-003: holes made bigger to match our printer. Screw holes 1.8 to 2.2 mm, motor gear hole 1.85 to 2.1 mm, and every other hole gets the same extra room. All print files re-sliced.'],
  ['Sep 26', 'Plan', 'Fit check 2 printed: five posts and five motor gears, each a little bigger. Number 4 won both tests.'],
  ['Sep 26', 'Fix', 'Batch 1 fit check failed: the screw would not start in the deck post and the motor gear would not go on the shaft. Both holes printed too small.'],
  ['Sep 26', 'Plan', 'Print plan got pictures: every part next to a penny, labeled print plates, and a 3D picture for every step.'],
  ['Sep 16', 'Plan', 'Parts ordered and arriving in separate boxes. Added the Inventory page: a check-in list for every part, what to do if one is wrong, and how to keep them organized.'],
  ['Sep 15', 'Change', 'MOC-002: Button B changes from an expanding spiral to Spot Clean, which sweeps a 1 foot square in front of Dusty in rows. Experiment B becomes a spill race: Spot Clean against random bounce on the same 5 g spill. Code and plan only, no parts.'],
  ['Sep 15', 'Change', 'Weight limit raised from 300 g to 400 g (change order MOC-001, Rev D.1).'],
  ['Sep 15', 'Change', 'MOC-001: USB-C power bank in a printed sleeve replaces the 4 AA battery pack. Deck 10.5 mm higher, two posts instead of four, keeper bar added. Print total goes from 77 g to 101 g.'],
  ['Sep 15', 'Design', 'Crumb tray Rev B: only the front edge touches the table, and the bottom slopes up toward the back so it does not drag.'],
  ['Sep 15', 'Plan', 'Five print batches, each followed by the build steps it unlocks. A 10 minute fit-check print goes first.'],
  ['Sep 15', 'Fix', 'The 3D model had the micro:bit standing up. The real one lies flat in its connector. Model and guide corrected.'],
  ['Sep 15', 'Decision', 'Kept the design as is for the speed experiment. No swappable sensor arms.'],
  ['Sep 15', 'Decision', 'Brush: pipe cleaners on a printed roller, turned by printed gears, with a plain on/off switch.'],
  ['Sep 15', 'Change', 'Chassis switched from foam board to a fully 3D printed design.'],
  ['Sep 14', 'Decision', 'Spot Clean mode instead of a crumb sensor. The sensor did not fit the parts we already had.'],
  ['Sep 14', 'Plan', 'Parts list checked link by link. Two stores turned out to be dead ends and were replaced.'],
  ['Sep 14', 'Decision', 'The robot is named Dusty.'],
  ['Sep 14', 'Decision', 'Picked the crumb-sweeping robot with cliff detection from a list of cleaning robot ideas.'],
];

const MOC8 = [
  ['Who writes the code', 'Nolan, block by block in MakeCode', 'Claude, from Nolan’s prompts', 'Nolan owns the spec, the prompts and the tests'],
  ['How code is checked', 'Build it, run it', 'Predict, read in Blocks, flash, test, log', 'Every test has a pass mark written down before it runs'],
  ['Instructions to the computer', 'Block lists in the Build Guide', 'dusty-spec.txt: pins, measured numbers, 8 rules', 'Claude reads the spec at the start of every prompt'],
  ['Test programs', 'Heart on button A, one sensor readout', 'T1 to T9, one job each', 'Built in order; the main program is assembled from ones that passed'],
  ['Calibration', 'Press button A while sitting on the table', 'Automatic at switch-on, 1 s still, table reading + 200 per sensor', 'Frees button A for random bounce, which T8 needs'],
  ['Loop speed', 'Assumed 40 ms', 'Rule: 25 loops a second or more, measured with T5', 'A picture on the LEDs inside forever drops it to 1 to 2 a second (T5b)'],
  ['Requirement R6', 'Explain every wire', 'Explain every wire and every line', 'The judges’ question: did you write this?'],
  ['Editor', 'MakeCode Blocks', 'MakeCode JavaScript, read in Blocks', 'Same program either way; Blocks is how Nolan reads it'],
];

const MOC8_TOUCHED = ['Build Guide: new Code Lab section', 'Build Guide steps 4, 5, 7, 8, 11', 'Weekend plan', 'Fixing it table', 'Words to know', 'Learn page (the brain)', 'Starter spec file', 'Design document'];

const MOC7 = [
  ['moto:bit risers', 'Deck', 'none', '4 round risers, 6 mm across, 5 mm tall', 'Hole positions from SparkFun’s board file: back pair 40 mm apart, 5.88 mm from the back edge; neck pair 20 mm apart, 20.32 mm from the connector edge'],
  ['Riser screw holes', 'Deck', 'none', '2.2 mm pilot, 45° lead-in, blind with a 0.6 mm floor', 'Same pilot and lead-in as every other screw hole (MOC-003, MOC-004). No screw tip shows under the deck'],
  ['Board height above the deck', 'Deck', '0 mm (on its solder bumps)', '5 mm', 'The 2 to 3 mm of pins and solder under the board keep at least 2 mm of air'],
  ['How the board is held', 'Assembly', '2 zip ties', '4 × M2 × 8 down through the board', 'About 6.4 mm of thread in each riser'],
  ['Screw count', 'Whole robot', '23 (18 × M2 × 8)', '27 (22 × M2 × 8)', 'The 2 back screws alone hold the board if you run short'],
  ['Part volume', 'Deck', '13.46 cm³', '13.90 cm³', '3D model'],
  ['Plate 3 (deck, sleeve, arms) print', 'Plate 3', '42.0 g, 1 h 46 min', '42.7 g, 1 h 50 min', 'Slicer'],
  ['Deck by itself', 'New print file', 'none', '15.0 g, 33 min', 'dusty-deck-only-revA7, for reprinting just the deck'],
  ['Robot height', 'Whole robot', 'about 81 mm', 'about 86 mm', 'Footprint unchanged, 120.6 × 125.9 mm'],
];

const MOC7_TOUCHED = ['3D model (Rev A.7)', 'Deck', 'Plate 3 re-sliced', 'Deck-only print file', 'Build Guide step 4', 'Batch 3 check', 'Screw map', 'Assembly pictures', '3D viewers'];

const MOC6 = [
  ['Left side guide', 'Deck', 'y 39 to 108 mm', 'y 39 to 88 mm', 'Barrel jack overhangs the left board edge 3.5 to 5.3 mm, 54.5 to 65 mm back from the connector, 1.6 mm up. It hit the 3 mm guide by 29 mm³'],
  ['Front zip tie slots', 'Deck', 'y 60 to 64 mm', 'y 56.8 to 60.2 mm', 'Old slots sat over the battery sleeve front wall (y 60.6 to 62.2): a tie could not pass under the deck (142 mm³ overlap). New tie crosses the board neck, clear of the posts and the wall'],
  ['Back zip tie slots', 'Deck', 'y 96 to 100 mm', 'y 84 to 88 mm', 'Old tie crossed the barrel jack. New tie runs between the motor sockets and the jack, over the bank inside the sleeve (7.1 mm gap)'],
  ['Part volume', 'Deck', '13.57 cm³', '13.46 cm³', '3D model'],
  ['Plate 3 (deck, sleeve, arms) print', 'Plate 3', '42.2 g, 1 h 46 min', '42.0 g, 1 h 46 min', 'Slicer'],
  ['Download file names', 'Deck and Plate 3 only', 'dusty-deck-revA5.stl', 'dusty-deck-revA6.stl', 'Unchanged parts keep their revA5 files'],
];

const MOC6_TOUCHED = ['3D model (Rev A.6)', 'Deck', 'Barrel jack added to the model', 'Plate 3 re-sliced', 'Build Guide step 4'];

const MOC5 = [
  ['Motor length, gearbox face to back of plug', '3D model (N20 motor)', '37 mm (assumed)', '33 mm', 'Measured with a ruler, about ±1 mm'],
  ['Encoder window, one per motor, through', 'Base', 'none', '|x| 7 to 17.8 mm, y 52 to 66 mm', 'Board and plug reach 16 mm from the motor centerline; the plate underside is 14 mm'],
  ['Wall to the sleeve tab screw hole', 'Base', 'solid', '0.8 mm', 'Tab screws stay at ±20 mm, so a sleeve already printed still fits'],
  ['Motor wire slot', 'Base', 'x −13 to −5, y 44 to 49 mm', 'removed', 'Wires now come up through the windows'],
  ['Pocket under the floor and front wall', 'Battery sleeve', 'floor 2.5 mm', '1.0 mm over |x| 7 to 17.8, y 59.6 to 66 mm', 'Board clears the sleeve by about 2.5 mm (1 mm without it)'],
  ['Part volume', 'Base / battery sleeve', '37.0 / 21.0 cm³', '36.2 / 20.8 cm³', '3D model'],
  ['Plate 2 (base) print', 'Plate 2', '36.6 g, 1 h 21 min', '36.0 g, 1 h 21 min', 'Slicer'],
  ['Download file names', 'Every print file, viewer and zip', 'dusty-base.stl', 'dusty-base-revA5.stl', 'Old files deleted, so an old download cannot be mistaken for a current one'],
];

const MOC5_TOUCHED = ['3D model (Rev A.5)', 'Base and battery sleeve', 'All 5 plates re-sliced', 'Every file renamed revA5', 'Build Guide steps 2, 4 and 5', 'Motor and wiring drawings', '3D pictures', '3D viewers', 'Source zip'];

const MOC4 = [
  ['Screw lead-in (45° funnel)', 'Deck posts (top), base motor pads and caster posts', 'none', '4.2 mm wide, 1.0 mm deep', 'Tested: fit check 3 #2'],
  ['Post peg holes', 'Base (and the base test piece)', '4.30 mm', '3.95 mm', 'Tested: fit check 4 #6'],
];

const MOC3 = [
  ['M2 screw pilot (screw threads in)', 'Deck posts, base, battery sleeve, deck, motor mount', '1.8 mm', '2.2 mm', 'Tested: fit check 2 #4'],
  ['Motor gear on the motor shaft', 'Motor gear', '1.85 mm', '2.1 mm', 'Tested: fit check 2 #4'],
  ['M2 pass-through', 'Base, deck, sensor arm slots, washer', '2.4 mm', '2.8 mm', '+0.4, same as the pilot'],
  ['Deck screw head pocket', 'Deck', '4.4 mm', '4.8 mm', '+0.4, same as the pilot'],
  ['Whisker switch screws', 'Left sensor arm', '2.3 mm', '2.7 mm', '+0.4, same as the pilot'],
  ['Big gear on its peg', 'Big gear', '5.2 mm', '5.45 mm', '+0.25, same as the gear'],
  ['Axle holes (D shape)', 'Roller, roller gear, collar', 'axle +0.1 to +0.3', '0.25 mm more', '+0.25, same as the gear'],
  ['Axle holes in the side walls', 'Base', '4.6 mm', '4.85 mm', '+0.25, same as the gear'],
  ['Post pegs', 'Base', '4.05 mm', '4.3 mm', '+0.25, same as the gear'],
  ['Dowel holes', 'Base, motor mount', '3.1 mm', '3.35 mm', '+0.25, same as the gear'],
  ['Motor pocket and boss', 'Motor mount', '0.25 mm gap', '0.375 mm gap', '+0.25 across, same as the gear'],
];

const MOC3_TOUCHED = ['3D model (Rev A.2)', '13 of 17 part files', 'All 5 plates re-sliced', '3D viewers', 'Print plan pictures', 'Source zip'];

const LESSONS = [
  ['Check every wire against the color chart', 'On most things black means ground, so it looked like a motor wire. On these motors it is not. The Build Guide had the right colors; we went by habit instead of the chart. Read the chart for every wire before you power up.'],
  ['Split the problem in half', 'The L and R showed on the screen, so the program was running and the problem had to be power or wires. One clue cut the search in half before touching any code.'],
  ['Name sides so they never flip', 'Left and right swap when you look at Dusty from the front. Port and starboard belong to the robot itself, so everyone means the same wheel no matter where they stand.'],
  ['Use the holes the part came with', 'The moto:bit has four mounting holes. Screwing it to risers under those holes holds it better than zip ties, and the maker’s drawing gives exact positions.'],
  ['A change is not done until every page matches', 'MOC-007 was approved, but the Build Guide still said zip ties for three days. Update the guide, the files and the log in the same sitting.'],
  ['Write the rules down before you ask for code', 'Claude only knows what you tell it. The spec file is where the pins, the numbers you measured and the safety rules live, so every program starts from the same facts.'],
  ['Model the cable and plug, not just the part', 'The 3D model had the motor’s length with its connector, but not the little board and plug sticking out sideways. The plug hit the base. Draw the wires and plugs too, and where they have to go.'],
  ['Measure the space before picking a part', 'We picked a power bank before checking the room it had. A two-minute check with the 3D model would have shown it could not go lengthwise.'],
  ['Every number needs a reason', 'The 300 gram limit was a guess. When we needed to change it, there was nothing behind it. Write down why each limit exists.'],
  ['Check sizes from two places', 'Anker says the bank is 22 mm thick. The store says 0.9 inches, which is almost 23 mm. When two sources disagree, design for the bigger one.'],
  ['Think about using it, not just building it', 'Where will you plug in the charger? Can you reach the button? Can you see the lights? Those questions found real problems.'],
  ['Check the real part against the model', 'The micro:bit was drawn standing up. Looking at a photo of the real part caught it before anything was printed.'],
  ['Print a small test first', 'A 10 minute fit-check print tells you if the holes come out the right size before a 90 minute print. Ours failed, which is exactly what it is for: it cost 10 minutes instead of a ruined base.'],
  ['Test several sizes at once', 'Instead of guessing one new size, we printed five in a row and picked the winner. One print answered the question.'],
  ['Check links before ordering', 'Two stores on the first parts list could not take orders. Opening every link first saved a wasted order.'],
  ['Decide what the experiment needs early', 'The speed test needs steady power. That turned out to be a good reason for the power bank, not just an easier way to charge.'],
];

const NEXT = [
  'Write the goal and the big question on one page before picking parts.',
  'Give every requirement a number and a reason.',
  'Make a 3D model and check that every part fits before ordering.',
  'Order everything in one go, one order per store.',
  'Print or build a small test piece first.',
  'Lock the design, then use a change order for anything after that.',
  'Keep this history log up to date: one line for each decision or change.',
  'Leave empty weekends at the end for surprises.',
];

function Section({ title, sub, children }) {
  return (
    <section className="mt-12">
      <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
      {sub && <p className="text-white/50 text-sm mt-1 max-w-2xl">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Cards({ items, accent = 'cyan' }) {
  const border = accent === 'orange' ? 'border-naw-orange/30' : 'border-naw-cyan/20';
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map(([t, d]) => (
        <div key={t} className={`bg-naw-card rounded-2xl border ${border} p-4`}>
          <div className="text-white font-bold">{t}</div>
          <div className="text-white/60 text-sm mt-1 leading-relaxed">{d}</div>
        </div>
      ))}
    </div>
  );
}

const TAG = {
  Change: 'bg-naw-orange/20 text-naw-orange',
  Decision: 'bg-naw-cyan/20 text-naw-cyan',
  Design: 'bg-white/10 text-white/80',
  Fix: 'bg-red-500/20 text-red-300',
  Plan: 'bg-green-500/15 text-green-300',
};

export default function DustyChangesPage() {
  return (
    <div className="min-h-screen">
      <Nav current="changes" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-cyan/15 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10">
          <Link href="/projects/nolan/dusty" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dusty
          </Link>
          <h1 className="font-game text-xl sm:text-2xl glow mt-6">
            <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">CHANGING THE PLAN</span>
          </h1>
          <p className="text-white text-lg font-semibold mt-4 leading-snug">
            Engineers change their designs all the time. The trick is changing one thing without breaking something else.
          </p>
          <p className="text-white/55 text-sm mt-2 leading-relaxed max-w-2xl">
            This page explains how real engineers handle a change, shows the change we made to Dusty, keeps the history of
            every decision, and saves what we learned for the next project.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section title="What is Management of Change?">
          <div className="bg-naw-card rounded-2xl border border-naw-cyan/30 p-5">
            <p className="text-white leading-relaxed">
              <b>Management of Change</b>, or <b>MOC</b>, is a simple rule: once a design is decided, you do not just swap
              a part. You write down the change, check everything it touches, get a yes from the person in charge, and then
              update every plan and drawing.
            </p>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              Think of a recipe. Swapping sugar for honey sounds easy, but honey is wet, so now the flour is wrong, the oven
              time is wrong, and the cookies spread. A good cook thinks it through before pouring. Factories, refineries and
              airplane makers use MOC because a small change they did not think through can cause a big problem.
            </p>
          </div>
        </Section>

        <Section title="Why it matters">
          <Cards items={WHY} />
        </Section>

        <Section title="The five steps" sub="Use these for any change after the design is locked. A loose screw or a typo does not need one. A different part, size, power source or plan does.">
          <ol className="space-y-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4 bg-naw-card rounded-2xl border border-white/10 p-4">
                <span className="flex-none w-8 h-8 rounded-full bg-naw-orange text-naw-dark font-bold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block text-white font-bold">{t}</span>
                  <span className="block text-white/60 text-sm mt-0.5 leading-relaxed">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-2xl border border-naw-orange/30 bg-naw-orange/10 p-4 text-sm text-white/80 leading-relaxed">
            <b className="text-naw-orange">Where it fits in our process:</b> pick the idea, design it, <b>lock the design</b>,
            order the parts, build. After the lock, every change goes through these five steps before anything is ordered or
            printed.
          </div>
        </Section>

        <Section title="Our example: change order MOC-001" sub="Sep 15, 2026. Replace the 4 AA battery pack with a USB-C power bank.">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">The problem</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Taking batteries in and out of Dusty was hard, and one set of AA batteries only lasts about 90 minutes. We needed a cheap, long-term way to charge quickly.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">The idea</div>
              <div className="text-white text-sm mt-1 leading-relaxed">A power bank that stays inside and charges with a phone charger.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">A bonus</div>
              <div className="text-white text-sm mt-1 leading-relaxed">It gives a steady 5 volts, so batteries running down cannot mess up the speed test.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Options we compared</h3>
          <p className="text-white/60 text-sm mt-1 leading-relaxed">
            Regular AA batteries, rechargeable AA batteries, AA batteries with their own USB-C plug, a bare lithium battery
            with a charging board, and a store-bought power bank. Only the power bank charges without taking anything out,
            and it is sealed and made safe by the company that builds it. It cost about $24.
          </p>
          <h3 className="text-white font-bold mt-6">What checking it found</h3>
          <p className="text-white/50 text-sm mt-1">Each of these would have been a nasty surprise on build day.</p>
          <div className="mt-3">
            <Cards items={FOUND} accent="orange" />
          </div>
          <h3 className="text-white font-bold mt-6">What had to be updated</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {TOUCHED.map((t) => (
              <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-4 leading-relaxed">
            The change order went through four versions (A, B, C and D) as we learned more, then Dad approved and locked it.
            The tests that prove it works: the bank fits, it stays on while driving, a stalled wheel does not reset the
            micro:bit, it runs longer than 20 minutes, Dusty still stops at the edge 20 out of 20 times, and it weighs under
            400 grams.
          </p>
          <div className="mt-4">
            <Link href="/projects/nolan/dusty/build" className="bg-naw-orange text-naw-dark hover:bg-naw-orange/90 inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors">
              See the new design
            </Link>
          </div>
        </Section>

        <Section title="Change order MOC-008: coding Dusty with Claude" sub="Sep 30, 2026. Approved by Dad.">
          <div className="bg-naw-card rounded-2xl border border-naw-orange/40 p-5">
            <div className="text-naw-orange text-xs font-semibold">The short version</div>
            <p className="text-white leading-relaxed mt-1">
              Nolan stops dragging code blocks by hand. Claude writes Dusty&apos;s code instead, and Nolan does the engineer&apos;s
              job: he writes down exactly what Dusty must do, asks Claude for one small program at a time, reads every line
              before it goes on the robot, and proves it works with tests he designs first.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">Why we need it</div>
              <div className="text-white text-sm mt-1 leading-relaxed">By the time Nolan is grown up, people will tell computers what to build more than they type code themselves. The skill that lasts is saying exactly what you want, and catching it when the computer gets it wrong. A robot that can fall off a table is a good place to practice that.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">How we picked</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Two choices: keep block coding, or code with Claude. We picked Claude, with three guardrails: a spec file Claude reads every time, a test program for each build step with the pass mark written first, and a rule that Nolan can explain every line. The robot, its parts and the build order do not change.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Technical record</h3>
          <div className="mt-2 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-xs text-left">
                  <th className="px-4 py-2 font-semibold">What</th>
                  <th className="px-4 py-2 font-semibold">Was</th>
                  <th className="px-4 py-2 font-semibold">Now</th>
                  <th className="px-4 py-2 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {MOC8.map(([h, was, now, basis]) => (
                  <tr key={h}>
                    <td className="px-4 py-2 text-white">{h}</td>
                    <td className="px-4 py-2">{was}</td>
                    <td className="px-4 py-2 text-naw-orange font-semibold">{now}</td>
                    <td className="px-4 py-2 text-white/60">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            Claude accounts are for grown-ups, so Claude runs on Dad&apos;s account with Dad beside Nolan. Not changed: every part,
            every print file (revision tags stay as they are), the wiring, the cliff math, the experiment, the due dates.
          </p>
          <h3 className="text-white font-bold mt-6">What had to be updated</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {MOC8_TOUCHED.map((t) => (
              <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <h3 className="text-white font-bold mt-6">Tests that prove it works</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/75 list-disc pl-5">
            <li>Every test program T1 to T9 passes its written pass mark, logged in the notebook.</li>
            <li>The main program runs 25 loops a second or more (T5 on Dusty v1).</li>
            <li>Dusty still stops at the edge 20 times out of 20.</li>
            <li>Nolan can point at any line of the final program and say what it does.</li>
          </ul>
          <div className="mt-4">
            <Link href="/projects/nolan/dusty/build/guide#code" className="bg-naw-orange text-naw-dark hover:bg-naw-orange/90 inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors">
              Open the Code Lab
            </Link>
          </div>
        </Section>

        <Section title="Change order MOC-007: screws instead of zip ties" sub="Sep 27, 2026. Approved by Dad. Published Sep 30.">
          <div className="bg-naw-card rounded-2xl border border-naw-orange/40 p-5">
            <div className="text-naw-orange text-xs font-semibold">The short version</div>
            <p className="text-white leading-relaxed mt-1">
              The moto:bit has four holes made for screws, but we were holding it down with zip ties, resting on the lumpy
              solder bumps underneath. Now the deck has four little round towers called risers, one under each hole. The board
              sits on top of them and four tiny screws hold it tight.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">Why we need it</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Under the board there are 2 to 3 mm of pins and solder bumps, so it rocked on the flat deck, and zip ties could loosen or press on parts. A board that moves can pull on wires while Dusty drives.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">How we picked</div>
              <div className="text-white text-sm mt-1 leading-relaxed">We used the holes the board already has. The hole positions came from SparkFun&apos;s own drawing of the board, not from photos. The risers are 5 mm tall so the bumps underneath never touch the deck. Only the deck changes.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Technical record</h3>
          <div className="mt-2 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-xs text-left">
                  <th className="px-4 py-2 font-semibold">Feature</th>
                  <th className="px-4 py-2 font-semibold">Parts</th>
                  <th className="px-4 py-2 font-semibold">Was</th>
                  <th className="px-4 py-2 font-semibold">Now</th>
                  <th className="px-4 py-2 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {MOC7.map(([h, pts, was, now, basis]) => (
                  <tr key={h}>
                    <td className="px-4 py-2 text-white">{h}</td>
                    <td className="px-4 py-2">{pts}</td>
                    <td className="px-4 py-2 tabular-nums">{was}</td>
                    <td className="px-4 py-2 tabular-nums text-naw-orange font-semibold">{now}</td>
                    <td className="px-4 py-2 text-white/60">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            Checked in the 3D model: the deck is one solid printable part, all four pilot holes are clear for a full M2 × 8,
            and nothing on the deck reaches into the space under the board except the four riser tops. The side guides,
            rear stop and zip tie slots stay; they no longer touch the board. Not changed: base, sleeve, posts, motors,
            sensor arms, wiring, the cliff math, the footprint, and every other part. No new parts to buy.
          </p>
          <h3 className="text-white font-bold mt-6">What had to be updated</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {MOC7_TOUCHED.map((t) => (
              <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <h3 className="text-white font-bold mt-6">What we learned</h3>
          <p className="text-white/60 text-sm mt-1 leading-relaxed">
            Use the mounting holes a board comes with, and get their positions from the maker&apos;s drawing. And a change is
            not finished until every page that describes it is updated: this one was approved on Sep 27, but the Build Guide
            still said zip ties for three days.
          </p>
          <h3 className="text-white font-bold mt-6">Tests that prove it works</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/75 list-disc pl-5">
            <li>All four board holes sit over the four risers without bending the board.</li>
            <li>All four screws start and pull snug, and none of them strips.</li>
            <li>The board does not rock or wiggle, and nothing underneath touches the deck.</li>
            <li>The power socket and the sensor pins are easy to reach.</li>
          </ul>
        </Section>

        <Section title="Change order MOC-006: room for the power socket" sub="Sep 27, 2026. Approved by Dad.">
          <div className="bg-naw-card rounded-2xl border border-naw-orange/40 p-5">
            <div className="text-naw-orange text-xs font-semibold">The short version</div>
            <p className="text-white leading-relaxed mt-1">
              The real moto:bit has a round power socket that sticks out past the edge of the board. It bumped the little wall
              on the left side of the deck, so the board could not lie flat. One zip tie pressed on that socket, and the other
              could not go in at all because the battery sleeve wall was in the way. We shortened the left wall and moved both zip tie holes. Only the deck changes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">Why we need it</div>
              <div className="text-white text-sm mt-1 leading-relaxed">The board has to sit flat and stay put while Dusty drives. The deck was drawn from the board&apos;s size on paper, before we had the real board to measure.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">How we picked</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Two choices: trim the wall by hand and glue the board down (no reprint, but the board could never come off), or reprint the deck. We picked the reprint. Only the deck changes.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Technical record</h3>
          <div className="mt-2 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-xs text-left">
                  <th className="px-4 py-2 font-semibold">Feature</th>
                  <th className="px-4 py-2 font-semibold">Parts</th>
                  <th className="px-4 py-2 font-semibold">Was</th>
                  <th className="px-4 py-2 font-semibold">Now</th>
                  <th className="px-4 py-2 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {MOC6.map(([h, pts, was, now, basis]) => (
                  <tr key={h}>
                    <td className="px-4 py-2 text-white">{h}</td>
                    <td className="px-4 py-2">{pts}</td>
                    <td className="px-4 py-2 tabular-nums">{was}</td>
                    <td className="px-4 py-2 tabular-nums text-naw-orange font-semibold">{now}</td>
                    <td className="px-4 py-2 text-white/60">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            Measured from photos with a ruler (about ±2 mm): board 60 × 76 mm, power socket on the left edge. The socket was added to the 3D model: with the socket anywhere in a ±2 mm range, it clears the new deck.
            Neither zip tie path touches the sleeve or the posts. Not changed: base, sleeve, posts, motors, sensor arms, the
            cliff math, the balance point, and every other part.
          </p>
          <h3 className="text-white font-bold mt-6">What had to be updated</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {MOC6_TOUCHED.map((t) => (
              <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <h3 className="text-white font-bold mt-6">What we learned</h3>
          <p className="text-white/60 text-sm mt-1 leading-relaxed">
            Same lesson as MOC-005, one level up: model the connectors that hang off a bought board, not just its outline. And
            follow every zip tie along its whole path, under the part too, not just the holes on top.
          </p>
          <h3 className="text-white font-bold mt-6">Tests that prove it works</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/75 list-disc pl-5">
            <li>The moto:bit lies flat on the deck and touches the back stop.</li>
            <li>Both zip ties thread through and pull snug, and neither one presses on the power socket or the sensor pins.</li>
            <li>The power bank still slides in and out with the back tie in place.</li>
          </ul>
        </Section>

        <Section title="Change order MOC-005: windows for the motor plugs" sub="Sep 27, 2026. Approved by Dad.">
          <div className="bg-naw-card rounded-2xl border border-naw-orange/40 p-5">
            <div className="text-naw-orange text-xs font-semibold">The short version</div>
            <p className="text-white leading-relaxed mt-1">
              Each wheel motor has a little circuit board on its back with a plug for its wires. They stick out more than our
              3D model showed. With the plug pointing up, it hit the base and the motor could not sit flat. Now the base has a
              window for each motor: the board and plug tuck up inside it, and the wires come out on top.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">Why we need it</div>
              <div className="text-white text-sm mt-1 leading-relaxed">The motor plugs hit the base, so the motors could not sit flat. Turned the other way round, the wires would hang under Dusty, drag on the table and catch crumbs.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">How we picked</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Two choices: solder two wires straight onto each motor (no reprint), or change the base so the plugs fit. We picked the new base. First we measured the motor with a ruler, and the measurement showed the smallest change: windows in the base only, plus a free little pocket under the battery sleeve.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Technical record</h3>
          <div className="mt-2 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-xs text-left">
                  <th className="px-4 py-2 font-semibold">Feature</th>
                  <th className="px-4 py-2 font-semibold">Parts</th>
                  <th className="px-4 py-2 font-semibold">Was</th>
                  <th className="px-4 py-2 font-semibold">Now</th>
                  <th className="px-4 py-2 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {MOC5.map(([h, pts, was, now, basis]) => (
                  <tr key={h}>
                    <td className="px-4 py-2 text-white">{h}</td>
                    <td className="px-4 py-2">{pts}</td>
                    <td className="px-4 py-2 tabular-nums">{was}</td>
                    <td className="px-4 py-2 tabular-nums text-naw-orange font-semibold">{now}</td>
                    <td className="px-4 py-2 text-white/60">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            Measured (about ±1 mm): gearbox 8.9 mm plus can 15.4 mm is 24.4 mm, board 1.2 mm, gearbox face to the back of the
            plug about 33 mm. The plug goes straight into the back of the board, and the wires leave toward the middle of the
            robot. The motors now mount with the board and plug toward the base. The board and plug were added to the 3D model:
            against the old base they overlap by 24 mm³, against the new base and sleeve by nothing. Not changed: axle, wheels,
            caster, sensor arms and their head start, the cliff math, the 122 mm footprint, the balance point, and every other
            part. The 14 mm bridge between the two windows stays, so the base stays stiff.
          </p>
          <h3 className="text-white font-bold mt-6">What had to be updated</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {MOC5_TOUCHED.map((t) => (
              <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <h3 className="text-white font-bold mt-6">What we learned</h3>
          <p className="text-white/60 text-sm mt-1 leading-relaxed">
            The 3D model had the motor’s length along its shaft, with its connector (37 mm), but not the little board and plug
            sticking out sideways. Model the cable and plug, not just the part.
          </p>
          <h3 className="text-white font-bold mt-6">Tests that prove it works</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/75 list-disc pl-5">
            <li>The board and plug sit in the window, and the motor sits flat on its pad.</li>
            <li>Both wheels spin freely.</li>
            <li>The wires come up through the window without pinching.</li>
            <li>The battery sleeve slides on without touching the little board.</li>
            <li>The lowest point of the motor, plug and wires is at least 5 mm above the table.</li>
          </ul>
        </Section>

        <Section title="Change order MOC-004: a funnel for the screws, and tighter post holes" sub="Sep 27, 2026. Approved by Dad after fit checks 3 and 4.">
          <div className="bg-naw-card rounded-2xl border border-naw-orange/40 p-5">
            <div className="text-naw-orange text-xs font-semibold">The short version</div>
            <p className="text-white leading-relaxed mt-1">
              Two things we learned from test prints. First, screws were hard to start because the hole was a tiny dot: now
              each screw hole has a little funnel at the top that guides the screw in. Second, the deck posts wiggled in the
              base, so the holes they plug into are now a bit smaller and the posts fit snug.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">Why we need it</div>
              <div className="text-white text-sm mt-1 leading-relaxed">A screw that starts crooked can crack a printed part. A wobbly post makes the deck wobble, and the moto:bit rides on the deck.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">How we picked</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Fit check 3: three funnel styles and three hole sizes. Fit check 4: three smaller hole sizes. Funnel #2 and hole #6 won.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Technical record</h3>
          <div className="mt-2 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-xs text-left">
                  <th className="px-4 py-2 font-semibold">Feature</th>
                  <th className="px-4 py-2 font-semibold">Parts</th>
                  <th className="px-4 py-2 font-semibold">Was</th>
                  <th className="px-4 py-2 font-semibold">Now</th>
                  <th className="px-4 py-2 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {MOC4.map(([h, pts, was, now, basis]) => (
                  <tr key={h}>
                    <td className="px-4 py-2 text-white">{h}</td>
                    <td className="px-4 py-2">{pts}</td>
                    <td className="px-4 py-2 tabular-nums">{was}</td>
                    <td className="px-4 py-2 tabular-nums text-naw-orange font-semibold">{now}</td>
                    <td className="px-4 py-2 text-white/60">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            The gear peg end gets no funnel: the washer presses on that face and needs it flat. What this taught us: small
            holes (2 mm) print too small on this printer, but a 4 mm hole prints about right. So the +0.25 mm we added in
            MOC-003 to the bigger sliding fits (the gear on its peg, the dowel holes) gets checked in Batch 4, and gets its own
            change order if those parts wobble.
          </p>
          <h3 className="text-white font-bold mt-6">Tests that prove it works</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/75 list-disc pl-5">
            <li>An M2 × 8 screw starts straight in the post top without hunting for the hole (passed on fit check 3, #2).</li>
            <li>A deck post peg pushes into the base snug by hand (passed on fit check 4, #6).</li>
            <li>Batch 1 test pieces match: base test piece snug, deck screw slides through.</li>
            <li>Batch 2: both posts push into the real base snug; screws start easily in the motor pads and caster posts.</li>
          </ul>
        </Section>

        <Section title="Change order MOC-003: bigger holes" sub="Sep 26, 2026. Approved by Dad after fit check 2.">
          <div className="bg-naw-card rounded-2xl border border-naw-orange/40 p-5">
            <div className="text-naw-orange text-xs font-semibold">The short version</div>
            <p className="text-white leading-relaxed mt-1">
              Our printer makes holes a little smaller than the drawing. The screw would not go into the deck post, and the
              motor gear would not go onto the motor. We printed five sizes of each, and size number 4 worked for both. Now
              every hole in Dusty is drawn a little bigger so the real parts fit.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">Why we need it</div>
              <div className="text-white text-sm mt-1 leading-relaxed">If the holes stay this small, no screw goes in and the brush gear cannot go on. Dusty cannot be built.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">How we picked the size</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Fit check 2: five posts and five gears, each 0.05 to 0.1 mm bigger. Number 4 of each was the smallest that worked.</div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-4">
              <div className="text-white/45 text-xs font-semibold">Why not the printer setting?</div>
              <div className="text-white text-sm mt-1 leading-relaxed">Hole compensation would also work, but anyone printing Dusty would have to remember it. Drawing the holes right keeps the files ready to print.</div>
            </div>
          </div>
          <h3 className="text-white font-bold mt-6">Technical record</h3>
          <div className="mt-2 bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-xs text-left">
                  <th className="px-4 py-2 font-semibold">Hole</th>
                  <th className="px-4 py-2 font-semibold">Parts</th>
                  <th className="px-4 py-2 font-semibold">Was</th>
                  <th className="px-4 py-2 font-semibold">Now</th>
                  <th className="px-4 py-2 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {MOC3.map(([h, pts, was, now, basis]) => (
                  <tr key={h}>
                    <td className="px-4 py-2 text-white">{h}</td>
                    <td className="px-4 py-2">{pts}</td>
                    <td className="px-4 py-2 tabular-nums">{was}</td>
                    <td className="px-4 py-2 tabular-nums text-naw-orange font-semibold">{now}</td>
                    <td className="px-4 py-2 text-white/60">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            Two holes were tested directly. The rest get the same allowance: +0.4 mm for holes an M2 screw passes through
            (same as the pilot), +0.25 mm for parts that slide on a pin or the axle (same as the gear bore). Outside sizes,
            weights and print times do not change. X-Y hole compensation in the slicer stays at 0.
          </p>
          <h3 className="text-white font-bold mt-6">What had to be updated</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {MOC3_TOUCHED.map((t) => (
              <span key={t} className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
          <h3 className="text-white font-bold mt-6">Tests that prove it works</h3>
          <ul className="mt-2 space-y-1 text-sm text-white/75 list-disc pl-5">
            <li>An M2 × 8 screw starts and bites in the deck post (passed on fit check 2, #4).</li>
            <li>The motor gear pushes on by thumb and does not slip (passed on fit check 2, #4).</li>
            <li>Batch 2: a screw threads into every pilot hole on the base, and both posts push into the base.</li>
            <li>Batch 3: M2 screws pass freely through the sensor arm slots and the deck holes.</li>
            <li>Batch 4: the big gear spins freely on its peg, and the axle slides through the roller, collar and roller gear.</li>
          </ul>
        </Section>

        <Section title="Project history" sub="Every decision and change, newest first. Add a line whenever the plan changes.">
          <div className="bg-naw-card rounded-2xl border border-naw-cyan/20 divide-y divide-white/5">
            {LOG.map(([d, tag, text], i) => (
              <div key={i} className="grid grid-cols-[4rem_1fr] gap-3 px-4 py-3">
                <span className="text-white/55 text-sm tabular-nums">{d}</span>
                <span className="text-sm leading-relaxed">
                  <span className={`${TAG[tag]} text-xs font-semibold px-2 py-0.5 rounded-full mr-2`}>{tag}</span>
                  <span className="text-white/80">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Lessons learned" sub="What we would do the same way, or differently, next time.">
          <Cards items={LESSONS} />
        </Section>

        <Section title="Checklist for the next project">
          <ol className="bg-naw-card rounded-2xl border border-naw-orange/30 p-5 space-y-2">
            {NEXT.map((t, i) => (
              <li key={t} className="flex gap-3 text-sm text-white/85">
                <span className="flex-none w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="pt-0.5">{t}</span>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}

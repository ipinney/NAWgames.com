import { BASE, GUIDE, P, meta, Nav, Hero, Section, Card, Box, Btn, Words } from '../ui';
import Receiving from './Receiving';

export const metadata = meta(
  'Dusty: inventory, checking in the parts',
  'How engineers check in parts when the boxes arrive, what goes wrong when a part is wrong or the wrong size, and how to keep every piece of Dusty organized.',
  `${BASE}/inventory`
);

const CHIPS = [
  ['what', 'What it is'],
  ['why', 'Why it matters'],
  ['stories', 'When parts go wrong'],
  ['how', 'Checking a box'],
  ['checklist', 'Check-in list'],
  ['problems', 'If something is wrong'],
  ['organized', 'Staying organized'],
  ['words', 'Words'],
];

const WHAT = [
  ['What did we order?', 'The parts list. Every part, how many, and which store it comes from.'],
  ['What showed up?', 'Open each box, count what is inside, and match it to the list.'],
  ['Where is it now?', 'Every part goes in a labeled bin, so you can find it the day you need it.'],
];

const WHY = [
  ['Boxes come on different days', 'Dusty’s parts come from about six places: Adafruit, SparkFun, Pololu, Walmart, Amazon, and our own drawers. They will not all show up together. The list is how you know what is still on the way.'],
  ['Small parts vanish', 'A cliff sensor is smaller than a postage stamp. A screw is smaller than a grain of rice. If they are not put away the day they arrive, they get lost.'],
  ['Finding a problem early is cheap', 'A wrong part found the day the box comes costs a return and a few days. Found on build day, it costs the whole weekend.'],
  ['The schedule depends on it', 'Sep 19 is the first build weekend: make Dusty drive. Every drive part has to be here and checked before then.'],
];

const STORIES = [
  {
    t: 'A spacecraft lost over units',
    what: 'In 1999, NASA lost the Mars Climate Orbiter. One team sent numbers in pounds of force. The other team read them as newtons, a metric unit. Nobody caught it, and the spacecraft flew too close to Mars and was destroyed.',
    lesson: 'Always check the units. Is it millimeters or inches? Grams or ounces?',
  },
  {
    t: 'A telescope mirror ground wrong',
    what: 'The Hubble Space Telescope launched in 1990 with a mirror that was the wrong shape by about one fiftieth the width of a hair. A testing tool had been put together with one piece 1.3 mm out of place. Astronauts had to fly up in 1993 to add a fix, like glasses for the telescope.',
    lesson: 'Check your measuring tools too, and check big things with a second, different method.',
  },
  {
    t: 'Dusty: the power bank that did not fit',
    what: 'We picked a USB-C power bank before checking the space. Every bank was at least 90 mm long, and the space was only 62 mm. We caught it in the 3D model, before printing, and turned the bank sideways.',
    lesson: 'Measure the space before picking the part.',
  },
  {
    t: 'Dusty: wheels that look almost the same',
    what: 'Pololu sells a 32 mm wheel and a 60 mm wheel that both fit our motors. The 60 mm wheel makes Dusty go almost twice as fast, which uses up the room it needs to stop before the edge.',
    lesson: 'Measure the part when it arrives. A part can fit and still be wrong.',
  },
  {
    t: 'Dusty: the plug that is not USB-C',
    what: 'The micro:bit uses a micro-USB plug, not USB-C like newer phones. Finding that out on build morning means no way to load the program.',
    lesson: 'Check cables and plugs before build day, not on it.',
  },
  {
    t: 'Real projects: waiting on one part',
    what: 'Big construction and factory projects can sit still for weeks because one small part is late or wrong. Workers, tools and every other part are ready, and nobody can move.',
    lesson: 'Order everything at once, check it in right away, and know your backup store.',
  },
];

const STEPS = [
  ['Open it carefully', 'Use scissors on the tape, not on the box. Tiny parts hide in the paper and bubble wrap, so do not throw any packing away until everything is found.'],
  ['Find the packing slip', 'The paper that lists what the store put in the box. Some boxes have it inside, some only in the email. It may say a part is coming later in another box.'],
  ['Count', 'Count each part against the list below. Two motors means two motors. A 2-pack means two sensors in the bag.'],
  ['Check it is the right part', 'Read the name and part number on the bag. Look at the "Check" line on the list: the size, the plug, the number of legs.'],
  ['Measure it', 'Use a ruler for anything with a size in the list. Wheels, screws, the power bank. A millimeter matters on a robot this small.'],
  ['Look for damage', 'Bent pins, cracked plastic, crushed boxes, loose wires. Take a photo of anything broken, with the box, before you do anything else.'],
  ['Mark it on the list', 'Tap Got it, Missing, Wrong part, or Broken.'],
  ['Put it in its bin', 'Right away. Each group on the list has a bin name. The electronics stay in their shiny bags until build day.'],
];

const GROUPS = [
  {
    title: 'Brain',
    bin: 'Brain',
    items: [
      { id: 'mb', in: '2026-09-24', name: 'micro:bit v2', qty: 1, from: 'Adafruit', check: 'Says "v2" on the back. The gold edge along the bottom is clean and not bent.' },
      { id: 'moto', name: 'SparkFun moto:bit motor board', qty: 1, from: 'SparkFun', check: 'Has a long slot the micro:bit slides into and a round barrel jack for power.' },
      { id: 'musb', name: 'Micro-USB cable', qty: 1, from: 'Our drawer', check: 'The small flat plug, not USB-C. Plug it into the micro:bit to be sure it fits.' },
    ],
  },
  {
    title: 'Drive',
    bin: 'Drive',
    items: [
      { id: 'n20', in: '2026-09-24', name: 'N20 gear motors', qty: 2, from: 'Adafruit', check: 'Both look the same. The metal shaft has one flat side, shaped like a D.' },
      { id: 'wheel', name: 'Wheels, 32 mm (one pair)', qty: 2, from: 'Pololu', check: 'Measure across: 32 mm, about 1 1/4 inches. If they are 60 mm, that is the wrong wheel.' },
      { id: 'brk', name: 'Motor brackets (one pair)', qty: 2, from: 'Pololu', check: 'A tiny bag of screws and nuts comes with them. Keep that bag.' },
      { id: 'cast', name: 'Ball caster', qty: 1, from: 'Pololu', check: 'Metal ball plus a bag of thin spacers. Dusty needs every spacer.' },
    ],
  },
  {
    title: 'Sensors',
    bin: 'Sensors',
    items: [
      { id: 'qtr', name: 'QTR-1A infrared sensors (2-pack)', qty: 2, from: 'Pololu', check: 'Two tiny boards in the bag. Smaller than a stamp. Count them twice.' },
      { id: 'sw', in: '2026-09-24', name: 'Roller lever microswitch (whisker)', qty: 1, from: 'Adafruit', check: 'Three metal legs on the bottom and a little wheel on the end of the lever. It clicks when pressed.' },
    ],
  },
  {
    title: 'Sweeper',
    bin: 'Sweeper',
    items: [
      { id: 'm130', in: '2026-09-24', name: '130 hobby motor', qty: 1, from: 'Adafruit', check: 'Silver can about the size of a thumb, with a round shaft.' },
      { id: 'rock', in: '2026-09-20', name: 'Brush on/off switch', qty: 1, from: 'Our order', check: 'Clicks on and off. Two or three metal legs.' },
      { id: 'pipe', name: 'Pipe cleaners', qty: 1, from: 'Amazon', check: 'One pack. Plenty for three brush tries.' },
      { id: 'brush', name: 'Brushes to test', qty: 1, from: 'Amazon', check: 'The brush material to test against the pipe cleaners.' },
    ],
  },
  {
    title: 'Power',
    bin: 'Power',
    items: [
      { id: 'bank', name: 'Anker 321 power bank (PowerCore 5K)', qty: 1, from: 'Walmart', check: 'Model A1112 on the back. One USB-C port and one USB-A port. Measure: about 97 mm long and 22 mm thick.' },
      { id: 'barrel', name: 'USB to barrel jack cable', qty: 1, from: 'Adafruit', check: 'Big flat USB plug on one end, small round plug on the other. The round plug fits the moto:bit jack.' },
      { id: 'inl', name: 'In-line barrel jack switch', qty: 1, from: 'Adafruit', check: 'A short cable with a switch in the middle and round plugs on both ends.' },
      { id: 'ang', name: '90 degree USB-A adapters (left and right)', qty: 2, from: 'Amazon', check: 'One bends left, one bends right. Keep both until you know which one points forward on Dusty.' },
      { id: 'chg', name: 'USB-C phone charger', qty: 1, from: 'Our drawer', check: 'Plug it into the power bank. The little lights should come on.' },
    ],
  },
  {
    title: 'Body and hardware',
    bin: 'Hardware',
    items: [
      { id: 'pla', name: 'PLA filament', qty: 1, from: 'Amazon', check: 'Sealed bag with a small moisture packet inside. Keep it sealed until it goes on the printer.' },
      { id: 'scr', name: 'M2 screws and nuts', qty: 1, from: 'Screw kit', check: 'Dusty needs 18 screws 8 mm long, 3 that are 6 mm, 2 that are 10 mm, and 6 nuts. Measure a screw from under the head to the tip.' },
      { id: 'zip', name: 'Small zip ties', qty: 1, from: 'Store', check: 'The short, thin kind. Loose wires get caught in the brush.' },
      { id: 'foam', name: 'Frost King rubber foam tape', qty: 1, from: 'Home Depot', check: 'Stops the power bank from rattling. Sticky side goes on the sleeve, never on the bank.' },
      { id: 'dst', name: 'Double-sided mounting tape', qty: 1, from: 'Store', check: 'Holds the in-line switch on the deck.' },
      { id: 'glue', name: 'Hot glue sticks', qty: 1, from: 'Store', check: 'Check they fit our glue gun: mini or full size.' },
    ],
  },
];

const IF_WRONG = [
  ['Look again', 'Search all the packing paper, the bottom of the box, and inside the bags. Small parts are often taped to the slip.'],
  ['Read the email', 'Stores often ship in more than one box. The order email or tracking page will say if something is still coming. That is called split shipping or a backorder.'],
  ['Tell Dad the same day', 'Stores give a limited number of days to report a problem. Show the problem list and the photos.'],
  ['Keep the wrong part safe', 'Leave it in its bag with the packing slip. Most stores want it back before they send the right one.'],
  ['Use the backup', 'Every part on the parts list has a backup from a different store. That is why the list has them.'],
  ['Does it change the design?', 'If the fix is a different part, a different size, or a different plan, it needs a change order first.'],
];

const BINS = [
  ['One bin for each group', 'Brain, Drive, Sensors, Sweeper, Power, Hardware, Printed parts. Write the name on a piece of tape on each one. A shoebox works.'],
  ['Small bags for tiny parts', 'Sensors, screws and nuts go in zip bags with a label, inside their bin.'],
  ['Screws in a cup while building', 'A muffin tin or egg carton gives each screw size its own cup. Tiny screws and nuts are a choking hazard, so keep them away from little brothers.'],
  ['Shiny bags stay closed', 'The silver bags protect circuit boards from static, the tiny shock you get from a doorknob. Open them on build day.'],
  ['Label printed parts', 'Printed parts look alike. A pencil mark or a bag with the part name keeps the left sensor arm from being mixed up with the right one.'],
  ['Keep the spares', 'Extra screws, the unused USB adapter, leftover pipe cleaners. Put them in a Spares bag. Something always breaks.'],
  ['Take a picture of the kit', 'Before build day, lay every part out on the table and take a photo. Engineers call this kitting. It also goes on the display board.'],
  ['Clean up before you stop', 'Every build session ends the same way: parts back in bins, screws counted, bins in one spot on the shelf.'],
];

const END = [
  'Every screw is back in its cup or bag',
  'Every part is back in its bin',
  'The power bank is off (and charging if the next session is soon)',
  'Nothing is on the floor',
  'The bins are together in one spot',
];

const WORDS = [
  ['Inventory', 'A list of everything you have, how many, and where it is.'],
  ['Bill of materials (BOM)', 'The engineer name for the parts list: every part needed to build one thing.'],
  ['Receiving', 'Checking in a delivery: counting it, checking it, and putting it away.'],
  ['Packing slip', 'The paper in the box that says what the store sent.'],
  ['Part number', 'The code that tells two nearly identical parts apart, like Pololu #1087 for the 32 mm wheels.'],
  ['Backorder', 'A part the store is out of. It ships later, in its own box.'],
  ['Kitting', 'Gathering every part for one job into one place before starting.'],
  ['Spare', 'An extra part kept in case one breaks or gets lost.'],
  ['Tolerance', 'How far off a size can be and still work. Tiny robots have tiny tolerances.'],
  ['Static', 'A small electric shock that can damage a circuit board. That is why boards ship in shiny bags.'],
];

export default function InventoryPage() {
  return (
    <div className="min-h-screen">
      <Nav current="inventory" />
      <Hero
        title="INVENTORY"
        lead="All of Dusty's parts are ordered. They will show up in different boxes on different days. This page is how we check every part in, catch mistakes early, and never lose a piece."
        sub="What inventory is, why it matters, a check-in list for every box, and how to keep it all organized."
        badge="Check everything in before Sep 19"
        chips={CHIPS}
      />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section id="what" n={1} title="What is inventory management?" big="Knowing what you have, how many, and where it is.">
          <p className="text-white/75 leading-relaxed">
            Every store, factory, and space program keeps track of its parts. A grocery store knows how many apples are on the shelf. A car factory knows it has
            enough bolts for tomorrow. NASA counts every tool that goes up to the space station. For Dusty, it comes down to three questions.
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {WHAT.map(([t, d]) => (
              <Card key={t}>
                <div className="text-yellow-300 font-bold">{t}</div>
                <div className="text-white/70 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="why" n={2} title="Why it matters" big="It is much better to find a problem the day the box comes than on build day.">
          <div className="grid sm:grid-cols-2 gap-3">
            {WHY.map(([t, d]) => (
              <Card key={t}>
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/60 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="stories" n={3} title="When parts go wrong" big="Wrong parts and wrong sizes slow down real projects, big and small.">
          <div className="grid sm:grid-cols-2 gap-3">
            {STORIES.map((s) => (
              <Card key={s.t}>
                <div className="text-white font-bold">{s.t}</div>
                <div className="text-white/60 text-sm mt-1">{s.what}</div>
                <div className="text-naw-cyan text-sm font-semibold mt-2">Lesson: {s.lesson}</div>
              </Card>
            ))}
          </div>
          <Box tone="tip" title="The big idea">
            <p>A mistake gets more expensive the later you find it. On paper, it costs a minute. When the box arrives, it costs a few days. On build day, it costs the weekend. After the robot is finished, it can mean starting a part over.</p>
          </Box>
        </Section>

        <Section id="how" n={4} title="How to check in a box" big="Same eight steps for every box.">
          <div className="space-y-2">
            {STEPS.map(([t, d], i) => (
              <div key={t} className="grid grid-cols-[2.25rem_1fr] gap-3 bg-naw-card rounded-2xl border border-white/10 p-4">
                <span className="w-8 h-8 rounded-lg bg-naw-orange/20 text-naw-orange font-bold flex items-center justify-center">{i + 1}</span>
                <span>
                  <span className="block text-white font-bold">{t}</span>
                  <span className="block text-white/60 text-sm mt-0.5">{d}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="checklist" n={5} title="The check-in list" big="Tap a button for each part as its box is opened.">
          <Box tone="facts" title="If a part looks different">
            <p>We listed the main store for each part. If Dad ordered the backup, the name on the bag will be different. Check it against the backup on the parts list PDF.</p>
          </Box>
          <Receiving groups={GROUPS} />
          <div className="flex flex-wrap gap-2">
            <Btn href={`${P}/dusty-parts-list.pdf`} primary newTab>Parts list (PDF)</Btn>
            <Btn href={`${BASE}/invention#parts`}>What each part does</Btn>
          </div>
        </Section>

        <Section id="problems" n={6} title="If something is missing or wrong" big="Do not panic. There are three spare weekends in the plan for this.">
          <div className="grid sm:grid-cols-2 gap-3">
            {IF_WRONG.map(([t, d]) => (
              <Card key={t}>
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/60 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
          <Btn href={`${BASE}/changes`}>How a change order works</Btn>
        </Section>

        <Section id="organized" n={7} title="Keeping it organized" big="A place for everything, and everything in its place.">
          <div className="grid sm:grid-cols-2 gap-3">
            {BINS.map(([t, d]) => (
              <Card key={t}>
                <div className="text-yellow-300 font-bold">{t}</div>
                <div className="text-white/65 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
          <Box tone="pick" title="End of every build session" items={END} />
          <Box tone="warn" title="Safety">
            <p>Screws, nuts and sensors are small enough to swallow. Keep them in closed bags or bins, up high, and count them back in after every session.</p>
          </Box>
          <div className="flex flex-wrap gap-2">
            <Btn href={GUIDE}>Step by step build guide</Btn>
            <Btn href={`${BASE}/build/batches`}>Print plan</Btn>
          </div>
        </Section>

        <Section id="words" n={8} title="Words to know">
          <Words list={WORDS} />
        </Section>
      </div>
    </div>
  );
}

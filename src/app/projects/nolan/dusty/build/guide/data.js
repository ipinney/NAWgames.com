// Print-plan data for the Dusty Build Guide (was build/batches/page.js).
export const F = '/projects/nolan/dusty-files';
export const V3D = `${F}/dusty-components-3d-revA5.html`;

export const SETTINGS = [
  ['Printer', 'FlashForge Adventurer 5M, 0.4 mm nozzle, textured PEI plate'],
  ['Software', 'Easiest: the .gcode is already sliced for the Adventurer 5M with every setting below. Put it on a USB stick or send it from FlashPrint. The .3mf opens in Flash Studio or OrcaSlicer to change settings.'],
  ['Material', 'Flashforge Generic PLA profile: nozzle 220°C, bed 60°C'],
  ['Layers', '0.2 mm, 3 walls, 5 top and 4 bottom layers, 20% gyroid infill'],
  ['Brim', '5 mm, except none on the three gears and 8 mm on the tall roller'],
  ['Speed', 'Normal, except plates 1 and 4 run slower for the small gears and the roller'],
  ['Supports', 'Off. Nothing needs them.'],
  ['Hole size', 'X-Y hole compensation 0. The holes are already drawn to fit this printer (change orders MOC-003 and MOC-004).'],
];

export const BEFORE = [
  ['Unbox everything that has arrived and check it against the parts list.', ''],
  ['Sort the M2 screws into three cups: 6 mm, 8 mm and 10 mm. Put the nuts in a fourth.', ''],
  ['Before Batch 3, measure the power bank and the 90 degree USB adapter with a ruler or calipers.', 'The bank must fit inside 104 x 48 x 29 mm, and the adapter must stick out less than 28 mm. If anything is off, the sleeve gets fixed before it prints.'],
];

export const BATCHES = [
  {
    n: 1,
    stem: 'dusty-plate-1-fit-check-revA5',
    title: 'Fit check',
    when: 'First, before anything else',
    time: 'About 20 minutes',
    pieces: 'Motor gear, washer, axle collar, 2 dowels, 1 deck post, deck test piece, base test piece',
    why: 'Small parts, plus two test pieces cut from the real deck and base, that check whether this printer makes holes the right size. Finding out now takes 20 minutes. Finding out after the base or the deck takes hours.',
    need: ['M2 screws', '130 brush motor'],
    grams: 4.3,
    learn: {
      title: 'How a 3D printer builds',
      items: [
        ['Watch the first layer go down. It should be flat and squished, not round like spaghetti.', 'The first layer is the most important one. If it does not stick, nothing above it will.'],
        ['Each layer is 0.2 mm thick. The deck post is 35 mm tall. How many layers is that?', 'Answer: 35 divided by 0.2 is 175 layers.'],
      ],
    },
    parts: [
      { k: 'pinion', name: 'Motor gear', looks: 'Small gear, 11 mm across and 3 mm thick. 12 teeth and a tiny round hole in the middle.', job: 'Pushes onto the metal shaft of the brush motor and turns the big gear.', goes: 'BATCH 4 cup, after the test in step 2' },
      { k: 'washer', name: 'Washer', looks: 'Thin flat ring, 8 mm across and 1 mm thick. Round hole. The thinnest part on the plate.', job: 'Sits on the end of the gear peg under a screw so the big gear cannot slide off.', goes: 'BATCH 4 cup' },
      { k: 'collar', name: 'Axle collar', looks: 'Thick ring, 8 mm across and 3 mm thick. The hole has one flat side, like a letter D.', job: 'Slides onto the left end of the brush axle so the axle cannot slide out.', goes: 'BATCH 4 cup', tip: 'Washer or collar? The collar is three times thicker and its hole has a flat side.' },
      { k: 'dowel', name: 'Dowels (2)', looks: 'Two tiny pins, 3 mm across and 3.4 mm tall, about the size of a grain of rice.', job: 'Hold the brush motor mount in exactly the right spot on the base.', goes: 'BATCH 4 cup', tip: 'The easiest parts to lose. Put them in the cup first.' },
      { k: 'deck_coupon', name: 'Deck test piece', looks: 'Small flat corner, 21 × 33 mm, with one screw hole, a zip-tie slot and a raised rail. It is the front-left corner of the real deck.', job: 'Tests the deck holes before printing the whole deck. The screw must slide through and the head must sit in the pocket.', goes: 'Keep it with the deck parts after the test', tip: 'Only test pieces, not part of Dusty.' },
      { k: 'base_coupon', name: 'Base test piece', looks: 'Small flat square, 15 × 16 mm, 3 mm thick, with one round hole. It is the patch of the real base where a deck post plugs in.', job: 'Tests the post hole before printing the whole base. The skinny peg of a deck post must push in snug.', goes: 'Keep it with the deck parts after the test' },
      { k: 'post', name: 'Deck post', looks: 'Round stick, 35 mm long. One end has a skinny peg. The other end has a small screw hole with a funnel around it.', job: 'Holds up the front of the deck. The peg goes down into the base, and a screw goes into the top.', goes: 'Keep it with the deck parts. Batch 2 prints the second post.', tip: 'It prints standing peg up, so it comes off the printer upside down.' },
    ],
    boxParts: [
      ['M2 × 8 screw', 'M2 means the screw is 2 mm thick. 8 means it is 8 mm long, measured from under the head to the tip. It is in the 8 mm cup.'],
      ['130 brush motor', 'The silver motor with two metal tabs on the back and a thin metal shaft sticking out the front.'],
    ],
    after: [
      {
        t: 'Find the deck post. The end with the funnel-shaped hole is the top. Twist an M2 × 8 screw into that hole, turning clockwise, about three turns.',
        tip: 'Use a small Phillips screwdriver. Push down gently while you turn. Then check the result in the table below.',
        img: ['b1-s1'],
        check: [
          ['It bites and holds', 'The screw gets harder to turn and stays put when you let go.', 'Perfect. Change nothing.', 'ok'],
          ['It spins loose', 'The screw turns but never grips, or drops right in.', 'Holes print too big. A grown-up sets X-Y hole compensation to -0.05 in the printer software (Quality tab) and prints this plate again.', 'bad'],
          ['It will not start', 'Even pushing down, the screw will not go in.', 'Holes print too small. A grown-up sets X-Y hole compensation to +0.05 and prints this plate again.', 'bad'],
        ],
        tip2: 'Whatever number works, use it for every plate after this one.',
      },
      {
        t: 'Push the motor gear onto the metal shaft of the 130 motor.',
        tip: 'Set the back of the motor on the table and press the gear straight down with your thumb. Stop when the tip of the shaft just peeks through the gear, leaving a small gap between the gear and the motor. Then hold the gear and try to turn the shaft: the gear should not slip. A little loose is OK; a drop of superglue fixes it in Batch 4.',
        img: ['b1-s2', 'b1-s2b'],
      },
      {
        t: 'Test the deck and base holes with the two test pieces.',
        tip: 'Deck test piece: set it on top of a deck post, screw hole over the post. Push an M2 × 8 screw through the hole and twist it into the post. The screw should slide through the test piece without threading, and its head should sit down inside the pocket. Base test piece: turn it flat side up and push the skinny peg of a deck post into the hole. It should go in snug by hand, not loose and not stuck.',
        img: ['b1-s4', 'b1-s5'],
        check: [
          ['Both fit', 'The screw slides through and sits in the pocket, and the peg pushes in snug.', 'The whole deck and base will fit. Print Batch 2.', 'ok'],
          ['Too tight', 'The screw has to thread through the deck piece, or the peg will not go in.', 'Stop before Batch 2. The hole needs to be drawn bigger: tell Dad which piece.', 'bad'],
          ['Too loose', 'The peg falls out, or the screw head drops through the pocket.', 'Stop before Batch 2. The hole needs to be drawn smaller: tell Dad which piece.', 'bad'],
        ],
      },
      {
        t: 'Put the motor gear, washer, collar and both dowels in a cup labeled BATCH 4. Keep the deck post with the deck parts.',
        tip: 'Wiggle the gear back off the shaft first. It goes on for good in Batch 4.',
        img: ['b1-s3'],
      },
    ],
    gate: 'The screw bites, the gear is snug, the deck screw slides through and the post pegs in. Print Batch 2 with the same settings.',
    build: [],
  },
  {
    n: 2,
    stem: 'dusty-plate-2-base-revA5',
    title: 'Base plate',
    when: 'After Batch 1 passes',
    time: 'About 1 hour 20 minutes',
    pieces: 'Base plate (upside down), 1 deck post, and a loose support block',
    why: 'The part everything else bolts to. It prints upside down so the top comes out perfectly flat.',
    need: [],
    grams: 36.0,
    learn: {
      title: 'Meet the micro:bit',
      items: [
        ['Open makecode.microbit.org and make the micro:bit show a heart when you press button A.', 'Code is a list of steps the computer follows exactly, in order.'],
        ['Read Steps 2 and 3 of the build guide so you know where the motors and caster go.', ''],
        ['Solder practice: a grown-up warms up the iron on a spare header pin.', 'The sensors get soldered later, so practice now while nothing is at stake.'],
      ],
    },
    parts: [
      { k: 'base', name: 'Base plate', looks: 'The biggest part, 85 × 122 mm, with walls and posts sticking up and two square windows near the middle for the motor plugs. It prints upside down, so the flat side on the bed is the top of the robot.', job: 'Everything bolts to it: the wheel motors, the caster, the brush, the sensors and the battery sleeve.', goes: 'Build Steps 2 and 3' },
      { k: 'post', name: 'Deck post (second one)', looks: 'Same as the post from Batch 1: skinny peg on one end, tiny screw hole on the other.', job: 'Holds up the front of the deck.', goes: 'Keep both posts with the deck parts' },
      { k: 'support', name: 'Support block', looks: 'Small loose block, about 9 × 4 × 6 mm, standing just under the gear peg on the base.', job: 'Only holds the peg up while it prints. It is not part of Dusty.', goes: 'Trash' },
    ],
    after: [
      { t: 'Wait for the bed to cool, then lift the base off and peel away the brim.', tip: 'The brim is the thin one-layer sheet around the bottom edge. It peels off like tape. Cool plastic pops off by itself; warm plastic bends.', img: ['b2-s1'] },
      { t: 'Lift off the small loose block that was standing under the gear peg, and throw it away.', tip: 'It was only there to hold the peg up while it printed. Check the peg is round and smooth.', img: ['b2-s2'] },
      { t: 'Run an M2 × 8 screw into each small pilot hole once, then back it out.', tip: 'Four holes on the motor pads, two in the caster posts, one in the end of the gear peg. This cuts the threads now, so the real screws go in easily later. The four bigger holes for the battery sleeve are plain through-holes: skip them.', img: ['b2-s3'] },
      { t: 'Push both deck posts, peg end down, into their holes near the front to check they fit. Then take them out again.', tip: '', img: ['b2-s4'] },
    ],
    gate: 'The base is clean and the posts fit. Print Batch 3.',
    build: [
      [2, 'Mount the motors and wheels', 'Two N20 motors and brackets, two motor cables, two wheels, four M2 × 8'],
      [3, 'Add the ball caster', 'Ball caster, two M2 × 8'],
    ],
  },
  {
    n: 3,
    stem: 'dusty-plate-3-deck-and-arms-revA5',
    title: 'Deck, battery sleeve and sensor arms',
    when: 'After Batch 2',
    time: 'About 1 hour 45 minutes',
    pieces: 'Deck, battery sleeve (standing on its end), keeper bar, right sensor arm, left sensor arm (the one with the switch pad)',
    why: 'The deck and the battery sleeve are needed for the first drive. The arms print now too, so the sensor weekend has nothing left to print.',
    need: [],
    grams: 42.2,
    learn: {
      title: 'How a power bank works',
      items: [
        ['Plug the power bank into a USB-C charger and watch the four blue lights.', 'Each light is about a quarter full. When all four stay on, it is charged.'],
        ['The bank holds 5,200 mAh. Dusty uses about 450 mA. Roughly how many hours is that?', 'Answer: 5,200 divided by 450 is about 11, but the bank loses some energy changing its voltage, so plan on 6 to 7 hours.'],
        ['Put the motors and caster on the base (Steps 2 and 3) if those parts have arrived.', ''],
      ],
    },
    parts: [
      { k: 'deck', name: 'Deck', looks: 'Flat shelf, 79 × 77 mm, with a square window in the middle and raised guides along both sides.', job: 'Holds the moto:bit board on top of the robot.', goes: 'Build Step 4' },
      { k: 'sleeve', name: 'Battery sleeve', looks: 'Long box, 106 mm, open at one end and closed at the other, with windows in the sides. It prints standing on its closed end.', job: 'The power bank slides inside. The back of the deck rests on top of it.', goes: 'Build Step 4' },
      { k: 'keeper', name: 'Keeper bar', looks: 'Thin bar, 54 mm long, with a flat head on one end.', job: 'Slides through the back wall of the sleeve so the power bank cannot slide out.', goes: 'Build Step 4' },
      { k: 'carrier_R', name: 'Right sensor arm', looks: 'L shape, 27 mm tall, with a slot in the tall side and a small frame at the foot.', job: 'Holds a cliff sensor face down just above the table.', goes: 'SENSORS cup, Build Step 6' },
      { k: 'carrier_L', name: 'Left sensor arm', looks: 'Same as the right arm, plus an extra pad with two holes on the outside.', job: 'Holds the other cliff sensor. The pad holds the whisker switch.', goes: 'SENSORS cup, Build Steps 6 and 8', tip: 'Right or left? Only the left arm has the pad with two holes.' },
    ],
    after: [
      { t: 'Clean up the deck and slide the moto:bit between the guides to check the fit.', tip: 'It should slide in with light pressure and touch the stop at the back.', img: ['b3-s1'] },
      { t: 'Slide the power bank into the sleeve from the open end, USB ports facing out, all the way to the closed end. Then push the keeper bar in through the slot in the back wall until its head sits flat.', tip: 'If the bank rattles, a grown-up adds a strip of foam tape to the floor rib.', img: ['b3-s2'] },
      { t: 'Hold each sensor arm against its ear on the base and push an M2 × 8 screw through the slot.', tip: 'Just a test fit. Take them off again and put both arms in a cup labeled SENSORS.', img: ['b3-s3'] },
    ],
    gate: 'The moto:bit fits the deck and the bank fits the sleeve. That is everything for the first drive.',
    build: [
      [4, 'Add the deck, the brain and the power', 'Two posts, battery sleeve, keeper bar, deck, power bank, 90° USB adapter, USB to barrel cable, in-line switch, Y splitter, moto:bit, micro:bit, foam tape, two zip ties, eight M2 × 8'],
      [5, 'Wire the motors and make it drive', 'Laptop, micro-USB cable'],
      [6, 'Mount the sensor arms (Sat Sep 26)', 'Both arms, two QTR-1A sensors, soldering, 2 × M2 × 8 and 2 × M2 × 6 with nuts, six jumper wires'],
      [7, 'Teach Dusty about edges (Sep 26 and 27)', ''],
      [8, 'Add the whisker (Sun Sep 27)', 'Whisker switch, soldering, 2 × M2 × 10 with nuts, two jumper wires'],
    ],
  },
  {
    n: 4,
    stem: 'dusty-plate-4-brush-drive-revA5',
    title: 'Brush drive',
    when: 'During the week before weekend 3',
    time: 'About 1 hour',
    pieces: 'Brush motor mount, big gear, roller gear, brush roller (standing up), axle (lying flat)',
    why: 'Everything for the brush except the small pieces from Batch 1. Printed ahead so there is time to fix a gear before the brush weekend.',
    need: [],
    grams: 13.5,
    learn: {
      title: 'Gears trade speed for strength',
      items: [
        ['Look at the plate picture. The motor gear has 12 teeth and the big gear has 36. How many times does the motor turn for one turn of the big gear?', 'Answer: 36 divided by 12 is 3. Slower, but three times stronger.'],
        ['The small gear has 10 teeth and the roller gear has 18. Multiply both steps together.', 'Answer: 3 times 1.8 is 5.4. The brush turns 5.4 times slower than the motor.'],
        ['Cut about 20 pipe cleaner pieces, each 30 mm long.', 'Watch the first layers of the roller while you cut. It is tall and thin, and it must stick well.'],
      ],
    },
    parts: [
      { k: 'cradle', name: 'Motor mount', looks: 'Open box, 29 × 26 × 17 mm, with a round opening shaped to fit the motor.', job: 'Holds the 130 brush motor and the brush on/off switch. The two dowels from Batch 1 line it up on the base.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'compound', name: 'Big gear', looks: 'Two gears joined together: a big one with 36 teeth and a small one with 10 teeth, and five round holes.', job: 'Spins on the gear peg. It slows the motor down and makes it stronger.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'roller_gear', name: 'Roller gear', looks: 'Gear with 18 teeth, 25 mm across. Its hole has a flat side, like a D.', job: 'Sits on the end of the axle and turns the brush roller.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'roller', name: 'Brush roller', looks: 'Tube, 52 mm long and 14 mm thick, with 7 small holes going across it.', job: 'Pipe cleaner pieces go through the holes to make the brush.', goes: 'BATCH 4 cup, Build Step 9' },
      { k: 'axle', name: 'Axle', looks: 'Long thin rod, 75 mm, with one flat side.', job: 'Goes through the roller and the roller gear so they turn together.', goes: 'BATCH 4 cup, Build Step 9' },
    ],
    after: [
      { t: 'Check the gear teeth are clean.', tip: 'The gears print with no brim, so there is nothing to trim. If a tooth has a stray string, a grown-up cleans it with a hobby knife.', img: ['b4-s1'] },
      { t: 'Slide the axle through the roller, then put the roller gear on the end.', tip: 'Line up the flat side of the axle with the flat inside each part. They should slide on, not wobble.', img: ['b4-s2'] },
      { t: 'Slide the big gear onto the gear peg on the base and spin it.', tip: 'It should spin freely. If it drags, sand the inside of the hole a little.', img: ['b4-s3'] },
      { t: 'Hold the motor gear from Batch 1 against the big gear and turn it.', tip: 'The teeth should roll together without jamming.', img: ['b4-s4'] },
    ],
    gate: 'The axle fits and the big gear spins freely. Everything waits in the BATCH 4 cup for Step 9.',
    build: [
      [9, 'Build the brush and the gears (Sat Oct 3)', '130 motor, rocker switch, pipe cleaners, two zip ties, screw-terminal jack, 2 × M2 × 8, 1 × M2 × 6, and the Batch 1 cup'],
    ],
  },
  {
    n: 5,
    stem: 'dusty-plate-5-tray-revA5',
    title: 'Crumb tray',
    when: 'After Batch 4',
    time: 'About 15 minutes',
    pieces: 'Crumb tray',
    why: 'Last, because it sits right behind the brush. If the brush needed changes, the tray can change too.',
    need: [],
    grams: 7.0,
    learn: {
      title: 'Measure like a scientist',
      items: [
        ['Put a small bowl on the kitchen scale and press the zero (tare) button.', 'Now the scale only counts what you add, not the bowl.'],
        ['Crush some cereal and weigh out exactly 5 grams for the sweep test.', 'Saying "Dusty picked up 3.8 of 5 grams" is a measurement. "It cleans pretty well" is an opinion.'],
      ],
    },
    parts: [
      { k: 'tray', name: 'Crumb tray', looks: 'Shallow tray, 57 × 42 mm, with a thin front edge, a taller back wall and a tab on each side.', job: 'Catches the crumbs the brush flicks back.', goes: 'Build Step 10' },
    ],
    after: [
      { t: 'Check the bottom of the tray is flat and the front edge is thin and clean.', tip: 'The tray prints tipped back a little so its sloped bottom lies flat on the bed. Trim any brim off the front edge, because that edge rides on the table.', img: ['b5-s1'] },
      { t: 'Turn Dusty upside down on a towel and press the tray on until the back clicks.', tip: 'The two side bumps click too. To take it off, push the back wall forward a little.', img: ['b5-s2'] },
    ],
    gate: 'All 21 pieces printed. Dusty is complete.',
    build: [
      [10, 'Slide in the tray and test the sweep (Sun Oct 4)', 'Kitchen scale, 5 g of crushed cereal'],
      [11, 'Two brains, then run the experiment (Oct 10 and 11)', 'Charged power bank, ruler, notebook, masking tape for a 1 foot square, 5 g of crushed cereal'],
    ],
  },
];

export const TIMELINE = [
  ['Wed Sep 16', 'Print 1, then 2', 'Fit check, then the base'],
  ['Thu Sep 17', 'Print 3', 'Deck, battery sleeve and sensor arms'],
  ['Sat Sep 19', 'Build', 'Steps 2 to 5: first drive'],
  ['Week of Sep 21', 'Print 4, then 5', 'Brush drive, then tray'],
  ['Sep 26 and 27', 'Build', 'Steps 6 to 8: sensors and whisker'],
  ['Oct 3 and 4', 'Build', 'Steps 9 and 10: brush, gears, tray'],
  ['Oct 10 and 11', 'Test', 'Step 11: the experiment'],
];


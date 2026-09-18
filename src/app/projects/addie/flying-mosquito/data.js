// Flying Mosquito: one place for the plan, parts, prints, and history. Pages read from here.

// status: done | now | next
export const PHASES = [
  { title: 'Brainstorm and pick a design', when: 'Sep 18, 2026', status: 'done', text: 'Four designs compared. Design A, the Free Flyer, picked. Design C, the Boom Flyer, is the backup.', link: '/projects/addie/flying-mosquito/design#designs' },
  { title: 'First 3D design (Rev A)', when: 'Sep 18, 2026', status: 'done', text: 'Prop guard with legs, mosquito body with the hit window, launch pad, control box, and a fit-check print. 7 print plates, about 5 hours 45 minutes.', link: '/projects/addie/flying-mosquito/build#prints' },
  { title: 'Lock the design', when: 'Before ordering', status: 'now', text: 'Dad approves the requirements and the budget (about $250). After this, every change gets a change order.', link: '/projects/addie/flying-mosquito/design#requirements' },
  { title: 'MS-2000 comes first', when: 'Until Feb 3, 2027', status: 'now', text: 'The science fair project always wins. Flyer work happens on days with no MS-2000 test.', link: '/projects/addie/mosquito-turret' },
  { title: 'Order the parts', when: 'By Nov 13', status: 'next', text: 'Six stores. The drone ships from India, so it goes first and gets 3 weeks.', link: '/projects/addie/flying-mosquito/build#shopping' },
  { title: 'Check in, hover, print', when: 'Dec 1 to Dec 6', status: 'next', text: 'Check every part, measure with calipers, fly the plain drone with the phone app, print the fit check first.', link: '/projects/addie/flying-mosquito/build#plan' },
  { title: 'Experiment: Can it fly?', when: 'Dec 7 to Dec 13', status: 'next', text: 'Push test on a kitchen scale, then 18 hover flights with 0 to 35 g of nickels. Our math predicts 120 g of push and 5.5 minutes with everything on.', link: '/projects/addie/flying-mosquito/experiment' },
  { title: 'Teach it to fly by itself', when: 'Dec 14 to Jan 15', status: 'next', text: 'Hold still over the flight mat, fly a pattern from a Python script, then the control box, hit sensor, and radio. Only on days with no MS-2000 experiment.', link: '/projects/addie/flying-mosquito/build#plan' },
  { title: 'MS-2000 vs the Flying Mosquito', when: 'Jan 16 to Jan 24', status: 'next', text: 'Teach the turret camera the flyer, then count hits. Teach the stuffed mosquito back afterward.', link: '/projects/addie/flying-mosquito/build#plan' },
  { title: 'Freeze', when: 'Jan 25 to Feb 1', status: 'next', text: 'No new changes. The MS-2000 board and demo come first. The flyer only goes to the fair if Miss Taggart says drones are OK.' },
];

export const REQS = [
  ['Flies by itself during a run', 'Nobody steers it. That is the whole point.', 'Python flight script on the Pi, position hold from the floor camera'],
  ['Stays in a zone about 2 ft wide, 2 ft deep, and 1.5 ft tall, centered 3 ft from the turret', 'That is where the laser and the camera line up, and it fits in the camera view.', 'Pattern 0.4 m across at 0.4 m high; lands if it drifts'],
  ['Hit window at least 40 mm wide, hit pod light', 'The dot can land 13 mm off the camera aim between 2 and 4 ft.', '40 mm white window, 8 g body'],
  ['Sends HIT on micro:bit radio group 7 within half a second', 'The MS-2000 turret already cheers on HIT, so the turret code does not change.', 'XIAO to Pi over WiFi, Pi to micro:bit over USB, micro:bit radio'],
  ['Push button start and a launch pad', 'One press starts a run. The drone always starts in the same spot, facing the turret.', 'GO button on the control box; cone cups on the pad'],
  ['Guards on all props, flies inside a net', 'Spinning props and kids do not mix, and the net stops crashes and the beam.', 'Fence guard; pop-up bug habitat with the front open'],
  ['At least 5 minutes of flying per charge', 'Five 30 second runs plus takeoffs and landings.', 'Three batteries, swap between runs'],
  ['Slow enough for the turret to follow', 'The turret fires at most once a second.', 'Starts at 0.2 m/s; the first test sets the top speed'],
  ['Added weight 25 g or less', 'That is what the drone can lift with 55 mm props, keeping about 40% extra push in reserve (our math).', 'Rev A estimate 26 g: the Can it fly? experiment decides'],
];

// grams from the 3D model (PLA 1.24 g/cm3) and the sellers
export const WEIGHTS = [
  ['LiteWing drone, no battery', 45.0, 'seller', false],
  ['Battery', 16.0, 'estimate', false],
  ['Positioning module', 8.0, 'seller', true],
  ['Prop guard and legs (F1)', 6.9, '3D model', true],
  ['Body (F2)', 5.5, '3D model', true],
  ['Hit window (F2)', 2.6, '3D model', true],
  ['XIAO ESP32-C3', 1.5, 'estimate', true],
  ['Light sensor and wires', 1.0, 'estimate', true],
  ['Wings (clear plastic)', 0.4, 'estimate', true],
];

// [name, what for, store, part, qty, each, link, backup]
export const PARTS = [
  ['The drone', [
    ['LiteWing ESP32 drone, ready to fly', 'The flying part. Comes with motors, props and the flight software. No battery.', 'Tindie (Semicon Lab)', 'LiteWing', 1, 49.0, 'https://www.tindie.com/products/semicon_lab/litewing-esp32-based-programmable-drone/', 'Amazon B0GNN1MGC7'],
    ['LiteWing positioning module', 'Floor camera and laser range finder so it can hold still by itself.', 'Tindie (Semicon Lab)', 'Positioning Module', 1, 38.0, 'https://www.tindie.com/products/semicon_lab/litewing-drone-positioning-module/', 'Amazon B0GNN2L81Z'],
    ['1S LiPo battery, 3.7 V, MX2.0 plug, 20C or more, 500 to 650 mAh', 'Three so one can charge while one flies. Check the plug polarity against the board before plugging in.', 'Amazon', 'URGENEX 3-pack with charger', 1, 18.0, 'https://www.amazon.com/dp/B08XZNRTCP', 'Amazon B07SLLVQ2Q'],
  ]],
  ['The hit sensor', [
    ['Seeed XIAO ESP32-C3', 'Tiny WiFi computer in the body. Reads the light sensor, sends HIT. One spare.', 'Seeed Studio', '113991054', 2, 4.99, 'https://www.seeedstudio.com/Seeed-XIAO-ESP32C3-p-5431.html', 'DigiKey 1597-113991054-ND'],
    ['ALS-PT19 light sensor', 'Behind the white window. Feels the laser dot. One spare.', 'Adafruit', '2748', 2, 2.5, 'https://www.adafruit.com/product/2748', 'DigiKey'],
  ]],
  ['The control box', [
    ['Raspberry Pi Zero 2 W', 'Runs the flight script and hears the HIT messages.', 'Adafruit', '5291', 1, 19.05, 'https://www.adafruit.com/product/5291', 'Micro Center, PiShop'],
    ['micro:bit V2', 'Shows the status and radios GO, HIT and STOP to the MS-2000.', 'DFRobot', 'MBT0039', 1, 22.9, 'https://www.dfrobot.com/product-2125.html', 'Adafruit, Micro Center'],
    ['Mini LED arcade button, 24 mm', 'The big GO button. It lights up when the drone is ready.', 'Adafruit', '3430', 1, 2.5, 'https://www.adafruit.com/product/3430', 'Adafruit 3429 (clear)'],
    ['USB OTG host cable', 'Lets the Pi talk to the micro:bit.', 'Adafruit', '1099', 1, 2.5, 'https://www.adafruit.com/product/1099', 'Amazon'],
    ['USB A to micro-B cable, 3 ft', 'micro:bit to the OTG cable.', 'Adafruit', '592', 1, 2.95, 'https://www.adafruit.com/product/592', 'on hand'],
    ['USB cable with switch', 'Power bank to Pi, with the main on/off switch.', 'Adafruit', '1620', 1, 2.95, 'https://www.adafruit.com/product/1620', 'Amazon'],
    ['USB-C panel extension', 'Charge port in the right wall, like the MS-2000.', 'Adafruit', '6069', 1, 4.5, 'https://www.adafruit.com/product/6069', 'Adafruit 4218'],
    ['Female/female jumper wires', 'Button to the Pi.', 'Adafruit', '1950', 1, 1.95, 'https://www.adafruit.com/product/1950', 'on hand'],
    ['Anker 321 power bank', 'Powers the Pi. Same one as the MS-2000.', 'Walmart', 'A1112', 1, 23.84, 'https://www.walmart.com/ip/Anker-5K-Power-Bank-12W-USB-C-USB-A-Port/2335161189', 'Target, Micro Center'],
  ]],
  ['The flight zone', [
    ['Pop-up bug habitat, about 24 x 24 x 36 in', 'The net. Front panel rolled open toward the turret.', 'Amazon', 'any pop-up mesh habitat', 1, 20.0, 'https://www.amazon.com/s?k=pop+up+butterfly+habitat+24+x+24+x+36', 'Target'],
  ]],
];

export const LOCAL = [
  'microSD card, 32 GB, for the Pi',
  '4 x M2.5 x 6 mm screws for the Pi; 4 x M2 x 8 mm for the box floor (MS-2000 M2 kit)',
  '30 AWG silicone wire and heat shrink',
  '10 mm hook-and-loop strap',
  'Clear report-cover plastic for the wings',
  'Poster board and a printed high-contrast pattern for the flight mat',
  'PLA: white (about 3 g) and dark gray or black (about 13 g) for the flying parts; any color for the pad and box',
  'Kitchen scale (1 g) and 7 US nickels (5.000 g each) for the Can it fly? experiment',
  'Female 1x6 pin headers (4) only if the drone does not come with them for the positioning module',
];

export const PLATES = [
  [1, 'Fit check', 'any color', '9m 49s', 3.4, 'flymo-plate-1-fit-check.3mf', 'Three motor collars (7.0, 7.2, 7.4 mm), the button hole, and the sensor pocket. Print this first.'],
  [2, 'Prop guard and legs (F1)', 'dark gray or black', '32m 56s', 7.2, 'flymo-plate-2-guard.3mf', 'Prints upside down: fence on the bed.'],
  [3, 'Hit window (F2)', 'WHITE', '8m 44s', 2.7, 'flymo-plate-3-window.3mf', 'Face down so the 0.8 mm face comes out smooth.'],
  [4, 'Mosquito body (F2)', 'dark gray or black', '26m 2s', 5.4, 'flymo-plate-4-body.3mf', 'Stands on the bulkhead, tail up.'],
  [5, 'Launch pad (F4)', 'any color', '1h 16m', 56.4, 'flymo-plate-5-pad.3mf', 'Flat.'],
  [6, 'Control box (F5)', 'any color (lime on the site)', '2h 16m', 90.0, 'flymo-plate-6-box.3mf', 'Top down.'],
  [7, 'Control box floor (F5)', 'any color', '54m', 40.0, 'flymo-plate-7-box-floor.3mf', 'Flat.'],
];

export const MODELS = [
  ['flymo-drone-3d.html', 'Whole drone', 'Every part in color. Tap a part, or Explode it.'],
  ['flymo-f1-guard.html', 'F1 prop guard and legs', '147 mm across, 6.9 g'],
  ['flymo-f2-cup.html', 'F2 hit window', '40 mm white face'],
  ['flymo-f2-body.html', 'F2 body', 'Holds the sensor and the XIAO'],
  ['flymo-f4-pad.html', 'F4 launch pad', '150 mm square, 4 cone cups'],
  ['flymo-f5-box.html', 'F5 control box', 'micro:bit window and GO button'],
  ['flymo-f5-floor.html', 'F5 box floor', 'Pi posts and the bank cradle'],
  ['flymo-f0-fitcheck.html', 'F0 fit check', 'Print first'],
];

// build plan, in order
export const PLAN = [
  ['Dec 1 to 6', 'Check in and first hover', [
    ['Check every part against the shopping list', 'Same as Dusty: a wrong or missing part is found on day one, not build day.'],
    ['Measure with calipers: motor can below the board, prop height, battery size, module drop', 'These four numbers are guesses in the 3D model. Write them in the journal.'],
    ['Charge a battery and check its plug polarity against the + and - on the board', 'Plug polarity is not the same on every battery brand.'],
    ['Fly the plain drone with the LiteWing phone app for 2 minutes', 'Proves the drone works before we change anything.'],
    ['Flash the positioning module firmware and plug the module in, arrow toward the USB-C port', 'LiteWing web flasher, Chrome only.'],
    ['Print plate 1, the fit check. Pick the collar that grips a motor without splitting', 'That number goes into the guard before it is printed.'],
  ]],
  ['Dec 7 to 13', 'Print, weigh, and the Can it fly? experiment', [
    ['Update the 3D model with the real numbers and re-slice', 'Only the parts that changed.'],
    ['Print plates 2, 3, 4: guard, window, body', 'About 1 hour 10 minutes total.'],
    ['Weigh every part on a kitchen scale and fill in the weight table', 'Real grams replace the estimates.'],
    ['Can it fly? Test A: push test on the kitchen scale at 25, 50, 75 and 100% power', 'Our math predicts about 120 g at full power. See the Can it fly? page.'],
    ['Can it fly? Test B: hover until the low-battery light with 0 to 35 g of nickels, 3 flights each', 'Prediction: about 9 minutes empty, 5.5 minutes with our 26 g. The answer decides keep, go lighter, or bigger props.'],
  ]],
  ['Dec 14 to 20', 'Hold still by itself', [
    ['Make the flight mat: poster board with a printed high-contrast pattern', 'The floor camera needs texture to see movement. A plain floor makes it drift.'],
    ['Install Python and the LiteWing library on the laptop; connect to the drone WiFi', 'Crazyflie cflib, the same library LiteWing uses.'],
    ['Take off, hover at 0.4 m for 20 seconds, land', 'Position hold on. Measure how far it drifts.'],
    ['Fly a slow square, then a figure eight, inside the zone', 'Start at 0.2 m/s.'],
  ]],
  ['Dec 21 to Jan 3', 'Hit sensor and control box', [
    ['Wire the light sensor to the XIAO; tap two thin wires to the drone battery plug for power', 'Unplug the battery after every session: the XIAO is always on.'],
    ['XIAO program: watch the light, send HIT over the drone WiFi when it jumps', 'Flashlight flick test, same as the MS-2000 pod.'],
    ['Print plates 5, 6, 7: pad, box, floor', 'About 4 hours 25 minutes. Good overnight prints.'],
    ['Set up the Pi: flight script, button, HIT listener, micro:bit link', 'The Pi starts the script by itself when it turns on.'],
    ['Addie writes the micro:bit program: GO arrow, HIT count, radio group 7', 'MakeCode, like the MS-2000 wand.'],
  ]],
  ['Jan 4 to 15', 'Push button to landing', [
    ['Press GO: take off, 30 second pattern, land on the pad', 'Only on days with no MS-2000 experiment. Laptop and flyer only.'],
    ['20 test flights in a row. Write down every crash and why', 'Goal: 18 of 20 land on the pad.'],
    ['Flashlight hits during a flight must reach the micro:bit', 'Count hits sent and hits received.'],
  ]],
  ['Jan 16 to 24', 'MS-2000 vs the Flying Mosquito', [
    ['Teach the MS-2000 camera the flyer (Object Tracking)', 'This replaces the stuffed mosquito it learned. The MS-2000 experiments are done by Jan 15.'],
    ['10 runs of 30 seconds. Count hits, time to first hit', 'Same numbers as the MS-2000 experiment, so they can be compared.'],
    ['Teach the camera the stuffed mosquito again', 'The fair demo uses the stuffed mosquito.'],
  ]],
];

export const PROGRAMS = [
  ['Flight script (Pi, Python)', 'Waits for GO. Checks the battery. Sends GO to the micro:bit, takes off to 0.4 m, flies the pattern for 30 seconds facing the turret, lands on the pad, sends STOP. A long press on GO lands right away.'],
  ['Hit listener (Pi, Python)', 'Hears HIT from the XIAO over WiFi, sends it to the micro:bit, and writes every hit with the time to a file.'],
  ['Hit sensor (XIAO, Arduino)', 'Reads the light sensor 200 times a second, learns the normal light level, and sends HIT when it jumps. Waits 1 second before it can send another.'],
  ['Relay (micro:bit, MakeCode)', 'Addie writes this one. Whatever the Pi sends (GO, HIT, STOP) goes out on radio group 7, and the screen shows an arrow, the hit count, or a check mark. It also saves each run like the wand does.'],
];

export const RISKS = [
  ['Too heavy', 'The added load is about 26 g against 25 g rated. Our math says that still leaves a 1.38 push-to-weight ratio.', 'The Can it fly? experiment in December. Fix if needed: go lighter or 65 mm props, as a change order.'],
  ['Drifting', 'Position hold uses a floor camera. A shiny or plain floor makes it slide.', 'The flight mat, and the script lands if it leaves the zone.'],
  ['WiFi', 'The Pi and the XIAO both join the drone WiFi.', 'Test both connected at once in week 1.'],
  ['The turret camera', 'The turret learns one target at a time.', 'Flyer tests only after the MS-2000 experiments; teach the stuffed mosquito back after.'],
  ['Battery safety', 'LiPo batteries can swell or catch fire if they are crushed, shorted or overcharged.', 'Charge on a hard surface with a grown-up nearby; unplug after flying; store at half charge.'],
  ['The fair', 'Drones may not be allowed at the exhibition.', 'Ask Miss Taggart. If not, it is a home demo and a video.'],
];

// Newest first: [date, tag, text]
export const LOG = [
  ['Sep 18, 2026', 'Plan', 'Build guide: 18 steps in six parts (check and print, Can it fly?, fly by itself, hit sensor, control box, test), wiring maps, the Python, Arduino and MakeCode programs, and a fixing-it table.'],
  ['Sep 18, 2026', 'Plan', 'Can it fly? experiment: our own thrust, safety-margin and battery math (about 120 g of push, a 1.4 push-to-weight ratio at the rated 25 g, 5.5 minutes predicted with our 26 g), a prediction, and two tests for Dec 7 to 13.'],
  ['Sep 18, 2026', 'Design', 'Rev A 3D design: prop guard with legs (6.9 g), mosquito body with a 40 mm white hit window (8.1 g), launch pad, control box, fit check. 7 print plates, about 5 hours 45 minutes and 205 g.'],
  ['Sep 18, 2026', 'Plan', 'Schedule: order by Nov 13, build Dec 1 to Jan 24, freeze Jan 25. MS-2000 work always comes first.'],
  ['Sep 18, 2026', 'Decision', 'Radio plan: the control box micro:bit sends GO, HIT and STOP on group 7, the same messages the MS-2000 wand sends, so the turret needs no changes.'],
  ['Sep 18, 2026', 'Decision', 'The drone is a LiteWing (ESP32-S3) with its positioning module. A Raspberry Pi Zero 2 W in the control box flies it with Python. A XIAO ESP32-C3 in the body sends hits.'],
  ['Sep 18, 2026', 'Decision', 'Design A, the Free Flyer, picked. Design C, the Boom Flyer, is the fallback.'],
  ['Sep 18, 2026', 'Plan', 'Four designs compared: Free Flyer, Crazyflie, Boom Flyer, and micro:bit Drone.'],
  ['Sep 18, 2026', 'Plan', 'First requirements written, using lessons from Dusty and the MS-2000.'],
  ['Sep 18, 2026', 'Plan', 'Project started as its own project, to build after the science fair.'],
];

export const LESSONS = [
  ['The laser and the camera only line up at 3 feet', 'The test zone runs 2 to 4 feet, so the dot can land about 13 mm from the camera aim. The window has to be at least 40 mm wide.', 'MS-2000'],
  ['Keep the radio the same', 'The turret already listens for GO, HIT and STOP on group 7. Speaking the same way means no turret changes.', 'MS-2000'],
  ['Measure the space before picking a part', 'The drone can only carry about 25 g. Every printed part got weighed in the 3D model before anything else.', 'Dusty'],
  ['Every number needs a reason', 'Each requirement says why it has its number.', 'Dusty'],
  ['Think about using it, not just building it', 'Where does it charge? Who presses the button? What happens when it crashes? That is why there is a pad, a box outside the net, and three batteries.', 'Dusty'],
  ['Test your own design', 'The flyer test counts the same things as the MS-2000 test, so the results compare.', 'MS-2000'],
  ['Look at the real part', 'The board outline and motor spots came from the drone makers\u2019 own design files, not a guess.', 'Both'],
  ['Print a small test first', 'A 10 minute fit check picks the motor collar size before the guard is printed.', 'Dusty'],
  ['Get the school dates first', 'The flyer schedule is built around the fair dates, and the MS-2000 wins every conflict.', 'MS-2000'],
];

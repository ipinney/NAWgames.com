// MS-2000 change record. Future sessions append here instead of editing JSX.
// The design was locked Sep 16, 00:08 (commit 1f7f4ee). Every change after that gets an MOC and a LOG line.
// MOC fields: id, date, title, status (Draft | Approved | Done), approver, was[], now[], why,
//   options[[choice, result, picked]], found[[title, text]], touched[], tests[], commits[], link {href, label}

export const LOCKED = 'Sep 16, 2026';

export const MOCS = [
  {
    id: 'MOC-001',
    date: 'Sep 16, 2026',
    title: 'A store-bought mosquito and a foam board backdrop',
    status: 'Approved',
    approver: 'Dad',
    was: [
      'Three 3D printed mosquito bodies, each made of two white halves with the light sensor and red LED eyes inside.',
      'A printed flight zone box with a black top and a black back.',
    ],
    now: [
      'A stuffed mosquito from the store with a small printed pod sewn on. The pod is a white cup 40 mm across plus a cap that holds the light sensor (part P6).',
      'A 30 by 20 inch black foam board standing on two printed feet, with a clip, a 1/4 inch dowel, and the pendulum pivot (part P7).',
      'No printed flight zone box.',
    ],
    why: 'Less printing, a faster build, and a mosquito that looks real to the camera.',
    options: [],
    found: [
      ['The dot does not always land in the middle', 'The laser sits under the camera, so the dot can land about 15 mm away from where the camera is aiming. The light sensor is only about 8 by 11 mm, smaller than a fingernail. So the pod became a light collector: the dot anywhere on the 40 mm white face lights up the whole cup, and the sensor at the back sees it.'],
      ['The eyes could fool the sensor', 'Red LED eyes inside the cup would light it up and count as a hit by themselves. The eyes moved to the outside of the cup.'],
      ['Taking out the box took away its lid', 'The black top of the box kept the beam from going up. Now three things do that job: the black backdrop, a printed tilt stop, and limits in the code.'],
    ],
    touched: ['3D parts P6, P7, P8', 'Print plates', 'Parts list and store list', 'Build guide', 'Full plan page'],
    tests: [
      'Flick a flashlight at the pod 20 times: 20 hits.',
      'The eyes never set off the sensor by themselves.',
      'Every shot ends on the backdrop.',
    ],
    commits: ['15221fb'],
    link: { href: '/projects/addie/ms2000-cad/ms2000-3d.html', label: 'See the setup in 3D' },
  },
  {
    id: 'MOC-002',
    date: 'Sep 16, 2026',
    title: 'A new question, and a size test instead of a light test',
    status: 'Approved',
    approver: 'Dad',
    was: [
      'Question: does a faster mosquito get hit less?',
      'Three tests: speed, distance, and light (room lights, one lamp, lights off).',
    ],
    now: [
      'Engineering goal: build a robot that finds, tracks, and hits a flying mosquito by itself.',
      'Science question: what makes the MS-2000 miss more, a faster mosquito or a smaller one?',
      'Target size test: black paper covers over the pod with a 40, 20, or 10 mm hole. Every cover is the same size on the outside, so the camera only has to learn the mosquito once.',
    ],
    why: 'The light test mostly measured how well the HuskyLens camera sees in the dark, not Addie\u2019s design. Size connects to real mosquitoes, which are about 10 mm long, and the covers only cost paper.',
    options: [],
    found: [],
    touched: ['Overview page', 'Fair guide: question, hypothesis, variables, results', 'Learn page', 'Full plan page', 'Build guide: wand program, cutting the covers, hit threshold'],
    tests: [
      'With each cover on, a flashlight through the hole flashes the eyes.',
      'The camera still tracks the mosquito with each cover on.',
    ],
    commits: ['c6fa2d5'],
    link: { href: '/projects/addie/mosquito-turret/fair', label: 'See the fair guide' },
  },
  {
    id: 'MOC-003',
    date: 'Sep 16, 2026',
    title: 'Aim for 3 feet, because the fair table is 3 feet',
    status: 'Approved',
    approver: 'Dad',
    was: [
      'The laser crossed the camera\u2019s line at 5 feet. The head tipped the laser up 1.42 degrees.',
      'Tests at 3, 5, and 7 feet, 45 runs in all.',
    ],
    now: [
      'The laser crosses at 3 feet (tipped up 2.37 degrees). At 2 and 4 feet the dot is 12.6 mm off, and the pod face can take about 17 mm, so it works from about 2 to 4.3 feet.',
      'Every run is at 3 feet: 2 tests, 30 runs, 2 graphs.',
      'The fair demo is at about 2 feet.',
    ],
    why: 'The fair table is only 3 feet wide. Aimed for 5 feet, a demo 2 feet away would miss by about 23 mm, which is more than half the pod.',
    options: [
      ['Put the turret on a diagonal and keep the 5 foot aim', 'Too tight. No room left for error.', false],
      ['Shift the aim in code, using how big the mosquito looks to the camera', 'Kept as a backup idea.', false],
      ['Re-aim for 2 feet', 'Breaks the longer tests.', false],
      ['Re-aim for 3 feet and drop the distance test', 'Picked.', true],
    ],
    found: [
      ['The big backdrop does not fit', 'A 30 by 20 inch board plus a 10 inch dowel is too wide for a 36 inch table. At the fair we use a 12 by 12 inch backdrop and a dowel about 4 inches long.'],
      ['The beam needs a clear lane', 'Nothing can sit between the turret and the backdrop.'],
      ['The turret needs fair limits', 'With a small backdrop, the code needs tighter left and right limits so the turret cannot aim past its edge.'],
      ['The board has to fold', 'The trifold wings fold in so everything fits in 36 inches.'],
    ],
    touched: ['Head part P4', 'Both 3D viewers', 'All 5 print plates re-sliced', 'Hero and share pictures', 'Build guide steps 13 and 14 and the wand program', 'Fair guide, Learn, overview, full plan', 'New board and table page', 'Project plan v9'],
    tests: [
      '10 out of 10 shots flash the eyes at 2, 3, and 4 feet.',
      'In the fair layout, every shot ends on the small backdrop, with the mosquito at both ends of its swing.',
    ],
    commits: ['8a683b7'],
    link: { href: '/projects/addie/ms2000-board.html#table', label: 'See the table layout' },
  },
];

// Newest first: [date, tag, text, commit]. Tags: Change, Decision, Design, Fix, Plan.
export const LOG = [
  ['Sep 16', 'Plan', 'Changes and lessons page started. From now on every change after the design lock gets a change order and a line here.', ''],
  ['Sep 16', 'Design', '3D viewers got a card at the bottom and chips you slide sideways, like Dusty\u2019s.', 'cf3345e'],
  ['Sep 16', 'Plan', 'Board and table page: two trifold layouts that fit a 3 foot table, and 12 sheets to print.', '8a683b7'],
  ['Sep 16', 'Change', 'MOC-003: laser aimed for 3 feet, distance test dropped. 30 runs instead of 45.', '8a683b7'],
  ['Sep 16', 'Change', 'MOC-002: new engineering goal and science question (what makes it miss). Target size test replaces the light test.', 'c6fa2d5'],
  ['Sep 16', 'Decision', 'Pew or boom is picked by touching the wand\u2019s gold logo, because the turret buttons are inside the base. The wand runs every test: A picks the test, B picks the run, A and B together start 30 seconds.', 'b04f515, 25f1b14'],
  ['Sep 16', 'Plan', 'Build guide: 16 steps, wiring maps, and 7 MakeCode programs.', 'b04f515'],
  ['Sep 16', 'Plan', 'St. Rose fair guide. Schedule refit to the real due date, Feb 1, replacing the spring 2027 guess.', '0c76d1e'],
  ['Sep 16', 'Change', 'MOC-001: stuffed mosquito with a printed pod, and a foam board backdrop instead of a printed box.', '15221fb'],
  ['Sep 16', 'Design', 'All printed parts, P1 to P8, modeled and checked for fit and movement. 5 print plates, about 10 hours 20 minutes and 320 g of plastic.', '5be7d84 to 99b2377'],
  ['Sep 16', 'Fix', 'A photo of the Xia mi board showed a standing micro:bit socket and 4 corner holes. The carrier plate idea was dropped; the floor plate holds the posts.', 'f83c7d3'],
  ['Sep 16', 'Decision', 'Design locked. Final parts list with main and backup stores: $192 from 2 stores.', '1f7f4ee'],
  ['Sep 15', 'Decision', 'Addie picked Design A, the pan and tilt turret. Design B is the fallback.', '2103f78'],
  ['Sep 15', 'Decision', 'Named MS-2000. Sound effects and saving data are required.', '53932dd'],
  ['Sep 15', 'Decision', 'Class 2 laser under 1 mW kept. A 14 W laser strong enough to kill a mosquito was turned down: ours is 14,000 times weaker, and fairs only allow the safer classes.', 'c0cd8c4'],
  ['Sep 15', 'Decision', 'A fake mosquito on a fishing line that the camera can learn.', 'c0cd8c4'],
  ['Sep 15', 'Change', 'Lasers became a requirement instead of the air cannon.', '51ca7ba'],
  ['Sep 15', 'Plan', 'Project started: brainstorm of an air cannon, a vacuum, and a light beam.', 'fbd9372'],
];

export const LESSONS = [
  ['Get the school\u2019s dates first', 'We guessed the fair was in the spring. The real due date is February 1, so the experiments had to move to winter break.'],
  ['Measure where it will be shown', 'Tests at 5 and 7 feet could never run on a 3 foot fair table. Measure the table before picking test distances.'],
  ['Two things side by side only line up at one distance', 'The camera and the laser are 38 mm apart, like your two eyes. Their lines cross at one spot. The target needs room for error, and the pod\u2019s 40 mm glowing face is that room.'],
  ['Test your design, not someone else\u2019s part', 'The light test mostly tested how the camera sees in the dark. A good test changes something about your own design.'],
  ['When you take something out, check what it was doing', 'Taking out the flight box also took away the lid that kept the beam low. That job had to go to something else.'],
  ['Look at a photo of the real part', 'A photo of the Xia mi board showed where the socket and holes really are, and changed the base before anything was printed.'],
  ['Big numbers need a source', 'The 14 watt number came from a science paper. That one number decided which laser we could use.'],
  ['Keep one list of what a change touches', 'One change reached the 3D model, the print files, 5 web pages, the build guide code, and the plan. A list makes sure nothing gets missed.'],
];

export const NEXT = [
  'Get the due dates, the table size, and the display rules before designing.',
  'Write the goal, the question, and every requirement with a number and a reason.',
  'Make a 3D model and check that every part fits before ordering.',
  'Lock the design, then use a change order for anything after that.',
  'Add a line to the history log the same day something changes.',
];

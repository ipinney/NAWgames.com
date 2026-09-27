// Dusty photo log.
//
// TO ADD A PHOTO:
//   1. Put the image file in  public/projects/nolan/dusty-media/
//      Name it like:  2026-09-19-moto-bit.jpg   (date first, then what it is)
//   2. Add one entry to PHOTOS below. Newest first inside each phase.
//   3. Commit and push. That's it.
//
// Fields:
//   file    - file name only, inside dusty-media/
//   phase   - one of the PHASE keys below
//   date    - YYYY-MM-DD, the day the photo was taken
//   title   - short label under the photo
//   caption - Nolan's note. What it is, or what happened. Can be empty.
//   alt     - description for screen readers and when the image fails to load
//   tall    - true for a portrait photo (phone held upright)

export const PHASES = [
  {
    key: 'parts',
    title: 'Parts arriving',
    lead: 'Every box, opened and checked in.',
    shoot: [
      'The box with the packing slip next to it, before anything is unpacked',
      'Each part still in its bag, so the part number shows',
      'Anything wrong, broken or the wrong size, with the box in the picture',
      'The whole kit laid out on the table before build day',
    ],
  },
  {
    key: 'print',
    title: 'Printing the chassis',
    lead: 'The printer running, and the parts that come off it.',
    shoot: [
      'The first layer going down',
      'A part still stuck to the build plate',
      'Support material being pulled off',
      'A failed print, if one fails. Those go on the board too',
    ],
  },
  {
    key: 'drive',
    title: 'Making it drive',
    lead: 'Motors, wheels, caster, power.',
    shoot: [
      'Motors and brackets held up next to the base plate before screwing them on',
      'The wiring, close up, before the deck goes on',
      'The first time the wheels turn',
    ],
  },
  {
    key: 'cliff',
    title: 'Cliff detection',
    lead: 'The part the whole project is about.',
    shoot: [
      'The sensor boom with a ruler against it, showing the 3 mm height',
      'The micro:bit LEDs showing a sensor reading',
      'Dusty stopped at the table edge, from the side, low down',
      'The whisker switch touching the table',
    ],
  },
  {
    key: 'sweeper',
    title: 'The sweeper',
    lead: 'Brush, tray, and crumbs.',
    shoot: [
      'All three brush materials side by side before testing',
      'The tray before and after a run, on the scale',
      'A messy table, then the same table after',
    ],
  },
  {
    key: 'test',
    title: 'Experiment day',
    lead: 'Four speeds, twenty runs each.',
    shoot: [
      'The test setup: table, tape marks, ruler',
      'The data sheet part way through, with real numbers on it',
      'A run at full power, where it is supposed to fail',
    ],
  },
  {
    key: 'board',
    title: 'The board and the fair',
    lead: 'Putting it together and showing it off.',
    shoot: [
      'The trifold being laid out on the floor',
      'The finished board',
      'Nolan with Dusty at the showcase',
    ],
  },
];

export const PHOTOS = [
  {
    file: '2026-09-26-motor-test-fit.jpg',
    phase: 'drive',
    date: '2026-09-26',
    title: 'Test fit with the plug turned in',
    caption: 'Trying a motor with its plug turned toward the base. The little encoder board on the back sticks out past the motor, so it hits the plate and the motor cannot sit down in its bracket. That is why the base got a window for each motor (MOC-005).',
    alt: 'A hand holding an N20 gear motor with a wheel over a black 3D printed robot base, the small green encoder board and white plug on the back of the motor sitting against the base plate, a second motor with colored wires already in a white bracket on the far side',
    tall: true,
  },
  {
    file: '2026-09-26-encoder-plug.jpg',
    phase: 'drive',
    date: '2026-09-26',
    title: 'The plug sticks out sideways',
    caption: 'Wheel on, looking at the back of the motor. The encoder board and its white plug stick out to one side. Our 3D model had the motor the right length but left this part out.',
    alt: 'A hand holding an N20 gear motor by its black wheel, with a small circuit board on the back end and a white plug hanging off one side, six colored wires running away across a wooden table',
    tall: true,
  },
  {
    file: '2026-09-26-motor-plug-overhang.jpg',
    phase: 'drive',
    date: '2026-09-26',
    title: 'Measuring the plug',
    caption: 'Ruler across the back of the motor to see how far the board and plug reach out to the side. About 16 mm from the middle of the motor. The base plate is only 14 mm away, so it does not fit.',
    alt: 'An N20 gear motor standing on paper with a clear centimeter ruler across its back end, the encoder board and white plug reaching past the motor body to the left',
    tall: false,
  },
  {
    file: '2026-09-26-motor-length.jpg',
    phase: 'drive',
    date: '2026-09-26',
    title: 'Measuring the motor length',
    caption: 'From the front of the gearbox to the back of the plug is about 33 mm. The model said 37 mm. The new base uses the number we measured.',
    alt: 'An N20 gear motor lying on its side on paper next to a clear centimeter ruler, the plug end at 0 and the front of the gearbox at about 3.3 cm, with the shaft sticking out past it',
    tall: false,
  },
  {
    file: '2026-09-26-motors-wheels-caster.jpg',
    phase: 'drive',
    date: '2026-09-26',
    title: 'Motors, wheels and caster on',
    caption: 'The base upside down, with both N20 motors, the wheels and the ball caster screwed on. The plugs on the back of the motors point down at the table, so the wires could drag. That has to be fixed before it drives.',
    alt: 'A black 3D printed robot base upside down on a wooden table, with two small gear motors in white brackets, a black rubber wheel on each side, a metal ball caster on a post, and a box of black screws behind it',
    tall: true,
  },
  {
    file: '2026-09-24-adafruit-order.jpg',
    phase: 'parts',
    date: '2026-09-24',
    title: 'Adafruit box',
    caption: 'Checked against the packing slip: the micro:bit v2, two N20 gear motors, the roller lever whisker switch, and the 130 motor for the brush. All there. The 4 x AA battery pack came too. It was ordered before we switched to the power bank, so it goes in the Spares bag.',
    alt: 'An Adafruit packing slip on a wooden table with a boxed micro:bit v2, two bagged N20 gear motors, a bagged microswitch, a bagged small hobby motor, and a black 4 AA battery holder',
    tall: true,
  },
  {
    file: '2026-09-20-rocker-switches.jpg',
    phase: 'parts',
    date: '2026-09-20',
    title: 'Rocker switches',
    caption: 'Five KCD11 on/off switches. Dusty needs two: one for main power and one for the brush motor. Three are spares.',
    alt: 'A small cardboard box with a barcode label, and below it a clear bag holding five black mini rocker switches',
    tall: true,
  },
  // Example of a finished entry, kept here as a template. Delete when the
  // first real photo goes in, or leave it, it does not render.
  // {
  //   file: '2026-09-19-moto-bit.jpg',
  //   phase: 'parts',
  //   date: '2026-09-19',
  //   title: 'moto:bit from SparkFun',
  //   caption: 'The motor board, still in its pink bag. Pink bags stop static.',
  //   alt: 'A SparkFun box open on a table with the moto:bit board inside an antistatic bag, packing slip below',
  //   tall: true,
  // },
];

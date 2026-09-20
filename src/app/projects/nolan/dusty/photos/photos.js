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

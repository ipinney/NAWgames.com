import { BASE, meta, Nav, Hero, Section, Card, Box, Btn, Words } from '../ui';

export const metadata = meta(
  'Dusty: research notes',
  'Six research topics with real sources for a table-sweeping robot: the Roomba story, cliff sensors, dark surfaces, random driving, the micro:bit, and why crumbs matter. Plus vocabulary and bibliography entries.',
  `${BASE}/research`
);

const TOPICS = [
  {
    id: 'roomba',
    title: 'Somebody already built the floor version',
    big: 'Robot vacuums clean floors. Nobody made the table version.',
    body: [
      'The robot vacuum you have seen is called a Roomba. It is made by iRobot, a company started in 1990 by three robot scientists from MIT. The first Roomba went on sale in September 2002 for about $199, which was cheap compared to other robot vacuums at the time.',
      'Here is the funny part. Before it was called Roomba, the team called it DustPuppy.',
    ],
    factsTitle: 'What matters for Dusty',
    facts: [
      'Robot vacuums are for floors. Nobody made the table version, which is the gap your invention fills.',
      'The first Roomba had a dirt tray you empty instead of a vacuum bag, the same idea as Dusty’s crumb tray.',
      'iRobot gave the Roomba three separate safety systems just to keep it from falling down stairs. Falling is the number one danger for a driving robot.',
    ],
    use: 'Know box, and the Reason for Creation part of the board. A robot vacuum cannot help on a table because it would drive off the side, and that is exactly why a table robot has to be built differently.',
    sources: [
      ['IEEE Spectrum Robots Guide, Roomba entry', 'https://robotsguide.com/robots/roomba/'],
      ['Smithsonian National Museum of American History, Roomba Robot Vacuum Cleaner', 'https://americanhistory.si.edu/collections/object/nmah_1448432'],
    ],
  },
  {
    id: 'cliff',
    title: 'How a robot sees a cliff with no eyes',
    big: 'Shine down, measure the bounce, no bounce means no table.',
    body: [
      'A cliff sensor is two tiny parts side by side. One is an infrared LED that shines invisible light straight down. The other is a detector that measures how much of that light bounces back.',
      'On a table, the light bounces straight back up into the detector, so the reading is strong. At the edge there is nothing underneath but air and the floor four feet down. The light goes out and never comes back. That sudden drop is the robot’s word for "cliff."',
    ],
    factsTitle: 'Numbers to know',
    facts: [
      'Infrared is real light, just past the red end of the rainbow. Your eyes cannot see it, but a phone camera sometimes can.',
      'A white or light surface bounces back roughly 60 to 80 percent of the infrared light. A black surface bounces back only about 10 to 20 percent.',
      'These sensors work best a few millimeters from the surface. Too high up and the reading gets weak. That is why Dusty’s sensor arms slide up and down.',
      'Sunlight has infrared in it, so bright sun can mess with the reading. Testing in the same light every time is a controlled variable.',
    ],
    use: 'How It Works, on the board and on the Design Thinking page. Say it in order: shine down, measure the bounce, no bounce means no table, stop the motors.',
    sources: [
      ['Science Buddies, Line-Following Robot lesson plan', 'https://www.sciencebuddies.org/teacher-resources/lesson-plans/line-following-robot'],
      ['SparkFun Learn, RedBot experiment 6, IR reflectance sensors', 'https://learn.sparkfun.com/tutorials/sparkfun-inventors-kit-for-redbot/experiment-6-line-following-with-ir-sensors'],
    ],
  },
  {
    id: 'dark',
    title: 'The black tablecloth problem is real',
    big: 'Dark surfaces can look like a cliff to an infrared sensor.',
    body: [
      'A dark surface swallows most of the infrared light, so a cliff sensor looking at black carpet sees almost the same weak reading it would see looking off a stair. The robot thinks there is a cliff where there is only a dark rug.',
      'This happens to real Roombas. Owners find their robot refuses to drive onto black or very dark carpets, because the cliff sensors keep false-triggering.',
    ],
    factsTitle: 'Why this is good news for you',
    facts: [
      'Your surface test, white paper against bare wood against a black placemat, tests a weakness that a big company still has not fully solved.',
      'Your two fixes are the right ones: calibrate at startup on the actual surface, and add a whisker switch that does not care about color at all.',
      'When a judge asks "what if the sensor is wrong," the answer is two different sensors that fail for different reasons. That is called redundancy.',
    ],
    use: 'Need to know box, and research question number 2. This is the strongest thing in the project, because it is a real problem you found before you built anything.',
    sources: [
      ['Wikipedia, Roomba, sensors section', 'https://en.wikipedia.org/wiki/Roomba'],
      ['Science Buddies, BlueBot line-following project', 'https://www.sciencebuddies.org/science-fair-projects/project-ideas/Robotics_p023/robotics/line-following-robot'],
    ],
  },
  {
    id: 'driving',
    title: 'Dumb driving beats smart driving',
    big: 'The first Roomba had no map, and it worked.',
    body: [
      'The first Roomba drove in straight lines, bumped into something, turned a random direction, and drove again. It looked silly and it worked, because if you bounce around a room long enough you eventually cover all of it.',
      'The expensive competitor at the time mapped the room with sound, like a bat, and cost about seven times more. The cheap random one sold a million a year.',
    ],
    factsTitle: 'What matters for Dusty',
    facts: [
      'Random bounce on button A is not the lazy option. It is what the real product shipped with.',
      'Spot Clean on button B sweeps one small square in rows, like a lawn mower, which is what you want for a spill. Racing the two on the same spill is a second experiment.',
      'Simple code that never crashes beats clever code that fails at the science fair.',
    ],
    use: 'How will it operate, on Design Thinking page 24, and How Does It Work on the board.',
    sources: [
      ['IEEE Spectrum Robots Guide, Roomba entry', 'https://robotsguide.com/robots/roomba/'],
      ['MIT Technology Review, review of the original iRobot Roomba, Oct 2002', 'https://www.technologyreview.com/2002/10/09/234680/irobot-roomba/'],
    ],
  },
  {
    id: 'microbit',
    title: 'What the brain actually is',
    big: 'A whole computer on a board smaller than a credit card.',
    body: [
      'The micro:bit is a whole computer on one small board, about 4 cm by 5 cm. It was made to teach kids to code, and it is Dusty’s brain.',
    ],
    factsTitle: 'The parts you are going to use',
    facts: [
      '25 red LEDs in a 5 by 5 grid. You can scroll sensor numbers across them and read them at the table with no laptop. That is why the micro:bit beat an Arduino for this project.',
      'Button A and button B. Two cleaning patterns, one button each.',
      'The edge connector, the gold stripes along the bottom, which is how the motor board and sensors connect.',
      'A processor, the actual brain chip, which runs your blocks about as fast as you will ever need.',
      'A power plug so it runs with no computer attached.',
    ],
    use: 'What is it made of, on Design Thinking page 24, and the labels on your sketch. You also need to be able to explain every wire.',
    sources: [
      ['Micro:bit Educational Foundation, features overview', 'https://microbit.org/get-started/features/overview/'],
      ['Micro:bit developer community, hardware', 'https://tech.microbit.org/hardware/'],
    ],
  },
  {
    id: 'crumbs',
    title: 'Why crumbs are worth cleaning up',
    big: 'Crumbs bring bugs, and wiping them onto the floor does not fix it.',
    body: [
      'Ants and cockroaches find food by scouting. When one scout finds crumbs it leaves a scent trail so the rest of the colony can follow. Pest control advice almost always starts the same way: wipe the table and sweep the floor right after eating.',
      'What people actually do is brush the crumbs off the table with a hand. The crumbs land on the floor. The mess did not go away, it moved somewhere harder to reach.',
    ],
    factsTitle: 'The argument for your invention, in three steps',
    facts: [
      'Crumbs on a table attract pests.',
      'Wiping with a hand moves them to the floor instead of removing them.',
      'Dusty picks them up into a tray you dump in the trash, so the crumbs actually leave the house.',
    ],
    use: '"This topic is interesting because" on the Research Question page, plus Purpose and Impact on Society on the board. To cite this one, look for a university extension service page rather than a pest company ad, because a company selling bug spray is not a neutral source.',
    sources: [],
  },
];

const WORDS = [
  ['Autonomous', 'It decides for itself. No remote control, no driver.'],
  ['Calibration', 'Measuring the surface at startup so the threshold fits that table.'],
  ['Differential steering', 'Turning by running one wheel faster than the other. No steering wheel.'],
  ['Infrared', 'Light just past red that people cannot see. Sensors can.'],
  ['Microcontroller', 'A small computer that runs one program forever. The micro:bit.'],
  ['Prototype', 'The first one you build to find out what is wrong with the idea.'],
  ['Redundancy', 'Two different sensors doing the same job so one can fail.'],
  ['Reflectance sensor', 'An emitter and a detector together. Shines light, measures the bounce.'],
  ['Threshold', 'The cutoff number between table and cliff.'],
];

const BIB = [
  ['Features Overview', 'Micro:bit Educational Foundation', 'https://microbit.org/get-started/features/overview/'],
  ['Line-Following Robot Lesson Plan', 'Science Buddies', 'https://www.sciencebuddies.org/teacher-resources/lesson-plans/line-following-robot'],
  ['Roomba', 'IEEE Spectrum Robots Guide', 'https://robotsguide.com/robots/roomba/'],
];

const CHIPS = [...TOPICS.map((t) => [t.id, t.title]), ['words', 'Words to use'], ['bibliography', 'Bibliography']];

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      <Nav current="research" />
      <Hero
        title="RESEARCH"
        lead="Six things worth knowing before you build a table robot, written out so you can read them and then say them in your own words."
        sub="The sources are real and the links work. Read it, then fill in the Know and Need to know boxes."
        badge="Research Question page due Thu Sep 17"
        chips={CHIPS}
      />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {TOPICS.map((t, i) => (
          <Section key={t.id} id={t.id} n={i + 1} title={t.title} big={t.big}>
            <Card>
              <div className="space-y-3">
                {t.body.map((p, j) => (
                  <p key={j} className="text-white/80 text-[15px] leading-relaxed">{p}</p>
                ))}
              </div>
              {t.sources.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="text-white/45 text-xs font-semibold">Sources</div>
                  <ul className="mt-1.5 space-y-1">
                    {t.sources.map(([name, url]) => (
                      <li key={url} className="text-sm">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-naw-cyan hover:underline">{name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Box title={t.factsTitle} items={t.facts} />
              <Box tone="warn" title="Where this goes in the packet"><p>{t.use}</p></Box>
            </div>
          </Section>
        ))}

        <Section id="words" n={TOPICS.length + 1} title="Words to use out loud" big="Say the real word, then explain it in normal language.">
          <Words list={WORDS} />
          <Btn href={`${BASE}/learn#words`}>All the words from Learn the science</Btn>
        </Section>

        <Section id="bibliography" n={TOPICS.length + 2} title="Three websites, already filled in" big="Copy them in cursive onto the Research Resources page.">
          <div className="grid md:grid-cols-3 gap-3">
            {BIB.map(([title, site, url]) => (
              <Card key={url}>
                <dl className="text-sm space-y-1.5">
                  {[
                    ['Author', '(none listed)'],
                    ['Title of article', title],
                    ['Publication date', '(none listed, write the date you read it)'],
                    ['Website', site],
                    ['URL', url],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-white/40 text-xs">{k}</dt>
                      <dd className="text-white break-all">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ))}
          </div>
          <Box
            tone="pick"
            title="The two books are still on you"
            items={[
              'The form has two book slots, and websites do not count for those.',
              'Search the library catalog for micro:bit, coding for kids, robotics for kids, and how robots work.',
              'Each book needs author last and first name, title, copyright date, and publisher. The copyright date is on the back of the title page next to the little ©.',
              'Do not write down a book you did not open. Read at least a few pages of each one.',
            ]}
          />
          <Box tone="warn" title="Now go write it">
            <p>Reading research does not count until it is on paper. The Research Question page is due Thursday Sep 17, in cursive.</p>
          </Box>
          <div className="flex flex-wrap gap-2">
            <Btn href={`${BASE}/packet#research-question`} primary>Packet guide, Part 1</Btn>
            <Btn href={`${BASE}/invention`}>The invention and the experiment</Btn>
            <Btn href={`${BASE}/learn`}>Learn the science</Btn>
          </div>
        </Section>
      </div>
    </div>
  );
}

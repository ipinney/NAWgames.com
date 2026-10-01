import { BASE, BOARD, meta, Nav, Hero, Section, Card, Box, Tag, Btn } from '../ui';

export const metadata = meta(
  'Dusty: Invention Convention packet guide',
  'Every page of the Invention Convention packet in order, with questions to think through for each one, the trifold layout, and the 100 point rubric.',
  `${BASE}/packet`
);

// Each part's help turns into thinking questions from midnight Central on its due date.
export const dynamic = 'force-dynamic';
const DUE = { impact: '2026-10-08T00:00:00-05:00', catholic: '2026-10-15T00:00:00-05:00' };
const past = (iso) => Date.now() >= new Date(iso).getTime();

function Think({ title = 'Think about it', tone = 'facts', items }) {
  return <Box tone={tone} title={title} items={items} />;
}

const CHIPS = [
  ['rules', 'The rules'],
  ['due-dates', 'Due dates'],
  ['research-question', 'Research Question'],
  ['design-plan', 'Design plan p. 23'],
  ['design-plan-24', 'Design plan p. 24'],
  ['impact', 'Impact on Society'],
  ['catholic', 'Catholic Connection'],
  ['resources', 'Research Resources'],
  ['board', 'Trifold board'],
  ['rubric', 'Rubric'],
];

const RULES = [
  ['Your words, your thinking', 'This guide asks questions. It does not give answers. Think, talk it over, then write what you figured out in your own words. Never copy sentences from a website, a book, or anyone else.'],
  ['Cursive, by hand', 'Every single thing written in the packet must be handwritten and in cursive. No typing, no printing. Easy to forget and easy to lose points on.'],
  ['Five separate grades', 'Each part is a science classwork grade on its own due date. A late part is a zero on that grade, not just a late project.'],
  ['The board can be typed', 'Board text may be typed and printed, and titles may be typed or stickers. Only the sketch has to be hand drawn.'],
  ['Working is a bonus', 'The prototype only has to show what the invention looks like. Dusty is going to actually work. That is extra, not required.'],
];

const DATES = [
  ['Thu Sep 17', 'Research Question', 'Topic, why it is interesting, Know and Need to know boxes, and three research questions that are not yes or no questions.', '#research-question'],
  ['Thu Oct 1', 'Design Thinking Plan', 'Page 23 is five questions about what it is and who it is for. Page 24 is the labeled drawing plus size, weight, materials, cost, and how it operates.', '#design-plan'],
  ['Thu Oct 8', 'Impact on Society', 'Top half of the Impact page. Who it helps and what changes if a lot of people have one.', '#impact'],
  ['Thu Oct 15', 'Catholic Connection', 'Bottom half of the Impact page. A saint your invention relates to, or a work of mercy, explained thoughtfully.', '#catholic'],
  ['Mon Nov 16', 'Prototype + trifold + whole packet', 'Robot, board, and packet all turned in. Showcase 2:15 to 3:00 in the Parish Hall. The Research Resources page is due with this, so check out the two books early.', '#board'],
];

function Sheet({ tag, title, ask, children }) {
  return (
    <Card>
      <Tag>{tag}</Tag>
      <h3 className="text-white font-bold text-lg mt-2">{title}</h3>
      {ask && <p className="text-white/55 text-sm mt-1">{ask}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </Card>
  );
}

const SAINTS = [
  ['Option 1: Saint Zita', 'A housekeeper who did ordinary cleaning work her whole life with love and care instead of treating it as beneath her. Patron saint of housekeepers and domestic workers. Dusty does the smallest, least glamorous cleaning job there is. The connection: small work done well still matters.'],
  ['Option 2: Saint Martha', 'Martha is the one in the Gospel serving and preparing the meal while everyone else sits. Patron of cooks and homemakers. Dusty works on the table where the family eats. There is also the line in Matthew about the crumbs that fall from the master’s table, which you could use.'],
  ['Option 3: Saint Carlo Acutis', 'A teenager who taught himself to program computers and used that skill to serve other people. Canonized in 2025 and connected with computers and the internet. Dusty is a programming project. The connection: you can use coding to help your family, not just to play.'],
];

const RUBRIC = [
  ['Purpose of Invention', 10, 'A clear strong purpose that is easy to understand. One sentence someone can repeat back to you.'],
  ['Reason for Creation', 10, 'A strong explanation of why the invention is needed. The crumbs-onto-the-floor problem, and why a robot vacuum cannot do it.'],
  ['How It Works', 10, 'A detailed step-by-step explanation. Sensors, motors, brush, tray, in order, not just a list of parts.'],
  ['Impact on Society', 10, 'Thoughtful and clear. Beyond your own house.'],
  ['Catholic Connection', 10, 'A strong connection to a saint or a work of mercy, with the explanation. A name with no reason is not full points.'],
  ['Sketch', 10, 'Detailed, neat, labeled. Neat counts. Draw it in pencil first.'],
  ['Bibliography', 10, 'Complete and correctly formatted. Two books and three websites, every field filled in.'],
  ['Prototype', 30, 'Creative, well built, clearly represents the invention. Worth more than any three other rows combined.'],
];

function Board() {
  const panel = { fill: '#1a1330', stroke: '#ffffff', strokeOpacity: 0.35, strokeWidth: 2 };
  const head = { fontSize: 17, fill: '#06b6d4', textAnchor: 'middle', fontWeight: 600 };
  const small = { fontSize: 11, fill: '#ffffff', fillOpacity: 0.5, textAnchor: 'middle' };
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 760 330" className="block w-full min-w-[520px] h-auto" role="img" aria-label="Trifold board layout: left panel Purpose, Why, How does it work; center DUSTY and the sketch; right Impact on Society, Catholic Connection, Research Resources">
        <polygon points="40,70 200,40 200,290 40,320" {...panel} />
        <text x="120" y="95" {...head}>Purpose</text>
        <text x="120" y="120" {...small}>why we need it</text>
        <text x="120" y="142" {...small}>who it is for</text>
        <text x="120" y="164" {...small}>how it helps people</text>
        <text x="120" y="205" {...head}>Why</text>
        <text x="120" y="262" {...head} fontSize={15}>How does it work?</text>
        <rect x="200" y="40" width="360" height="250" {...panel} />
        <text x="380" y="85" fontSize="30" fontWeight="700" fill="#f59e0b" textAnchor="middle">DUSTY</text>
        <rect x="245" y="110" width="270" height="150" fill="#f59e0b" fillOpacity=".08" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 5" />
        <text x="380" y="180" fontSize="17" fill="#f59e0b" textAnchor="middle">Invention Sketch</text>
        <text x="380" y="203" {...small}>hand drawn, with labels</text>
        <polygon points="560,40 720,70 720,320 560,290" {...panel} />
        <text x="640" y="105" {...head} fontSize={15}>Impact on Society</text>
        <text x="640" y="185" {...head} fontSize={15}>Catholic Connection</text>
        <text x="640" y="265" {...head} fontSize={15}>Research Resources</text>
      </svg>
    </div>
  );
}

export default function PacketPage() {
  return (
    <div className="min-h-screen">
      <Nav current="packet" />
      <Hero
        title="THE PACKET"
        lead="Everything the Invention Convention packet asks for, in order, with questions to get you thinking about each one."
        sub="The answers are yours. Think it through, then write it in your own words, in cursive."
        badge="Showcase Mon Nov 16 · 2:15 to 3:00 · Parish Hall"
        chips={CHIPS}
      />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section id="rules" n={1} title="The rules" big="Read this first.">
          <Box tone="tip" title="Driving question for the whole project">
            <p className="text-white font-semibold">How can a real-world problem be changed by an invention you create?</p>
          </Box>
          <div className="grid sm:grid-cols-2 gap-3">
            {RULES.map(([t, d]) => (
              <Card key={t}>
                <div className="text-naw-orange font-bold">{t}</div>
                <div className="text-white/70 text-sm mt-1">{d}</div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="due-dates" n={2} title="Five due dates" big="Five parts, five grades.">
          <div className="space-y-2">
            {DATES.map(([when, t, d, href], i) => (
              <a
                key={t}
                href={href}
                className={`grid grid-cols-[6.5rem_1fr] gap-4 rounded-2xl border p-4 transition-colors ${
                  i === DATES.length - 1 ? 'border-naw-orange/50 bg-naw-orange/10 hover:border-naw-orange' : 'border-white/10 bg-naw-card hover:border-yellow-300/50'
                }`}
              >
                <span className="text-naw-orange text-sm font-bold">{when}</span>
                <span>
                  <span className="block text-white font-bold">{t}</span>
                  <span className="block text-white/60 text-sm mt-0.5">{d}</span>
                </span>
              </a>
            ))}
          </div>
        </Section>

        <Section id="research-question" n={3} title="Research Question page" big="Part 1 · due Thu Sep 17">
          <div className="flex flex-wrap gap-2">
            <Btn href={`${BASE}/research`} primary>Read the research notes first</Btn>
          </div>
          <Sheet tag="Topic" title="Topic and why it is interesting" ask={'Two blank lines under "This topic is interesting because."'}>
            <Think
              items={[
                'What were you doing the first time you thought "somebody should invent something for this"?',
                'What happens to crumbs at your house right now, and where do they end up?',
                'What do you want to find out that you do not know yet?',
              ]}
            />
          </Sheet>
          <Sheet tag="Know / Need to know" title="The two boxes" ask="Fill both. A long Need to know box shows you are actually researching.">
            <Think
              title="Know: what could you explain to a friend right now?"
              items={[
                'What do you already know about how robots move and steer?',
                'What do you know about light, and what happens when it hits something?',
                'What do you know about robot cleaners that already exist?',
              ]}
            />
            <Think
              tone="tip"
              title="Need to know: what would you have to find out before it works?"
              items={[
                'How does a robot notice something it cannot see with eyes?',
                'What could trick a sensor into being wrong?',
                'What happens if the robot goes faster? What happens if it goes slower?',
                'How will you know if it really picked the crumbs up?',
              ]}
            />
          </Sheet>
          <Sheet tag="Three questions" title="Write 3 strong research questions" ask="Not yes or no. Good ones start with How, What, or Which and have an answer you could measure.">
            <Box tone="tip" title="How to turn a yes or no question into a strong one">
              <p>Weak: &quot;Do plants need light?&quot; The answer is just yes.</p>
              <p>Strong: &quot;How does the number of hours of light change how tall a bean plant grows?&quot; Now there is something to change, something to measure, and a number at the end.</p>
            </Box>
            <Think
              title="Ask yourself for each of your three"
              items={[
                'What would I change in the test?',
                'What would I measure, and with what tool?',
                'Could the answer be a number?',
              ]}
            />
          </Sheet>
        </Section>

        <Section id="design-plan" n={4} title="Design Thinking Plan, page 23" big="Part 2 · due Thu Oct 1">
          <Sheet tag="Question 1" title="What will you invent and what is it called?">
            <Think
              items={[
                'If you had one sentence to tell a friend what it does, what would you say?',
                'Where does it work, and what does it do there?',
                'Why did you pick its name?',
              ]}
            />
          </Sheet>
          <Sheet tag="Box" title="How will you learn more about this topic?">
            <Think
              items={[
                'Where have you actually gotten information so far? Books, websites, people?',
                'Which one taught you the most?',
                'What can building and testing tell you that a book cannot?',
              ]}
            />
          </Sheet>
          <Sheet tag="Question 2" title="What does it do and what problem does it solve?">
            <Think
              items={[
                'What is the problem, in your own words?',
                'What do people do about it now, and what goes wrong with that?',
                'Why can’t a product that already exists fix it?',
              ]}
            />
          </Sheet>
          <Sheet tag="Question 3" title="How does it make life better or easier?">
            <Think
              items={[
                'Picture cleaning the table without your invention, then with it. Which steps disappear?',
                'Where do the crumbs end up each way?',
                'Who gets time back?',
              ]}
            />
          </Sheet>
          <Sheet tag="Question 4" title="Who would use this product?">
            <Think
              items={[
                'Think of three different places that have tables. Who uses each one?',
                'Who has a hard time reaching across a table or cleaning one?',
                'Who eats in the same place they work or play?',
              ]}
            />
          </Sheet>
          <Sheet tag="Question 5" title="Three describing words">
            <Think
              items={[
                'What three words would you want a judge to remember about it?',
                'For each word, which part of your design proves it?',
              ]}
            />
          </Sheet>
        </Section>

        <Section id="design-plan-24" n={5} title="Design Thinking Plan, page 24" big="Part 2 · due Thu Oct 1">
          <Sheet tag="Drawing" title="Drawing of the invention with detailed labels" ask="Labels are worth as much as the drawing.">
            <Think
              items={[
                'Which side view shows the most parts at once?',
                'Which parts sense? Which parts move? Which parts clean? Which part gives power?',
                'Can you point to every part on the real robot and say what it does? Label those.',
              ]}
            />
            <Btn href="/projects/nolan/dusty-files/dusty-components-3d-revA7.html" newTab>3D model to look at while you draw</Btn>
          </Sheet>
          <Sheet tag="Box" title="What is the size and weight?">
            <Think
              items={[
                'Measure it yourself with a ruler. How wide, how long, how tall?',
                'Weigh it on the kitchen scale.',
                'What everyday thing is about the same size, or the same weight?',
              ]}
            />
          </Sheet>
          <Sheet tag="Box" title="What is it made of?">
            <Think
              items={[
                'Go part by part from the bottom up. What is each one made of?',
                'Which parts did you print, and which parts did you buy?',
                'What is PLA plastic made from? Look it up.',
              ]}
            />
          </Sheet>
          <Sheet tag="Box" title="Cost per unit">
            <Think
              items={[
                'Look at the parts list. About how much did the parts for this one cost?',
                'Would a factory making thousands pay more or less for each one? Why?',
              ]}
            />
            <Btn href="/projects/nolan/dusty-parts-list.pdf" newTab>Parts list</Btn>
          </Sheet>
          <Sheet tag="Box" title="How will it operate?">
            <Think
              items={[
                'Explain it like recipe steps. What do you do first to turn it on?',
                'What does each button do?',
                'What is the robot checking while it drives, and what does it do at the edge?',
                'How do you get the crumbs out at the end?',
              ]}
            />
          </Sheet>
        </Section>

        <Section id="impact" n={6} title="Possible Impact on Society" big="Part 3 · due Thu Oct 8">
          <Card>
            <p className="text-white/70 text-sm">Eight lines. This is a &quot;what if everyone had one&quot; question, not a &quot;what does mine do&quot; question. Go wider than your own kitchen table.</p>
          </Card>
          {past(DUE.impact) ? (
            <Think
              items={[
                'If every house, restaurant and school cafeteria had one, what would change?',
                'What happens to bugs when there is less food on the floor?',
                'Who has trouble cleaning a table themselves, and how would this help them?',
                'Is there a downside? What would someone who does not like it say?',
              ]}
            />
          ) : (
            <Box
              title="Ideas worth using"
              items={[
                'Food on the floor brings ants and roaches. Less food on the floor means less bug spray in houses and restaurants.',
                'People who use a wheelchair or have trouble bending and reaching cannot clean the far side of a table. A robot can get there.',
                'Restaurants and school cafeterias clean hundreds of tables a day. Saving a minute each time adds up to hours.',
                'It shows that robots are useful for small boring jobs, not just big factory jobs.',
                'An honest downside: it costs money, and its lithium battery has to be recycled properly when it wears out. Naming a downside makes the rest of the answer more believable.',
              ]}
            />
          )}
        </Section>

        <Section id="catholic" n={7} title="Catholic Connection" big="Part 4 · due Thu Oct 15">
          <Card>
            <p className="text-white/70 text-sm">Either a saint your invention relates to and why, or how your invention is a spiritual or corporal work of mercy. The rubric wants a strong connection <b className="text-white">with an explanation</b>, not just a name.</p>
          </Card>
          {past(DUE.catholic) ? (
            <>
              <Think
                title="If you pick a saint"
                items={[
                  'Which saints are known for serving, cooking, cleaning, or using technology to help people?',
                  'Read about two of them. Which one’s life connects to what your invention does?',
                  'What is the connection, in one or two sentences of your own?',
                ]}
              />
              <Think
                tone="tip"
                title="If you pick a work of mercy"
                items={[
                  'Which corporal or spiritual work of mercy fits your invention best?',
                  'How does your invention help someone, even in a small way?',
                ]}
              />
            </>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-3">
                {SAINTS.map(([t, d]) => (
                  <Box key={t} tone="pick" title={t}><p>{d}</p></Box>
                ))}
              </div>
              <Box tone="tip" title="Or go the works of mercy route">
                <p>Feeding the hungry is a corporal work of mercy. The table is where a family gets fed. Keeping it clean is a small part of serving the people who eat there. Serving others without being asked and without getting credit is the idea to write about.</p>
              </Box>
            </>
          )}
        </Section>

        <Section id="resources" n={8} title="Research Resources" big="Due with the packet Mon Nov 16 · 10 points">
          <Card>
            <p className="text-white/70 text-sm">A bibliography with slots for <b className="text-white">two books</b> and <b className="text-white">three websites</b>. The books are the part that can go wrong, so get them from the library early.</p>
          </Card>
          <Sheet tag="Books × 2" title="What each book slot needs" ask="Author last name then first name, title, copyright date, publisher. All four, in cursive. The copyright date is on the back of the title page near the little © symbol.">
            <Box tone="tip" title="What to search for at the library">
              <p>Search the catalog for &quot;micro:bit&quot;, &quot;coding for kids&quot;, &quot;robotics for kids&quot;, and &quot;how robots work&quot;. Do not write down a book you did not open.</p>
            </Box>
          </Sheet>
          <Sheet tag="Websites × 3" title="What each website slot needs" ask="Author if there is one, article title, publication date, website name, and the full URL.">
            <Box tone="tip">
              <p>Use three websites you actually read. Find each field on the page yourself. If a page has no author, leave it blank. If there is no publication date, write the date you read it.</p>
            </Box>
            <Btn href={`${BASE}/research#bibliography`}>How to cite a website</Btn>
          </Sheet>
        </Section>

        <Section id="board" n={9} title="The trifold board" big="Due Mon Nov 16 · the layout must match exactly">
          <Card>
            <Board />
          </Card>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              ['Left panel', ['Purpose: why we need it, who it is for, how it helps people', 'Why', 'How does it work?']],
              ['Center panel', ['Invention name, big', 'The sketch, hand drawn, with labels']],
              ['Right panel', ['Impact on Society', 'Catholic Connection', 'Research Resources, the bibliography']],
            ].map(([t, list]) => (
              <Card key={t}>
                <div className="text-naw-cyan font-bold">{t}</div>
                <ol className="mt-2 space-y-1 list-decimal list-inside text-white/70 text-sm">
                  {list.map((x) => <li key={x}>{x}</li>)}
                </ol>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn href={BOARD} primary newTab>Board print-outs</Btn>
          </div>
        </Section>

        <Section id="rubric" n={10} title="The rubric, 100 points" big="Seven rows worth 10, and the prototype worth 30.">
          <div className="bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-left">
                  <th className="px-4 py-3 font-semibold">Criteria</th>
                  <th className="px-2 py-3 font-semibold">Pts</th>
                  <th className="px-4 py-3 font-semibold">Full points means</th>
                </tr>
              </thead>
              <tbody>
                {RUBRIC.map(([c, p, d]) => (
                  <tr key={c} className="border-t border-white/5 align-top">
                    <td className="px-4 py-2.5 text-white font-semibold">{c}</td>
                    <td className="px-2 py-2.5 text-naw-orange font-bold tabular-nums">{p}</td>
                    <td className="px-4 py-2.5 text-white/65">{d}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-white/30">
                  <td className="px-4 py-3 text-white font-bold">Total</td>
                  <td className="px-2 py-3 text-naw-orange font-bold tabular-nums">100</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <Box tone="warn" title="Where the easy points are">
            <p>Bibliography and Sketch are 20 points together and neither one depends on the robot working. Do them carefully and early. The prototype is 30 points, and a robot that drives and stops at the edge gets there even if the brush is not perfect yet.</p>
          </Box>
          <div className="flex flex-wrap gap-2">
            <Btn href={`${BASE}/research`} primary>Research notes</Btn>
            <Btn href={`${BASE}/invention`}>The invention and the experiment</Btn>
            <Btn href={`${BASE}/learn`}>Learn the science</Btn>
          </div>
        </Section>
      </div>
    </div>
  );
}

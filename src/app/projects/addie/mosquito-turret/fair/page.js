import { BASE, CAD, PLAN, meta, Nav, Back, Btn, Section, Title, Steps } from '../ui';
import { DUE, RUBRIC } from '../fair';
import DueDates from '../DueDates';
import RubricCheck from '../RubricCheck';

export const metadata = meta(
  'MS-2000: the science fair guide',
  "Addie's St. Rose 3rd grade science fair, part by part: the six due dates, what each part needs, the journal, the board, the judges' questions, and the rubric.",
  `${BASE}/fair`
);

const RUBRIC_NAME = Object.fromEntries(RUBRIC.map((r) => [r.id, r.title]));
const L = `${BASE}/learn`;

const RULES = [
  ['Six parts, six grades', 'Each part is graded on its own due date. The project also counts for a writing grade and a handwriting grade.'],
  ['The journal is cursive, by hand', 'Every journal page is handwritten in cursive. No typing, no printing.'],
  ['The board can be typed', 'Title, question, photos, data, graphs, and captions can be printed and glued on.'],
  ['Addie writes it', 'Research and writing happen in class. This page asks the questions; the answers are in Addie\u2019s own words.'],
  ['Experiments happen at home', 'The build, the runs, and the board are done at home.'],
  ['Laser rules first', 'Ask Miss Taggart about laser rules for the Parish Hall and the Archdiocesan fair before the board is made.'],
];

// Guide for each graded part, keyed by DUE id
const PARTS = {
  question: {
    what: 'A question the MS-2000 can answer by testing. A good test question names the thing you change and the thing you count.',
    ours: 'What makes the MS-2000 miss more: a faster, farther, or smaller mosquito?',
    ask: [
      ['What will I change on purpose?', 'For the MS-2000: how fast the mosquito swings, how far away it is, and how big the target is. One at a time.'],
      ['What will I count?', 'Hits in 30 seconds, and how long until the first hit.'],
      ['Can a test answer it?', 'If the answer comes from counting, yes.'],
      ['Why does it matter?', 'Real mosquitoes are small and fast. Finding what makes the MS-2000 miss shows what a real laser turret has to be good at.'],
    ],
    check: ['Written as a question with a question mark', 'Names what changes', 'Names what gets counted', 'In my own words'],
    links: [[`${L}#fair-test`, 'Fair test lesson'], [`${PLAN}#experiment`, 'The experiment plan']],
  },
  research: {
    what: 'Three to five research facts written as bullet points, a list of the two or three places they came from, and a Catholic connection.',
    ask: [
      ['What do mosquitoes do that makes them dangerous?', 'Mosquitoes lesson'],
      ['Has anyone built a laser that zaps mosquitoes?', 'The real laser fence lesson'],
      ['How much laser power would it take to kill one?', 'The 14,000 times fact'],
      ['How does a camera find an object?', 'How a camera learns lesson'],
      ['How does a pendulum make speed?', 'Pendulum lesson'],
    ],
    check: ['3 to 5 bullets, each one fact', 'Each fact in my own words', '2 or 3 sources, written the same way', 'Catholic connection in 2 or 3 sentences'],
    links: [[L, 'Learn the science'], [`${PLAN}#lethal`, 'The lethality math']],
  },
  hypothesis: {
    what: 'The best guess about the answer, written before any test runs, with a reason. Write one for each test.',
    frame: 'If the mosquito ______, then the MS-2000 will get ______ hits, because ______.',
    ask: [
      ['Speed', 'If it swings faster, more hits, fewer, or the same? Why?'],
      ['Distance', 'If it is farther away, more hits, fewer, or the same? Why?'],
      ['Size', 'If the target is smaller, more hits, fewer, or the same? Why? (Hint: the laser dot does not always land dead center.)'],
      ['Biggest miss', 'Which of the three will make it miss the most? Why?'],
    ],
    check: ['Written before the first real run', 'Has if, then, and because', 'One for each test', 'Uses the variable words'],
    links: [[`${L}#fair-test`, 'Variables lesson'], [`${L}#sensor`, 'How a hit is felt']],
  },
  experiments: {
    what: 'All 45 runs done and written down. Three tests, three settings each, five runs each, 30 seconds a run.',
    ask: [
      ['Set up', 'Backdrop up, tape measure from the camera lens to the mosquito, the right target cover on, room lights on, fresh batteries in both.'],
      ['Label the run', 'Set the wand to the test, the setting, and the run number.'],
      ['Arm', 'A grown-up turns the arm switch on.'],
      ['Release', 'Pull the mosquito back to the angle mark, let go, and start the 30 seconds.'],
      ['Record', 'The wand saves it. Also write hits and time to first hit on the paper sheet.'],
      ['Reset', 'Arm switch off. Next run. Five per setting.'],
    ],
    check: ['Every run counts; redo only broken runs, with a note', 'One test per day', 'Same room, same person holding the line', 'Photo of each setup', 'Journal entry every test day'],
    links: [[`${PLAN}#experiment`, 'The experiment rules'], [`${BASE}/build`, 'Build it']],
  },
  results: {
    what: 'Turn the 45 runs into averages and graphs, then say what they mean.',
    frame: 'My hypothesis was (supported / not supported). The data showed ______. The biggest surprise was ______. Next time I would ______.',
    ask: [
      ['Averages', 'For each setting, add the 5 runs and divide by 5.'],
      ['Graphs', 'One bar graph per test. One bar per setting. Label both sides and give it a title.'],
      ['Compare', 'Which setting had the most hits? The fewest? Was the difference big or tiny?'],
      ['Answer', 'Which test dropped the hits the most? That is the biggest reason the MS-2000 misses.'],
      ['Connect', 'Does the answer match the research? Why might it miss more in some settings?'],
    ],
    check: ['A table of all 45 runs', '3 averages per test', '3 bar graphs with titles and labels', 'Conclusion answers the question', 'Uses numbers from the data'],
    links: [[`${L}#fair-test`, 'How to average'], ['https://microbit.org/get-started/user-guide/data-logging/', 'Open the MY_DATA file']],
  },
  final: {
    what: 'The trifold board, the finished journal, and the MS-2000. Then the exhibition on Wednesday, February 3.',
    ask: [
      ['Left panel', 'Engineering goal, science question, research bullets, hypothesis, variables.'],
      ['Middle panel', 'Title, a big photo of the MS-2000, how it works, and the three graphs.'],
      ['Right panel', 'Materials, procedure steps, results, conclusion, Catholic connection, sources.'],
      ['On the table', 'The MS-2000, the mosquito on its line, the journal, and a laser safety sign.'],
    ],
    check: ['Big title you can read from across the room', 'Every graph has a title and labels', 'Photos have captions', 'Laser label showing', 'Practice the 30-second demo'],
    links: [[`${PLAN}#demo`, 'The demo script'], [`${CAD}/ms2000-3d.html`, '3D model for the drawing']],
  },
};

const VARIABLES = [
  ['Speed', 'Swing angle: 10, 20, 30 degrees', 'Hits in 30 s, time to first hit', '5 feet away, 40 mm target, room lights on'],
  ['Distance', '3, 5, 7 feet away', 'Hits in 30 s, time to first hit', '10 degree swing, 40 mm target, room lights on'],
  ['Target size', 'Hole in the black cover: 40, 20, 10 mm', 'Hits in 30 s, time to first hit', '10 degree swing, 5 feet away, room lights on'],
];

const CATHOLIC = [
  ['Caring for people', 'Visiting the sick is a work of mercy. Mosquitoes spread malaria, which makes millions of people sick each year. Inventions that stop mosquitoes protect people.'],
  ['Caring for creation', 'In Genesis, God puts people in the garden to take care of it. In Laudato Si\u2019, Pope Francis asks us to care for our common home. A laser that aims only at one kind of pest is gentler than spraying poison everywhere.'],
  ['Saints who cared for the sick', 'St. Damien of Molokai cared for people with leprosy. St. Roch is the patron saint against plagues and sickness.'],
  ['Faith and science', 'God made a world we can study. Catholic scientists like Gregor Mendel, a monk who discovered how traits pass from parents to children, used science to understand creation.'],
];

const SOURCES = [
  ['American Mosquito Control Association. "Mosquito FAQs." mosquito.org.', 'https://www.mosquito.org/faqs/'],
  ['World Health Organization. "Malaria" fact sheet. who.int.', 'https://www.who.int/news-room/fact-sheets/detail/malaria'],
  ['Keller, M. and others. "Optical tracking and laser-induced mortality of insects during flight." Scientific Reports, 2020.', 'https://www.nature.com/articles/s41598-020-71824-y'],
  ['DFRobot. "HuskyLens object tracking with micro:bit." learn.dfrobot.com.', 'https://learn.dfrobot.com/makelog-308707.html'],
  ['Pope Francis. Laudato Si\u2019. Vatican, 2015.', 'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html'],
];

const JOURNAL_ENTRY = [
  ['The date', 'Top of every page.'],
  ['What I did today', 'One or two sentences.'],
  ['What I saw', 'Observations. What worked, what did not.'],
  ['Numbers', 'Anything measured or counted.'],
  ['Problems and fixes', 'Judges like these. Something broke? Say how it got fixed.'],
  ['Next time', 'What comes next.'],
];

const CATCH_UP = [
  ['Sep 15', 'Brainstorm: air cannon, vacuum, lasers. The requirements list. Why I picked Design A over B and C.'],
  ['Sep 16', 'Design locked. The labeled drawing of the MS-2000. The 3D printed parts were designed.'],
  ['When the parts arrive', 'Unboxing, measuring, what matched and what did not.'],
  ['Every build day', 'What got printed or wired, and what went wrong.'],
];

const JUDGES = [
  'What does the MS-2000 do?',
  'Why did you use such a weak laser?',
  'How does the camera know which thing is the mosquito?',
  'How do you know it really hit?',
  'What did you change, what did you measure, and what did you keep the same?',
  'Why did you do five runs for each setting?',
  'What surprised you?',
  'What went wrong while you were building it?',
  'What would you change next time?',
  'How could this help people?',
];

function Guide({ d, i }) {
  const g = PARTS[d.id];
  return (
    <section id={d.id} className="mt-10 scroll-mt-16">
      <div className="flex items-baseline gap-3">
        <span className="flex-none w-10 h-10 rounded-xl bg-naw-orange text-naw-dark font-bold text-lg flex items-center justify-center">{i + 1}</span>
        <div>
          <h3 className="text-white text-xl font-bold">{d.title}</h3>
          <p className="text-naw-orange text-sm font-semibold">Due {d.label}</p>
        </div>
      </div>
      <div className="mt-4 bg-naw-card rounded-2xl border border-white/10 p-5">
        <p className="text-white/85 text-[15px] leading-relaxed">{g.what}</p>
        {g.ours && (
          <div className="mt-4 rounded-xl border border-naw-cyan/30 bg-naw-cyan/10 p-3">
            <div className="text-naw-cyan text-xs font-semibold">The question the MS-2000 was built to test</div>
            <div className="text-white font-semibold mt-0.5">{g.ours}</div>
            <div className="text-white/50 text-xs mt-1">Addie writes it her way.</div>
          </div>
        )}
        {g.frame && (
          <div className="mt-4 rounded-xl border border-lime-300/30 bg-lime-300/10 p-3">
            <div className="text-lime-300 text-xs font-semibold">Fill in the blanks</div>
            <div className="text-white text-sm mt-0.5">{g.frame}</div>
          </div>
        )}
        <div className="grid md:grid-cols-[1fr_16rem] gap-6 mt-5 [&>*]:min-w-0">
          <div>
            <div className="text-white/50 text-xs font-semibold">{d.id === 'experiments' || d.id === 'final' ? 'Steps' : 'Questions to answer'}</div>
            {d.id === 'experiments' ? <Steps items={g.ask} /> : (
              <div className="space-y-2 mt-2">
                {g.ask.map(([q, a]) => (
                  <div key={q} className="text-sm">
                    <span className="text-white font-semibold">{q} </span>
                    <span className="text-white/55">{a}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="text-white/50 text-xs font-semibold">Before turning it in</div>
            <ul className="mt-2 space-y-1.5">
              {g.check.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-white/75">
                  <span className="flex-none w-4 h-4 mt-0.5 rounded border border-white/30" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {g.links.map(([h, l]) => <Btn key={h} href={h} small>{l}</Btn>)}
          <span className="text-white/40 text-xs">Rubric: {d.rubric.map((r) => RUBRIC_NAME[r]).join(' · ')}</span>
        </div>
      </div>
    </section>
  );
}

export default function FairPage() {
  return (
    <div className="min-h-screen">
      <Nav current="fair" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-orange/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-8">
          <Back href={BASE}>MS-2000</Back>
          <div className="mt-6">
            <Title size="text-2xl sm:text-3xl">FAIR GUIDE</Title>
          </div>
          <p className="text-white text-lg font-semibold mt-4 leading-snug">
            St. Rose Elementary Science Fair, 3rd grade. Six parts, six due dates, and a 45-point rubric.
          </p>
          <p className="text-white/55 text-sm mt-2">
            Final project due Monday, February 1. Exhibition Wednesday, February 3 at 2:00 PM in the Parish Hall. Winners go to
            the Archdiocesan fair on February 25.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2">
            {[['dates', 'Due dates'], ['rules', 'Rules'], ['parts', 'Part by part'], ['variables', 'Variables'], ['catholic', 'Catholic connection'], ['sources', 'Sources'], ['journal', 'Journal'], ['judges', 'Judges'], ['rubric', 'Rubric']].map(([id, t]) => (
              <a key={id} href={`#${id}`} className="bg-naw-card border border-white/10 hover:border-naw-orange/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">{t}</a>
            ))}
          </nav>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section id="dates" title="Due dates" sub="The orange one is next.">
          <DueDates />
        </Section>

        <Section id="rules" title="Rules to remember">
          <div className="grid sm:grid-cols-2 gap-3">
            {RULES.map(([t, d]) => (
              <div key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/55 text-sm mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="parts" title="Part by part" sub="What each part needs, questions to answer, and a checklist before turning it in.">
          {DUE.map((d, i) => <Guide key={d.id} d={d} i={i} />)}
        </Section>

        <Section id="variables" title="The variables" sub="Change one thing, count the same things, keep the rest the same.">
          <div className="bg-naw-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[36rem]">
              <thead>
                <tr className="text-left text-white/50 text-xs">
                  <th className="p-3">Test</th>
                  <th className="p-3">What I change</th>
                  <th className="p-3">What I count</th>
                  <th className="p-3">What stays the same</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {VARIABLES.map(([t, c, m, k]) => (
                  <tr key={t}>
                    <td className="p-3 text-white font-semibold">{t}</td>
                    <td className="p-3 text-naw-pink">{c}</td>
                    <td className="p-3 text-naw-cyan">{m}</td>
                    <td className="p-3 text-white/60">{k}. Same room, same batteries, same person on the line.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-xs mt-2">5 runs × 3 settings × 3 tests = 45 runs, 30 seconds each.</p>
        </Section>

        <Section id="catholic" title="Catholic connection ideas" sub="Pick one and explain it in two or three sentences, in your own words. Part of the Dec 2 grade.">
          <div className="grid sm:grid-cols-2 gap-3">
            {CATHOLIC.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-naw-purple/40 bg-naw-purple/10 p-4">
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/65 text-sm mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="sources" title="Sources for the bibliography" sub="Pick two or three that the research bullets came from. Write each one the same way: who, title, where, year.">
          <div className="bg-naw-card rounded-2xl border border-white/10 divide-y divide-white/5">
            {SOURCES.map(([t, u]) => (
              <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm text-white/75 hover:text-white hover:bg-white/5 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </Section>

        <Section id="journal" title="The journal" sub="Handwritten in cursive. It is graded on its own and counts for handwriting. Write in it every day you work on the project.">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
              <div className="text-white font-bold">Every entry has</div>
              <div className="mt-3 space-y-2">
                {JOURNAL_ENTRY.map(([t, d]) => (
                  <div key={t} className="text-sm"><span className="text-lime-300 font-semibold">{t}. </span><span className="text-white/60">{d}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-5">
              <div className="text-white font-bold">Entries to write</div>
              <div className="mt-3 space-y-2">
                {CATCH_UP.map(([t, d]) => (
                  <div key={t} className="text-sm"><span className="text-naw-orange font-semibold">{t}. </span><span className="text-white/60">{d}</span></div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="judges" title="Practice for the judges" sub="The oral presentation is graded. Practice these out loud with the family.">
          <ol className="grid sm:grid-cols-2 gap-2">
            {JUDGES.map((q, i) => (
              <li key={q} className="bg-naw-card rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80">
                <span className="text-naw-pink font-bold mr-2">{i + 1}</span>{q}
              </li>
            ))}
          </ol>
        </Section>

        <Section id="rubric" title="Score it yourself" sub="The rubric the judges use. Tap a score for each row to see where the project stands. Nothing is saved.">
          <RubricCheck />
        </Section>
      </div>
    </div>
  );
}

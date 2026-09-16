import Link from 'next/link';
import { Nav } from './ui';
import DueDates from './DueDates';

const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
const TITLE = "Dusty: Nolan's Invention Convention project";
const DESC =
  'A palm-sized robot that sweeps crumbs and stops at the table edge. Due dates, packet help, research, the trifold board, and how to build Dusty.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://nawgames.com/projects/nolan/dusty',
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

const P = '/projects/nolan';

const RULES = [
  ['Cursive, by hand', 'Everything in the packet is handwritten in cursive. No typing.'],
  ['Five separate grades', 'Each part is graded on its own due date. Late means a zero for that part.'],
  ['The board can be typed', 'Board text can be printed. Only the sketch has to be drawn by hand.'],
  ['Working is a bonus', 'Dusty has to show the idea. A robot that really works earns extra.'],
];

const PAGES = [
  {
    href: '/projects/nolan/dusty/packet',
    title: 'Packet guide',
    text: 'Every page of the packet in order, with what to write, the rubric, and the board layout.',
  },
  {
    href: '/projects/nolan/dusty/research',
    title: 'Research notes',
    text: 'Six topics with real sources: the Roomba story, cliff sensors, dark surfaces, and more.',
  },
  {
    href: '/projects/nolan/dusty/invention',
    title: 'The invention and the experiment',
    text: 'The problem Dusty solves, how it works, and the speed test for the science part.',
  },
  {
    href: '/projects/nolan/dusty/learn',
    title: 'Learn the science',
    text: 'Every piece of Dusty explained: the micro:bit, motors, infrared, calibration, gears, power, 3D printing, and the fair test.',
  },
  {
    href: '/projects/nolan/dusty/changes',
    title: 'Changes and lessons',
    text: 'How engineers change a plan safely, the power bank change, the project history, and lessons for next time.',
  },
  {
    href: `${P}/board-prints.html`,
    title: 'Board print-outs',
    text: 'Big section titles to print and glue on the trifold.',
  },
];

export default function DustyPage() {
  return (
    <div className="min-h-screen">
      <Nav current="overview" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-cyan/15 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-10">
          <Link href="/projects/nolan" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Nolan&apos;s Projects
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="bg-naw-cyan/20 text-naw-cyan text-xs font-semibold px-2 py-0.5 rounded-full">Invention Convention</span>
              <span className="bg-naw-orange/20 text-naw-orange text-xs font-semibold px-2 py-0.5 rounded-full">4th grade science</span>
            </div>
            <h1 className="font-game text-3xl sm:text-4xl glow mt-4">
              <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">DUSTY</span>
            </h1>
            <p className="text-white text-lg sm:text-xl font-semibold mt-4 leading-snug">
              My invention: a small robot that sweeps crumbs off the table and stops itself at the edge instead of falling off.
            </p>
            <div className="mt-5 rounded-2xl border border-naw-cyan/30 bg-naw-cyan/10 p-4">
              <div className="text-naw-cyan text-xs font-semibold">The big question for the whole project</div>
              <div className="text-white font-semibold mt-1">How can a real-world problem be changed by an invention you create?</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <section className="mt-10">
          <h2 className="text-white text-xl sm:text-2xl font-bold">Due dates</h2>
          <p className="text-white/50 text-sm mt-1">Five parts, five grades. The orange one is next.</p>
          <div className="mt-5">
            <DueDates />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-white text-xl sm:text-2xl font-bold">Rules to remember</h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {RULES.map(([t, d]) => (
              <div key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4">
                <div className="text-white font-bold">{t}</div>
                <div className="text-white/55 text-sm mt-1">{d}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-white text-xl sm:text-2xl font-bold">Project pages</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            {PAGES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                {...(s.href.endsWith('.html') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group bg-naw-card rounded-2xl border border-naw-cyan/20 p-5 hover:border-naw-cyan/40 transition-colors"
              >
                <h3 className="text-white font-bold text-lg group-hover:text-naw-cyan transition-colors">{s.title}</h3>
                <p className="text-white/55 text-sm mt-1">{s.text}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-white text-xl sm:text-2xl font-bold">The robot</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <Link
              href="/projects/nolan/dusty/build"
              className="group bg-naw-card rounded-2xl border border-naw-orange/30 overflow-hidden hover:border-naw-orange/60 transition-colors"
            >
              <img src={`${P}/dusty-hero.png`} alt="3D model of Dusty" className="w-full h-44 object-cover bg-[#0d1b2e]" />
              <div className="p-5">
                <h3 className="text-white font-bold text-lg group-hover:text-naw-orange transition-colors">Build Dusty</h3>
                <p className="text-white/55 text-sm mt-1">
                  The parts to buy, the 3D printed chassis, and the step-by-step build. Due with the board on Nov 16.
                </p>
              </div>
            </Link>
            <a
              href={`${P}/dusty-files/dusty-components-3d.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-naw-card rounded-2xl border border-naw-cyan/20 p-5 hover:border-naw-cyan/40 transition-colors flex flex-col justify-center"
            >
              <h3 className="text-white font-bold text-lg group-hover:text-naw-cyan transition-colors">See Dusty in 3D</h3>
              <p className="text-white/55 text-sm mt-1">
                Spin the robot, tap any part to see its size, and use it to draw the labeled sketch for page 24.
              </p>
              <span className="mt-4 text-naw-cyan text-sm font-semibold">Open the 3D model</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

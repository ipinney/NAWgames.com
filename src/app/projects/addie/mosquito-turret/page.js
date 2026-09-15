import Link from 'next/link';

const TITLE = "MS-2000 Mosquito Shooter: Addie's science fair project";
const DESC =
  'A trainable laser turret with sound effects that tracks a fake mosquito on a fishing line, proves every hit, and records its own data. Spring 2027 science fair.';

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://nawgames.com/projects/addie/mosquito-turret',
    siteName: 'NAW Games',
    type: 'website',
  },
  twitter: { card: 'summary', title: TITLE, description: DESC },
};

const PLAN = '/projects/addie/mosquito-turret.html';

// status: done | now | next
const PHASES = [
  { title: 'Brainstorm', when: 'Done Sep 15', status: 'done', text: 'Air cannon, vacuum, and light beam ideas. The family picked lasers.', link: `${PLAN}#brainstorm` },
  { title: 'Requirements', when: 'Done Sep 15', status: 'done', text: 'Laser, sound effects, trainable fishing-line mosquito, proven hits, self-recorded data, and the name: MS-2000.', link: `${PLAN}#requirements` },
  { title: 'Pick a design', when: 'Done Sep 15', status: 'done', text: 'Addie picked Design A, the Pan and Tilt Camera Turret.', link: `${PLAN}#pick` },
  { title: 'Lock in the design', when: 'Late September', status: 'now', text: 'Write why Design A, draw the MS-2000 by hand with labels, and ask the teacher about laser rules.', link: `${PLAN}#design` },
  { title: 'Parts list and order', when: 'Early October', status: 'next', text: 'Final list with a backup for every part, then order.', link: `${PLAN}#parts` },
  { title: 'Build', when: 'October to November', status: 'next', text: 'Mosquito and wand first, then the pan and tilt head and camera training, then the flight zone, then the code and sound effects.', link: `${PLAN}#prints` },
  { title: 'Practice runs and fixes', when: 'December', status: 'next', text: 'Make sure the data saves correctly and the MS-2000 hits reliably.' },
  { title: 'Experiments and data', when: 'January to February', status: 'next', text: 'Speed, distance, and light tests. 45 runs recorded by the MS-2000, averages, and graphs.', link: `${PLAN}#experiment` },
  { title: 'Board and practice', when: 'March', status: 'next', text: 'The trifold board and the 30-second demo, ready for any spring fair date.', link: `${PLAN}#demo` },
];

const DOT = {
  done: 'bg-naw-green border-naw-green',
  now: 'bg-naw-pink border-naw-pink',
  next: 'bg-naw-dark border-white/30',
};

export default function MosquitoTurretPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-pink/15 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-10">
          <Link href="/projects/addie" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Addie&apos;s Projects
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="bg-naw-pink/20 text-naw-pink text-xs font-semibold px-2 py-0.5 rounded-full">Science Fair</span>
              <span className="bg-naw-orange/20 text-naw-orange text-xs font-semibold px-2 py-0.5 rounded-full">3rd grade</span>
              <span className="bg-naw-cyan/20 text-naw-cyan text-xs font-semibold px-2 py-0.5 rounded-full">Spring 2027</span>
            </div>
            <h1 className="font-game text-3xl sm:text-4xl glow mt-4">
              <span className="bg-gradient-to-r from-naw-pink to-naw-green bg-clip-text text-transparent">MS-2000</span>
            </h1>
            <p className="text-white text-lg sm:text-xl font-semibold mt-4 leading-snug">
              The Mosquito Shooter. A laser turret that learns a fake mosquito, follows it on a fishing line, and tags it with a pew or a boom. The mosquito's eyes flash, and every hit is saved as data.
            </p>
            <div className="mt-5 rounded-2xl border border-naw-green/30 bg-naw-green/10 p-4">
              <div className="text-naw-green text-xs font-semibold">The big idea</div>
              <div className="text-white font-semibold mt-1">
                Scientists built the Photonic Fence, a turret that shoots mosquitoes with lasers. Killing one takes about 14 watts. This safe version uses a 0.001 watt Class 2 laser, 14,000 times weaker, and proves every hit with a sensor inside the mosquito.
              </div>
            </div>
            <a
              href={PLAN}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center bg-naw-pink text-naw-dark px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-naw-pink/90 transition-colors"
            >
              Open the full plan
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <section className="mt-10">
          <h2 className="text-white text-xl sm:text-2xl font-bold">The steps</h2>
          <p className="text-white/50 text-sm mt-1">One at a time. The pink one is where we are. The fair is in spring 2027.</p>
          <ol className="relative border-l-2 border-white/10 ml-3 space-y-4 mt-5">
            {PHASES.map((p, i) => (
              <li key={p.title} className="pl-6 relative">
                <span className={`absolute -left-[9px] top-5 w-4 h-4 rounded-full border-2 ${DOT[p.status]}`} />
                <div
                  className={`rounded-2xl border p-4 sm:p-5 ${
                    p.status === 'now' ? 'bg-naw-pink/10 border-naw-pink/50' : 'bg-naw-card border-white/10'
                  } ${p.status === 'done' ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white/60 text-sm font-semibold">Step {i + 1} · {p.when}</span>
                    {p.status === 'now' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-pink text-naw-dark">Now</span>
                    )}
                    {p.status === 'done' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-green/20 text-naw-green">Done</span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg mt-1">{p.title}</h3>
                  <p className="text-white/60 text-sm mt-1">{p.text}</p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-naw-cyan/25 transition-colors"
                    >
                      Open in the plan
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

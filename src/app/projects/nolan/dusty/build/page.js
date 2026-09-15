import Link from 'next/link';

const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
const TITLE = 'Build Dusty: print files, parts and 3D models';
const DESC =
  "Nolan's invention project. A palm-sized robot that sweeps crumbs and stops at the table edge. 3D print files, parts list, step-by-step build guide, and 3D viewers.";

export const metadata = {
  title: `${TITLE} | NAW Games`,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://nawgames.com/projects/nolan/dusty/build',
    siteName: 'NAW Games',
    images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

const F = '/projects/nolan/dusty-files';
const P = '/projects/nolan';

const STEPS = [
  {
    title: 'Get the parts',
    text: 'A micro:bit, a motor board, three small motors, wheels, two cliff sensors, switches, a battery pack, M2 screws, and a little soldering. The list has links and prices.',
    action: { href: `${P}/dusty-parts-list.pdf`, label: 'Parts list (PDF)' },
  },
  {
    title: 'Print the chassis',
    text: '19 pieces, about 55 g of PLA. Everything fits on one 220 mm print bed with no supports.',
    action: { href: `${F}/dusty-chassis-revA-stl.zip`, label: 'All print files (ZIP)', download: true },
  },
  {
    title: 'Put it together',
    text: 'Eleven steps with drawings: print order, where every M2 screw goes, how the brush gears slow the motor down, and teaching Dusty where the table ends.',
    action: { href: `${P}/dusty-build-guide.html`, label: 'Build guide' },
  },
];

const VIEWERS = [
  {
    title: 'Every part',
    text: 'All 26 parts, printed and bought. Tap one to see it by itself with its size, or in place on the robot.',
    open: `${F}/dusty-components-3d.html`,
    file: 'dusty-components-3d.html',
  },
  {
    title: 'Whole robot',
    text: 'The full assembly with measurements. Hide the bought parts to see just the printed ones.',
    open: `${F}/dusty-chassis-3d.html`,
    file: 'dusty-chassis-3d.html',
  },
  {
    title: 'Dustpan (foam board version)',
    text: 'The crumb tray for the first, foam board Dusty. The printed chassis has its own slide-out tray.',
    open: `${P}/dusty-dustpan.html`,
    file: 'dusty-dustpan.html',
    stl: `${P}/dusty-dustpan-revA.stl`,
  },
];

// size in mm (as printed), grams of PLA each at normal infill
const PARTS = [
  ['base', 'Base plate', 1, '85 × 122 × 28', '28', 'Top face down'],
  ['deck', 'Electronics deck', 1, '79 × 77 × 6', '10', ''],
  ['post', 'Deck post', 4, '6 × 6 × 25', '0.4', 'Peg up'],
  ['cradle', 'Brush motor cradle', 1, '29 × 26 × 17', '1.6', ''],
  ['dowel', 'Cradle dowel', 2, '3 × 3 × 3', '<0.1', ''],
  ['tray', 'Crumb tray', 1, '57 × 42 × 20', '2.4', ''],
  ['roller', 'Brush roller', 1, '14 × 14 × 52', '5.4', 'Standing up'],
  ['axle', 'Roller axle', 1, '75 × 4 × 4', '0.7', 'Flat side down'],
  ['collar', 'Axle collar', 1, '8 × 8 × 3', '0.1', ''],
  ['pinion', 'Motor pinion (12 teeth)', 1, '11 × 11 × 3', '0.1', ''],
  ['compound_gear', 'Compound gear (36 + 10)', 1, '30 × 30 × 8', '1.5', 'Big gear down'],
  ['roller_gear', 'Roller gear (18 teeth)', 1, '25 × 25 × 4', '1.2', ''],
  ['washer', 'Gear washer', 1, '8 × 8 × 1', '0.1', ''],
  ['sensor_carrier_R', 'Right sensor arm', 1, '17 × 10 × 27', '0.6', ''],
  ['sensor_carrier_L', 'Left sensor arm (whisker)', 1, '19 × 12 × 27', '1.0', ''],
];


function Btn({ href, children, download, primary }) {
  const cls = primary
    ? 'bg-naw-orange text-naw-dark hover:bg-naw-orange/90'
    : 'bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25';
  return (
    <a
      href={href}
      {...(download ? { download: typeof download === 'string' ? download : '' } : { target: '_blank', rel: 'noopener noreferrer' })}
      className={`${cls} inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors`}
    >
      {children}
    </a>
  );
}

function Section({ title, sub, children }) {
  return (
    <section className="mt-12">
      <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
      {sub && <p className="text-white/50 text-sm mt-1 max-w-2xl">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function DustyBuildPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-orange/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-10">
          <Link href="/projects/nolan/dusty" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dusty
          </Link>
          <div className="grid md:grid-cols-2 gap-6 items-center mt-6">
            <div>
              <h1 className="font-game text-2xl sm:text-3xl glow">
                <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">BUILD DUSTY</span>
              </h1>
              <p className="text-white text-lg font-semibold mt-4 leading-snug">
                Everything to build the robot: the parts to buy, the 3D printed chassis, and the steps to put it together.
              </p>
              <p className="text-white/55 text-sm mt-3 leading-relaxed">
                A micro:bit reads two infrared cliff sensors and a whisker switch. A geared brush sweeps crumbs into a
                slide-out tray. The chassis is printed in PLA on a home 3D printer.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <Btn href={`${F}/dusty-components-3d.html`} primary>Explore in 3D</Btn>
                <Btn href={`${F}/dusty-chassis-revA-stl.zip`} download>Download print files</Btn>
              </div>
            </div>
            <a href={`${F}/dusty-chassis-3d.html`} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-white/10 bg-[#0d1b2e]">
              <img src={`${P}/dusty-hero.png`} alt="3D model of the Dusty chassis" width={720} height={630} className="w-full h-auto" />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="Three steps" sub="A grown-up helps with the printer and the small screws.">
          <ol className="grid md:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="bg-naw-card rounded-2xl border border-naw-cyan/20 p-5 flex flex-col">
                <span className="w-8 h-8 rounded-full bg-naw-orange text-naw-dark font-bold flex items-center justify-center">{i + 1}</span>
                <h3 className="text-white font-bold text-lg mt-3">{s.title}</h3>
                <p className="text-white/55 text-sm mt-1 flex-1">{s.text}</p>
                <div className="mt-4">
                  <Btn href={s.action.href} download={s.action.download}>{s.action.label}</Btn>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="3D models" sub="Spin them with a finger or mouse. Download the file to keep a copy; it opens in any web browser with an internet connection.">
          <div className="grid md:grid-cols-3 gap-4">
            {VIEWERS.map((v) => (
              <div key={v.title} className="bg-naw-card rounded-2xl border border-naw-cyan/20 p-5 flex flex-col">
                <h3 className="text-white font-bold text-lg">{v.title}</h3>
                <p className="text-white/55 text-sm mt-1 flex-1">{v.text}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Btn href={v.open} primary>Open</Btn>
                  <Btn href={v.open} download={v.file}>Download</Btn>
                  {v.stl && <Btn href={v.stl} download>STL</Btn>}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Print files"
          sub="PLA, 0.4 mm nozzle, 0.2 mm layers, no supports. Sizes are in millimeters as the part sits on the print bed."
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <Btn href={`${F}/dusty-chassis-revA-stl.zip`} download primary>All parts (ZIP)</Btn>
            <Btn href={`${F}/dusty-chassis-all-parts-plate.stl`} download>Whole plate, one STL</Btn>
            <Btn href={`${F}/dusty-3d-source.zip`} download>Design source (Python)</Btn>
          </div>
          <div className="bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/45 text-left">
                  <th className="px-4 py-3 font-semibold">Part</th>
                  <th className="px-2 py-3 font-semibold">Qty</th>
                  <th className="hidden sm:table-cell px-2 py-3 font-semibold whitespace-nowrap">Size (mm)</th>
                  <th className="hidden sm:table-cell px-2 py-3 font-semibold">g each</th>
                  <th className="hidden sm:table-cell px-2 py-3 font-semibold">Print</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {PARTS.map(([file, name, qty, size, g, note]) => (
                  <tr key={file} className="border-t border-white/5 align-top">
                    <td className="px-4 py-2.5">
                      <div className="text-white font-medium">{name}</div>
                      <div className="sm:hidden text-white/50 text-xs mt-0.5 tabular-nums">
                        {size} mm, {g} g{note ? `, ${note.toLowerCase()}` : ''}
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-white/70 tabular-nums">{qty}</td>
                    <td className="hidden sm:table-cell px-2 py-2.5 text-white/70 tabular-nums whitespace-nowrap">{size}</td>
                    <td className="hidden sm:table-cell px-2 py-2.5 text-white/70 tabular-nums">{g}</td>
                    <td className="hidden sm:table-cell px-2 py-2.5 text-white/50">{note}</td>
                    <td className="px-4 py-2.5 text-right">
                      <a href={`${F}/dusty-${file}.stl`} download className="text-naw-cyan font-semibold hover:underline whitespace-nowrap">
                        STL
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-xs mt-3">
            Also needed and not printed: M2 screws and nuts, female jumper wires, pipe cleaners, a KCD11 mini rocker switch, a 5.5 × 2.1 mm Y splitter and screw-terminal jack, hook-and-loop tape, and small zip ties.
          </p>
        </Section>

      </div>
    </div>
  );
}

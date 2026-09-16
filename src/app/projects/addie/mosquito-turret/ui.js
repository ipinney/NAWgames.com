import Link from 'next/link';

export const BASE = '/projects/addie/mosquito-turret';
export const A = '/projects/addie';
export const CAD = '/projects/addie/ms2000-cad';
export const PLAN = '/projects/addie/mosquito-turret.html';
export const PARTS_PDF = '/projects/addie/ms2000-parts-list.pdf';
export const OG = 'https://nawgames.com/projects/addie/ms2000-og.png';

export function meta(title, desc, path) {
  return {
    title: `${title} | NAW Games`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://nawgames.com${path}`,
      siteName: 'NAW Games',
      images: [{ url: OG, width: 1200, height: 630, alt: 'The MS-2000 Mosquito Shooter, a 3D printed laser turret' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [OG] },
  };
}

const TABS = [
  ['overview', 'Overview', BASE],
  ['build', 'Build', `${BASE}/build`],
  ['print', 'Print plan', `${BASE}/build/batches`],
  ['learn', 'Learn the science', `${BASE}/learn`],
];

export function Nav({ current }) {
  return (
    <nav className="bg-naw-card/60 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        <Link href={BASE} className="font-game text-[10px] text-naw-pink pr-3 py-3 whitespace-nowrap">MS-2000</Link>
        {TABS.map(([k, label, href]) => (
          <Link
            key={k}
            href={href}
            className={`px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              k === current ? 'border-naw-pink text-white' : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Back({ href, children }) {
  return (
    <Link href={href} className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}

export function Btn({ href, children, primary, download, small }) {
  const cls = primary
    ? 'bg-naw-pink text-naw-dark hover:bg-naw-pink/90'
    : 'bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25';
  const size = small ? 'px-3 py-1.5' : 'px-3.5 py-2';
  if (href.startsWith(BASE)) {
    return (
      <Link href={href} className={`${cls} ${size} inline-flex items-center rounded-lg text-sm font-semibold transition-colors`}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...(download ? { download: typeof download === 'string' ? download : '' } : { target: '_blank', rel: 'noopener noreferrer' })}
      className={`${cls} ${size} inline-flex items-center rounded-lg text-sm font-semibold transition-colors`}
    >
      {children}
    </a>
  );
}

export function Section({ id, title, sub, children }) {
  return (
    <section id={id} className="mt-12 scroll-mt-16">
      <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
      {sub && <p className="text-white/50 text-sm mt-1 max-w-2xl">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Title({ children, size = 'text-3xl sm:text-4xl' }) {
  return (
    <h1 className={`font-game ${size} glow`}>
      <span className="bg-gradient-to-r from-naw-pink to-lime-300 bg-clip-text text-transparent">{children}</span>
    </h1>
  );
}

export function Steps({ items }) {
  return (
    <ol className="space-y-2 mt-2">
      {items.map(([main, tip], i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-none w-6 h-6 rounded-md bg-white/10 text-white text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span>
            <span className="text-white text-sm">{main}</span>
            {tip && <span className="block text-white/45 text-xs mt-0.5">{tip}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Placeholder({ title, children }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-naw-orange/50 bg-naw-orange/5 p-5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-naw-orange text-naw-dark">Coming soon</span>
        <span className="text-white font-bold">{title}</span>
      </div>
      <div className="text-white/60 text-sm mt-2">{children}</div>
    </div>
  );
}

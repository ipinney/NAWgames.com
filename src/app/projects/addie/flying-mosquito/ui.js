import Link from 'next/link';

export const A = '/projects/addie';
export const BASE = '/projects/addie/flying-mosquito';
export const MS = '/projects/addie/mosquito-turret';
export const CAD = '/projects/addie/flymo-cad';
export const GUIDE = '/projects/addie/flymo-build-guide.html';
export const OG = 'https://nawgames.com/projects/addie/flymo-og.png';

export function meta(title, desc, path) {
  return {
    title: `${title} | NAW Games`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://nawgames.com${path}`,
      siteName: 'NAW Games',
      images: [{ url: OG, width: 1200, height: 630, alt: 'The Flying Mosquito, a 3D printed drone target for the MS-2000' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [OG] },
  };
}

const TABS = [
  ['overview', 'Overview', BASE],
  ['design', 'Design', `${BASE}/design`],
  ['experiment', 'Can it fly?', `${BASE}/experiment`],
  ['build', 'Build', `${BASE}/build`],
  ['learn', 'Learn the science', `${BASE}/learn`],
  ['changes', 'Changes', `${BASE}/changes`],
];

export function Nav({ current }) {
  return (
    <nav className="bg-naw-card/60 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        <Link href={BASE} className="font-game text-[10px] text-lime-300 pr-3 py-3 whitespace-nowrap">FLYING MOSQUITO</Link>
        {TABS.map(([k, label, href]) => (
          <Link
            key={k}
            href={href}
            className={`px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              k === current ? 'border-lime-300 text-white' : 'border-transparent text-white/50 hover:text-white/80'
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

export function Btn({ href, children, primary, download }) {
  const cls = primary
    ? 'bg-lime-300 text-naw-dark hover:bg-lime-200'
    : 'bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25';
  const c = `${cls} px-3.5 py-2 inline-flex items-center rounded-lg text-sm font-semibold transition-colors`;
  if (href.startsWith(BASE) || href.startsWith('#')) {
    return href.startsWith('#') ? <a href={href} className={c}>{children}</a> : <Link href={href} className={c}>{children}</Link>;
  }
  return (
    <a href={href} className={c} {...(download ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}>
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
      <span className="bg-gradient-to-r from-lime-300 to-naw-pink bg-clip-text text-transparent">{children}</span>
    </h1>
  );
}

export function Cards({ items, cols = 'sm:grid-cols-2' }) {
  return (
    <div className={`grid ${cols} gap-3`}>
      {items.map(([t, d, tag]) => (
        <div key={t} className="bg-naw-card rounded-2xl border border-white/10 p-4">
          {tag && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60">{tag}</span>}
          <div className={`text-white font-bold ${tag ? 'mt-2' : ''}`}>{t}</div>
          <div className="text-white/55 text-sm mt-1">{d}</div>
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }) {
  return (
    <ol className="space-y-2">
      {items.map(([main, tip], i) => (
        <li key={i} className="bg-naw-card rounded-2xl border border-white/10 px-4 py-3 flex gap-3">
          <span className="flex-none w-6 h-6 rounded-md bg-lime-300/20 text-lime-300 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
          <span>
            <span className="block text-white text-sm font-semibold">{main}</span>
            {tip && <span className="block text-white/50 text-xs mt-0.5">{tip}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

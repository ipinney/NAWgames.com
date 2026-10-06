import Link from 'next/link';

export const BASE = '/projects/nolan/house-defense';

export function meta(title, desc, path) {
  return {
    title: `${title} | NAW Games`,
    description: desc,
    openGraph: { title, description: desc, url: `https://nawgames.com${path}`, siteName: 'NAW Games', type: 'website' },
    twitter: { card: 'summary', title, description: desc },
  };
}

const TABS = [
  ['overview', 'Overview', BASE],
  ['plan', 'How we run it', `${BASE}/plan`],
  ['changes', 'Changes and log', `${BASE}/changes`],
];

export function Nav({ current }) {
  const cls = (k) =>
    `px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
      k === current ? 'border-naw-orange text-white' : 'border-transparent text-white/50 hover:text-white/80'
    }`;
  return (
    <nav className="bg-naw-card/60 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        <Link href={BASE} className="font-game text-[10px] text-naw-orange pr-3 py-3 whitespace-nowrap">HOUSE DEFENSE</Link>
        {TABS.map(([k, label, href]) => (
          <Link key={k} href={href} className={cls(k)}>{label}</Link>
        ))}
      </div>
    </nav>
  );
}

export function Back({ href = '/projects/nolan', children = "Nolan's Projects" }) {
  return (
    <Link href={href} className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}

export function Section({ title, sub, children }) {
  return (
    <section className="mt-12">
      <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
      {sub && <p className="text-white/50 text-sm mt-1 max-w-2xl">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Cards({ items, accent = 'cyan' }) {
  const border = accent === 'orange' ? 'border-naw-orange/30' : 'border-naw-cyan/20';
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map(([t, d]) => (
        <div key={t} className={`bg-naw-card rounded-2xl border ${border} p-4`}>
          <div className="text-white font-bold">{t}</div>
          <div className="text-white/60 text-sm mt-1 leading-relaxed">{d}</div>
        </div>
      ))}
    </div>
  );
}

export function Hero({ tag, title, children }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-naw-cyan/15 via-transparent to-transparent" />
      <div className="relative max-w-5xl mx-auto px-4 pt-10">
        <Back />
        <div className="mt-6 max-w-3xl">
          <span className="bg-naw-cyan/20 text-naw-cyan text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
          <h1 className="font-game text-2xl sm:text-3xl glow mt-4">
            <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">{title}</span>
          </h1>
          {children}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';

export const BASE = '/projects/nolan/dusty';
export const P = '/projects/nolan';
export const OG = 'https://nawgames.com/projects/nolan/dusty-og.png';
export const GUIDE = `${P}/dusty-build-guide.html`;
export const BOARD = `${P}/board-prints.html`;

export function meta(title, desc, path) {
  return {
    title: `${title} | NAW Games`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://nawgames.com${path}`,
      siteName: 'NAW Games',
      images: [{ url: OG, width: 1200, height: 630, alt: 'Dusty, a 3D printed table-sweeping robot' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [OG] },
  };
}

// [key, label, href, static html page?]
// Keep in sync with the copy of this bar in public/projects/nolan/dusty-build-guide.html and board-prints.html
const TABS = [
  ['overview', 'Overview', BASE],
  ['packet', 'Packet guide', `${BASE}/packet`],
  ['research', 'Research', `${BASE}/research`],
  ['invention', 'The invention', `${BASE}/invention`],
  ['learn', 'Learn the science', `${BASE}/learn`],
  ['build', 'Build', `${BASE}/build`],
  ['print', 'Print plan', `${BASE}/build/batches`],
  ['guide', 'Build guide', GUIDE, true],
  ['changes', 'Changes', `${BASE}/changes`],
];

export function Nav({ current }) {
  const cls = (k) =>
    `px-3 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
      k === current ? 'border-naw-orange text-white' : 'border-transparent text-white/50 hover:text-white/80'
    }`;
  return (
    <nav className="bg-naw-card/60 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        <Link href={BASE} className="font-game text-[10px] text-naw-orange pr-3 py-3 whitespace-nowrap">DUSTY</Link>
        {TABS.map(([k, label, href, isStatic]) =>
          isStatic ? (
            <a key={k} href={href} className={cls(k)}>{label}</a>
          ) : (
            <Link key={k} href={href} className={cls(k)}>{label}</Link>
          )
        )}
      </div>
    </nav>
  );
}

export function Back({ href = BASE, children = 'Dusty' }) {
  return (
    <Link href={href} className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-1 transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}

export function Btn({ href, children, primary, newTab }) {
  const cls = `${
    primary ? 'bg-naw-orange text-naw-dark hover:bg-naw-orange/90' : 'bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan hover:bg-naw-cyan/25'
  } inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors`;
  if (href.startsWith(BASE)) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}

// Page header in the Learn the science style: title, lead, sub line, numbered jump chips.
export function Hero({ title, lead, sub, chips, badge }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-300/10 via-transparent to-transparent" />
      <div className="relative max-w-4xl mx-auto px-4 pt-6">
        <Back />
        <h1 className="font-game text-2xl sm:text-3xl glow mt-5">
          <span className="bg-gradient-to-r from-naw-orange to-yellow-300 bg-clip-text text-transparent">{title}</span>
        </h1>
        <p className="text-white text-lg font-semibold mt-4 leading-snug">{lead}</p>
        {sub && <p className="text-white/55 text-sm mt-2">{sub}</p>}
        {badge && (
          <div className="mt-4 inline-flex items-center rounded-full bg-naw-orange/15 border border-naw-orange/40 text-naw-orange text-xs font-semibold px-3 py-1">
            {badge}
          </div>
        )}
        {chips && (
          <nav className="mt-6 flex flex-wrap gap-2">
            {chips.map(([id, label], i) => (
              <a key={id} href={`#${id}`} className="bg-naw-card border border-white/10 hover:border-yellow-300/50 rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors">
                <span className="text-yellow-300 font-bold">{i + 1}</span> {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}

// Numbered section header like the Learn page.
export function Section({ id, n, title, big, children }) {
  return (
    <section id={id} className="mt-10 scroll-mt-4">
      <div className="flex items-baseline gap-3">
        {n != null && (
          <span className="flex-none w-10 h-10 rounded-xl bg-yellow-300 text-naw-dark font-bold text-lg flex items-center justify-center">{n}</span>
        )}
        <div>
          <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
          {big && <p className="text-yellow-300 text-sm font-semibold">{big}</p>}
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`bg-naw-card rounded-2xl border border-white/10 p-5 ${className}`}>{children}</div>;
}

const TONES = {
  facts: 'border-yellow-300/40 bg-yellow-300/10 text-yellow-300',
  tip: 'border-naw-cyan/40 bg-naw-cyan/10 text-naw-cyan',
  pick: 'border-naw-purple/60 bg-naw-purple/15 text-purple-300',
  warn: 'border-naw-orange/40 bg-naw-orange/10 text-naw-orange',
  pink: 'border-naw-pink/40 bg-naw-pink/10 text-naw-pink',
};

// Colored callout box. items renders a bullet list; children renders paragraphs.
export function Box({ tone = 'facts', title, items, children }) {
  const t = TONES[tone];
  const [border, bg, color] = t.split(' ');
  return (
    <div className={`rounded-2xl border ${border} ${bg} p-4`}>
      {title && <div className={`${color} text-xs font-semibold`}>{title}</div>}
      {children && <div className="text-white/85 text-sm mt-1 leading-relaxed space-y-2">{children}</div>}
      {items && (
        <ul className="mt-1.5 space-y-1.5">
          {items.map((x, i) => (
            <li key={i} className="text-white/85 text-sm leading-relaxed flex gap-2">
              <span className={`${color} flex-none`}>•</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Tag({ children }) {
  return <span className="inline-block text-[11px] font-semibold uppercase tracking-wider bg-naw-cyan/15 text-naw-cyan px-2 py-0.5 rounded-full">{children}</span>;
}

export function Words({ list }) {
  return (
    <div className="bg-naw-card rounded-2xl border border-white/10 divide-y divide-white/5">
      {list.map(([w, d]) => (
        <div key={w} className="px-4 py-2.5 grid sm:grid-cols-[12rem_1fr] gap-x-4 text-sm">
          <span className="text-white font-semibold">{w}</span>
          <span className="text-white/60">{d}</span>
        </div>
      ))}
    </div>
  );
}

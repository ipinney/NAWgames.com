import Link from 'next/link';

export const BASE = '/projects/nolan/dusty';
const P = '/projects/nolan';

// [key, label, href, static html page?]
const TABS = [
  ['overview', 'Overview', BASE],
  ['packet', 'Packet guide', `${P}/invention-packet.html`, true],
  ['research', 'Research', `${P}/research.html`, true],
  ['learn', 'Learn the science', `${BASE}/learn`],
  ['build', 'Build', `${BASE}/build`],
  ['print', 'Print plan', `${BASE}/build/batches`],
  ['guide', 'Build guide', `${P}/dusty-build-guide.html`, true],
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

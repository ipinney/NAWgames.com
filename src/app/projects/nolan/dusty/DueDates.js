'use client';

import { useEffect, useState } from 'react';

const PACKET = '/projects/nolan/dusty/packet';

export const DUE = [
  {
    date: '2026-09-17',
    label: 'Thu Sep 17',
    title: 'Research Question',
    text: 'Topic, why it is interesting, the Know and Need to know boxes, and three questions that are not yes or no.',
    links: [
      { href: `${PACKET}#research-question`, label: 'How to fill it in' },
      { href: '/projects/nolan/dusty/research', label: 'Research notes' },
    ],
  },
  {
    date: '2026-10-01',
    label: 'Thu Oct 1',
    title: 'Design Thinking Plan',
    text: 'Page 23: what Dusty is and who it is for. Page 24: a labeled drawing plus size, weight, materials, cost, and how it works.',
    links: [
      { href: `${PACKET}#design-plan`, label: 'How to fill it in' },
      { href: '/projects/nolan/dusty-files/dusty-components-3d.html', label: '3D model to draw from' },
    ],
  },
  {
    date: '2026-10-08',
    label: 'Thu Oct 8',
    title: 'Impact on Society',
    text: 'Top half of the Impact page. Who Dusty helps, and what changes if lots of people have one.',
    links: [{ href: `${PACKET}#impact`, label: 'How to fill it in' }],
  },
  {
    date: '2026-10-15',
    label: 'Thu Oct 15',
    title: 'Catholic Connection',
    text: 'Bottom half of the Impact page. A saint or a work of mercy that connects to Dusty, explained in your own words.',
    links: [{ href: `${PACKET}#catholic`, label: 'How to fill it in' }],
  },
  {
    date: '2026-11-16',
    label: 'Mon Nov 16',
    title: 'Robot + trifold board + whole packet',
    text: 'Everything turned in, including the Research Resources page. Showcase is 2:15 to 3:00 in the Parish Hall.',
    links: [
      { href: `${PACKET}#board`, label: 'Board layout' },
      { href: '/projects/nolan/board-prints.html', label: 'Board print-outs' },
      { href: '/projects/nolan/dusty/build', label: 'Build Dusty' },
    ],
  },
];

function daysUntil(iso, now) {
  const [y, m, d] = iso.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due - today) / 86400000);
}

function when(n) {
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n > 1) return `${n} days left`;
  return 'Turned in';
}

export default function DueDates() {
  const [now, setNow] = useState(null);
  useEffect(() => setNow(new Date()), []);

  const nextIdx = now ? DUE.findIndex((d) => daysUntil(d.date, now) >= 0) : -1;

  return (
    <ol className="relative border-l-2 border-white/10 ml-3 space-y-5">
      {DUE.map((d, i) => {
        const n = now ? daysUntil(d.date, now) : null;
        const past = n !== null && n < 0;
        const next = i === nextIdx;
        return (
          <li key={d.date} className="pl-6 relative">
            <span
              className={`absolute -left-[9px] top-5 w-4 h-4 rounded-full border-2 ${
                next ? 'bg-naw-orange border-naw-orange' : past ? 'bg-naw-green border-naw-green' : 'bg-naw-dark border-white/30'
              }`}
            />
            <div
              className={`rounded-2xl border p-4 sm:p-5 ${
                next ? 'bg-naw-orange/10 border-naw-orange/50' : 'bg-naw-card border-white/10'
              } ${past ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/60 text-sm font-semibold">{d.label}</span>
                {n !== null && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      next ? 'bg-naw-orange text-naw-dark' : past ? 'bg-naw-green/20 text-naw-green' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {next ? `Next up · ${when(n)}` : when(n)}
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-lg mt-1">{d.title}</h3>
              <p className="text-white/60 text-sm mt-1">{d.text}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {d.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    {...(l.href.startsWith('/projects/nolan/dusty/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="bg-naw-cyan/15 border border-naw-cyan/40 text-naw-cyan px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-naw-cyan/25 transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

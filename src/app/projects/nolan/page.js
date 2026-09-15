'use client';

import Link from 'next/link';
import { useState } from 'react';

const PROJECTS = [
  {
    slug: 'dusty-build-guide',
    title: 'How To Build Dusty',
    subject: 'Build Guide',
    emoji: '🔧',
    description:
      'Step by step, from a pile of parts to a working robot. Every part explained, every step drawn, plus what to do when it misbehaves.',
    dueDate: '2026-11-16',
    dueLabel: 'Nov 16, 2026',
    color: 'from-slate-700 to-blue-500',
    file: '/projects/nolan/dusty-build-guide.html',
  },
  {
    slug: 'dusty',
    title: 'Dusty',
    subject: 'Invention Project',
    emoji: '🤖',
    description:
      'A palm-sized robot that sweeps crumbs off the table and stops itself at the edge instead of driving off. Build plan, verified parts list, and the experiment.',
    dueDate: '2026-11-16',
    dueLabel: 'Nov 16, 2026',
    color: 'from-slate-700 to-orange-500',
    file: '/projects/nolan/dusty.html',
    links: [
      { href: '/projects/nolan/dusty-parts-list.pdf', label: '↓ Parts List PDF' },
      { href: '/projects/nolan/dusty-dustpan.html', label: '🧊 3D Dustpan' },
      { href: '/projects/nolan/dusty-dustpan-revA.stl', label: '↓ Dustpan STL' },
      { href: '/projects/nolan/invention-packet.html', label: '📋 Packet Guide' },
    ],
  },
  {
    slug: 'invention-packet',
    title: 'The Packet',
    subject: 'Invention Convention',
    emoji: '📋',
    description:
      'Every page of the school packet in order, with the Dusty facts for each answer, the rubric, the five due dates, and the trifold board layout. Plus big print-outs for the board.',
    dueDate: '2026-11-16',
    dueLabel: 'Nov 16, 2026',
    color: 'from-blue-800 to-cyan-500',
    file: '/projects/nolan/invention-packet.html',
    links: [
      { href: '/projects/nolan/board-prints.html', label: '🖨️ Board Print-Outs' },
      { href: '/projects/nolan/research.html', label: '🔎 Research Notes' },
    ],
  },
  {
    slug: 'research',
    title: 'Research Notes',
    subject: 'Invention Convention',
    emoji: '🔎',
    description:
      'Six research topics with real sources: the Roomba story, how a cliff sensor sees an edge, the dark surface problem, random driving, the micro:bit, and why crumbs matter. Plus vocabulary and three filled-in bibliography entries.',
    dueDate: '2026-09-17',
    dueLabel: 'Sep 17, 2026',
    color: 'from-emerald-800 to-cyan-500',
    file: '/projects/nolan/research.html',
    links: [
      { href: '/projects/nolan/invention-packet.html', label: '📋 Packet Guide' },
    ],
  },
];

export default function NolanProjectsPage() {
  const [viewing, setViewing] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (viewing) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
          <button
            onClick={() => { setViewing(null); setIsFullscreen(false); }}
            className="text-white/40 hover:text-white/70 text-sm mb-4 inline-flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Nolan&apos;s Projects
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{viewing.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-naw-cyan text-sm font-medium">{viewing.subject}</span>
                <span className="text-white/20">|</span>
                <span className="text-naw-orange text-sm font-semibold">Due {viewing.dueLabel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start flex-wrap">
              {(viewing.links || []).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-naw-orange/20 border border-naw-orange/40 text-naw-orange px-4 py-2 rounded-lg text-sm font-semibold hover:bg-naw-orange/30 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-naw-purple/20 border border-naw-purple/30 text-white px-4 py-2 rounded-lg text-sm hover:bg-naw-purple/30 transition-colors"
              >
                {isFullscreen ? '↙ Exit Fullscreen' : '↗ Fullscreen'}
              </button>
            </div>
          </div>
        </div>

        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'max-w-5xl mx-auto px-4 pb-8'}`}>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-black transition-colors"
            >
              ✕ Exit
            </button>
          )}
          <div className={`${isFullscreen ? 'h-full' : 'rounded-2xl overflow-hidden border border-white/10'}`}>
            <iframe
              src={viewing.file}
              className={`w-full bg-white ${isFullscreen ? 'h-full' : 'h-[600px] sm:h-[750px]'}`}
              title={viewing.title}
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-cyan/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-naw-cyan/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8">
          <Link
            href="/projects"
            className="text-white/40 hover:text-white/70 text-sm mb-6 inline-flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Projects
          </Link>

          <div className="text-center mt-4">
            <span className="text-5xl block mb-3">🎮</span>
            <h1 className="font-game text-2xl sm:text-3xl glow mb-2">
              <span className="bg-gradient-to-r from-naw-cyan to-blue-400 bg-clip-text text-transparent">
                NOLAN&apos;S PROJECTS
              </span>
            </h1>
            <p className="text-white/50 text-sm">School projects and presentations</p>
          </div>
        </div>
      </section>

      {/* Project Cards */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <button
              key={project.slug}
              onClick={() => setViewing(project)}
              className="group relative bg-naw-card rounded-2xl border border-naw-cyan/20 overflow-hidden text-left transition-all duration-300 hover:border-naw-cyan/40 hover:scale-[1.02]"
            >
              {/* Gradient banner */}
              <div className={`h-24 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                <span className="text-4xl">{project.emoji}</span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-naw-cyan/20 text-naw-cyan text-xs font-semibold px-2 py-0.5 rounded-full">
                    {project.subject}
                  </span>
                  <span className="bg-naw-orange/20 text-naw-orange text-xs font-semibold px-2 py-0.5 rounded-full">
                    Due {project.dueLabel}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-naw-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/50 text-sm line-clamp-2">{project.description}</p>

                <div className="mt-4 flex items-center gap-1 text-naw-cyan text-sm font-medium">
                  View Project
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

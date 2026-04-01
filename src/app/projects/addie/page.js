'use client';

import Link from 'next/link';
import { useState } from 'react';

const PROJECTS = [
  {
    slug: 'herbert-hoover',
    title: 'Herbert Hoover',
    subject: 'Presidents Report',
    emoji: '🏛️',
    description: 'Poster board guide and speaking notes for a presentation on Herbert Hoover, the 31st President of the United States.',
    date: '2026-04-01',
    color: 'from-blue-800 to-blue-500',
    file: '/projects/addie/herbert-hoover.html',
  },
];

export default function AddieProjectsPage() {
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
            Addie&apos;s Projects
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{viewing.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-naw-pink text-sm font-medium">{viewing.subject}</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 text-sm">{viewing.date}</span>
              </div>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-naw-purple/20 border border-naw-purple/30 text-white px-4 py-2 rounded-lg text-sm hover:bg-naw-purple/30 transition-colors self-start"
            >
              {isFullscreen ? '↙ Exit Fullscreen' : '↗ Fullscreen'}
            </button>
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
              sandbox="allow-scripts allow-same-origin"
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
        <div className="absolute inset-0 bg-gradient-to-b from-naw-pink/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-naw-pink/10 rounded-full blur-3xl" />

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
            <span className="text-5xl block mb-3">🌸</span>
            <h1 className="font-game text-2xl sm:text-3xl glow mb-2">
              <span className="bg-gradient-to-r from-naw-pink to-purple-400 bg-clip-text text-transparent">
                ADDIE&apos;S PROJECTS
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
              className="group relative bg-naw-card rounded-2xl border border-naw-pink/20 overflow-hidden text-left transition-all duration-300 hover:border-naw-pink/40 hover:scale-[1.02]"
            >
              {/* Gradient banner */}
              <div className={`h-24 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                <span className="text-4xl">{project.emoji}</span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-naw-pink/20 text-naw-pink text-xs font-semibold px-2 py-0.5 rounded-full">
                    {project.subject}
                  </span>
                  <span className="text-white/30 text-xs">{project.date}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-naw-pink transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/50 text-sm line-clamp-2">{project.description}</p>

                <div className="mt-4 flex items-center gap-1 text-naw-pink text-sm font-medium">
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

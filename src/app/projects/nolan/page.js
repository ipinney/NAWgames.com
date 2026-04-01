'use client';

import Link from 'next/link';

export default function NolanProjectsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-cyan/20 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8">
          <Link href="/projects" className="text-white/40 hover:text-white/70 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
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
            <p className="text-white/50 text-sm mb-12">School projects and presentations</p>
            <div className="bg-naw-card rounded-2xl border border-white/10 p-12 text-center max-w-md mx-auto">
              <span className="text-5xl block mb-4">🚀</span>
              <h2 className="text-white font-bold text-lg mb-2">Coming Soon!</h2>
              <p className="text-white/40 text-sm">No projects here yet. Check back later!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';

const KIDS = [
  {
    name: 'Nolan',
    slug: 'nolan',
    emoji: '🎮',
    color: 'from-naw-cyan to-blue-600',
    borderColor: 'border-naw-cyan/30',
    hoverBg: 'hover:bg-naw-cyan/10',
    textColor: 'text-naw-cyan',
    description: 'Coming soon!',
    projectCount: 0,
  },
  {
    name: 'Addie',
    slug: 'addie',
    emoji: '🌸',
    color: 'from-naw-pink to-purple-600',
    borderColor: 'border-naw-pink/30',
    hoverBg: 'hover:bg-naw-pink/10',
    textColor: 'text-naw-pink',
    description: 'School projects and presentations',
    projectCount: 1,
  },
  {
    name: 'Wyatt',
    slug: 'wyatt',
    emoji: '🦖',
    color: 'from-naw-orange to-amber-600',
    borderColor: 'border-naw-orange/30',
    hoverBg: 'hover:bg-naw-orange/10',
    textColor: 'text-naw-orange',
    description: 'Coming soon!',
    projectCount: 0,
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-purple/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-naw-pink/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-20 w-96 h-96 bg-naw-orange/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-naw-purple/20 border border-naw-purple/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-lg">📚</span>
            <span className="text-naw-green text-xs font-medium">School Projects</span>
          </div>

          <h1 className="font-game text-2xl sm:text-3xl md:text-4xl glow mb-4 leading-relaxed">
            <span className="bg-gradient-to-r from-naw-pink via-naw-purple to-naw-orange bg-clip-text text-transparent">
              PROJECTS
            </span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-2">
            School projects, presentations, and homework help
          </p>
          <p className="text-white/40 text-xs sm:text-sm mb-10">Pick a person to see their projects!</p>
        </div>
      </section>

      {/* Kid Cards */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {KIDS.map((kid) => {
            const hasProjects = kid.projectCount > 0;
            const CardTag = hasProjects ? Link : 'div';
            const cardProps = hasProjects ? { href: `/projects/${kid.slug}` } : {};

            return (
              <CardTag
                key={kid.slug}
                {...cardProps}
                className={`group relative bg-naw-card rounded-2xl border ${kid.borderColor} p-8 text-center transition-all duration-300 ${
                  hasProjects
                    ? `${kid.hoverBg} hover:border-opacity-60 hover:scale-[1.02] cursor-pointer`
                    : 'opacity-60 cursor-default'
                }`}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${kid.color} opacity-0 ${hasProjects ? 'group-hover:opacity-5' : ''} transition-opacity`} />

                <div className="relative">
                  <span className="text-5xl block mb-4">{kid.emoji}</span>
                  <h2 className={`text-2xl font-bold ${kid.textColor} mb-2`}>{kid.name}</h2>
                  <p className="text-white/50 text-sm mb-4">{kid.description}</p>
                  {hasProjects ? (
                    <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${kid.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
                      {kid.projectCount} {kid.projectCount === 1 ? 'project' : 'projects'}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-white/5 text-white/30 text-xs font-semibold px-3 py-1.5 rounded-full">
                      🔒 No projects yet
                    </span>
                  )}
                </div>
              </CardTag>
            );
          })}
        </div>
      </section>

      {/* Back link */}
      <div className="text-center pb-12">
        <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Games
        </Link>
      </div>
    </div>
  );
}

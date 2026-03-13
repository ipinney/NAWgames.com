'use client';

import { getAllGames } from '@/lib/games';
import GameCard from '@/components/GameCard';
import Link from 'next/link';

export default function HomePage() {
  const games = getAllGames();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-naw-purple/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-naw-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-20 w-96 h-96 bg-naw-cyan/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-naw-purple/20 border border-naw-purple/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-naw-green animate-pulse" />
            <span className="text-naw-green text-xs font-medium">Arcade Open</span>
          </div>

          <h1 className="font-game text-2xl sm:text-3xl md:text-4xl glow mb-4 leading-relaxed">
            <span className="bg-gradient-to-r from-naw-cyan via-naw-purple to-naw-pink bg-clip-text text-transparent">
              NAW GAMES
            </span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-2">
            Games by <span className="text-naw-cyan font-semibold">Nolan</span>,{' '}
            <span className="text-naw-pink font-semibold">Addie</span> &{' '}
            <span className="text-naw-orange font-semibold">Wyatt</span>
          </p>
          <p className="text-white/40 text-xs sm:text-sm mb-8">Play our games or request your very own!</p>

          <div className="flex items-center justify-center gap-3">
            <a
              href="#games"
              className="bg-gradient-to-r from-naw-purple to-naw-cyan text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Browse Games
            </a>
            <Link
              href="/request"
              className="border border-white/20 text-white/80 px-5 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-colors"
            >
              Request a Game
            </Link>
          </div>
        </div>
      </section>

      {/* Game Grid */}
      <section id="games" className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-white">All Games</h2>
          <span className="bg-naw-purple/30 text-naw-purple text-xs font-bold px-2.5 py-1 rounded-full">
            {games.length}
          </span>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🕹️</span>
            <p className="text-white/40 text-lg">No games yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-game text-xs text-white/20">
            NAW GAMES &copy; {new Date().getFullYear()}
          </p>
          <p className="text-white/10 text-xs mt-2">Made with love by the Pinney family</p>
        </div>
      </footer>
    </div>
  );
}

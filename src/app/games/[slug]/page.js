'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getGameBySlug, formatDate } from '@/lib/games';
import { useState } from 'react';

export default function GamePage() {
  const { slug } = useParams();
  const game = getGameBySlug(slug);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🎮</span>
        <h1 className="text-2xl font-bold text-white mb-2">Game Not Found</h1>
        <p className="text-white/50 mb-6">This game doesn&apos;t exist yet.</p>
        <Link href="/" className="text-naw-cyan hover:underline">
          Back to all games
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Game header */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
        <Link href="/" className="text-white/40 hover:text-white/70 text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Games
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{game.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-naw-purple to-naw-pink flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{game.creator[0]}</span>
                </div>
                <span className="text-white/60 text-sm">Created by <span className="text-white/90 font-medium">{game.creator}</span></span>
              </div>
              <span className="text-white/20">|</span>
              <span className="text-white/40 text-sm">{formatDate(game.createdAt)}</span>
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

      {/* Game iframe */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-w-5xl mx-auto px-4'}`}>
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
            src={`/games/${game.slug}.html`}
            className={`w-full bg-black ${isFullscreen ? 'h-full' : 'h-[500px] sm:h-[600px]'}`}
            title={game.title}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Game description */}
      {!isFullscreen && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-naw-card rounded-xl border border-white/5 p-6">
            <h2 className="text-white font-semibold mb-2">How to Play</h2>
            <p className="text-white/60">{game.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

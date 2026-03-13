'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/games';

export default function GameCard({ game }) {
  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <div className="bg-naw-card rounded-2xl overflow-hidden border border-white/5 hover:border-naw-purple/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10">
        {/* Game thumbnail / gradient */}
        <div className={`h-40 bg-gradient-to-br ${game.color} relative overflow-hidden`}>
          {game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                🎮
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white/90 text-xs font-medium">Play Now</span>
          </div>
        </div>

        {/* Game info */}
        <div className="p-4">
          <h3 className="text-white font-bold text-lg group-hover:text-naw-cyan transition-colors">
            {game.title}
          </h3>
          <p className="text-white/50 text-sm mt-1 line-clamp-2">
            {game.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-naw-purple to-naw-pink flex items-center justify-center">
                <span className="text-white text-xs font-bold">{game.creator[0]}</span>
              </div>
              <span className="text-white/60 text-sm">by {game.creator}</span>
            </div>
            <span className="text-white/30 text-xs">{formatDate(game.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useGame, Btn, Chip, money, sfx } from './ui';
import { FoxSVG, HouseSVG } from './art';
import { LEVELS, PRACTICE, RANKS, rankFor, levelUnlocked, allLevelsDone, GRADUATE_AFTER } from '@/lib/flipper/levels';

export default function Home() {
  const g = useGame();
  const p = g.profile;
  const xp = p.xp || 0;
  const rank = rankFor(xp);
  const nextRank = RANKS.find(([min]) => min > xp);
  const prevMin = [...RANKS].reverse().find(([min]) => min <= xp)?.[0] || 0;
  const pct = nextRank ? Math.round(((xp - prevMin) / (nextRank[0] - prevMin)) * 100) : 100;
  const levelsDone = LEVELS.filter((l) => p.levels?.[l.n]).length;
  const flipsOpen = allLevelsDone(p);
  const profitable = p.profitableFlips || 0;
  const nextLevel = LEVELS.find((l) => !p.levels?.[l.n]);

  useEffect(() => { g.setContext({ screen: 'Academy home' }); }, []); // eslint-disable-line

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <Link href="/projects/addie" className="text-white/50 hover:text-white/80 text-sm font-bold">‹ Addie&apos;s projects</Link>

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-center gap-5 rounded-[2rem] bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 p-5 shadow-2xl">
        <FoxSVG size={92} className="hf-bob" />
        <div className="flex-1 min-w-[220px]">
          <div className="text-xs font-black tracking-widest text-amber-900/70">FLIP ACADEMY · FOX HOLLOW</div>
          <h1 className="text-4xl font-black text-amber-950 leading-tight">House Flipper</h1>
          <div className="mt-2 flex items-center gap-3">
            <Chip color="bg-white/80 text-amber-950">⭐ {rank}</Chip>
            <div className="flex-1 max-w-xs h-4 rounded-full bg-white/60 overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-black text-amber-950">{xp} XP{nextRank ? ` / ${nextRank[0]}` : ''}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Skills" value={`${levelsDone}/8`} />
          <Stat label="Flips won" value={`${profitable}/${GRADUATE_AFTER}`} />
          <Stat label="Badges" value={(p.badges || []).length} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-6">
        {/* Skill levels */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-2xl font-black text-white">Skill Levels</h2>
            {nextLevel && <Btn color="green" onClick={() => g.go('level', { n: nextLevel.n })}>Play Level {nextLevel.n} ▶</Btn>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LEVELS.map((l) => {
              const done = p.levels?.[l.n];
              const open = levelUnlocked(p, l.n);
              const now = open && !done;
              return (
                <button key={l.n} disabled={!open}
                  onClick={() => { sfx.pop(); g.go('level', { n: l.n }); }}
                  className={`relative rounded-3xl p-3 text-left transition ${done ? 'bg-emerald-100' : now ? 'bg-white hf-pulse' : 'bg-white/10'} ${open ? 'hover:-translate-y-1 hover:shadow-xl' : 'cursor-not-allowed'}`}>
                  <div className="text-3xl">{open ? l.emoji : '🔒'}</div>
                  <div className={`text-[11px] font-black ${open ? 'text-slate-500' : 'text-white/40'}`}>LEVEL {l.n}</div>
                  <div className={`font-black leading-tight ${open ? 'text-slate-800' : 'text-white/50'}`}>{l.title}</div>
                  <div className={`text-xs font-bold ${open ? 'text-slate-500' : 'text-white/30'}`}>{l.skill}</div>
                  {done && <div className="absolute top-2 right-2 text-sm text-amber-500">{'★'.repeat(done.score)}<span className="opacity-25">{'★'.repeat(3 - done.score)}</span></div>}
                </button>
              );
            })}
          </div>

          <h2 className="text-2xl font-black text-white mt-8 mb-3">Badges</h2>
          <div className="flex flex-wrap gap-2">
            {(p.badges || []).length === 0 && <p className="text-white/50 font-bold">Finish Level 1 to earn your first badge.</p>}
            {(p.badges || []).map((b) => <span key={b} className="rounded-full bg-amber-300 px-3 py-1 font-black text-amber-950 shadow">🏅 {b}</span>)}
          </div>
        </section>

        {/* Practice flips + Real deals */}
        <section>
          <h2 className="text-2xl font-black text-white mb-3">Practice Flips</h2>
          {!flipsOpen && <p className="text-white/60 font-bold mb-3">Finish all 8 skill levels to unlock practice flips.</p>}
          <div className="space-y-3">
            {PRACTICE.map((pr) => {
              const wins = (p.flips || []).filter((f) => f.practice === pr.n);
              const won = wins.some((f) => f.profit > 0);
              const isNext = flipsOpen && !won && profitable === pr.n - 1;
              const inProgress = isNext && p.currentFlipId;
              return (
                <div key={pr.n} className={`flex items-center gap-3 rounded-3xl p-3 ${won ? 'bg-emerald-100' : isNext ? 'bg-white' : 'bg-white/10'}`}>
                  <HouseSVG width={86} house={{ color: ['#fcd34d', '#a7f3d0', '#bfdbfe'][pr.n - 1], roofColor: '#7c2d12', twoStory: pr.n === 3, rooms: won ? {} : { roof: 'rough', outside: 'rough' } }} fixed={won ? 'all' : {}} ground={false} />
                  <div className="flex-1">
                    <div className={`font-black ${won || isNext ? 'text-slate-800' : 'text-white/60'}`}>{pr.title} {won && '✅'}</div>
                    <div className={`text-sm font-semibold ${won || isNext ? 'text-slate-500' : 'text-white/40'}`}>{pr.blurb}</div>
                    {wins.length > 0 && <div className="text-xs font-bold text-slate-500 mt-1">Tries: {wins.map((f) => money(f.profit)).join(', ')}</div>}
                  </div>
                  {isNext && <Btn color="green" onClick={async () => {
                    if (!p.currentFlipId) await g.save('flip_start', {});
                    g.go('flip');
                  }}>{inProgress ? 'Continue' : 'Start'}</Btn>}
                </div>
              );
            })}
          </div>

          <div className={`mt-6 rounded-3xl p-5 ${p.graduatedAt ? 'bg-gradient-to-br from-emerald-300 to-sky-300' : 'bg-white/10 border-2 border-dashed border-white/20'}`}>
            <div className="text-3xl">{p.graduatedAt ? '🎓' : '🔒'}</div>
            <div className={`text-xl font-black ${p.graduatedAt ? 'text-slate-900' : 'text-white/70'}`}>Real Deals</div>
            {p.graduatedAt ? (
              <p className="font-bold text-slate-800 mt-1">You earned your Flipper License! Real Deals is where you and Mom and Dad look at real Houston houses. Dad is getting it ready for you.</p>
            ) : (
              <p className="font-bold text-white/50 mt-1">Win {GRADUATE_AFTER} practice flips to earn your Flipper License and unlock real Houston houses. ({profitable}/{GRADUATE_AFTER})</p>
            )}
          </div>
        </section>
      </div>
      <div className="mt-10 text-center"><Link href="/projects/addie/house-flipper/calibration" className="text-xs font-bold text-white/30 hover:text-white/60">Town numbers and sources</Link></div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 min-w-[78px]">
      <div className="text-2xl font-black text-amber-950">{value}</div>
      <div className="text-[11px] font-black text-amber-900/70 uppercase">{label}</div>
    </div>
  );
}

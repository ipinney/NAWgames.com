import { handle, json, HttpError, requireIvan, loadProfile, profileRef, flipRef, getUsage, nowIso, db } from '@/lib/flipper/server';
import { LEVELS, PRACTICE, XP, GRADUATE_AFTER, allLevelsDone, levelUnlocked } from '@/lib/flipper/levels';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function currentFlip(profile) {
  if (!profile.currentFlipId) return null;
  const snap = await flipRef(profile.currentFlipId).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

export const GET = handle(async (req) => {
  const { uid } = await requireIvan(req);
  const profile = await loadProfile(uid);
  const [flip, usage] = await Promise.all([currentFlip(profile), getUsage(uid)]);
  return json({ profile, flip, usage: { usd: usage.usd, left: usage.left, warn: usage.warn, asleep: usage.asleep } });
});

// POST {action, ...}
export const POST = handle(async (req) => {
  const { uid } = await requireIvan(req);
  const body = await req.json().catch(() => ({}));
  const ref = profileRef(uid);
  const profile = await loadProfile(uid);
  const p = { ...profile, levels: { ...(profile.levels || {}) }, badges: [...(profile.badges || [])], flips: [...(profile.flips || [])] };

  switch (body.action) {
    case 'level_done': {
      const n = Number(body.level);
      const lvl = LEVELS.find((l) => l.n === n);
      if (!lvl) throw new HttpError(400, 'Unknown level.');
      if (!levelUnlocked(p, n)) throw new HttpError(400, 'That level is still locked.');
      const score = Math.max(0, Math.min(3, Number(body.score) || 0));
      const first = !p.levels[n];
      const prev = p.levels[n]?.score || 0;
      p.levels[n] = { score: Math.max(prev, score), at: nowIso() };
      let gained = 0;
      if (first) gained += XP.level;
      if (score === 3 && prev < 3) gained += XP.perfect;
      p.xp = (p.xp || 0) + gained;
      if (!p.badges.includes(lvl.badge)) p.badges.push(lvl.badge);
      await ref.set(p);
      return json({ ok: true, profile: p, gained });
    }

    case 'flip_start': {
      if (!allLevelsDone(p)) throw new HttpError(400, 'Finish all 8 skill levels first.');
      const done = p.profitableFlips || 0;
      const stage = PRACTICE[Math.min(done, PRACTICE.length - 1)];
      const id = `${uid}_${Date.now().toString(36)}`;
      const flip = {
        uid, practice: stage.n, attempt: p.flips.filter((f) => f.practice === stage.n).length + 1,
        seed: `${p.townSeed || 'fox'}:${id}`, step: 'find', data: {}, startedAt: nowIso(), done: false,
      };
      await flipRef(id).set(flip);
      p.currentFlipId = id;
      await ref.set(p);
      return json({ ok: true, profile: p, flip: { id, ...flip } });
    }

    case 'flip_save': {
      const id = String(body.flipId || '');
      if (!id || id !== p.currentFlipId) throw new HttpError(400, 'That flip is not active.');
      const step = String(body.step || '').slice(0, 20);
      const data = body.data && typeof body.data === 'object' ? body.data : {};
      const s = JSON.stringify(data);
      if (s.length > 60000) throw new HttpError(400, 'Too much data.');
      await flipRef(id).set({ step, data, updatedAt: nowIso() }, { merge: true });
      return json({ ok: true });
    }

    case 'flip_finish': {
      const id = String(body.flipId || '');
      if (!id || id !== p.currentFlipId) throw new HttpError(400, 'That flip is not active.');
      const fsnap = await flipRef(id).get();
      const flip = fsnap.data() || {};
      const r = body.result || {};
      const profit = Math.round(Number(r.profit) || 0);
      const summary = {
        id, practice: flip.practice, profit, address: String(r.address || '').slice(0, 60),
        hood: String(r.hood || '').slice(0, 30), months: Number(r.months) || 0,
        planned: Math.round(Number(r.plannedProfit) || 0), at: nowIso(),
      };
      await flipRef(id).set({ done: true, step: 'report', result: r, finishedAt: nowIso() }, { merge: true });
      p.flips.push(summary);
      let gained = XP.flipDone;
      const profitable = profit > 0;
      if (profitable) { p.profitableFlips = (p.profitableFlips || 0) + 1; gained += XP.flipProfit; }
      p.xp = (p.xp || 0) + gained;
      p.currentFlipId = null;
      const badge = `Practice Flip ${flip.practice}`;
      if (profitable && !p.badges.includes(badge)) p.badges.push(badge);
      let graduated = false;
      if (!p.graduatedAt && (p.profitableFlips || 0) >= GRADUATE_AFTER) {
        p.graduatedAt = nowIso();
        p.gradEmailPending = true;
        if (!p.badges.includes('Flipper License')) p.badges.push('Flipper License');
        graduated = true;
      }
      await ref.set(p);
      return json({ ok: true, profile: p, gained, profitable, graduated });
    }

    case 'flip_abandon': {
      if (p.currentFlipId) await flipRef(p.currentFlipId).set({ abandoned: true }, { merge: true });
      p.currentFlipId = null;
      await ref.set(p);
      return json({ ok: true, profile: p });
    }

    default:
      throw new HttpError(400, 'Unknown action.');
  }
});

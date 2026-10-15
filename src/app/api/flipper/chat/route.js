import { handle, json, HttpError, requireIvan, loadProfile, getUsage, addUsage, db, FieldValue, today, nowIso, DAILY_CAP } from '@/lib/flipper/server';
import { callFlip, contextNote, cleanSay } from '@/lib/flipper/flip';
import { scrubPersonal } from '@/lib/studio/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const KEEP = 200;     // messages kept per day
const WINDOW = 16;    // messages sent to the model

function toApi(entries) {
  const out = [];
  for (const m of entries) {
    const role = m.role === 'flip' ? 'assistant' : 'user';
    const text = m.role === 'event' ? `[Game event] ${m.text}` : m.text;
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += `\n${text}`;
    else out.push({ role, content: text });
  }
  while (out.length && out[0].role !== 'user') out.shift();
  return out;
}

// GET: today's chat so the panel can show it after a reload.
export const GET = handle(async (req) => {
  const { uid } = await requireIvan(req);
  const snap = await db().collection('hf_sessions').doc(`${uid}_${today()}`).get();
  const usage = await getUsage(uid);
  const msgs = (snap.exists ? snap.data().messages || [] : []).filter((m) => m.role !== 'event').slice(-40);
  return json({ messages: msgs, usage: { usd: usage.usd, left: usage.left, warn: usage.warn, asleep: usage.asleep } });
});

// POST {text?, event?, context?}
export const POST = handle(async (req) => {
  const { uid } = await requireIvan(req);
  const body = await req.json().catch(() => ({}));
  const usage = await getUsage(uid);
  if (usage.asleep) {
    return json({ asleep: true, say: 'Flip is curled up asleep for today. He will be back tomorrow!', usage: { usd: usage.usd, left: 0, warn: true, asleep: true } });
  }
  const text = body.text ? scrubPersonal(body.text).trim().slice(0, 400) : '';
  const event = body.event ? String(body.event).slice(0, 300) : '';
  if (!text && !event) throw new HttpError(400, 'Say something to Flip!');

  const profile = await loadProfile(uid);
  const ref = db().collection('hf_sessions').doc(`${uid}_${today()}`);
  const snap = await ref.get();
  const prior = snap.exists ? snap.data().messages || [] : [];

  const fresh = [];
  if (event) fresh.push({ role: 'event', text: event, at: nowIso() });
  if (text) fresh.push({ role: 'kid', text, at: nowIso() });

  const history = toApi([...prior.slice(-WINDOW), ...fresh]);
  const note = contextNote(body.context);
  if (note && history.length) {
    const last = history[history.length - 1];
    last.content = `${note}\n\n${last.content}`;
  }

  const out = await callFlip({ history, profile });
  const say = cleanSay(out.text) || 'Hmm! Tell me more?';
  fresh.push({ role: 'flip', text: say, at: nowIso() });

  await ref.set({ uid, day: today(), messages: [...prior, ...fresh].slice(-KEEP), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  await addUsage(uid, { usd: out.usd, inTok: out.inTok, outTok: out.outTok, turns: text ? 1 : 0 });
  const usd = usage.usd + out.usd;
  return json({ say, usage: { usd, left: Math.max(0, DAILY_CAP - usd), warn: usd >= 4.5, asleep: usd >= DAILY_CAP } });
});

// House Flipper server helpers (API routes only). Reuses Game Studio's firebase-admin setup.
import { db, FieldValue, json, HttpError, handle, ADMIN_UID } from '@/lib/studio/server';
import admin from 'firebase-admin';

export { db, FieldValue, json, HttpError, handle };

export const MODEL = 'claude-sonnet-5-5';
export const DAILY_CAP = 5.0;
export const WARN_AT = 4.5;
// Prices in USD.
export const PRICE = {
  in: 2 / 1e6, out: 10 / 1e6, cacheWrite: 2.5 / 1e6, cacheRead: 0.1 / 1e6,
  ttsChar: 0.3 / 1000,   // ElevenLabs Creator overage rate
};

// Only Ivan's login may use House Flipper.
export async function requireIvan(req) {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) throw new HttpError(401, 'Please sign in.');
  let decoded;
  try {
    db(); // makes sure the admin app is initialised
    decoded = await admin.auth().verifyIdToken(token);
  } catch {
    throw new HttpError(401, 'Your sign-in expired. Please sign in again.');
  }
  if (decoded.uid !== ADMIN_UID) throw new HttpError(403, 'House Flipper is private.');
  return { uid: decoded.uid };
}

export function today() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

export async function getUsage(uid) {
  const snap = await db().collection('hf_usage').doc(`${uid}_${today()}`).get();
  const d = snap.exists ? snap.data() : {};
  const usd = d.usd || 0;
  return { usd, left: Math.max(0, DAILY_CAP - usd), warn: usd >= WARN_AT, asleep: usd >= DAILY_CAP, ...d };
}

export async function addUsage(uid, { usd = 0, inTok = 0, outTok = 0, ttsChars = 0, turns = 0 }) {
  const ref = db().collection('hf_usage').doc(`${uid}_${today()}`);
  await ref.set({
    uid, day: today(),
    usd: FieldValue.increment(usd), inTok: FieldValue.increment(inTok), outTok: FieldValue.increment(outTok),
    ttsChars: FieldValue.increment(ttsChars), turns: FieldValue.increment(turns),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}

export const DEFAULT_PROFILE = {
  name: 'Addie', xp: 0, badges: [], levels: {}, flips: [], profitableFlips: 0,
  graduatedAt: null, currentFlipId: null, townSeed: null,
};

export function profileRef(uid) { return db().collection('hf_profile').doc(uid); }
export function flipRef(id) { return db().collection('hf_practice_flips').doc(id); }

export async function loadProfile(uid) {
  const ref = profileRef(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    const p = { ...DEFAULT_PROFILE, townSeed: Math.random().toString(36).slice(2, 8), createdAt: new Date().toISOString() };
    await ref.set(p);
    return p;
  }
  return { ...DEFAULT_PROFILE, ...snap.data() };
}

export function nowIso() { return new Date().toISOString(); }

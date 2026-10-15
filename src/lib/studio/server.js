// Game Studio server helpers (API routes only, never imported by client code).
// firebase-admin is initialised lazily from FIREBASE_SERVICE_ACCOUNT_B64.
import admin from 'firebase-admin';
import crypto from 'crypto';

export const ADMIN_UID = 'zy8WSqtL3GUuyw89u1X1ZzENULP2';
export const MODEL = 'claude-sonnet-5-5';

export const LIMITS = { chat: 200, build: 6, art: 12 };
const ADMIN_MULT = 5;

let _app = null;
function app() {
  if (_app) return _app;
  if (admin.apps.length) { _app = admin.apps[0]; return _app; }
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 not set');
  const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  _app = admin.initializeApp({ credential: admin.credential.cert(sa), projectId: sa.project_id });
  return _app;
}

export function db() { return admin.firestore(app()); }
export const FieldValue = admin.firestore.FieldValue;

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function handle(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error('[studio]', e);
      return json({ error: 'Something went wrong. Try again in a minute.' }, 500);
    }
  };
}

// Verifies the Firebase ID token and the studio_access approval server-side.
export async function requireUser(req, { approved = true } = {}) {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) throw new HttpError(401, 'Please sign in.');
  let decoded;
  try {
    decoded = await admin.auth(app()).verifyIdToken(token);
  } catch {
    throw new HttpError(401, 'Your sign-in expired. Please sign in again.');
  }
  const uid = decoded.uid;
  const isAdmin = uid === ADMIN_UID;
  let access = null;
  if (!isAdmin) {
    const snap = await db().collection('studio_access').doc(uid).get();
    access = snap.exists ? snap.data() : null;
    if (approved && access?.status !== 'approved') throw new HttpError(403, 'Game Studio access is not approved yet.');
  }
  return { uid, email: decoded.email || '', isAdmin, access, nickname: access?.nickname || access?.name || '' };
}

export function requireAdmin(user) {
  if (!user.isAdmin) throw new HttpError(403, 'Admin only.');
}

// Per-user daily counters in studio_usage/{uid}_{YYYY-MM-DD} (Central time day).
export async function useQuota(user, kind) {
  const day = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
  const ref = db().collection('studio_usage').doc(`${user.uid}_${day}`);
  const limit = LIMITS[kind] * (user.isAdmin ? ADMIN_MULT : 1);
  await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const n = (snap.exists ? snap.data()[kind] : 0) || 0;
    if (n >= limit) {
      const msg = kind === 'chat'
        ? 'Wow, you chatted a lot today! The guide needs a rest. Come back tomorrow.'
        : kind === 'build'
          ? 'That is all the building for today. Come back tomorrow for more!'
          : 'That is all the pictures for today. Come back tomorrow!';
      throw new HttpError(429, msg);
    }
    tx.set(ref, { uid: user.uid, day, [kind]: n + 1, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  });
}

export async function loadProject(user, id) {
  if (!id || typeof id !== 'string' || id.length > 64) throw new HttpError(400, 'Missing project.');
  const ref = db().collection('studio_projects').doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpError(404, 'Project not found.');
  const p = snap.data();
  if (p.ownerUid !== user.uid && !user.isAdmin) throw new HttpError(404, 'Project not found.');
  return { ref, project: { id, ...p } };
}

// Signed, expiring preview links so the iframe can load an owner-only preview.
function secret() {
  const s = process.env.STUDIO_SIGNING_SECRET;
  if (!s) throw new Error('STUDIO_SIGNING_SECRET not set');
  return s;
}
export function signPreview(projectId, ttlSec = 6 * 3600) {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const sig = crypto.createHmac('sha256', secret()).update(`${projectId}.${exp}`).digest('hex').slice(0, 32);
  return `/api/studio/preview?id=${encodeURIComponent(projectId)}&exp=${exp}&sig=${sig}`;
}
export function checkPreview(projectId, exp, sig) {
  if (!projectId || !exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const want = crypto.createHmac('sha256', secret()).update(`${projectId}.${exp}`).digest('hex').slice(0, 32);
  try { return crypto.timingSafeEqual(Buffer.from(want), Buffer.from(String(sig))); } catch { return false; }
}

// Game HTML is served on an opaque origin: no cookies, no storage of nawgames.com, no network.
export const GAME_CSP = [
  'sandbox allow-scripts allow-pointer-lock',
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  'img-src data: blob:',
  'media-src data: blob:',
  'font-src data:',
  "connect-src 'none'",
  "form-action 'none'",
].join('; ');

export function htmlResponse(html, cacheSeconds = 0) {
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': GAME_CSP,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Cache-Control': cacheSeconds ? `public, max-age=${cacheSeconds}` : 'no-store',
    },
  });
}

// Removes obvious personal info a kid might type (emails, phone numbers, street addresses, links).
export function scrubPersonal(text) {
  return String(text || '')
    .slice(0, 500)
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[hidden]')
    .replace(/https?:\/\/\S+|www\.\S+/gi, '[link removed]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[hidden]')
    .replace(/\b\d{2,6}\s+[A-Za-z0-9.' ]{2,30}\s(street|st|avenue|ave|road|rd|lane|ln|drive|dr|blvd|court|ct|way)\b\.?/gi, '[hidden]');
}

export function nowIso() { return new Date().toISOString(); }

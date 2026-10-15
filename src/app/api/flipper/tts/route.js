import { handle, json, requireIvan, getUsage, addUsage } from '@/lib/flipper/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Flip's voice: Kokoro TTS ("am_puck") running on spark, reached at FLIPVOICE_URL. Free, so it adds no spend.
// POST {text} -> audio/mpeg, or 204 meaning "use the browser voice" (spark down, asleep, or not configured).
export const POST = handle(async (req) => {
  const { uid } = await requireIvan(req);
  const { text } = await req.json().catch(() => ({}));
  const clean = String(text || '').replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 700);
  if (!clean) return json({ error: 'Nothing to say.' }, 400);
  const url = process.env.FLIPVOICE_URL;
  const token = process.env.FLIPVOICE_TOKEN;
  if (!url || !token) return new Response(null, { status: 204 });
  const usage = await getUsage(uid);
  if (usage.asleep) return new Response(null, { status: 204 });

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, {
      method: 'POST', signal: ctrl.signal,
      headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ text: clean }),
    });
    clearTimeout(t);
    if (!res.ok) { console.warn('[flipper] voice', res.status); return new Response(null, { status: 204 }); }
    const buf = Buffer.from(await res.arrayBuffer());
    await addUsage(uid, { ttsChars: clean.length });
    return new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.warn('[flipper] voice unreachable', e?.name);
    return new Response(null, { status: 204 });
  }
});

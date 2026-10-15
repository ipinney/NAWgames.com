import { handle, json, requireIvan, getUsage, addUsage, PRICE } from '@/lib/flipper/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Flip's voice: ElevenLabs "Callum" (animated-character trickster voice).
const VOICE = process.env.FLIP_VOICE_ID || 'N2lVS1w4EtoT3dr4eOWO';

// POST {text} -> audio/mpeg, or 204 meaning "use the browser voice".
export const POST = handle(async (req) => {
  const { uid } = await requireIvan(req);
  const { text } = await req.json().catch(() => ({}));
  const clean = String(text || '').replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 700);
  if (!clean) return json({ error: 'Nothing to say.' }, 400);
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return new Response(null, { status: 204 });
  const usage = await getUsage(uid);
  if (usage.asleep) return new Response(null, { status: 204 });

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text: clean, model_id: 'eleven_flash_v2_5', voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35 } }),
  });
  if (!res.ok) {
    // Out of characters or any other problem: fall back to the browser voice quietly.
    console.warn('[flipper] tts', res.status, (await res.text()).slice(0, 200));
    return new Response(null, { status: 204 });
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await addUsage(uid, { usd: clean.length * PRICE.ttsChar, ttsChars: clean.length });
  return new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } });
});

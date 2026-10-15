import { db } from '@/lib/studio/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const slug = String(params.slug || '').slice(0, 80);
  const snap = await db().collection('studio_games').doc(slug).get();
  const d = snap.exists ? snap.data() : null;
  if (!d || d.status !== 'published' || !d.thumbJpegB64) return new Response('', { status: 404 });
  return new Response(Buffer.from(d.thumbJpegB64, 'base64'), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=300' },
  });
}

import { db, json } from '@/lib/studio/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public list of published studio games for the arcade. ?slug= returns one.
export async function GET(req) {
  try {
    const slug = new URL(req.url).searchParams.get('slug');
    if (slug) {
      const s = await db().collection('studio_games').doc(String(slug).slice(0, 80)).get();
      if (!s.exists || s.data().status !== 'published') return json({ game: null }, 404);
      return json({ game: shape(s.id, s.data()) });
    }
    const snap = await db().collection('studio_games').where('status', '==', 'published').get();
    const games = snap.docs.map((d) => shape(d.id, d.data()))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return new Response(JSON.stringify({ games }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    });
  } catch (e) {
    console.error('[studio games]', e);
    return json({ games: [] });
  }
}

function shape(slug, d) {
  return {
    slug,
    title: d.title,
    creator: d.builder,
    description: d.description,
    createdAt: d.createdAt,
    thumbnail: d.thumbJpegB64 ? `/api/studio/thumb/${slug}?v=${d.version || 1}` : null,
    color: d.color || 'from-naw-purple to-naw-cyan',
    studio: true,
    src: `/api/studio/game/${slug}?v=${d.version || 1}`,
  };
}

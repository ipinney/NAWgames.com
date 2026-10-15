import { db, htmlResponse } from '@/lib/studio/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Published studio game HTML (public). Unpublished or held games return 404.
export async function GET(req, { params }) {
  const slug = String(params.slug || '').slice(0, 80);
  const meta = await db().collection('studio_games').doc(slug).get();
  if (!meta.exists || meta.data().status !== 'published') return new Response('Game not found.', { status: 404 });
  const h = await db().collection('studio_game_html').doc(slug).get();
  if (!h.exists) return new Response('Game not found.', { status: 404 });
  return htmlResponse(h.data().html, 60);
}

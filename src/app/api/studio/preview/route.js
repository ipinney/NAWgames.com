import { db, checkPreview, htmlResponse } from '@/lib/studio/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Owner preview, authorised by a short-lived signed link from /api/studio/projects.
export async function GET(req) {
  const u = new URL(req.url);
  const id = u.searchParams.get('id');
  if (!checkPreview(id, u.searchParams.get('exp'), u.searchParams.get('sig'))) {
    return new Response('Preview link expired. Go back and open it again.', { status: 403 });
  }
  const snap = await db().collection('studio_html').doc(id).get();
  if (!snap.exists || !snap.data().html) return new Response('No preview yet.', { status: 404 });
  return htmlResponse(snap.data().html);
}

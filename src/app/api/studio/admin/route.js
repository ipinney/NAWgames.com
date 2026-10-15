import { handle, json, requireUser, requireAdmin, db, FieldValue, HttpError } from '@/lib/studio/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: all studio games (published, held, unpublished) and recent builds.
export const GET = handle(async (req) => {
  const user = await requireUser(req);
  requireAdmin(user);
  const games = await db().collection('studio_games').get();
  const builds = await db().collection('studio_builds').orderBy('createdMs', 'desc').limit(30).get();
  return json({
    games: games.docs.map((d) => {
      const g = d.data();
      return {
        slug: d.id, title: g.title, builder: g.builder, status: g.status, projectId: g.projectId,
        description: g.description, safety: g.safety || null, createdAt: g.createdAt, version: g.version || 1, test: !!g.test,
      };
    }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    builds: builds.docs.map((d) => {
      const b = d.data();
      return { id: d.id, projectId: b.projectId, step: b.step, status: b.status, error: b.error || '', createdMs: b.createdMs, durationS: b.durationS || null };
    }),
  });
});

// POST {action: unpublish|publish|delete, slug}
export const POST = handle(async (req) => {
  const user = await requireUser(req);
  requireAdmin(user);
  const { action, slug } = await req.json().catch(() => ({}));
  const ref = db().collection('studio_games').doc(String(slug || ''));
  const snap = await ref.get();
  if (!snap.exists) throw new HttpError(404, 'No such game.');
  const g = snap.data();
  if (action === 'unpublish') {
    await ref.update({ status: 'unpublished', unpublishedAt: FieldValue.serverTimestamp() });
    if (g.projectId) await db().collection('studio_projects').doc(g.projectId).update({ publishedSlug: null }).catch(() => {});
  } else if (action === 'publish') {
    await ref.update({ status: 'published', adminOverride: true, publishedAt: FieldValue.serverTimestamp() });
    if (g.projectId) await db().collection('studio_projects').doc(g.projectId).update({ publishedSlug: snap.id, 'safety.status': 'passed' }).catch(() => {});
  } else if (action === 'delete') {
    await ref.delete();
    await db().collection('studio_game_html').doc(snap.id).delete().catch(() => {});
    if (g.projectId) await db().collection('studio_projects').doc(g.projectId).update({ publishedSlug: null }).catch(() => {});
  } else throw new HttpError(400, 'Unknown action.');
  return json({ ok: true });
});

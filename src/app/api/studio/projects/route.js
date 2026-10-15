import { handle, json, requireUser, loadProject, db, FieldValue, HttpError, signPreview, useQuota, scrubPersonal } from '@/lib/studio/server';
import { STAGES, emptyDesign, stageMissing, MAX_STEP } from '@/lib/studio/design';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KID_NAMES = ['Nolan', 'Addie', 'Wyatt'];

function cleanName(s) {
  return String(s || '').replace(/[^A-Za-z0-9 '\-]/g, '').trim().slice(0, 20);
}

// GET ?id=  one project (with signed preview url)   GET  list of my projects
export const GET = handle(async (req) => {
  const user = await requireUser(req);
  const id = new URL(req.url).searchParams.get('id');
  if (id) {
    const { project } = await loadProject(user, id);
    const builds = await db().collection('studio_builds').where('projectId', '==', id).get();
    const list = builds.docs.map((d) => ({ id: d.id, ...stripTs(d.data()) }))
      .sort((a, b) => (a.createdMs || 0) - (b.createdMs || 0));
    return json({
      project: stripTs(project),
      builds: list,
      previewUrl: project.previewStep ? signPreview(id) + `&v=${project.previewStep}` : null,
    });
  }
  const q = user.isAdmin && new URL(req.url).searchParams.get('all')
    ? db().collection('studio_projects')
    : db().collection('studio_projects').where('ownerUid', '==', user.uid);
  const snap = await q.get();
  const projects = snap.docs.map((d) => {
    const p = d.data();
    return {
      id: d.id, name: p.design?.idea?.name || 'New game', emoji: p.design?.hero?.emoji || '🎮',
      stage: p.stage, maxStage: p.maxStage || p.stage, builder: p.builder, buildStep: p.buildStep || 0, publishedSlug: p.publishedSlug || null,
      updatedMs: p.updatedAt?.toMillis?.() || 0, test: !!p.test,
    };
  }).sort((a, b) => b.updatedMs - a.updatedMs);
  return json({ projects, nickname: user.nickname, isAdmin: user.isAdmin });
});

function stripTs(o) {
  const out = {};
  for (const [k, v] of Object.entries(o || {})) {
    if (v && typeof v.toMillis === 'function') { out[k.replace(/At$/, 'Ms')] = v.toMillis(); }
    else out[k] = v;
  }
  return out;
}

// POST {action}
//  create {builder?, test?}
//  approve {id}       mockup approved: queue build step 1
//  goto {id, stage}   go back to an earlier stage
//  feedback {id, chips[], text}  queue the next build step
//  delete {id}
export const POST = handle(async (req) => {
  const user = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === 'create') {
    let builder = cleanName(body.builder);
    if (!user.isAdmin) builder = cleanName(user.nickname) || 'A NAW Builder';
    if (!builder) builder = 'Ivan';
    const mine = await db().collection('studio_projects').where('ownerUid', '==', user.uid).get();
    if (!user.isAdmin && mine.size >= 12) throw new HttpError(400, 'You have 12 games already. Delete one to start a new one.');
    const ref = db().collection('studio_projects').doc();
    await ref.set({
      ownerUid: user.uid, builder, stage: 'idea', design: emptyDesign(), chat: [],
      buildStep: 0, previewStep: 0, building: false, test: !!body.test,
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
    return json({ ok: true, id: ref.id });
  }

  const { ref, project } = await loadProject(user, body.id);

  if (action === 'goto') {
    const target = body.stage;
    const ti = STAGES.findIndex((s) => s.key === target);
    const reached = Math.max(STAGES.findIndex((s) => s.key === project.stage), STAGES.findIndex((s) => s.key === project.maxStage));
    if (ti === -1 || project.stage === 'build' || ti > reached) throw new HttpError(400, 'Cannot go there yet.');
    await ref.update({ stage: target, maxStage: STAGES[reached].key, updatedAt: FieldValue.serverTimestamp() });
    return json({ ok: true });
  }

  if (action === 'approve') {
    if (project.stage !== 'mockup') throw new HttpError(400, 'Finish the plan first.');
    for (const s of STAGES.slice(0, -1)) {
      const miss = stageMissing(s.key, project.design);
      if (miss.length) throw new HttpError(400, `The ${s.label} part still needs: ${miss.join(', ')}.`);
    }
    if (!project.design.mockup) throw new HttpError(400, 'Ask Sparky to draw the mockup first.');
    await useQuota(user, 'build');
    await queueBuild(ref, project, user, 1, '');
    await ref.update({ stage: 'build', approvedAt: FieldValue.serverTimestamp() });
    return json({ ok: true });
  }

  if (action === 'feedback') {
    if (project.stage !== 'build') throw new HttpError(400, 'Not building yet.');
    if (project.building) throw new HttpError(400, 'The robot builder is still working. Hang on!');
    const next = (project.buildStep || 0) + 1;
    if (next > MAX_STEP) throw new HttpError(400, 'This game is finished! Start a new one to keep building.');
    const chips = (Array.isArray(body.chips) ? body.chips : []).map((c) => String(c).slice(0, 40)).slice(0, 6);
    const text = scrubPersonal(body.text || '').slice(0, 300);
    const feedback = [...chips, text].filter(Boolean).join('. ');
    await useQuota(user, 'build');
    await queueBuild(ref, project, user, next, feedback);
    return json({ ok: true, step: next });
  }

  if (action === 'retry') {
    if (project.building) throw new HttpError(400, 'Still working.');
    const next = (project.buildStep || 0) + 1;
    await useQuota(user, 'build');
    await queueBuild(ref, project, user, next, project.lastFeedback || '');
    return json({ ok: true, step: next });
  }

  if (action === 'art') {
    if (!project.design?.hero?.description) throw new HttpError(400, 'Describe your hero first.');
    if (project.art?.status === 'queued' || project.art?.status === 'running') throw new HttpError(400, 'Already drawing!');
    await useQuota(user, 'art');
    await ref.update({ art: { status: 'queued', queuedAt: Date.now() } });
    await db().collection('studio_art').add({
      projectId: ref.id, ownerUid: project.ownerUid, status: 'queued',
      base: project.design.hero.base || project.design.hero.description,
      layers: project.design.hero.layers || [], createdAt: FieldValue.serverTimestamp(),
    });
    return json({ ok: true });
  }

  if (action === 'delete') {
    if (project.building) throw new HttpError(400, 'Wait for the builder to finish first.');
    await ref.delete();
    await db().collection('studio_html').doc(ref.id).delete().catch(() => {});
    return json({ ok: true });
  }

  throw new HttpError(400, 'Unknown action.');
});

async function queueBuild(ref, project, user, step, feedback) {
  await db().collection('studio_builds').add({
    projectId: ref.id, ownerUid: project.ownerUid, step, feedback, status: 'queued',
    createdAt: FieldValue.serverTimestamp(), createdMs: Date.now(), requestedBy: user.uid,
  });
  await ref.update({ building: true, lastFeedback: feedback, updatedAt: FieldValue.serverTimestamp() });
}

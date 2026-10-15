import { handle, json, requireUser, useQuota, loadProject, scrubPersonal, FieldValue, nowIso, HttpError } from '@/lib/studio/server';
import { callGuide } from '@/lib/studio/guide';
import { STAGES, stageMissing } from '@/lib/studio/design';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ARRAY_STAGES = new Set(['bestiary', 'moves']);
const MAX_CHAT = 160;

function cleanChips(chips) {
  return (Array.isArray(chips) ? chips : [])
    .map((c) => String(c).replace(/https?:\/\/\S+/g, '').replace(/—/g, ', ').slice(0, 40).trim())
    .filter(Boolean)
    .slice(0, 6);
}
function cleanSay(s) {
  return String(s || '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/\s*—\s*/g, ', ').slice(0, 600);
}

function mergeSection(stage, design, section) {
  if (section === null || section === undefined) return design;
  const d = { ...design };
  if (ARRAY_STAGES.has(stage)) {
    if (Array.isArray(section)) d[stage] = section.slice(0, 8);
  } else if (stage === 'mockup') {
    if (typeof section === 'string') d.mockup = section.slice(0, 2000);
  } else if (typeof section === 'object' && !Array.isArray(section)) {
    d[stage] = { ...(design[stage] || {}), ...section };
    if (stage === 'idea' && d.idea.dimension) {
      const v = String(d.idea.dimension).toLowerCase();
      d.idea.dimension = v.includes('3') ? '3d' : v.includes('2') || v.includes('flat') ? '2d' : '';
    }
  }
  return d;
}

// POST {projectId, text?}  text omitted = "start this stage"
export const POST = handle(async (req) => {
  const user = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const { ref, project } = await loadProject(user, body.projectId);
  if (project.stage === 'build') throw new HttpError(400, 'This game is already being built.');
  await useQuota(user, 'chat');

  const stage = project.stage;
  const chat = Array.isArray(project.chat) ? project.chat : [];
  const stageChat = chat.filter((m) => m.stage === stage);
  const kidText = body.text ? scrubPersonal(body.text).trim() : '';
  const newMsgs = [];
  if (kidText) newMsgs.push({ role: 'kid', text: kidText, stage, at: nowIso() });

  const history = [...stageChat, ...newMsgs].map((m) => ({ role: m.role, text: m.text }));
  const out = await callGuide({ stage, design: project.design, history });

  const design = mergeSection(stage, project.design, out.section);
  const guideMsg = {
    role: 'guide', text: cleanSay(out.say), chips: cleanChips(out.chips),
    typing: !!out.allow_typing, stage, at: nowIso(),
  };
  newMsgs.push(guideMsg);

  let nextStage = stage;
  let advanced = false;
  const idx = STAGES.findIndex((s) => s.key === stage);
  if (stage === 'redteam' && out.go_back_to && ['idea', 'hero', 'world', 'bestiary', 'moves'].includes(out.go_back_to)) {
    nextStage = out.go_back_to;
    design.redteam = { checks: [], passed: false };
    advanced = true;
  } else if (out.stage_complete && stage !== 'mockup' && stageMissing(stage, design).length === 0) {
    nextStage = STAGES[idx + 1]?.key || stage;
    advanced = nextStage !== stage;
  }

  const updated = [...chat, ...newMsgs].slice(-MAX_CHAT);
  const prevMax = Math.max(idx, STAGES.findIndex((s) => s.key === project.maxStage));
  const goingBack = stage === 'redteam' && nextStage !== stage;
  const ni = STAGES.findIndex((s) => s.key === nextStage);
  // The furthest stage reached; going back from the Fun Check means the Fun Check must be redone.
  const maxStage = goingBack ? 'redteam' : STAGES[Math.max(prevMax, ni)].key;
  // Finishing a revisited stage jumps back to where the kid was.
  if (advanced && !goingBack && ni <= prevMax && prevMax > idx) nextStage = STAGES[prevMax].key;
  await ref.update({
    design, chat: updated, stage: nextStage, maxStage, updatedAt: FieldValue.serverTimestamp(),
    chatTurns: FieldValue.increment(1),
  });
  return json({ ok: true, stage: nextStage, advanced, design, messages: newMsgs });
});

// Game Studio planning stages and design shape. Shared by client and server (no secrets here).

export const STAGES = [
  { key: 'idea', label: 'Idea', emoji: '💡' },
  { key: 'hero', label: 'Hero', emoji: '🦸' },
  { key: 'world', label: 'World', emoji: '🗺️' },
  { key: 'bestiary', label: 'Creatures', emoji: '🐉' },
  { key: 'moves', label: 'Moves', emoji: '🎵' },
  { key: 'redteam', label: 'Fun Check', emoji: '🔍' },
  { key: 'mockup', label: 'Approve', emoji: '✅' },
];
export const BUILD_STAGE = 'build';

export const BUILD_STEPS = [
  { step: 1, label: 'Make it playable', emoji: '🎮' },
  { step: 2, label: 'Juice and sounds', emoji: '✨' },
  { step: 3, label: 'Levels', emoji: '🗺️' },
  { step: 4, label: 'Polish and screens', emoji: '🏆' },
];
export const MAX_STEP = 10; // steps 5+ are kid-requested tweaks after the game is finished

export const FEEDBACK_CHIPS = [
  'Too hard', 'Too easy', 'More monsters', 'Make it faster', 'Make it slower',
  'Bigger buttons', 'More sparkles', 'Louder sounds', 'It is perfect!',
];

export function stageIndex(key) {
  const i = STAGES.findIndex((s) => s.key === key);
  return i === -1 ? STAGES.length : i;
}

export function emptyDesign() {
  return {
    idea: { gesture: '', gameType: '', name: '' },
    hero: { description: '', base: '', emoji: '', color: '', layers: [] },
    world: { setting: '', levels: [] },
    bestiary: [],
    moves: [],
    redteam: { checks: [], passed: false },
    mockup: '',
  };
}

// What has to be filled in before a stage can be finished.
export function stageMissing(stage, d) {
  switch (stage) {
    case 'idea':
      return [!d.idea?.gesture && 'gesture', !d.idea?.gameType && 'game type', !d.idea?.name && 'name'].filter(Boolean);
    case 'hero':
      return [!d.hero?.description && 'hero description', !d.hero?.emoji && 'hero emoji'].filter(Boolean);
    case 'world':
      return [!d.world?.setting && 'setting', (d.world?.levels || []).length < 3 && '3 levels'].filter(Boolean);
    case 'bestiary':
      return [(d.bestiary || []).length < 2 && 'at least 2 creatures'].filter(Boolean);
    case 'moves':
      return [(d.moves || []).length < 1 && 'at least 1 move'].filter(Boolean);
    case 'redteam':
      return [!d.redteam?.passed && 'all 5 fun checks passed'].filter(Boolean);
    case 'mockup':
      return [!d.mockup && 'mockup'].filter(Boolean);
    default:
      return [];
  }
}

export const RED_TEAM_QUESTIONS = [
  'Would you get bored in the first 10 seconds?',
  'Is there something to DO every second, or do you have to wait around?',
  'Is the main move fun all by itself, or does it feel like work?',
  'Does it feel like a game with a challenge, or like an app with menus?',
  'What is the coolest moment you would show your mom or dad?',
];

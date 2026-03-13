// Static game registry — add new games here or load from Firestore
// Each game's HTML file lives in /public/games/{slug}.html

const GAMES = [
  {
    slug: 'rbi',
    title: 'RBI',
    creator: 'Nolan',
    description: 'Rotary Bureau of Investigation — you\'re the getaway driver! Navigate a procedurally generated city, drive to the bank, survive the heist, and escape through the exit gate before the choppers get you.',
    createdAt: '2026-03-12',
    thumbnail: '/images/rbi-preview.png',
    color: 'from-yellow-500 to-green-700',
  },
  {
    slug: 'guard-the-good-boy',
    title: 'Guard the Good Boy',
    creator: 'Addie',
    description: 'Protect your dog Bluey from villains trying to steal him! Tap enemies to fight them off, collect power-ups, and keep your good boy safe through waves of increasingly tricky baddies.',
    createdAt: '2026-03-12',
    thumbnail: '/images/guard-the-good-boy-preview.png',
    color: 'from-blue-400 to-sky-300',
  },
];

export function getAllGames() {
  return GAMES;
}

export function getGameBySlug(slug) {
  return GAMES.find(g => g.slug === slug) || null;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

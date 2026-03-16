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
  {
    slug: 'fna-hunting',
    title: 'FNA Hunting',
    creator: 'Ivan',
    description: 'You survived a plane crash in the wilderness! Hunt deer, rabbits, bears and wolves with your rifle. Gather wood, find water, build shelters, and craft supplies to survive as long as you can.',
    createdAt: '2026-03-14',
    thumbnail: '/images/fna-hunting-preview.png',
    color: 'from-amber-500 to-green-700',
  },
  {
    slug: 'brick-breaker',
    title: 'Brick Breaker',
    creator: 'Ivan',
    description: 'Classic arcade action! Slide the paddle to bounce the ball and smash all the bricks. 30 levels of increasing difficulty with power-ups, multi-hit bricks, steel walls, and special patterns. How far can you get?',
    createdAt: '2026-03-14',
    thumbnail: '/images/brick-breaker-preview.png',
    color: 'from-purple-500 to-cyan-500',
  },
  {
    slug: 'world-of-warships',
    title: 'World of Warships',
    creator: 'Nolan',
    description: 'Command your battleship in epic WW2 naval combat! Fire cannons and torpedoes, sink enemy destroyers, cruisers, battleships and carriers across endless waves. Full sound effects, particle explosions, island terrain, and strategic AI combat.',
    createdAt: '2026-03-15',
    thumbnail: '/images/world-of-warships-preview.png',
    color: 'from-blue-800 to-gray-700',
  },
  {
    slug: 'capybara',
    title: 'Capybara Glow',
    creator: 'Addie',
    description: 'A magical glow-in-the-dark coloring studio! Paint capybaras, unicorns, elephants, butterflies, dolphins and cats with neon colors that glow and shine. Choose your brush, pick a glowing color, and create neon masterpieces in the dark.',
    createdAt: '2026-03-15',
    thumbnail: '/images/capybara-preview.png',
    color: 'from-pink-500 to-purple-600',
  },
  {
    slug: 'island-attack',
    title: 'Island Attack',
    creator: 'Nolan',
    description: 'Build and defend your island kingdom! Gather resources, construct farms, walls and towers, recruit villagers, and fight off waves of invaders. Upgrade your defenses and grow your civilization — how many waves can you survive?',
    createdAt: '2026-03-15',
    thumbnail: '/images/island-attack-preview.png',
    color: 'from-green-500 to-blue-700',
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

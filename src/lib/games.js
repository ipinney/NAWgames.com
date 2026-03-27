// Static game registry — newest games appear first
// Each game's HTML file lives in /public/games/{slug}.html

const GAMES = [
  {
    slug: 'lizard-launch',
    title: 'Lizard Launch!',
    creator: 'Nolan',
    description: "Sling Oinnaole the crested gecko and Blappy the bearded dragon at bug invaders! Tap to split into three geckos, or unleash Blappy's fire breath. Knock down wood, stone, and glass towers across 5 wild levels!",
    createdAt: '2026-03-27',
    thumbnail: '/images/lizard-launch-preview.png',
    color: 'from-green-400 to-orange-500',
  },
  {
    slug: 'dinosaur-jump',
    title: 'Dinosaur Jump',
    creator: 'Nolan',
    description: 'A dinosaur runs through the desert jumping over cacti and ducking under pterodactyls! Survive 3 minutes to level up — each level gets faster. Collect stars and meat for bonus points. How many levels can you conquer?',
    createdAt: '2026-03-24',
    thumbnail: '/images/dinosaur-jump-preview.png',
    color: 'from-green-500 to-amber-600',
  },
  {
    slug: 'texas-holdem',
    title: 'Texas Hold\'em',
    creator: 'Ivan',
    description: 'Play Texas Hold\'em poker against 4 animal opponents — Mustang, Fox, Bear, Eagle and Wolf! Start with $1,000, play smart, and try to win the whole table. Blinds go up every 5 hands!',
    createdAt: '2026-03-24',
    thumbnail: '/images/texas-holdem-preview.png',
    color: 'from-emerald-600 to-yellow-500',
  },
  {
    slug: 'capybara-press',
    title: 'Capybara Press',
    creator: 'Addie',
    description: 'Tap the capybara to earn coins! Buy upgrades like auto-clickers, capybara friends, flower gardens and spas. Catch golden capybaras for huge bonuses. Complete 5 challenges to reach $5,000 and win!',
    createdAt: '2026-03-22',
    thumbnail: '/images/capybara-press-preview.png',
    color: 'from-amber-400 to-green-500',
  },
  {
    slug: 'singing-hero',
    title: 'Singing Hero',
    creator: 'Addie',
    description: 'Hit the stage and compose your own song by tapping colorful note buttons! Then perform it back from memory for the judges. Simon, Katy and Bruno score your accuracy, rhythm and style. Can you get a perfect 100?',
    createdAt: '2026-03-22',
    thumbnail: '/images/singing-hero-preview.png',
    color: 'from-pink-500 to-amber-400',
  },
  {
    slug: 'snake',
    title: 'Snake Designer',
    creator: 'Wyatt',
    description: 'Design your own snake with custom colors and patterns — solid, striped, rainbow or spots! Then play classic snake with a twist: AI computer snakes compete for pellets. Collect power-ups like shields and speed boosts!',
    createdAt: '2026-03-22',
    thumbnail: '/images/snake-preview.png',
    color: 'from-emerald-400 to-cyan-500',
  },
  {
    slug: 'f1-racing',
    title: 'F1 Racing',
    creator: 'Nolan',
    description: 'Race against MAX, LEWIS, CHARLES, LANDO and CARLOS on a winding Grand Prix track! Collect boost, shield and repair power-ups. Complete 3 laps to finish — can you take 1st place?',
    createdAt: '2026-03-22',
    thumbnail: '/images/f1-racing-preview.png',
    color: 'from-red-500 to-amber-500',
  },
  {
    slug: 'dog-simulator',
    title: 'Dog Simulator',
    creator: 'Addie',
    description: 'Be a dog! Run around an open world, fight cougars, cows, wolves and bears. Find girl dogs to make puppy friends who help you fight! Survive waves of wild animals and raise the biggest puppy pack.',
    createdAt: '2026-03-21',
    thumbnail: '/images/dog-simulator-preview.png',
    color: 'from-amber-400 to-green-600',
  },
  {
    slug: 'mincraft',
    title: 'Mincraft',
    creator: 'Addie',
    description: 'Build houses and shelters in a blocky world! Place and break blocks, build homes for your animals, and survive the night when zombies attack. Everything is a square — just like the real thing!',
    createdAt: '2026-03-21',
    thumbnail: '/images/mincraft-preview.png',
    color: 'from-green-500 to-emerald-700',
  },
  {
    slug: 'cake-decorating',
    title: 'Cake Decorating Studio',
    creator: 'Addie',
    description: 'Decorate cakes, cupcakes, cookies and donuts with colorful icing, sprinkles and toppings! Pick your treat, make it beautiful, then show the judges to win prizes. 6 treat shapes, 25 icing colors, 10 toppings, and unlimited creativity!',
    createdAt: '2026-03-20',
    thumbnail: '/images/cake-decorating-preview.png',
    color: 'from-pink-400 to-purple-500',
  },
  {
    slug: 'keyhero',
    title: 'KeyHero',
    creator: 'Ivan',
    description: 'A rhythm game with real songs! Pick a genre (Classic, Pop, Country), choose your difficulty, then tap the falling notes in time with the music. Taylor Swift, Katy Perry, Dolly Parton, John Denver and more — how high can you combo?',
    createdAt: '2026-03-17',
    thumbnail: '/images/keyhero-preview.png',
    color: 'from-purple-500 to-pink-600',
  },
  {
    slug: 'alien-invasion',
    title: 'Alien Invasion',
    creator: 'Addie',
    description: 'Aliens are hiding in disguise among humans! Use your X-Ray Pad to scan townsfolk and reveal the aliens — when caught, they panic and run! Use auto-aim to shoot them before they escape. But don\'t shoot innocent humans! Find the Alien King to win.',
    createdAt: '2026-03-17',
    thumbnail: '/images/alien-invasion-preview.png',
    color: 'from-green-400 to-purple-700',
  },
  {
    slug: 'island-attack',
    title: 'Island Attack',
    creator: 'Addie',
    description: 'Build and defend your island kingdom! Gather resources, construct farms, walls and towers, recruit villagers, and fight off waves of invaders. Upgrade your defenses and grow your civilization — how many waves can you survive?',
    createdAt: '2026-03-15',
    thumbnail: '/images/island-attack-preview.png',
    color: 'from-green-500 to-blue-700',
  },
  {
    slug: 'capybara',
    title: 'Capybara Glow',
    creator: 'Wyatt',
    description: 'A magical glow-in-the-dark coloring studio! Paint capybaras, unicorns, elephants, butterflies, dolphins and cats with neon colors that glow and shine. Choose your brush, pick a glowing color, and create neon masterpieces in the dark.',
    createdAt: '2026-03-15',
    thumbnail: '/images/capybara-preview.png',
    color: 'from-pink-500 to-purple-600',
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
    slug: 'brick-breaker',
    title: 'Brick Breaker',
    creator: 'Ivan',
    description: 'Classic arcade action! Slide the paddle to bounce the ball and smash all the bricks. 30 levels of increasing difficulty with power-ups, multi-hit bricks, steel walls, and special patterns. How far can you get?',
    createdAt: '2026-03-14',
    thumbnail: '/images/brick-breaker-preview.png',
    color: 'from-purple-500 to-cyan-500',
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
    slug: 'guard-the-good-boy',
    title: 'Guard the Good Boy',
    creator: 'Addie',
    description: 'Protect your dog Bluey from villains trying to steal him! Tap enemies to fight them off, collect power-ups, and keep your good boy safe through waves of increasingly tricky baddies.',
    createdAt: '2026-03-12',
    thumbnail: '/images/guard-the-good-boy-preview.png',
    color: 'from-blue-400 to-sky-300',
  },
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
    slug: 'my-perfect-hotel',
    title: 'My Perfect Hotel',
    creator: 'Addie',
    description: 'You are the hotel maid! Clean rooms before time runs out — make beds, scrub toilets, mop floors, and pick up trash. The boss inspects your work and gives you stars. 5 levels of increasing challenge!',
    createdAt: '2026-03-25',
    thumbnail: '/images/my-perfect-hotel-preview.png',
    color: 'from-pink-400 to-purple-600',
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


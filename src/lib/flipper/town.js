// Fox Hollow generator. Pure, seeded functions shared by the client game and Flip's server tools,
// so the same seed always makes the same houses.
import { NEIGHBORHOODS, CONDITION, ROOMS, COST_BOOK, costFor, MONEY } from './calibration';

// ---------- seeded random ----------
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function rng(seed) {
  let a = hashStr(String(seed));
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (r, [lo, hi]) => lo + r() * (hi - lo);
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const round = (n, to) => Math.round(n / to) * to;

const STREETS = {
  bluebonnet: ['Bluebonnet Ln', 'Prairie St', 'Kettle Ave', 'Sparrow Ct', 'Cotton Row', 'Dewberry Dr'],
  oakrow: ['Oak Row', 'Acorn Way', 'Elm Bend', 'Hickory Ln', 'Pecan Pl', 'Walnut Trl'],
  cypress: ['Cypress Bend', 'Heron Dr', 'Willow Creek', 'Marsh Hollow', 'Egret Ct', 'Moss Ln'],
  lantern: ['Lantern Hill', 'Gaslight St', 'Porch Swing Ln', 'Trolley Ave', 'Belfry Ct', 'Ironwork Way'],
};
const SELLERS = ['Mr. Badger', 'Mrs. Heron', 'Old Mr. Tortoise', 'The Raccoon family', 'Ms. Otter', 'Mr. Armadillo', 'Grandma Possum', 'The Beaver twins'];

const SEVERITY = ['good', 'love', 'rough'];

// What a room needs for each damage level: list of [fixKey, tier].
function roomNeeds(roomKey, level) {
  if (level === 'good') return [];
  const love = level === 'love';
  switch (roomKey) {
    case 'kitchen': return love ? [['kitchen', 'low'], ['paint', 'low']] : [['kitchen', 'mid'], ['floors', 'mid']];
    case 'bath': return love ? [['bath', 'low']] : [['bath', 'mid'], ['plumbing', 'low']];
    case 'living': return love ? [['paint', 'low']] : [['floors', 'mid'], ['windows', 'low']];
    case 'bedrooms': return love ? [['paint', 'low']] : [['floors', 'low'], ['windows', 'low']];
    case 'roof': return love ? [['roof', 'low']] : [['roof', 'mid']];
    case 'systems': return love ? [['hvac', 'low']] : [['hvac', 'mid'], ['electric', 'mid']];
    case 'foundation': return love ? [['foundation', 'low']] : [['foundation', 'mid']];
    case 'outside': return love ? [['yard', 'low']] : [['outside', 'mid'], ['yard', 'mid']];
    default: return [];
  }
}

// The "right" fix list and cost for a house (dedupes items that appear in several rooms).
export function neededFixes(house) {
  const items = {};
  for (const room of ROOMS) {
    for (const [k, tier] of roomNeeds(room.key, house.rooms[room.key])) {
      const t = ['low', 'mid', 'high'];
      if (!items[k] || t.indexOf(tier) > t.indexOf(items[k])) items[k] = tier;
    }
  }
  let total = 0;
  const list = Object.entries(items).map(([k, tier]) => {
    let c = costFor(k, tier, k === 'paint' || k === 'floors' ? house.sqft : house.sqft);
    if (k === 'bath') c *= Math.max(1, Math.round(house.baths));
    total += c;
    return { key: k, tier, cost: c };
  });
  return { list, total };
}

export function makeHouse(seed, hoodKey, opts = {}) {
  const r = rng(seed);
  const hood = NEIGHBORHOODS[hoodKey];
  const condKey = opts.condition || pick(r, ['B', 'B', 'C', 'C', 'D']);
  const cond = CONDITION[condKey];
  const sqft = round(between(r, hood.sqft), 10);
  const beds = Math.round(between(r, hood.beds));
  const baths = Math.round(between(r, hood.baths) * 2) / 2;
  const built = Math.round(between(r, hood.built));
  const twoStory = hoodKey === 'cypress' ? r() < 0.75 : false;

  // Damage: pick N rooms to be damaged.
  const nBad = Math.round(between(r, cond.rooms));
  const order = [...ROOMS.map((x) => x.key)].sort(() => r() - 0.5);
  const rooms = {};
  ROOMS.forEach((x) => { rooms[x.key] = 'good'; });
  order.slice(0, nBad).forEach((k) => { rooms[k] = condKey === 'B' ? (r() < 0.7 ? 'love' : 'rough') : (r() < 0.35 ? 'love' : 'rough'); });

  const arv = round(sqft * between(r, hood.fixedPsf), 1000);
  const house = {
    id: `fh-${hashStr(String(seed)).toString(36)}`,
    seed: String(seed), hood: hoodKey, hoodName: hood.name,
    address: `${100 + Math.floor(r() * 1800)} ${pick(r, STREETS[hoodKey])}`,
    seller: pick(r, SELLERS),
    sqft, beds, baths, built, twoStory, condition: condKey, conditionLabel: cond.label, rooms,
    color: pick(r, ['#fca5a5', '#fcd34d', '#a7f3d0', '#bfdbfe', '#ddd6fe', '#fbcfe8', '#fde68a']),
    roofColor: pick(r, ['#7c2d12', '#334155', '#78350f', '#1e3a8a', '#3f3f46']),
  };
  const fix = neededFixes(house);
  // Asking price: the "as-is" value, plus some sellers over-ask.
  // Real markets price a fixer at roughly: fixed-up value, minus repairs, minus a small markdown.
  const asIs = arv - fix.total * between(r, [1.0, 1.12]) - arv * between(r, [0.05, 0.11]);
  const overAsk = opts.overAsk ?? between(r, [0.02, 0.12]);
  house.arv = arv;                       // hidden "true" fixed-up value
  house.fixTotal = fix.total;            // hidden "true" mid-tier fix cost
  house.asIs = round(asIs, 1000);
  house.price = round(asIs * (1 + overAsk), 1000);    // list price
  house.sellerMin = round(asIs * (1 - between(r, [0.01, 0.05])), 1000);  // lowest the seller will take
  if (opts.motivated) {
    // A seller who needs to sell fast: will take a price at or under the 70% rule.
    const mo = Math.max(10000, arv * MONEY.rule - fix.total);
    house.sellerMin = round(mo * between(r, [0.96, 1.04]), 1000);
    house.price = round(Math.max(house.sellerMin * 1.04, Math.min(house.price, mo * between(r, [1.04, 1.14]))), 1000);
    house.motivated = true;
  }
  if (house.price < house.sellerMin + 2000) house.price = house.sellerMin + 2000 + round(between(r, [0, 6000]), 1000);
  house.deal = Math.round(((arv * MONEY.rule - fix.total) - house.price) / 1000) * 1000; // >0 = good deal at list price
  return house;
}

// A page of listings for a neighborhood. Mix of good and bad deals.
export function listings(seed, hoodKey, n = 6) {
  const r = rng(`${seed}:${hoodKey}:list`);
  const out = [];
  const nGood = n >= 5 ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const motivated = i < nGood;
    const condition = motivated ? pick(r, ['B', 'C', 'C', 'D']) : pick(r, ['A', 'B', 'B', 'C', 'C', 'D']);
    const overAsk = r() < 0.4 ? between(r, [0.18, 0.3]) : between(r, [-0.04, 0.08]);
    out.push(makeHouse(`${seed}:${hoodKey}:${i}`, hoodKey, { condition, overAsk, motivated }));
  }
  return out.sort(() => r() - 0.5);
}

export function allListings(seed, nPer = 5) {
  return Object.keys(NEIGHBORHOODS).flatMap((k) => listings(seed, k, nPer));
}

// Sold homes near a house. Good comps are fixed-up, similar size, same neighborhood, sold recently.
// Decoys teach what NOT to use.
export function comps(house, n = 7) {
  const r = rng(`${house.seed}:comps`);
  const hood = NEIGHBORHOODS[house.hood];
  const out = [];
  const psf = house.arv / house.sqft;
  const nGood = 4;
  for (let i = 0; i < nGood; i++) {
    const sqft = round(house.sqft * between(r, [0.88, 1.12]), 10);
    const price = round(sqft * psf * between(r, [0.95, 1.05]), 1000);
    out.push({ id: `c${i}`, address: `${100 + Math.floor(r() * 1800)} ${pick(r, STREETS[house.hood])}`, hood: hood.name,
      sqft, beds: house.beds + (r() < 0.3 ? 1 : 0), baths: house.baths, built: house.built + Math.round(between(r, [-6, 6])),
      updated: true, monthsAgo: Math.round(between(r, [1, 6])), price, good: true });
  }
  const decoys = [
    { why: 'Way bigger house', mod: (c) => { c.sqft = round(house.sqft * 1.7, 10); c.price = round(c.sqft * psf * 1.05, 1000); } },
    { why: 'Not fixed up', mod: (c) => { c.updated = false; c.price = round(c.sqft * psf * 0.62, 1000); } },
    { why: 'Different neighborhood', mod: (c) => {
      const other = Object.values(NEIGHBORHOODS).find((h) => h.key !== house.hood && h.key !== 'lantern') || NEIGHBORHOODS.bluebonnet;
      const o = house.hood === 'lantern' ? NEIGHBORHOODS.oakrow : (house.hood === 'bluebonnet' ? NEIGHBORHOODS.lantern : other);
      c.hood = o.name; c.price = round(c.sqft * between(r, o.fixedPsf), 1000); } },
    { why: 'Sold 2 years ago', mod: (c) => { c.monthsAgo = 24; c.price = round(c.price * 0.86, 1000); } },
  ];
  decoys.sort(() => r() - 0.5).slice(0, n - nGood).forEach((d, i) => {
    const sqft = round(house.sqft * between(r, [0.92, 1.08]), 10);
    const c = { id: `d${i}`, address: `${100 + Math.floor(r() * 1800)} ${pick(r, STREETS[house.hood])}`, hood: hood.name,
      sqft, beds: house.beds, baths: house.baths, built: house.built, updated: true, monthsAgo: Math.round(between(r, [1, 5])),
      price: round(sqft * psf, 1000), good: false, why: d.why };
    d.mod(c);
    out.push(c);
  });
  return out.sort(() => r() - 0.5);
}

// Adjusted value of a comp after the kid's size adjustment. Simple: price per sq ft times our size.
export function compValueFor(house, comp) {
  return round((comp.price / comp.sqft) * house.sqft, 1000);
}

// Surprise cards for the renovation phase.
export const SURPRISES = [
  { key: 'subfloor', title: 'Rotten floor under the bathroom!', emoji: '🪵', cost: [2500, 5000], months: 0, room: 'bath',
    lesson: 'Old leaks hide under floors. That is why we keep a surprise fund.' },
  { key: 'termites', title: 'Termites in the back wall!', emoji: '🐜', cost: [3000, 6000], months: 0,
    lesson: 'Bugs eat wood you cannot see. An inspection before buying can catch this.' },
  { key: 'permit', title: 'The city permit is late', emoji: '📋', cost: [0, 0], months: 1,
    lesson: 'Waiting costs money too. Every extra month you pay the loan, taxes and bills.' },
  { key: 'foundation', title: 'A crack in the foundation!', emoji: '🧱', cost: [4500, 9000], months: 0,
    lesson: 'Houston clay soil moves around. Foundation fixes are some of the biggest surprises.' },
  { key: 'prices', title: 'Building supplies cost more this month', emoji: '📈', costPct: [0.04, 0.07], months: 0,
    lesson: 'Prices for wood and tile go up and down. Your budget needs some room.' },
  { key: 'rain', title: 'A huge storm! Roof leak!', emoji: '⛈️', cost: [1500, 4000], months: 0, room: 'roof',
    lesson: 'Houston storms find every weak spot. Fix roofs early.' },
  { key: 'crew', title: 'The work crew got sick', emoji: '🤒', cost: [0, 0], months: 1,
    lesson: 'Projects take longer than you think. Plan for an extra month.' },
  { key: 'wiring', title: 'Old wiring is not safe', emoji: '⚡', cost: [2500, 5500], months: 0,
    lesson: 'Old houses sometimes have old wiring. Safety always comes first.' },
];

export function surpriseDeck(seed, count, fixBudget) {
  const r = rng(`${seed}:surprises`);
  const deck = [...SURPRISES].sort(() => r() - 0.5).slice(0, count);
  return deck.map((s, i) => {
    let cost = s.costPct ? round(fixBudget * between(r, s.costPct), 100) : round(between(r, s.cost), 100);
    return { ...s, cost, atMonth: 1 + Math.floor(r() * 3) + (i > 0 ? 1 : 0) };
  });
}

// Buyer offers when selling. marketMult < 1 means a market dip.
export function buyerOffers(seed, house, listPrice, { finish = 1, marketMult = 1, lowball = false } = {}) {
  const r = rng(`${seed}:offers:${listPrice}`);
  const fair = house.arv * marketMult * (0.9 + 0.1 * finish);   // a worse finish sells for less
  const ratio = listPrice / fair;
  const offers = [];
  const names = ['The Rabbit family', 'Dr. Owl', 'Mr. and Mrs. Deer', 'Captain Pelican', 'The Fox cousins', 'Ms. Squirrel'];
  // Too high a list price scares buyers away.
  const nOffers = ratio > 1.12 ? 0 : ratio > 1.04 ? 1 : 2 + (r() < 0.5 ? 1 : 0);
  for (let i = 0; i < nOffers; i++) {
    const base = Math.min(listPrice, fair) * between(r, lowball ? [0.88, 0.95] : [0.94, 1.0]);
    const nm = names.splice(Math.floor(r() * names.length), 1)[0];
    offers.push({ id: `o${i}`, buyer: nm, amount: round(base, 1000), week: 1 + i + Math.floor(r() * 2) });
  }
  return offers.sort((a, b) => a.week - b.week);
}

// Seller counter-offer logic for negotiation.
export function sellerResponse(house, offer, round_ = 1) {
  if (offer >= house.price) return { accept: true, amount: house.price, say: `${house.seller} says yes right away! (You may have paid too much.)` };
  if (offer >= house.sellerMin) return { accept: true, amount: offer, say: `${house.seller} thinks about it... and says YES!` };
  if (offer < house.sellerMin * 0.85) return { accept: false, counter: house.price - 2000 * round_, say: `${house.seller} looks grumpy. "That is way too low!"` };
  const counter = round(Math.max(house.sellerMin, (offer + house.price) / 2), 1000);
  return { accept: false, counter, say: `${house.seller} says: "How about ${'$' + counter.toLocaleString('en-US')}?"` };
}

export const FIX_KEYS = Object.keys(COST_BOOK);

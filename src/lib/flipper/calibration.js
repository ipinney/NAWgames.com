// Fox Hollow is pretend, but every number band below is set from real Houston 2026 data so the
// skills Addie learns carry over to Real Deals. Shared by client and server code.

export const SOURCES = [
  { label: 'Harbert Group, Best Houston Suburbs for Flippers 2026', url: 'https://www.harbertgroup.com/blog/1080/' },
  { label: 'Harbert Group, Texas Hard Money Loans 2026', url: 'https://www.harbertgroup.com/blog/1051/' },
  { label: 'Harbert Group, Houston Market Update Sept 2026 (HAR MLS data)', url: 'https://www.harbertgroup.com/blog/1061/' },
];

// Each neighborhood is modeled on real Houston areas.
export const NEIGHBORHOODS = {
  bluebonnet: {
    key: 'bluebonnet', name: 'Bluebonnet Flats', modeledOn: 'Aldine, Channelview (77032, 77530)',
    blurb: 'Small older bungalows. Cheapest houses in town and the easiest flips.',
    sqft: [900, 1300], built: [1950, 1966], beds: [2, 3], baths: [1, 1.5],
    fixedPsf: [185, 215],   // after-repair value per sq ft (ARV $200-260k)
    color: '#60a5fa', x: 18, y: 64,
  },
  oakrow: {
    key: 'oakrow', name: 'Oak Row', modeledOn: 'Pasadena, Spring (77504, 77373)',
    blurb: '1950s to 1970s ranch houses. Middle prices, solid neighborhoods.',
    sqft: [1300, 1800], built: [1958, 1978], beds: [3, 3], baths: [1.5, 2],
    fixedPsf: [182, 205],   // ARV $260-340k
    color: '#34d399', x: 44, y: 34,
  },
  cypress: {
    key: 'cypress', name: 'Cypress Bend', modeledOn: 'Humble, Cy-Fair two-stories (77338)',
    blurb: 'Bigger two-story homes. Bigger budgets, bigger risk, bigger rewards.',
    sqft: [1900, 2600], built: [1980, 2002], beds: [3, 4], baths: [2, 2.5],
    fixedPsf: [172, 190],   // ARV $360-460k
    color: '#f59e0b', x: 74, y: 58,
  },
  lantern: {
    key: 'lantern', name: 'Lantern Hill', modeledOn: 'The Heights, Montrose',
    blurb: 'Fancy old bungalows. Fixed-up homes here sell for a lot.',
    sqft: [1400, 2000], built: [1922, 1948], beds: [2, 3], baths: [1, 2],
    fixedPsf: [345, 380],   // ARV $560-700k
    color: '#f472b6', x: 70, y: 18,
  },
};

// How much below "fixed-up value" a house sells for, by condition.
export const CONDITION = {
  A: { label: 'Almost ready', discount: [0.12, 0.17], rooms: [0, 1] },
  B: { label: 'Needs some love', discount: [0.25, 0.32], rooms: [2, 3] },
  C: { label: 'Rough', discount: [0.36, 0.44], rooms: [3, 5] },
  D: { label: 'Very rough', discount: [0.46, 0.55], rooms: [5, 7] },
};

// Cost book. Each item has low / mid / high Houston prices. perSqft items scale with house size.
export const COST_BOOK = {
  paint:      { name: 'Paint inside', emoji: '🎨', perSqft: true, low: 2, mid: 3, high: 4.5, why: 'Fresh paint is the cheapest way to make a house look new.' },
  floors:     { name: 'New floors', emoji: '🪵', perSqft: true, low: 5, mid: 7, high: 10, why: 'Waterproof plank floors are what Houston buyers want.' },
  kitchen:    { name: 'Kitchen redo', emoji: '🍳', low: 9000, mid: 18000, high: 35000, why: 'Buyers fall in love with kitchens. Cosmetic is cheap, a full redo is not.' },
  bath:       { name: 'Bathroom redo', emoji: '🛁', low: 4500, mid: 9000, high: 18000, why: 'New tile, toilet, sink and tub. Price is for one bathroom.' },
  roof:       { name: 'New roof', emoji: '🏠', perSqft: true, low: 6, mid: 8, high: 11, why: 'Old roofs leak. Banks and buyers check the roof first.' },
  hvac:       { name: 'New A/C', emoji: '❄️', low: 5500, mid: 7500, high: 9000, why: 'Nobody buys a Houston house with a broken air conditioner.' },
  foundation: { name: 'Fix foundation', emoji: '🧱', low: 4500, mid: 9000, high: 18000, why: 'Houston clay soil moves. Small fixes are shims, big ones are steel piers.' },
  windows:    { name: 'New windows', emoji: '🪟', low: 4000, mid: 7000, high: 11000, why: 'Old windows leak air and look tired.' },
  electric:   { name: 'Electrical', emoji: '⚡', low: 2500, mid: 4000, high: 8000, why: 'Old wiring and panels can be unsafe. Inspectors check it.' },
  plumbing:   { name: 'Plumbing', emoji: '🚰', low: 3000, mid: 6000, high: 10000, why: 'Old pipes leak. A full repipe costs the most.' },
  outside:    { name: 'Outside paint', emoji: '🖌️', low: 4000, mid: 6000, high: 9000, why: 'First impressions start at the curb.' },
  yard:       { name: 'Yard', emoji: '🌳', low: 1500, mid: 3000, high: 6000, why: 'Mow, mulch, plant flowers. Cheap and buyers notice.' },
};

// Which rooms exist and which fixes belong to each.
export const ROOMS = [
  { key: 'kitchen', name: 'Kitchen', fixes: ['kitchen', 'floors', 'paint'] },
  { key: 'bath', name: 'Bathroom', fixes: ['bath', 'plumbing'] },
  { key: 'living', name: 'Living room', fixes: ['floors', 'paint', 'windows'] },
  { key: 'bedrooms', name: 'Bedrooms', fixes: ['floors', 'paint', 'windows'] },
  { key: 'roof', name: 'Roof', fixes: ['roof'] },
  { key: 'systems', name: 'A/C and wiring', fixes: ['hvac', 'electric'] },
  { key: 'foundation', name: 'Foundation', fixes: ['foundation'] },
  { key: 'outside', name: 'Outside and yard', fixes: ['outside', 'yard'] },
];

// Money rules for the town, from Houston hard-money and closing data.
export const MONEY = {
  bank: {
    name: 'Town Bank',
    rate: 0.11,              // yearly interest, interest-only
    points: 0.02,            // 2 points = 2% of the loan up front
    maxLoanToCost: 0.80,     // lends up to 80% of buy + fix
    maxLoanToArv: 0.70,      // and never more than 70% of after-repair value
  },
  buyClosingPct: 0.015,      // title, survey, fees when buying
  sellCostPct: 0.06,         // agents 5% + seller costs 1%
  taxPctYear: 0.022,         // Harris County style property tax, per year
  insuranceYear: 1800,
  utilitiesMonth: 150,
  rule: 0.70,                // 70% rule: max offer = 70% of ARV minus fix cost
  surpriseFundPct: 0.12,     // recommended surprise fund
};

export function money(n) {
  const v = Math.round(Number(n) || 0);
  const s = Math.abs(v).toLocaleString('en-US');
  return (v < 0 ? '-$' : '$') + s;
}

export function costFor(itemKey, tier, sqft) {
  const it = COST_BOOK[itemKey];
  if (!it) return 0;
  const base = it[tier] ?? it.mid;
  return Math.round((it.perSqft ? base * sqft : base) / 50) * 50;
}

export function monthlyHolding({ price, loan = 0 }) {
  const interest = loan * MONEY.bank.rate / 12;
  const tax = price * MONEY.taxPctYear / 12;
  const ins = MONEY.insuranceYear / 12;
  return { interest: Math.round(interest), tax: Math.round(tax), insurance: Math.round(ins), utilities: MONEY.utilitiesMonth,
    total: Math.round(interest + tax + ins + MONEY.utilitiesMonth) };
}

export function maxLoan({ price, fix, arv }) {
  return Math.round(Math.min((price + fix) * MONEY.bank.maxLoanToCost, arv * MONEY.bank.maxLoanToArv) / 100) * 100;
}

export function maxOffer({ arv, fix }) {
  return Math.max(0, Math.round((arv * MONEY.rule - fix) / 1000) * 1000);
}

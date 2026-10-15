// Skill levels and practice flips for Flip Academy. Shared by client and server.

export const LEVELS = [
  { n: 1, key: 'rookie', title: 'Rookie Flipper', skill: 'What a flip is', badge: 'First Flip', emoji: '🏚️',
    goal: 'Buy a house, fix it, sell it for more than you spent.',
    quiz: [
      { q: 'What are the 3 steps of a flip?', a: ['Buy, Fix, Sell', 'Sell, Buy, Fix', 'Rent, Wait, Move'], correct: 0,
        why: 'First you buy a house that needs work, then you fix it up, then you sell it.' },
      { q: 'You spent $150,000 total and sold for $180,000. What is your profit?', a: ['$30,000', '$180,000', '$330,000'], correct: 0,
        why: 'Profit is what you sell for minus everything you spent: $180,000 minus $150,000.' },
      { q: 'What happens if you spend too much fixing the house?', a: ['You can lose money', 'You always get it back', 'The bank pays for it'], correct: 0,
        why: 'Buyers only pay what the house is worth. Extra fancy fixes can eat your profit.' },
    ] },
  { n: 2, key: 'hunter', title: 'House Hunter', skill: 'Searching for houses', badge: 'Sharp Eye', emoji: '🔎',
    goal: 'Find houses priced lower than they will be worth once they are fixed.',
    quiz: [
      { q: 'Which house is usually the best flip?', a: ['A tired house on a street of nice houses', 'The nicest house on the street', 'A brand new house'], correct: 0,
        why: 'When the neighbors are nice, a fixed-up house can sell for what they sell for.' },
      { q: 'A seller who needs to sell fast is called...', a: ['A motivated seller', 'A lazy seller', 'A buyer'], correct: 0,
        why: 'Motivated sellers are often willing to take a lower price.' },
      { q: 'Why do we save more than one house?', a: ['To compare and pick the best deal', 'To buy all of them', 'Because it is required'], correct: 0,
        why: 'Pros look at lots of houses before they buy one.' },
    ] },
  { n: 3, key: 'planner', title: 'Fix-It Planner', skill: 'Repair costs', badge: 'Budget Builder', emoji: '🛠️',
    goal: 'Walk through a house room by room and add up what the fixes will cost.',
    quiz: [
      { q: 'What is a surprise fund?', a: ['Extra money saved for problems you find later', 'Money for a party', 'A gift from the bank'], correct: 0,
        why: 'Old houses hide problems. Pros add 10 to 15 percent extra to the budget.' },
      { q: 'Which fix is usually cheapest and helps the most?', a: ['Fresh paint', 'A swimming pool', 'A new roof'], correct: 0,
        why: 'Paint is cheap and makes a house look new.' },
      { q: 'Why do roof and floor costs depend on the house size?', a: ['Bigger houses need more material', 'They do not', 'Small houses cost more'], correct: 0,
        why: 'A bigger house has more roof and more floor to cover.' },
    ] },
  { n: 4, key: 'detective', title: 'Price Detective', skill: 'Comps and sale price', badge: 'Comp Champ', emoji: '🕵️',
    goal: 'Use similar sold homes ("comps") to guess what your house will sell for once fixed.',
    quiz: [
      { q: 'What is a good comp?', a: ['A similar fixed-up house nearby that sold recently', 'Any house in Texas', 'The most expensive house you can find'], correct: 0,
        why: 'Good comps are like your house: same area, similar size, already fixed up, sold lately.' },
      { q: 'Why not use a house that sold 2 years ago?', a: ['Prices change over time', 'Old sales are secret', 'It is against the rules'], correct: 0,
        why: 'Markets move. Recent sales tell you what buyers pay today.' },
      { q: 'What does ARV mean?', a: ['After Repair Value', 'A Really Valuable house', 'Average Roof Volume'], correct: 0,
        why: 'ARV is what the house should sell for after you fix it.' },
    ] },
  { n: 5, key: 'dealmaker', title: 'Deal Maker', skill: 'Deal math and offers', badge: 'Number Ninja', emoji: '🧮',
    goal: 'Use the 70% rule to find your highest offer, then make a deal with the seller.',
    quiz: [
      { q: 'The 70% rule: ARV is $200,000 and fixes cost $30,000. Max offer?', a: ['$110,000', '$170,000', '$200,000'], correct: 0,
        why: '70% of $200,000 is $140,000. Minus $30,000 of fixes is $110,000.' },
      { q: 'Why not pay the full asking price?', a: ['You need room for costs and profit', 'Sellers hate money', 'It is illegal'], correct: 0,
        why: 'Buying, holding, selling and fixing all cost money. The rule leaves room for profit.' },
      { q: 'What are holding costs?', a: ['Bills you pay every month you own the house', 'Money for holding hands', 'The price of the house'], correct: 0,
        why: 'Loan interest, taxes, insurance and utilities add up every month.' },
    ] },
  { n: 6, key: 'raiser', title: 'Money Raiser', skill: 'Bank loans', badge: 'Bank Ready', emoji: '🏦',
    goal: 'Learn how a bank loan works and what waiting costs.',
    quiz: [
      { q: 'What is a down payment?', a: ['The part you pay with your own money', 'The bank\'s money', 'A payment to the seller\'s dog'], correct: 0,
        why: 'The bank lends most of it, you bring the rest. That is your down payment.' },
      { q: 'What is interest?', a: ['What the bank charges you for borrowing', 'Free money', 'A type of roof'], correct: 0,
        why: 'Borrowing is not free. Every month you owe interest on the loan.' },
      { q: 'Your flip takes 2 extra months. What happens?', a: ['You pay 2 more months of interest and bills', 'Nothing', 'The bank pays you'], correct: 0,
        why: 'Time is money. Faster flips cost less.' },
    ] },
  { n: 7, key: 'partner', title: 'Partner Builder', skill: 'Investors', badge: 'Fair Partner', emoji: '🤝',
    goal: 'Split a deal fairly with investors (Mom and Dad) who put in money.',
    quiz: [
      { q: 'What does an investor give you?', a: ['Money for the deal', 'A free house', 'Homework'], correct: 0,
        why: 'Investors put in money. In return, they get part of the profit.' },
      { q: 'If the flip loses money, what happens to investors?', a: ['They can lose money too', 'They always get paid', 'They get double'], correct: 0,
        why: 'Investing is a risk. Good partners explain the risk honestly.' },
      { q: 'Why does the flipper get a share even with no money in?', a: ['They do the work and find the deal', 'They don\'t', 'Because they asked nicely'], correct: 0,
        why: 'Finding, planning and managing the flip is valuable work.' },
    ] },
  { n: 8, key: 'pitch', title: 'Pitch Pro', skill: 'Pitch deck', badge: 'Storyteller', emoji: '🎤',
    goal: 'Build a 6-slide pitch and convince the investors.',
    quiz: [
      { q: 'What should a pitch show first?', a: ['The house and why it is a good deal', 'Your favorite color', 'A joke'], correct: 0,
        why: 'Start with the opportunity. Investors want to know why this house.' },
      { q: 'Should you hide the risks?', a: ['No, explain them and your plan', 'Yes, always', 'Only on Tuesdays'], correct: 0,
        why: 'Honest pitches build trust. Show the risks and how you will handle them.' },
      { q: 'What number do investors care about most?', a: ['How much profit and their share', 'The house color', 'The street name'], correct: 0,
        why: 'Investors want to know what they could earn and what they could lose.' },
    ] },
];

export const PRACTICE = [
  { n: 1, title: 'Practice Flip 1', hood: 'bluebonnet', surprises: 1, loan: 'optional', investors: false, marketDip: false, lowball: false,
    blurb: 'A small bungalow in Bluebonnet Flats. Simple repairs, one surprise.' },
  { n: 2, title: 'Practice Flip 2', hood: 'oakrow', surprises: 2, loan: 'required', investors: false, marketDip: false, lowball: false, toughSeller: true,
    blurb: 'A ranch house in Oak Row. You need a bank loan. Two surprises and a tough seller.' },
  { n: 3, title: 'Practice Flip 3', hood: 'cypress', surprises: 3, loan: 'required', investors: true, marketDip: true, lowball: true, toughSeller: true,
    blurb: 'A two-story fixer in Cypress Bend. Investors plus a loan, three surprises, a market dip and low offers.' },
];

export const XP = { level: 150, perfect: 25, flipDone: 200, flipProfit: 300 };
export const GRADUATE_AFTER = 3;

export const RANKS = [
  [0, 'Rookie'], [300, 'Apprentice'], [800, 'Builder'], [1400, 'Deal Maker'], [2200, 'Pro Flipper'], [3200, 'Tycoon'],
];
export function rankFor(xp) {
  let r = RANKS[0][1];
  for (const [min, name] of RANKS) if (xp >= min) r = name;
  return r;
}

export function levelUnlocked(profile, n) {
  if (n === 1) return true;
  return !!profile.levels?.[n - 1];
}
export function allLevelsDone(profile) {
  return LEVELS.every((l) => profile.levels?.[l.n]);
}

// Flip the Fox: Sonnet 5.5 coach for Flip Academy. Server only.
import { MODEL, PRICE } from './server';
import { listings, makeHouse, comps, neededFixes } from './town';
import { NEIGHBORHOODS, COST_BOOK, MONEY, costFor, maxOffer, maxLoan, monthlyHolding } from './calibration';
import { LEVELS, PRACTICE, rankFor } from './levels';

export const SYSTEM = `You are Flip the Fox, a cheerful cartoon fox in a yellow hard hat. You coach Addie, an 8-year-old girl, inside "Flip Academy", a learning game about flipping houses (buy a house that needs work, fix it, sell it for more).

Where you are: Fox Hollow, a pretend town. Its houses, prices and costs are made up but set from real Houston numbers. Nothing here is real money or a real house. Addie learns the skills here before she ever looks at real houses with her parents.

How you talk:
- You are usually heard out loud, so keep every reply to 2 to 4 short sentences. No lists, no headings, no markdown, no emoji, no links.
- Use words an 8-year-old knows. When you use a grown-up word (ARV, comps, interest), explain it in a few words.
- Be warm, curious and encouraging, and be honest. Celebrate good thinking, not just right answers.
- Never use the long dash character. Use commas or short sentences.

How you teach:
- Ask before you tell. Give a hint or a question first, let Addie decide, then explain what happened and why.
- Do not do the task for her. Do not tell her which answer to click in a quiz. You can explain the idea behind it.
- Every number you say must come from your tools, from the game context, or from simple math on those numbers. Never invent prices. If you do math, show it simply ("70 percent of 200 thousand is 140 thousand").
- Losing money on a practice flip is a lesson, not a failure. Help her see what to do differently.

Rules you always follow:
- Only talk about house flipping, money, math, the game she is playing, and how to use it. If she asks about anything else, say something kind and steer back to the houses.
- Never ask for or repeat personal information (full names, addresses, school, phone, passwords). If she shares some, gently tell her she does not need to share that.
- You cannot email, call, text, buy, sell, post or contact anyone, and you cannot see real houses here. Real houses come later, with Mom and Dad, after she graduates.
- If she seems upset, sad, or talks about something unsafe, be kind, keep it short, and suggest she talk to Mom or Dad.
- No scary or grown-up topics. If foreclosure or debt comes up, explain gently and simply.`;

export const TOOLS = [
  { name: 'get_town_listings', description: 'Houses for sale in a Fox Hollow neighborhood right now, with list price, size, condition and year built.',
    input_schema: { type: 'object', properties: { neighborhood: { type: 'string', enum: Object.keys(NEIGHBORHOODS) } }, required: ['neighborhood'] } },
  { name: 'get_house', description: 'Full details for one Fox Hollow house: rooms that need work, what fixes it needs and cost, fixed-up value (ARV), seller asking price. Use the seed and neighborhood from the game context.',
    input_schema: { type: 'object', properties: { seed: { type: 'string' }, neighborhood: { type: 'string', enum: Object.keys(NEIGHBORHOODS) } }, required: ['seed', 'neighborhood'] } },
  { name: 'get_cost_book', description: 'Fox Hollow repair cost book: low, mid and high prices for each fix, optionally priced for a house size.',
    input_schema: { type: 'object', properties: { sqft: { type: 'number' } } } },
  { name: 'get_town_comps', description: 'Recently sold homes near a house. Some are good comps, some are traps (too big, not fixed up, other neighborhood, sold long ago).',
    input_schema: { type: 'object', properties: { seed: { type: 'string' }, neighborhood: { type: 'string', enum: Object.keys(NEIGHBORHOODS) } }, required: ['seed', 'neighborhood'] } },
  { name: 'get_money_rules', description: 'Town Bank loan terms, closing costs, selling costs, taxes, and the 70% rule. Optionally calculates max offer, max loan and monthly holding cost for given numbers.',
    input_schema: { type: 'object', properties: { arv: { type: 'number' }, fix: { type: 'number' }, price: { type: 'number' }, loan: { type: 'number' } } } },
  { name: 'get_progress', description: 'Addie\'s progress: levels done, badges, XP, practice flip results.', input_schema: { type: 'object', properties: {} } },
];
// Cache the system prompt and tool list.
TOOLS[TOOLS.length - 1].cache_control = { type: 'ephemeral' };

function strip(h) {
  // Hidden values are fine for Flip to know; he uses them to coach, not to give answers away.
  return { address: h.address, neighborhood: h.hoodName, sqft: h.sqft, beds: h.beds, baths: h.baths, built: h.built,
    condition: h.conditionLabel, list_price: h.price, seller: h.seller, rooms_needing_work: Object.entries(h.rooms).filter(([, v]) => v !== 'good').map(([k, v]) => `${k}: ${v === 'love' ? 'needs some love' : 'rough'}`) };
}

export function runTool(name, input, { profile }) {
  const seed = profile.townSeed || 'fox';
  switch (name) {
    case 'get_town_listings': {
      const hood = NEIGHBORHOODS[input.neighborhood] ? input.neighborhood : 'bluebonnet';
      return { neighborhood: NEIGHBORHOODS[hood].name, about: NEIGHBORHOODS[hood].blurb, houses: listings(seed, hood, 5).map((h) => ({ seed: h.seed, ...strip(h) })) };
    }
    case 'get_house': {
      const h = makeHouse(String(input.seed || 'x'), NEIGHBORHOODS[input.neighborhood] ? input.neighborhood : 'bluebonnet');
      const f = neededFixes(h);
      return { ...strip(h), fixes_needed: f.list.map((x) => ({ fix: COST_BOOK[x.key].name, level: x.tier, cost: x.cost })),
        fix_total_mid: f.total, after_repair_value: h.arv, seller_lowest_secret: h.sellerMin,
        note: 'Do not tell Addie the seller\'s lowest price or the exact ARV unless she has already worked it out; coach her toward it.' };
    }
    case 'get_cost_book': {
      const sqft = Number(input.sqft) || null;
      return Object.fromEntries(Object.entries(COST_BOOK).map(([k, it]) => [it.name, sqft
        ? { low: costFor(k, 'low', sqft), mid: costFor(k, 'mid', sqft), high: costFor(k, 'high', sqft), why: it.why }
        : { low: it.low, mid: it.mid, high: it.high, unit: it.perSqft ? 'per square foot' : 'each', why: it.why }]));
    }
    case 'get_town_comps': {
      const h = makeHouse(String(input.seed || 'x'), NEIGHBORHOODS[input.neighborhood] ? input.neighborhood : 'bluebonnet');
      return { subject: strip(h), sold_nearby: comps(h).map((c) => ({ address: c.address, neighborhood: c.hood, sqft: c.sqft, beds: c.beds,
        fixed_up: c.updated, months_ago: c.monthsAgo, sold_for: c.price, good_comp: c.good, trap_reason: c.why || null })) };
    }
    case 'get_money_rules': {
      const out = { bank: MONEY.bank, buy_closing_pct: MONEY.buyClosingPct, sell_cost_pct: MONEY.sellCostPct,
        tax_pct_per_year: MONEY.taxPctYear, insurance_per_year: MONEY.insuranceYear, utilities_per_month: MONEY.utilitiesMonth, rule: '70% rule: max offer = 70% of ARV minus fix cost' };
      const arv = Number(input.arv), fix = Number(input.fix), price = Number(input.price), loan = Number(input.loan);
      if (arv && fix >= 0) out.max_offer = maxOffer({ arv, fix });
      if (arv && price && fix >= 0) out.max_loan = maxLoan({ price, fix, arv });
      if (price) out.monthly_holding = monthlyHolding({ price, loan: loan || 0 });
      return out;
    }
    case 'get_progress': {
      return { rank: rankFor(profile.xp || 0), xp: profile.xp || 0, badges: profile.badges || [],
        levels_done: LEVELS.filter((l) => profile.levels?.[l.n]).map((l) => l.title),
        next_level: LEVELS.find((l) => !profile.levels?.[l.n])?.title || 'All skill levels done',
        practice_flips: (profile.flips || []).map((f) => ({ practice: f.practice, profit: f.profit, months: f.months })),
        profitable_flips: profile.profitableFlips || 0, graduated: !!profile.graduatedAt,
        practice_plan: PRACTICE.map((p) => p.blurb) };
    }
    default: return { error: 'unknown tool' };
  }
}

export function costOf(u) {
  if (!u) return 0;
  return (u.input_tokens || 0) * PRICE.in + (u.output_tokens || 0) * PRICE.out
    + (u.cache_creation_input_tokens || 0) * PRICE.cacheWrite + (u.cache_read_input_tokens || 0) * PRICE.cacheRead;
}

export function contextNote(ctx) {
  const c = ctx && typeof ctx === 'object' ? ctx : {};
  const parts = [];
  if (c.screen) parts.push(`Screen: ${String(c.screen).slice(0, 60)}`);
  if (c.level) { const l = LEVELS.find((x) => x.n === Number(c.level)); if (l) parts.push(`Level ${l.n} "${l.title}": ${l.goal}`); }
  if (c.practice) parts.push(`Practice flip ${Number(c.practice)}`);
  if (c.step) parts.push(`Step: ${String(c.step).slice(0, 30)}`);
  if (c.house && typeof c.house === 'object') parts.push(`House on screen: seed=${String(c.house.seed).slice(0, 80)} neighborhood=${String(c.house.hood).slice(0, 20)} address="${String(c.house.address || '').slice(0, 40)}"`);
  if (c.numbers && typeof c.numbers === 'object') parts.push(`Her numbers so far: ${JSON.stringify(c.numbers).slice(0, 600)}`);
  if (c.event) parts.push(`Game event: ${String(c.event).slice(0, 200)}`);
  return parts.length ? `[Game context, not typed by Addie]\n${parts.join('\n')}` : '';
}

export async function callFlip({ history, profile }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');
  const messages = [...history];
  let usd = 0, inTok = 0, outTok = 0;
  for (let i = 0; i < 5; i++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL, max_tokens: 400,
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        tools: TOOLS, tool_choice: { type: 'auto' }, messages,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error('[flipper] anthropic', res.status, t.slice(0, 300));
      throw new Error('Flip could not think right now.');
    }
    const data = await res.json();
    usd += costOf(data.usage); inTok += data.usage?.input_tokens || 0; outTok += data.usage?.output_tokens || 0;
    messages.push({ role: 'assistant', content: data.content });
    const uses = (data.content || []).filter((b) => b.type === 'tool_use');
    if (data.stop_reason !== 'tool_use' || !uses.length) {
      const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join(' ').trim();
      return { text, usd, inTok, outTok };
    }
    messages.push({ role: 'user', content: uses.map((u) => ({ type: 'tool_result', tool_use_id: u.id,
      content: JSON.stringify(runTool(u.name, u.input || {}, { profile })).slice(0, 8000) })) });
  }
  return { text: 'Hmm, let me think about that a different way. Can you ask me again?', usd, inTok, outTok };
}

export function cleanSay(s) {
  return String(s || '')
    .replace(/https?:\/\/\S+|www\.\S+/gi, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/[*#_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 700);
}

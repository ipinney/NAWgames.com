// Validates every Pom Pom Coders level with the game's own engine.
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../public/games/pom-pom-coders.html', 'utf8');
const m = html.match(/\/\* ENGINE-START \*\/([\s\S]*?)\/\* ENGINE-END \*\//);
const api = new Function(m[1] + '\nreturn {WORLDS,normLevel,parseProg,runAllDays,simulate,progCount};')();
const { WORLDS, normLevel, parseProg, runAllDays, simulate, progCount } = api;
const sim1 = (lv, seq, day) => simulate(lv, { main: seq.map(d => ({ k: 'm', d })), spell: [] }, day);
function bfs(lv) {
  // Shortest arrows-only program that wins (no-mystery levels). Encodes position + doors + coins.
  if (lv.days[0] !== null) return null;
  const seen = new Set([''] ), q = [[]];
  let seenState = new Set();
  while (q.length) {
    const seq = q.shift();
    if (seq.length > 14) return null;
    for (const d of 'UDLR') {
      const s = seq.concat(d), r = sim1(lv, s, null);
      if (r.win) return s.join(' ');
      const pressed = r.ev.filter(e => e.e === 'press').map(e => e.door).sort().join('');
      const key = r.y + ',' + r.x + '|' + pressed;
      if (seenState.has(key)) continue;
      seenState.add(key); q.push(s);
    }
  }
  return null;
}
let bad = 0, total = 0, notes = [];
WORLDS.forEach((W, wi) => W.levels.forEach((raw, li) => {
  total++;
  const tag = `W${wi + 1}-${li + 1}`;
  let lv;
  try { lv = normLevel(raw); } catch (e) { console.log(tag, 'NORM', e.message); bad++; return; }
  if (!lv.start) { console.log(tag, 'no start'); bad++; return; }
  if (!/[Gxy]/.test(lv.rows.join(''))) { console.log(tag, 'no goal'); bad++; return; }
  const p = parseProg(lv.sol), r = runAllDays(lv, p), n = progCount(p);
  if (!r.win) { console.log(tag, 'SOL FAILS', lv.sol, r.res.map(x => [x.y, x.x, x.fell])); bad++; }
  if (!lv.coins.every(c => r.coins.has(c))) { console.log(tag, 'SOL MISSES COINS', lv.sol); bad++; }
  if (lv.max && n > lv.max) { console.log(tag, 'SOL OVER MAX', n, lv.max); bad++; }
  if (lv.pre) {
    const pr = runAllDays(lv, parseProg(lv.pre));
    if (pr.win) { console.log(tag, 'PRE ALREADY WINS', lv.pre); bad++; }
    if (lv.max && progCount(parseProg(lv.pre)) > lv.max) { console.log(tag, 'PRE OVER MAX'); bad++; }
  }
  // Mystery levels must not be beatable by plain arrows
  if (lv.days[0] !== null) {
    const arrows = [];
    (function gen(s) { if (s.length > 6) return; if (s.length) arrows.push(s); if (s.length < 6) for (const d of 'UDLR') gen(s.concat(d)); })([]);
    for (const a of arrows) {
      if (lv.days.every(d => sim1(lv, a, d).win)) { console.log(tag, 'MYSTERY BEATEN BY ARROWS', a.join(' ')); bad++; break; }
    }
  }
  const b = bfs(lv);
  if (b) {
    const bn = b.split(' ').length;
    if (lv.max && bn <= lv.max && (wi >= 2)) notes.push(`${tag}: arrows alone fit max (${b}) max=${lv.max}`);
    if (!lv.max && !lv.coins.length && bn < n) notes.push(`${tag}: shorter arrows ${b} vs sol ${lv.sol}`);
  }
}));
console.log(`levels=${total} bad=${bad}`);
notes.forEach(x => console.log('note', x));
process.exit(bad ? 1 : 0);

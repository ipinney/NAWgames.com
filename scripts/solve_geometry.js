// solve_geometry.js — beam-search auto-player through the real game physics.
// Usage: node scripts/solve_geometry.js public/games/geometry-jump.html
const pw = require('playwright');
const path = require('path');
(async () => {
  const browser = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.resolve(process.argv[2]), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800); if (process.env.ONLY) await page.evaluate(([o,b]) => { window.__only = o; window.__beam = b; }, [+process.env.ONLY, +(process.env.BEAM||64)]);
  const results = await page.evaluate(() => {
    const out = [];
    const snap = () => ({ p: Object.assign({}, player), used: objs.map(o => (o.used ? 1 : 0) + (o.got ? 2 : 0)), cg: coinsGot.slice() });
    const restore = s => { Object.assign(player, s.p); objs.forEach((o, i) => { o.used = !!(s.used[i] & 1); o.got = !!(s.used[i] & 2); }); coinsGot = s.cg.slice(); gameState = 'play'; };
    for (let li = (window.__only ?? 0); li < (window.__only != null ? window.__only + 1 : LEVELS.length); li++) {
      save.unlocked = 6;
      startLevel(li, false);
      const CH = 2; // frames per decision
      let beam = [{ s: snap(), holds: 0 }];
      let won = false, maxX = 0, steps = 0, deadEnd = 0;
      while (!won && beam.length && steps < 6000) {
        steps++;
        const next = [];
        const seen = new Set();
        for (const b of beam) {
          for (const h of [false, true]) {
            restore(b.s); holding = h; pressBuffer = h ? 0.12 : 0;
            let ok = true;
            for (let f = 0; f < CH; f++) { step(1 / 60); if (gameState !== 'play') { ok = gameState === 'win'; break; } }
            if (gameState === 'win') { won = true; maxX = player.x; break; }
            if (!ok) continue;
            const key = [Math.round(player.x * 2), Math.round(player.y * 3), Math.round(player.vy / 3), player.mode, player.grav, Math.round(player.x * 2)].join(',');
            if (seen.has(key)) continue; seen.add(key);
            next.push({ s: snap(), holds: b.holds + (h ? 1 : 0) });
          }
          if (won) break;
        }
        if (won) break;
        next.sort((a, b) => b.s.p.x - a.s.p.x);
        beam = next.slice(0, window.__beam || 64);
        if (beam.length) maxX = Math.max(maxX, beam[0].s.p.x);
        else deadEnd = 1;
      }
      out.push({ level: LEVELS[li].name, won, pct: Math.round(maxX / level.length * 100), length: Math.round(level.length), coins: level.coinsTotal, steps, deadEnd });
    }
    return out;
  });
  console.log(JSON.stringify({ results, errs }, null, 2));
  await browser.close();
  process.exit(results.every(r => r.won) && errs.length === 0 ? 0 : 1);
})();

const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const logs = [];
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  page.on('console', m => logs.push(m.type() + ': ' + m.text().slice(0, 200)));
  await page.goto('file://' + path.resolve('public/games/critter-quest.html'));
  await page.waitForTimeout(1500);
  const f1 = await page.evaluate(() => frame);
  await page.waitForTimeout(1000);
  const f2 = await page.evaluate(() => frame);
  console.log('rAF frames/sec ~=', f2 - f1);
  // force evolution directly
  await page.evaluate(() => {
    ensureAudio && (window.__x = 1);
    team = [makeCritter(2, 8)];
    gameState = 'overworld';
    document.getElementById('hud').style.display = 'flex';
    queueEvolution(team[0]);
    processEvoQueue();
  });
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(1000);
    const s = await page.evaluate(() => ({ gs: gameState, t: evoAnim ? evoAnim.t : null, sid: team[0].sid, fr: frame }));
    console.log(JSON.stringify(s));
    if (s.gs === 'overworld') break;
  }
  console.log('LOGS:', JSON.stringify(logs.slice(0, 10)));
  await browser.close();
})();

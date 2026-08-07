// Deep playtest for Critter Quest: starter pick → battle → attack → catch → evolution check
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const errors = [];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  const file = 'file://' + path.resolve(process.argv[2] || 'public/games/critter-quest.html');
  await page.goto(file);
  await page.waitForTimeout(1500);

  // 1. Title → Play (force: button has infinite CSS pulse animation)
  await page.click('#playBtn', { force: true });
  await page.waitForTimeout(500);

  // 2. Pick middle starter (Embercub)
  const starterVisible = await page.isVisible('#starterScreen.active');
  if (!starterVisible) errors.push('FLOW: starter screen did not appear');
  await page.click('.scard:nth-child(2)', { force: true });
  await page.waitForTimeout(800);

  // 3. Overworld: HUD visible, walk around
  const hudVisible = await page.evaluate(() => document.getElementById('hud').style.display === 'flex');
  if (!hudVisible) errors.push('FLOW: HUD not shown after starter pick');
  for (const k of ['a', 's', 'd', 'w']) {
    await page.keyboard.down(k); await page.waitForTimeout(700); await page.keyboard.up(k);
  }

  // 4. Force a wild encounter deterministically
  await page.evaluate(() => startWildEncounter());
  await page.waitForTimeout(1600);
  const battleShown = await page.evaluate(() => document.getElementById('battleUI').style.display === 'block');
  if (!battleShown) errors.push('FLOW: battle UI did not appear');

  // 5. Attack with first move
  const btnCount = await page.locator('#moveBtns button').count();
  if (btnCount < 3) errors.push('FLOW: expected >=3 battle buttons, got ' + btnCount);
  await page.click('#moveBtns button:nth-child(1)');
  await page.waitForTimeout(2800); // player attack + enemy turn

  // 6. Weaken enemy then catch with a perfect throw
  await page.evaluate(() => { if (battle) battle.enemy.hp = 1; });
  await page.click('#moveBtns .movebtn.catch');
  await page.waitForTimeout(400);
  await page.evaluate(() => { if (battle && battle.ring) { battle.ring.r = 46; catchTap(); } });
  // wobble + result + return to overworld can take ~6s total
  await page.waitForFunction(() => gameState === 'overworld' || gameState === 'evolving', null, { timeout: 12000 }).catch(() => {});
  const state = await page.evaluate(() => ({ gameState, teamLen: team.length, caught: caught.size }));
  if (state.teamLen < 2 && state.caught < 2) errors.push('FLOW: catch did not register (team=' + state.teamLen + ' caught=' + state.caught + ')');

  // 7. Evolution path: level up starter artificially
  await page.evaluate(() => {
    team[0].lv = 8; team[0].xp = 0;
    const sp = SPECIES[team[0].sid];
    if (sp.evo >= 0) { queueEvolution(team[0]); processEvoQueue(); }
  });
  await page.waitForFunction(() => gameState === 'overworld' && team[0].sid === 3, null, { timeout: 15000 }).catch(() => {});
  const postEvo = await page.evaluate(() => ({ gameState, sid: team[0].sid }));
  if (postEvo.gameState !== 'overworld') errors.push('FLOW: stuck in state ' + postEvo.gameState + ' after evolution');
  if (postEvo.sid !== 3) errors.push('FLOW: Embercub did not evolve to Blazelion (sid=' + postEvo.sid + ')');

  // 8. Dex + team panels
  await page.click('#dexBtn'); await page.waitForTimeout(400);
  const dexCards = await page.locator('#dexGrid .dexcard').count();
  if (dexCards !== 14) errors.push('FLOW: dex shows ' + dexCards + ' cards, expected 14');
  await page.click('[data-close="dexPanel"]'); await page.waitForTimeout(200);
  await page.click('#teamBtn'); await page.waitForTimeout(400);
  await page.click('[data-close="teamPanel"]');

  // 9. Guardian battle + run
  await page.evaluate(() => startGuardianBattle(shrines[0]));
  await page.waitForTimeout(1600);
  await page.evaluate(() => endBattle('ran'));
  await page.waitForTimeout(500);

  // 10. Mobile viewport sanity (d-pad markup + no errors on resize)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: '/tmp/cq_playtest.png' });
  await browser.close();
  const uniq = [...new Set(errors)];
  console.log(JSON.stringify({ success: uniq.length === 0, errors: uniq.slice(0, 12), finalState: state }, null, 2));
  process.exit(uniq.length === 0 ? 0 : 1);
})().catch(e => { console.log(JSON.stringify({ success: false, errors: ['SCRIPT: ' + e.message] })); process.exit(1); });

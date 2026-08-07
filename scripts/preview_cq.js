// Generate 800x450 preview: mid-battle scene (the most exciting screen)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 450 } });
  await page.goto('file://' + path.resolve('public/games/critter-quest.html'));
  await page.waitForTimeout(1200);
  await page.click('#playBtn', { force: true });
  await page.waitForTimeout(400);
  await page.click('.scard:nth-child(1)', { force: true }); // Sprigby
  await page.waitForTimeout(3200); // let welcome banner fade
  // stage a dramatic battle: starter vs Blazelion, ring visible
  await page.evaluate(() => {
    startWildEncounter();
    battle.enemy = makeCritter(3, 7); // Blazelion
    battle.dispEHp = battle.enemy.hp;
    battle.biome = 'volcano';
  });
  await page.waitForTimeout(1600);
  await page.evaluate(() => {
    battle.phase = 'catching'; gameState = 'catching';
    battle.ring = { r: 78, speed: 0, zone: 40, tapped: false };
    addParticle(innerWidth * 0.72, innerHeight * 0.35, 'sparkle', 18);
    addParticle(innerWidth * 0.28, innerHeight * 0.6, 'confetti', 12);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'public/images/critter-quest-preview.png' });
  await browser.close();
  console.log('preview saved');
})();

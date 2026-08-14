// Deep gameplay playtest for amongst.html
const pw = require('playwright');
const path = require('path');

(async () => {
  const browser = await pw.chromium.launch({ args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = [];
  const errs = [];

  for (const size of [{ n: 'desktop', w: 1024, h: 768 }, { n: 'mobile', w: 390, h: 844 }]) {
    const page = await browser.newPage({ viewport: { width: size.w, height: size.h } });
    page.on('pageerror', e => errs.push(size.n + ' pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(size.n + ' console: ' + m.text()); });

    await page.goto('file://' + path.resolve('/opt/nawgames/public/games/amongst.html'), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    // --- attract mode should have beans and a room ---
    const attract = await page.evaluate(() => ({
      state, beans: beans.length, torches: torches.length,
      crates: crates.length, flagstones: flagstones.length,
      roomW: R.w, roomH: R.h, playerNull: player === null
    }));
    results.push([size.n, 'attract', JSON.stringify(attract)]);

    // --- start the game ---
    await page.click('#startBtn');
    await page.waitForTimeout(900);
    const started = await page.evaluate(() => ({
      state, room: roomIndex, beans: beans.length,
      zombies: beans.filter(b => b.isZombie).length,
      humans: beans.filter(b => !b.isZombie).length,
      hearts, battery: Math.round(xrayBattery),
      px: Math.round(player.x), py: Math.round(player.y),
      inRoom: player.x > R.x && player.x < R.x + R.w && player.y > R.y && player.y < R.y + R.h
    }));
    results.push([size.n, 'started', JSON.stringify(started)]);

    // --- movement test: push left, confirm the player actually moves ---
    const before = await page.evaluate(() => ({ x: player.x, y: player.y }));
    await page.evaluate(() => { keys['a'] = true; });
    await page.waitForTimeout(600);
    await page.evaluate(() => { keys['a'] = false; });
    const after = await page.evaluate(() => ({ x: player.x, y: player.y }));
    results.push([size.n, 'movement', 'dx=' + (after.x - before.x).toFixed(1) + ' moved=' + (Math.abs(after.x - before.x) > 3)]);

    // --- x-ray test: teleport player onto a bean, hold scan, confirm reveal ---
    await page.evaluate(() => {
      const b = beans.find(x => !x.dead);
      player.x = b.x; player.y = b.y + 6;
      xrayHeld = true;
    });
    await page.waitForTimeout(1400);
    const scanned = await page.evaluate(() => {
      xrayHeld = false;
      return {
        revealed: beans.filter(b => b.revealed).length,
        total: beans.length,
        batteryDrained: Math.round(xrayBattery) < 100,
        anyFlash: beans.some(b => b.flash > 0 || b.revealed)
      };
    });
    results.push([size.n, 'xray', JSON.stringify(scanned)]);

    // --- reveal every zombie, then blast them all ---
    await page.evaluate(() => { beans.forEach(b => { b.revealed = true; b.fakeHuman = false; b.trickTimer = 0; }); });
    for (let i = 0; i < 60; i++) {
      const done = await page.evaluate(() => {
        const z = beans.find(b => !b.dead && b.isZombie);
        if (!z) return true;
        player.x = z.x - 40; player.y = z.y;
        blastCooldown = 0;
        fireBlast();
        return false;
      });
      if (done) break;
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(700);
    const cleared = await page.evaluate(() => ({
      zombiesLeft: zombiesLeft(), cured: roomCured, doorOpen: door.open,
      score, hearts, oops: totalOops
    }));
    results.push([size.n, 'clearRoom', JSON.stringify(cleared)]);

    // --- walk into the open door -> should advance ---
    await page.evaluate(() => { player.x = door.x; player.y = R.y + 2; });
    await page.waitForTimeout(500);
    const advanced = await page.evaluate(() => ({ state, clearShown: document.getElementById('clearScreen').classList.contains('show') }));
    results.push([size.n, 'doorTransition', JSON.stringify(advanced)]);

    if (advanced.clearShown) {
      await page.click('#nextBtn');
      await page.waitForTimeout(700);
      const r2 = await page.evaluate(() => ({ state, room: roomIndex, beans: beans.length, spikes: spikes.length, axes: axes.length }));
      results.push([size.n, 'room2', JSON.stringify(r2)]);
    }

    // --- jump straight to the boss room and verify the King ---
    await page.evaluate(() => { startRoom(7); });
    await page.waitForTimeout(700);
    const boss = await page.evaluate(() => ({
      hasKing: !!king, kingHp: king ? king.hp : null, room: roomIndex,
      name: ROOMS[roomIndex].name, props: props.length
    }));
    results.push([size.n, 'bossRoom', JSON.stringify(boss)]);

    // scan + defeat the king
    await page.evaluate(() => { king.revealed = true; king.fakeHuman = false; king.trickTimer = 0; });
    for (let i = 0; i < 40; i++) {
      const dead = await page.evaluate(() => {
        if (!king || king.dead) return true;
        player.x = king.x - 60; player.y = king.y + 20;
        blastCooldown = 0; invuln = 999;
        fireBlast();
        return false;
      });
      if (dead) break;
      await page.waitForTimeout(130);
    }
    await page.waitForTimeout(2200);
    const won = await page.evaluate(() => ({
      state, winShown: document.getElementById('winScreen').classList.contains('show'),
      stars: document.getElementById('starRow').textContent.trim(),
      score
    }));
    results.push([size.n, 'winScreen', JSON.stringify(won)]);

    // --- non-flat canvas check during real gameplay ---
    await page.evaluate(() => { startRoom(3); });
    await page.waitForTimeout(900);
    const px = await page.evaluate(() => {
      const c = document.getElementById('c');
      const g = c.getContext('2d');
      const pts = [[0.5, 0.5], [0.25, 0.3], [0.75, 0.7], [0.5, 0.25], [0.3, 0.6], [0.7, 0.4]];
      const s = pts.map(([a, b]) => {
        const d = g.getImageData(Math.floor(c.width * a), Math.floor(c.height * b), 1, 1).data;
        return d[0] + ',' + d[1] + ',' + d[2];
      });
      return { unique: new Set(s).size, samples: s };
    });
    results.push([size.n, 'renderVariety', 'uniqueColors=' + px.unique + ' / 6']);

    await page.screenshot({ path: '/opt/nawgames/public/games/amongst-playtest-' + size.n + '.png' });
    await page.close();
  }

  await browser.close();
  console.log('=== PLAYTEST RESULTS ===');
  results.forEach(r => console.log('[' + r[0] + '] ' + r[1] + ': ' + r[2]));
  console.log('=== ERRORS (' + errs.length + ') ===');
  errs.slice(0, 20).forEach(e => console.log('  ' + e));
  process.exit(errs.length ? 1 : 0);
})();

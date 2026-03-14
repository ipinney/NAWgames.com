// test_game.js - Playwright test for a game HTML file
// Usage: node test_game.js <path-to-html-file>
// Exit 0 = pass, 1 = fail. Outputs JSON.

const pw = require('playwright');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) { console.error('Usage: node test_game.js <file.html>'); process.exit(1); }

(async () => {
  let browser;
  try {
    browser = await pw.chromium.launch({ args: ['--no-sandbox'] });
    const sizes = [
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'mobile', width: 390, height: 844 },
    ];
    const allErrors = [];

    for (const size of sizes) {
      const page = await browser.newPage({ viewport: { width: size.width, height: size.height } });
      const pageErrors = [];

      page.on('pageerror', err => {
        pageErrors.push({ type: 'pageerror', message: err.message, size: size.name });
      });
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
          pageErrors.push({ type: 'console_error', message: msg.text(), size: size.name });
        }
      });

      await page.goto('file://' + path.resolve(filePath), { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      // Check for JS errors on load (before clicking anything)
      if (pageErrors.length > 0) {
        allErrors.push(...pageErrors);
        await page.close();
        continue;
      }

      // Click start button if present
      const startBtn = await page.$('#startBtn');
      if (startBtn) {
        await startBtn.click();
        await page.waitForTimeout(2000);
      }

      // Check for JS errors after game start
      if (pageErrors.length > 0) {
        allErrors.push(...pageErrors);
        await page.close();
        continue;
      }

      // Canvas rendering check (only if game uses canvas)
      const hasCanvas = await page.$('#c');
      if (hasCanvas) {
        const canvasCheck = await page.evaluate(() => {
          const c = document.getElementById('c');
          if (!c || c.width === 0 || c.height === 0) return { ok: true }; // skip
          const ctx = c.getContext('2d');
          const samples = [];
          const pts = [[c.width/2,c.height/2],[c.width/4,c.height/4],[c.width*3/4,c.height*3/4],[c.width/2,c.height/4],[c.width/4,c.height/2]];
          for (const [x,y] of pts) {
            const px = ctx.getImageData(Math.floor(x),Math.floor(y),1,1).data;
            samples.push([px[0],px[1],px[2]]);
          }
          const allSame = samples.every(s =>
            Math.abs(s[0]-samples[0][0])<5 && Math.abs(s[1]-samples[0][1])<5 && Math.abs(s[2]-samples[0][2])<5);
          return { allSame, samples };
        });
        if (canvasCheck.allSame) {
          allErrors.push({ type: 'flat_render', message: 'Canvas is flat single color - game world not rendering', size: size.name });
        }
      }

      // Take screenshot
      const ssName = filePath.replace('.html', '-test-' + size.name + '.png');
      await page.screenshot({ path: ssName });
      await page.close();
    }

    await browser.close();
    const result = { success: allErrors.length === 0, errors: allErrors, file: filePath, timestamp: new Date().toISOString() };
    console.log(JSON.stringify(result, null, 2));
    process.exit(allErrors.length === 0 ? 0 : 1);
  } catch (e) {
    if (browser) await browser.close();
    console.log(JSON.stringify({ success: false, errors: [{ type: 'crash', message: e.message }] }));
    process.exit(1);
  }
})();

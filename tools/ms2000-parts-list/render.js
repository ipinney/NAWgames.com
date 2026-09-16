// node tools/ms2000-parts-list/render.js  -> ms2000-parts-list.raw.pdf
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + __dirname + '/ms2000-parts-list.html', { waitUntil: 'networkidle' });
  await p.pdf({ path: __dirname + '/ms2000-parts-list.raw.pdf', format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();

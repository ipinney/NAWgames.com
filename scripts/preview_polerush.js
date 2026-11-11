// 800x450 preview for Pole Rush v3: runner sliding the rails over the 3D valley
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', '8899'], { cwd: '/opt/nawgames/public', stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 800));
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 800, height: 450 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://localhost:8899/games/pole-rush.html');
  await p.waitForTimeout(1500);
  console.log('3D:', await p.evaluate('!!G3'));
  await p.evaluate('__pr.startLevel(3)');
  await p.evaluate(`(()=>{const w=__pr.world,P=__pr.P;const g=w.gaps[0];P.z=g.z0-6;P.a=P.b=Math.max(3,g.S/2+0.8);P.cpZ=P.z;})()`);
  for (let i = 0; i < 60; i++) {
    await p.waitForTimeout(150);
    const ok = await p.evaluate('__pr.P.hang && __pr.P.z > __pr.world.gaps[0].z0 + 4');
    if (ok) break;
  }
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/opt/nawgames/public/images/pole-rush-preview.png' });
  console.log('errors:', errs);
  await b.close(); srv.kill();
})();

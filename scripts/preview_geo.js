const pw=require('playwright');const path=require('path');
(async()=>{const b=await pw.chromium.launch({args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:800,height:450}});
await p.goto('file://'+path.resolve('public/games/geometry-jump.html'));await p.waitForTimeout(500);
await p.click('#startBtn'); await p.waitForTimeout(300); await p.evaluate(()=>{hintShown=true;document.getElementById('hint').classList.remove('show');}); await p.waitForTimeout(600);
await p.evaluate(()=>{ hintShown=true; document.getElementById('hint').classList.remove('show'); const o=objs.find(o=>o.t==='orb'); const sp=objs.filter(o=>o.t==='spike'); player.x = sp[1].x-3; });
await p.keyboard.down('Space'); await p.waitForTimeout(230); await p.keyboard.up('Space'); await p.waitForTimeout(40);
await p.screenshot({path:'public/images/geometry-jump-preview.png'});
await b.close();})();

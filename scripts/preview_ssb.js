const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:800,height:450}});
await p.goto('file:///opt/nawgames/public/games/super-smash-bots.html');await p.waitForTimeout(500);
await p.evaluate(()=>{hero=HEROES[0];botIdx=3;startFight();});await p.waitForTimeout(600);
await p.evaluate(()=>{G.power=100;act('super');});await p.waitForTimeout(500);
await p.screenshot({path:'public/images/super-smash-bots-preview.png'});await b.close();})();

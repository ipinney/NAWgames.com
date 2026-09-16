"""OG card for the MS-2000 pages (1200x630).
Usage: /opt/batchzero/venv/bin/python make_og.py VIEWER_HTML OUT_PNG
VIEWER_HTML is the turret 3D viewer (ms2000-turret-3d.html). Step 1 renders the turret, step 2 lays it into the card."""
import sys, os, base64, pathlib
from playwright.sync_api import sync_playwright

viewer, out = sys.argv[1], sys.argv[2]
tmp_render = '/tmp/ms2000-og-render.png'
HIDE = """
header,footer,#labels,#legend,#hint{visibility:hidden!important}
"""
CARD = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0d1b2e;color:#dbe5f1;font-family:"Barlow Semi Condensed",sans-serif;position:relative;overflow:hidden}
.glow{position:absolute;right:120px;top:90px;width:520px;height:460px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,95,168,.22),rgba(13,27,46,0))}
img{position:absolute;right:-30px;top:0;width:720px;height:630px;object-fit:cover}
.fade{position:absolute;left:500px;top:0;width:200px;height:630px;background:linear-gradient(90deg,#0d1b2e,rgba(13,27,46,0))}
.txt{position:absolute;left:64px;top:0;bottom:0;width:580px;display:flex;flex-direction:column;justify-content:center}
.kicker{color:#ff8cc4;font-size:28px;font-weight:600}
h1{font-size:140px;font-weight:800;line-height:.9;margin:8px 0 6px;letter-spacing:-.01em;
   background:linear-gradient(90deg,#ff5fa8,#b6f36b);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{font-size:30px;font-weight:700;color:#b6f36b;letter-spacing:.06em;text-transform:uppercase;margin-bottom:16px}
.lead{font-size:38px;font-weight:600;line-height:1.12;max-width:500px}
.list{margin-top:24px;font-size:25px;color:#7d93ad;font-weight:500;line-height:1.35}
.list b{color:#dbe5f1;font-weight:600}
.site{position:absolute;left:64px;bottom:34px;font-size:24px;font-weight:600;color:#8fd3ea}
.beam{position:absolute;left:690px;top:470px;width:470px;height:3px;transform:rotate(-17deg);transform-origin:left center;
      background:linear-gradient(90deg,rgba(255,40,60,0),rgba(255,40,60,.9));box-shadow:0 0 12px rgba(255,40,60,.9)}
.skeeter{position:absolute;right:48px;top:318px;font-size:64px;filter:drop-shadow(0 0 14px rgba(255,40,60,.9))}
</style></head><body>
<img src="data:image/png;base64,__IMG__">
<div class="fade"></div>
<div class="txt">
<div class="kicker">Addie's science fair project</div>
<h1>MS-2000</h1>
<div class="sub">Mosquito Shooter</div>
<div class="lead">A laser turret that learns, tracks and tags a mosquito</div>
<div class="list"><b>Build your own:</b> parts list, 3D print files,<br>build plan, and the science behind it</div>
</div>
<div class="site">nawgames.com/projects/addie/mosquito-turret</div>
</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={'width': 720, 'height': 630}, device_scale_factor=1)
    pg.goto('file://' + os.path.abspath(viewer)); pg.wait_for_timeout(3000)
    if pg.query_selector('#dims.on'):
        pg.click('#dims'); pg.wait_for_timeout(300)
    pg.add_style_tag(content=HIDE)
    pg.evaluate("() => { const s=document.querySelector('.specs'); if(s){s.style.position='fixed'; s.style.top='630px';} "
                "document.body.style.background='transparent'; window.dispatchEvent(new Event('resize')); }")
    pg.wait_for_timeout(1500)
    pg.screenshot(path=tmp_render)
    img = base64.b64encode(pathlib.Path(tmp_render).read_bytes()).decode()
    pg2 = b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    pg2.set_content(CARD.replace('__IMG__', img)); pg2.wait_for_timeout(2500)
    pg2.screenshot(path=out)
    b.close()
print('wrote', out)

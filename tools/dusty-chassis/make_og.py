"""OG card for the Dusty project page (1200x630).
Usage: /opt/batchzero/venv/bin/python make_og.py VIEWER_HTML OUT_PNG
Step 1 renders the 3D chassis from the assembly viewer, step 2 lays it into the card."""
import sys, os, base64, pathlib
from playwright.sync_api import sync_playwright

viewer, out = sys.argv[1], sys.argv[2]
tmp_render = '/tmp/dusty-og-render.png'
HIDE = """
header{visibility:hidden}
footer{visibility:hidden}
#legend,.row,#hint,#labels{display:none!important}
dl.specs{height:0!important;margin:0!important;overflow:hidden;padding:0!important}
"""
CARD = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0d1b2e;color:#dbe5f1;font-family:"Barlow Semi Condensed",sans-serif;position:relative;overflow:hidden}
img{position:absolute;right:-40px;top:0;width:720px;height:630px;object-fit:cover}
.fade{position:absolute;left:515px;top:0;width:200px;height:630px;background:linear-gradient(90deg,#0d1b2e,rgba(13,27,46,0))}
.txt{position:absolute;left:64px;top:0;bottom:0;width:560px;display:flex;flex-direction:column;justify-content:center}
.kicker{color:#8fd3ea;font-size:28px;font-weight:600}
h1{font-size:150px;font-weight:800;line-height:.9;color:#f0b43c;margin:6px 0 14px;letter-spacing:-.01em}
.lead{font-size:38px;font-weight:600;line-height:1.12;max-width:500px}
.list{margin-top:26px;font-size:25px;color:#7d93ad;font-weight:500;line-height:1.35}
.list b{color:#dbe5f1;font-weight:600}
.site{position:absolute;left:64px;bottom:34px;font-size:24px;font-weight:600;color:#8fd3ea}
</style></head><body>
<img src="data:image/png;base64,__IMG__">
<div class="fade"></div>
<div class="txt">
<div class="kicker">Nolan's invention project</div>
<h1>Dusty</h1>
<div class="lead">A table-sweeping robot that stops at the edge</div>
<div class="list"><b>Build your own:</b> 3D print files, parts list,<br>step-by-step guide, 3D viewers</div>
</div>
<div class="site">nawgames.com/projects/nolan/dusty</div>
</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={'width': 720, 'height': 630}, device_scale_factor=1)
    pg.goto('file://' + os.path.abspath(viewer)); pg.wait_for_timeout(4000)
    pg.add_style_tag(content=HIDE)
    pg.evaluate("document.getElementById('dims').click()")
    pg.evaluate("window.dispatchEvent(new Event('resize'))")
    pg.evaluate("zoom=0.92; theta=0.95; phi=1.08;")
    pg.wait_for_timeout(1500)
    pg.screenshot(path=tmp_render)
    img = base64.b64encode(pathlib.Path(tmp_render).read_bytes()).decode()
    pg2 = b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    pg2.set_content(CARD.replace('__IMG__', img)); pg2.wait_for_timeout(2500)
    pg2.screenshot(path=out)
    b.close()
print('wrote', out)

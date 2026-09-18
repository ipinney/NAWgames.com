"""Build-guide pictures from the colored drone viewer.
Usage: /opt/batchzero/venv/bin/python make_guide_shots.py OUT_DIR  (then convert to jpg with cad-venv PIL)"""
import sys, os
from playwright.sync_api import sync_playwright
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
viewer = os.path.abspath('out/flymo-drone-3d.html')
HIDE = "header,footer,#labels{visibility:hidden!important}"
SHOTS = [('whole', [], 'iso'), ('explode', ['#explode'], 'iso'), ('body', ['[data-f=head]'], 'iso'), ('top', [], 'top'), ('front', [], 'front')]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'])
    for name, clicks, view in SHOTS:
        pg = b.new_page(viewport={'width': 900, 'height': 620}, device_scale_factor=1.5)
        pg.goto('file://' + viewer); pg.wait_for_timeout(2500)
        if pg.query_selector('#dims.on'): pg.click('#dims'); pg.wait_for_timeout(200)
        for c in clicks: pg.click(c); pg.wait_for_timeout(1800)
        if view != 'iso': pg.click(f'[data-v={view}]'); pg.wait_for_timeout(1800)
        pg.add_style_tag(content=HIDE)
        pg.evaluate("() => { const c=document.getElementById('card'); if(c){c.style.position='fixed'; c.style.top='620px';} window.dispatchEvent(new Event('resize')); }")
        pg.wait_for_timeout(1500)
        pg.screenshot(path=os.path.join(out, name + '.png'))
        pg.close()
    b.close()
print('shots done')

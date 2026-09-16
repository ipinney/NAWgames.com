"""Build-guide images from the 3D viewers.
Usage: /opt/batchzero/venv/bin/python make_guide_shots.py OUT_DIR   (then python3 to convert to jpg)"""
import sys, os
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, '../../public/projects/addie/ms2000-cad')
HIDE = "header,footer,#labels,#chips,#tools{visibility:hidden!important}"
SHOTS = [
    # name, viewer, focus, explode, highlight keys
    ('turret', 'ms2000-turret-3d.html', 'turret', False, None),
    ('turret-explode', 'ms2000-turret-3d.html', 'turret', True, None),
    ('base-inside', 'ms2000-turret-3d.html', 'base', False, ['board', 'bank', 'cport', 'pswitch', 'pservo', 'speaker', 'switch', 'plate']),
    ('head', 'ms2000-turret-3d.html', 'head', False, None),
    ('head-explode', 'ms2000-turret-3d.html', 'head', True, None),
    ('servos', 'ms2000-turret-3d.html', 'turret', False, ['pservo', 'tservo', 'pan_horn', 'tilt_horn']),
    ('mosquito', 'ms2000-3d.html', 'mosquito', False, None),
    ('setup', 'ms2000-3d.html', 'setup', False, None),
]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'])
    for name, viewer, f, ex, hl in SHOTS:
        pg = b.new_page(viewport={'width': 720, 'height': 540}, device_scale_factor=1.5)
        pg.goto('file://' + os.path.abspath(os.path.join(PUB, viewer))); pg.wait_for_timeout(2500)
        if pg.query_selector('#dims.on'):
            pg.click('#dims'); pg.wait_for_timeout(200)
        if hl:
            pg.evaluate("ks => { const n=document.getElementById('pick'); if(n) n.remove(); SEL = ks; highlight(); }", hl)
        pg.click(f'[data-f={f}]'); pg.wait_for_timeout(2200)
        if ex:
            pg.click('#explode'); pg.wait_for_timeout(2500)
        pg.add_style_tag(content=HIDE)
        pg.evaluate("() => { const s=document.getElementById('card'); if(s){s.style.position='fixed'; s.style.top='540px';} window.dispatchEvent(new Event('resize')); }")
        pg.wait_for_timeout(1800)
        pg.screenshot(path=os.path.join(OUT, name + '.png'))
        print('shot', name)
        pg.close()
    b.close()

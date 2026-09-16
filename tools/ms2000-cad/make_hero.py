"""Hero image for the MS-2000 page from the whole-setup viewer.
Usage: /opt/batchzero/venv/bin/python make_hero.py VIEWER_HTML OUT_PNG"""
import sys, os
from playwright.sync_api import sync_playwright
viewer, out = sys.argv[1], sys.argv[2]
HIDE = "header,footer,#labels{visibility:hidden!important}"
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 720, 'height': 630}, device_scale_factor=2)
    pg.goto('file://' + os.path.abspath(viewer)); pg.wait_for_timeout(2500)
    pg.click('[data-f=turret]'); pg.wait_for_timeout(2500)
    pg.add_style_tag(content=HIDE)
    # the footer no longer reserves space once hidden: refit to the whole window
    pg.evaluate("() => { document.querySelector('.specs').style.position='fixed'; document.querySelector('.specs').style.top='630px'; window.dispatchEvent(new Event('resize')); }")
    pg.wait_for_timeout(1500)
    pg.screenshot(path=out)
    b.close()
print('hero', out)

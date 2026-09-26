"""Contact sheet of rendered PNGs, for review. Usage: python sheet.py DIR OUT.jpg COLS WIDTH name1 name2 ..."""
import sys, base64, os
from playwright.sync_api import sync_playwright
D, OUT, COLS, WID = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
names = sys.argv[5:]
cells = ''.join(f'<div style="color:#fff;font:12px sans-serif"><img style="width:100%" src="data:image/png;base64,{base64.b64encode(open(os.path.join(D, n + ".png"), "rb").read()).decode()}"><div>{n}</div></div>' for n in names)
html = f'<html><body style="margin:0;background:#000"><div style="display:grid;grid-template-columns:repeat({COLS},1fr);gap:4px;width:{WID}px">{cells}</div></body></html>'
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': WID, 'height': 400})
    pg.set_content(html); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT, full_page=True, type='jpeg', quality=72); b.close()

"""Index page for the MS-2000 3D files: python make_index.py OUT_HTML
Status of every printed part lives in PARTS below; update it as parts are finished."""
import sys, os, json, html

PARTS = [
    # (id, name, status, files [(label, href)], note)
    ('A', 'Turret so far, assembled', 'done', [('3D viewer', 'ms2000-turret.html')],
     'Every printed and bought part in place. Tap a part to see it alone or highlighted. Pan and tilt sweeps are checked in the build scripts.'),
    ('C', 'Bought parts, measured', 'done', [('3D viewer', 'ms2000-components.html'), ('Numbers (JSON)', 'ms2000-dims.json')],
     'Every bought part as a stand-in model. Numbers marked estimate or photo get checked with calipers when the parts arrive.'),
    ('P1', 'Base shell', 'done', [('3D viewer', 'ms2000-p1-base-shell.html'), ('STL', 'stl/ms2000-p1-base-shell.stl')],
     '142 x 133 x 67. Front window for the micro:bit LEDs, lift-out slot, battery bay on the right, speaker grille and laser arm switch on the back. About 160 g.'),
    ('P1', 'Floor plate', 'done', [('3D viewer', 'ms2000-p1-floor-plate.html'), ('STL', 'stl/ms2000-p1-floor-plate.stl')],
     'Board posts, battery rails, four screws up into the shell. Board hole spacing is from a photo. About 63 g.'),
    ('P2', 'Turntable + tilt yoke', 'done', [('3D viewer', 'ms2000-p2-turntable-yoke.html'), ('STL', 'stl/ms2000-p2-turntable-yoke.stl')],
     'One print: 74 mm disc on the pan servo horn, two uprights 39 mm to the tilt axis. Tilt servo on the right upright, pivot pin bushing and printed tilt stops (35 up, 30 down) on the left. Cable arch at the back. About 39 g.'),
    ('P3', 'Pivot pin', 'done', [('3D viewer', 'ms2000-p3-pivot-pin.html'), ('STL', 'stl/ms2000-p3-pivot-pin.stl')],
     'Left-side tilt axle. An M2 screw clamps it to the head; it turns in the upright.'),
    ('P4', 'Camera and laser head', 'done', [('3D viewer', 'ms2000-p4-head.html'), ('STL', 'stl/ms2000-p4-head.stl')],
     'Closed frame 61 mm wide. HuskyLens on two M3 screws, lens forward, screen readable from behind. Laser 38 mm under the lens in a plastic pinch clamp, toed up 1.4 degrees so the dot meets the camera line at 5 ft (15 mm off at 3 and 7 ft). Horn pocket right, pivot socket and stop finger left. About 11 g. The top bar is a 53 mm bridge: if it sags, print the head on its back.'),
    ('P5', 'Wand handle', 'done', [('3D viewer', 'ms2000-p5-wand.html'), ('STL', 'stl/ms2000-p5-wand.stl')],
     '56 x 119 mm paddle. micro:bit face up; M2 screws through its big rings clamp the cable wires (P0 sensor, P1 eyes, 3V, GND) with no soldering. 2xAAA pack behind it. A V under it centers rods from 9 to 30 mm; the rear zip ties go over the pack and under the rod. About 50 g.'),
    ('P6', 'Mosquito sensor pod', 'now', [], 'Clips onto the stuffed mosquito: light sensor behind a 30 mm light collector (the dot can land 15 mm off at 3 and 7 ft), two LED eyes, line tie.'),
    ('P7', 'Pendulum pivot and angle guide', 'next', [], '10, 20, and 30 degree release marks for the speed test.'),
    ('P8', 'Cable clips', 'next', [], ''),
]
COL = {'done': '#9be15d', 'now': '#ff5fa2', 'next': '#7d93ad'}
rows = []
for pid, name, st, files, note in PARTS:
    links = ' '.join(f'<a href="{h}">{html.escape(l)}</a>' for l, h in files)
    rows.append(f'<li class="{st}"><div class="top"><span class="id">{pid}</span><b>{html.escape(name)}</b>'
                f'<span class="st" style="color:{COL[st]}">{st}</span></div><p>{html.escape(note)}</p>'
                f'{"<div class=links>" + links + "</div>" if links else ""}</li>')
page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MS-2000 3D parts</title>
<style>
body{{margin:0;background:#0d1b2e;color:#dbe5f1;font:16px/1.4 system-ui,sans-serif}}
main{{max-width:720px;margin:0 auto;padding:20px 16px 48px}}
h1{{font-size:26px;margin:0}} h1 span{{color:#9be15d}}
.sub{{color:#7d93ad;margin:4px 0 18px}}
ul{{list-style:none;padding:0;margin:0;display:grid;gap:10px}}
li{{background:#10233b;border:1px solid #1c3150;border-radius:10px;padding:12px 14px}}
li.next{{opacity:.6}}
.top{{display:flex;gap:10px;align-items:baseline}}
.id{{color:#7d93ad;font-weight:700;min-width:26px}}
.st{{margin-left:auto;font-size:13px;font-weight:700;text-transform:uppercase}}
p{{margin:4px 0 0 36px;color:#b8c6d8;font-size:15px}}
.links{{margin:8px 0 0 36px;display:flex;gap:8px;flex-wrap:wrap}}
a{{color:#8fd3ea;border:1px solid #2a4a73;border-radius:6px;padding:5px 10px;text-decoration:none;font-weight:600;font-size:14px}}
.back{{border:0;padding:0;display:inline-block;margin-bottom:12px}}
</style></head><body><main>
<a class="back" href="/projects/addie/mosquito-turret">&larr; MS-2000</a>
<h1>MS-2000 <span>3D parts</span></h1>
<p class="sub" style="margin-left:0">Printer: Flashforge Adventurer 5M, PLA. Designed from datasheets; re-checked with calipers when the parts arrive.</p>
<ul>{''.join(rows)}</ul>
</main></body></html>"""
open(sys.argv[1] if len(sys.argv) > 1 else 'out/index.html', 'w').write(page)

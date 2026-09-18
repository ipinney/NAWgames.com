"""Flying Mosquito drone in 3D (colored, tappable legend, explode), from the MS-2000 turret viewer template.
Usage: python make_drone3d.py OUT_DIR   -> OUT_DIR/flymo-drone-3d.html
Viewer frame: the drone is turned 180 degrees so the white window faces -y (the template's Front view)."""
import os, sys, json, math, html
import numpy as np, trimesh
import manifold3d as m
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from cadkit import box, cyl, union, M, CS
from components import V
import runpy

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
P = os.path.join(OUT, 'parts')
asm = runpy.run_path(os.path.join(HERE, 'make_assembly.py'), run_name='lib')   # rebuilds flymo-drone too
MX, T = V('litewing', 'motor_xy'), V('litewing', 'pcb_t')


def stl(stem):
    t = trimesh.load(os.path.join(P, stem + '.stl')); t.merge_vertices()
    return np.asarray(t.vertices), np.asarray(t.faces)


def mf(s):
    mm = s.to_mesh()
    return np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts)


motors = union([cyl(sx * MX, sy * MX, -V('motor', 'below'), -V('motor', 'below') + V('motor', 'len'), V('motor', 'd'), 32)
                for sx in (-1, 1) for sy in (-1, 1)])
pz = V('motor', 'prop_z')
props = union([cyl(sx * MX, sy * MX, pz - 0.4, pz + 0.4, V('prop', 'd'), 64) + cyl(sx * MX, sy * MX, pz - 2, pz + 2, 5, 24)
               for sx in (-1, 1) for sy in (-1, 1)])
pm = V('posmod', 'drop')
posmod = box(-V('posmod', 'w') / 2, V('posmod', 'w') / 2, -V('posmod', 'l') / 2, V('posmod', 'l') / 2, -pm, -pm + 1.6)
posmod = posmod + union([box(sx * 21.1 - 1.3, sx * 21.1 + 1.3, -12, 12, -pm + 1.6, 0.01) for sx in (-1, 1)])
bl, bw, bh = V('battery', 'l'), V('battery', 'w'), V('battery', 'h')
battery = box(-bw / 2, bw / 2, -bl / 2 + 4, bl / 2 + 4, T, T + bh)
xl, xw, xh = V('xiao', 'l'), V('xiao', 'w'), V('xiao', 'h')
bt = T + bh
xiao = box(-xw / 2, xw / 2, -12.0, -12.0 + xl, bt + 2.6, bt + 2.6 + xh)
sw, sl, sh = V('light_sensor', 'w'), V('light_sensor', 'l'), V('light_sensor', 'h')
CZ = bt + 13.4
sensor = box(-sw / 2, sw / 2, 10.5, 10.5 + sh, CZ - sl / 2, CZ + sl / 2)

pcb = asm['pcb']
SPEC = [  # key, name, color, explode offset, note, mesh
    ('guard', 'Prop guard + legs (F1)', '#6b7280', (0, 0, -45), 'Printed. A fence around all four props, collars that push onto the motors, and the landing legs.', stl('flymo-f1-guard')),
    ('cup', 'Hit window (F2)', '#f4f4f4', (0, -40, 60), 'Printed in white. The laser dot makes the whole 40 mm face glow.', stl('flymo-f2-cup')),
    ('body', 'Mosquito body (F2)', '#a3e635', (0, 0, 60), 'Printed. Holds the light sensor and the XIAO radio. The battery strap goes through its floor.', stl('flymo-f2-body')),
    ('pcb', 'LiteWing drone board', '#1f5130', (0, 0, 0), 'Bought. The flight computer is the frame: ESP32-S3, motion sensor, motor drivers, WiFi.', mf(pcb)),
    ('motors', '4 motors', '#b87333', (0, 0, -20), 'Bought (come with the drone). Two spin one way, two the other.', mf(motors)),
    ('props', '4 propellers', '#60a5fa', (0, 0, 22), 'Bought (come with the drone). 55 mm. Shown as see-through disks.', mf(props)),
    ('posmod', 'Positioning module', '#7c3aed', (0, 0, -75), 'Bought. A tiny camera that watches the floor and a laser range finder for height. It lets the drone hold still.', mf(posmod)),
    ('battery', 'Battery (1S LiPo)', '#374151', (0, 0, 32), 'Bought. 3.7 V, about 16 g. Unplug it when you are done flying.', mf(battery)),
    ('xiao', 'XIAO ESP32-C3', '#2563eb', (0, 30, 95), 'Bought. A tiny radio computer inside the body. Sends HIT to the control box.', mf(xiao)),
    ('sensor', 'Light sensor', '#3b4fc4', (0, -20, 95), 'Bought. Behind the white window. Feels the laser dot.', mf(sensor)),
]
printed = {'guard', 'cup', 'body'}
R180 = np.array([[-1, 0, 0], [0, -1, 0], [0, 0, 1.0]])
parts, allv, meshes = [], [], {}
for k, n, c, off, note, (v, f) in SPEC:
    v = np.asarray(v) @ R180.T
    off = (-off[0], -off[1], off[2])
    meshes[k] = (v, f, off)
    parts.append({'k': k, 'v': np.round(v, 2).flatten().tolist(), 'f': np.asarray(f).astype(int).flatten().tolist(),
                  'c': c, 'o': 0.35 if k == 'props' else 1.0, 'g': k not in printed, 'e': True, 'x': list(off)})
    allv.append(v)
allv = np.vstack(allv)
lo, hi = allv.min(0), allv.max(0)
exp_v = np.vstack([meshes[k][0] + np.array(meshes[k][2]) for k in meshes])
ec, eh = (exp_v.min(0) + exp_v.max(0)) / 2, (exp_v.max(0) - exp_v.min(0)) / 2 * 0.8
body_b = [np.vstack([meshes[k][0] for k in ('cup', 'body')]).min(0).tolist(), np.vstack([meshes[k][0] for k in ('cup', 'body')]).max(0).tolist()]
dims = [{'a': [lo[0], lo[1], lo[2]], 'b': [hi[0], lo[1], lo[2]], 'off': [0, -20, 0], 'text': f'{hi[0] - lo[0]:.0f}', 'note': 'across'},
        {'a': [hi[0], hi[1], lo[2]], 'b': [hi[0], hi[1], hi[2]], 'off': [20, 0, 0], 'text': f'{hi[2] - lo[2]:.0f}', 'note': 'tall'}]
W = json.load(open(os.path.join(OUT, 'weights.json')))


def chip(k, n, c, note):
    return (f'<button data-k="{k}" data-n="{html.escape(n)}" data-c="{c}" data-note="{html.escape(note)}">'
            f'<i style="background:{c}"></i>{html.escape(n)}</button>')


legend = '<button data-all class="on">Whole drone</button>'
for lab, want in (('Printed', True), ('Bought', False)):
    legend += f'<span class="sep">{lab}</span>' + ''.join(chip(k, n, c, note) for k, n, c, off, note, _ in SPEC if (k in printed) == want)
specs = [('Size', f'{hi[0] - lo[0]:.0f} x {hi[1] - lo[1]:.0f} x {hi[2] - lo[2]:.0f} mm'), ('Takeoff weight', f"about {W['_total_g']:.0f} g"),
         ('Added load', f"{W['_payload_g']:.0f} g of about {W['_rated_payload_g']:.0f} g"), ('Printed', '3 flying parts, about 15 g')]
focus_btns = ''.join(f'<button data-f="{k}"{" class=on" if k == "turret" else ""}>{t}</button>'
                     for k, t in (('turret', 'Whole drone'), ('head', 'Body'))) + '<button id="explode">Explode</button>'
data = {'parts': parts, 'bounds': [lo.tolist(), hi.tolist()], 'dims': dims, 'focusStart': 'turret', 'dimsFocus': 'turret',
        'focus': {'turret': [lo.tolist(), hi.tolist()], 'head': body_b}, 'explodeFocus': [(ec - eh).tolist(), (ec + eh).tolist()], 'fitPad': 1.15,
        'views': {'iso': [0.75, 1.1], 'front': [0, 1.5], 'side': [math.pi / 2, 1.5], 'top': [math.pi, .02]}}
tpl = open(os.path.join(HERE, 'drone.tpl.html')).read()
page = (tpl.replace('__TITLE_TEXT__', 'Flying Mosquito drone in 3D')
        .replace('__TITLE_HTML__', 'Flying Mosquito <span>drone</span>')
        .replace('__LEGEND__', legend)
        .replace('__SPECS__', ''.join(f'<div><dt>{html.escape(a)}</dt><dd>{html.escape(b)}</dd></div>' for a, b in specs))
        .replace('__FOCUS__', focus_btns)
        .replace('__FRONT__', 'Front')
        .replace('__FILES__', 'index.html')
        .replace('__HINT__', 'Tap a part to light it up. Explode pulls the drone apart. The white window faces the MS-2000.')
        .replace('__LINKS__', '<a href="/projects/addie/flying-mosquito">Back</a>')
        .replace('__WHOLE__', 'Whole drone').replace('__WHOLE_C__', '#a3e635')
        .replace('--part:#f0b43c', '--part:#a3e635')
        .replace('__DATA__', json.dumps(data, separators=(',', ':'))))
open(os.path.join(OUT, 'flymo-drone-3d.html'), 'w').write(page)
print('drone3d', len(parts), 'meshes', len(page) // 1024, 'KB', (hi - lo).round(1).tolist())

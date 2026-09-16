"""MS-2000 turret in 3D, every component in place, with an exploded view and a tappable parts legend.
Usage: python make_turret3d.py OUT_DIR   -> OUT_DIR/ms2000-turret-3d.html
World frame: x right, y back (base front face at y = 0; the turret looks toward -y), z up."""
import os, sys, json, math, pickle, html, runpy
import numpy as np
import manifold3d as m

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from cadkit import M
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
PD = os.path.join(OUT, 'parts')
asm = runpy.run_path(os.path.join(HERE, 'make_assembly.py'), run_name='lib')
ld = lambda n: pickle.load(open(os.path.join(PD, n), 'rb'))
p2, g2, p4 = ld('p2_parts.pkl'), ld('p2_ghosts.pkl'), ld('p4_parts.pkl')
Z0, TZ, PAN_Y = p2['Z0'], p2['TZ'], 66.0
tt = asm['tt']
items = {k: (n, g, q, s, note, mesh, c) for k, n, g, q, s, note, mesh, c in asm['ITEMS']}

# name, printed?, color, explode offset, note (shown when tapped)
SPEC = [
    ('shell', 'Base shell (P1)', '#ff5fa2', (0, 0, 0), 'Printed. Front window shows the micro:bit, slot lets it lift out, battery bay on the right, speaker grille and arm switch on the back.'),
    ('plate', 'Floor plate (P1)', '#c9477f', (0, 0, -95), 'Printed. Board posts and battery rails; four M2 screws up into the base.'),
    ('board', 'Xia mi board + micro:bit', '#2f6fbf', (0, 0, -70), 'Bought. The turret brain: servos, speaker, camera port, and the relay that switches the laser.'),
    ('pack', '4xAA battery pack', '#5b6270', (85, 0, -70), 'Bought. About 6 V. Slides in from the right; its switch is the main power.'),
    ('pservo', 'Pan servo', '#3d7cc9', (0, 0, -40), 'Bought. Hangs under the top and turns the turntable left and right.'),
    ('pan_horn', 'Pan horn', '#e6e6e6', (0, 0, 22), 'Comes with the servo. Presses into the pocket under the turntable.'),
    ('speaker', 'Speaker', '#1d9a4a', (0, 70, 0), 'Bought. Pew, boom, lock-on beep, victory sound. Faces the back grille.'),
    ('switch', 'Laser arm switch', '#f2c14e', (0, 55, 0), 'Bought. Cuts power to the laser. Grown-up side, on the back.'),
    ('yoke', 'Turntable + yoke (P2)', '#9be15d', (0, 0, 45), 'Printed. Spins on the pan servo and holds the tilt servo and the head.'),
    ('tservo', 'Tilt servo', '#3d7cc9', (55, 0, 45), 'Bought. Tips the head up and down (30 down to 35 up, printed stops).'),
    ('tilt_horn', 'Tilt horn', '#e6e6e6', (30, 0, 85), 'Comes with the servo. Sits in the pocket on the right side of the head.'),
    ('pin', 'Pivot pin (P3)', '#f0b43c', (-55, 0, 85), 'Printed. The left tilt axle; an M2 screw holds it in the head.'),
    ('head', 'Camera + laser head (P4)', '#4ad0e8', (0, 0, 85), 'Printed. Holds the camera and the laser, aimed the same way.'),
    ('husky', 'HuskyLens camera', '#e8e8e8', (0, -45, 105), 'Bought. Learns the mosquito and reports where it is. Screen faces the back.'),
    ('laser', 'Laser, Class 2 (under 1 mW)', '#ff4040', (0, -70, 70), 'Bought. Under the camera, tilted up 2.4 degrees so the dot meets the camera aim at 3 ft.'),
]


def mf(s):
    mm = s.to_mesh()
    return np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts)


meshes = {k: items[k][5] for k in items if k != 'horns'}
meshes['pan_horn'] = tt(g2['pan_horn'])
meshes['tilt_horn'] = tt(g2['tilt_horn'])
printed = {k for k in items if items[k][1] == 'printed'}

parts, allv = [], []
for k, name, col, off, note in SPEC:
    v, f = meshes[k]
    parts.append({'k': k, 'v': np.round(v, 2).flatten().tolist(), 'f': np.asarray(f).astype(int).flatten().tolist(),
                  'c': col, 'o': 1.0, 'g': k not in printed, 'e': k in printed, 'x': list(off)})
    allv.append(np.asarray(v))
# laser beam stub
LZ = p4['LZ']
toe = math.atan((p4['LENS'][2] - LZ) / 914.4)
lf = np.array([0.4, -14.0, LZ]) + [0, PAN_Y, Z0 + TZ]
L = 260.0
d = np.array([0, -1.0, math.tan(toe)]); d /= np.linalg.norm(d)
p1 = lf + d * L
zax = d; xax = np.cross(zax, [0, 0, 1.0]); xax /= np.linalg.norm(xax); yax = np.cross(zax, xax)
beam = M.cylinder(L, 0.9, 0.9, 8).transform(np.column_stack([xax, yax, zax, lf]))
bv, bf = mf(beam)
parts.append({'k': 'beam', 'v': np.round(bv, 2).flatten().tolist(), 'f': bf.astype(int).flatten().tolist(),
              'c': '#ff2020', 'o': .9, 'g': False, 'e': False, 'x': [0, 0, 0]})

allv = np.vstack(allv)
lo, hi = allv.min(0), allv.max(0)
turret_b = [lo.tolist(), hi.tolist()]
exp_v = np.vstack([np.asarray(meshes[k][0]) + np.array(off) for k, _, _, off, _ in SPEC])
ec, eh = (exp_v.min(0) + exp_v.max(0)) / 2, (exp_v.max(0) - exp_v.min(0)) / 2 * 0.78
exp_b = [(ec - eh).tolist(), (ec + eh).tolist()]
base_b = [np.vstack([meshes[k][0] for k in ('shell', 'plate')]).min(0).tolist(), np.vstack([meshes[k][0] for k in ('shell', 'plate')]).max(0).tolist()]
head_keys = ('yoke', 'head', 'husky', 'laser', 'tservo')
head_b = [np.vstack([meshes[k][0] for k in head_keys]).min(0).tolist(), np.vstack([meshes[k][0] for k in head_keys]).max(0).tolist()]

tilt_z = Z0 + TZ
dims = [
    {'a': [lo[0], lo[1], 0], 'b': [hi[0], lo[1], 0], 'off': [0, -22, 0], 'text': f'{hi[0] - lo[0]:.0f}', 'note': 'wide'},
    {'a': [hi[0], 0, 0], 'b': [hi[0], 133, 0], 'off': [22, 0, 0], 'text': '133', 'note': 'deep'},
    {'a': [-71, 133, 0], 'b': [-71, 133, hi[2]], 'off': [-22, 10, 0], 'text': f'{hi[2]:.0f}', 'note': 'tall'},
    {'a': [71, 133, 0], 'b': [71, 133, tilt_z], 'off': [22, 10, 0], 'text': f'{tilt_z:.0f}', 'note': 'to tilt axis'},
]
def _chip(k, n, c, note):
    return (f'<button data-k="{k}" data-n="{html.escape(n)}" data-c="{c}" data-note="{html.escape(note)}">'
            f'<i style="background:{c}"></i>{html.escape(n)}</button>')
legend = '<button data-all class="on">Whole turret</button>'
for grp, lab in (('Printed', 'Printed'), ('Bought', 'Bought')):
    legend += f'<span class="sep">{lab}</span>'
    legend += ''.join(_chip(k, n, c, note) for k, n, c, off, note in SPEC
                      if note.startswith('Printed') == (grp == 'Printed'))
specs = [('Size', f'{hi[0] - lo[0]:.0f} × 133 × {hi[2]:.0f} mm'), ('Pan / tilt', '±90° / 30° down to 35° up'),
         ('Printed', '5 pieces, ~225 g'), ('Bought', '10 parts')]
focus_btns = ''.join(f'<button data-f="{k}"{" class=on" if k == "turret" else ""}>{t}</button>'
                     for k, t in (('turret', 'Whole turret'), ('head', 'Head'), ('base', 'Base'))) + '<button id="explode">Explode</button>'
data = {'parts': parts, 'bounds': turret_b, 'dims': dims, 'focusStart': 'turret', 'dimsFocus': 'turret',
        'focus': {'turret': turret_b, 'head': head_b, 'base': base_b}, 'explodeFocus': exp_b, 'fitPad': 1.15,
        'views': {'iso': [0.75, 1.1], 'front': [0, 1.5], 'side': [math.pi / 2, 1.5], 'top': [math.pi, .02]}}
tpl = open(os.path.join(HERE, 'turret.tpl.html')).read()
page = (tpl.replace('__TITLE_TEXT__', 'MS-2000 Mosquito Shooter turret in 3D')
        .replace('__TITLE_HTML__', 'MS-2000 <span>turret</span>')
        .replace('__LEGEND__', legend)
        .replace('__SPECS__', ''.join(f'<div><dt>{html.escape(a)}</dt><dd>{html.escape(b)}</dd></div>' for a, b in specs))
        .replace('__FOCUS__', focus_btns)
        .replace('__FRONT__', 'Front')
        .replace('__FILES__', 'index.html')
        .replace('__HINT__', 'Tap a part below to light it up. Explode pulls the turret apart; Bought hides the bought parts so only the prints show.')
        .replace('__LINKS__', '<a href="ms2000-3d.html">Whole setup</a> · <a href="/projects/addie/mosquito-turret">Back</a>')
        .replace('__WHOLE__', 'Whole turret').replace('__WHOLE_C__', '#ff5fa2')
        .replace('--part:#f0b43c', '--part:#ff5fa2')
        .replace('__DATA__', json.dumps(data, separators=(',', ':'))))
open(os.path.join(OUT, 'ms2000-turret-3d.html'), 'w').write(page)
print('turret3d', len(parts), 'meshes', len(page) // 1024, 'KB', 'size', (hi - lo).round(1).tolist())

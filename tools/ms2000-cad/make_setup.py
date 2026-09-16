"""Whole MS-2000 setup in 3D: turret, backdrop, pendulum, stuffed mosquito with its pod, wand, cables.
Usage: python make_setup.py OUT_DIR   -> OUT_DIR/ms2000-3d.html
World frame (mm): x right, y back (turret base front face at y = 0, the turret looks toward -y), z up (table).
The mosquito hangs 3 ft (914 mm) in front of the camera lens, at lens height: the test and demo distance."""
import os, sys, json, math, pickle, html, runpy
import numpy as np, trimesh
import manifold3d as m

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from cadkit import box, cyl, union, M
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
PD = os.path.join(OUT, 'parts')
asm = runpy.run_path(os.path.join(HERE, 'make_assembly.py'), run_name='lib')
ld = lambda n: pickle.load(open(os.path.join(PD, n), 'rb'))
p2, p4, p5, p6 = ld('p2_parts.pkl'), ld('p4_parts.pkl'), ld('p5_parts.pkl'), ld('p6_parts.pkl')
load_stl = lambda stem: (lambda t: (np.asarray(t.vertices), np.asarray(t.faces)))(trimesh.load(os.path.join(PD, stem + '.stl'), process=False))

PAN_Y, Z0, TZ = 66.0, p2['Z0'], p2['TZ']
LENS = np.array(p4['LENS']) + [0, PAN_Y, Z0 + TZ]          # world lens point
LZ = p4['LZ']
TOE = math.atan((p4['LENS'][2] - LZ) / 914.4)
DIST = 914.4


def T(arr, rows):
    """apply a 3x4 [R|t] to (v, f)"""
    v, f = arr
    R = np.asarray(rows, float)
    return np.asarray(v, float) @ R[:, :3].T + R[:, 3], np.asarray(f)


def mf(s):
    mm = s.to_mesh()
    return np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts)


def tube(p0, p1, r, n=10):
    p0, p1 = np.asarray(p0, float), np.asarray(p1, float)
    d = p1 - p0; L = float(np.linalg.norm(d)); z = d / L
    x = np.cross(z, [0, 0, 1.0] if abs(z[2]) < .9 else [1.0, 0, 0]); x /= np.linalg.norm(x); y = np.cross(z, x)
    rows = np.column_stack([x, y, z, p0])
    return M.cylinder(L, r, r, n).transform(rows)


def polyline(pts, r):
    return union([tube(a, b, r) for a, b in zip(pts, pts[1:])] + [M.sphere(r, 8).translate(list(p)) for p in pts[1:-1]])


# ---------------- layout ----------------
POD_FRONT_Y = LENS[1] - DIST            # pod face 3 ft from the lens
MZ = LENS[2]                            # pod center at lens height
POD_Y0 = POD_FRONT_Y - 20.0             # pod local z = 0 (the stuffy side)
TAB = (0.0, 33.7, 3.0)                  # pod line tab, pod local
PEG_Y = POD_Y0 + TAB[2]
PIV_Y0 = PEG_Y - 6.75                   # pivot local z = 0 (ring back face)
DOWEL_L = 250.0
BOARD_Y = PIV_Y0 - DOWEL_L              # backdrop mid-plane
BOARD_T, BOARD_W, BOARD_H = 5.0, 762.0, 508.0
BOARD_Z0 = 4.0
BOARD_TOP = BOARD_Z0 + BOARD_H
DOWEL_Z = BOARD_TOP + 10.0              # clip hole is 10 above the bridge underside
PIVOT_Z0 = DOWEL_Z - 18.0               # pivot local y = 0 (the peg) in world z
FOOT_X = 300.0

pod_rows = [[-1, 0, 0, 0], [0, 0, 1, POD_Y0], [0, 1, 0, MZ]]
piv_rows = [[-1, 0, 0, 0], [0, 0, 1, PIV_Y0], [0, 1, 0, PIVOT_Z0]]
clip_rows = [[0, 0, 1, -15.0], [1, 0, 0, BOARD_Y], [0, 1, 0, BOARD_TOP - 22.0]]
foot_rows = lambda x0: [[0, 1, 0, x0 - 16.0], [-1, 0, 0, BOARD_Y], [0, 0, 1, 0]]
WAND_Y0 = PIV_Y0 - 2.0
wand_rows = [[-1, 0, 0, 0], [0, -1, 0, WAND_Y0], [0, 0, 1, DOWEL_Z + 3.175]]

# stuffed mosquito (stand-in): body along x, pod stuck on the side that faces the turret
SY = POD_Y0 - 14.0
body = M.sphere(1, 40).scale([46, 17, 19]).translate([0, SY, MZ])
head = M.sphere(15, 32).translate([50, SY, MZ + 6])
nose = tube([62, SY, MZ + 4], [98, SY, MZ - 8], 1.6)
eyes = union([M.sphere(5, 16).translate([56, SY + s * 9, MZ + 12]) for s in (-1, 1)])
wings = union([M.sphere(1, 32).scale([34, 13, 1.6]).rotate([s * 20, -25, 0]).translate([-14, SY + s * 16, MZ + 22]) for s in (-1, 1)])
legs = []
for i, lx in enumerate((-18, 0, 18)):
    for s in (-1, 1):
        k = [lx, SY + s * 8, MZ - 12]; kn = [lx + 12 - i * 12, SY + s * 34, MZ - 30]; ft = [lx + 20 - i * 18, SY + s * 38, MZ - 72]
        legs.append(polyline([k, kn, ft], 1.3))
stuffy = union([body, head, nose, wings] + legs)

board = box(-BOARD_W / 2, BOARD_W / 2, BOARD_Y - BOARD_T / 2, BOARD_Y + BOARD_T / 2, BOARD_Z0, BOARD_TOP)
dowel = tube([0, BOARD_Y - 25.0, DOWEL_Z], [0, PIV_Y0 + 12.0, DOWEL_Z], 3.175, 16)
peg = np.array([0.0, PEG_Y, PIVOT_Z0])
tab_w = np.array([0.0, POD_Y0 + TAB[2], MZ + TAB[1]])
line = tube(peg + [0, 0, -2], tab_w, 0.35, 6)
ribbon_pts = [[0, WAND_Y0 + 1, DOWEL_Z + 8], [7.5, PEG_Y - 3, DOWEL_Z - 4], [7.5, PEG_Y, PIVOT_Z0 - 10],
              [7.5, PEG_Y, MZ + 45], [0, POD_Y0 + 2.2, MZ + 29]]
ribbon = polyline(ribbon_pts, 1.1)
clip_mesh = trimesh.load(os.path.join(PD, 'ms2000-p8-clips.stl'), process=False)
one_clip = clip_mesh.submesh([np.where(np.all(clip_mesh.vertices[clip_mesh.faces][:, :, 1] > 14, axis=1)
                                      & np.all(clip_mesh.vertices[clip_mesh.faces][:, :, 1] < 25, axis=1)
                                      & np.all(clip_mesh.vertices[clip_mesh.faces][:, :, 0] < -33, axis=1))[0]], append=True)
cb = one_clip.bounds
one_clip.apply_translation([-(cb[0][0] + cb[1][0]) / 2 + 5.0, -(cb[0][1] + cb[1][1]) / 2, -2.0])   # line hole on the axis
clips = []
for zc in np.linspace(PIVOT_Z0 - 90, MZ + 70, 4):
    c = one_clip.copy()
    c.apply_translation([0, PEG_Y, zc])
    clips.append(c)
clips = trimesh.util.concatenate(clips)

# laser beam: laser front in the head frame, toed up
lf = np.array([0.4, -14.0, LZ]) + [0, PAN_Y, Z0 + TZ]
L = lf[1] - POD_FRONT_Y
beam = tube(lf, lf + [0, -L, L * math.tan(TOE)], 0.9, 8)

# ---------------- parts list for the viewer ----------------
parts, focus_sets = [], {'turret': [], 'mosquito': [], 'setup': []}
def add(key, mesh, color, ghost=False, opacity=1.0, edges=True, focus=()):
    v, f = mesh
    parts.append({'k': key, 'v': np.round(v, 2).flatten().tolist(), 'f': np.asarray(f).astype(int).flatten().tolist(),
                  'c': color, 'o': opacity, 'g': ghost, 'e': edges and not ghost})
    for fs in ('setup',) + tuple(focus):
        focus_sets[fs].append(v)

for k, n, g, q, s, note, mesh, c in asm['ITEMS']:
    add(k, mesh, c, ghost=(g == 'bought'), opacity=1.0 if g == 'printed' else 0.55, focus=('turret',))
add('pivot', T(load_stl('ms2000-p7-pendulum-pivot'), piv_rows), '#f0b43c', focus=('mosquito',))
add('clip', T(load_stl('ms2000-p7-backdrop-clip'), clip_rows), '#9be15d')
for x0 in (-FOOT_X, FOOT_X):
    add('foot', T(load_stl('ms2000-p7-backdrop-foot'), foot_rows(x0)), '#9be15d')
add('wand', T(p5['wand'], wand_rows), '#b48cff', focus=('mosquito',))
add('wand_bit', T(p5['bit'], wand_rows), '#5a616c', ghost=True, opacity=0.8)
add('wand_pack', T(p5['pack'], wand_rows), '#50555e', ghost=True, opacity=0.8)
add('pod_front', T(p6['cup'], pod_rows), '#f4f4f4', focus=('mosquito',))
add('pod_back', T(p6['cap'], pod_rows), '#ff5fa2', focus=('mosquito',))
add('pod_leds', T(p6['leds'], pod_rows), '#ff2a2a', ghost=True, opacity=1.0)
add('cable_clips', (clips.vertices, clips.faces), '#f4f4f4', edges=False)
add('stuffy', mf(stuffy), '#8a6d4b', ghost=True, opacity=1.0, focus=('mosquito',))
add('board', mf(board), '#23272e', ghost=True, opacity=1.0)
add('dowel', mf(dowel), '#d9b98b', ghost=True, opacity=1.0)
add('line', mf(line), '#cfe8ff', ghost=True, opacity=0.9)
add('ribbon', mf(ribbon), '#ff9f43', ghost=True, opacity=1.0)
add('beam', mf(beam), '#ff2020', opacity=0.9, edges=False)

bounds_of = lambda vs: (lambda a: [a.min(0).tolist(), a.max(0).tolist()])(np.vstack(vs))
focus = {k: bounds_of(v) for k, v in focus_sets.items()}
bb = focus['setup']
dims = [
    {'a': [BOARD_W / 2 + 40, LENS[1], 0], 'b': [BOARD_W / 2 + 40, POD_FRONT_Y, 0], 'off': [0, 0, 0], 'text': '3 ft', 'note': 'lens to mosquito (914 mm)'},
    {'a': [-BOARD_W / 2, BOARD_Y, BOARD_TOP], 'b': [BOARD_W / 2, BOARD_Y, BOARD_TOP], 'off': [0, 0, 60], 'text': '30 in', 'note': 'foam board'},
    {'a': [-BOARD_W / 2, BOARD_Y, BOARD_Z0], 'b': [-BOARD_W / 2, BOARD_Y, BOARD_TOP], 'off': [-60, 0, 0], 'text': '20 in', 'note': ''},
]
COL = [('turret base', '#ff5fa2'), ('turntable + backdrop parts', '#9be15d'), ('camera + laser head', '#4ad0e8'),
       ('pivots', '#f0b43c'), ('wand', '#b48cff'), ('mosquito pod', '#f4f4f4'), ('ribbon cable', '#ff9f43'), ('laser beam', '#ff2020')]
legend = '<span class="sep">Colors</span>' + ''.join(f'<span class="key"><i style="background:{c}"></i>{html.escape(n)}</span>' for n, c in COL)
specs = [('Distance', '3 ft (demo 2 to 3 ft)'), ('Turret', '142 × 133 × 143 mm'),
         ('Backdrop', '30 × 20 in foam board'), ('Printing', '5 plates, ~10 h, ~320 g')]
focus_btns = ''.join(f'<button data-f="{k}"{" class=on" if k == "turret" else ""}>{t}</button>'
                     for k, t in (('turret', 'Turret'), ('mosquito', 'Mosquito and wand'), ('setup', 'Whole setup')))
data = {'parts': parts, 'bounds': bb, 'dims': dims, 'focus': focus, 'focusStart': 'turret', 'fitPad': 1.02,
        'views': {'iso': [2.45, 1.12], 'front': [math.pi, 1.5], 'side': [math.pi / 2, 1.45], 'top': [math.pi, .02]}}
tpl = open(os.path.join(HERE, 'setup.tpl.html')).read()
page = (tpl.replace('__TITLE_TEXT__', 'MS-2000 Mosquito Shooter in 3D')
        .replace('__TITLE_HTML__', 'MS-2000 <span>in 3D</span>')
        .replace('__LEGEND__', legend)
        .replace('__SPECS__', ''.join(f'<div><dt>{html.escape(k)}</dt><dd>{html.escape(v)}</dd></div>' for k, v in specs))
        .replace('__FOCUS__', focus_btns)
        .replace('__FRONT__', 'Turret view')
        .replace('__FILES__', 'index.html')
        .replace('__HINT__', 'Opens on the turret. Tap Mosquito and wand or Whole setup to fly over. Bought hides the bought parts and the backdrop; Laser shows the beam.')
        .replace('__LINKS__', '<a href="ms2000-turret-3d.html">Turret parts</a> · <a href="/projects/addie/mosquito-turret">Back</a>')
        .replace('__WHOLE__', 'MS-2000 setup').replace('__WHOLE_C__', '#9be15d')
        .replace('--part:#f0b43c', '--part:#ff5fa2')
        .replace('__DATA__', json.dumps(data, separators=(',', ':'))))
open(os.path.join(OUT, 'ms2000-3d.html'), 'w').write(page)
print('setup', len(parts), 'meshes', len(page) // 1024, 'KB', 'pod face y', round(POD_FRONT_Y, 1), 'board y', round(BOARD_Y, 1),
      'beam z at pod', round(lf[2] + L * math.tan(TOE), 1), 'lens z', round(MZ, 1))

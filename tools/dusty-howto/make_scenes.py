"""Scenes for the Dusty print-plan pictures: part cards, labeled plates and the
"When it is done" step pictures.
Usage: /opt/cad-venv/bin/python make_scenes.py ASSEMBLY_PKL FILES_DIR OUT_JSON
  ASSEMBLY_PKL  from tools/dusty-chassis/assemble.py (parts in place on the robot)
  FILES_DIR     public/projects/nolan/dusty-files (single-part and plate STLs)
Model axes: x right, y back (front is -y), z up. Units mm."""
import sys, json, math, pickle
import numpy as np, trimesh

PKL, FILES, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
d = pickle.load(open(PKL, 'rb'))
PR = {k: trimesh.Trimesh(*v, process=False) for k, v in d['printed'].items()}
GH = {k: trimesh.Trimesh(*v, process=False) for k, v in d['ghosts'].items()}

COL = {'base': '#f0b43c', 'deck': '#f0b43c', 'post': '#f0b43c', 'post1': '#f0b43c', 'post2': '#f0b43c',
       'dowel': '#f0b43c', 'dowel1': '#f0b43c', 'dowel2': '#f0b43c', 'cradle': '#e8793a',
       'tray': '#5cc98a', 'roller': '#b48cff', 'axle': '#b48cff', 'collar': '#b48cff',
       'pinion': '#4aa8ff', 'compound': '#4aa8ff', 'compound_gear': '#4aa8ff', 'roller_gear': '#4aa8ff', 'washer': '#4aa8ff',
       'carrier_R': '#ff6f9a', 'carrier_L': '#ff6f9a', 'sensor_carrier_R': '#ff6f9a', 'sensor_carrier_L': '#ff6f9a',
       'sleeve': '#e0e0e0', 'keeper': '#e0e0e0', 'support': '#ff4d4d'}
STEEL = '#cfd8e3'; MOTOR = '#aab6c3'; BOARD = '#d8373f'; GHOST = '#8fa3b8'; ORANGE = '#ff9f1c'
PENNY = '#c9794a'


def mesh(t, c, op=1.0, edges=True):
    t = t.copy(); t.merge_vertices()
    return {'v': np.round(t.vertices, 2).flatten().tolist(), 'f': t.faces.flatten().tolist(),
            'c': c, 'op': op, 'e': edges}


def moved(t, off=(0, 0, 0)):
    t = t.copy(); t.apply_translation(off); return t


def flip(t):
    """Turn upside down (180 degrees about the front-back axis)."""
    t = t.copy(); t.apply_transform(trimesh.transformations.rotation_matrix(math.pi, [0, 1, 0])); return t


def fp(p):
    return [-p[0], p[1], -p[2]]


def cyl_axis(r, a, b, sections=32):
    a, b = np.array(a, float), np.array(b, float)
    return trimesh.creation.cylinder(radius=r, segment=[a, b], sections=sections)


def screw(L, tip, direction, head_d=3.8):
    """M2 screw. tip: where the point is, direction: unit vector the screw travels (into the hole)."""
    u = np.array(direction, float); u /= np.linalg.norm(u)
    tip = np.array(tip, float)
    top = tip - u * L
    shaft = cyl_axis(1.0, tip, top, 16)
    head = cyl_axis(head_d / 2, top, top - u * 1.4, 24)
    # thread rings so it reads as a screw
    rings = [cyl_axis(1.12, top + u * (s - 0.2), top + u * (s + 0.2), 16) for s in np.arange(1.2, L - 0.4, 0.8)]
    return trimesh.util.concatenate([shaft, head] + rings)


def penny(at):
    t = trimesh.creation.cylinder(radius=19.05 / 2, height=1.52, sections=48)
    t.apply_translation([at[0], at[1], at[2] + 0.76]); return t


def cup(at, r=26, h=48):
    wall = trimesh.creation.annulus(r_min=r - 1.2, r_max=r, height=h, sections=64)
    wall.apply_translation([0, 0, h / 2])
    floor = trimesh.creation.cylinder(radius=r, height=1.2, sections=64); floor.apply_translation([0, 0, 0.6])
    t = trimesh.util.concatenate([wall, floor]); t.apply_translation(at); return t


def load_stl(name):
    t = trimesh.load(f'{FILES}/dusty-{name}.stl'); t.merge_vertices()
    b = t.bounds; t.apply_translation([-(b[0][0] + b[1][0]) / 2, -(b[0][1] + b[1][1]) / 2, -b[0][2]])
    return t


def centered(t):
    t = t.copy(); b = t.bounds
    t.apply_translation([-(b[0][0] + b[1][0]) / 2, -(b[0][1] + b[1][1]) / 2, -b[0][2]]); return t


def A(*a, c=ORANGE):
    return {'a': list(a[0]), 'b': list(a[1]), 'c': c}


def T(center, axis, r, c=ORANGE, start=20, sweep=250):
    return {'twist': True, 'o': list(center), 'ax': list(axis), 'r': r, 'c': c, 's0': start, 'sw': sweep}


def L(p, t, dx, dy, c='#ffffff'):
    return {'p': [float(x) for x in p], 't': t, 'dx': dx, 'dy': dy, 'c': c}


scenes = {}


def scene(name, meshes, arrows=(), labels=(), az=35, el=28, zoom=1.0, ground='table', w=900, h=600, focus=None, cam=None):
    scenes[name] = {'w': w, 'h': h, 'meshes': meshes, 'arrows': list(arrows), 'labels': list(labels),
                    'az': az, 'el': el, 'zoom': zoom, 'ground': ground, 'focus': focus, 'cam': cam}


# ---------------------------------------------------------------- part cards
CARD = [  # key, stl name, flip for the picture, labels as (point fn on the centered mesh, text, dx, dy)
    ('pinion', 'pinion', False), ('washer', 'washer', False), ('collar', 'collar', False),
    ('dowel', 'dowel', False), ('post', 'post', True), ('base', 'base', False),
    ('support', None, False), ('deck', 'deck', False), ('sleeve', 'sleeve', False), ('keeper', 'keeper', False),
    ('carrier_R', 'sensor_carrier_R', False), ('carrier_L', 'sensor_carrier_L', False),
    ('cradle', 'cradle', False), ('compound', 'compound_gear', False), ('roller_gear', 'roller_gear', False),
    ('roller', 'roller', False), ('axle', 'axle', False), ('tray', 'tray', False),
]

plate2 = trimesh.load(f'{FILES}/dusty-plate-2-base.stl'); plate2.merge_vertices()
p2parts = plate2.split(only_watertight=False)
support = [q for q in p2parts if 200 < q.volume < 300][0]

for key, stl, fl in CARD:
    t = centered(support) if key == 'support' else load_stl(stl)
    if fl:
        t = centered(flip(t))
    b = t.bounds; size = b[1] - b[0]
    px = b[1][0] + 6 + 19.05 / 2
    ms = [mesh(t, COL[key]), mesh(penny([px, 0, 0]), PENNY)]
    labels = [L([px, -19.05 / 2 * 0.2, 1.5], 'penny', 60, 70, '#e6b48f')]
    if key == 'post':
        labels += [L([0, 0, size[2]], 'screw hole (top)', -170, -40), L([0, 0, 1.0], 'skinny peg (bottom)', -190, 40)]
    if key == 'collar':
        labels += [L([0, 0, 3], 'D-shaped hole', -150, -60)]
    if key == 'washer':
        labels += [L([0, 0, 1], 'round hole', -140, -60)]
    if key == 'compound':
        labels += [L([b[1][0] - 1.5, 0, 1.5], '36 teeth (big)', 40, 90), L([0, 6.0, size[2]], '10 teeth (small)', -170, -80)]
    if key == 'axle':
        labels += [L([0, 0, size[2]], 'flat side', -60, -80)]
    if key == 'carrier_L':
        labels += [L([b[1][0] - 1, 0, size[2] * 0.6], 'switch pad', 60, -80)]
    if key == 'roller_gear':
        labels += [L([0, 0, size[2]], 'D-shaped hole', -150, -70)]
    scenes_key = f'part-{key}'
    zm = 1.35 if key in ('pinion', 'washer', 'collar', 'dowel', 'support') else 1.0
    scene(scenes_key, ms, labels=labels, az=30, el=34 if key not in ('post', 'roller', 'sleeve') else 18,
          zoom=zm, w=600, h=420)

# ---------------------------------------------------------------- labeled plates
NAMES = {'pinion': 'motor gear', 'washer': 'washer', 'collar': 'axle collar', 'dowel': 'dowel', 'post': 'deck post',
         'base': 'base plate', 'support': 'support block', 'deck': 'deck', 'sleeve': 'battery sleeve', 'keeper': 'keeper bar',
         'sensor_carrier_R': 'right sensor arm', 'sensor_carrier_L': 'left sensor arm', 'cradle': 'motor mount',
         'compound_gear': 'big gear', 'roller_gear': 'roller gear', 'roller': 'brush roller', 'axle': 'axle', 'tray': 'crumb tray'}
PLATES = {1: ['pinion', 'washer', 'collar', 'dowel', 'post'], 2: ['base', 'post', 'support'],
          3: ['deck', 'sleeve', 'keeper', 'sensor_carrier_R', 'sensor_carrier_L'],
          4: ['cradle', 'compound_gear', 'roller_gear', 'roller', 'axle'], 5: ['tray']}
STEMS = {1: 'dusty-plate-1-fit-check', 2: 'dusty-plate-2-base', 3: 'dusty-plate-3-deck-and-arms',
         4: 'dusty-plate-4-brush-drive', 5: 'dusty-plate-5-tray'}
POFF = {(4, 'cradle', 0): (-40, 120), (4, 'axle', 0): (60, 150), (4, 'compound_gear', 0): (0, -95),
        (4, 'roller_gear', 0): (40, 100), (4, 'roller', 0): (0, -110),
        (3, 'sleeve', 0): (-150, 80), (3, 'deck', 0): (0, -100), (3, 'keeper', 0): (40, 110),
        (3, 'sensor_carrier_R', 0): (0, 100), (3, 'sensor_carrier_L', 0): (20, -100),
        (1, 'post', 0): (60, -120)}
REF = {}
for k in NAMES:
    if k == 'support':
        REF[k] = sorted(support.bounds[1] - support.bounds[0])
    else:
        t = load_stl(k); REF[k] = sorted(t.bounds[1] - t.bounds[0])
for n, keys in PLATES.items():
    t = trimesh.load(f'{FILES}/{STEMS[n]}.stl'); t.merge_vertices()
    pieces = t.split(only_watertight=False)
    big = sorted(pieces, key=lambda q: -q.volume)
    kept = []
    for q in big:  # drop slivers and islands that sit inside a bigger piece
        b = q.bounds
        if any((b[0] <= k.bounds[1] + 1.0).all() and (b[1] >= k.bounds[0] - 1.0).all() for k in kept):
            continue
        kept.append(q)
    ms, labels = [], []
    placed = []
    for q in kept:
        dims = sorted(q.bounds[1] - q.bounds[0])
        key = min(keys, key=lambda k: np.abs(np.array(REF[k]) - dims).sum())
        c = COL.get(key, '#f0b43c')
        ms.append(mesh(q, c))
        b = q.bounds
        placed.append((key, [(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2, b[1][2]]))
    placed.sort(key=lambda kp: kp[1][0])
    seen = {}
    for i, (key, p) in enumerate(placed):
        j = seen.get(key, 0); seen[key] = j + 1
        off = POFF.get((n, key, j))
        if off is None:
            off = (0, -95 if i % 2 == 0 else 95)
        labels.append(L(p, NAMES[key], *off))
    scene(f'plate-{n}', ms, labels=labels, ground='bed', cam={'pos': [0, 230, 250], 'at': [0, 0, -5], 'fov': 30})

# ---------------------------------------------------------------- step pictures
post = PR['post2']; pb = post.bounds
pc = [(pb[0][0] + pb[1][0]) / 2, (pb[0][1] + pb[1][1]) / 2]
POST_TOP = [pc[0], pc[1], pb[1][2]]

# Batch 1 step 1: screw into the top of a deck post (peg end down)
s = screw(8, [POST_TOP[0], POST_TOP[1], POST_TOP[2] + 9], [0, 0, -1])
scene('b1-s1', [mesh(post, COL['post']), mesh(s, STEEL)],
      arrows=[A([POST_TOP[0] + 9, POST_TOP[1], POST_TOP[2] + 22], [POST_TOP[0] + 9, POST_TOP[1], POST_TOP[2] + 6]),
              T([POST_TOP[0], POST_TOP[1], POST_TOP[2] + 17.5], [0, 0, 1], 5.5)],
      labels=[L([POST_TOP[0], POST_TOP[1], POST_TOP[2] + 17.5], 'M2 × 8 screw', -210, -40),
              L([POST_TOP[0], POST_TOP[1] - 2.8, POST_TOP[2] - 0.5], 'small hole: this end is the top', -250, 60),
              L([pc[0], pc[1] - 2.0, pb[0][2] + 1.5], 'skinny peg: bottom', 90, -20),
              L([POST_TOP[0] + 9, POST_TOP[1], POST_TOP[2] + 14], 'twist clockwise', 90, -40, ORANGE)],
      az=25, el=16, zoom=0.85, focus=[pc[0], pc[1], pb[1][2] - 2])

# Batch 1 step 2: motor gear onto the 130 motor shaft
mot = GH['130 brush motor']; pin = PR['pinion']
MY, MZ = 22.7, 42.5
scene('b1-s2', [mesh(mot, MOTOR), mesh(moved(pin, [20, 0, 0]), COL['pinion'])],
      arrows=[A([62, MY - 10, MZ], [44, MY - 10, MZ])],
      labels=[L([15, MY, MZ + 7.5], '130 brush motor', -60, -110), L([35.5, MY, MZ + 1], 'metal shaft', -40, 120),
              L([54.8, MY, MZ + 5.6], 'motor gear (12 teeth)', 60, -100),
              L([53, MY - 10, MZ], 'push on', 70, 80, ORANGE)],
      az=62, el=22, zoom=1.0)

# Batch 1 step 2b: gear on, the right way
scene('b1-s2b', [mesh(mot, MOTOR), mesh(pin, COL['pinion'])],
      labels=[L([37.0, MY, MZ + 1], 'shaft tip just peeks through', 90, -110),
              L([32.4, MY - 1.5, MZ - 2], 'small gap, about a nickel thick', 60, 110)],
      az=12, el=10, zoom=1.7, focus=[31, MY, MZ])

# Batch 1 step 3: sort into the BATCH 4 cup
small = [('pinion', load_stl('pinion')), ('washer', load_stl('washer')), ('collar', load_stl('collar')),
         ('dowel', load_stl('dowel')), ('dowel', load_stl('dowel'))]
ms, arrows = [mesh(cup([0, 0, 0]), '#e8eef5', 0.28, True)], []
drop = [[-9, -6, 4], [8, -8, 3], [9, 8, 2], [-6, 8, 2], [-1, 1, 2]]
for (k, t), p in zip(small, drop):
    ms.append(mesh(moved(t, p), COL[k]))
lbl = [L([0, -26, 44], 'cup labeled BATCH 4', -40, -110),
       L([-9, -6, 7], 'motor gear', -210, 40), L([8, -8, 4], 'washer', 150, 110),
       L([9, 8, 5], 'collar', 170, -10), L([-6, 8, 5.4], '2 dowels', -200, -50)]
pst = centered(flip(load_stl('post'))); pst.apply_translation([62, 0, 0])
ms.append(mesh(pst, COL['post']))
lbl.append(L([62, 0, 34], 'deck post: keep it with the deck parts', 20, -80))
scene('b1-s3', ms, labels=lbl, az=20, el=32, zoom=1.05)

# Batch 2 step 1: pop the base off the bed (it printed upside down)
basep = [q for q in p2parts if q.volume > 30000][0]
bb = basep.bounds
x0, y0, x1, y1 = bb[0][0], bb[0][1], bb[1][0], bb[1][1]
def slab(a, b, c, d):
    return trimesh.creation.box(extents=[b - a, d - c, 0.4], transform=trimesh.transformations.translation_matrix([(a + b) / 2, (c + d) / 2, 0.2]))
brim = trimesh.util.concatenate([slab(x0 - 5, x1 + 5, y0 - 5, y0), slab(x0 - 5, x1 + 5, y1, y1 + 5),
                                 slab(x0 - 5, x0, y0, y1), slab(x1, x1 + 5, y0, y1)])
lift = 10
scene('b2-s1', [mesh(moved(basep, [0, 0, lift]), COL['base']), mesh(moved(brim, [0, 0, lift]), '#fff2c2')],
      arrows=[A([x1 + 18, (y0 + y1) / 2, 10], [x1 + 18, (y0 + y1) / 2, 45])],
      labels=[L([x1 + 18, (y0 + y1) / 2, 40], 'lift off when the bed is cool', 40, -70, ORANGE),
              L([x0 - 2.5, y0 + 40, lift + 0.4], 'thin brim: peel it off', -120, 110, '#fff2c2')],
      ground='bed', az=25, el=30, zoom=1.35, focus=[(x0 + x1) / 2, (y0 + y1) / 2, 15])

# Batch 2 step 2: the support block under the gear peg (as it comes off the printer)
sb = support.bounds; sc = (sb[0] + sb[1]) / 2
scene('b2-s2', [mesh(basep, COL['base']), mesh(support, COL['support'])],
      arrows=[A([sc[0], sc[1] - 12, sb[1][2] - 2], [sc[0], sc[1] - 12, sb[1][2] + 18])],
      labels=[L([sc[0], sc[1], sb[1][2]], 'support block: lift it off, throw it away', -60, 150, '#ff8a8a'),
              L([sc[0], sc[1], sb[1][2] + 5], 'gear peg', 140, -70)],
      ground='bed', az=-35, el=35, zoom=1.6, focus=[sc[0], sc[1], 10])

# Batch 2 step 3: pilot holes (base as it comes off the printer, underside up)
B = PR['base']
holes = [(28.5, 50, 21), (28.5, 68, 21), (-28.5, 50, 21), (-28.5, 68, 21), (6.73, 106, 10.16), (-6.73, 106, 10.16)]
ms = [mesh(flip(B), COL['base'])]
for (x, y, z) in holes:
    p = fp([x, y, z])
    ms.append(mesh(screw(8, [p[0], p[1], p[2] + 1], [0, 0, -1]), STEEL))
gp = fp([41.0, 30.6, 25.0])
ms.append(mesh(screw(8, [gp[0] - 1, gp[1], gp[2]], [1, 0, 0]), STEEL))
scene('b2-s3', ms,
      labels=[L([28.5, 68, -21 + 10.4], '4 holes on the motor pads', 120, -110),
              L([6.73, 106, -10.16 + 10.4], '2 holes in the caster posts', 150, 60),
              L([gp[0] - 10.4, gp[1], gp[2]], '1 hole in the end of the gear peg', -60, 120)],
      az=-30, el=42, zoom=1.45)

# Batch 2 step 4: posts into the base (right way up)
ms = [mesh(B, COL['base'])]
arrows = []
for k in ('post1', 'post2'):
    ms.append(mesh(moved(PR[k], [0, 0, 22]), COL['post']))
    b = PR[k].bounds; c = (b[0] + b[1]) / 2
    arrows.append(A([c[0] + 7, c[1], 60], [c[0] + 7, c[1], 42]))
scene('b2-s4', ms, arrows=arrows,
      labels=[L([36.5, 53, 90], 'deck post', 60, -60), L([-36.5, 53, 34], 'peg holes near the front', -80, 110),
              L([36.5, 53, 30.5 + 22], 'peg end down', 120, 40)],
      az=-25, el=30, zoom=1.2)

# Batch 3 step 1: moto:bit slides into the deck guides
mb = GH['moto:bit']
scene('b3-s1', [mesh(PR['deck'], COL['deck']), mesh(moved(mb, [0, -62, 0]), BOARD)],
      arrows=[A([0, -40, 80], [0, -4, 80])],
      labels=[L([0, -10, 80], 'slide it toward the back', 80, -90, ORANGE), L([-31, -20, 72], 'moto:bit', -70, 90),
              L([36, 110, 71], 'stop at the back', 60, -60), L([-37, 90, 71], 'guides', -120, -60)],
      az=-30, el=38, zoom=1.0)

# Batch 3 step 2: power bank into the sleeve, then the keeper bar
bank = GH['power bank']; slv = PR['sleeve']; kp = PR['keeper']
scene('b3-s2', [mesh(slv, COL['sleeve']), mesh(moved(bank, [-110, 0, 0]), '#8394a8'), mesh(moved(kp, [0, 45, 0]), '#ffd166')],
      arrows=[A([-120, 86, 70], [-90, 86, 70]), A([-39.5, 190, 42], [-39.5, 165, 42])],
      labels=[L([-120, 86, 62], '1. bank slides in, USB ports facing out', -20, -120, ORANGE),
              L([-43, 62, 45], 'open end', -60, 110),
              L([-39.5, 158, 46], '2. keeper bar in through the back slot', 60, 110, ORANGE),
              L([62, 86, 68], 'closed end', 40, -80)],
      az=-140, el=34, zoom=1.0)

# Batch 3 step 3: test-fit a sensor arm on its ear
carR = PR['carrier_R']
scr = screw(8, [42.5, -3.0, 13.0], [-1, 0, 0])
scene('b3-s3', [mesh(B, COL['base'], 0.95), mesh(moved(carR, [12, 0, 0]), COL['carrier_R']), mesh(moved(scr, [26, 0, 0]), STEEL)],
      arrows=[A([80, -3, 22], [60, -3, 22])],
      labels=[L([41.2, -3, 22], 'ear on the base', -120, -110), L([60, -3, 26], 'right sensor arm', 60, -90),
              L([72, -3, 13], 'M2 × 8 through the slot', 60, 90)],
      az=62, el=18, zoom=1.5, focus=[48, 10, 18])

# Batch 4 step 1: clean teeth
gs = [('pinion', load_stl('pinion'), [-30, 0, 0]), ('compound', load_stl('compound_gear'), [0, 0, 0]),
      ('roller_gear', load_stl('roller_gear'), [34, 0, 0])]
scene('b4-s1', [mesh(moved(t, o), COL[k]) for k, t, o in gs],
      labels=[L([-30, 0, 3], 'motor gear (from Batch 1)', -60, -100), L([0, 0, 7.7], 'big gear', 0, -110),
              L([34, 0, 4.2], 'roller gear', 60, -100), L([10, -15, 1], 'look for strings between the teeth', 20, 110)],
      az=0, el=45, zoom=1.0)

# Batch 4 step 2: axle through the roller and the roller gear
ax = PR['axle']; rl = PR['roller']; rg = PR['roller_gear']
scene('b4-s2', [mesh(moved(ax, [-60, 0, 0]), '#d9c2ff'), mesh(rl, COL['roller']), mesh(moved(rg, [18, 0, 0]), COL['roller_gear'])],
      arrows=[A([-128, 17, 14], [-100, 17, 14]), A([84, 17, 14], [64, 17, 14])],
      labels=[L([-60, 17, 16], 'axle: flat side lines up', -60, -110), L([0, 17, 21], 'brush roller', 0, -110),
              L([57, 17, 26], 'roller gear', 40, -90), L([-114, 17, 14], 'slide in', 0, 80, ORANGE),
              L([74, 17, 14], 'then the gear', 40, 90, ORANGE)],
      az=-15, el=26, zoom=1.15, focus=[-20, 17, 14])

# Batch 4 step 3: big gear onto the peg, spin it
cg = PR['compound']
scene('b4-s3', [mesh(B, COL['base']), mesh(moved(cg, [22, 0, 0]), COL['compound'])],
      arrows=[A([80, 30.6, 44], [62, 30.6, 44]), T([63, 30.6, 25], [1, 0, 0], 19)],
      labels=[L([41, 30.6, 25], 'gear peg', -120, 110), L([59, 30.6, 40], 'big gear', 90, -100),
              L([63, 30.6, 6], 'slide on, then spin it', 110, 60, ORANGE)],
      az=65, el=18, zoom=1.35, focus=[48, 30, 22])

# Batch 4 step 4: motor gear meshes with the big gear
scene('b4-s4', [mesh(GH['130 brush motor'], MOTOR), mesh(PR['pinion'], COL['pinion']), mesh(cg, COL['compound'])],
      arrows=[T([37.5, MY, MZ], [1, 0, 0], 8.5, start=40, sweep=200), T([37.5, 30.6, 25.0], [1, 0, 0], 18.5, start=220, sweep=-200)],
      labels=[L([36.3, MY, MZ + 5.6], 'motor gear', 60, -80), L([36.3, 30.6, 10], 'big gear', 90, 90),
              L([36.3, 26, 34], 'teeth roll together', -230, -60, ORANGE)],
      az=62, el=14, zoom=1.2, focus=[35, 27, 32])

# Batch 5 step 1: the tray
tr = PR['tray']; tb = tr.bounds
scene('b5-s1', [mesh(tr, COL['tray'])],
      labels=[L([0, tb[0][1], 0.3], 'thin front edge: trim any brim here', -40, 110),
              L([0, tb[1][1] - 3, 12], 'back wall: clicks onto the hook', 40, -110),
              L([tb[1][0], 39, 20], 'side bump', 100, -30)],
      az=-35, el=28, zoom=1.0)

# Batch 5 step 2: Dusty upside down, tray pressed on
skip = {'tray'}
ms = [mesh(flip(t), COL.get(k, '#f0b43c')) for k, t in PR.items() if k not in skip]
for k, c in (('N20 motors + brackets', GHOST), ('wheels', '#3b4654'), ('ball caster', GHOST), ('power bank', '#5d6b7a'),
             ('moto:bit', BOARD), ('micro:bit', '#2f3640'), ('130 brush motor', MOTOR), ('pipe-cleaner bristles', '#ffe08a'),
             ('QTR-1A sensors', '#2f3640'), ('whisker switch', GHOST)):
    ms.append(mesh(flip(GH[k]), c, 1.0, False))
ms.append(mesh(moved(flip(tr), [0, 0, 30]), COL['tray']))
scene('b5-s2', ms, arrows=[A([0, 55, 75], [0, 55, 45])],
      labels=[L([0, 55, 60], 'press down until it clicks', 80, -80, ORANGE), L([0, 55, 36], 'crumb tray', -160, -80),
              L([0, 20, 20], 'brush', -140, 90)],
      az=-35, el=35, zoom=1.0)

json.dump(scenes, open(OUT, 'w'), separators=(',', ':'))
print(len(scenes), 'scenes')

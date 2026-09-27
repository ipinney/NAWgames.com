"""Assembly-step scenes for the Dusty Build Guide (Rev A.5 CAD, MOC-005).
Usage: /opt/cad-venv/bin/python make_guide_scenes.py ASSEMBLY_PKL OUT_JSON
Model axes: x right, y back (front is -y), z up. Units mm."""
import sys, os, json, math, pickle
import numpy as np, trimesh
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dusty-chassis'))
from build import (POSTS, SL_TABS, SL_REAR, DECK_Z0, DECK_T, PL_Z0, PL_Z1, BR_Z, GX, BR_HOLE_DX, BR_HOLE_DY, A as AY,
                   CASTER_Y, CASTER_DX, CASTER_H, EAR_X, EAR_Y, SENSOR_Z, QTR, P2, C_Y, C_Z, RY, RZ, ROLL_L, CORE_D,
                   CRADLE_SCREWS, MOT_Y, MOT_Z, ML, AXLE_Z, ENC_WIN_X, ENC_WIN_Y)

PKL, OUT = sys.argv[1], sys.argv[2]
d = pickle.load(open(PKL, 'rb'))
PR = {k: trimesh.Trimesh(*v, process=False) for k, v in d['printed'].items()}
GH = {k: trimesh.Trimesh(*v, process=False) for k, v in d['ghosts'].items()}

Y = '#f0b43c'
COL = {'base': Y, 'deck': Y, 'post1': Y, 'post2': Y, 'dowel1': Y, 'dowel2': Y, 'cradle': '#e8793a', 'tray': '#5cc98a',
       'roller': '#b48cff', 'axle': '#d9c2ff', 'collar': '#b48cff', 'pinion': '#4aa8ff', 'compound': '#4aa8ff',
       'roller_gear': '#4aa8ff', 'washer': '#4aa8ff', 'carrier_R': '#ff6f9a', 'carrier_L': '#ff6f9a', 'sleeve': '#e0e0e0', 'keeper': '#ffd166'}
GC = {'N20 motors + brackets': '#aab6c3', 'N20 encoder boards + plugs': '#1f8a4c', 'wheels': '#3b4654', 'ball caster': '#aab6c3', 'power bank': '#8394a8',
      'USB adapter and cable': '#56657a', 'foam shims': '#6b7b8f', 'moto:bit': '#d8373f', 'micro:bit': '#2f3640',
      '130 brush motor': '#aab6c3', 'pipe-cleaner bristles': '#ffe08a', 'QTR-1A sensors': '#1f8a4c', 'whisker switch': '#2f3640',
      'rocker switch': '#2f3640'}
STEEL = '#cfd8e3'; OR = '#ff9f1c'; PIPE = '#ff8a3d'


def mesh(t, c, op=1.0, edges=True):
    t = t.copy(); t.merge_vertices()
    return {'v': np.round(t.vertices, 2).flatten().tolist(), 'f': t.faces.flatten().tolist(), 'c': c, 'op': op, 'e': edges}


def mv(t, off):
    t = t.copy(); t.apply_translation(off); return t


def flip(t):
    t = t.copy(); t.apply_transform(trimesh.transformations.rotation_matrix(math.pi, [0, 1, 0])); return t


def fp(p):
    return [-p[0], p[1], -p[2]]


def half(t, right=True):
    c = t.triangles_center[:, 0]
    k = c > 0 if right else c < 0
    o = trimesh.Trimesh(t.vertices, t.faces[k], process=False); o.remove_unreferenced_vertices(); return o


def cyl_axis(r, a, b, sections=32):
    return trimesh.creation.cylinder(radius=r, segment=[np.array(a, float), np.array(b, float)], sections=sections)


def screw(L, tip, direction, head_d=3.8):
    u = np.array(direction, float); u /= np.linalg.norm(u); tip = np.array(tip, float); top = tip - u * L
    parts = [cyl_axis(1.0, tip, top, 16), cyl_axis(head_d / 2, top, top - u * 1.4, 24)]
    parts += [cyl_axis(1.12, top + u * (s - 0.2), top + u * (s + 0.2), 16) for s in np.arange(1.2, L - 0.4, 0.8)]
    return trimesh.util.concatenate(parts)


WIRE = '#f0605e'
def motor_cables(top=PL_Z1 + 7):
    # MOC-005: harness from the plug toward the middle, bent up along the inner edge of the window
    out = []
    for s in (-1, 1):
        x0, x1 = s * (GX - ML + 1.0), s * (ENC_WIN_X[0] + 1.3)
        z0 = AXLE_Z + 11.5
        out += [cyl_axis(1.1, [x0, AY, z0], [x1, AY, z0 + 1.5], 12), cyl_axis(1.1, [x1, AY, z0 + 1.5], [x1, AY, top], 12)]
    return trimesh.util.concatenate(out)


def A(a, b, c=OR):
    return {'a': [float(x) for x in a], 'b': [float(x) for x in b], 'c': c}


def T(center, axis, r, c=OR, start=20, sweep=250):
    return {'twist': True, 'o': [float(x) for x in center], 'ax': list(axis), 'r': r, 'c': c, 's0': start, 'sw': sweep}


def L(p, t, dx, dy, c='#ffffff'):
    return {'p': [float(x) for x in p], 't': t, 'dx': dx, 'dy': dy, 'c': c}


S = {}


def scene(name, meshes, arrows=(), labels=(), az=35, el=28, zoom=1.0, ground='table', focus=None, w=900, h=600):
    S[name] = {'w': w, 'h': h, 'meshes': meshes, 'arrows': list(arrows), 'labels': list(labels), 'az': az, 'el': el,
               'zoom': zoom, 'ground': ground, 'focus': focus, 'cam': None}


def P(k, off=(0, 0, 0), f=False, op=1.0):
    t = mv(PR[k], off)
    return mesh(flip(t) if f else t, COL.get(k, Y), op)


def G(k, off=(0, 0, 0), f=False, t=None, op=1.0):
    t = mv(t if t is not None else GH[k], off)
    return mesh(flip(t) if f else t, GC.get(k, '#8fa3b8'), op, False)


# ---------------- Step 2: motors onto the pads (base upside down)
pads = [(sx * (GX - BR_HOLE_DX), AY + dy) for sx in (-1, 1) for dy in (-BR_HOLE_DY, BR_HOLE_DY)]
lift = 16
ms = [P('base', f=True), G('N20 motors + brackets', (0, 0, -lift), f=True), G('N20 encoder boards + plugs', (0, 0, -lift), f=True),
      mesh(flip(mv(motor_cables(PL_Z1 + 7 + lift), (0, 0, -lift))), WIRE, 1.0, False)]
arr = []
for (x, y) in pads:
    p = fp([x, y, BR_Z - lift - 3])            # below the bracket in the flipped view = above it on screen
    ms.append(mesh(screw(8, [p[0], p[1], p[2]], [0, 0, -1]), STEEL))
arr.append(A(fp([GX - BR_HOLE_DX + 8, AY, BR_Z - lift - 14]), fp([GX - BR_HOLE_DX + 8, AY, BR_Z - lift - 2])))
scene('g2-motors', ms, arr,
      [L(fp([-(GX - BR_HOLE_DX), AY, BR_Z - 1]), 'pad: 2 pilot holes, with a funnel', -40, 150),
       L(fp([GX - BR_HOLE_DX, AY - BR_HOLE_DY, BR_Z - lift - 14]), '2 × M2 × 8 per bracket', 120, -90),
       L(fp([-35, AY, BR_Z - lift - 5]), 'motor in its bracket, shaft points out', -60, -120),
       L(fp([0, 20, PL_Z0]), 'base, upside down', 60, 120),
       L(fp([(ENC_WIN_X[0] + ENC_WIN_X[1]) / 2, ENC_WIN_Y[1] - 2, PL_Z0]), 'board and plug go in the window', -230, -20)],
      az=-20, el=38, zoom=1.05)

W = GH['wheels']
ms = [P('base', f=True), G('N20 motors + brackets', f=True), G('N20 encoder boards + plugs', f=True), mesh(flip(motor_cables()), WIRE, 1.0, False)]
for right in (True, False):
    s = 1 if right else -1
    ms.append(G('wheels', (s * 18, 0, 0), f=True, t=half(W, right)))
scene('g2-wheels', ms,
      [A(fp([62 + 18, AY, 16]), fp([56, AY, 16])), A(fp([-(62 + 18), AY, 16]), fp([-56, AY, 16]))],
      [L(fp([-(49.5 + 18), AY, 32]), 'wheel: flat side of the hole lines up with the flat on the shaft', 60, -120),
       L(fp([GX + 4, AY, 16]), 'press straight on', -60, 110, OR)],
      az=-10, el=30, zoom=1.0)

# ---------------- Step 3: ball caster (upside down)
cl = 16
ms = [P('base', f=True), G('N20 motors + brackets', f=True), G('N20 encoder boards + plugs', f=True), mesh(flip(motor_cables()), WIRE, 1.0, False),
      G('wheels', f=True), G('ball caster', (0, 0, -cl), f=True)]
for dx in (-CASTER_DX, CASTER_DX):
    p = fp([dx, CASTER_Y, -cl - 2])
    ms.append(mesh(screw(8, p, [0, 0, -1]), STEEL))
scene('g3-caster', ms, [A(fp([18, CASTER_Y, -cl - 14]), fp([18, CASTER_Y, -cl - 3]))],
      [L(fp([0, CASTER_Y, -cl - 5]), 'ball caster + 2 × M2 × 8', 90, -100),
       L(fp([CASTER_DX, CASTER_Y, CASTER_H]), 'two round caster posts', 130, 80)],
      az=-150, el=40, zoom=1.15, focus=fp([0, 85, 5]))

# ---------------- Step 4
under = [G('N20 motors + brackets'), G('N20 encoder boards + plugs'), mesh(motor_cables(), WIRE, 1.0, False), G('wheels'), G('ball caster')]
sl = 22
ms = [P('base')] + under + [P('sleeve', (0, 0, sl))]
arr = [A([-45, 86, 33 + sl + 40], [-45, 86, 33 + sl + 24]), A([66, 86, 33 + sl + 40], [66, 86, 33 + sl + 24])]
scene('g4-sleeve', ms, arr,
      [L([-43, 86, 33 + sl + 20], 'open end on the left', -120, -90),
       L([20, 58.4, 33 + sl + 3], 'front screw tab', 110, -110),
       L([20, 58.4, PL_Z1], '4 screws go up from under the base', 150, 90),
       L([-(ENC_WIN_X[0] + 1.0), AY, PL_Z1 + 6], 'motor wires come up here', -230, 80)],
      az=-30, el=32, zoom=1.0)

dl = 22
ms = [P('base')] + under + [P('sleeve'), G('power bank'), P('keeper'), P('post1'), P('post2'), P('deck', (0, 0, dl))]
for (x, y) in list(POSTS) + list(SL_REAR):
    ms.append(mesh(screw(8, [x, y, DECK_Z0 + DECK_T + dl + 10], [0, 0, -1]), STEEL))
scene('g4-deck', ms, [A([0, 80, DECK_Z0 + dl + 26], [0, 80, DECK_Z0 + dl + 8])],
      [L([POSTS[0][0], POSTS[0][1], DECK_Z0 + dl + 14], '2 screws into the posts', -150, -60),
       L([SL_REAR[1][0], SL_REAR[1][1], DECK_Z0 + dl + 14], '2 into the sleeve wall', 120, -70),
       L([POSTS[1][0], POSTS[1][1], PL_Z1 + 10], 'deck posts, pegs pushed into the base', 140, 90)],
      az=-30, el=30, zoom=1.0)

ms = [P('base')] + under + [P('sleeve'), G('power bank'), P('keeper'), P('post1'), P('post2'), P('deck'),
                            G('moto:bit'), G('micro:bit', (0, -22, 0)), G('USB adapter and cable')]
scene('g4-brain', ms, [A([0, -48, 76], [0, -30, 76])],
      [L([0, -45, 74], 'micro:bit: LEDs up, gold stripes into the connector', -20, -120),
       L([20, 70, 70], 'moto:bit between the guides', 130, -80),
       L([-50, 45, 50], '90° USB adapter, cable runs forward', -120, 80)],
      az=-25, el=35, zoom=1.0)

# ---------------- Step 6: sensor into the arm
Q = GH['QTR-1A sensors']
qr = half(Q, True)
fx1 = EAR_X[1] + 2.4
sx = fx1 - 4.5
ms = [P('carrier_R'), G('QTR-1A sensors', (0, 0, -7), t=qr),
      mesh(screw(6, [sx, (EAR_Y[0] + EAR_Y[1]) / 2, SENSOR_Z - 9], [0, 0, 1]), STEEL)]
scene('g6-sensor', ms, [A([sx - 13, -3, SENSOR_Z - 12], [sx - 13, -3, SENSOR_Z - 4])],
      [L([35, -3, SENSOR_Z - 6], 'QTR-1A sensor, two bumps facing down', -150, 100),
       L([sx, -3, SENSOR_Z - 15], 'M2 × 6 + nut', 140, 60),
       L([43.5, -3, 20], 'height slot', 120, -80)],
      az=-40, el=-22, zoom=1.0, ground='none', focus=[38, -3, 12])

# ---------------- Step 8: whisker on the left arm pad
wo = -12
wy = (EAR_Y[0] + EAR_Y[1] + 2.0) / 2
x1 = -(EAR_X[1] + 2.4)
ms = [P('base', op=1.0), P('carrier_L'), G('whisker switch', (wo, 0, 0))]
for dy in (-4.75, 4.75):
    ms.append(mesh(screw(10, [x1 + 2.2 + wo, wy + dy, 20.0], [1, 0, 0]), STEEL))
scene('g8-whisker', ms, [A([-72, wy, 28], [-58, wy, 28])],
      [L([-50 + wo, wy, 25], 'whisker switch: arm down, wheel to the front', -60, -150),
       L([x1 - 2.2 + wo - 8, wy - 4.75, 20], '2 × M2 × 10 + nuts', -130, 110),
       L([-46, 2, 22], 'pad on the left sensor arm', 170, 20)],
      az=-70, el=20, zoom=1.4, focus=[-52, -2, 16])

# ---------------- Step 9: brush drive
stations = [-ROLL_L / 2 + 4.0 + i * (ROLL_L - 8.0) / 6 for i in range(7)]
pipes = []
for i, x in enumerate(stations):
    a = math.radians((i % 3) * 60)
    dy, dz = 15 * math.cos(a), 15 * math.sin(a)
    pipes.append(cyl_axis(1.4, [x, RY - dy, RZ - dz], [x, RY + dy, RZ + dz], 10))
pc = trimesh.util.concatenate(pipes)
scene('g9-bristles', [P('roller'), mesh(pc, PIPE, 1.0, False)],
      [], [L([stations[3], RY, RZ + 15], '30 mm pipe cleaner pieces, one per hole', -40, -110),
           L([stations[0], RY + 7, RZ], 'equal length both sides', -160, 90)],
      az=-20, el=35, zoom=1.2)

cr = 14
ms = [P('base'), P('dowel1'), P('dowel2'), P('cradle', (0, 0, cr)), G('130 brush motor', (0, 0, cr + 14)),
      P('pinion', (0, 0, cr + 14))]
for (x, y) in CRADLE_SCREWS:
    ms.append(mesh(screw(8, [x, y, PL_Z0 - 2], [0, 0, 1]), STEEL))
scene('g9-mount', ms, [A([18, MOT_Y, MOT_Z + cr + 30], [18, MOT_Y, MOT_Z + cr + 16]), A([30, 22, PL_Z1 + cr + 10], [30, 22, PL_Z1 + 4])],
      [L([18, MOT_Y, MOT_Z + cr + 22], '130 motor clicks in, 1 zip tie over it', -150, -80),
       L([26, 12.3, PL_Z1 + 1], 'dowels locate it', 140, 60),
       L([8, CRADLE_SCREWS[0][1], PL_Z0 - 6], '2 × M2 × 8 up from under the base', -170, 90),
       L([22, 30, PL_Z1 + cr + 8], 'motor mount', 150, -60)],
      az=-40, el=28, zoom=1.9, focus=[18, 24, 40])

ms = [P('base'), P('compound', (18, 0, 0)), P('washer', (26, 0, 0)),
      mesh(screw(6, [P2[1] + 26 + 4, C_Y, C_Z], [-1, 0, 0]), STEEL)]
scene('g9-gear', ms, [A([P2[1] + 50, C_Y, C_Z + 18], [P2[1] + 24, C_Y, C_Z + 18])],
      [L([P2[1] - 2, C_Y, C_Z + 3], 'gear peg (no funnel here)', -170, -100),
       L([P2[1] + 18, C_Y, C_Z + 15], 'big gear, big side first', 60, -120),
       L([P2[1] + 27, C_Y, C_Z - 4], 'washer + M2 × 6', 140, 80)],
      az=70, el=18, zoom=1.8, focus=[50, C_Y, C_Z])

ms = [P('base'), P('roller'), mesh(pc, PIPE, 1.0, False), P('axle', (-60, 0, 0)), P('roller_gear', (16, 0, 0)), P('collar', (-78, 0, 0))]
scene('g9-axle', ms, [A([-128, RY, RZ], [-100, RY, RZ]), A([80, RY, RZ + 14], [60, RY, RZ + 14])],
      [L([-70, RY, RZ + 3], 'axle slides in from the left, flat side lined up', -60, -120),
       L([57, RY, RZ + 12], 'roller gear on the right end', 60, -100),
       L([-111, RY, RZ + 4], 'collar on the left end', -60, 110)],
      az=-15, el=22, zoom=1.35, focus=[-30, 17, 14])

ms = [P('base'), P('dowel1'), P('dowel2'), P('cradle'), G('130 brush motor'), G('rocker switch'), P('pinion'), P('compound'),
      P('washer'), P('roller_gear'), P('roller'), mesh(pc, PIPE, 1.0, False), P('axle'), P('collar')]
scene('g9-done', ms, [T([37.5, MOT_Y, MOT_Z], [1, 0, 0], 8.5, start=40, sweep=200), T([38, RY, RZ], [1, 0, 0], 15, start=200, sweep=200)],
      [L([36, MOT_Y, MOT_Z + 6], 'motor gear 12', 90, -90), L([38, C_Y, C_Z + 12], 'big gear 36 + 10', 150, -30),
       L([38, RY, RZ - 11], 'roller gear 18', 120, 70), L([0, RY - 15, RZ], 'bottom bristles move backward', -170, 100, OR),
       L([17, 29, 45], 'rocker switch', -140, -100)],
      az=55, el=22, zoom=1.35, focus=[20, 25, 25])

# ---------------- The finished robot
ms = [mesh(t, COL.get(k, Y)) for k, t in PR.items()]
for k in GC:
    if k in GH:
        ms.append(G(k))
ms.append(mesh(pc, PIPE, 1.0, False))
ms.append(mesh(motor_cables(), WIRE, 1.0, False))
scene('g-hero', ms, [], [], az=-35, el=22, zoom=1.3)

json.dump(S, open(OUT, 'w'), separators=(',', ':'))
print(len(S), 'scenes')

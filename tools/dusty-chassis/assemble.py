import os, sys, json, math
import numpy as np, trimesh
import manifold3d as m
from build import *
from cadkit import _remap

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
os.makedirs(OUT, exist_ok=True)

def tm_of(s):
    mm = s.to_mesh(); v = np.array(mm.vert_properties)[:, :3]; f = np.array(mm.tri_verts)
    return trimesh.Trimesh(v, f, process=True)

def along_x(s, x0, y, z):
    """local solid with axis z (z from 0) -> axis along +x starting at x0, centered (y,z)."""
    return _remap(s, (2, 0, 1), False, [x0, y, z])

# ---------- printed parts in assembled pose ----------
printed = {}
printed['base'] = base()
printed['cradle'] = cradle()
printed['deck'] = deck()
for i, (x, y) in enumerate(POSTS):
    printed[f'post{i+1}'] = post().translate([x, y, PL_Z1])
printed['tray'] = tray()
# tooth phasing so the meshes interleave
ang = lambda y, z: math.atan2(z, y)
phi_CR = ang(RY - C_Y, RZ - C_Z); phi_CM = ang(MOT_Y - C_Y, MOT_Z - C_Z)
a_c = phi_CR
step = 2*math.pi/Z_BIG
delta = (phi_CM - a_c) % step
if delta > step/2: delta -= step
a_p = phi_CM + math.pi + math.pi/Z_PIN + delta*Z_BIG/Z_PIN
a_r = phi_CR + math.pi + math.pi/Z_ROL
deg = math.degrees
printed['pinion'] = along_x(pinion().rotate([0, 0, deg(a_p)]), P1[0], MOT_Y, MOT_Z)
printed['compound'] = along_x(compound().rotate([0, 0, deg(a_c)]), P1[0], C_Y, C_Z)
printed['roller_gear'] = along_x(roller_gear().rotate([0, 0, deg(a_r)]), P2[0], RY, RZ)
printed['roller'] = along_x(roller().rotate([0, 0, deg(a_r)]), -ROLL_L/2, RY, RZ)
ax, AXL = axle()
printed['axle'] = along_x(ax.rotate([0, 0, deg(a_r)]), -SP_X1 - 3.0, RY, RZ)
printed['collar'] = along_x(collar().rotate([0, 0, deg(a_r)]), -SP_X1 - 3.0, RY, RZ)
printed['washer'] = along_x(washer(), P2[1], C_Y, C_Z)
printed['carrier_R'] = carrier(1)
printed['carrier_L'] = carrier(-1, whisker=True)
for i, (x, y) in enumerate(CRADLE_PEGS):
    printed[f'dowel{i+1}'] = dowel().translate([x, y, PL_Z1 - 2.0])

# ---------- purchased components (ghosts) ----------
def ghost_motor(side):
    d = np.load(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'parts', 'motor_bracket.npz')); v = d['v']; t = d['t']
    sx, sy, sz = v[:, 0], v[:, 1], v[:, 2]
    X = GX - sz - 9.0; Y = A + sx; Z = 16.0 - sy
    V = np.stack([X, Y, Z], 1)
    T = t.copy()
    if side < 0:
        V[:, 0] *= -1; T = T[:, ::-1]
    mesh = trimesh.Trimesh(V, T, process=False)
    enc = trimesh.creation.box(extents=[ML - 25.8, 12, 10])
    enc.apply_translation([GX - 25.8 - (ML - 25.8)/2, A, AXLE_Z])
    if side < 0:
        enc.apply_translation([-2*(GX - 25.8 - (ML - 25.8)/2), 0, 0])
    return trimesh.util.concatenate([mesh, enc])

def cyl_x(r, x0, x1, y, z, sections=32):
    c = trimesh.creation.cylinder(radius=r, height=x1 - x0, sections=sections)
    c.apply_transform(trimesh.transformations.rotation_matrix(math.pi/2, [0, 1, 0]))
    c.apply_translation([(x0 + x1)/2, y, z]); return c

def boxc(x0, x1, y0, y1, z0, z1):
    b = trimesh.creation.box(extents=[x1 - x0, y1 - y0, z1 - z0])
    b.apply_translation([(x0 + x1)/2, (y0 + y1)/2, (z0 + z1)/2]); return b

ghosts = {}
ghosts['N20 motors + brackets'] = trimesh.util.concatenate([ghost_motor(1), ghost_motor(-1)])
ghosts['wheels'] = trimesh.util.concatenate([cyl_x(WHEEL_R, s*WHEEL_X0, s*(WHEEL_X0 + WHEEL_W), A, AXLE_Z) if s > 0 else
                                           cyl_x(WHEEL_R, -(WHEEL_X0 + WHEEL_W), -WHEEL_X0, A, AXLE_Z) for s in (1, -1)])
cz = CASTER_H
cast = boxc(-10, 10, CASTER_Y - 6, CASTER_Y + 6, 4.8, cz)
ball = trimesh.creation.icosphere(subdivisions=2, radius=4.76); ball.apply_translation([0, CASTER_Y, 4.76])
ghosts['ball caster'] = trimesh.util.concatenate([cast, ball])
ghosts['4xAA pack'] = boxc(-BAT[0]/2, BAT[0]/2, BAT_Y0, BAT_Y1, PL_Z1, PL_Z1 + BAT[2])
mb_z = DECK_Z0 + DECK_T + 1.6
ghosts['moto:bit'] = boxc(-MB[0]/2, MB[0]/2, DECK_Y[0] + 1, DECK_Y[0] + 1 + MB[1], DECK_Z0 + DECK_T, mb_z)
ghosts['micro:bit'] = boxc(-26, 26, DECK_Y[0] + 3, DECK_Y[0] + 4.6, mb_z + 6, mb_z + 6 + 42)
_mc = along_x(m.Manifold.cylinder(MOT_LEN, 10, 10, 40), MOT_FACE_X - MOT_LEN, MOT_Y, MOT_Z) ^ box(-50, 50, MOT_Y - 11, MOT_Y + 11, MOT_Z - 7.5, MOT_Z + 7.5)
mot130 = tm_of(_mc)
shaft = cyl_x(1.0, MOT_FACE_X, P1[1] + 0.5, MOT_Y, MOT_Z, 12)
boss = cyl_x(3.1, MOT_FACE_X, MOT_FACE_X + 1.5, MOT_Y, MOT_Z, 16)
ghosts['130 brush motor'] = trimesh.util.concatenate([mot130, shaft, boss])
brist = cyl_x(ROLL_R, -ROLL_L/2 + 1, ROLL_L/2 - 1, RY, RZ, 32)
ghosts['pipe-cleaner bristles'] = brist
qtr = []
for s in (-1, 1):
    xa, xb = (EAR_X[1] - 0.2 - QTR[1], EAR_X[1] - 0.2)
    if s < 0: xa, xb = -xb, -xa
    qtr.append(boxc(xa, xb, EAR_Y[0] + 1.2, EAR_Y[0] + 1.2 + QTR[0], SENSOR_Z + 1.2, SENSOR_Z + 2.8))
ghosts['QTR-1A sensors'] = trimesh.util.concatenate(qtr)
ghosts['whisker switch'] = boxc(-(EAR_X[1] + 2.4 + 2.2 + 6.4), -(EAR_X[1] + 2.4 + 2.2), EAR_Y[0] - 3.9, EAR_Y[0] - 3.9 + 19.8, 15.0, 25.2)
ghosts['rocker switch'] = boxc(10.5, 23.5, CRADLE_Y[1] - 6, CRADLE_Y[1] + 3.5, PL_Z1 + 5, PL_Z1 + 13.5)

# ---------- checks ----------
names = list(printed)
tms = {k: tm_of(v) for k, v in printed.items()}
report = {'parts': {}, 'collisions': []}
for k, t in tms.items():
    report['parts'][k] = {'watertight': bool(t.is_watertight), 'vol': round(float(t.volume), 1),
                          'bounds': t.bounds.round(1).tolist()}
# printed-vs-printed interference (manifold boolean)
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        inter = printed[names[i]] ^ printed[names[j]]
        vol = inter.volume()
        if vol > 0.5:
            report['collisions'].append((names[i], names[j], round(vol, 2)))
# printed-vs-ghost (intended contacts: brush motor shaft in pinion, bristles around roller, rocker in panel)
def to_manifold(t):
    return m.Manifold(m.Mesh(vert_properties=np.asarray(t.vertices, dtype=np.float32), tri_verts=np.asarray(t.faces, dtype=np.uint32)))
gcol = []
for gk, gt in ghosts.items():
    if gk == 'N20 motors + brackets':
        continue
    try:
        gm = to_manifold(gt if gt.is_watertight else gt.convex_hull)
    except Exception:
        continue
    for k in names:
        vol = (printed[k] ^ gm).volume()
        if vol > 1.0:
            gcol.append((gk, k, round(vol, 1)))
report['ghost_collisions'] = gcol
# motors: STEP mesh is not closed, so check its convex hull
for s in (1, -1):
    hull = to_manifold(ghost_motor(s).convex_hull)
    for k in names:
        vol = (printed[k] ^ hull).volume()
        if vol > 1.0:
            report['ghost_collisions'].append((f'motor{s}', k, round(vol, 1)))
allb = trimesh.util.concatenate(list(tms.values()) + list(ghosts.values())).bounds
report['overall_bounds'] = allb.round(1).tolist()
report['overall_size'] = (allb[1] - allb[0]).round(1).tolist()
report['printed_grams_solid'] = round(sum(t.volume for t in tms.values())/1000*1.24, 1)
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w'), indent=1)
print(json.dumps({k: v for k, v in report.items() if k != 'parts'}, indent=1))
for k, v in report['parts'].items():
    if not v['watertight']: print('NOT WATERTIGHT', k)

import pickle
pickle.dump({'printed': {k: (np.asarray(t.vertices), np.asarray(t.faces)) for k, t in tms.items()},
             'ghosts': {k: (np.asarray(t.vertices), np.asarray(t.faces)) for k, t in ghosts.items()}},
            open(os.path.join(OUT, 'assembly.pkl'), 'wb'))

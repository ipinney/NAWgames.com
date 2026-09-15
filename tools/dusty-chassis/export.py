import os, sys, json, math, pickle, zipfile
import numpy as np, trimesh
from build import *
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)

def tm(s):
    mm = s.to_mesh(); return trimesh.Trimesh(np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts), process=False)

def on_bed(t):
    t = t.copy(); b = t.bounds
    t.apply_translation([-(b[0][0] + b[1][0])/2, -(b[0][1] + b[1][1])/2, -b[0][2]]); return t

ax_s, AXL = axle()
flip = lambda s: s.rotate([180, 0, 0])
parts = {  # name: (manifold in print orientation, qty, note)
 'base':        (base(print_fin=True).rotate([0, 180, 0]), 1, 'top face down, lift off the support block under the gear peg'),
 'deck':        (deck(), 1, ''),
 'post':        (flip(post()), 4, 'peg up'),
 'cradle':      (cradle(), 1, ''),
 'tray':        (tray(), 1, ''),
 'roller':      (roller(), 1, 'standing'),
 'axle':        (ax_s.rotate([0, 90, 0]).rotate([90, 0, 0]).rotate([180, 0, 0]), 1, 'flat side down'),
 'collar':      (collar(), 1, ''),
 'pinion':      (pinion(), 1, ''),
 'compound_gear': (compound(), 1, 'big gear down'),
 'roller_gear': (roller_gear(), 1, ''),
 'washer':      (washer(), 1, ''),
 'sensor_carrier_R': (carrier(1), 1, ''),
 'sensor_carrier_L': (carrier(-1, whisker=True), 1, 'has whisker-switch pad'),
 'dowel':       (dowel(), 2, ''),
}
meshes = {}
for k, (s, q, note) in parts.items():
    t = on_bed(tm(s))
    meshes[k] = t
    t.export(os.path.join(OUT, f'dusty-{k}.stl'))
    b = t.bounds; print(f'{k:18s} x{q}  {np.round(b[1]-b[0],1)}  {round(t.volume/1000*1.24,1)} g solid  {note}')

az = meshes['axle'].vertices[:, 2]; print('axle bed contact verts', int((az < 0.01).sum()))

# plate layout on 220 x 220 (Adventurer 5M)
place = [  # (name, x, y, rotz)
 ('base', -62, 0, 0),
 ('deck', 51, 69, 0),
 ('tray', 30, -8, 90),
 ('roller', -4.75, 55, 0),
 ('roller_gear', -4.75, 82, 0),
 ('axle', 30, -48, 0),
 ('compound_gear', 80, 10, 0),
 ('pinion', 102, 36, 0),
 ('collar', 104, 18, 0),
 ('washer', 104, 4, 0),
 ('sensor_carrier_R', 75, -40, 90),
 ('sensor_carrier_L', 98, -40, 90),
 ('cradle', 42, -80, 0),
 ('post', 80, -72, 0), ('post', 88, -72, 0), ('post', 96, -72, 0), ('post', 104, -72, 0),
 ('dowel', 80, -84, 0), ('dowel', 86, -84, 0),
]
plate = []
boxes = []
for name, x, y, rz in place:
    t = meshes[name].copy()
    t.apply_transform(trimesh.transformations.rotation_matrix(math.radians(rz), [0, 0, 1]))
    b = t.bounds; t.apply_translation([x - (b[0][0]+b[1][0])/2, y - (b[0][1]+b[1][1])/2, -b[0][2]])
    plate.append(t); boxes.append((name, t.bounds[0][:2], t.bounds[1][:2]))
pl = trimesh.util.concatenate(plate)
pb = pl.bounds; print('plate bounds', np.round(pb, 1), 'size', np.round(pb[1]-pb[0], 1))
bad = []
for i in range(len(boxes)):
    for j in range(i+1, len(boxes)):
        (n1, a0, a1), (n2, b0, b1) = boxes[i], boxes[j]
        if (a0[0] < b1[0]+2 and b0[0] < a1[0]+2 and a0[1] < b1[1]+2 and b0[1] < a1[1]+2):
            bad.append((n1, n2))
print('overlaps', bad)
pl.export(os.path.join(OUT, 'dusty-chassis-all-parts-plate.stl'))
with zipfile.ZipFile(os.path.join(OUT, 'dusty-chassis-revA-stl.zip'), 'w', zipfile.ZIP_DEFLATED) as z:
    for k in parts:
        z.write(os.path.join(OUT, f'dusty-{k}.stl'), f'dusty-{k}.stl')
    z.write(os.path.join(OUT, 'dusty-chassis-all-parts-plate.stl'), 'dusty-chassis-all-parts-plate.stl')
pickle.dump((np.asarray(pl.vertices), np.asarray(pl.faces)), open(os.path.join(OUT, 'plate.pkl'), 'wb'))

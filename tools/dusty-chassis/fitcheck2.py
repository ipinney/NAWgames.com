"""Fit check 2: five deck posts with bigger screw pilot holes and five motor gears with bigger
shaft holes, marked 1 to 5 so the winner can be read off the part.
Usage: /opt/cad-venv/bin/python fitcheck2.py OUT_DIR
Posts: grooves around the middle = variant number. Gears: dimples on the top face = variant number.
Both lined up left to right 1..5 on the plate as well."""
import os, sys, math, json
import numpy as np, trimesh
import manifold3d as m
from build import *

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
M = m.Manifold

PILOTS = [1.9, 2.0, 2.1, 2.2, 2.3]          # was 1.8
BORES = [1.95, 2.0, 2.05, 2.1, 2.15]        # was 1.85


def tm(s):
    mm = s.to_mesh()
    return trimesh.Trimesh(np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts), process=False)


def post_v(pilot, n):
    h = DECK_Z0 - PL_Z1
    s = M.cylinder(h, POST_D / 2, POST_D / 2, 48)
    s = s + M.cylinder(PL_T - 0.3, PEG_D / 2, PEG_D / 2, 48).translate([0, 0, -(PL_T - 0.3)])
    s = s - M.cylinder(8, pilot / 2, pilot / 2, 32).translate([0, 0, h - 7.5])
    # n shallow grooves around the middle, 2 mm apart
    for i in range(n):
        z = h / 2 - (n - 1) + 2.0 * i
        ring = M.cylinder(0.8, POST_D / 2 + 1, POST_D / 2 + 1, 48) - M.cylinder(0.8, POST_D / 2 - 0.4, POST_D / 2 - 0.4, 48)
        s = s - ring.translate([0, 0, z - 0.4])
    return s.rotate([180, 0, 0])   # print peg up, like the original


def gear_v(bore, n):
    th = P1[1] - P1[0]
    g = gear_solid(Z_PIN, M1, th, 'round', bore)
    # n dimples on the top face, on a ring between the hole and the teeth
    r = 2.9
    for i in range(n):
        a = 2 * math.pi * i / 5 + math.pi / 2
        g = g - M.cylinder(1.0, 0.45, 0.45, 16).translate([r * math.cos(a), r * math.sin(a), th - 0.6])
    return g


def on_bed(t):
    t = t.copy(); b = t.bounds
    t.apply_translation([-(b[0][0] + b[1][0]) / 2, -(b[0][1] + b[1][1]) / 2, -b[0][2]]); return t


parts = []
for i in range(5):
    x = -40 + 20 * i
    p = on_bed(tm(post_v(PILOTS[i], i + 1))); p.apply_translation([x, 14, 0]); parts.append(('post', i + 1, p))
    g = on_bed(tm(gear_v(BORES[i], i + 1))); g.apply_translation([x, -14, 0]); parts.append(('gear', i + 1, g))

plate = trimesh.util.concatenate([t for _, _, t in parts])
plate.export(os.path.join(OUT, 'dusty-fit-check-2.stl'))
scene = trimesh.Scene()
for k, n, t in parts:
    scene.add_geometry(t, node_name=f'{k}_{n}', geom_name=f'{k}_{n}')
scene.export(os.path.join(OUT, 'dusty-fit-check-2.3mf'))
for k, n, t in parts:
    assert t.is_watertight, (k, n)
b = plate.bounds
print('plate', np.round(b[1] - b[0], 1), 'grams', round(plate.volume / 1000 * 1.24 * 0.62, 1))
json.dump({'pilots': PILOTS, 'bores': BORES}, open(os.path.join(OUT, 'variants.json'), 'w'))

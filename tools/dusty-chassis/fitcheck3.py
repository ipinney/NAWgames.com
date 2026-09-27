"""Fit check 3 (Sep 27 2026): two small test plates.
A) Base post-hole test: three copies of the base test piece with smaller peg holes
   (Rev A.2 is 4.30 mm and was a little loose). Notches on one edge = number.
B) Screw lead-in test: three deck posts (Rev A.2 pilot 2.2 mm) with different tapers
   at the screw end. Grooves around the middle = number.
Usage: /opt/cad-venv/bin/python fitcheck3.py OUT_DIR"""
import os, sys, json
import numpy as np, trimesh
import manifold3d as m
from build import *

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
M = m.Manifold

PEG_HOLES = [4.20, 4.15, 4.10]            # Rev A.2: 4.30
# (name, entry diameter at the face, depth of the taper) - all end at the 2.2 pilot
LEADS = [('small 45 chamfer', 3.2, 0.5), ('big 45 chamfer', 4.2, 1.0), ('long funnel', 3.4, 1.6)]


def tm(s):
    mm = s.to_mesh()
    return trimesh.Trimesh(np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts), process=False)


def on_bed(t, x, y):
    t = t.copy(); b = t.bounds
    t.apply_translation([x - (b[0][0] + b[1][0]) / 2, y - (b[0][1] + b[1][1]) / 2, -b[0][2]]); return t


def base_piece(hole_d, n):
    px, py = POSTS[0]
    x0, x1, y0, y1 = px - 7, px + 12, py - 7, py + 9
    s = box(x0, x1, y0, y1, PL_Z0, PL_Z1)
    s = s - cyl(px, py, PL_Z0 - 1, PL_Z1 + 1, hole_d, 64)
    for i in range(n):                      # n notches in the far edge
        xn = px + 4.0 + 2.2 * i
        s = s - box(xn, xn + 1.0, y1 - 1.2, y1 + 1, PL_Z0 - 1, PL_Z1 + 1)
    return s.rotate([0, 180, 0])            # prints top face down, like the base


def post_lead(entry_d, depth, n):
    h = DECK_Z0 - PL_Z1
    s = M.cylinder(h, POST_D / 2, POST_D / 2, 48)
    s = s + M.cylinder(PL_T - 0.3, PEG_D / 2, PEG_D / 2, 48).translate([0, 0, -(PL_T - 0.3)])
    s = s - M.cylinder(8, PILOT / 2, PILOT / 2, 32).translate([0, 0, h - 7.5])
    s = s - M.cylinder(depth + 0.01, PILOT / 2, entry_d / 2, 48).translate([0, 0, h - depth])   # taper at the screw end
    for i in range(n):
        z = h / 2 - (n - 1) + 2.0 * i
        ring = M.cylinder(0.8, POST_D / 2 + 1, POST_D / 2 + 1, 48) - M.cylinder(0.8, POST_D / 2 - 0.4, POST_D / 2 - 0.4, 48)
        s = s - ring.translate([0, 0, z - 0.4])
    return s.rotate([180, 0, 0])            # peg up, like the real posts


meta = {}
for tag, parts in (
    ('base-holes', [on_bed(tm(base_piece(d, i + 1)), -24 + 24 * i, 0) for i, d in enumerate(PEG_HOLES)]),
    ('screw-lead-in', [on_bed(tm(post_lead(e, dp, i + 1)), -16 + 16 * i, 0) for i, (_, e, dp) in enumerate(LEADS)]),
):
    for t in parts:
        assert t.is_watertight, tag
    plate = trimesh.util.concatenate(parts)
    stem = f'dusty-fit-check-3-{tag}'
    plate.export(os.path.join(OUT, stem + '.stl'))
    d = os.path.join(OUT, stem); os.makedirs(d, exist_ok=True)
    for i, t in enumerate(parts):
        t.export(os.path.join(d, f"{'base_coupon' if tag == 'base-holes' else 'post'}_{i + 1}.stl"))
    meta[tag] = {'size': np.round(plate.bounds[1] - plate.bounds[0], 1).tolist(), 'grams': round(plate.volume / 1000 * 1.24 * 0.62, 1)}
meta['peg_holes'] = PEG_HOLES; meta['leads'] = LEADS
json.dump(meta, open(os.path.join(OUT, 'fit3.json'), 'w'), indent=1)
print(json.dumps(meta))

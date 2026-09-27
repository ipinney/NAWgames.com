"""Fit check 4 (Sep 27 2026): base post-hole pieces, smaller again (fit check 3 #3 at 4.10 was still loose).
#4 4.05, #5 4.00, #6 3.95 mm. Notches on one edge = number.
Usage: /opt/cad-venv/bin/python fitcheck4.py OUT_DIR"""
import os, sys
import numpy as np, trimesh
from build import *

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
HOLES = [(4, 4.05), (5, 4.00), (6, 3.95)]


def tm(s):
    mm = s.to_mesh()
    return trimesh.Trimesh(np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts), process=False)


def base_piece(hole_d, n):
    px, py = POSTS[0]
    x0, x1, y0, y1 = px - 7, px + 12, py - 7, py + 9
    s = box(x0, x1, y0, y1, PL_Z0, PL_Z1)
    s = s - cyl(px, py, PL_Z0 - 1, PL_Z1 + 1, hole_d, 64)
    for i in range(n):
        xn = px + 2.6 + 1.6 * i
        s = s - box(xn, xn + 0.8, y1 - 1.2, y1 + 1, PL_Z0 - 1, PL_Z1 + 1)
    return s.rotate([0, 180, 0])


parts = []
for i, (n, d) in enumerate(HOLES):
    t = tm(base_piece(d, n)); b = t.bounds
    t.apply_translation([-24 + 24 * i - (b[0][0] + b[1][0]) / 2, -(b[0][1] + b[1][1]) / 2, -b[0][2]])
    assert t.is_watertight
    t.export(os.path.join(OUT, f'base_coupon_{n}.stl')); parts.append(t)
trimesh.util.concatenate(parts).export(os.path.join(OUT, 'dusty-fit-check-4-base-holes.stl'))
print('ok')

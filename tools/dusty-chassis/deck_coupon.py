"""Hole test coupons cut straight out of the real Rev A.2 parts, so they test the exact holes.
Deck coupon: front-left corner of the deck (screw hole + head pocket, zip-tie slot, side guide).
Base coupon: the patch of base plate around the front-left post peg hole.
Usage: /opt/cad-venv/bin/python deck_coupon.py OUT_DIR"""
import os, sys
import numpy as np, trimesh
from build import *

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)


def tm(s):
    mm = s.to_mesh()
    return trimesh.Trimesh(np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts), process=False)


px, py = POSTS[0]                       # front-left post (-36.5, 53)
d = deck() ^ box(-DECK_X - 1, -18.0, DECK_NOSE_Y - 1, 70.0, DECK_Z0 - 1, DECK_Z0 + 10)
b = base(print_fin=False) ^ box(px - 7, px + 12, py - 7, py + 9, PL_Z0, PL_Z1)
b = b.rotate([0, 180, 0])               # the base prints top face down

out = []
for name, s, x in (('deck', d, -18), ('base', b, 18)):
    t = tm(s); bb = t.bounds
    t.apply_translation([x - (bb[0][0] + bb[1][0]) / 2, -(bb[0][1] + bb[1][1]) / 2, -bb[0][2]])
    assert t.is_watertight, name
    print(name, np.round(t.bounds[1] - t.bounds[0], 1), round(t.volume / 1000 * 1.24 * 0.62, 2), 'g')
    t.export(os.path.join(OUT, f'dusty-hole-test-{name}.stl'))
    out.append((name, t))
trimesh.util.concatenate([t for _, t in out]).export(os.path.join(OUT, 'dusty-hole-test.stl'))
sc = trimesh.Scene()
for n, t in out:
    sc.add_geometry(t, node_name=f'{n}_coupon_1', geom_name=f'{n}_coupon_1')
sc.export(os.path.join(OUT, 'dusty-hole-test.3mf'))

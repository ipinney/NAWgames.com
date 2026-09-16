"""Print plates for the Flashforge Adventurer 5M (220 x 220), 5 mm brim, parts in print orientation.
Usage: python plates.py STL_DIR PLATE_DIR
Writes PLATE_DIR/plate<N>/<name>_<i>.stl (one file per object, bed-centered coordinates)
and PLATE_DIR/plates.json. orca/build3mf.py turns them into sliced project files."""
import os, sys, json, math
import numpy as np, trimesh

STL, OUT = sys.argv[1], sys.argv[2]
BED, BRIM = 220.0, 5.0
GAP, EDGE = 2 * BRIM + 5.0, BRIM + 5.0
FLIP_X = [180, 0, 0]
ORIENT = {   # part: (stl stem, euler degrees to print orientation)
    'shell': ('ms2000-p1-base-shell', FLIP_X),
    'floor': ('ms2000-p1-floor-plate', None),
    'yoke': ('ms2000-p2-turntable-yoke', None),
    'pin': ('ms2000-p3-pivot-pin', None),
    'head': ('ms2000-p4-head', None),
    'wand': ('ms2000-p5-wand', None),
    'pod_front': ('ms2000-p6-pod-cup', FLIP_X),
    'pod_back': ('ms2000-p6-pod-cap', FLIP_X),
    'pendulum': ('ms2000-p7-pendulum-pivot', None),
    'clip': ('ms2000-p7-backdrop-clip', None),
    'foot': ('ms2000-p7-backdrop-foot', None),
    'cable_clips': ('ms2000-p8-clips', None),
}
# (n, slug, title, color note, [(part, qty, rotz)])
PLATES = [
    (1, 'base-shell', 'Base shell', 'any color (pink on the site)', [('shell', 1, 0)]),
    (2, 'floor-and-foot', 'Floor plate and one backdrop foot', 'any color', [('floor', 1, 0), ('foot', 1, 90)]),
    (3, 'turret-and-wand', 'Turntable, head, pivot pin, wand, pod back', 'any color', [('yoke', 1, 0), ('wand', 1, 0), ('head', 1, 0), ('pin', 1, 0), ('pod_back', 1, 0)]),
    (4, 'white', 'Pod front and cable clips', 'WHITE PLA', [('pod_front', 1, 0), ('cable_clips', 1, 0)]),
    (5, 'backdrop', 'Pendulum pivot, backdrop clip, second foot', 'any color', [('pendulum', 1, 0), ('foot', 1, 90), ('clip', 1, 0)]),
]


def load(part, rotz):
    stem, rot = ORIENT[part]
    t = trimesh.load(os.path.join(STL, stem + '.stl'), process=False)
    if rot:
        for ax, a in zip(([1, 0, 0], [0, 1, 0], [0, 0, 1]), rot):
            if a: t.apply_transform(trimesh.transformations.rotation_matrix(math.radians(a), ax))
    if rotz:
        t.apply_transform(trimesh.transformations.rotation_matrix(math.radians(rotz), [0, 0, 1]))
    b = t.bounds
    t.apply_translation([-(b[0][0] + b[1][0]) / 2, -(b[0][1] + b[1][1]) / 2, -b[0][2]])
    return t


def shelf_pack(items):
    items = sorted(items, key=lambda it: -(it[1].bounds[1][1] - it[1].bounds[0][1]))
    rows, row, rw, rh = [], [], 0.0, 0.0
    usable = BED - 2 * EDGE
    for name, m in items:
        w = m.bounds[1][0] - m.bounds[0][0]; d = m.bounds[1][1] - m.bounds[0][1]
        need = w if not row else rw + GAP + w
        if row and need > usable:
            rows.append((row, rw, rh)); row, rw, rh = [], 0.0, 0.0; need = w
        row.append((name, m, w, d)); rw = need; rh = max(rh, d)
    if row: rows.append((row, rw, rh))
    total = sum(r[2] for r in rows) + GAP * (len(rows) - 1)
    placed, y = [], total / 2
    for row, rw, rh in rows:
        x = -rw / 2
        for name, m, w, d in row:
            t = m.copy(); t.apply_translation([x + w / 2, y - rh / 2, 0]); placed.append((name, t)); x += w + GAP
        y -= rh + GAP
    return placed


def check(placed):
    boxes = [(n, t.bounds[0][:2], t.bounds[1][:2]) for n, t in placed]
    for n, lo, hi in boxes:
        assert min(lo) >= -BED / 2 + EDGE - 1e-6 and max(hi) <= BED / 2 - EDGE + 1e-6, (n, lo, hi)
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            (a, alo, ahi), (b, blo, bhi) = boxes[i], boxes[j]
            assert max(blo[0] - ahi[0], alo[0] - bhi[0], blo[1] - ahi[1], alo[1] - bhi[1]) >= GAP - 1e-6, (a, b)


meta = []
for n, slug, title, color, parts in PLATES:
    items = []
    for part, q, rz in parts:
        items += [(part, load(part, rz))] * q
    placed = shelf_pack(items)
    check(placed)
    d = os.path.join(OUT, f'plate{n}')
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        os.remove(os.path.join(d, f))
    for i, (name, t) in enumerate(placed):
        t.export(os.path.join(d, f'{name}_{i + 1}.stl'))
    merged = trimesh.util.concatenate([t for _, t in placed])
    lo, hi = merged.bounds
    meta.append(dict(n=n, slug=slug, title=title, color=color, pieces=len(placed),
                     parts=[p for p, _, _ in parts], height=round(float(hi[2]), 1),
                     footprint=[round(float(hi[0] - lo[0]), 1), round(float(hi[1] - lo[1]), 1)]))
    print(n, slug, len(placed), 'pieces, footprint', meta[-1]['footprint'], 'tallest', meta[-1]['height'])
json.dump(meta, open(os.path.join(OUT, 'plates.json'), 'w'), indent=1)

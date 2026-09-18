"""Flying Mosquito print plates for the Flashforge Adventurer 5M (220 x 220), 5 mm brim, parts in print orientation.
Usage: python plates.py STL_DIR PLATE_DIR
Writes PLATE_DIR/plate<N>/<name>_<i>.stl (one file per object, bed-centered coordinates)
and PLATE_DIR/plates.json. orca/build3mf.py turns them into sliced project files."""
import os, sys, json, math
import numpy as np, trimesh

STL, OUT = sys.argv[1], sys.argv[2]
BED, BRIM = 220.0, 5.0
GAP, EDGE = 2 * BRIM + 5.0, BRIM + 5.0
FLIP_X = [180, 0, 0]
FACE_DOWN = [-90, 0, 0]   # the front (+y) goes down on the bed
ORIENT = {   # part: (stl stem, euler degrees to print orientation)
    'fitcheck': ('flymo-f0-fitcheck', None),
    'guard': ('flymo-f1-guard', FLIP_X),
    'cup': ('flymo-f2-cup', FACE_DOWN),
    'body': ('flymo-f2-body', FACE_DOWN),
    'pad': ('flymo-f4-pad', None),
    'box': ('flymo-f5-box', FLIP_X),
    'floor': ('flymo-f5-floor', None),
}
# (n, slug, title, color note, [(part, qty, rotz)])
PLATES = [
    (1, 'fit-check', 'Fit check: motor collars, button hole, sensor pocket', 'any color', [('fitcheck', 1, 0)]),
    (2, 'guard', 'Prop guard and legs', 'dark gray or black', [('guard', 1, 0)]),
    (3, 'window', 'Hit window', 'WHITE PLA', [('cup', 1, 0)]),
    (4, 'body', 'Mosquito body', 'dark gray or black', [('body', 1, 0)]),
    (5, 'pad', 'Launch pad', 'any color', [('pad', 1, 0)]),
    (6, 'box', 'Control box', 'any color (lime on the site)', [('box', 1, 0)]),
    (7, 'box-floor', 'Control box floor', 'any color', [('floor', 1, 0)]),
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

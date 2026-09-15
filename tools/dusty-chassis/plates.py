"""Print plates for building Dusty in batches.
Reads the single-part STLs written by export.py and lays them out on the
FlashForge Adventurer 5M bed (220 x 220), leaving room for a 5 mm brim
around every part.

Usage: python plates.py STL_DIR OUT_DIR
Writes dusty-plate-N-<slug>.stl / .3mf / .png and plates.json
"""
import os, sys, json, math
import numpy as np, trimesh

STL, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

BED = 220.0
BRIM = 5.0
GAP = 2 * BRIM + 5.0          # part-to-part: two brims plus 5 mm of clear bed
EDGE = BRIM + 5.0             # part-to-bed-edge
DENSITY = 1.24                # PLA g/cm3
FILL = 0.62                   # rough solid fraction at 3 walls, 20% infill

PLATES = [
    dict(n=1, slug='fit-check', title='Fit check',
         parts=[('pinion', 1), ('washer', 1), ('collar', 1), ('dowel', 2), ('post', 1)]),
    dict(n=2, slug='base', title='Base plate',
         parts=[('base', 1), ('post', 3)]),
    dict(n=3, slug='deck-and-arms', title='Deck and sensor arms',
         parts=[('deck', 1), ('sensor_carrier_R', 1), ('sensor_carrier_L', 1)]),
    dict(n=4, slug='brush-drive', title='Brush drive',
         parts=[('cradle', 1), ('compound_gear', 1), ('roller_gear', 1), ('roller', 1), ('axle', 1)]),
    dict(n=5, slug='tray', title='Crumb tray',
         parts=[('tray', 1)]),
]
COLOR = {'base': '#f0b43c', 'deck': '#f0b43c', 'post': '#f0b43c', 'dowel': '#f0b43c', 'cradle': '#e8793a',
         'tray': '#5cc98a', 'roller': '#b48cff', 'axle': '#b48cff', 'collar': '#b48cff',
         'pinion': '#4aa8ff', 'compound_gear': '#4aa8ff', 'roller_gear': '#4aa8ff', 'washer': '#4aa8ff',
         'sensor_carrier_R': '#ff6f9a', 'sensor_carrier_L': '#ff6f9a'}


def load(name):
    t = trimesh.load(os.path.join(STL, f'dusty-{name}.stl'), process=False)
    b = t.bounds
    t.apply_translation([-(b[0][0] + b[1][0]) / 2, -(b[0][1] + b[1][1]) / 2, -b[0][2]])
    return t


def shelf_pack(items):
    """items: list of (name, mesh). Rows left to right, tallest-footprint first; returns placed meshes."""
    items = sorted(items, key=lambda it: -(it[1].bounds[1][1] - it[1].bounds[0][1]))
    rows, row, row_w, row_h = [], [], 0.0, 0.0
    usable = BED - 2 * EDGE
    for name, m in items:
        w = m.bounds[1][0] - m.bounds[0][0]
        d = m.bounds[1][1] - m.bounds[0][1]
        need = w if not row else row_w + GAP + w
        if row and need > usable:
            rows.append((row, row_w, row_h)); row, row_w, row_h = [], 0.0, 0.0
            need = w
        row.append((name, m, w, d)); row_w = need; row_h = max(row_h, d)
    if row: rows.append((row, row_w, row_h))
    total_h = sum(r[2] for r in rows) + GAP * (len(rows) - 1)
    placed = []
    y = total_h / 2
    for row, row_w, row_h in rows:
        x = -row_w / 2
        for name, m, w, d in row:
            t = m.copy()
            t.apply_translation([x + w / 2, y - row_h / 2, 0])
            placed.append((name, t))
            x += w + GAP
        y -= row_h + GAP
    return placed


def check(placed):
    boxes = [(n, t.bounds[0][:2], t.bounds[1][:2]) for n, t in placed]
    for n, lo, hi in boxes:
        assert lo[0] >= -BED / 2 + EDGE - 1e-6 and hi[0] <= BED / 2 - EDGE + 1e-6, (n, lo, hi)
        assert lo[1] >= -BED / 2 + EDGE - 1e-6 and hi[1] <= BED / 2 - EDGE + 1e-6, (n, lo, hi)
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            (a, alo, ahi), (b, blo, bhi) = boxes[i], boxes[j]
            gx = max(blo[0] - ahi[0], alo[0] - bhi[0])
            gy = max(blo[1] - ahi[1], alo[1] - bhi[1])
            assert max(gx, gy) >= GAP - 1e-6, (a, b, gx, gy)


meta = []
for p in PLATES:
    items = []
    for name, q in p['parts']:
        m = load(name)
        items += [(name, m)] * q
    placed = shelf_pack(items)
    check(placed)
    merged = trimesh.util.concatenate([t for _, t in placed])
    stem = f"dusty-plate-{p['n']}-{p['slug']}"
    merged.export(os.path.join(OUT, stem + '.stl'))
    scene = trimesh.Scene()
    for i, (name, t) in enumerate(placed):
        scene.add_geometry(t, node_name=f'{name}_{i + 1}', geom_name=f'{name}_{i + 1}')
    try:
        scene.export(os.path.join(OUT, stem + '.3mf'))
        has3mf = True
    except Exception as e:
        print('3mf export failed:', e); has3mf = False
    np.savez(os.path.join(OUT, stem + '.npz'),
             names=np.array([n for n, _ in placed]),
             **{f'v{i}': t.vertices for i, (_, t) in enumerate(placed)},
             **{f'f{i}': t.faces for i, (_, t) in enumerate(placed)})
    grams = sum(t.volume for _, t in placed) / 1000 * DENSITY * FILL
    lo, hi = merged.bounds
    meta.append(dict(n=p['n'], slug=p['slug'], title=p['title'], stem=stem, has3mf=has3mf,
                     grams=round(grams, 1), height=round(float(hi[2]), 1),
                     pieces=len(placed), parts=[dict(name=n, qty=q) for n, q in p['parts']],
                     footprint=[round(float(hi[0] - lo[0]), 1), round(float(hi[1] - lo[1]), 1)]))
    print(stem, len(placed), 'pieces', round(grams, 1), 'g', 'footprint', meta[-1]['footprint'], 'tallest', meta[-1]['height'])
total = sum(m['pieces'] for m in meta)
assert total == 19, total
json.dump(meta, open(os.path.join(OUT, 'plates.json'), 'w'), indent=1)
print('pieces', total, 'grams', round(sum(m['grams'] for m in meta), 1))

"""Whole drone, Rev A: LiteWing PCB (real outline from KiCad), motors, props, positioning module, battery,
F1 guard, F2 body. Writes flymo-drone.stl/.html and the weight budget (weights.json).
Run: python make_assembly.py OUT_DIR   (after the parts)
"""
import os, sys, json, math, pickle
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np, trimesh
import manifold3d as m
from cadkit import box, cyl, union, dim, finish, M, CS
from components import V, edge

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
P = os.path.join(OUT, 'parts')


def loops(polys, tol=0.05):
    segs = [list(map(tuple, p)) for p in polys]
    out = []
    while segs:
        cur = segs.pop(0)
        changed = True
        while changed:
            changed = False
            for i, s in enumerate(segs):
                if math.dist(cur[-1], s[0]) < tol:
                    cur += s[1:]; segs.pop(i); changed = True; break
                if math.dist(cur[-1], s[-1]) < tol:
                    cur += s[::-1][1:]; segs.pop(i); changed = True; break
        out.append(cur)
    return out


e = edge()
ls = loops(e['polylines'])
ls.sort(key=lambda l: -abs(sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(l, l[1:] + l[:1]))))
outer = ls[0]
cs = CS([outer if sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(outer, outer[1:] + outer[:1])) > 0 else outer[::-1]])
for h in ls[1:]:
    if len(h) > 3:
        hh = h if sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(h, h[1:] + h[:1])) > 0 else h[::-1]
        cs = cs - CS([hh])
T = V('litewing', 'pcb_t')
pcb = M.extrude(cs, T)
print('PCB loops', len(ls), 'area', round(cs.area(), 1))

MX = V('litewing', 'motor_xy')
md, below, pz = V('motor', 'd'), V('motor', 'below'), V('motor', 'prop_z')
bits = [pcb]
for sx in (-1, 1):
    for sy in (-1, 1):
        x, y = sx * MX, sy * MX
        bits.append(cyl(x, y, -below, -below + V('motor', 'len'), md, 32))
        bits.append(cyl(x, y, pz - 0.4, pz + 0.4, V('prop', 'd'), 64))          # prop disk
        bits.append(cyl(x, y, pz - 2, pz + 2, 5, 24))                           # hub
pm = V('posmod', 'drop')
bits.append(box(-V('posmod', 'w') / 2, V('posmod', 'w') / 2, -V('posmod', 'l') / 2, V('posmod', 'l') / 2, -pm, -pm + 1.6))
for sx in (-1, 1):                                                              # header stacks
    bits.append(box(sx * 21.1 - 1.3, sx * 21.1 + 1.3, -12, 12, -pm + 1.6, 0.01))
bl, bw, bh = V('battery', 'l'), V('battery', 'w'), V('battery', 'h')
bits.append(box(-bw / 2, bw / 2, -bl / 2 + 4, bl / 2 + 4, T, T + bh))


def load(stem):
    t = trimesh.load(os.path.join(P, stem + '.stl'))
    t.merge_vertices()
    return M(m.Mesh(vert_properties=np.asarray(t.vertices, np.float32), tri_verts=np.asarray(t.faces, np.uint32)))


guard, cup, body = load('flymo-f1-guard'), load('flymo-f2-cup'), load('flymo-f2-body')
bought = union(bits)
clash = {n: round((bought ^ s).volume(), 2) for n, s in (('guard', guard), ('cup', cup), ('body', body))}
clash['guard_vs_body'] = round((guard ^ (cup + body)).volume(), 2)
print('CLASH mm3 (motors/props/PCB/module/battery vs printed parts):', clash)
drone = union([bought, guard, cup, body])

W = {'LiteWing (no battery)': V('litewing', 'mass'), 'Battery': V('battery', 'mass'),
     'Positioning module': V('posmod', 'mass')}
for n, stem in (('Prop guard (F1)', 'flymo-f1-guard'), ('Hit window (F2)', 'flymo-f2-cup'), ('Body (F2)', 'flymo-f2-body')):
    t = trimesh.load(os.path.join(P, stem + '.stl'), process=False)
    W[n] = round(float(t.volume) / 1000 * 1.24, 1)
W.update({'XIAO ESP32-C3': V('xiao', 'mass'), 'Light sensor + wires': 1.0, 'Wings (clear plastic)': 0.4})
payload = sum(v for k, v in W.items() if k not in ('LiteWing (no battery)', 'Battery'))
W['_payload_g'] = round(payload, 1); W['_rated_payload_g'] = V('litewing', 'payload')
W['_total_g'] = round(sum(v for k, v in W.items() if not k.startswith('_')), 1)
json.dump(W, open(os.path.join(OUT, 'weights.json'), 'w'), indent=1)
print('WEIGHT', json.dumps(W))

span = 2 * (MX + 31 + 0.4)
finish(drone, 'flymo-drone', OUT, 'Flying Mosquito <span>whole drone</span>, Rev A',
       specs=[('Across', f'{span:.0f} mm with the guard'), ('Takeoff weight', f"about {W['_total_g']:.0f} g"),
              ('Added load', f"{W['_payload_g']:.0f} g of {W['_rated_payload_g']:.0f} g rated"), ('Front', 'white window faces the turret')],
       dims=[dim([-span / 2, -span / 2, 11.5], [span / 2, -span / 2, 11.5], [0, -14, 0], f'{span:.0f}', 'across'),
             dim([span / 2, 0, -20], [span / 2, 0, 44.8], [12, 0, 0], '65', 'tall')],
       hint='Bought parts are shown as simple blocks: the board, motors, props, positioning module and battery.')

import sys, json, pickle, html, numpy as np, trimesh
from build import *
OUT = sys.argv[1]
d = pickle.load(open(f'{OUT}/assembly.pkl', 'rb'))
pv, pf = pickle.load(open(f'{OUT}/stl/plate.pkl', 'rb'))
COL = {'frame': '#f0b43c', 'cradle': '#e8793a', 'tray': '#5cc98a', 'roller': '#b48cff',
       'gears': '#4aa8ff', 'carriers': '#ff6f9a'}
def group(k):
    if k in ('base', 'deck') or k.startswith('post') or k.startswith('dowel'): return 'frame'
    if k in ('pinion', 'compound', 'roller_gear', 'washer'): return 'gears'
    if k.startswith('carrier'): return 'carriers'
    if k in ('roller', 'axle', 'collar'): return 'roller'
    return k
groups = {}
for k, (v, f) in d['printed'].items():
    groups.setdefault(group(k), []).append(trimesh.Trimesh(v, f, process=False))
parts = []
def pack(t, c, o):
    t = t.copy(); t.merge_vertices()
    return {'v': np.round(t.vertices, 2).flatten().tolist(), 'f': t.faces.flatten().tolist(), 'c': c, 'o': o}
for g, ms in groups.items():
    parts.append(pack(trimesh.util.concatenate(ms), COL[g], 1))
gh = [trimesh.Trimesh(v, f, process=False) for (v, f) in d['ghosts'].values()]
parts.append(pack(trimesh.util.concatenate(gh), '#9fb3c8', 0.3))
allm = trimesh.util.concatenate([trimesh.Trimesh(v, f, process=False) for (v, f) in list(d['printed'].values()) + list(d['ghosts'].values())])
bounds = allm.bounds.tolist()

def dim(a, b, off, text, note=''):
    return {'a': a, 'b': b, 'off': off, 'text': str(text), 'note': note}
xw = WHEEL_X0 + WHEEL_W
top = bounds[1][2]
dims = [
    dim([-xw, EAR_Y[0], 0], [-xw, DECK_Y[1] + 1, 0], [-12, 0, 0], round(DECK_Y[1] + 1 - EAR_Y[0]), 'long'),
    dim([-xw, EAR_Y[0], 0], [xw, EAR_Y[0], 0], [0, -12, 0], round(2*xw), 'wide'),
    dim([-DECK_X, DECK_Y[1] + 1, 0], [-DECK_X, DECK_Y[1] + 1, top], [-8, 8, 0], round(top), 'tall'),
    dim([xw, -3, 0], [xw, A, 0], [12, 0, 0], round(A + 3), 'sensor to wheel'),
    dim([-SP_X1 - 4, RY - ROLL_R, RZ], [-SP_X1 - 4, RY + ROLL_R, RZ], [-14, 0, -14], round(2*ROLL_R), 'brush'),
]
legend = ''.join(f'<span><i style="background:{c}"></i>{html.escape(n)}</span>' for n, c in
                 [('frame', COL['frame']), ('brush motor mount', COL['cradle']), ('crumb tray', COL['tray']),
                  ('brush roller', COL['roller']), ('gears', COL['gears']), ('sensor arms', COL['carriers']),
                  ('bought parts', '#9fb3c8')])
specs = [('Footprint', f'{round(2*xw)} × {round(DECK_Y[1] + 1 - EAR_Y[0])} mm'), ('Printed parts', '19 pieces, ~58 g'),
         ('Brush gearing', f'{Z_BIG // Z_PIN * 1.0 * Z_ROL / Z_SM:.1f} : 1'), ('Print', 'one Adventurer 5M plate')]
data = {'parts': parts, 'plate': {'v': np.round(pv, 2).flatten().tolist(), 'f': np.asarray(pf).flatten().tolist()},
        'bounds': bounds, 'dims': dims, 'stlName': 'dusty-chassis-revA-plate.stl', 'fitPad': 1.05}
tpl = open('assembly.tpl.html').read()
page = (tpl.replace('__TITLE_TEXT__', 'Dusty chassis, Rev A')
        .replace('__TITLE_HTML__', 'Dusty <span>chassis</span>, Rev A')
        .replace('__LEGEND__', legend)
        .replace('__SPECS__', ''.join(f'<div><dt>{html.escape(k)}</dt><dd>{html.escape(v)}</dd></div>' for k, v in specs))
        .replace('__HINT__', 'Tap Parts to hide the bought parts. Download gives every printed piece laid out on one 220 mm plate. __BACK__')
        .replace('Download STL', 'Download print plate')
        .replace('__DATA__', json.dumps(data, separators=(',', ':'))))
back = sys.argv[3] if len(sys.argv) > 3 else ''
page = page.replace(' __BACK__', (' <a href="%s">Back to Dusty</a>' % back) if back else '')
open(sys.argv[2], 'w').write(page)
print(len(page)//1024, 'KB')

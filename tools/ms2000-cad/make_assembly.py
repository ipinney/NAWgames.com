"""Turret assembly viewer: printed parts and bought parts in place.
Usage: python make_assembly.py OUT_DIR   (reads OUT_DIR/parts/p*_parts.pkl, p*_ghosts.pkl)
Writes OUT_DIR/ms2000-turret.html"""
import os, sys, json, pickle
import numpy as np, trimesh
import manifold3d as m

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
PD = os.path.join(OUT, 'parts')
ld = lambda n: pickle.load(open(os.path.join(PD, n), 'rb'))
p1, g1, p2, g2, p4 = ld('p1_parts.pkl'), ld('p1_ghosts.pkl'), ld('p2_parts.pkl'), ld('p2_ghosts.pkl'), ld('p4_parts.pkl')
Z0, TZ, XO = p2['Z0'], p2['TZ'], p2['XO']
PAN = (0.0, 66.0, Z0)


def T(arr, rot=None, shift=(0, 0, 0)):
    v, f = arr
    v = np.asarray(v, float)
    if rot is not None:
        v = v @ np.asarray(rot, float).T
    return v + np.asarray(shift, float), np.asarray(f)


tt = lambda a: T(a, shift=PAN)                                   # turntable frame -> world
hd = lambda a: T(a, shift=(PAN[0], PAN[1], PAN[2] + TZ))         # head frame -> world
ROT_PIN = [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]                    # pin z axis -> +x

# key, label, group, qty, source, note, mesh, color
ITEMS = [
    ('shell', 'Base shell', 'printed', 1, 'P1', 'Top deck, front window, micro:bit slot, battery bay, speaker grille, arm switch.', T(p1['shell']), '#ff5fa2'),
    ('plate', 'Floor plate', 'printed', 1, 'P1', 'Board posts and battery rails. Four M2 screws up into the shell.', T(p1['plate']), '#c9477f'),
    ('yoke', 'Turntable + yoke', 'printed', 1, 'P2', 'Pan horn underneath, tilt servo on the right, pivot bushing and tilt stops on the left.', tt(p2['yoke']), '#9be15d'),
    ('pin', 'Pivot pin', 'printed', 1, 'P3', 'Left tilt axle, M2 x 12 into a nut in the head.', tt(T(p2['pin'], ROT_PIN, (-XO - 1.6, 0, TZ))), '#f0b43c'),
    ('head', 'Camera + laser head', 'printed', 1, 'P4', 'HuskyLens on two M3 screws, laser in a plastic pinch clamp toed in 2.4 degrees to meet the camera line at 3 ft.', hd(p4['head']), '#4ad0e8'),
    ('board', 'Xia mi + micro:bit', 'bought', 1, 'DFRobot MBT0042 + MBT0039', 'micro:bit stands up behind the front window.', T(g1['board']), '#2f6fbf'),
    ('pack', '4xAA pack', 'bought', 1, 'DFRobot FIT0918', 'Slides in from the right side.', T(g1['pack']), '#50555e'),
    ('pservo', 'Pan servo', 'bought', 1, 'DFRobot SER0049', 'Hangs from the deck.', T(g1['servo']), '#474c55'),
    ('tservo', 'Tilt servo', 'bought', 1, 'DFRobot SER0049', 'Right upright, shaft pointing in.', tt(g2['tilt_servo']), '#474c55'),
    ('horns', 'Servo horns', 'bought', 2, 'with the servos', 'Sizes are estimates until the servos arrive.', None, '#e8e8e8'),
    ('speaker', 'Speaker', 'bought', 1, 'DFRobot FIT0449', 'Faces the back grille.', T(g1['speaker']), '#1d7a3a'),
    ('switch', 'Laser arm switch', 'bought', 1, 'Adafruit 805', 'Back wall, grown-up side.', T(g1['switch']), '#5c6066'),
    ('husky', 'HuskyLens', 'bought', 1, 'DFRobot SEN0305', 'Lens forward, screen toward the back.', hd(p4['husky_mesh']), '#e8e8e8'),
    ('laser', 'Laser, Class 2', 'bought', 1, 'Quarton VLM-650-03 LPT', 'Under the camera, aimed the same way.', hd(p4['laser']), '#b9bec6'),
]
hp = tt(g2['pan_horn']); ht = tt(T(g2['tilt_horn']))
ITEMS = [(k, n, g, q, s, no, (np.vstack([hp[0], ht[0]]), np.vstack([hp[1], ht[1] + len(hp[0])])) if k == 'horns' else mesh, c)
         for k, n, g, q, s, no, mesh, c in ITEMS]

def main():
    items, allv = [], []
    for k, n, g, q, s, note, (v, f), c in ITEMS:
        t = trimesh.Trimesh(v, f, process=False)
        b = [v.min(0).tolist(), v.max(0).tolist()]
        gr = round(abs(t.volume) / 1000 * 1.24 * 0.62, 1) if g == 'printed' else None
        items.append({'k': k, 'n': n, 'g': g, 'q': q, 's': s, 'note': note, 'c': c,
                      'size': [round(float(x), 1) for x in (v.max(0) - v.min(0))], 'sb': b, 'b': b, 'gr': gr,
                      'v': np.round(v, 2).flatten().tolist(), 'f': f.astype(int).flatten().tolist()})
        allv.append(v)
    allv = np.vstack(allv)
    data = {'items': items, 'bounds': [allv.min(0).tolist(), allv.max(0).tolist()]}
    tpl = open(os.path.join(HERE, 'catalog.tpl.html')).read()
    tpl = tpl.replace('MS-2000 components', 'MS-2000 turret').replace('MS-2000 <span>components</span>', 'MS-2000 <span>turret</span>')
    tpl = tpl.replace('Tap a part below to see it alone with its measurements, or in place on the turret.',
                      'Everything designed so far, in place. Tap a part to see it alone or highlighted on the turret. Grey parts are bought. Wand and mosquito pod come next.')
    tpl = tpl.replace("['PLA total',`~${Math.round(g)} g`]", "['PLA (15% infill est.)',`~${Math.round(g)} g`]")
    open(os.path.join(OUT, 'ms2000-turret.html'), 'w').write(tpl.replace('__DATA__', json.dumps(data, separators=(',', ':'))))
    print('assembly', len(items), 'items', os.path.getsize(os.path.join(OUT, 'ms2000-turret.html')) // 1024, 'KB',
          'height', round(allv[:, 2].max(), 1), 'PLA est', round(sum(i['gr'] or 0 for i in items)), 'g')


if __name__ == '__main__':
    main()

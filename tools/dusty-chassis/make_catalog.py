"""Component catalog viewer: every printed and bought part, alone with its size or in place on the robot.
Usage: python make_catalog.py OUT_DIR   (reads OUT_DIR/assembly.pkl from assemble.py, writes OUT_DIR/dusty-components.html)"""
import os, sys, pickle, json, numpy as np, trimesh
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
d = pickle.load(open(os.path.join(OUT, 'assembly.pkl'), 'rb'))
PR, GH = d['printed'], d['ghosts']
# key, label, group, qty, source, note, mesh keys
P = [
 ('base','Base plate','printed',1,'Print','Main frame: motor bracket pads, roller side plates, gear pin, caster boss, sensor ears. Prints top face down.',['base']),
 ('deck','Electronics deck','printed',1,'Print','Upper shelf for the moto:bit, corner clips, zip-tie slots, wire window.',['deck']),
 ('post','Deck posts','printed',4,'Print','Standoffs between base and deck. Peg into the base, M2 screw from the top.',['post1','post2','post3','post4']),
 ('cradle','Brush motor cradle','printed',1,'Print','Holds the 130 motor and the brush on/off rocker. Two screws plus two dowels.',['cradle']),
 ('dowel','Cradle dowels','printed',2,'Print','Locate the cradle on the base.',['dowel1','dowel2']),
 ('tray','Crumb tray','printed',1,'Print','Snaps in from underneath. A ramp and crest let crumbs in but not back out; sloped corners and inward lips keep them inside. Weigh it for the capture test.',['tray']),
 ('roller','Brush roller','printed',1,'Print','14 mm core, 7 cross holes for pipe cleaners. Prints standing up.',['roller']),
 ('axle','Roller axle','printed',1,'Print','4 mm D-shaft through roller and roller gear. Prints flat side down.',['axle']),
 ('collar','Axle collar','printed',1,'Print','Keeps the axle from walking out on the left side.',['collar']),
 ('pinion','Motor pinion','printed',1,'Print','12 teeth, module 0.8. Press fit on the 130 motor shaft.',['pinion']),
 ('compound','Compound gear','printed',1,'Print','36 teeth (m0.8) joined to 10 teeth (m1.25). Spins on the base pin.',['compound']),
 ('roller_gear','Roller gear','printed',1,'Print','18 teeth, m1.25, D-bore. Total brush reduction 5.4 : 1.',['roller_gear']),
 ('washer','Gear washer','printed',1,'Print','Retains the compound gear under a screw.',['washer']),
 ('carrier_R','Right sensor arm','printed',1,'Print','Holds a QTR-1A face down about 3 mm off the table. Slotted for height.',['carrier_R']),
 ('carrier_L','Left sensor arm','printed',1,'Print','Same as right, plus the pad for the whisker switch.',['carrier_L']),
]
G = [
 ('n20','N20 drive motors + brackets','bought',2,'Adafruit (motors), Pololu #1089 (brackets)','6 V, 298:1, magnetic encoders. Pololu STEP model for motor and bracket.',['N20 motors + brackets']),
 ('wheels','Wheels, 32 x 7 mm','bought',2,'Pololu','Axle 16 mm off the table.',['wheels']),
 ('caster','Ball caster, 3/8 in','bought',1,'Pololu','Rear support. Screws up into the base boss.',['ball caster']),
 ('battery','4xAA holder','bought',1,'Adafruit','Switch and 2.1 mm plug to the moto:bit. Sits under the deck.',['4xAA pack']),
 ('motobit','moto:bit carrier','bought',1,'SparkFun','Motor driver. Slides between the guides on the deck, held by two zip ties.',['moto:bit']),
 ('microbit','micro:bit v2','bought',1,'Adafruit','Plugs flat into the connector on the front of the moto:bit and sticks out over the brush, LEDs facing up.',['micro:bit']),
 ('m130','130 brush motor','bought',1,'Adafruit','Drives the roller through the gear train.',['130 brush motor']),
 ('bristles','Pipe-cleaner bristles','bought',1,'Amazon','Threaded through the roller. Just touch the table.',['pipe-cleaner bristles']),
 ('qtr','QTR-1A cliff sensors','bought',2,'Pololu','Infrared, sharpest at 3 mm.',['QTR-1A sensors']),
 ('whisker','Roller lever microswitch','bought',1,'Adafruit','Mechanical backup cliff sensor on the left arm.',['whisker switch']),
 ('rocker','Mini rocker switch (KCD11)','bought',1,'Not on the receipts yet','Brush on/off, mounts in the cradle panel.',['rocker switch']),
]
COL = {'base':'#f0b43c','deck':'#f0b43c','post':'#f0b43c','dowel':'#f0b43c','cradle':'#e8793a','tray':'#5cc98a',
       'roller':'#b48cff','axle':'#b48cff','collar':'#b48cff','pinion':'#4aa8ff','compound':'#4aa8ff',
       'roller_gear':'#4aa8ff','washer':'#4aa8ff','carrier_R':'#ff6f9a','carrier_L':'#ff6f9a'}
GCOL = '#9fb3c8'
items = []
allv = []
for spec, src in ((P, PR), (G, GH)):
    for key, label, grp, qty, source, note, keys in spec:
        ms = [trimesh.Trimesh(*src[k], process=False) for k in keys]
        t = trimesh.util.concatenate(ms); t.merge_vertices()
        b = t.bounds
        size = (b[1] - b[0]).round(1).tolist()
        one = None
        if len(keys) > 1:
            one = ms[0].copy()
        elif qty > 1:  # mirrored pair in one mesh: keep the right-hand piece
            fm = t.triangles_center[:, 0] > 0
            one = trimesh.Trimesh(t.vertices, t.faces[fm], process=False); one.remove_unreferenced_vertices()
        if one is not None:
            one.merge_vertices(); sb = one.bounds; size = (sb[1] - sb[0]).round(1).tolist()
        else:
            sb = b
        grams = None
        if grp == 'printed':
            grams = round(sum(m.volume for m in ms) / 1000 * 1.24 * 0.62, 1)
        items.append({'k': key, 'n': label, 'g': grp, 'q': qty, 's': source, 'note': note,
                      'c': COL.get(key, GCOL), 'size': size, 'sb': sb.tolist(), 'b': b.tolist(), 'gr': grams,
                      'v': np.round(t.vertices, 2).flatten().tolist(), 'f': t.faces.flatten().tolist(),
                      **({'v1': np.round(one.vertices, 2).flatten().tolist(), 'f1': one.faces.flatten().tolist()} if one is not None else {})})
        allv.append(t.vertices)
allv = np.vstack(allv)
data = {'items': items, 'bounds': [allv.min(0).tolist(), allv.max(0).tolist()]}
tpl = open(os.path.join(HERE, 'catalog.tpl.html')).read()
out = tpl.replace('__DATA__', json.dumps(data, separators=(',', ':')))
open(os.path.join(OUT, 'dusty-components.html'), 'w').write(out)
print(len(out) // 1024, 'KB', len(items), 'items')

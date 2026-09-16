"""P5 wand handle, Rev A.

A paddle that zip-ties onto the fishing rod (or a 3/8 in dowel). Frame: x across, y along the rod
(0 = the line end), z up (display side).
- micro:bit bay: board face up, edge connector toward the line end. The big rings P0, P1, P2, 3V, GND
  sit on printed bosses; M2 screws through the rings clamp the 4-wire cable ends (no soldering) and hold
  the board. The top edge slides under two corner lips. Floor vents under the V2 speaker.
- A notch in the bay's top wall passes the battery plug and lets a USB cable in (pull the pack to code).
- Pack bay: 2xAAA holder, lead toward the micro:bit. The two rear zip ties go over the pack and under
  the rod, so one tie holds both.
- Underneath: two 45 degree rails make a V that centers rods from about 9 to 30 mm.
Prints face up, standing on the rail bottoms. The rails' outer faces slope 45 degrees out to the edge, so no supports.
Run: python parts/p5_wand.py OUT_DIR
"""
import os, sys, math, pickle
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
import manifold3d as m
from cadkit import box, cyl, prism_xy, prism_xz, union, dim, finish, M
from components import V, GHOSTS, HARDWARE

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
M2T = HARDWARE['m2_tap']['v']
T, FL = 2.0, 2.0                          # wall, floor
bw, bh = V('microbit', 'pcb_w'), V('microbit', 'pcb_h')
BACK = V('microbit', 'back_parts')
BZ = FL + BACK + 0.4                      # board underside
BI = bw / 2 + 0.3                         # bay inner half width
Y_BAY0 = 12.0
Y_BAY1 = Y_BAY0 + bh + 0.6
pw, pl, ph = V('aaa_pack', 'w'), V('aaa_pack', 'l'), V('aaa_pack', 'h')
Y_PK0 = Y_BAY1 + T
Y_PK1 = Y_PK0 + pl + 2.0 + 1.0            # pack + lead + clearance
L_ = Y_PK1 + T
PI = pw / 2 + 0.6                         # pack bay inner half width
WB = BI + T                               # outer half width, micro:bit section
WP = PI + T + 6.0                         # outer half width, pack section (room for tie slots)
WALL_Z = BZ + 3.0
RINGS = (-19.5, -9.75, 0.0, 9.75, 19.5)   # P0 P1 P2 3V GND
RING_Y = Y_BAY0 + 0.3 + 4.5

# ---------------- body ----------------
outline = [(-WB, 0), (WB, 0), (WB, Y_BAY1 + T), (WP, Y_BAY1 + T + 6), (WP, L_), (-WP, L_), (-WP, Y_BAY1 + T + 6), (-WB, Y_BAY1 + T)]
body = prism_xy(outline, 0, FL)
walls = []
walls.append(box(-WB, WB, 0, T, FL - 0.01, FL + 5.0))                                   # line-end wall (low)
walls.append(box(-WB, -BI, 0, Y_BAY1 + T, FL - 0.01, WALL_Z))                             # bay sides
walls.append(box(BI, WB, 0, Y_BAY1 + T, FL - 0.01, WALL_Z))
walls.append(box(-WB, WB, Y_BAY1, Y_BAY1 + T, FL - 0.01, WALL_Z))                         # bay top wall
walls.append(box(-PI - T, -PI, Y_PK0, L_, FL - 0.01, FL + ph * 0.6))                       # pack sides
walls.append(box(PI, PI + T, Y_PK0, L_, FL - 0.01, FL + ph * 0.6))
walls.append(box(-PI - T, PI + T, L_ - T, L_, FL - 0.01, FL + ph * 0.6))                   # end wall
# ring bosses and top corner pads
for x in RINGS:
    walls.append(cyl(x, RING_Y, FL - 0.01, BZ, 6.0))
for s in (-1, 1):
    walls.append(box(min(s * 20, s * BI), max(s * 20, s * BI), Y_BAY1 - 6, Y_BAY1, FL - 0.01, BZ))
    # retaining lips over the top corners
    walls.append(box(min(s * 16, s * BI), max(s * 16, s * BI), Y_BAY1 - 1.2, Y_BAY1 + 0.01, BZ + 1.6 + 0.2, WALL_Z))
# rod rails (V opening down)
def rail(w):
    return [(4.0, 0.01), (w, 0.01), (w - 8.0, -8.0), (12.0, -8.0)]
YT = Y_BAY1 + T + 6
for sg in (-1, 1):
    walls.append(prism_xz([(sg * x, z) for x, z in rail(WB)], 6.0, Y_BAY1 + T))
    walls.append(prism_xz([(sg * x, z) for x, z in rail(WP)], Y_BAY1 + T - 0.01, L_ - 4.0))
wand = union([body] + walls)

cuts = []
for x in RINGS:
    cuts.append(cyl(x, RING_Y, -9, BZ + 1, M2T, 16))
cuts.append(box(-8, 8, -1, T + 1, FL + 1.0, FL + 6))                                     # cable exit
cuts.append(box(-7, 15, Y_BAY1 - 1, Y_BAY1 + T + 1, FL + 0.6, WALL_Z + 1))               # battery plug + USB notch
for i in range(4):                                                                        # speaker vents
    cuts.append(box(-3, 3, Y_BAY0 + 14 + i * 5, Y_BAY0 + 16.5 + i * 5, -9, FL + 1))
TIE_W, TIE_T = 5.0, 2.2
tie_ys = [4.5, Y_PK0 + 12, Y_PK1 - 12]
for ty in tie_ys:
    for s in (-1, 1):
        xin = WB - T - 1.2 if ty < Y_BAY0 else PI + T + 0.8
        cuts.append(box(min(s * xin, s * (xin + TIE_T)), max(s * xin, s * (xin + TIE_T)), ty - TIE_W / 2, ty + TIE_W / 2, -9, 30))
for c in cuts:
    wand = wand - c

# ---------------- ghosts, checks ----------------
mg, _ = GHOSTS['microbit']()
bit = mg.translate([0, Y_BAY0 + 0.3, BZ - BACK])
pg, _ = GHOSTS['aaa_pack']()
pack = pg.rotate([0, 0, 180]).translate([0, Y_PK1 - 0.5, FL])
problems = []
for n, g in (('micro:bit', bit), ('pack', pack)):
    v = (g ^ wand).volume()
    if v > 0.5: problems.append((n, 'wand', round(v, 1)))
# rods: where they sit, and that they touch rails (or the floor) but do not cut in
for d in (9.5, 16.0, 25.0, 30.0):
    r = d / 2
    zc = min(4.0 - r * math.sqrt(2), -r)       # V apex at z = 4, floor underside at z = 0
    rod = M.cylinder(L_, r, r, 64).rotate([-90, 0, 0]).translate([0, 0, zc])
    cut_in = (rod ^ wand).volume()
    touch = (rod.translate([0, 0, 0.3]) ^ wand).volume()
    print(f'rod {d:4.1f} mm: center z {zc:6.1f}, bites {cut_in:.2f} mm3, touches {"yes" if touch > 0.01 else "NO"}')
    if cut_in > 0.5: problems.append((f'rod {d}', 'wand', round(cut_in, 1)))
# lift the micro:bit out: straight up after the bottom edge, then slide the top edge out of the lips
lift = bit.translate([0, -3.0, 0]) + bit.translate([0, -3.0, 20])
v = (box(-bw / 2, bw / 2, Y_BAY0 - 2.7, Y_BAY1 - 2.7, BZ, 60) ^ wand).volume()
if v > 0.5: problems.append(('micro:bit lift path', 'wand', round(v, 1)))
# USB plug into the top edge of the board (pack removed)
usb = box(-5, 5, Y_BAY1 - 6, Y_BAY1 + 25, BZ - BACK + 2.0, BZ - 0.2)
v = (usb ^ wand).volume()
if v > 0.5: problems.append(('USB plug path', 'wand', round(v, 1)))
print('FIT', problems or 'clear')
print(f'length {L_:.1f}, width {2 * WP:.1f} (pack) / {2 * WB:.1f} (micro:bit), board top z {BZ + 1.6:.1f}, walls z {WALL_Z:.1f}')

arr = lambda s: (np.array(s.to_mesh().vert_properties)[:, :3], np.array(s.to_mesh().tri_verts))
pickle.dump({'wand': arr(wand), 'bit': arr(bit), 'pack': arr(pack)}, open(os.path.join(OUT, 'p5_parts.pkl'), 'wb'))

finish(wand, 'ms2000-p5-wand', OUT, 'MS-2000 <span>wand handle</span>, Rev A',
       specs=[('Size', f'{2 * WB:.0f} × {L_:.0f} × {WALL_Z + 8:.0f}'), ('Holds', 'micro:bit + 2xAAA'),
              ('Rod', '9 to 30 mm, 3 zip ties'), ('Print', 'face up on the rails, no supports')],
       dims=[dim([-WP, L_, 0], [WP, L_, 0], [0, 10, 0], f'{2 * WP:.0f}', 'wide at pack'),
             dim([WB, 0, 0], [WB, L_, 0], [18, 0, 0], f'{L_:.0f}', 'long'),
             dim([-bw / 2, RING_Y, BZ], [bw / 2, RING_Y, BZ], [0, -14, 6], '39', 'ring screws'),
             dim([-WB, 0, -8], [-WB, 0, WALL_Z], [-10, -4, 0], f'{WALL_Z + 8:.0f}', 'tall'),
             dim([-12, 30, -8], [12, 30, -8], [0, 0, -8], '24', 'rail gap')],
       hint='M2 screws through the micro:bit rings clamp the cable wires: P0 sensor, P1 eyes, 3V, GND. Rear zip ties go over the battery pack and under the rod.')

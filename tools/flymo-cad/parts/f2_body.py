"""F2 mosquito body = the hit pod, Rev A: white front cup + back body.

The body lies along y (front at +y, facing the MS-2000). The front cup is WHITE PLA with a 0.8 mm face: the laser
dot makes the whole face glow and the ALS-PT19 at the back of the cavity sees it, so a dot 13 mm off center still
counts (the MS-2000 pod trick). The face is 40 mm wide inside; the bottom is cut flat so the body sits on the
battery, which makes the window 40 wide and about 34 tall (the camera/laser error is side to side).
The back body holds the sensor on a bulkhead, the XIAO ESP32-C3 on the floor behind it, and tapers into the
abdomen. The battery strap threads through a tunnel in the floor. USB-C slot under the tail for programming.
Cup prints face down; back prints bulkhead down. No supports.
Run: python parts/f2_body.py OUT_DIR
"""
import os, sys, math, pickle
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
import manifold3d as m
from cadkit import box, cyl, union, dim, finish, M
from components import V

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
DI = 40.0
WT = 0.8
R = DI / 2 + WT                     # 20.9 outer radius
FACE = 0.8
BAT_TOP = V('litewing', 'pcb_t') + V('battery', 'h')      # 10.6
FLOOR = 1.0                          # thin floor; a 2.6 mm band carries the strap tunnel
DEPTH = 13.4                         # axis height above the flat bottom
CZ = BAT_TOP + DEPTH                 # body axis height
YF, YC0 = 20.0, 8.0                  # face / cup back edge
YP0, YP1 = YC0, 10.5                  # plug into the cup; bulkhead is the plug front
YT = -2.0                            # tube ends, abdomen starts
YA, RA = -32.0, 5.0                  # tail
CLR = 0.1


def ycyl(y0, y1, r, segs=96, x=0.0, z=CZ):
    return M.cylinder(y1 - y0, r, r, segs).rotate([-90, 0, 0]).translate([x, y0, z])


def ycone(y0, r0, y1, r1, segs=96):
    return M.cylinder(y0 - y1, r1, r0, segs).rotate([-90, 0, 0]).translate([0, y1, CZ])


bottom_cut = box(-40, 40, -60, 40, -40, BAT_TOP)          # everything below the battery top goes

# ---------------- front cup (white) ----------------
cup = ycyl(YC0, YF, R) - ycyl(YC0 - 1, YF - FACE, R - WT)
cup = cup - bottom_cut
# floor strip under the cavity so the cup is closed at the bottom where the circle was cut
cup = cup + (box(-math.sqrt(R ** 2 - DEPTH ** 2), math.sqrt(R ** 2 - DEPTH ** 2), YC0, YF, BAT_TOP, BAT_TOP + WT) ^ ycyl(YC0, YF, R))

# ---------------- back body ----------------
outer = union([ycyl(YT, YC0, R), ycyl(YP0 - 0.01, YP1, R - WT - CLR), ycone(YT, R, YA, RA)])
inner = union([ycyl(YT - 0.01, YP1 - 1.0, R - WT), ycone(YT + 0.01, R - WT, YA + WT, RA - WT)])
inner = inner - box(-40, 40, -60, 40, -40, BAT_TOP + FLOOR)                   # keep the floor
back = (outer - bottom_cut) - inner
back = back + (box(-30, 30, -10.5, 2.0, BAT_TOP, BAT_TOP + 2.6) ^ (outer - bottom_cut))   # strap tunnel band
# plug is a ring, open in the middle behind the bulkhead
# bulkhead = the plug front (YP1 - 1.0 .. YP1), full disk
sw, sl, sh = V('light_sensor', 'w'), V('light_sensor', 'l'), V('light_sensor', 'h')
back = back - box(-sw / 2 - 0.2, sw / 2 + 0.2, YP1 - 1.2, YP1 + 1, CZ - sl / 2 - 0.2, CZ + sl / 2 + 0.2)   # sensor pocket, face out
back = back - box(-2.5, 2.5, YP1 - 3, YP1 - 1.1, CZ - 3, CZ + 2)                                         # wire hole behind it
# strap tunnel through the floor, across x
back = back - box(-30, 30, -9.5, 1.0, BAT_TOP + 0.6, BAT_TOP + 1.9)
# battery tap wires come up through the floor at the front
back = back - cyl(8.0, 4.0, BAT_TOP - 1, BAT_TOP + FLOOR + 1, 3.5, 24)
# USB-C slot for the XIAO, under the tail
back = back - box(-5.0, 5.0, YA - 1, -12.0, BAT_TOP - 1, BAT_TOP + FLOOR + 4.0)

# ---------------- XIAO fit ----------------
xl, xw, xh = V('xiao', 'l'), V('xiao', 'w'), V('xiao', 'h')
xiao = box(-xw / 2, xw / 2, -12.0, -12.0 + xl, BAT_TOP + 2.6, BAT_TOP + 2.6 + xh)
hit = (xiao ^ back).volume()
print('XIAO vs body overlap mm3 (want 0):', round(hit, 2))
print('face inside width', DI, 'mm; window height', round(R - WT + DEPTH - WT, 1), 'mm; axis at z', CZ)

# prop clearance: body footprint vs prop disks (motor at 42, prop r 27.5)
MX, PR = V('litewing', 'motor_xy'), V('prop', 'd') / 2
worst = min(math.hypot(MX - R, MX - YF), math.hypot(MX - R, MX - abs(YT)))
print('closest body edge to a prop disk center', round(worst, 1), 'mm, prop radius', PR)

arr = lambda s: (np.array(s.to_mesh().vert_properties)[:, :3], np.array(s.to_mesh().tri_verts))
pickle.dump({'cup': arr(cup), 'back': arr(back)}, open(os.path.join(OUT, 'f2_parts.pkl'), 'wb'))

finish(cup, 'flymo-f2-cup', OUT, 'Flying Mosquito <span>hit window</span>, Rev A',
       specs=[('Window', f'{DI:g} mm wide, {FACE} mm face'), ('Material', 'WHITE PLA'), ('Job', 'glows when the laser hits'), ('Print', 'face down, no supports')],
       dims=[dim([-R, YF, CZ], [R, YF, CZ], [0, 0, R + 6], f'{2 * R:.1f}', 'outside'),
             dim([R, YC0, BAT_TOP], [R, YF, BAT_TOP], [8, 0, 0], f'{YF - YC0:g}', 'deep')],
       hint='Print in white. The back body plugs in from behind; glue it once the sensor works.')
finish(back, 'flymo-f2-body', OUT, 'Flying Mosquito <span>body</span>, Rev A',
       specs=[('Length', f'{YF - YA:g} mm with the window'), ('Holds', 'light sensor + XIAO ESP32-C3'), ('Mounts', 'battery strap through the floor'), ('Print', 'bulkhead down, no supports')],
       dims=[dim([0, YA, BAT_TOP], [0, YP1, BAT_TOP], [-R - 8, 0, 0], f'{YP1 - YA:g}', 'long'),
             dim([-R, YT, BAT_TOP], [-R, YT, CZ + R], [-8, 0, 0], f'{CZ + R - BAT_TOP:.1f}', 'tall')],
       hint='Sensor face out in the bulkhead pocket, XIAO flat on the floor with USB-C toward the tail. Thread the battery strap through the floor tunnel.')

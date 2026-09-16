"""P6 mosquito sensor pod, Rev A: front cup (print in WHITE PLA) + back cap.

Local frame: z points at the turret (front face z = ZF), y up, x across. z = 0 is the stuffed-mosquito side.
The laser dot can land anywhere on the 40 mm white face. The 0.8 mm white PLA face glows and lights the
whole white cavity, and the ALS-PT19 at the back of the cavity sees the jump. That is the light collector:
the camera-to-laser offset (up to 15 mm at 3 and 7 ft) and the pod not being exactly at the stuffy's center
still count as hits.
The eye bar on top of the cup holds the two red LEDs looking at the turret (outside the cavity, so the eyes
never trigger the sensor), the ribbon cable entry and the fishing-line tab.
The cap plugs into the cup (glue), holds the sensor, and its open back is where the wires and the two
220 ohm resistors live. It is sewn or strapped to the stuffed mosquito.
Cup prints face down. Cap prints plug face down. No supports.
Run: python parts/p6_pod.py OUT_DIR
"""
import os, sys, math, pickle
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
import manifold3d as m
from cadkit import box, cyl, union, dim, finish, M
from components import V, GHOSTS

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
DI = 40.0                 # collector / cavity inner diameter
WT = 1.6                  # wall
DO = DI + 2 * WT
FACE = 0.8                # diffuser thickness (white PLA)
Z_BOX, Z_FL, Z_PL = 7.0, 9.0, 11.0          # rear box top, flange top, plug face
ZF = 20.0                                   # front face
CLR = 0.1
RO = DO / 2
BAR_Y0, BAR_Y1, BAR_W = RO + 0.2, RO + 8.6, 26.0
LED_X, LED_Y = 7.0, (RO + 0.2 + RO + 8.6) / 2
LED_H = V('led', 'h')
LED_D = V('led', 'hole_d')
FLANGE_D = V('led', 'flange_d') + 0.4

cz = lambda z0, z1, d, x=0.0, y=0.0: cyl(x, y, z0, z1, d, 64)

# ---------------- front cup (white) ----------------
cup = cz(Z_FL, ZF, DO) - cz(Z_FL - 1, ZF - FACE, DI + 0.2)
bar = box(-BAR_W / 2, BAR_W / 2, BAR_Y0 - 1.0, BAR_Y1, 0.0, ZF)          # overlaps the cup wall
bar = bar - cz(-1, Z_FL + 0.01, DO + 0.4)                                  # stay clear of the cap behind the cup
bar = bar - box(-BAR_W / 2 + 1.6, BAR_W / 2 - 1.6, BAR_Y0 + 1.2, BAR_Y1 - 1.6, -1, 6.0)   # wiring hollow, open at the back
tab = box(-2.2, 2.2, BAR_Y1 - 0.01, BAR_Y1 + 6.5, 0.0, 6.0) - \
    M.cylinder(6, 1.6, 1.6, 16).rotate([0, 90, 0]).translate([-3, BAR_Y1 + 3.6, 3.0])
cup = union([cup, bar, tab])
for sx in (-1, 1):
    cup = cup - cz(6.0 - 0.01, ZF - LED_H + 1.0, FLANGE_D, sx * LED_X, LED_Y)   # flange/lead bore
    cup = cup - cz(ZF - LED_H, ZF + 1, LED_D, sx * LED_X, LED_Y)                                          # LED hole
cup = cup - box(-2.8, 2.8, BAR_Y1 - 2.0, BAR_Y1 + 0.01, 1.0, 3.4)          # ribbon cable slot through the bar top
cup = cup - box(-4.0, 4.0, BAR_Y0 - 1.5, BAR_Y0 + 1.5, -1, 5.0)           # wires down into the cap
cup = cup - cz(Z_FL - 1, ZF - FACE, DI + 0.2)                              # keep the cavity clean

# ---------------- back cap ----------------
cap = union([cz(0, Z_BOX, DO) - cz(-1, Z_BOX + 0.01, DO - 2 * WT),       # rear box, open back
             cz(Z_BOX - 0.01, Z_FL, DO),                                  # flange
             cz(Z_FL - 0.01, Z_PL, DI - 2 * CLR + 0.2)])                  # plug
sw, sl = V('light_sensor', 'w'), V('light_sensor', 'l')
EYE_Y = 7.35
cap = cap - box(-sw / 2 - 0.2, sw / 2 + 0.2, -EYE_Y - 0.2, sl - EYE_Y + 0.2, Z_PL - 1.6, Z_PL + 1)   # sensor pocket
cap = cap - box(-3.0, 3.0, -EYE_Y + 0.3, sl - EYE_Y - 1.2, Z_BOX - 1, Z_PL)                          # wire window
cap = cap - box(-4.0, 4.0, RO - WT - 1, RO + 1, -1, 5.0)                   # wires from the eye bar
for sx in (-1, 1):                                                         # strap slots (elastic or zip tie)
    cap = cap - box(sx * RO - 3, sx * RO + 3, -4.5, 4.5, 1.8, 4.2)
# sewing lugs on the box sides, full height so they print without supports; thread holes run along the wall
tabs = []
for a in (45, 135, 225, 315):
    lug = box(-2.5, 2.5, RO - 1.0, RO + 4.0, 0.0, Z_FL)
    lug = lug - M.cylinder(8, 0.9, 0.9, 12).rotate([0, 90, 0]).translate([-4, RO + 2.2, 2.2])
    lug = lug - M.cylinder(8, 0.9, 0.9, 12).rotate([0, 90, 0]).translate([-4, RO + 2.2, 6.0])
    tabs.append(lug.rotate([0, 0, a - 90]))
cap = union([cap] + tabs)
cap = cap - box(-4.0, 4.0, RO - 1.0, RO + 6.0, -1, 5.0)                    # keep the wire gap open under the bar

# ---------------- ghosts, checks ----------------
lg, _ = GHOSTS['led']()
leds = union([lg.translate([sx * LED_X, LED_Y, ZF - LED_H]) for sx in (-1, 1)])
sg, _ = GHOSTS['light_sensor']()
sensor = sg.translate([0, -EYE_Y, Z_PL - 1.6])
problems = []
for n, g in (('LEDs', leds), ('sensor', sensor)):
    for pn, p in (('cup', cup), ('cap', cap)):
        v = (g ^ p).volume()
        if v > 0.3: problems.append((n, pn, round(v, 2)))
v = (cup ^ cap).volume()
if v > 0.3: problems.append(('cup', 'cap', round(v, 2)))
# LEDs must not see into the cavity
if (leds ^ cz(Z_FL, ZF - FACE, DI)).volume() > 0.01: problems.append(('LEDs', 'cavity', 1))
print('FIT', problems or 'clear')
spot = V('laser', 'spot_5m')
reach = DI / 2 - spot / 2
print(f'collector {DI:g} mm: a {spot:g} mm dot fully on the face up to {reach:.1f} mm off center '
      f'(laser offset at 3/7 ft is 15.2 mm, so {reach - 15.2:+.1f} mm to spare with the pod centered on the aim point)')

arr = lambda s: (np.array(s.to_mesh().vert_properties)[:, :3], np.array(s.to_mesh().tri_verts))
pickle.dump({'cup': arr(cup), 'cap': arr(cap), 'leds': arr(leds), 'sensor': arr(sensor)}, open(os.path.join(OUT, 'p6_parts.pkl'), 'wb'))

finish(cup, 'ms2000-p6-pod-cup', OUT, 'MS-2000 <span>pod front</span>, Rev A',
       specs=[('Face', f'{DI:g} mm, {FACE:g} thick'), ('Material', 'WHITE PLA'), ('Eyes', '2 × 5 mm LED'), ('Print', 'face down, no supports')],
       dims=[dim([-RO, -RO, ZF], [RO, -RO, ZF], [0, -8, 0], f'{DO:.1f}', 'outside'),
             dim([-DI / 2, 0, ZF - FACE], [DI / 2, 0, ZF - FACE], [0, 0, 6], f'{DI:g}', 'glowing face'),
             dim([RO, -RO, Z_FL], [RO, -RO, ZF], [10, 0, 0], f'{ZF - Z_FL:g}', 'deep'),
             dim([-LED_X, BAR_Y1, ZF], [LED_X, BAR_Y1, ZF], [0, 6, 0], f'{2 * LED_X:g}', 'eyes')],
       hint='Print in white so the laser dot makes the whole face glow. LEDs push in from the back. Tie the fishing line through the tab.')
finish(cap, 'ms2000-p6-pod-cap', OUT, 'MS-2000 <span>pod back</span>, Rev A',
       specs=[('Size', f'{2 * (RO + 4):.0f} dia over lugs'), ('Holds', 'ALS-PT19 sensor'), ('Attach', 'sew the 4 lugs or strap'), ('Print', 'plug face down')],
       dims=[dim([-RO, 0, 0], [RO, 0, 0], [0, -RO - 8, 0], f'{DO:.1f}', 'box'),
             dim([-sw / 2, -EYE_Y, Z_PL], [sw / 2, -EYE_Y, Z_PL], [0, -6, 4], f'{sw:g}', 'sensor'),
             dim([RO, 0, 0], [RO, 0, Z_PL], [10, 0, 0], f'{Z_PL:g}', 'tall')],
       hint='Sensor sits face out in the pocket; wires and resistors go in the open back. Glue the cap into the cup, then sew through the lug holes or strap it to the mosquito.')

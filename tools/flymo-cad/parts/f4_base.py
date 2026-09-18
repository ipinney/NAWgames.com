"""F4 launch pad + F5 control box (shell and floor plate), Rev A.

Launch pad: sits on the flight mat in the middle of the test zone. Four cone cups catch the guard feet so the
drone always starts in the same spot, pointing at the MS-2000 (arrow at the front edge).
Control box: sits outside the net. Top face: micro:bit window (shows the status and radios GO and HIT on group 7)
and the big GO button. Inside: Raspberry Pi Zero 2 W (runs the flight script and hears the HIT messages), the
power bank flat at the back, a USB-C charge port in the right wall and a slot for the power switch in the left.
Shell prints top down, floor plate flat, pad flat. No supports.
Run: python parts/f4_base.py OUT_DIR
"""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from cadkit import box, cyl, union, dim, finish, M
from components import V

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'

# ---------------- launch pad ----------------
PAD, PT = 150.0, 2.4
FOOT = 42.0 + (31.0 - 1.2) / math.sqrt(2)        # guard foot centers (F1 POST_R)
pad = box(-PAD / 2, PAD / 2, -PAD / 2, PAD / 2, 0, PT)
for sx in (-1, 1):
    for sy in (-1, 1):
        x, y = sx * FOOT, sy * FOOT
        ring = M.cylinder(3.0, 8.0, 8.0, 48).translate([x, y, PT - 0.01])
        cone = M.cylinder(3.02, 3.6, 5.0, 48).translate([x, y, PT - 0.01])     # 7.2 floor to 10 at the top
        pad = pad + (ring - cone)
pad = pad - box(-6, 6, PAD / 2 - 10, PAD / 2 + 1, PT - 0.8, PT + 1)           # front arrow notch
pad = pad - cyl(0, PAD / 2 - 14, PT - 0.8, PT + 1, 6, 3)                      # arrow head (triangle)
pad = pad - box(-4, 4, -PAD / 2 - 1, -PAD / 2 + 12, -1, PT + 1)               # charge cable notch at the back
finish(pad, 'flymo-f4-pad', OUT, 'Flying Mosquito <span>launch pad</span>, Rev A',
       specs=[('Size', f'{PAD:g} x {PAD:g} mm'), ('Feet', '4 cone cups'), ('Arrow', 'points at the MS-2000'), ('Print', 'flat, no supports')],
       dims=[dim([-PAD / 2, -PAD / 2, 0], [PAD / 2, -PAD / 2, 0], [0, -10, 0], f'{PAD:g}', 'square'),
             dim([-FOOT, FOOT, PT + 3], [FOOT, FOOT, PT + 3], [0, 8, 0], f'{2 * FOOT:.1f}', 'foot to foot')],
       hint='Glue the flight pattern paper on top between the cups. The arrow points at the turret.')

# ---------------- control box ----------------
BX, BY, BH = 150.0, 100.0, 48.0          # outside; y = 0 is the front
W, TOP, FL = 2.2, 2.4, 2.4
IN_Z1 = BH - TOP
shell = box(-BX / 2, BX / 2, 0, BY, FL, BH) - box(-BX / 2 + W, BX / 2 - W, W, BY - W, FL - 1, IN_Z1)
# corner bosses (M2 self-tap from under the floor plate)
BOSS = [(sx * (BX / 2 - W - 3.5), y) for sx in (-1, 1) for y in (W + 3.5, BY - W - 3.5)]
for x, y in BOSS:
    shell = shell + cyl(x, y, FL, IN_Z1 + 0.01, 7.0, 32) - cyl(x, y, FL - 1, FL + 12, 1.8, 16)
# micro:bit window + snap hooks
MBX, MBY = -35.0, 36.0
mw, mh = V('microbit', 'w'), V('microbit', 'h')
shell = shell - box(MBX - 23, MBX + 23, MBY - 17, MBY + 17, IN_Z1 - 1, BH + 1)
for sx in (-1, 1):
    for sy in (-1, 1):
        hx, hy = MBX + sx * (mw / 2 - 6), MBY + sy * (mh / 2 + 1.0)
        hook = box(hx - 2, hx + 2, hy - 1, hy + 1, IN_Z1 - 1.6 - 0.3 - 1.2, IN_Z1 + 0.01)
        lip = box(hx - 2, hx + 2, hy - sy * 1.0 - 1, hy - sy * 1.0 + 1, IN_Z1 - 1.6 - 0.3 - 1.2, IN_Z1 - 1.6 - 0.3)
        shell = shell + hook + lip
# GO button
BTX, BTY = 42.0, 34.0
shell = shell - cyl(BTX, BTY, IN_Z1 - 1, BH + 1, V('button', 'hole'), 96)
# right wall: USB-C charge port (Adafruit 6069, 14 mm hole); left wall: power switch slot
shell = shell - M.cylinder(W + 2, 7.0, 7.0, 48).rotate([0, 90, 0]).translate([BX / 2 - W - 1, 74, 16])
shell = shell - box(-BX / 2 - 1, -BX / 2 + W + 1, 58, 80, 12, 24)
# name plate recess on the front
shell = shell - box(-40, 40, -1, 0.6, 14, 30)

floor = box(-BX / 2 + W + 0.2, BX / 2 - W - 0.2, W + 0.2, BY - W - 0.2, 0, FL)
for x, y in BOSS:
    floor = floor - cyl(x, y, -1, FL + 1, 2.3, 16) - cyl(x, y, -1, 1.2, 4.2, 16)
# Pi Zero 2 W posts, front left
pl, pw = V('pi', 'l'), V('pi', 'w')
PX0, PY0 = -BX / 2 + W + 6, W + 8
for hx in (3.5, 3.5 + V('pi', 'hole_dx')):
    for hy in (3.5, 3.5 + V('pi', 'hole_dy')):
        floor = floor + cyl(PX0 + hx, PY0 + hy, FL - 0.01, FL + 5, 5.0, 24) - cyl(PX0 + hx, PY0 + hy, FL, FL + 6, 2.2, 16)
# power bank cradle at the back (ports toward the right wall)
bl, bw = V('bank', 'l'), V('bank', 'w')
BK0 = BY - W - 1 - bw
for yy in (BK0 - 2.4, BK0 + bw):
    floor = floor + box(-bl / 2, bl / 2, yy, yy + 2.4, FL - 0.01, FL + 8)
floor = floor + box(-bl / 2 - 2.4, -bl / 2, BK0, BK0 + bw, FL - 0.01, FL + 8)
# check: nothing in the box hits anything
pi = box(PX0, PX0 + pl, PY0, PY0 + pw, FL + 5, FL + 5 + 1.6 + V('pi', 'h'))
bank = box(-bl / 2, bl / 2, BK0, BK0 + bw, FL, FL + V('bank', 'h'))
mb = box(MBX - mw / 2, MBX + mw / 2, MBY - mh / 2, MBY + mh / 2, IN_Z1 - 1.6 - 6, IN_Z1)
btn = cyl(BTX, BTY, IN_Z1 - 26, IN_Z1, 30, 32)
probs = [(a, b) for (a, x), (b, y) in [(('pi', pi), ('bank', bank)), (('pi', pi), ('microbit', mb)), (('bank', bank), ('button', btn)),
                                       (('pi', pi), ('shell', shell)), (('bank', bank), ('shell', shell)), (('microbit', mb), ('button', btn))]
         if (x ^ y).volume() > 0.5]
print('BOX FIT', probs or 'clear')
finish(shell, 'flymo-f5-box', OUT, 'Flying Mosquito <span>control box</span>, Rev A',
       specs=[('Size', f'{BX:g} x {BY:g} x {BH:g} mm'), ('Top', 'micro:bit window + GO button'), ('Inside', 'Pi Zero 2 W, power bank'), ('Print', 'top down, no supports')],
       dims=[dim([-BX / 2, 0, BH], [BX / 2, 0, BH], [0, -10, 0], f'{BX:g}', 'wide'),
             dim([BX / 2, 0, 0], [BX / 2, BY, 0], [10, 0, 0], f'{BY:g}', 'deep')],
       hint='The micro:bit snaps in face up under the window. The GO button screws into the round hole.')
finish(floor, 'flymo-f5-floor', OUT, 'Flying Mosquito <span>box floor</span>, Rev A',
       specs=[('Holds', 'Pi Zero 2 W posts, bank cradle'), ('Screws', '4 x M2 into the corner posts'), ('Thick', f'{FL:g} mm'), ('Print', 'flat, no supports')],
       dims=[dim([-BX / 2 + W, 0, 0], [BX / 2 - W, 0, 0], [0, -8, 0], f'{BX - 2 * W - 0.4:.1f}', 'wide')],
       hint='Pi on the four posts at the front left, power bank in the cradle at the back with its ports toward the right wall.')

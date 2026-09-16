"""P7 pendulum rig and backdrop hardware, Rev A (all modeled in print orientation).

P7a pivot + protractor: clamps on the end of a 1/4 in dowel that sticks out from the top of the
backdrop toward the turret. The fishing line loops over the peg, so the stuffed mosquito swings side to
side in front of the plate. Rim notches mark 0, 10, 20, 30 degrees each way; the round holes next to a
notch count the tens (1, 2, 3). Hold the line on a mark, let go.
P7b backdrop clip: pushes onto the top edge of the foam board and holds the dowel square to it.
P7c backdrop foot (print 2): holds the foam board upright.
Run: python parts/p7_pendulum.py OUT_DIR
"""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
from cadkit import box, cyl, prism_xy, prism_yz, prism_xz, union, dim, finish, M
from components import HARDWARE

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
M2C, M2T = HARDWARE['m2_clear']['v'], HARDWARE['m2_tap']['v']
DOWEL = 6.35 + 0.35            # 1/4 in dowel, slip fit
BOARD = 5.0                    # foam board thickness (3/16 in is 4.8)
PT = 2.5                       # protractor plate thickness
R_OUT, R_RIM, A_MAX = 95.0, 72.0, 38.0


def sector(r0, r1, a0, a1, z0, z1, n=48):
    """angles in degrees from straight down, positive to the right (+x)."""
    pts = [(r1 * math.sin(math.radians(a)), -r1 * math.cos(math.radians(a))) for a in np.linspace(a0, a1, n)]
    pts += [(r0 * math.sin(math.radians(a)), -r0 * math.cos(math.radians(a))) for a in np.linspace(a1, a0, n)]
    return prism_xy(pts, z0, z1)


# ---------------- P7a pivot + protractor ----------------
RING_Y = 18.0
arc = sector(6.0, R_OUT, -A_MAX, A_MAX, 0, PT, 64)
arc = arc - sector(14.0, R_RIM, -A_MAX + 7, A_MAX - 7, -1, PT + 1, 48)     # window, leaves two spokes and the rim
hub = union([cyl(0, 0, 0, PT, 16.0), box(-8, 8, 0, RING_Y, 0, PT)])
ring = cyl(0, RING_Y, 0, 12.0, 15.0)
lugs = box(-5.0, 5.0, RING_Y + 4.0, RING_Y + 13.0, 0, 12.0)
peg = union([cyl(0, 0, PT - 0.01, PT + 6.0, 4.0),
             M.cylinder(1.5, 2.0, 3.5, 32).translate([0, 0, PT + 6.0]),        # 45 deg flare keeps the loop on
             cyl(0, 0, PT + 7.5, PT + 8.5, 7.0)])
pivot = union([arc, hub, ring, lugs, peg])
pivot = pivot - cyl(0, RING_Y, -1, 13, DOWEL)
pivot = pivot - box(-0.8, 0.8, RING_Y, RING_Y + 14, -1, 13)                  # clamp slit
pivot = pivot - M.cylinder(12, M2C / 2, M2C / 2, 16).rotate([0, 90, 0]).translate([-6, RING_Y + 9.5, 6.0])
pivot = pivot - M.cylinder(3, 2.2, 2.2, 6).rotate([0, 90, 0]).translate([3.4, RING_Y + 9.5, 6.0])   # nut side
# marks: notch at the rim edge, count holes inside the rim
for a in range(-30, 31, 10):
    ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
    depth = 9.0 if a == 0 else 6.0
    notch = box(-0.9, 0.9, -R_OUT - 1, -R_OUT + depth, -1, PT + 1).rotate([0, 0, a])
    pivot = pivot - notch
    for k in range(abs(a) // 10):
        r = R_OUT - 11.0 - k * 4.2
        pivot = pivot - cyl(r * sa, -r * ca, -1, PT + 1, 2.6, 16)
print('P7a pivot', [round(q, 1) for q in pivot.bounding_box()])

# ---------------- P7b backdrop clip ----------------
CL = 30.0                     # along the board edge
W = 3.0
clip = union([box(-BOARD / 2 - W, -BOARD / 2, 0, 22, 0, CL), box(BOARD / 2, BOARD / 2 + W, 0, 22, 0, CL),
              box(-BOARD / 2 - W, BOARD / 2 + W, 22, 26, 0, CL),
              box(-20, 20, 26, 26 + 12, 0, CL)])                               # dowel block on top
# grip ridges inside the slot (board squeezes past them)
for yy in (6.0, 14.0):
    for s in (-1, 1):
        clip = clip + prism_xy([(s * BOARD / 2, yy - 1.2), (s * (BOARD / 2 - 0.35), yy), (s * BOARD / 2, yy + 1.2)], 0, CL)
clip = clip - M.cylinder(40, DOWEL / 2, DOWEL / 2, 32).rotate([0, 90, 0]).translate([-20, 32.0, CL / 2])
print('P7b clip', [round(q, 1) for q in clip.bounding_box()])

# ---------------- P7c backdrop foot ----------------
FL, FW = 130.0, 32.0
foot = union([box(-FL / 2, FL / 2, 0, FW, 0, 4.0),
              box(-BOARD / 2 - 5, BOARD / 2 + 5, 0, FW, 4.0 - 0.01, 22.0)])
for s in (-1, 1):                                                               # 45 deg gussets
    foot = foot + prism_xz([(s * (BOARD / 2 + 5), 4.0), (s * (BOARD / 2 + 17), 4.0), (s * (BOARD / 2 + 5), 16.0)], 0, FW)
foot = foot - box(-BOARD / 2, BOARD / 2, -1, FW + 1, 4.0, 23.0)
for s in (-1, 1):
    foot = foot + prism_xz([(s * BOARD / 2, 12.0), (s * (BOARD / 2 - 0.35), 14.0), (s * BOARD / 2, 16.0)], 0, FW)
print('P7c foot', [round(q, 1) for q in foot.bounding_box()])

for n, s in (('pivot', pivot), ('clip', clip), ('foot', foot)):
    assert s.volume() > 100, n

finish(pivot, 'ms2000-p7-pendulum-pivot', OUT, 'MS-2000 <span>pendulum pivot</span>, Rev A',
       specs=[('Size', f'{2 * R_OUT * math.sin(math.radians(A_MAX)):.0f} × {R_OUT + RING_Y + 13:.0f} × {PT + 8.5:g}'),
              ('Marks', '0, 10, 20, 30 each way'), ('Dowel', '1/4 in, M2 pinch'), ('Print', 'flat, no supports')],
       dims=[dim([0, 0, PT], [0, -R_OUT, PT], [-20, 0, 0], f'{R_OUT:g}', 'peg to rim'),
             dim([-R_OUT * math.sin(math.radians(30)), -R_OUT * math.cos(math.radians(30)), 0],
                 [R_OUT * math.sin(math.radians(30)), -R_OUT * math.cos(math.radians(30)), 0], [0, -14, 0], '30° to 30°', ''),
             dim([-7.5, RING_Y, 12], [7.5, RING_Y, 12], [0, 12, 0], '1/4 in', 'dowel')],
       hint='Loop the line over the peg. Count the holes: one = 10°, two = 20°, three = 30°. Hold the line on the notch and let go.')
finish(clip, 'ms2000-p7-backdrop-clip', OUT, 'MS-2000 <span>backdrop clip</span>, Rev A',
       specs=[('Board', f'{BOARD:g} mm foam board'), ('Dowel', '1/4 in, square to the board'), ('Length', f'{CL:g}'), ('Print', 'on its end, no supports')],
       dims=[dim([-BOARD / 2, 0, CL], [BOARD / 2, 0, CL], [0, -8, 0], f'{BOARD:g}', 'slot'),
             dim([20, 0, 0], [20, 38, 0], [10, 0, 0], '38', 'tall'),
             dim([-20, 38, CL], [20, 38, CL], [0, 8, 0], '40', 'dowel length held')],
       hint='Push onto the top edge of the backdrop. The dowel goes straight out toward the turret; the pivot clamps near its end.')
finish(foot, 'ms2000-p7-backdrop-foot', OUT, 'MS-2000 <span>backdrop foot</span>, Rev A',
       specs=[('Print', '2 of them'), ('Board', f'{BOARD:g} mm slot'), ('Size', f'{FL:g} × {FW:g} × 22'), ('Supports', 'none')],
       dims=[dim([-FL / 2, 0, 0], [FL / 2, 0, 0], [0, -10, 0], f'{FL:g}', 'long'),
             dim([-BOARD / 2, FW, 22], [BOARD / 2, FW, 22], [0, 8, 4], f'{BOARD:g}', 'slot')],
       hint='One foot near each end of the backdrop. The ridges in the slot grip the board.')

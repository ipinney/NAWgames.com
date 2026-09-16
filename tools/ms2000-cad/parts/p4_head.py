"""P4 camera + laser head, Rev A.

Head frame: origin on the tilt axis; x along the axis (right), y back, z up. Nose points -y.
HuskyLens stands up facing forward (lens -y, screen toward the back so it can be read from behind),
bolted through its tab with two M3 screws into nut traps. The laser sits under it in a split
plastic clamp aimed the same way, on the lens's x line (about 45 mm below the lens).
Right cheek: pocket for the tilt servo horn (arm up). Left cheek: boss with the pivot pin socket,
nut trap for the pin screw (M2 x 12), and the stop finger.

Assembly: head onto the yoke, horn screw from inside (stubby driver), pivot pin + screw,
laser into the clamp and pinch the M2 screw, HuskyLens last.
Prints standing on its bottom (z = -30), no supports.
Run: python parts/p4_head.py OUT_DIR
"""
import os, sys, math, pickle
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
import manifold3d as m
from cadkit import box, cyl, prism_xy, prism_yz, prism_xz, union, dim, finish, M, CS
from components import V, GHOSTS, HARDWARE, arrays
import layout as L

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
p2 = pickle.load(open(os.path.join(OUT, 'p2_parts.pkl'), 'rb'))
C, XI, XO, TZ, Z0, SHANK = p2['C'], p2['XI'], p2['XO'], p2['TZ'], p2['Z0'], p2['SHANK']
M2C, M2T = HARDWARE['m2_clear']['v'], HARDWARE['m2_tap']['v']
M3C = HARDWARE['m3_clear']['v']
NUT2, NUT3 = HARDWARE['m2_nut_af']['v'] + 0.3, HARDWARE['m3_nut_af']['v'] + 0.3

ZB, YF, YB = -30.0, -14.0, 8.0        # envelope agreed with P2
YS = 6.0                              # HuskyLens screen face (back)
ZTOP = 25.0                           # HuskyLens top edge
CW = 4.0                              # cheek thickness
CI = C - CW                           # cheek inner face
LZ = -25.0                            # laser axis height
LD = V('laser', 'd') + 0.3            # clamp bore
BOSS_END = -(XI - 0.5)
SOCK = 3.5
CONVERGE = 1524.0                     # laser crosses the camera line at 5 ft (middle test distance)


def xf(s, rows):
    return s.transform(np.array(rows, dtype=float))


HX = [[-1, 0, 0, 0], [0, 0, -1, YS], [0, -1, 0, ZTOP]]      # husky frame -> head frame
hz = lambda yh: ZTOP - yh
hy = lambda zh: YS - zh
LENS_X = -(-0.4)
TAB_HOLE_Z = hz(40.2)
PCB_BACK_Y = hy(3.5)

# ---------------- HuskyLens envelope (for checks) ----------------
husky_env = union([box(-26.3, 26.3, 0, 36.2, 3.5, 5.1), box(-11, 11, 36.2, 44.5, 3.5, 5.1),
                   box(-25.8, 25.8, 0, 36.1, 0, 3.5), box(-26.0, 26.0, -3.1, 36.0, 5.1, 12.3)])
husky = xf(husky_env, HX)

# ---------------- frame ----------------
parts = []
# cheeks
cheek_y0, cheek_y1, cheek_z1 = -10.0, 6.0, 31.5
parts.append(box(CI, C, cheek_y0, cheek_y1, ZB, cheek_z1))
parts.append(box(-C, -CI, cheek_y0, cheek_y1, ZB, cheek_z1))
# top bar above the HuskyLens, behind its front parts (makes the head a closed frame)
parts.append(box(-C, C, 1.2, cheek_y1, 29.0, cheek_z1))
# floor
parts.append(box(-C, C, -4.0, YB, ZB, ZB + 3.0))
# laser clamp block with a pinch lug on the +x side
lb0, lb1 = YF, YB
parts.append(box(LENS_X - LD / 2 - 1.5, LENS_X + LD / 2 + 5.5, lb0, lb1, ZB, LZ + LD / 2 + 1.5))
# tab plate behind the HuskyLens tab, tied into the clamp block
PL_Z0, PL_Z1 = LZ + LD / 2 + 1.0, hz(36.1) - 0.5
parts.append(box(-12.0, 12.0, PCB_BACK_Y + 0.1, PCB_BACK_Y + 4.5, PL_Z0 - 0.5, PL_Z1))
# braces from the plate to each cheek, low and behind the screen area
for s in (-1, 1):
    parts.append(box(min(s * 11.5, s * CI), max(s * 11.5, s * CI), PCB_BACK_Y + 0.1, YB, ZB, PL_Z0 + 1.0))
# left boss + stop finger (+ 45 deg gusset under it)
boss = M.cylinder(-BOSS_END - CI, 5.0, 5.0, 40).rotate([0, -90, 0]).translate([-CI, 0, 0])
parts.append(boss)
fa = L.FINGER_HALF
fr0, fr1 = 6.5, 10.0
fpts = [(fr1 * math.sin(math.radians(a)), -fr1 * math.cos(math.radians(a))) for a in np.linspace(-fa, fa, 8)] + \
       [(fr0 * math.sin(math.radians(a)), -fr0 * math.cos(math.radians(a))) for a in np.linspace(fa, -fa, 8)]
parts.append(prism_yz(fpts, BOSS_END, -C + 0.01))
g = [(BOSS_END, -fr1 + 0.5), (-C + 0.01, -fr1 + 0.5), (-C + 0.01, -fr1 - (C - (-BOSS_END)) - 0.5)]
parts.append(prism_xz(g, -1.3, 1.3))
frame = union(parts)

# ---------------- cuts ----------------
cuts = []
# HuskyLens clearance (0.4 all round) so nothing presses on the board
cuts.append(xf(union([box(-26.7, 26.7, -0.4, 36.6, 0, 5.5), box(-26.4, 26.4, -3.5, 36.4, 5.1, 13.0),
                      box(-26.2, 26.2, -0.4, 36.5, -0.4, 3.6)]), HX))
# tab screws M3 + nut traps on the back of the plate
for hx_ in (-7.5, 7.5):
    cuts.append(M.cylinder(20, M3C / 2, M3C / 2, 24).rotate([-90, 0, 0]).translate([hx_, PCB_BACK_Y - 1, TAB_HOLE_Z]))
    nut = M.cylinder(3.0, NUT3 / math.sqrt(3), NUT3 / math.sqrt(3), 6).rotate([0, 0, 30]).rotate([-90, 0, 0])
    cuts.append(nut.translate([hx_, PCB_BACK_Y + 4.5 - 2.6, TAB_HOLE_Z]))
# laser bore, pinch slit and pinch screw (screw never touches the laser case)
TOE = math.degrees(math.atan((ZTOP - 12.1 - LZ) / CONVERGE))
LCY = (lb0 + lb1) / 2
def toe(s):
    return s.translate([0, -LCY, -LZ]).rotate([-TOE, 0, 0]).translate([0, LCY, LZ])
cuts.append(toe(M.cylinder(lb1 - lb0 + 2, LD / 2, LD / 2, 48).rotate([-90, 0, 0]).translate([LENS_X, lb0 - 1, LZ])))
cuts.append(box(LENS_X, LENS_X + LD / 2 + 6, lb0 - 1, lb0 + 12, LZ - 0.4, LZ + 0.4))
PX = LENS_X + LD / 2 + 2.7
cuts.append(cyl(PX, lb0 + 6, ZB - 1, LZ, M2C))
cuts.append(cyl(PX, lb0 + 6, LZ, LZ + LD / 2 + 1.4, M2T))
cuts.append(cyl(PX, lb0 + 6, ZB - 1, ZB + 1.2, 4.2))
# right cheek: horn pocket (arm up) + horn screw access
def horn_pocket(depth):
    hd = V('servo', 'horn_hub_d') + 0.6; al = V('servo', 'horn_arm_len')
    arm = prism_xy([(0, -hd / 2), (al + 0.5, -2.4), (al + 2.6, 0), (al + 0.5, 2.4), (0, hd / 2)], -1, depth)
    return union([cyl(0, 0, -1, depth, hd), arm])
cuts.append(xf(horn_pocket(L.POCKET), [[0, 0, -1, C], [0, 1, 0, 0], [1, 0, 0, 0]]))
cuts.append(M.cylinder(CW + 2, 2.75, 2.75, 24).rotate([0, 90, 0]).translate([CI - 1, 0, 0]))
# left boss: pin socket, M2 clearance, nut trap open to the inside
PIN_D = 5.9
cuts.append(M.cylinder(SOCK + 0.5, (PIN_D + 0.2) / 2, (PIN_D + 0.2) / 2, 32).rotate([0, 90, 0]).translate([BOSS_END - 0.5, 0, 0]))
cuts.append(M.cylinder(C + 2, M2C / 2, M2C / 2, 16).rotate([0, 90, 0]).translate([BOSS_END - 1, 0, 0]))
NUT_X0 = BOSS_END + SOCK + 1.0
nut2 = M.cylinder(-CI - NUT_X0 + 1, NUT2 / math.sqrt(3), NUT2 / math.sqrt(3), 6).rotate([0, 90, 0])
cuts.append(nut2.translate([NUT_X0, 0, 0]))
head = frame
for c in cuts:
    head = head - c

# ---------------- ghosts, checks ----------------
lg, _ = GHOSTS['laser']()
laser = toe(lg.rotate([0, 0, 180]).translate([LENS_X, lb0 + V('laser', 'len'), LZ - V('laser', 'd') / 2]))
hv = head.volume(); assert hv > 1000

problems = []
for n, g_ in (('HuskyLens', husky), ('laser', laser)):
    v = (g_ ^ head).volume()
    if v > 0.5: problems.append((n, 'head', round(v, 1)))
# the laser beam: a thin rod in front of the laser must hit nothing
beam = toe(M.cylinder(200, 0.6, 0.6, 12).rotate([90, 0, 0]).translate([LENS_X, lb0 - 0.5, LZ]))
if (beam ^ (head + husky)).volume() > 0.01: problems.append(('beam', 'blocked', 1))
# the full head must stay inside the envelope P2 was checked with
env = box(-C, C, -14.0, 8.0, -30.0, 32.0) + M.cylinder(-BOSS_END - C, 5.0, 5.0, 32).rotate([0, -90, 0]).translate([-C, 0, 0])
fing = prism_yz(fpts, BOSS_END, -C)
outside = (head + husky + laser) - env - fing
extra = outside.volume()
# the finger gusset is outside the P2 envelope: check it against the yoke directly
yv, yf = p2['yoke']
yoke = M(m.Mesh(vert_properties=yv.astype(np.float32), tri_verts=yf.astype(np.uint32)))
gp2 = pickle.load(open(os.path.join(OUT, 'p2_ghosts.pkl'), 'rb'))
tv, tf = gp2['tilt_servo']
tservo = M(m.Mesh(vert_properties=tv.astype(np.float32), tri_verts=tf.astype(np.uint32)))
whole = head + husky + laser
stops_hit = {}
for t in range(-int(L.TILT_DOWN) - 5, int(L.TILT_UP) + 6, 5):
    w = whole.rotate([-t, 0, 0]).translate([0, 0, TZ])
    vy = (w ^ yoke).volume()
    vs = (w ^ tservo).volume()
    inside = -L.TILT_DOWN <= t <= L.TILT_UP
    if inside and (vy > 0.5 or vs > 0.5):
        problems.append((f'head at {t}', 'yoke' if vy > 0.5 else 'tilt servo', round(max(vy, vs), 1)))
    if not inside:
        stops_hit[t] = vy > 0.5
print('outside P2 envelope (mm3):', round(extra, 1))
print('stops past the limits:', stops_hit)
print('FIT', problems or 'clear')
print(f'laser toe-in {TOE:.2f} deg; beam height vs camera line at 3/5/7 ft:', [round(-(hz(12.1) - LZ) + d * math.tan(math.radians(TOE)), 1) for d in (914, 1524, 2134)])
print(f'lens y {hy(12.3):.1f} z {hz(12.1):.1f}; laser axis z {LZ}, x {LENS_X}; laser below lens {hz(12.1) - LZ:.1f} mm')

arr = lambda s: (np.array(s.to_mesh().vert_properties)[:, :3], np.array(s.to_mesh().tri_verts))
hv_, hf_ = arrays('huskylens')[:2]
hvh = hv_ @ np.array(HX)[:, :3].T + np.array(HX)[:, 3]
pickle.dump({'head': arr(head), 'laser': arr(laser), 'husky_mesh': (hvh, hf_), 'LENS': (LENS_X, hy(12.3), hz(12.1)), 'LZ': LZ},
            open(os.path.join(OUT, 'p4_parts.pkl'), 'wb'))

finish(head, 'ms2000-p4-head', OUT, 'MS-2000 <span>camera + laser head</span>, Rev A',
       specs=[('Size', '61.2 wide'), ('Camera', 'HuskyLens, 2 × M3'), ('Laser', f'{ZTOP - 12.1 - LZ:.0f} below lens, meets it at 5 ft'),
              ('Print', 'on its bottom, no supports')],
       dims=[dim([-C, YF, ZB], [C, YF, ZB], [0, -10, -4], f'{2 * C:g}', 'wide'),
             dim([C, YF, ZB], [C, YB, ZB], [12, 0, 0], f'{YB - YF:g}', 'deep'),
             dim([C, cheek_y1, 0], [C, cheek_y1, ZB], [16, 6, 0], f'{-ZB:g}', 'axis to bottom'),
             dim([LENS_X, YF, LZ], [LENS_X, YF, TAB_HOLE_Z], [-20, -8, 0], f'{TAB_HOLE_Z - LZ:.1f}', 'laser to tab screws'),
             dim([-7.5, PCB_BACK_Y + 4.5, TAB_HOLE_Z], [7.5, PCB_BACK_Y + 4.5, TAB_HOLE_Z], [0, 10, 0], '15', 'M3 tab screws')],
       hint='Left side: pivot pin socket and stop finger. Right side: horn pocket. The laser clamp squeezes with an M2 screw from below; no metal touches the laser.')

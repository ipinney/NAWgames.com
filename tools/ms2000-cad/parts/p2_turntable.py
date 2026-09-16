"""P2 pan turntable + tilt yoke (one print), and P3 tilt pivot pin. Rev A.

Local frame: origin on the pan axis at the underside of the disc; x right, y back, z up.
World = local + (PAN x, PAN y, Z0), with Z0 set by the pan servo horn stack.

The disc carries the pan horn in a pocket underneath (horn screw goes in through the center hole).
Right upright holds the tilt servo (ears on the outside face, shaft pointing in).
Left upright has a bushing for the printed pivot pin, plus the two tilt stop blocks.
A cable arch at the back keeps the head cables tidy on their way to the deck hole.
Prints disc down, no supports (the servo window and bushing are short bridges).
Run: python parts/p2_turntable.py OUT_DIR
"""
import os, sys, math, pickle
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
import manifold3d as m
from cadkit import box, cyl, prism_xy, prism_yz, prism_xz, union, dim, finish, M, CS
from components import V, GHOSTS, HARDWARE
import layout as L

M2C, M2T = HARDWARE['m2_clear']['v'], HARDWARE['m2_tap']['v']
EAR_TOP = V('servo', 'flange_z') + V('servo', 'flange_t')      # 18.8
BOSS_TOP = V('servo', 'body_h') + 2.6                           # 25.8 (matches ghost)
SO = V('servo', 'shaft_x')

# pan stack in world
PAN_BOSS_Z = L.DECK_UNDER - EAR_TOP + BOSS_TOP                  # 71.0
Z0 = PAN_BOSS_Z + L.HUB_LEN                                     # disc underside, world z
UT = 4.0                                                        # upright thickness
C = L.CHEEK_X
BT = C + L.HUB_LEN                                              # tilt servo boss top, x
XI = BT - (UT + EAR_TOP - BOSS_TOP)                             # upright inner face
XO = XI + UT
TZ = L.TILT_Z
Y0, Y1, ZT = -13.0, 24.0, TZ + 10.0                             # upright extent


def horn():
    """Single-arm horn: hub z -HUB_LEN..0 (from boss top), plate z 0..t, arm along +x."""
    t = V('servo', 'horn_t'); hd = V('servo', 'horn_hub_d'); al = V('servo', 'horn_arm_len')
    arm = prism_xy([(0, -hd / 2), (al, -2.0), (al + 2.0, 0), (al, 2.0), (0, hd / 2)], 0, t)
    return union([cyl(0, 0, -L.HUB_LEN, 0, hd), cyl(0, 0, 0, t, hd), arm])


def horn_pocket(depth):
    hd = V('servo', 'horn_hub_d') + 0.6; al = V('servo', 'horn_arm_len')
    arm = prism_xy([(0, -hd / 2), (al + 0.5, -2.4), (al + 2.6, 0), (al + 0.5, 2.4), (0, hd / 2)], -1, depth)
    return union([cyl(0, 0, -1, depth, hd), arm])


def xf(s, rows):
    return s.transform(np.array(rows, dtype=float))


# ---------------- disc ----------------
R = L.TURNTABLE_R - 1.0
disc_outline = [(math.cos(a) * R, math.sin(a) * R) for a in np.linspace(0, 2 * math.pi, 96, endpoint=False)]
disc = prism_xy(disc_outline, 0, L.DISC_T)
pad = prism_xy([(-XO + 3, Y0), (XO - 3, Y0), (XO, Y0 + 3), (XO, Y1 - 3), (XO - 3, Y1), (-XO + 3, Y1), (-XO, Y1 - 3), (-XO, Y0 + 3)], 0, L.DISC_T)
body = disc + pad
body = body - horn_pocket(L.POCKET).rotate([0, 0, 90])          # pan horn arm points back (+y)
body = body - cyl(0, 0, -1, L.DISC_T + 1, 5.5)                 # horn screw access
for r in (10.0, 14.0):                                          # small horn screw pilots (check on arrival)
    body = body - cyl(0, r, L.POCKET - 0.5, L.DISC_T + 1, 1.2, 12)

# ---------------- uprights ----------------
parts = [body]
right = box(XI, XO, Y0, Y1, L.DISC_T - 0.01, ZT)
left = box(-XO, -XI, Y0, Y1, L.DISC_T - 0.01, ZT)
# servo window + ear pilots (body centre sits SO behind the tilt axis)
bw, bd = V('servo', 'body_w') + 0.6, V('servo', 'body_d') + 0.6
right = right - box(XI - 1, XO + 1, SO - bw / 2, SO + bw / 2, TZ - bd / 2, TZ + bd / 2)
for e in (-1, 1):
    ey = SO + e * V('servo', 'hole_pitch') / 2
    right = right - M.cylinder(UT + 2, M2T / 2, M2T / 2, 16).rotate([0, 90, 0]).translate([XI - 1, ey, TZ])
# bushing for the pivot pin
PIN_D = 5.9
left = left - M.cylinder(UT + 2, (PIN_D + 0.4) / 2, (PIN_D + 0.4) / 2, 32).rotate([0, 90, 0]).translate([-XO - 1, 0, TZ])
parts += [right, left]
# tilt stop blocks: annular sectors on the left upright's inner face
def sector(a0, a1, r0, r1, x0, x1):
    """angles measured from straight down (-z), positive toward the back (+y)."""
    pts = []
    for a in np.linspace(a0, a1, 12):
        pts.append((r1 * math.sin(math.radians(a)), TZ - r1 * math.cos(math.radians(a))))
    for a in np.linspace(a1, a0, 12):
        pts.append((r0 * math.sin(math.radians(a)), TZ - r0 * math.cos(math.radians(a))))
    return prism_yz(pts, x0, x1)

SR0, SR1 = 6.0, 10.5
up_edge = L.TILT_UP + L.FINGER_HALF      # nose up moves the finger toward the front (-y)
dn_edge = L.TILT_DOWN + L.FINGER_HALF
stops = [sector(-(up_edge + 30), -up_edge, SR0, SR1, -XI - 0.01, -XI + 2.5),
         sector(dn_edge, dn_edge + 30, SR0, SR1, -XI - 0.01, -XI + 2.5)]
parts += stops
# gussets outside each upright, clear of the tilt servo
G = 16.0
for s in (-1, 1):
    tri = [(s * (XO - 0.5), 0), (s * (XO + G * 0.6), 0), (s * (XO + G * 0.6), L.DISC_T), (s * (XO - 0.5), L.DISC_T + G)]
    for (ya, yb) in ((Y0 + 1, Y0 + 3.4), (Y1 - 3.4, Y1 - 1)):
        parts.append(prism_xz(tri, ya, yb))
# cable arch at the back
parts.append(box(-7, 7, 18.0, 22.0, L.DISC_T + 7, L.DISC_T + 9))
parts.append(box(-9, -7, 18.0, 22.0, L.DISC_T - 0.01, L.DISC_T + 9))
parts.append(box(7, 9, 18.0, 22.0, L.DISC_T - 0.01, L.DISC_T + 9))
yoke = union(parts)

# ---------------- P3 pivot pin ----------------
SOCK = 3.5
SHANK = UT + 0.5 + SOCK
pin = union([cyl(0, 0, 0, 1.6, 9.0), cyl(0, 0, 1.6, 1.6 + SHANK, PIN_D)])
pin = pin - cyl(0, 0, -1, 1.6 + SHANK + 1, M2C) - cyl(0, 0, -1, 1.0, 4.2)

# ---------------- ghosts and checks ----------------
def vol(s):
    return s.volume()

sg, _ = GHOSTS['servo']()
# tilt servo: ghost z (shaft) -> -x, ghost x -> y, ghost y -> z
tservo = xf(sg, [[0, 0, -1, XI + UT + EAR_TOP], [-1, 0, 0, SO], [0, 1, 0, TZ]])
thorn = xf(horn(), [[0, 0, -1, C], [0, 1, 0, 0], [1, 0, 0, TZ]])
phorn = horn().rotate([0, 0, 90]).translate([0, 0, 0])

def head_env(t_deg, finger=True):
    """Head envelope in local frame at tilt t (nose up positive)."""
    h = box(-C, C, -14.0, 8.0, -30.0, 32.0)
    h = h - M.cylinder(L.POCKET + 1, 4.0, 4.0, 24).rotate([0, 90, 0]).translate([C - L.POCKET, 0, 0])   # horn pocket
    boss = M.cylinder(XI - 0.5 - C, 5.0, 5.0, 32).rotate([0, -90, 0]).translate([-C, 0, 0])
    h = h + boss
    if finger:
        f = sector(-L.FINGER_HALF, L.FINGER_HALF, SR0 + 0.5, SR1 - 0.5, -(XI - 0.5), -C)
        h = h + f.translate([0, 0, -TZ])
    return h.rotate([-t_deg, 0, 0]).translate([0, 0, TZ])

problems = []
for n, g in (('yoke', yoke), ('tilt servo', tservo), ('head', head_env(0)), ('stops', union(stops)), ('pin', pin)):
    assert vol(g) > 1, f'empty solid: {n}'
static = {'tilt servo': tservo}
for n, g in static.items():
    v = vol(g ^ yoke)
    if v > 0.5: problems.append((n, 'yoke', round(v, 1)))
v = vol(tservo ^ head_env(0, False))
if v > 0.5: problems.append(('tilt servo', 'head', round(v, 1)))
# tilt sweep: head body vs yoke over the allowed range, finger vs stops just past the limits
for t in range(-int(L.TILT_DOWN), int(L.TILT_UP) + 1, 5):
    v = vol(head_env(t, False) ^ yoke)
    if v > 0.5: problems.append((f'head at {t}', 'yoke', round(v, 1)))
    v = vol(head_env(t, True) ^ union(stops))
    if v > 0.5: problems.append((f'finger at {t}', 'stop', round(v, 1)))
for t in (L.TILT_UP + 5, -L.TILT_DOWN - 5):
    v = vol(head_env(t, True) ^ union(stops))
    print(f'stop engages at {t:+.0f} deg:', 'yes' if v > 0.5 else 'NO')
# pan sweep against the base shell
base = pickle.load(open(os.path.join(sys.argv[1] if len(sys.argv) > 1 else 'out/parts', 'p1_parts.pkl'), 'rb'))
bv, bf = base['shell']
shell = M(m.Mesh(vert_properties=bv.astype(np.float32), tri_verts=bf.astype(np.uint32)))
gp = pickle.load(open(os.path.join(sys.argv[1] if len(sys.argv) > 1 else 'out/parts', 'p1_ghosts.pkl'), 'rb'))
pv, pf = gp['servo']
pservo = M(m.Mesh(vert_properties=pv.astype(np.float32), tri_verts=pf.astype(np.uint32)))
moving = union([yoke, tservo, head_env(L.TILT_UP, False), head_env(-L.TILT_DOWN, False)])
for a in range(-90, 91, 15):
    w = moving.rotate([0, 0, a]).translate([L.PAN[0], L.PAN[1], Z0])
    for n, g in (('shell', shell), ('pan servo', pservo)):
        v = vol(w ^ g)
        if v > 0.5: problems.append((f'turret at pan {a}', n, round(v, 1)))
print('FIT', problems or 'clear')
bb = moving.bounding_box()
print(f'Z0 {Z0:.1f} tilt axis world z {Z0 + TZ:.1f} XI {XI:.1f} XO {XO:.1f} servo tail x {XI + UT + EAR_TOP:.1f}',
      'moving bbox', [round(q, 1) for q in bb])

out = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
arr = lambda s: (np.array(s.to_mesh().vert_properties)[:, :3], np.array(s.to_mesh().tri_verts))
pickle.dump({'yoke': arr(yoke), 'pin': arr(pin),
             'Z0': Z0, 'TZ': TZ, 'XI': XI, 'XO': XO, 'C': C, 'BT': BT, 'SHANK': SHANK},
            open(os.path.join(out, 'p2_parts.pkl'), 'wb'))
pickle.dump({'tilt_servo': arr(tservo), 'tilt_horn': arr(thorn), 'pan_horn': arr(phorn)},
            open(os.path.join(out, 'p2_ghosts.pkl'), 'wb'))

finish(yoke, 'ms2000-p2-turntable-yoke', out, 'MS-2000 <span>turntable + yoke</span>, Rev A',
       specs=[('Disc', f'{2 * R:g} dia, {L.DISC_T:g} thick'), ('Tilt axis', f'{TZ:g} above disc'),
              ('Head slot', f'{2 * XI:.1f} between uprights'), ('Print', 'disc down, no supports')],
       dims=[dim([-R, -R - 1, 0], [R, -R - 1, 0], [0, -10, 0], f'{2 * R:g}', 'disc'),
             dim([-XO, Y0, ZT], [XO, Y0, ZT], [0, -6, 22], f'{2 * XO:.1f}', 'outside'),
             dim([-XI, Y1, TZ], [XI, Y1, TZ], [0, 10, 0], f'{2 * XI:.1f}', 'inside'),
             dim([XO, Y1, 0], [XO, Y1, TZ], [24, 8, 0], f'{TZ:g}', 'to tilt axis'),
             dim([XO, Y0, 0], [XO, Y1, 0], [14, 0, 0], f'{Y1 - Y0:g}', 'upright')],
       hint='Pan horn presses into the pocket underneath; screw it to the pan servo through the center hole. Tilt servo screws to the right upright from outside.')

finish(pin, 'ms2000-p3-pivot-pin', out, 'MS-2000 <span>pivot pin</span>, Rev A',
       specs=[('Shank', f'{PIN_D:g} dia × {SHANK:g}'), ('Head', '9 dia × 1.6'), ('Screw', 'M2 × 12 into the head boss'), ('Print', 'head down')],
       dims=[dim([-PIN_D / 2, 0, 1.6 + SHANK], [PIN_D / 2, 0, 1.6 + SHANK], [0, 0, 4], f'{PIN_D:g}', 'shank'),
             dim([4.5, 0, 0], [4.5, 0, 1.6 + SHANK], [6, 0, 0], f'{1.6 + SHANK:g}', 'long'),
             dim([-4.5, 0, 0], [4.5, 0, 0], [0, 0, -4], '9', 'head')],
       fit_pad=1.8,
       hint='Goes through the left upright into the head. The M2 screw clamps it to the head; the pin turns in the upright.')

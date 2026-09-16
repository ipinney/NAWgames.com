"""P1 base, Rev B (MOC-004): shell (walls + top deck) and floor plate.

Model frame: x = right, y = back (0 = outside of front wall), z = up (0 = table). mm.
Inside, front to back: Xia mi board on the left with the micro:bit standing up near the front
(its LEDs show through the front window, and it lifts out through the deck slot for coding),
USB-C power bank lying flat on the right, ports forward, in a floor cradle with a strap (MOC-004),
in-line power switch in ribs on the right wall with its rocker through a window (main power),
USB-C charge port in the right wall near the front, pan servo hanging under the deck with its
shaft at deck center, speaker (just left of center) and laser arm switch on the back wall. Cables from the head come down through the hole behind the turntable.

Shell prints deck-down, no supports. Floor plate prints flat. Floor screws up into the corner posts.
Run: python parts/p1_base.py OUT_DIR
"""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
import manifold3d as m
from cadkit import box, cyl, prism_xy, union, dim, finish, M, CS
from components import V, GHOSTS, HARDWARE

P = dict(W=142.0, D=133.0, H=67.0, T=2.0, DECK=3.0, CH=6.0,
         FLOOR=3.0, STANDOFF=5.0, CLR=0.3,
         SHAFT=(0.0, 66.0), TURNTABLE_R=38.0,
         BOARD_X0=-60.0, BOARD_Y0=4.0,
         BANK_X0=14.0, BANK_GAP=0.5,
         PORT=(20.0, 40.0), PSW=(79.0, 30.0),
         CABLE_HOLE=(0.0, 112.0, 14.0),
         WINDOW=24.0, SPK=(-8.0, 40.0), SW=(-36.0, 40.0), POST=7.0)
W, D, H, T, DK = P['W'], P['D'], P['H'], P['T'], P['DECK']
UNDER = H - DK                       # deck underside
FZ = P['FLOOR']
M2C, M2T = HARDWARE['m2_clear']['v'], HARDWARE['m2_tap']['v']


def outline(w, d, ch, y0=0.0):
    x, y1 = w / 2, y0 + d
    return [(-x + ch, y0), (x - ch, y0), (x, y0 + ch), (x, y1 - ch), (x - ch, y1), (-x + ch, y1), (-x, y1 - ch), (-x, y0 + ch)]


def offset_prism(pts, delta, z0, z1):
    cs = CS([pts]).offset(delta, m.JoinType.Miter)
    return M.extrude(cs, z1 - z0).translate([0, 0, z0])


OUT = outline(W, D, P['CH'])
outer = prism_xy(OUT, 0, H)
inner = offset_prism(OUT, -T, -1, UNDER)
shell = outer - inner

# placements of bought parts in the base
bw, bl = V('xiami', 'pcb_w'), V('xiami', 'pcb_l')
BOARD_CX = P['BOARD_X0'] + bw / 2
BOARD_Z = FZ + P['STANDOFF']
xg, xref = GHOSTS['xiami']()
board = xg.translate([BOARD_CX, P['BOARD_Y0'], BOARD_Z])
SOCK_Y = P['BOARD_Y0'] + xref['socket_y']
BIT_TOP = BOARD_Z + xref['top_z']
holes_xy = [(BOARD_CX + x, P['BOARD_Y0'] + y) for x, y in xref['holes']]

# power bank: flat on the floor, back end against the back wall, ports facing front
bkw, bkl, bkh = V('bank', 'w'), V('bank', 'l'), V('bank', 'h')
BK_X0, BK_X1 = P['BANK_X0'], P['BANK_X0'] + bkw
BK_Y1 = D - T - P['BANK_GAP']
BK_Y0 = BK_Y1 - bkl
bg, _ = GHOSTS['bank']()
bank = bg.translate([(BK_X0 + BK_X1) / 2, BK_Y0, FZ])

# charge port: axis +x through the right wall
cpy, cpz = P['PORT']
cg, _ = GHOSTS['charge_port']()
cport = cg.rotate([0, 90, 0]).translate([W / 2 - T, cpy, cpz])

# in-line switch: body along y against the right wall, rocker pointing +x
isl, isw, ish = V('inline_switch', 'l'), V('inline_switch', 'w'), V('inline_switch', 'h')
rkl, rkw, rkh = V('inline_switch', 'rocker_l'), V('inline_switch', 'rocker_w'), V('inline_switch', 'rocker_h')
psy, psz = P['PSW']                       # rocker center y, body bottom z
PS_Y0 = psy - isl / 2
PS_XIN = W / 2 - T - ish                  # body inner face x
isg, _ = GHOSTS['inline_switch']()
pswitch = isg.rotate([0, 90, 0]).translate([W / 2 - T - ish, PS_Y0, psz + isw / 2])

sx, sy = P['SHAFT']
so = V('servo', 'shaft_x')
ear_top = V('servo', 'flange_z') + V('servo', 'flange_t')
sg, sref = GHOSTS['servo']()
servo = sg.translate([sx - so, sy, UNDER - ear_top])

spk_t = V('speaker', 'pcb_t'); spk_h = V('speaker', 'spk_h'); conn = V('speaker', 'conn_h')
kg, _ = GHOSTS['speaker']()
BOSS_L = spk_h + 1.0
# ghost: pcb in xy, cone +z. Rotate so cone faces +y (back wall).
spk = kg.translate([0, -20.0, -(conn + spk_t + spk_h)]).rotate([-90, 0, 0])
spk = spk.translate([P['SPK'][0], D - T - 1.0, P['SPK'][1]])

swg, _ = GHOSTS['arm_switch']()
sw_h = V('arm_switch', 'body_h')
switch = swg.rotate([-90, 0, 0]).translate([P['SW'][0], D - T - sw_h, P['SW'][1]])

# ---------------- shell features ----------------
add, cut = [], []
# deck
add.append(prism_xy(OUT, UNDER, H))
# servo pocket in deck + ear screw holes
bwS, bdS = V('servo', 'body_w') + 0.6, V('servo', 'body_d') + 0.6
cut.append(box(sx - so - bwS / 2, sx - so + bwS / 2, sy - bdS / 2, sy + bdS / 2, UNDER - 1, H + 1))
for e in (-1, 1):
    cut.append(cyl(sx - so + e * V('servo', 'hole_pitch') / 2, sy, UNDER - 1, H + 1, M2C))
# ear locating ribs under the deck
for e in (-1, 1):
    ex = sx - so + e * (V('servo', 'flange_w') / 2 + 1.2)
    add.append(box(ex - 1.2, ex + 1.2, sy - 6, sy + 6, UNDER - 2.5, UNDER))
# cable hole behind turntable
cx, cy, cd = P['CABLE_HOLE']
cut.append(cyl(cx, cy, UNDER - 1, H + 1, cd))
# micro:bit lift-out slot + finger notch
SLOT_HALF = 0.8 + 5.6 + 0.6
cut.append(box(BOARD_CX - 26.8, BOARD_CX + 26.8, SOCK_Y - SLOT_HALF, SOCK_Y + SLOT_HALF, UNDER - 1, H + 1))
cut.append(cyl(BOARD_CX, SOCK_Y, UNDER - 1, H + 1, 22.0))
# turntable ring mark (0.6 mm groove, shows where the head spins)
ring = cyl(sx, sy, H - 0.6, H + 1, 2 * P['TURNTABLE_R'] + 3.0) - cyl(sx, sy, H - 1, H + 2, 2 * P['TURNTABLE_R'] + 1.8)
cut.append(ring)
# front window for the micro:bit LEDs
WZ = BIT_TOP - 21.0
wh = P['WINDOW'] / 2
cut.append(box(BOARD_CX - wh, BOARD_CX + wh, -1, T + 1, WZ - wh, WZ + wh))
# right wall: charge port hole
cut.append(M.cylinder(T + 4, V('charge_port', 'hole_d') / 2, V('charge_port', 'hole_d') / 2, 48).rotate([0, 90, 0]).translate([W / 2 - T - 2, cpy, cpz]))
# right wall: in-line switch window + ribs above/below + end tabs (cord passes beside them)
PSC = psz + isw / 2
cut.append(box(W / 2 - T - 1, W / 2 + 1, psy - (rkl + 2) / 2, psy + (rkl + 2) / 2, PSC - (rkw + 2) / 2, PSC + (rkw + 2) / 2))
RIB = 2.4; C3 = P['CLR']
# top keeper: a 45 degree wedge so it prints without support (shell prints deck-down)
ztop = psz + isw + C3
wedge = CS([[(PS_XIN - 1, ztop), (W / 2 - T + 0.5, ztop), (W / 2 - T + 0.5, ztop + (W / 2 - T + 1.5 - PS_XIN))]])
add.append(M.extrude(wedge, isl + 6).rotate([90, 0, 0]).translate([0, PS_Y0 + isl + 3, 0]))
# the switch sits on a stand that rises from the floor plate (see below)
for y0, y1 in ((PS_Y0 - C3 - RIB, PS_Y0 - C3), (PS_Y0 + isl + C3, PS_Y0 + isl + C3 + RIB)):
    add.append(box(W / 2 - T - 4, W / 2 - T + 0.5, y0, y1, psz - C3 - RIB, psz + isw + C3 + RIB))
# speaker: bosses on the back wall + grille
spx, spz = P['SPK']
hp = V('speaker', 'hole_pitch') / 2
for dx in (-hp, hp):
    for dz in (-hp, hp):
        b = M.cylinder(BOSS_L, 3.0, 3.0, 32).rotate([90, 0, 0]).translate([spx + dx, D - T, spz + dz])
        add.append(b)
        cut.append(M.cylinder(BOSS_L + 3, M2T / 2, M2T / 2, 16).rotate([90, 0, 0]).translate([spx + dx, D - T + 1, spz + dz]))
gr = 12.5
for i in range(-4, 5):
    for j in range(-4, 5):
        gx, gz = i * 3.6 + (1.8 if j % 2 else 0), j * 3.1
        if math.hypot(gx, gz) <= gr:
            cut.append(M.cylinder(T + 2, 1.3, 1.3, 12).rotate([90, 0, 0]).translate([spx + gx, D + 1, spz + gz]))
# arm switch: lever slot through the back wall + locating frame inside
swx, swz = P['SW']
lw, throw = V('arm_switch', 'lever_w'), V('arm_switch', 'lever_throw')
cut.append(box(swx - 1.5 - (lw + throw) / 2 - 0.4, swx - 1.5 + (lw + throw) / 2 + 0.4, D - T - 1, D + 1, swz - 1.4, swz + 1.4))
fw, fh = V('arm_switch', 'body_w') + 0.6, V('arm_switch', 'body_d') + 0.6
frame = box(swx - fw / 2 - 1.2, swx + fw / 2 + 1.2, D - T - 3.0, D - T, swz - fh / 2 - 1.2, swz + fh / 2 + 1.2) \
    - box(swx - fw / 2, swx + fw / 2, D - T - 4, D - T + 0.01, swz - fh / 2, swz + fh / 2)
add.append(frame)
# corner posts (screwed from below through the floor plate)
PI = offset_prism(OUT, -T - P['POST'] / 2, 0, 1)
post_xy = []
ix, iy0, iy1 = W / 2 - T - P['POST'] / 2, T + P['POST'] / 2, D - T - P['POST'] / 2
for px in (-ix, ix):
    for py in (iy0, iy1):
        post_xy.append((px, py))
        add.append(box(px - P['POST'] / 2 - 1, px + P['POST'] / 2 + 1, py - P['POST'] / 2 - 1, py + P['POST'] / 2 + 1, FZ, UNDER) ^ outer)
        cut.append(cyl(px, py, FZ - 1, FZ + 12, M2T))

shell = union([shell] + add)
for c in cut:
    shell = shell - c

# ---------------- floor plate ----------------
plate = offset_prism(OUT, -T - P['CLR'], 0, FZ)
for px, py in post_xy:                       # posts sit on the plate: notch nothing, screw from below
    plate = plate - cyl(px, py, -1, FZ + 1, M2C) - cyl(px, py, -1, 1.6, 4.2)
for hx, hy in holes_xy:                      # board standoffs
    plate = plate + cyl(hx, hy, FZ, BOARD_Z, 6.0)
    plate = plate - cyl(hx, hy, FZ - 1.5, BOARD_Z + 1, M2T)
# bank cradle: side rails, two front corner tabs (ports stay clear), back wall is the back stop
RY0, RY1 = BK_Y0 + 8, BK_Y1 - 16
for x0, x1 in ((BK_X0 - 0.5 - 2.4, BK_X0 - 0.5), (BK_X1 + 0.5, BK_X1 + 0.5 + 2.4)):
    plate = plate + box(x0, x1, RY0, RY1, FZ, FZ + 10)
for x0, x1 in ((BK_X0 - 2.9, BK_X0 + 4), (BK_X1 - 4, BK_X1 + 2.9)):
    plate = plate + box(x0, x1, BK_Y0 - 0.5 - 2.4, BK_Y0 - 0.5, FZ, FZ + 7)
# switch stand: a wall on the floor plate the in-line switch rests on
plate = plate + box(W / 2 - T - ish + 7.2, W / 2 - T - 0.6, PS_Y0 + 1, PS_Y0 + isl - 1, FZ, psz - C3)
# strap slots (20 mm hook-and-loop strap over the bank)
SLOT_Y = BK_Y0 + bkl / 2
for x0 in (BK_X0 - 0.5 - 2.4 - 1.0 - 3.0, BK_X1 + 0.5 + 2.4 + 1.0):
    plate = plate - box(x0, x0 + 3.0, SLOT_Y - 11, SLOT_Y + 11, -1, FZ + 1)
for fx in (-W / 2 + 20, W / 2 - 20):         # stick-on feet
    for fy in (20, D - 20):
        plate = plate - cyl(fx, fy, -1, 1.0, 12.0)

# ---------------- fit check ----------------
def vol(s):
    return s.volume() if hasattr(s, 'volume') else s.get_volume()

ghosts = {'board': board, 'bank': bank, 'cport': cport, 'pswitch': pswitch, 'servo': servo, 'speaker': spk, 'switch': switch}
problems = []
for gname, g in ghosts.items():
    for pname, part in (('shell', shell), ('plate', plate)):
        v = vol(g ^ part)
        if v > 0.5:
            problems.append((gname, pname, round(v, 1)))
# ghost vs ghost
gl = list(ghosts.items())
for i in range(len(gl)):
    for j in range(i + 1, len(gl)):
        v = vol(gl[i][1] ^ gl[j][1])
        if v > 0.5:
            problems.append((gl[i][0], gl[j][0], round(v, 1)))
# swept paths (the bank comes out downward with the floor plate): plugs in front of the bank, micro:bit lifting out, DC plug behind the board
sweeps = {
    'bank plugs': box(BK_X0 + 0.2, BK_X1 - 0.2, T + 0.5, BK_Y0 - 3.0, FZ + 0.2, FZ + bkh),
    'rocker': box(W / 2 - T - 1, W / 2 + 0.5, psy - rkl / 2, psy + rkl / 2, PSC - rkw / 2, PSC + rkw / 2),
    'micro:bit lift': box(BOARD_CX - 25.8, BOARD_CX + 25.8, SOCK_Y - 5.9, SOCK_Y + 4.4, BIT_TOP - 1, H + 5),
    'DC plug': box(xref['dc_jack'][0] + BOARD_CX - 5.5, xref['dc_jack'][0] + BOARD_CX + 5.5, P['BOARD_Y0'] + bl, P['BOARD_Y0'] + bl + 30, BOARD_Z + 1, BOARD_Z + 12),
}
for gname, g in sweeps.items():
    for pname, part in (('shell', shell), ('plate', plate), ('speaker', spk), ('switch', switch), ('servo', servo), ('cport', cport), ('pswitch', pswitch)):
        if (gname, pname) == ('rocker', 'pswitch'):
            continue
        v = vol(g ^ part)
        if v > 0.5:
            problems.append((gname, pname, round(v, 1)))
print('FIT', problems or 'clear')
print('micro:bit top', round(BIT_TOP, 1), 'deck underside', UNDER, 'servo bottom', round(UNDER - ear_top, 1),
      'bank', (round(BK_X0, 1), round(BK_X1, 1), round(BK_Y0, 1), round(BK_Y1, 1), FZ + bkh), 'plug room', round(BK_Y0 - T, 1), 'socket y', round(SOCK_Y, 1), 'turntable front edge', sy - P['TURNTABLE_R'])

out = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
os.makedirs(out, exist_ok=True)
import pickle
pickle.dump({k: (np.array(g.to_mesh().vert_properties)[:, :3], np.array(g.to_mesh().tri_verts)) for k, g in ghosts.items()},
            open(os.path.join(out, 'p1_ghosts.pkl'), 'wb'))
pickle.dump({k: (np.array(g.to_mesh().vert_properties)[:, :3], np.array(g.to_mesh().tri_verts)) for k, g in (('shell', shell), ('plate', plate))},
            open(os.path.join(out, 'p1_parts.pkl'), 'wb'))

finish(shell, 'ms2000-p1-base-shell', out, 'MS-2000 <span>base shell</span>, Rev B',
       specs=[('Outside', f'{W:g} × {D:g} × {H:g}'), ('Walls / deck', f'{T:g} / {DK:g} mm'),
              ('Pan shaft', f'center, {sy:g} from front'), ('Print', 'deck down, no supports')],
       dims=[dim([-W/2, -1, 0], [W/2, -1, 0], [0, -14, 0], f'{W:g}', 'wide'),
             dim([W/2, 0, 0], [W/2, D, 0], [14, 0, 0], f'{D:g}', 'deep'),
             dim([-W/2, D, 0], [-W/2, D, H], [-12, 6, 0], f'{H:g}', 'tall'),
             dim([sx, 0, H], [sx, sy, H], [-50, 0, 10], f'{sy:g}', 'to pan shaft'),
             dim([W/2, 0, cpz], [W/2, cpy, cpz], [10, 0, 0], f"{cpy:g}", 'to charge port'),
             dim([W/2, psy, 0], [W/2, psy, PSC], [10, 0, 0], f"{PSC:g}", 'to switch'),
             dim([BOARD_CX - 26.8, SOCK_Y, H], [BOARD_CX + 26.8, SOCK_Y, H], [0, -10, 8], '53.6', 'micro:bit slot')],
       hint='Front window shows the micro:bit LEDs. Pull the micro:bit up through the slot to code it. Right wall: USB-C charge port (front) and the main power switch window.')

finish(plate, 'ms2000-p1-floor-plate', out, 'MS-2000 <span>floor plate</span>, Rev B',
       specs=[('Size', f'{W - 2*T - 2*P["CLR"]:g} × {D - 2*T - 2*P["CLR"]:g} × {FZ:g}'), ('Board posts', f'{P["STANDOFF"]:g} mm, M2'),
              ('Screws', '4 × M2 up into the shell'), ('Print', 'flat, no supports')],
       dims=[dim([-W/2 + T, -1, 0], [W/2 - T, -1, 0], [0, -12, 0], f'{W - 2*T - 2*P["CLR"]:.1f}', 'wide'),
             dim([holes_xy[0][0], holes_xy[0][1], BOARD_Z], [holes_xy[2][0], holes_xy[2][1], BOARD_Z], [0, -14, 6],
                 f'{holes_xy[2][0]-holes_xy[0][0]:.1f}', 'board holes'),
             dim([holes_xy[0][0], holes_xy[0][1], BOARD_Z], [holes_xy[1][0], holes_xy[1][1], BOARD_Z], [-14, 0, 6],
                 f'{holes_xy[1][1]-holes_xy[0][1]:.1f}', 'board holes'),
             dim([BK_X0 - 0.5, RY0, FZ + 10], [BK_X1 + 0.5, RY0, FZ + 10], [0, 0, 12],
                 f'{bkw + 1:.1f}', 'bank cradle')],
       hint='Xia mi screws onto the four posts, micro:bit end toward the front. Power bank drops between the rails, ports forward; a strap goes through the two slots. Check sizes before printing.')

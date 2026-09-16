"""P1 base, Rev A: shell (walls + top deck) and floor plate.

Model frame: x = right, y = back (0 = outside of front wall), z = up (0 = table). mm.
Inside, front to back: Xia mi board on the left with the micro:bit standing up near the front
(its LEDs show through the front window, and it lifts out through the deck slot for coding),
4xAA pack on the right (slides in through the right-side bay, its switch is the master power),
pan servo hanging under the deck with its shaft at deck center, speaker and laser arm switch on
the back wall. Cables from the head come down through the hole behind the turntable.

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
         PACK_X0=1.0, PACK_Y0=11.5, BAY_Z=24.0,
         CABLE_HOLE=(0.0, 112.0, 14.0),
         WINDOW=24.0, SPK=(36.0, 40.0), SW=(-36.0, 40.0), POST=7.0)
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

pw, pl, ph = V('aa_pack', 'w'), V('aa_pack', 'l'), V('aa_pack', 'h')
pg, _ = GHOSTS['aa_pack']()
pack = pg.translate([P['PACK_X0'] + pw / 2, P['PACK_Y0'], FZ])

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
# right-side battery bay
cut.append(box(W / 2 - T - 1, W / 2 + 1, P['PACK_Y0'] - 0.5, P['PACK_Y0'] + pl + 1.0, -1, P['BAY_Z']))
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
rail_x0, rail_x1 = P['PACK_X0'] - 3.0, W / 2 - T - P['CLR']
plate = plate + box(rail_x0 + 3, ix - P['POST'] / 2 - 2, P['PACK_Y0'] - 2.4, P['PACK_Y0'] - 0.4, FZ, FZ + 4)       # front rail
plate = plate + box(rail_x0 + 3, rail_x1 - 12, P['PACK_Y0'] + pl + 0.4, P['PACK_Y0'] + pl + 2.4, FZ, FZ + 4)  # back rail, gap for the lead
plate = plate + box(rail_x0, rail_x0 + 2.4, P['PACK_Y0'] + 10, P['PACK_Y0'] + pl - 10, FZ, FZ + 10)   # end stop
for fx in (-W / 2 + 20, W / 2 - 20):         # stick-on feet
    for fy in (20, D - 20):
        plate = plate - cyl(fx, fy, -1, 1.0, 12.0)
for k in range(4):                           # lightening slots under the pack
    x0 = P['PACK_X0'] + 8 + k * 14
    plate = plate - box(x0, x0 + 8, P['PACK_Y0'] + 12, P['PACK_Y0'] + pl - 12, -1, FZ + 1)

# ---------------- fit check ----------------
def vol(s):
    return s.volume() if hasattr(s, 'volume') else s.get_volume()

ghosts = {'board': board, 'pack': pack, 'servo': servo, 'speaker': spk, 'switch': switch}
problems = []
for gname, g in ghosts.items():
    for pname, part in (('shell', shell), ('plate', plate)):
        v = vol(g ^ part)
        if v > 0.5:
            problems.append((gname, pname, round(v, 1)))
# swept paths: pack sliding in from the right, micro:bit lifting out, DC plug behind the board
sweeps = {
    'pack path': box(P['PACK_X0'] + 0.2, W / 2 + 5, P['PACK_Y0'] + 0.2, P['PACK_Y0'] + pl - 0.2, FZ + 0.2, FZ + ph),
    'micro:bit lift': box(BOARD_CX - 25.8, BOARD_CX + 25.8, SOCK_Y - 5.9, SOCK_Y + 4.4, BIT_TOP - 1, H + 5),
    'DC plug': box(xref['dc_jack'][0] + BOARD_CX - 5.5, xref['dc_jack'][0] + BOARD_CX + 5.5, P['BOARD_Y0'] + bl, P['BOARD_Y0'] + bl + 30, BOARD_Z + 1, BOARD_Z + 12),
}
for gname, g in sweeps.items():
    for pname, part in (('shell', shell), ('plate', plate), ('speaker', spk), ('switch', switch), ('servo', servo)):
        v = vol(g ^ part)
        if v > 0.5:
            problems.append((gname, pname, round(v, 1)))
print('FIT', problems or 'clear')
print('micro:bit top', round(BIT_TOP, 1), 'deck underside', UNDER, 'servo bottom', round(UNDER - ear_top, 1),
      'pack top', FZ + ph, 'socket y', round(SOCK_Y, 1), 'turntable front edge', sy - P['TURNTABLE_R'])

out = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
os.makedirs(out, exist_ok=True)
import pickle
pickle.dump({k: (np.array(g.to_mesh().vert_properties)[:, :3], np.array(g.to_mesh().tri_verts)) for k, g in ghosts.items()},
            open(os.path.join(out, 'p1_ghosts.pkl'), 'wb'))
pickle.dump({k: (np.array(g.to_mesh().vert_properties)[:, :3], np.array(g.to_mesh().tri_verts)) for k, g in (('shell', shell), ('plate', plate))},
            open(os.path.join(out, 'p1_parts.pkl'), 'wb'))

finish(shell, 'ms2000-p1-base-shell', out, 'MS-2000 <span>base shell</span>, Rev A',
       specs=[('Outside', f'{W:g} × {D:g} × {H:g}'), ('Walls / deck', f'{T:g} / {DK:g} mm'),
              ('Pan shaft', f'center, {sy:g} from front'), ('Print', 'deck down, no supports')],
       dims=[dim([-W/2, -1, 0], [W/2, -1, 0], [0, -14, 0], f'{W:g}', 'wide'),
             dim([W/2, 0, 0], [W/2, D, 0], [14, 0, 0], f'{D:g}', 'deep'),
             dim([-W/2, D, 0], [-W/2, D, H], [-12, 6, 0], f'{H:g}', 'tall'),
             dim([sx, 0, H], [sx, sy, H], [-50, 0, 10], f'{sy:g}', 'to pan shaft'),
             dim([W/2, P['PACK_Y0'] - 1, 0], [W/2, P['PACK_Y0'] - 1, P['BAY_Z']], [10, -8, 0], f"{P['BAY_Z']:g}", 'battery bay'),
             dim([BOARD_CX - 26.8, SOCK_Y, H], [BOARD_CX + 26.8, SOCK_Y, H], [0, -10, 8], '53.6', 'micro:bit slot')],
       hint='Front window shows the micro:bit LEDs. Pull the micro:bit up through the slot to code it. Battery pack slides in from the right.')

finish(plate, 'ms2000-p1-floor-plate', out, 'MS-2000 <span>floor plate</span>, Rev A',
       specs=[('Size', f'{W - 2*T - 2*P["CLR"]:g} × {D - 2*T - 2*P["CLR"]:g} × {FZ:g}'), ('Board posts', f'{P["STANDOFF"]:g} mm, M2'),
              ('Screws', '4 × M2 up into the shell'), ('Print', 'flat, no supports')],
       dims=[dim([-W/2 + T, -1, 0], [W/2 - T, -1, 0], [0, -12, 0], f'{W - 2*T - 2*P["CLR"]:.1f}', 'wide'),
             dim([holes_xy[0][0], holes_xy[0][1], BOARD_Z], [holes_xy[2][0], holes_xy[2][1], BOARD_Z], [0, -14, 6],
                 f'{holes_xy[2][0]-holes_xy[0][0]:.1f}', 'board holes'),
             dim([holes_xy[0][0], holes_xy[0][1], BOARD_Z], [holes_xy[1][0], holes_xy[1][1], BOARD_Z], [-14, 0, 6],
                 f'{holes_xy[1][1]-holes_xy[0][1]:.1f}', 'board holes'),
             dim([P['PACK_X0'], P['PACK_Y0'] - 0.4, FZ + 4], [P['PACK_X0'], P['PACK_Y0'] + pl + 0.4, FZ + 4], [-6, 0, 12],
                 f'{pl + 0.8:.1f}', 'battery rails')],
       hint='Xia mi screws onto the four posts, micro:bit end toward the front. Board hole spacing is from a photo: check before printing.')

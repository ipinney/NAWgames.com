"""Dusty chassis ("caddy"), Rev A. Units mm.
Axes: x = right, y = back (0 = front edge of main plate), z = up (0 = table).
Printed parts: base, deck, 4 posts, motor cradle, tray, roller, roller axle + collar,
pinion, compound gear, roller gear, 2 sensor carriers (left has whisker pad), gear washer."""
import os, sys, json, math
import numpy as np
import manifold3d as m
from cadkit import box, cyl, prism_xy, prism_yz, prism_xz, union, M, CS
from gears import involute_gear

P = {}
def p(k, v): P[k] = v; return v

# --- drive geometry ---
WHEEL_R = p('WHEEL_R', 16.0); WHEEL_W = p('WHEEL_W', 7.0)
AXLE_Z = p('AXLE_Z', 16.0)
PAD_H = p('PAD_H', 9.0)                    # printed spacer pads between brackets and plate
BR_Z = AXLE_Z + 5.0                        # bracket mounting face
PL_Z0 = p('PL_Z0', BR_Z + PAD_H)
PL_T = p('PL_T', 3.0); PL_Z1 = PL_Z0 + PL_T
GX = p('GX', 41.0)                         # gearbox face x (motor shaft points outward)
ML = p('ML', 37.0)                         # gearbox face to back of encoder + connector
A = p('A', 59.0)                           # axle y
BR_HOLE_DX = 12.5; BR_HOLE_DY = 9.0        # from Pololu STEP (#1089)
WHEEL_X0 = GX + 1.5                        # wheel inner face

# --- roller + gear train ---
RY = p('RY', 17.0); RZ = p('RZ', 14.0)     # roller axis
ROLL_R = p('ROLL_R', 14.5)                 # radius incl. pipe-cleaner bristles
CORE_D = p('CORE_D', 14.0); ROLL_L = p('ROLL_L', 52.0)
SP_X0 = p('SP_X0', 28.0); SP_X1 = SP_X0 + 2.5   # side plates
M1, Z_PIN, Z_BIG = 0.8, 12, 36             # stage 1 (motor pinion -> compound big)
M2, Z_SM, Z_ROL = 1.25, 10, 18             # stage 2 (compound small -> roller gear)
D1 = M1*(Z_PIN+Z_BIG)/2; D2 = M2*(Z_SM+Z_ROL)/2
C_Z = p('C_Z', 25.0)
C_Y = RY + math.sqrt(D2**2 - (C_Z-RZ)**2)
CRADLE_T = 2.0
MOT_Z = PL_Z1 + CRADLE_T + 7.5            # 130 motor axis (15 mm across flats)
MOT_Y = C_Y - math.sqrt(D1**2 - (MOT_Z-C_Z)**2)   # motor ahead of compound gear
P1 = (33.3, 36.3)                          # stage-1 gear plane (x)
P2 = (36.8, 41.0)                          # stage-2 gear plane (x)
MOT_FACE_X = 31.5; MOT_LEN = 25.2
PIN_D = 4.8; PIN_HOLE = 5.2
AXLE_R = 2.0; AXLE_FLAT = 1.5; AXLE_HOLE = 4.6
P.update(C_Y=round(C_Y,2), MOT_Y=round(MOT_Y,2), MOT_Z=MOT_Z, D1=D1, D2=D2)

# --- tray ---
# Rev B: the front lip touches the table and the underside rises toward the back, so only
# the lip can rub. The weight hangs on the rear flange (resting on the base hook) and the side snaps.
TRAY_Y0 = RY + ROLL_R + 0.5; TRAY_Y1 = 72.0
TRAY_X = 27.6; TRAY_WALL = 1.4
LIP_T = 0.6                                 # lip edge thickness at the table
UNDER_RISE = p('UNDER_RISE', 2.5)           # underside height at the back edge (lip is at 0)
TRAY_LOW_TOP = 9.0
TRAY_FLOOR_T = 1.2                          # floor thickness
CREST_Z = 4.2; CREST_DY = 10.0             # crumb-trap crest: height and distance behind the front edge
FILLET = 3.0; LIP = 2.5                    # sloped inside corners; inward lips on the low walls
REAR_MID_X = 18.0; REAR_MID_TOP = 15.0     # taller middle of the back wall (clear of the motor brackets)
SNAP_Y = 39.0; SNAP_Z = 20.0; SNAP_R = 0.8
TAB_Y = (36.0, 42.0); TAB_TOP = 23.0       # snap tab; the side wall tapers down on both sides of it
TAPER_END_Y = 48.0                         # side wall is back to TRAY_LOW_TOP here (stays under the motor pads)
RELIEF_W = 1.0; RELIEF_Z = 6.0             # slots either side of the tab so it flexes for the snap
FLANGE_Z = (7.0, 8.5)

# --- rear / top ---
BAT = (62.5, 57.3, 19.5)                   # Adafruit 4xAA holder (x, y, z)
BAT_Y1 = 114.0; BAT_Y0 = BAT_Y1 - BAT[1]
PLATE_Y1 = BAT_Y1
CASTER_Y = p('CASTER_Y', 106.0); CASTER_H = 10.16; CASTER_DX = 13.46/2
DECK_Z0 = p('DECK_Z0', PL_Z1 + BAT[2] + 2.5); DECK_T = 2.5
DECK_Y = (50.0, BAT_Y1); DECK_X = 39.5
MB = (62.0, 76.0)                           # moto:bit v2 (DEV-15713): 62 wide (connector edge, front) x 76 deep
MB_Y0 = 36.0; MB_Y1 = MB_Y0 + MB[1]         # board sits flush against the rear stop
DECK_NOSE_Y = 37.0                          # deck extends forward under the board
POSTS = [(sx*36.5, y) for y in (53.0, 111.0) for sx in (-1, 1)]
POST_D = 5.6; PEG_D = 4.0
WIDE_Y0 = 47.0; FRONT_HALF = SP_X1; WIDE_HALF = 39.5
EAR_Y = (-8.0, 2.0); EAR_X = (40.0, 42.5)
SCREW_HOLE = 2.4; PILOT = 1.8

def mirror_x(s):
    return s.mirror([1, 0, 0])

# ================= BASE =================
def base(print_fin=False):
    """print_fin=True adds a loose support block under the gear peg for printing upside down."""
    parts = []
    # plate: front narrow section + wide rear section
    parts.append(box(-FRONT_HALF, FRONT_HALF, -2.0, WIDE_Y0, PL_Z0, PL_Z1))
    parts.append(box(-WIDE_HALF, WIDE_HALF, WIDE_Y0, PLATE_Y1, PL_Z0, PL_Z1))
    # sensor ears: plate tabs + hanging ears
    for s in (-1, 1):
        xa, xb = sorted([s*FRONT_HALF, s*EAR_X[1]])
        parts.append(box(xa, xb, EAR_Y[0], EAR_Y[1], PL_Z0, PL_Z1))
        xa, xb = sorted([s*EAR_X[0], s*EAR_X[1]])
        parts.append(box(xa, xb, EAR_Y[0], EAR_Y[1], 6.0, PL_Z0))
    # plate front bridge to ears
    parts.append(box(-FRONT_HALF, FRONT_HALF, EAR_Y[0], -2.0, PL_Z0, PL_Z1))
    # side plates / skirts (roller supports, tray snap walls)
    for s in (-1, 1):
        xa, xb = sorted([s*SP_X0, s*SP_X1])
        parts.append(box(xa, xb, 4.0, 44.0, 8.0, PL_Z0))
    # compound-gear pin boss + pin (right side)
    boss = M.cylinder(SP_X1 - SP_X0 + 0.01, 4.8, 4.8, 40).rotate([0, 90, 0]).translate([SP_X0, C_Y, C_Z])
    pin = M.cylinder(P2[1] - SP_X1, PIN_D/2, PIN_D/2, 40).rotate([0, 90, 0]).translate([SP_X1, C_Y, C_Z])
    web = box(SP_X0, SP_X1, C_Y - 5.0, C_Y + 5.0, C_Z, PL_Z0)
    parts += [boss, pin, web]
    # spacer pads under the motor brackets
    for sx in (-1, 1):
        xa, xb = sorted([sx*23.75, sx*32.9])
        parts.append(box(xa, xb, A - 13.75, A + 13.75, BR_Z, PL_Z0))
    # rear tray catch
    parts.append(box(-8, 8, 74.4, 76.0, 5.0, PL_Z0))
    parts.append(box(-8, 8, 72.4, 76.0, 5.0, 6.8))
    # caster boss
    for dx in (-CASTER_DX, CASTER_DX):
        parts.append(cyl(dx, CASTER_Y, CASTER_H, PL_Z0, 6.0))
    parts.append(box(-CASTER_DX, CASTER_DX, CASTER_Y - 1.0, CASTER_Y + 1.0, CASTER_H, PL_Z0))
    parts.append(box(-1.0, 1.0, CASTER_Y - 6.0, CASTER_Y + 6.0, CASTER_H + 4.0, PL_Z0))
    s = union(parts)

    holes = []
    # roller axle holes
    holes.append(M.cylinder(80, AXLE_HOLE/2, AXLE_HOLE/2, 32).rotate([0, 90, 0]).translate([-40, RY, RZ]))
    # compound pin retaining screw pilot
    holes.append(M.cylinder(8, PILOT/2, PILOT/2, 16).rotate([0, 90, 0]).translate([P2[1] - 7.5, C_Y, C_Z]))
    # motor bracket screws: self-tap up into the pads from below
    for sx in (-1, 1):
        for dy in (-BR_HOLE_DY, BR_HOLE_DY):
            x = sx*(GX - BR_HOLE_DX); y = A + dy
            holes.append(cyl(x, y, BR_Z - 1, BR_Z + 8.0, PILOT))
    # caster pilot holes (blind, from below)
    for dx in (-CASTER_DX, CASTER_DX):
        holes.append(cyl(dx, CASTER_Y, CASTER_H - 1, CASTER_H + 9.0, PILOT))
    # post pegs
    for (x, y) in POSTS:
        holes.append(cyl(x, y, PL_Z0 - 3, PL_Z1 + 1, PEG_D + 0.05))
    # sensor ear screw holes (x direction)
    for sx in (-1, 1):
        holes.append(M.cylinder(10, SCREW_HOLE/2, SCREW_HOLE/2, 16).rotate([0, 90, 0]).translate([sx*EAR_X[0] - 5, -3.0, 13.0]))
    # tray snap holes in skirts
    for sx in (-1, 1):
        holes.append(M.cylinder(10, 1.0, 1.0, 16).rotate([0, 90, 0]).translate([sx*SP_X0 - 5, 39.0, 20.0]))
    # wire slots: motor wires (left of cradle), sensor wires (front corners), battery lead
    holes.append(box(-13, -5, 44.0, 49.0, PL_Z0 - 1, PL_Z1 + 1))
    for sx in (-1, 1):
        holes.append(box(min(sx*24, sx*18), max(sx*24, sx*18), -6.0, -1.0, PL_Z0 - 1, PL_Z1 + 1))
    # cradle screws + alignment pegs
    for (x, y) in CRADLE_SCREWS:
        holes.append(cyl(x, y, PL_Z0 - 1, PL_Z1 + 1, SCREW_HOLE))
    for (x, y) in CRADLE_PEGS:
        holes.append(cyl(x, y, PL_Z1 - 2.0, PL_Z1 + 1, 3.1))
    # lightening windows under the battery (strap slots too)
    for sx in (-1, 1):
        holes.append(box(min(sx*36.5, sx*33.5), max(sx*36.5, sx*33.5), 72.0, 84.0, PL_Z0 - 1, PL_Z1 + 1))
        holes.append(box(min(sx*36.5, sx*33.5), max(sx*36.5, sx*33.5), 92.0, 104.0, PL_Z0 - 1, PL_Z1 + 1))
    for yy in (82.0, 96.0):
        holes.append(box(-14, 14, yy - 4, yy + 4, PL_Z0 - 1, PL_Z1 + 1))
    for h in holes:
        s = s - h
    if print_fin:
        # The peg sticks out past the edge of the plate, so upside down it hangs over the bed.
        # A loose support block stands on the bed and stops 0.25 mm short of the peg; lift it off after printing.
        r = PIN_D / 2 + 0.25
        arc = [(C_Y + r * math.cos(math.radians(a)), C_Z + r * math.sin(math.radians(a))) for a in range(40, 141, 10)]
        prof = [(C_Y - r * math.cos(math.radians(40)), PL_Z1), (C_Y + r * math.cos(math.radians(40)), PL_Z1)]
        prof += arc
        fin = prism_yz(prof, SP_X1 + 0.8, P2[1] - 0.5)
        s = s + (fin - M.cylinder(20, r, r, 48).rotate([0, 90, 0]).translate([SP_X1, C_Y, C_Z]))
    return s

# 130 motor cradle attachment
CRADLE_X = (4.0, 30.0)
CRADLE_Y = (MOT_Y - 12.0, MOT_Y + 12.0)
CRADLE_SCREWS = [(8.0, CRADLE_Y[0] + 3.0), (8.0, CRADLE_Y[1] - 3.0)]
CRADLE_PEGS = [(26.0, CRADLE_Y[0] + 3.0), (26.0, CRADLE_Y[1] - 3.0)]

def motor_profile(clear=0.25):
    """130 motor cross-section in (y,z) around its axis: 20 dia round, 15 across flats (z)."""
    R = 10.0 + clear; H = 7.5 + clear
    pts = []
    for a in np.linspace(-math.pi/2, 3*math.pi/2, 64, endpoint=False):
        y, z = R*math.cos(a), R*math.sin(a)
        z = max(-H, min(H, z))
        pts.append((y, z))
    return pts

def cradle():
    z0 = PL_Z1
    parts = [box(CRADLE_X[0], CRADLE_X[1] + 1.5, CRADLE_Y[0], CRADLE_Y[1], z0, z0 + CRADLE_T)]
    sad_top = MOT_Z + 3.0
    # saddles
    for xa in (8.0, 22.0):
        parts.append(box(xa, xa + 3.0, CRADLE_Y[0], CRADLE_Y[1], z0, sad_top))
    # face plate (locates the motor boss)
    parts.append(box(MOT_FACE_X, MOT_FACE_X + 1.5, MOT_Y - 8.0, MOT_Y + 8.0, z0, MOT_Z + 7.0))
    parts.append(box(CRADLE_X[1], MOT_FACE_X + 1.5, CRADLE_Y[0] + 4, CRADLE_Y[1] - 4, z0, z0 + CRADLE_T))
    # switch panel (KCD11 mini rocker, 13 x 8.5 cutout), behind the motor
    sp_y = CRADLE_Y[1]
    parts.append(box(9.0, 25.0, sp_y, sp_y + 2.0, z0, z0 + 17.0))
    parts.append(box(9.0, 25.0, CRADLE_Y[1] - 1, sp_y + 2.0, z0, z0 + CRADLE_T))
    s = union(parts)
    for (x, y) in CRADLE_PEGS:
        s = s - cyl(x, y, z0 - 1, z0 + 1.6, 3.1)
    # motor channel
    prof = motor_profile()
    from cadkit import _remap
    ch = M.extrude(CS([prof]), MOT_FACE_X - 2.0)   # local (a=y, b=z, c=x)
    ch = _remap(ch, (2, 0, 1), False, [2.0, MOT_Y, MOT_Z])
    s = s - ch
    # boss hole + shaft clearance through face plate
    s = s - M.cylinder(4, 3.4, 3.4, 32).rotate([0, 90, 0]).translate([MOT_FACE_X - 1, MOT_Y, MOT_Z])
    # zip tie slots beside the motor
    s = s - box(14.0, 17.5, MOT_Y - 13.0, MOT_Y - 11.0, z0 - 1, z0 + 5) - box(14.0, 17.5, MOT_Y + 11.0, MOT_Y + 13.0, z0 - 1, z0 + 5)
    # screw holes
    # pilot holes: M2 x 8 goes up from under the base, through the plate, and threads into the cradle
    for (x, y) in CRADLE_SCREWS:
        s = s - cyl(x, y, z0 - 1, z0 + 6.5, PILOT)
    # rocker cutout
    s = s - box(10.5, 23.5, sp_y - 1, sp_y + 3, z0 + 5.0, z0 + 13.5)
    return s

# ================= DECK + POSTS =================
def deck():
    z0, z1 = DECK_Z0, DECK_Z0 + DECK_T
    hx = MB[0] / 2
    s = box(-DECK_X, DECK_X, DECK_Y[0], DECK_Y[1], z0, z1)
    s = s + box(-hx - 2.0, hx + 2.0, DECK_NOSE_Y, DECK_Y[0] + 1, z0, z1)      # nose under the moto:bit
    parts = [s]
    for sx in (-1, 1):                                                        # side guides
        xa, xb = sorted([sx * hx, sx * (hx + 2.0)])
        parts.append(box(xa, xb, DECK_NOSE_Y + 2.0, MB_Y1 - 4.0, z1, z1 + 3.0))
    parts.append(box(-hx, hx, MB_Y1, MB_Y1 + 2.0, z1, z1 + 3.0))              # rear stop
    s = union(parts)
    for (x, y) in POSTS:
        s = s - cyl(x, y, z0 - 1, z1 + 1, SCREW_HOLE) - cyl(x, y, z1 - 1.2, z1 + 5, 4.4)
    # zip-tie slots just outside the side guides; the ties go over the board
    for sx in (-1, 1):
        xa, xb = sorted([sx * (hx + 2.5), sx * (hx + 5.0)])
        s = s - box(xa, xb, 60, 64, z0 - 1, z1 + 1)
        s = s - box(xa, xb, 96, 100, z0 - 1, z1 + 1)
    s = s - box(-20, 20, 72, 94, z0 - 1, z1 + 1)       # wire pass-through / weight
    return s

def post():
    h = DECK_Z0 - PL_Z1
    s = M.cylinder(h, POST_D/2, POST_D/2, 32)
    s = s + M.cylinder(PL_T - 0.3, PEG_D/2, PEG_D/2, 32).translate([0, 0, -(PL_T - 0.3)])
    s = s - M.cylinder(8, PILOT/2, PILOT/2, 16).translate([0, 0, h - 7.5])
    return s   # local: z=0 at plate top

# ================= TRAY =================
def tray_under(y):
    """underside height: 0 at the front lip, rising straight to UNDER_RISE at the back"""
    return UNDER_RISE * (y - TRAY_Y0) / (TRAY_Y1 - TRAY_Y0)

def tray_top(y):
    return tray_under(y) + TRAY_FLOOR_T

def tray():
    X = TRAY_X; W = TRAY_WALL
    y0, y1 = TRAY_Y0, TRAY_Y1
    zu, zt = tray_under, tray_top
    xi = X - W                                  # inner face of the side walls
    yi = y1 - W                                 # inner face of the back wall
    yc = y0 + CREST_DY
    parts = []
    # floor: thin lip on the table, ramp up to a crest, straight drop, then a floor parallel to the sloped underside
    prof = [(y0, 0.0), (y1, zu(y1)), (y1, zt(y1)), (yc + 0.8, zt(yc + 0.8)), (yc + 0.8, CREST_Z), (yc, CREST_Z), (y0, LIP_T)]
    parts.append(prism_yz(prof, -X, X))
    for sx in (-1, 1):
        xa, xb = sorted([sx * X, sx * xi])
        # tapered side wall: low at the lip, up to the snap tab, back down to the low wall before the motor pads
        wall_prof = [(y0, 0.0), (y0, CREST_Z), (TAB_Y[0], TAB_TOP), (TAB_Y[1], TAB_TOP),
                     (TAPER_END_Y, TRAY_LOW_TOP), (y1, TRAY_LOW_TOP), (y1, zu(y1))]
        parts.append(prism_yz(wall_prof, xa, xb))
        parts.append(M.sphere(SNAP_R, 16).translate([sx * X, SNAP_Y, SNAP_Z]))       # snap bump
        # sloped inside corner along the floor, following the floor slope
        ya, yb = yc + 0.8, yi
        pts = []
        for yy in (ya, yb):
            t = zt(yy)
            pts += [(sx * (xi + 0.3), yy, t - 0.3), (sx * (xi + 0.3), yy, t + FILLET), (sx * (xi - FILLET), yy, t - 0.3)]
        parts.append(M.hull_points(pts))
        # inward 45 degree lip along the top of the low part of the wall
        lip = [(sx * (xi + 0.3), TRAY_LOW_TOP), (sx * (xi - LIP), TRAY_LOW_TOP), (sx * (xi + 0.3), TRAY_LOW_TOP - LIP - 0.3)]
        parts.append(prism_xz(lip, TAPER_END_Y, yi))
    # back wall: low at the sides, taller in the middle, lips on both tops, sloped inside corner at the floor
    parts.append(prism_yz([(yi, zu(yi)), (y1, zu(y1)), (y1, TRAY_LOW_TOP), (yi, TRAY_LOW_TOP)], -X, X))
    parts.append(prism_yz([(yi, zu(yi) + 0.5), (y1, zu(y1) + 0.5), (y1, REAR_MID_TOP), (yi, REAR_MID_TOP)], -REAR_MID_X, REAR_MID_X))
    tb = zt(yi)
    parts.append(prism_yz([(yi + 0.3, tb - 0.3), (yi + 0.3, tb + FILLET), (yi - FILLET, tb - 0.3)], -xi - 0.3, xi + 0.3))
    parts.append(prism_yz([(yi + 0.3, TRAY_LOW_TOP), (yi - LIP, TRAY_LOW_TOP), (yi + 0.3, TRAY_LOW_TOP - LIP - 0.3)], -xi - 0.3, xi + 0.3))
    parts.append(prism_yz([(yi + 0.3, REAR_MID_TOP), (yi - LIP, REAR_MID_TOP), (yi + 0.3, REAR_MID_TOP - LIP - 0.3)], -REAR_MID_X, REAR_MID_X))
    # snap flange: rests on the hook at the back of the base and carries the tray
    parts.append(box(-7.5, 7.5, y1 - 0.3, y1 + 2.0, FLANGE_Z[0], FLANGE_Z[1]))
    s = union(parts)
    # relief slots either side of the snap tab
    for sx in (-1, 1):
        xa, xb = sorted([sx * (X + 1), sx * (xi - 1)])
        for ys in (TAB_Y[0] - RELIEF_W, TAB_Y[1]):
            s = s - box(xa, xb, ys, ys + RELIEF_W, RELIEF_Z, TAB_TOP + 1)
    return s

def tray_print_tilt():
    """degrees about x that lay the sloped underside flat on the bed"""
    return -math.degrees(math.atan2(UNDER_RISE, TRAY_Y1 - TRAY_Y0))

# ================= ROLLER + AXLE =================
def d_profile(r, flat, n=40):
    pts = []
    for a in np.linspace(0, 2*math.pi, n, endpoint=False):
        x, y = r*math.cos(a), r*math.sin(a)
        pts.append((x, min(y, flat)))
    return pts

def roller():
    core = M.cylinder(ROLL_L, CORE_D/2, CORE_D/2, 48)
    bore = M.extrude(CS([d_profile(AXLE_R + 0.15, AXLE_FLAT + 0.15)]), ROLL_L + 2).translate([0, 0, -1])
    s = core - bore
    # pipe-cleaner holes: 7 stations, alternating 0/60/120 deg
    n = 7
    for i in range(n):
        zz = 4.0 + i*(ROLL_L - 8.0)/(n - 1)
        ang = (i % 3)*60
        h = M.cylinder(CORE_D + 2, 1.2, 1.2, 12).rotate([90, 0, 0]).translate([0, (CORE_D + 2)/2, zz]).rotate([0, 0, ang])
        s = s - h
    return s  # local: axis z, 0..ROLL_L

def axle():
    L = P2[1] - (-SP_X1 - 3.0) + 0.5
    s = M.extrude(CS([d_profile(AXLE_R, AXLE_FLAT)]), L)
    return s, L  # local axis z

def collar():
    s = M.cylinder(3.0, 4.0, 4.0, 32) - M.extrude(CS([d_profile(AXLE_R + 0.1, AXLE_FLAT + 0.1)]), 5).translate([0, 0, -1])
    return s

def gear_solid(z, mod, thick, bore='round', bore_d=2.0):
    pts, rp, ra, rf = involute_gear(z, mod)
    g = M.extrude(CS([pts]), thick)
    if bore == 'round':
        g = g - M.cylinder(thick + 2, bore_d/2, bore_d/2, 24).translate([0, 0, -1])
    elif bore == 'D':
        g = g - M.extrude(CS([d_profile(AXLE_R + 0.05, AXLE_FLAT + 0.05)]), thick + 2).translate([0, 0, -1])
    return g

def pinion():
    return gear_solid(Z_PIN, M1, P1[1] - P1[0], 'round', 1.85)

def compound():
    big = gear_solid(Z_BIG, M1, P1[1] - P1[0], 'none')
    hub = M.cylinder(P2[0] - P1[1] + 0.01, 5.5, 5.5, 32).translate([0, 0, P1[1] - P1[0]])
    small = gear_solid(Z_SM, M2, P2[1] - P2[0], 'none').translate([0, 0, P2[0] - P1[0]])
    s = union([big, hub, small])
    s = s - M.cylinder(20, PIN_HOLE/2, PIN_HOLE/2, 32).translate([0, 0, -1])
    # lighten big gear
    for k in range(5):
        a = 2*math.pi*k/5
        s = s - M.cylinder(5, 2.6, 2.6, 20).translate([9.2*math.cos(a), 9.2*math.sin(a), -1])
    return s  # local axis z, z=0 at P1[0]

def roller_gear():
    return gear_solid(Z_ROL, M2, P2[1] - P2[0], 'D')

def washer():
    return M.cylinder(1.0, 4.0, 4.0, 32) - M.cylinder(3, 1.3, 1.3, 16).translate([0, 0, -1])

# ================= SENSOR CARRIERS =================
# Carrier: vertical plate against the ear's outer face with a height slot,
# foot at the bottom holding the QTR-1A face-down (sensor ~3 mm off the table).
QTR = (7.6, 12.7)          # 0.3 x 0.5 in
SENSOR_Z = 3.0
def carrier(side, whisker=False):
    # built for the right side (x>0); mirrored for left
    x0 = EAR_X[1]; x1 = x0 + 2.4
    y0, y1 = EAR_Y
    plate = box(x0, x1, y0, y1, SENSOR_Z, PL_Z0 - 0.5)
    # foot: frame extending inward under nothing (ahead of roller), holds the board
    fx0 = x0 - QTR[1] - 1.2 - 0.4; fx1 = x1
    fy0 = y0; fy1 = y1
    foot = box(fx0, fx1, fy0, fy1, SENSOR_Z, SENSOR_Z + 1.2)
    lip = union([box(fx0, fx0 + 1.2, fy0, fy1, SENSOR_Z, SENSOR_Z + 3.0),
                 box(fx0, fx1, fy0, fy0 + 1.0, SENSOR_Z, SENSOR_Z + 3.0),
                 box(fx0, fx1, fy1 - 1.0, fy1, SENSOR_Z, SENSOR_Z + 3.0)])
    parts = [plate, foot, lip]
    if whisker:
        # microswitch pad on the outer face, 9.5 mm hole spacing
        parts.append(box(x1, x1 + 2.2, y0, y1 + 2.0, SENSOR_Z, 26.0))
    s = union(parts)
    # height-adjust slot (screw goes through into the ear)
    slot = union([M.cylinder(10, SCREW_HOLE/2, SCREW_HOLE/2, 16).rotate([0, 90, 0]).translate([x0 - 2, -3.0, zz])
                  for zz in np.linspace(10.0, 16.0, 13)])
    s = s - slot
    # window for the sensor + board screw slot
    s = s - box(fx0 + 2.5, fx0 + 2.5 + 6.0, fy0 + 2.0, fy1 - 2.0, SENSOR_Z - 1, SENSOR_Z + 2)
    s = s - box(fx1 - 5.5, fx1 - 3.5, fy0 + 3.0, fy1 - 3.0, SENSOR_Z - 1, SENSOR_Z + 2)
    if whisker:
        for dy in (-4.75, 4.75):
            s = s - M.cylinder(6, 1.15, 1.15, 16).rotate([0, 90, 0]).translate([x1 - 1, (y0 + y1 + 2.0)/2 + dy, 20.0])
    if side < 0:
        s = mirror_x(s)
    return s

def dowel():
    return M.cylinder(3.4, 1.45, 1.45, 24)

"""F1 prop guard + landing legs, Rev A (one part).

A fence around the outside of all four propellers, four collars that push onto the motor cans under the PCB,
and four legs that the drone lands on. The fence is the outline of (four 31 mm circles around the motors +
the square between them), so it follows the props on the outside and runs straight across between them.
It never touches the PCB. The legs double as the mosquito's legs.
Prints upside down: fence flat on the bed, posts straight up, spokes bridge to the collars. No supports.
Run: python parts/f1_guard.py OUT_DIR
"""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import manifold3d as m
from cadkit import box, cyl, union, dim, finish, M, CS
from components import V

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
MX = V('litewing', 'motor_xy')          # 42
R = 31.0                                # fence centerline radius around each motor (prop 27.5 + 3.5 gap)
T = 0.8                                 # fence thickness
FZ0, FZ1 = 6.5, 11.5                  # fence band 5 mm tall; prop plane est 9
COL_ID = 7.2                            # motor collar bore (fit check picks 7.0 / 7.2 / 7.4)
COL_OD = COL_ID + 2.4
CZ0, CZ1 = -9.0, -1.0                   # collar under the PCB (motor can est 10 below)
SZ0, SZ1 = -4.0, -1.0                   # spoke
FOOT_Z = -20.0                          # landing height (positioning module est 12.5 below)
POST_D = 2.8
POST_R = R - 1.2                        # post just inside the fence
MOTORS = [(sx * MX, sy * MX) for sx in (-1, 1) for sy in (-1, 1)]

shape = CS.square([2 * MX, 2 * MX], center=True)
for x, y in MOTORS:
    shape = shape + CS.circle(R, 96).translate([x, y])
band = shape.offset(T / 2, m.JoinType.Round, 2.0, 96) - shape.offset(-T / 2, m.JoinType.Round, 2.0, 96)
fence = M.extrude(band, FZ1 - FZ0).translate([0, 0, FZ0])
# stiffening lip on the top edge
lip = shape.offset(T / 2, m.JoinType.Round, 2.0, 96) - shape.offset(-T / 2 - 0.8, m.JoinType.Round, 2.0, 96)
fence = fence + M.extrude(lip, 0.6).translate([0, 0, FZ1 - 0.6])

parts = [fence]
for x, y in MOTORS:
    ux, uy = math.copysign(1, x) / math.sqrt(2), math.copysign(1, y) / math.sqrt(2)   # outward diagonal
    px, py = x + ux * POST_R, y + uy * POST_R
    parts.append(cyl(px, py, FOOT_Z + 1.2, FZ1, POST_D, 24))                         # post + leg
    parts.append(cyl(px, py, FOOT_Z, FOOT_Z + 1.2, 6.5, 32))                         # foot
    col = cyl(x, y, CZ0, CZ1, COL_OD, 48) - cyl(x, y, CZ0 - 1, CZ1 + 1, COL_ID, 48)
    # wire slit on the inward side (the motor wires run to the pads toward the center)
    slit = box(-0.7, 0.7, -COL_OD, 0, CZ0 - 1, CZ1 + 1).rotate([0, 0, math.degrees(math.atan2(uy, ux)) - 90])
    col = col - slit.translate([x, y, 0])
    parts.append(col)
    L = POST_R - COL_OD / 2 + 0.6
    spoke = box(COL_OD / 2 - 0.6, COL_OD / 2 - 0.6 + L, -1.3, 1.3, SZ0, SZ1)
    parts.append(spoke.rotate([0, 0, math.degrees(math.atan2(uy, ux))]).translate([x, y, 0]))

guard = union(parts)

# must not touch the PCB: check against its bounding outline (100 x 100, concave edges keep it further in)
from components import edge
pcb_box = box(-50, 50, -50, 50, 0, V('litewing', 'pcb_t'))
clear = (fence ^ pcb_box).volume()
print('fence over the PCB square (should be 0 because the fence is outside the board):', round(clear, 3))

span = 2 * (MX + R + T / 2)
finish(guard, 'flymo-f1-guard', OUT, 'Flying Mosquito <span>prop guard</span>, Rev A',
       specs=[('Size', f'{span:.0f} x {span:.0f} mm'), ('Fence', f'{T} mm wall, {FZ1 - FZ0:g} mm tall'),
              ('Holds on', f'4 collars, {COL_ID} mm bore'), ('Print', 'upside down, no supports')],
       dims=[dim([-span / 2, -span / 2, FZ1], [span / 2, -span / 2, FZ1], [0, -12, 0], f'{span:.0f}', 'across'),
             dim([MX, MX, FZ0], [MX + R, MX, FZ0], [0, 0, 8], f'{R:g}', 'motor to fence'),
             dim([MX + POST_R / math.sqrt(2), MX + POST_R / math.sqrt(2), FOOT_Z], [MX + POST_R / math.sqrt(2), MX + POST_R / math.sqrt(2), FZ1], [8, 0, 0], f'{FZ1 - FOOT_Z:g}', 'foot to fence top')],
       hint='Push each collar onto a motor can from below, slit toward the middle so the wires pass. The feet are the landing legs.')

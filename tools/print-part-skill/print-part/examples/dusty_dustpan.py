"""Worked example: Dusty robot dustpan, Rev A (Nolan's 4th grade invention, Sep 2026).
Open tray with a thin ramped front lip, crumb-trap drop, side glue flanges on 45 deg
chamfers, rear glue tabs on gussets with 3 mm holes. Prints right side up, no supports.
Run:  python examples/dusty_dustpan.py OUT_DIR
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))
from cadkit import box, cyl, prism_yz, prism_xz, union, dim, finish

P = dict(W=100.0, D=50.0, H=20.0, T=1.6, LIP_EDGE=0.6, RAMP_LEN=14.0, RAMP_H=5.0,
         FLANGE=6.0, FT=2.0, TAB_W=22.0, TAB_L=16.0, TAB_X=30.0, HOLE=3.0)
W, D, H, T = P['W'], P['D'], P['H'], P['T']
F, FT, RL, RH = P['FLANGE'], P['FT'], P['RAMP_LEN'], P['RAMP_H']
TW, TL, TX = P['TAB_W'], P['TAB_L'], P['TAB_X']
hw = W / 2

parts = [box(-hw, hw, 0, D, 0, T),                      # floor
         box(-hw, -hw + T, 0, D, 0, H), box(hw - T, hw, 0, D, 0, H),   # side walls
         box(-hw, hw, D - T, D, 0, H),                  # back wall
         prism_yz([(0, 0), (RL + 1.2, 0), (RL + 1.2, RH), (RL, RH), (0, P['LIP_EDGE'])],
                  -hw + T / 2, hw - T / 2)]             # ramp lip + crumb trap
for s in (-1, 1):                                       # side flanges on 45 deg chamfers
    xi, xo = s * hw, s * (hw + F)
    parts.append(box(min(xi, xo), max(xi, xo), 0, D, H - FT, H))
    tri = [(xi, H - FT), (xi, H - FT - F), (xo, H - FT)]
    parts.append(prism_xz(tri if s > 0 else tri[::-1], 0, D))
holes = []
for cx in (-TX, TX):                                    # rear tabs, 3 gussets each
    parts.append(box(cx - TW / 2, cx + TW / 2, D, D + TL, H - FT, H))
    g = [(D, H - FT - (TL - 2)), (D + TL - 2, H - FT), (D, H - FT)]
    for gx in (cx - TW / 2 + .8, cx, cx + TW / 2 - .8):
        parts.append(prism_yz(g, gx - .8, gx + .8))
    holes += [cyl(cx + dx, D + TL - 5, H - FT - 1, H + 1, P['HOLE']) for dx in (-6, 6)]
solid = union(parts)
for h in holes:
    solid = solid - h

dims = [dim([-hw - F, -1, 0], [hw + F, -1, 0], [0, -14, 0], 112, 'with flanges'),
        dim([-hw, 0, H], [hw, 0, H], [0, -4, 16], 100, 'body'),
        dim([hw + F, 0, 0], [hw + F, D, 0], [14, 0, 0], 50, 'tray'),
        dim([TX + TW / 2, D, H], [TX + TW / 2, D + TL, H], [10, 0, 6], 16, 'tab'),
        dim([-hw - F, D, 0], [-hw - F, D, H], [-12, 0, 0], 20, 'tall'),
        dim([-hw, 0, 0], [-hw, RL, 0], [0, 0, -9], 14, 'ramp'),
        dim([hw, 0, 0], [hw, 0, RH], [10, -4, 0], 5, 'lip rise'),
        dim([-TX - TW / 2, D + TL, H], [-TX + TW / 2, D + TL, H], [0, 10, 4], 22, 'tab')]

finish(solid, 'dusty-dustpan-revA', sys.argv[1] if len(sys.argv) > 1 else '.',
       'Dusty <span>dustpan</span>, Rev A',
       specs=[('Overall', '112 × 66 × 20'), ('Crumb bin (inside)', '96.8 × 33 × 18.4'),
              ('Front lip', '0.6 mm edge, 17° ramp'), ('Print (PLA)', '~26 g, no supports')],
       dims=dims,
       hint='Glue the side flanges and rear tabs to the underside of the chassis. Roller goes in front of the lip.')

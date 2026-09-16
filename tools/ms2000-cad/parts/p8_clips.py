"""P8 cable clips, Rev A (print a plate of them, flat, no supports).

P8a line clip (print 8): rides on the fishing line and keeps the 4-wire ribbon (5 x 1.2 mm) beside it
between the rod tip and the mosquito. Thread the line through the small hole; snap the ribbon into the slot.
P8b rod clip (print 3): snaps on a 3/8 in dowel (set RD for a real rod) and holds the ribbon along it.
Run: python parts/p8_clips.py OUT_DIR
"""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from cadkit import box, cyl, prism_xy, union, dim, finish, M

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
RW, RT = 5.0 + 0.5, 1.2 + 0.3          # ribbon slot
H = 4.0                                  # clip height (along the line)

# ---------------- P8a line clip ----------------
lc = union([box(-5.0, 5.0, -2.2, 2.2, 0, H), cyl(-7.5, 0, 0, H, 5.0)])
lc = lc - box(-RW / 2, RW / 2, -RT / 2, RT / 2, -1, H + 1)               # ribbon slot
lc = lc - box(RW / 2 - 0.01, 5.1, -0.5, 0.5, -1, H + 1)                  # snap-in mouth, ribbon goes in edgewise
lc = lc - cyl(-7.5, 0, -1, H + 1, 1.0, 16)                                 # fishing line hole
print('P8a', [round(q, 1) for q in lc.bounding_box()])

# ---------------- P8b rod clip ----------------
RD = 9.8                      # 3/8 in dowel; change and rebuild for a real rod
rc = cyl(0, 0, 0, 6.0, RD + 4.4, 64) - cyl(0, 0, -1, 7.0, RD, 64)
rc = rc - prism_xy([(0, 0), (-RD * 0.62, -RD), (RD * 0.62, -RD)], -1, 7.0)   # C opening, ~64 deg
rc = rc + box(-RW / 2 - 1.6, RW / 2 + 1.6, RD / 2 + 1.0, RD / 2 + 2.2 + RT + 1.6, 0, 6.0)
rc = rc - box(-RW / 2, RW / 2, RD / 2 + 2.6, RD / 2 + 2.6 + RT, -1, 7.0)
rc = rc - box(RW / 2 - 0.01, RW / 2 + 2.0, RD / 2 + 2.6 + RT / 2 - 0.5, RD / 2 + 2.6 + RT / 2 + 0.5, -1, 7.0)
print('P8b', [round(q, 1) for q in rc.bounding_box()])

# plate: 8 line clips + 3 rod clips
items = []
for i in range(8):
    items.append(lc.translate([-40 + (i % 4) * 19, 20 + (i // 4) * 9, 0]))
for i in range(3):
    items.append(rc.translate([-36 + i * 24, -8, 0]))
plate = union(items)
finish(plate, 'ms2000-p8-clips', OUT, 'MS-2000 <span>cable clips</span>, Rev A',
       specs=[('Line clips', '8, line hole 1 mm'), ('Rod clips', '3, for a 3/8 in dowel'), ('Ribbon', '5 × 1.2 mm snaps in'), ('Print', 'flat, no supports')],
       dims=[dim([-RW / 2 - 40, 20 + 2.2, H], [RW / 2 - 40, 20 + 2.2, H], [0, 6, 0], f'{RW:g}', 'ribbon slot'),
             dim([-36 - RD / 2, -8, 6], [-36 + RD / 2, -8, 6], [0, -16, 0], f'{RD:g}', 'rod')],
       fit_pad=1.2,
       hint='Slide line clips onto the fishing line every 10 cm or so, then snap the ribbon cable into each one.')

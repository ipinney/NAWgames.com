"""F0 fit check, Rev A: print this first (about 10 minutes).

Three motor collars (7.0 / 7.2 / 7.4 mm bores) to find the one that grips the motor can without cracking, a
sensor pocket for the ALS-PT19, and a 24 mm hole for the arcade button. The winning bore goes into F1 (COL_ID).
Run: python parts/f0_fitcheck.py OUT_DIR
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from cadkit import box, cyl, union, dim, finish
from components import V

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/parts'
BORES = (7.0, 7.2, 7.4)
T = 1.6
parts = [box(-16, 44, -16, 16, 0, T)]
parts[0] = parts[0] - cyl(0, 0, -1, T + 1, V('button', 'hole'), 96)
for i, b in enumerate(BORES):
    x = 26 + (i - 1) * 12 + 6
    parts.append(cyl(x, 8, 0, 8, b + 2.4, 48) - cyl(x, 8, -1, 9, b, 48))
    parts[0] = parts[0] - cyl(x, 8, -1, T + 1, b, 48)
    # size label: 1, 2 or 3 notches
    for k in range(i + 1):
        parts[0] = parts[0] - box(x - 3 + k * 2.4, x - 2 + k * 2.4, -15, -12, T - 0.6, T + 1)
sw, sl = V('light_sensor', 'w'), V('light_sensor', 'l')
body = union(parts)
body = body - box(26 - sw / 2 - 0.2, 26 + sw / 2 + 0.2, -8 - sl / 2 - 0.2, -8 + sl / 2 + 0.2, T - 1.0, T + 1)
finish(body, 'flymo-f0-fitcheck', OUT, 'Flying Mosquito <span>fit check</span>, Rev A',
       specs=[('Collars', '7.0 / 7.2 / 7.4 mm (1, 2, 3 notches)'), ('Also', 'button hole, sensor pocket'), ('Time', 'about 10 min'), ('Print', 'flat, no supports')],
       dims=[dim([-12, -16, T], [12, -16, T], [0, -6, 0], f"{V('button', 'hole'):g}", 'button hole')],
       hint='Slide a motor into each collar. Pick the one that grips without splitting and write it in the journal.')

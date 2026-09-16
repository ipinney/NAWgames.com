"""Shared turret layout numbers (world frame: x right, y back from base front face, z up from table).
P1 base defines these; later parts import them so everything stays in step."""
# from parts/p1_base.py
DECK_TOP = 67.0
DECK_UNDER = 64.0
PAN = (0.0, 66.0)             # pan shaft x, y
TURNTABLE_R = 38.0            # clear of the micro:bit slot at pan 0
CABLE_HOLE = (0.0, 112.0, 14.0)
BASE_W, BASE_D = 142.0, 133.0

# horn stack (servo estimates, see components.py)
HUB_LEN = 1.3                 # horn hub from servo boss top to the horn plate
POCKET = 2.0                  # horn plate pocket depth in the printed part

# P2 turntable + yoke (turntable local frame: origin on pan axis at disc bottom)
DISC_T = 4.0
TILT_Z = 39.0                 # tilt axis above disc bottom
CHEEK_X = 30.6                # head cheek outer face, +-x
TILT_UP, TILT_DOWN = 35.0, 30.0   # printed stop limits, degrees (nose up / nose down)
FINGER_HALF = 8.0             # half width of the head's stop finger, degrees

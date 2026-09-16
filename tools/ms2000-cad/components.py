"""MS-2000 component library: every bought part as numbers plus a simple stand-in solid.

Each entry in COMPONENTS carries the dimensions the printed parts are designed around.
Every number has a basis tag:
  ds   = maker datasheet or drawing (checked Sep 16, 2026)
  step = measured from the maker's STEP model
  photo= scaled from a product photo with a ruler
  est  = estimate, measure with calipers when the part arrives
  tbd  = unknown until the part arrives; printed parts leave room for it
When a part arrives, measure it, change the number, set the tag to 'cal', rebuild.

Axes for every stand-in: x = width, y = depth (0 = front edge), z = up, mm.
Each stand-in sits on z = 0 and is centered on x = 0 unless noted.
REF holds named points later parts attach to (shaft centers, hole centers, lens center).
"""
import os
import numpy as np
import manifold3d as m
from cadkit import box, cyl, union, M

HERE = os.path.dirname(os.path.abspath(__file__))


def d(v, basis, note=''):
    return {'v': v, 'basis': basis, 'note': note}


COMPONENTS = {
    'microbit': dict(
        label='micro:bit V2', qty=2, sku='DFRobot MBT0039', color='#5a616c',
        role='Turret brain (on the Xia mi) and wand brain (in the handle).',
        dims={
            'pcb_w': d(51.6, 'ds', 'microbit.org board outline'),
            'pcb_h': d(42.0, 'ds'),
            'pcb_t': d(1.6, 'ds'),
            'front_parts': d(3.5, 'est', 'buttons A/B above front face'),
            'back_parts': d(5.6, 'est', 'battery JST and USB above back face'),
            'edge_conn_depth': d(8.0, 'est', 'gold edge fingers along bottom edge'),
            'usb_x': d(0.0, 'est', 'micro-USB centered on top edge, back side'),
            'bat_x': d(9.0, 'est', 'JST PH battery socket right of USB, back side'),
        }),
    'xiami': dict(
        label='Xia mi expansion board', qty=1, sku='DFRobot MBT0042', color='#2f6fbf',
        role='Turret board: servos, speaker, HuskyLens port, relay for the laser, battery input.',
        dims={
            'pcb_w': d(57.0, 'ds', 'DFRobot page: 57 x 87 mm'),
            'pcb_l': d(87.0, 'ds'),
            'pcb_t': d(1.6, 'est'),
            'hole_inset': d(3.4, 'photo', '4 corner holes, scaled from the ruler photo'),
            'hole_d': d(3.0, 'photo', 'plated rings look like M3; M2 screws fit'),
            'socket_from_end': d(73.3, 'photo', 'micro:bit edge socket, from the DC-jack end'),
            'socket_h': d(11.0, 'est', 'socket above board'),
            'bit_insert': d(6.0, 'est', 'how far the micro:bit sinks into the socket'),
            'height': d(48.6, 'est', 'board bottom to top of the standing micro:bit'),
            'parts_h': d(13.0, 'est', 'terminal blocks and relay'),
            'dc_jack_x': d(29.0, 'photo', 'DC 2.1 jack on the far end, from the terminal-block edge'),
            'switch_x': d(15.0, 'photo', 'board power switch on the far end; stays ON, pack switch is the master'),
            'usb_x': d(42.0, 'photo', 'USB 5 V input on the far end'),
            'bit_face': d(None, 'tbd', 'which way the micro:bit LEDs face in the socket'),
        }),
    'huskylens': dict(
        label='HuskyLens AI camera', qty=1, sku='DFRobot SEN0305', color='#e8e8e8',
        role='Learns the mosquito and reports where it is. Top of the tilt head.',
        dims={
            'body_w': d(52.0, 'ds', 'layout drawing'),
            'body_h': d(36.2, 'ds'),
            'tab_w': d(22.0, 'ds', 'mounting tab below the body'),
            'tab_h': d(8.3, 'ds'),
            'tab_hole_pitch': d(15.0, 'ds', 'two M3 holes in the tab'),
            'tab_hole_y': d(40.2, 'step', 'from top edge of body'),
            'hole_d': d(3.2, 'est', 'M3'),
            'front_depth': d(8.8, 'step', 'lens side, dial is the tallest'),
            'back_depth': d(3.5, 'step', 'screen side'),
            'pcb_t': d(1.6, 'step'),
            'lens_x': d(-0.4, 'ds', 'lens center from body centerline'),
            'lens_y': d(12.1, 'ds', 'lens center from top edge'),
        }),
    'servo': dict(
        label='9g clutch servo', qty=3, sku='DFRobot SER0049', color='#474c55',
        role='Pan, tilt, and a spare. Clutch slips if a hand grabs the head.',
        dims={
            'body_w': d(23.0, 'ds', 'DFRobot drawing'),
            'body_d': d(12.0, 'ds'),
            'body_h': d(23.2, 'ds', 'bottom to top of case'),
            'flange_z': d(16.3, 'ds', 'bottom to underside of mounting ears'),
            'flange_t': d(2.5, 'est'),
            'flange_w': d(32.5, 'ds', 'ear tip to ear tip'),
            'hole_pitch': d(27.8, 'ds'),
            'hole_d': d(2.2, 'ds'),
            'spline_top': d(27.3, 'ds', 'bottom to top of output spline'),
            'shaft_x': d(5.4, 'ds', 'output shaft from body centerline, scaled from drawing'),
            'boss_d': d(11.8, 'est', 'round boss under the spline'),
            'spline_d': d(4.8, 'est'),
            'horn_hub_d': d(7.0, 'est'), 'horn_arm_len': d(16.0, 'est'), 'horn_t': d(1.6, 'est'),
            'lead': d(250, 'est', 'wire length, 3-pin 2.54 plug'),
        }),
    'laser': dict(
        label='Class 2 laser, under 1 mW', qty=1, sku='Quarton VLM-650-03 LPT', color='#b9bec6',
        role='Rides under the HuskyLens, aimed the same way.',
        dims={
            'd': d(7.0, 'ds', 'Quarton manual: 7 x 21 mm'),
            'len': d(21.0, 'ds'),
            'lens_d': d(5.0, 'ds', 'aspherical lens'),
            'spot_5m': d(6.0, 'ds', 'spot size at 5 m'),
            'note': d(None, 'ds', 'metal case is electrically positive: holder must insulate it, no metal clamps'),
        }),
    'arm_switch': dict(
        label='Laser arm switch', qty=1, sku='Adafruit 805 (DigiKey)', color='#5c6066',
        role='Cuts laser power. Mounted in the base where a grown-up can reach it.',
        dims={
            'body_w': d(8.6, 'est'), 'body_d': d(4.4, 'est'), 'body_h': d(4.0, 'est'),
            'lever_w': d(2.0, 'est'), 'lever_h': d(4.0, 'est'), 'lever_throw': d(3.0, 'est'),
            'pin_pitch': d(2.54, 'ds'),
        }),
    'light_sensor': dict(
        label='Light sensor ALS-PT19', qty=3, sku='Adafruit 2748 (DigiKey)', color='#3b4fc4',
        role='Inside the sensor pod on the mosquito. Feels the laser dot.',
        dims={
            'w': d(7.8, 'ds', 'Adafruit: 7.8 x 10.6 x 2.4 mm'),
            'l': d(10.6, 'ds'),
            'h': d(2.4, 'ds'),
            'pads': d(3, 'ds', 'VIN, GND, OUT along one short edge'),
        }),
    'led': dict(
        label='Red LED, 5 mm', qty=10, sku='Kingbright WP7113ID', color='#d8262a',
        role='Mosquito eyes, flash on a hit.',
        dims={
            'd': d(5.0, 'ds'), 'flange_d': d(5.8, 'ds'), 'flange_t': d(1.0, 'ds'),
            'h': d(8.6, 'ds', 'flange to dome tip'), 'hole_d': d(5.2, 'est', 'press-fit hole in print'),
        }),
    'speaker': dict(
        label='Speaker module', qty=1, sku='DFRobot FIT0449', color='#1d7a3a',
        role='Pew, boom, lock-on beep, victory sound. Faces the grille in the base.',
        dims={
            'pcb_w': d(40.0, 'ds', 'DFRobot: 40 x 40 mm'),
            'pcb_h': d(40.0, 'ds'),
            'pcb_t': d(1.6, 'est'),
            'spk_d': d(30.0, 'ds', 'scaled from dimension drawing'),
            'spk_h': d(5.0, 'est'),
            'hole_pitch': d(30.0, 'ds', 'M3 holes on a 30 x 30 square (Gravity standard)'),
            'hole_d': d(3.1, 'est'),
            'conn_h': d(6.0, 'est', 'Gravity PH2.0 socket on the top edge, back side'),
            'knob_h': d(5.0, 'est', 'volume pot, back side'),
        }),
    'bank': dict(
        label='USB-C power bank', qty=1, sku='Anker 321 (A1112), Walmart', color='#2b2f36',
        role='Turret power, steady 5 V (MOC-004). Lies flat on the right of the floor, ports forward. Charges through the side port.',
        dims={
            'w': d(45.8, 'ds', 'Anker: 97 x 45.8 x 22 mm'),
            'l': d(97.0, 'ds'),
            'h': d(23.0, 'ds', 'Anker says 22, a store says 0.9 in (22.9): design for 23'),
            'ports': d(None, 'tbd', 'USB-A and USB-C on the front end; exact spots unknown until it arrives'),
            'lights': d(None, 'tbd', 'where the 4 charge lights are'),
        }),
    'charge_port': dict(
        label='USB-C charge port', qty=1, sku='Adafruit 6069', color='#44484f',
        role='Panel USB-C socket in the right wall. Its short cable plugs into the bank (MOC-004).',
        dims={
            'hole_d': d(14.0, 'ds', 'Adafruit: fits holes 12 to 18 mm'),
            'max_panel': d(13.0, 'ds', 'panels up to 13 mm'),
            'body_d': d(12.0, 'est', 'threaded body behind the panel'),
            'body_l': d(18.0, 'est'),
            'nut_d': d(18.0, 'est'),
            'nut_t': d(3.0, 'est'),
            'bezel_d': d(17.0, 'est', 'lip outside the wall'),
            'bezel_t': d(2.5, 'est'),
            'cable': d(None, 'tbd', 'cable length not published'),
        }),
    'inline_switch': dict(
        label='In-line power switch', qty=1, sku='Adafruit 1125', color='#3a3f47',
        role='Main on/off (MOC-004). Sits in ribs on the right wall, rocker through a window. Between the barrel cable and the Xia mi jack.',
        dims={
            'l': d(38.0, 'est', 'size not published'),
            'w': d(18.0, 'est'),
            'h': d(13.0, 'est'),
            'rocker_l': d(12.0, 'est'),
            'rocker_w': d(8.0, 'est'),
            'rocker_h': d(3.0, 'est', 'above the body'),
            'rating': d(None, 'ds', '2 A, 2.1 mm jack in, plug out'),
        }),
    'aaa_pack': dict(
        label='2xAAA battery holder', qty=2, sku='DFRobot FIT0625', color='#50555e',
        role='Wand power; turret micro:bit backup power.',
        dims={
            'w': d(26.0, 'est', 'size not published'),
            'l': d(57.0, 'est'),
            'h': d(15.0, 'est'),
            'plug': d(None, 'ds', 'JST PH2.0 2-pin'),
        }),
    'stuffy': dict(
        label='Stuffed mosquito (to buy)', qty=1, sku='not chosen yet', color='#8a6d4b',
        role='Target on the fishing line. The printed sensor pod clips onto it.',
        dims={
            'len': d(80.0, 'tbd', 'placeholder until one is picked'),
            'span': d(70.0, 'tbd'),
            'h': d(30.0, 'tbd'),
        }),
}

# fastener rules used by every printed part
HARDWARE = {
    'm2_clear': d(2.2, 'ds', 'M2 clearance hole'),
    'm2_tap': d(1.7, 'est', 'M2 self-tap into PLA'),
    'm2_nut_af': d(4.0, 'ds', 'M2 nut across flats; trap prints at 4.3'),
    'm2_nut_t': d(1.6, 'ds'),
    'm2_head_d': d(3.8, 'ds'),
    'm3_clear': d(3.3, 'ds', 'HuskyLens only'),
    'm3_nut_af': d(5.5, 'ds'),
    'fit_clear': d(0.3, 'ds', 'per side, from print-part skill'),
    'min_wall': d(1.6, 'ds', '4 perimeters at 0.4 mm'),
    'bed': d((220, 220, 220), 'ds', 'Flashforge Adventurer 5M build volume'),
}


def V(name, key):
    return COMPONENTS[name]['dims'][key]['v']


# ---------------------------------------------------------------- stand-ins
def ghost_microbit():
    g = lambda k: V('microbit', k)
    w, h, t = g('pcb_w'), g('pcb_h'), g('pcb_t')
    parts = [box(-w/2, w/2, 0, h, 0, t)]                      # lying flat, front face up, edge conn at y=0
    for s in (-1, 1):                                          # buttons A and B
        parts.append(box(s*w/2 - s*9 - 3, s*w/2 - s*9 + 3, 18, 24, t, t + g('front_parts')))
    parts.append(box(-4, 4, h - 6, h, -g('back_parts') + 2.0, 0))       # USB (back)
    parts.append(box(g('bat_x') - 3, g('bat_x') + 3, h - 7, h - 1, -g('back_parts'), 0))  # battery socket
    s = union(parts)
    for x in (-19.5, -9.75, 0, 9.75, 19.5):                    # big edge-ring holes, pins 0 1 2 3V GND
        s = s - cyl(x, 4.5, -1, t + 1, 4.0)
    return s.translate([0, 0, g('back_parts')]), {'edge_y': 0.0, 'front_z': g('back_parts') + t}


def ghost_xiami():
    """Board lying flat, long side along y, socket end at y = 0, terminal blocks on the -x edge."""
    g = lambda k: V('xiami', k)
    w, l, t = g('pcb_w'), g('pcb_l'), g('pcb_t')
    sy = l - g('socket_from_end')
    parts = [box(-w/2, w/2, 0, l, 0, t),
             box(-w/2, -w/2 + 8, 8, l - 8, t, t + g('parts_h')),           # terminal blocks
             box(-w/2 + 10, w/2 - 6, sy + 8, l - 6, t, t + 6),              # everything else
             box(-26, 26, sy - 4, sy + 4, t, t + g('socket_h')),            # micro:bit socket
             box(-25.8, 25.8, sy - 0.8, sy + 0.8, t + g('socket_h') - g('bit_insert'), t + g('height') - 1.6 + 1.6),
             box(-25.8 + 20, -25.8 + 26, sy - 4.3, sy + 4.3, t + g('height') - 12, t + g('height') - 4)]  # bit parts
    parts.append(box(-w/2 + g('dc_jack_x') - 4.5, -w/2 + g('dc_jack_x') + 4.5, l - 14, l, t, t + 11))  # DC jack
    s = union(parts)
    for x in (-w/2 + g('hole_inset'), w/2 - g('hole_inset')):
        for y in (g('hole_inset'), l - g('hole_inset')):
            s = s - cyl(x, y, -1, t + 1, g('hole_d'))
    return s, {'socket_y': sy, 'top_z': g('height'),
               'holes': [(x, y) for x in (-w/2 + g('hole_inset'), w/2 - g('hole_inset')) for y in (g('hole_inset'), l - g('hole_inset'))],
               'dc_jack': (-w/2 + g('dc_jack_x'), l)}


HUSKY_REF = {'lens': (-0.4, 12.1, 5.1), 'tab_holes': [(-7.5, 40.2), (7.5, 40.2)],
             'pcb_z': (3.5, 5.1), 'front_z': 12.3, 'screen_z': 0.0}


def ghost_huskylens_mesh():
    """STEP tessellation (decimated to 8k faces) is not a closed solid; raw arrays for viewers."""
    dat = np.load(os.path.join(HERE, 'vendor', 'huskylens_lo.npz'))
    v = dat['v'].copy(); v[:, 0] -= 26.3; v[:, 2] += 3.5
    return v, dat['t']


def ghost_servo():
    g = lambda k: V('servo', k)
    bw, bd, bh = g('body_w'), g('body_d'), g('body_h')
    fz, ft, fw = g('flange_z'), g('flange_t'), g('flange_w')
    sx = g('shaft_x')
    s = union([box(-bw/2, bw/2, -bd/2, bd/2, 0, bh),
               box(-fw/2, fw/2, -bd/2, bd/2, fz, fz + ft),
               cyl(sx, 0, bh, bh + 2.6, g('boss_d')),
               cyl(sx - 5.5, 0, bh, bh + 1.8, 5.5),
               cyl(sx, 0, bh + 2.6, g('spline_top'), g('spline_d'))])
    for x in (-g('hole_pitch')/2, g('hole_pitch')/2):
        s = s - cyl(x, 0, fz - 1, fz + ft + 1, g('hole_d'))
    return s, {'shaft': (sx, 0.0, g('spline_top')), 'ear_z': (fz, fz + ft)}


def ghost_laser():
    g = lambda k: V('laser', k)
    s = union([M.cylinder(g('len'), g('d')/2, g('d')/2, 48).rotate([-90, 0, 0]).translate([0, 0, g('d')/2]),
               M.cylinder(4, 0.8, 0.8, 12).rotate([90, 0, 0]).translate([-1.2, 0, g('d')/2]),
               M.cylinder(4, 0.8, 0.8, 12).rotate([90, 0, 0]).translate([1.2, 0, g('d')/2])])
    return s, {'axis_z': g('d')/2, 'beam': '+y', 'front_y': g('len')}


def ghost_arm_switch():
    g = lambda k: V('arm_switch', k)
    s = union([box(-g('body_w')/2, g('body_w')/2, -g('body_d')/2, g('body_d')/2, 0, g('body_h')),
               box(-g('lever_w')/2 - 1.5, g('lever_w')/2 - 1.5, -0.8, 0.8, g('body_h'), g('body_h') + g('lever_h'))]
              + [box(x - .3, x + .3, -.3, .3, -3.5, 0) for x in (-2.54, 0, 2.54)])
    return s, {}


def ghost_light_sensor():
    g = lambda k: V('light_sensor', k)
    s = union([box(-g('w')/2, g('w')/2, 0, g('l'), 0, 1.6),
               box(-1, 1, 6.5, 8.2, 1.6, g('h'))])
    for x in (-2.54, 0, 2.54):
        s = s - cyl(x, 1.6, -1, 3, 1.0, 16)
    return s, {'eye': (0, 7.35, g('h'))}


def ghost_led():
    g = lambda k: V('led', k)
    r = g('d')/2
    s = union([cyl(0, 0, 0, g('flange_t'), g('flange_d')),
               cyl(0, 0, g('flange_t'), g('h') - r, g('d')),
               M.sphere(r, 32).translate([0, 0, g('h') - r]),
               box(-1.6, -1.1, -.25, .25, -6, 0), box(1.1, 1.6, -.25, .25, -8, 0)])
    return s, {}


def ghost_speaker():
    g = lambda k: V('speaker', k)
    w, t = g('pcb_w'), g('pcb_t')
    s = union([box(-w/2, w/2, 0, w, 0, t),
               cyl(0, w/2, t, t + g('spk_h'), g('spk_d')),
               box(-5, 5, w - 6, w, -g('conn_h'), 0),
               cyl(-12, 8, -g('knob_h'), 0, 6)])
    hp = g('hole_pitch') / 2
    for x in (-hp, hp):
        for y in (w/2 - hp, w/2 + hp):
            s = s - cyl(x, y, -1, t + 1, g('hole_d'))
    return s.translate([0, 0, g('conn_h')]), {'cone_face_z': g('conn_h') + t + g('spk_h')}


def ghost_pack(name):
    g = lambda k: V(name, k)
    w, l, h = g('w'), g('l'), g('h')
    s = box(-w/2, w/2, 0, l, 0, h)
    s = s + box(-3, 3, l, l + 2, h/2 - 1.5, h/2 + 1.5)          # lead exit
    return s, {}


def ghost_bank():
    """Bank lying flat, ports at y = 0 (front end)."""
    g = lambda k: V('bank', k)
    w, l, h = g('w'), g('l'), g('h')
    s = box(-w/2, w/2, 0, l, 0, h)
    for x0, x1 in ((-14, -2), (4, 13)):                          # port marks (spots are placeholders)
        s = s - box(x0, x1, -1, 3, h/2 - 3, h/2 + 3)
    return s, {}


def ghost_charge_port():
    """Axis along +z = out of the panel. Panel inner face at z = 0."""
    g = lambda k: V('charge_port', k)
    s = union([cyl(0, 0, -g('body_l'), 0, g('body_d')),
               cyl(0, 0, -g('nut_t'), 0, g('nut_d')),
               cyl(0, 0, 2.0, 2.0 + g('bezel_t'), g('bezel_d')),
               cyl(0, 0, 0, 2.0, g('hole_d') - 0.4)])
    return s - cyl(0, 0, 1.0, 5, 8.5), {}


def ghost_inline_switch():
    """Body along y, rocker up (+z)."""
    g = lambda k: V('inline_switch', k)
    l, w, h = g('l'), g('w'), g('h')
    s = union([box(-w/2, w/2, 0, l, 0, h),
               box(-g('rocker_w')/2, g('rocker_w')/2, l/2 - g('rocker_l')/2, l/2 + g('rocker_l')/2, h, h + g('rocker_h')),
               ])
    for yy in (-10, l):
        s = s + box(-2, 2, yy, yy + 10, h/2 - 2, h/2 + 2)       # cord stubs
    return s, {}


def ghost_stuffy():
    g = lambda k: V('stuffy', k)
    body = M.sphere(1, 32).scale([g('h')/2 * .7, g('len')/2, g('h')/2]).translate([0, g('len')/2, g('h')/2])
    wing = box(-g('span')/2, g('span')/2, g('len')*.35, g('len')*.55, g('h')*.6, g('h')*.66)
    return body + wing, {}


GHOSTS = {
    'microbit': ghost_microbit, 'xiami': ghost_xiami, 'servo': ghost_servo, 'laser': ghost_laser,
    'arm_switch': ghost_arm_switch, 'light_sensor': ghost_light_sensor, 'led': ghost_led,
    'speaker': ghost_speaker, 'bank': ghost_bank,
    'charge_port': ghost_charge_port, 'inline_switch': ghost_inline_switch,
    'aaa_pack': lambda: ghost_pack('aaa_pack'), 'stuffy': ghost_stuffy,
}


def arrays(name):
    """(vertices, faces, ref) for any component, in its own frame."""
    if name == 'huskylens':
        v, f = ghost_huskylens_mesh()
        return v, f, HUSKY_REF
    s, ref = GHOSTS[name]()
    mm = s.to_mesh()
    return np.array(mm.vert_properties)[:, :3], np.array(mm.tri_verts), ref

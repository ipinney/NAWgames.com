"""Flying Mosquito: bought-part dimensions with a basis for every number.

basis: ds = datasheet / seller page / design files, est = estimate (check with calipers on arrival), tbd = unknown.
Frame (the drone): x right, y forward (toward the MS-2000), z up. Origin = center of the LiteWing PCB, z = 0 its
bottom face. The PCB outline comes from the open KiCad file (LiteWing V2.6.C, vendor/litewing_edge.json).
"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))


def d(v, basis, note=''):
    return {'v': v, 'basis': basis, 'note': note}


C = {
    'litewing': dict(label='LiteWing ESP32-S3 drone', dims={
        'size': d(100.0, 'ds', 'KiCad Edge.Cuts: 100.0 x 100.0 mm'),
        'pcb_t': d(1.6, 'est', 'standard FR4'),
        'motor_xy': d(42.0, 'ds', 'motor clamp centers at (+-42, +-42) from KiCad'),
        'clamp_r': d(4.4, 'ds', 'motor clamp outer radius in the PCB'),
        'strap_x': d(20.0, 'ds', 'battery strap slots at x = +-20, 1 x 9 mm'),
        'mass': d(45.0, 'ds', 'wiki: ~45 g without battery'),
        'payload': d(25.0, 'ds', 'wiki: ~25 g with 55 mm props'),
    }),
    'motor': dict(label='720 coreless motor', dims={
        'd': d(7.0, 'ds', '720 = 7 mm x 20 mm can'),
        'len': d(20.0, 'ds'),
        'below': d(10.0, 'est', 'can length under the PCB bottom; CALIPER'),
        'prop_z': d(9.0, 'est', 'prop plane above the PCB bottom; CALIPER'),
    }),
    'prop': dict(label='55 mm propeller', dims={'d': d(55.0, 'ds', 'wiki: 55 or 65 mm props, 55 mm stock')}),
    'posmod': dict(label='Positioning module (flow + ToF)', dims={
        'w': d(46.0, 'ds', 'wiki: 46 x 44 mm'), 'l': d(44.0, 'ds'), 'mass': d(8.0, 'ds'),
        'drop': d(12.5, 'est', 'module bottom below PCB bottom (female header 8.5 + pins); CALIPER'),
    }),
    'battery': dict(label='1S LiPo, MX2.0 plug', dims={
        'l': d(48.0, 'est', 'depends on the pack bought; CALIPER'),
        'w': d(25.0, 'est'), 'h': d(9.0, 'est'), 'mass': d(16.0, 'est'),
    }),
    'xiao': dict(label='Seeed XIAO ESP32-C3', dims={
        'l': d(21.0, 'ds', 'Seeed: 21 x 17.8 mm'), 'w': d(17.8, 'ds'), 'h': d(3.5, 'est', 'board + USB-C'),
        'mass': d(1.5, 'est'),
    }),
    'light_sensor': dict(label='ALS-PT19 breakout', dims={
        'w': d(7.8, 'ds', 'Adafruit 2748: 7.8 x 10.6 x 2.4'), 'l': d(10.6, 'ds'), 'h': d(2.4, 'ds'),
    }),
    'pi': dict(label='Raspberry Pi Zero 2 W', dims={
        'l': d(65.0, 'ds', '65 x 30 mm'), 'w': d(30.0, 'ds'), 'hole_dx': d(58.0, 'ds'), 'hole_dy': d(23.0, 'ds'),
        'hole_d': d(2.75, 'ds', 'M2.5'), 'h': d(5.0, 'est', 'tallest part, USB and HDMI'),
    }),
    'microbit': dict(label='micro:bit V2', dims={
        'w': d(51.6, 'ds'), 'h': d(42.0, 'ds'), 't': d(1.6, 'ds'),
        'led_w': d(22.0, 'est', 'LED grid area'), 'btn_dx': d(40.0, 'est', 'A to B button spacing'),
    }),
    'button': dict(label='24 mm arcade button', dims={'hole': d(24.0, 'est', 'Adafruit 3430 panel hole; CALIPER')}),
    'bank': dict(label='Anker 321 power bank', dims={
        'w': d(45.8, 'ds', 'Anker: 97 x 45.8 x 22, design for 23'), 'l': d(97.0, 'ds'), 'h': d(23.0, 'ds'),
    }),
}


def V(name, key):
    return C[name]['dims'][key]['v']


def edge():
    return json.load(open(os.path.join(HERE, 'vendor', 'litewing_edge.json')))

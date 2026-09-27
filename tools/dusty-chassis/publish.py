"""Copy a finished build into the site with the revision tag in every file name, and delete the
files of the previous revision so an old download can never be mistaken for the current one.

Usage: python3 publish.py OUT_DIR   (OUT_DIR from run.sh; plates sliced with orca/build3mf.py REV first)
Fit-check and hole-test files are history and stay as they are.
"""
import os, sys, glob, shutil, zipfile, re
from rev import REV

OUT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
DEST = os.path.join(TOOLS, '..', 'public', 'projects', 'nolan', 'dusty-files')
FF = '/opt/ffstudio/work'
HISTORY = re.compile(r'^dusty-(fit-check|hole-test)')
PLATES = {1: 'fit-check', 2: 'base', 3: 'deck-and-arms', 4: 'brush-drive', 5: 'tray'}

# 1. remove every current download that is not tagged with this revision
gone = []
for f in sorted(os.listdir(DEST)):
    p = os.path.join(DEST, f)
    if not os.path.isfile(p) or not f.startswith('dusty-') or HISTORY.match(f):
        continue
    if not f.endswith(('.stl', '.3mf', '.gcode', '.zip', '.html', '.png')) or f in ('dusty-hero.png', 'dusty-og.png'):
        continue
    if f'-{REV}' in f:
        continue
    os.remove(p); gone.append(f)

# 2. copy the new files
new = []
def put(src, name):
    shutil.copyfile(src, os.path.join(DEST, name)); new.append(name)

for s in sorted(glob.glob(os.path.join(OUT, 'stl', f'*-{REV}.stl'))) + [os.path.join(OUT, 'stl', f'dusty-chassis-{REV}-stl.zip')]:
    put(s, os.path.basename(s))
for n, slug in PLATES.items():
    stem = f'dusty-plate-{n}-{slug}-{REV}'
    put(os.path.join(OUT, 'plates', stem + '.stl'), stem + '.stl')
    put(os.path.join(OUT, 'plates', stem + '.png'), stem + '.png')
    put(os.path.join(FF, 'out', stem + '.3mf'), stem + '.3mf')
    g = glob.glob(os.path.join(FF, f'slice{n}', '*.gcode'))
    assert len(g) == 1, g
    put(g[0], stem + '.gcode')
put(os.path.join(OUT, 'dusty-chassis.html'), f'dusty-chassis-3d-{REV}.html')
put(os.path.join(OUT, 'dusty-components.html'), f'dusty-components-3d-{REV}.html')

# 3. source zip: the CAD, slicing and picture scripts
src = os.path.join(DEST, f'dusty-3d-source-{REV}.zip')
with zipfile.ZipFile(src, 'w', zipfile.ZIP_DEFLATED) as z:
    for d in ('dusty-chassis', 'dusty-dustpan', 'dusty-guide', 'dusty-howto'):
        root = os.path.join(TOOLS, d)
        for dp, dns, fns in os.walk(root):
            dns[:] = sorted(x for x in dns if x not in ('__pycache__', 'out'))
            rel = os.path.relpath(dp, TOOLS)
            z.write(dp, rel)
            for fn in sorted(fns):
                if fn.endswith('.pyc'):
                    continue
                z.write(os.path.join(dp, fn), os.path.join(rel, fn))
new.append(os.path.basename(src))

print('removed', len(gone)); [print('  -', f) for f in gone]
print('published', len(new)); [print('  +', f) for f in new]

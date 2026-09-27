"""Copy a finished build into the site. Each download carries the revision in which it last changed:
a part or plate whose file is byte-identical to the one already published keeps its old name and file,
and only files that changed get the new revision tag (their old versions are deleted). Whole-design
bundles (viewers, STL zip, all-parts plate, source zip) always take the new tag.

Usage: python3 publish.py OUT_DIR   (OUT_DIR from run.sh; plates sliced with orca/build3mf.py REV first)
Fit-check and hole-test files are history and stay as they are.
"""
import os, sys, glob, shutil, zipfile, re, filecmp
from rev import REV

OUT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
DEST = os.path.join(TOOLS, '..', 'public', 'projects', 'nolan', 'dusty-files')
FF = '/opt/ffstudio/work'
PLATES = {1: 'fit-check', 2: 'base', 3: 'deck-and-arms', 4: 'brush-drive', 5: 'tray'}
RX = re.compile(r'-rev[A-Z]\d+')

def current(name):
    """The published file for this download, whatever revision it carries."""
    pat = RX.sub('-rev*', name)
    hits = [f for f in glob.glob(os.path.join(DEST, pat)) if RX.search(os.path.basename(f))]
    return hits[0] if hits else None

kept, new, gone = [], [], []
def put(src, name, same=None):
    """same=None: compare bytes. same=True/False: decided by the caller (plate files follow their STL)."""
    old = current(name)
    if old and (filecmp.cmp(src, old, shallow=False) if same is None else same):
        kept.append(os.path.basename(old)); return os.path.basename(old)
    if old and os.path.basename(old) != name:
        os.remove(old); gone.append(os.path.basename(old))
    shutil.copyfile(src, os.path.join(DEST, name)); new.append(name); return name

for s in sorted(glob.glob(os.path.join(OUT, 'stl', f'*-{REV}.stl'))):
    b = os.path.basename(s)
    if b.startswith('dusty-chassis-all-parts-plate'):
        continue
    put(s, b)
for n, slug in PLATES.items():
    stem = f'dusty-plate-{n}-{slug}-{REV}'
    kept_stl = put(os.path.join(OUT, 'plates', stem + '.stl'), stem + '.stl') != stem + '.stl'
    put(os.path.join(OUT, 'plates', stem + '.png'), stem + '.png', same=kept_stl or None)
    put(os.path.join(FF, 'out', stem + '.3mf'), stem + '.3mf', same=kept_stl)
    g = glob.glob(os.path.join(FF, f'slice{n}', '*.gcode'))
    assert len(g) == 1, g
    put(g[0], stem + '.gcode', same=kept_stl)

# bundles: always the new revision
def bundle(src, name):
    old = current(name)
    if old and os.path.basename(old) != name:
        os.remove(old); gone.append(os.path.basename(old))
    shutil.copyfile(src, os.path.join(DEST, name)); new.append(name)
bundle(os.path.join(OUT, 'stl', f'dusty-chassis-all-parts-plate-{REV}.stl'), f'dusty-chassis-all-parts-plate-{REV}.stl')
bundle(os.path.join(OUT, 'dusty-chassis.html'), f'dusty-chassis-3d-{REV}.html')
bundle(os.path.join(OUT, 'dusty-components.html'), f'dusty-components-3d-{REV}.html')

# STL zip holds the published part files under their published names
zp = os.path.join(DEST, f'dusty-chassis-{REV}-stl.zip')
old = current(os.path.basename(zp))
if old and old != zp:
    os.remove(old); gone.append(os.path.basename(old))
parts = sorted(f for f in os.listdir(DEST) if f.endswith('.stl') and RX.search(f) and not f.startswith(('dusty-plate-',)))
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in parts:
        z.write(os.path.join(DEST, f), f)
new.append(os.path.basename(zp))

# source zip: the CAD, slicing and picture scripts
src = os.path.join(DEST, f'dusty-3d-source-{REV}.zip')
old = current(os.path.basename(src))
if old and old != src:
    os.remove(old); gone.append(os.path.basename(old))
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

print('kept', len(kept)); [print('  =', f) for f in kept]
print('removed', len(gone)); [print('  -', f) for f in gone]
print('published', len(new)); [print('  +', f) for f in new]

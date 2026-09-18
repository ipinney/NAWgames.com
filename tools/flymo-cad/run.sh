#!/bin/sh
# Rebuild every part, the drone viewer and the hero, then publish: ./run.sh   (then ./plates.sh to re-slice)
set -e
PY=${PY:-/opt/cad-venv/bin/python}
cd "$(dirname "$0")"
OUT=out
for f in parts/f*.py; do $PY "$f" $OUT/parts; done
$PY make_drone3d.py $OUT          # also runs make_assembly.py (flymo-drone + weights.json)
PUB=../../public/projects/addie/flymo-cad
mkdir -p $PUB/stl
cp $OUT/flymo-drone-3d.html $OUT/flymo-drone.html $OUT/weights.json $PUB/
cp $OUT/parts/*.html $PUB/
cp $OUT/parts/*.stl $OUT/flymo-drone.stl $PUB/stl/
/opt/batchzero/venv/bin/python make_hero.py $OUT/flymo-drone-3d.html $OUT/flymo-hero.png
/opt/cad-venv/bin/python - <<'PY'
from PIL import Image
im = Image.open('out/flymo-hero.png').convert('RGB')
w, h = im.size; ch = int(w * 630 / 1200)          # the drone sits in the lower part of the render
im.crop((0, h - ch, w, h)).resize((1200, 630)).save('../../public/projects/addie/flymo-og.jpg', quality=88)
im.crop((0, h - ch - 60, w, h)).resize((720, int(720 * (ch + 60) / w))).save('../../public/projects/addie/flymo-hero.jpg', quality=88)
PY
echo published to $PUB

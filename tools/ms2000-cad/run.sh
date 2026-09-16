#!/bin/sh
# Rebuild everything and copy the web files: PY=/opt/cad-venv/bin/python ./run.sh
set -e
PY=${PY:-/opt/cad-venv/bin/python}
cd "$(dirname "$0")"
OUT=out
$PY make_components.py $OUT
for f in parts/p*.py; do [ -f "$f" ] && $PY "$f" $OUT/parts; done
$PY make_assembly.py $OUT
$PY make_setup.py $OUT
$PY make_turret3d.py $OUT
PUB=../../public/projects/addie/ms2000-cad
mkdir -p $PUB/stl
cp $OUT/ms2000-components.html $OUT/ms2000-turret.html $OUT/ms2000-3d.html $OUT/ms2000-turret-3d.html $OUT/ms2000-dims.json $PUB/
[ -d $OUT/parts ] && cp $OUT/parts/*.html $PUB/ 2>/dev/null || true
[ -d $OUT/parts ] && cp $OUT/parts/*.stl $PUB/stl/ 2>/dev/null || true
$PY make_index.py $PUB/index.html
[ -x /opt/batchzero/venv/bin/python ] && /opt/batchzero/venv/bin/python make_hero.py $PUB/ms2000-turret-3d.html ../../public/projects/addie/ms2000-hero.png || echo 'skip hero (needs playwright)'
echo published to $PUB

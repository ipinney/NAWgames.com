#!/bin/sh
# Rebuild everything and copy the web files: PY=/opt/cad-venv/bin/python ./run.sh
set -e
PY=${PY:-/opt/cad-venv/bin/python}
cd "$(dirname "$0")"
OUT=out
$PY make_components.py $OUT
for f in parts/p*.py; do [ -f "$f" ] && $PY "$f" $OUT/parts; done
PUB=../../public/projects/addie/ms2000-cad
mkdir -p $PUB/stl
cp $OUT/ms2000-components.html $OUT/ms2000-dims.json $PUB/
[ -d $OUT/parts ] && cp $OUT/parts/*.html $PUB/ 2>/dev/null || true
[ -d $OUT/parts ] && cp $OUT/parts/*.stl $PUB/stl/ 2>/dev/null || true
echo published to $PUB

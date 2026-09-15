#!/bin/sh
# Rebuild everything: PY=/opt/cad-venv/bin/python ./run.sh OUT_DIR [back-link]
set -e
PY=${PY:-python3}
cd "$(dirname "$0")"
OUT=${1:-out}
[ -f parts/motor_bracket.npz ] || $PY parts.py
$PY assemble.py "$OUT"
$PY export.py "$OUT/stl"
$PY make_viewer.py "$OUT" "$OUT/dusty-chassis.html" "$2"
$PY make_catalog.py "$OUT"
$PY plates.py "$OUT/stl" "$OUT/plates"
[ -x /opt/batchzero/venv/bin/python ] && /opt/batchzero/venv/bin/python render_plates.py "$OUT/plates" || echo "skip plate renders (needs playwright)"

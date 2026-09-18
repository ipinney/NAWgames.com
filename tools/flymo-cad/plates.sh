#!/bin/sh
# Lay out and slice the 7 print plates, then publish the 3mf files: ./plates.sh   (run ./run.sh first)
set -e
cd "$(dirname "$0")"
PY=${PY:-/opt/cad-venv/bin/python}
W=/opt/ffstudio/work/flymo
$PY plates.py out/parts $W
python3 orca/build3mf.py
./publish_plates.sh

#!/bin/sh
# Lay out and slice the print plates, then publish them: ./plates.sh  (run ./run.sh first)
set -e
cd "$(dirname "$0")"
PY=${PY:-/opt/cad-venv/bin/python}
W=/opt/ffstudio/work/ms2000
$PY plates.py out/parts $W
python3 orca/build3mf.py
PUB=../../public/projects/addie/ms2000-cad/plates
mkdir -p $PUB
cp $W/out/*.3mf $PUB/   # gcode stays on the server (21 MB); Flash Studio re-slices the 3mf in seconds
python3 - <<'PY'
import json
W='/opt/ffstudio/work/ms2000'
meta=json.load(open(f'{W}/plates.json')); s=json.load(open(f'{W}/out/summary.json'))
for m in meta:
    x=s[str(m['n'])]; m['time']=x['time']; m['grams']=x['grams']
json.dump(meta,open('plates-summary.json','w'),indent=1)
json.dump(meta,open('../../public/projects/addie/ms2000-cad/plates/plates.json','w'),indent=1)
print('\n'.join(f"{m['n']} {m['title']}: {m['time']}, {m['grams']} g" for m in meta))
PY
$PY make_index.py ../../public/projects/addie/ms2000-cad/index.html

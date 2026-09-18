#!/bin/sh
# Copy sliced plates to the site and write plates.json (time, grams): ./publish_plates.sh
set -e
cd "$(dirname "$0")"
W=/opt/ffstudio/work/flymo
PUB=../../public/projects/addie/flymo-cad/plates
mkdir -p $PUB
cp $W/out/*.3mf $PUB/
python3 - <<'PY'
import json
W='/opt/ffstudio/work/flymo'
meta=json.load(open(f'{W}/plates.json')); s=json.load(open(f'{W}/out/summary.json'))
for m in meta:
    x=s[str(m['n'])]; m['time']=x['time']; m['grams']=x['grams']; m['file']=x['file']
json.dump(meta,open('plates-summary.json','w'),indent=1)
json.dump(meta,open('../../public/projects/addie/flymo-cad/plates/plates.json','w'),indent=1)
print('\n'.join(f"{m['n']} {m['title']}: {m['time']}, {m['grams']} g" for m in meta))
PY

"""Write the primary parts to the MS-2000 build page data file.
Usage: python3 export_parts.py  (from this folder)"""
import json
src = open('build.py').read()
ns = {}
exec(src[:src.index('def total(')], ns)
out = []
for it in ns['P']:
    p = it['pri']; q = p['qty'] or it['qty']
    ext = None if p['unit'] is None else (p['ext'] if p['ext'] is not None else round(p['unit'] * q, 2))
    out.append(dict(sec=it['sec'], name=it['name'], qty=q, role=it['role'], vendor=p['v'], pn=p['pn'],
                    title=p['title'], price=ext, url=p['url']))
local = [dict(name=a, qty=b, where=c) for a, b, c in ns['LOCAL']]
js = '// Generated from tools/ms2000-parts-list/build.py (primary parts). Regenerate with tools/ms2000-parts-list/export_parts.py\n'
js += 'export const BUY = ' + json.dumps(out, indent=1) + ';\n\nexport const LOCAL = ' + json.dumps(local, indent=1) + ';\n'
open('../../src/app/projects/addie/mosquito-turret/parts.js', 'w').write(js)
print('wrote', len(out), 'parts')

"""Plate file for fit check 2 (5 posts + 5 motor gears). Put the STLs in /opt/ffstudio/work/plate6 first."""
import re, os, glob, shutil, json
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build3mf.py')).read()
exec(src.split("os.makedirs(f'{W}/out'")[0])
PLATES[6] = ('fit-check-2', 'Fit check 2: hole sizes')
os.makedirs(f'{W}/out', exist_ok=True)
m, p, f = f'{W}/m.json', f'{W}/p.json', f'{W}/f.json'
n, (slug, title) = 6, PLATES[6]
stls = ' '.join(sorted(glob.glob(f'{W}/plate6/*.stl'))).replace(W + '/', '')
raw = f'{W}/raw'; shutil.rmtree(raw, ignore_errors=True); os.makedirs(raw)
run(f'--arrange 0 --orient 0 --load-settings "{m};{p}" --load-filaments "{f}" --outputdir {raw} --export-3mf p6.3mf {stls}', f'{W}/log_export_6.txt')
final = f'{W}/out/dusty-fit-check-2.3mf'
rewrite(f'{raw}/p6.3mf', final, n, True)
sl = f'{W}/slice6'; shutil.rmtree(sl, ignore_errors=True); os.makedirs(sl)
run(f'--slice 0 --outputdir {sl} {final}', f'{W}/log_slice_6.txt')
g = glob.glob(f'{sl}/*.gcode'); head = open(g[0]).read()
tm_ = re.search(r'; (?:estimated printing time|model printing time)[^=]*= *([^\n]+)', head)
gr = re.search(r'; filament used \[g\] = *([^\n]+)', head)
shutil.copy(g[0], f'{W}/out/dusty-fit-check-2.gcode')
print(tm_.group(1) if tm_ else None, gr.group(1) if gr else None)

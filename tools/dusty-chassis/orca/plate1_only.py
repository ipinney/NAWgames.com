"""Re-slice plate 1 only (same settings as build3mf.py)."""
import os, re, glob, shutil, json
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build3mf.py')).read()
exec(src.split("os.makedirs(f'{W}/out'")[0])
os.chdir(W)
m, p, f = f'{W}/m.json', f'{W}/p.json', f'{W}/f.json'
n = 1; slug, title = PLATES[1]
stls = ' '.join(sorted(glob.glob('plate1/*.stl')))
raw = f'{W}/raw'; shutil.rmtree(raw, ignore_errors=True); os.makedirs(raw)
run(f'--arrange 0 --orient 0 --load-settings "{m};{p}" --load-filaments "{f}" --outputdir {raw} --export-3mf p1.3mf {stls}', f'{W}/log_export_1.txt')
final = f'{W}/out/dusty-plate-1-{slug}.3mf'
rewrite(f'{raw}/p1.3mf', final, 1, True)
sl = f'{W}/slice1'; shutil.rmtree(sl, ignore_errors=True); os.makedirs(sl)
run(f'--slice 0 --outputdir {sl} {final}', f'{W}/log_slice_1.txt')
head = open(glob.glob(f'{sl}/*.gcode')[0]).read(200000)
t = re.search(r'; (?:estimated printing time|model printing time)[^=]*= *([^\n]+)', head).group(1)
g = re.search(r'; filament used \[g\] = *([^\n]+)', head).group(1)
s = json.load(open(f'{W}/out/summary.json')); s['1'].update(time=t, grams=g); json.dump(s, open(f'{W}/out/summary.json', 'w'), indent=1)
print(t, g)

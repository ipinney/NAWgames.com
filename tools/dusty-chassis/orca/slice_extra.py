"""Slice an extra test plate: python3 slice_extra.py N STEM TITLE  (STLs in /opt/ffstudio/work/plateN)"""
import re, os, sys, glob, shutil
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build3mf.py')).read()
exec(src.split("os.makedirs(f'{W}/out'")[0])
n, stem, title = int(sys.argv[1]), sys.argv[2], sys.argv[3]
PLATES[n] = (stem, title)
os.chdir(W); os.makedirs('out', exist_ok=True)
m, p, f = f'{W}/m.json', f'{W}/p.json', f'{W}/f.json'
stls = ' '.join(sorted(glob.glob(f'plate{n}/*.stl')))
raw = f'{W}/raw'; shutil.rmtree(raw, ignore_errors=True); os.makedirs(raw)
run(f'--arrange 0 --orient 0 --load-settings "{m};{p}" --load-filaments "{f}" --outputdir {raw} --export-3mf p{n}.3mf {stls}', f'{W}/log_export_{n}.txt')
final = f'{W}/out/{stem}.3mf'
rewrite(f'{raw}/p{n}.3mf', final, n, True)
sl = f'{W}/slice{n}'; shutil.rmtree(sl, ignore_errors=True); os.makedirs(sl)
run(f'--slice 0 --outputdir {sl} {final}', f'{W}/log_slice_{n}.txt')
g = glob.glob(f'{sl}/*.gcode')[0]; shutil.copy(g, f'{W}/out/{stem}.gcode')
head = open(g).read(200000)
print(stem, re.search(r'; (?:estimated printing time|model printing time)[^=]*= *([^\n]+)', head).group(1), re.search(r'; filament used \[g\] = *([^\n]+)', head).group(1))

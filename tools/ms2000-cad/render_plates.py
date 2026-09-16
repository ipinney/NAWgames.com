"""Plate thumbnails for the MS-2000 print and build plan (900x600 PNG each).
Two steps, two pythons:
  /opt/cad-venv/bin/python render_plates.py dump   /opt/ffstudio/work/ms2000 /tmp/ms2000-plates.json
  /opt/batchzero/venv/bin/python render_plates.py render /tmp/ms2000-plates.json OUT_DIR
Reads the bed-centered per-object STLs that plates.py writes (plate<N>/<part>_<i>.stl)."""
import os, sys, json

COLOR = {'shell': 0xff5fa8, 'floor': 0xb07aff, 'foot': 0x5cc98a, 'yoke': 0xff9a3c, 'head': 0x4aa8ff,
         'pin': 0xf0b43c, 'wand': 0x7fe3a0, 'pod_back': 0xff6f9a, 'pod_front': 0xf4f4f4,
         'cable_clips': 0xe8e8e8, 'pendulum': 0xf0b43c, 'clip': 0x8fd3ea}


def dump(work, out):
    import trimesh, numpy as np
    meta = json.load(open(os.path.join(work, 'plates.json')))
    data = []
    for m in meta:
        d = os.path.join(work, f"plate{m['n']}")
        parts = []
        for fn in sorted(os.listdir(d)):
            if not fn.endswith('.stl'):
                continue
            name = fn.rsplit('_', 1)[0]
            t = trimesh.load(os.path.join(d, fn), process=False)
            if len(t.faces) > 60000:
                t = t.simplify_quadric_decimation(face_count=60000)
            lo, hi = t.bounds
            parts.append({'v': np.round(t.vertices, 2).flatten().tolist(),
                          'f': t.faces.flatten().tolist(),
                          'c': COLOR.get(name, 0xff5fa8),
                          'brim': [] if name in ('pin', 'cable_clips') else
                          [float(lo[0] - 5), float(lo[1] - 5), float(hi[0] + 5), float(hi[1] + 5)]})
        data.append({'stem': f"ms2000-plate-{m['n']}-{m['slug']}", 'parts': parts})
    json.dump(data, open(out, 'w'))
    print('dumped', len(data), 'plates')


PAGE = """<!doctype html><html><body style="margin:0;background:#0d1b2e">
<canvas id="c" width="900" height="600"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const D = __DATA__;
const r = new THREE.WebGLRenderer({canvas: document.getElementById('c'), antialias: true});
r.setPixelRatio(1); r.setSize(900, 600, false);
const s = new THREE.Scene(); s.background = new THREE.Color(0x0d1b2e);
const cam = new THREE.PerspectiveCamera(30, 1.5, 1, 3000);
s.add(new THREE.HemisphereLight(0xcfe3ff, 0x1a2436, .8));
const sun = new THREE.DirectionalLight(0xffffff, .8); sun.position.set(120, 260, 180); s.add(sun);
const bed = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.MeshBasicMaterial({color: 0x16304f}));
bed.rotation.x = -Math.PI / 2; s.add(bed);
const g = new THREE.GridHelper(220, 22, 0x2a4a73, 0x1f3a5f); g.position.y = .05; s.add(g);
const lm = new THREE.LineDashedMaterial({color: 0x8fd3ea, dashSize: 2, gapSize: 2});
D.parts.forEach(p => {
  const v = p.v, pos = new Float32Array(v.length);
  for (let i = 0; i < v.length; i += 3) { pos[i] = v[i]; pos[i+1] = v[i+2]; pos[i+2] = -v[i+1]; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(p.f);
  const ng = geo.toNonIndexed(); ng.computeVertexNormals();
  s.add(new THREE.Mesh(ng, new THREE.MeshStandardMaterial({color: p.c, roughness: .55, side: THREE.DoubleSide})));
  s.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({color: 0x000000, transparent: true, opacity: .3})));
  if (p.brim.length) {
    const [x0, y0, x1, y1] = p.brim, y = .1;
    const pts = [[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]].map(q => new THREE.Vector3(q[0], y, -q[1]));
    const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm); ln.computeLineDistances(); s.add(ln);
  }
});
cam.position.set(0, 230, 250); cam.lookAt(0, 10, -5);
r.render(s, cam);
document.title = 'done';
</script></body></html>"""


def render(src, outdir):
    from playwright.sync_api import sync_playwright
    data = json.load(open(src))
    os.makedirs(outdir, exist_ok=True)
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
        for plate in data:
            pg = b.new_page(viewport={'width': 900, 'height': 600})
            pg.on('pageerror', lambda e: print('page error', e))
            path = f"/tmp/{plate['stem']}.render.html"
            open(path, 'w').write(PAGE.replace('__DATA__', json.dumps(plate)))
            pg.goto('file://' + path)
            pg.wait_for_function("document.title === 'done'", timeout=120000)
            pg.wait_for_timeout(300)
            pg.screenshot(path=os.path.join(outdir, plate['stem'] + '.png'))
            pg.close(); os.remove(path)
            print('rendered', plate['stem'])
        b.close()


if __name__ == '__main__':
    {'dump': dump, 'render': render}[sys.argv[1]](sys.argv[2], sys.argv[3])

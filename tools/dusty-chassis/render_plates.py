"""Render plate thumbnails with three.js (headless Chromium).
Usage: /opt/batchzero/venv/bin/python render_plates.py PLATES_DIR
Reads plates.json and the per-plate .npz written by plates.py."""
import os, sys, json, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from playwright.sync_api import sync_playwright

OUT = sys.argv[1]
meta = json.load(open(os.path.join(OUT, 'plates.json')))
COLOR = {'base': 0xf0b43c, 'deck': 0xf0b43c, 'post': 0xf0b43c, 'dowel': 0xf0b43c, 'cradle': 0xe8793a,
         'tray': 0x5cc98a, 'roller': 0xb48cff, 'axle': 0xb48cff, 'collar': 0xb48cff,
         'pinion': 0x4aa8ff, 'compound_gear': 0x4aa8ff, 'roller_gear': 0x4aa8ff, 'washer': 0x4aa8ff,
         'sensor_carrier_R': 0xff6f9a, 'sensor_carrier_L': 0xff6f9a, 'sleeve': 0xe0e0e0, 'keeper': 0xe0e0e0}

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
  s.add(new THREE.Mesh(ng, new THREE.MeshStandardMaterial({color: p.c, roughness: .55})));
  s.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({color: 0x000000, transparent: true, opacity: .35})));
  const [x0, y0, x1, y1] = p.brim, y = .1;
  const pts = [[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]].map(q => new THREE.Vector3(q[0], y, -q[1]));
  const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm); ln.computeLineDistances(); s.add(ln);
});
cam.position.set(0, 230, 250); cam.lookAt(0, 0, -5);
r.render(s, cam);
document.title = 'done';
</script></body></html>"""

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
    for m in meta:
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        pg.on('pageerror', lambda e: print('page error', e))
        z = np.load(os.path.join(OUT, m['stem'] + '.npz'))
        parts = []
        for i, name in enumerate(z['names']):
            v, f = z[f'v{i}'], z[f'f{i}']
            lo, hi = v.min(0), v.max(0)
            parts.append({'v': np.round(v, 2).flatten().tolist(), 'f': f.flatten().tolist(),
                          'c': COLOR.get(str(name), 0xf0b43c),
                          'brim': [float(lo[0] - 5), float(lo[1] - 5), float(hi[0] + 5), float(hi[1] + 5)]})
        html_path = os.path.join(OUT, m['stem'] + '.render.html')
        open(html_path, 'w').write(PAGE.replace('__DATA__', json.dumps({'parts': parts})))
        pg.goto('file://' + html_path)
        pg.wait_for_function("document.title === 'done'", timeout=60000)
        pg.wait_for_timeout(300)
        pg.screenshot(path=os.path.join(OUT, m['stem'] + '.png'))
        pg.close(); os.remove(html_path)
        print('rendered', m['stem'])
    b.close()

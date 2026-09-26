"""Render scenes.json to PNGs with three.js in headless Chromium.
Usage: /opt/batchzero/venv/bin/python render.py scenes.json OUT_DIR [name ...]"""
import os, sys, json
from playwright.sync_api import sync_playwright

SC, OUT = sys.argv[1], sys.argv[2]
only = set(sys.argv[3:])
os.makedirs(OUT, exist_ok=True)
scenes = json.load(open(SC))

PAGE = r"""<!doctype html><html><body style="margin:0;background:#0d1b2e">
<div style="position:relative;width:__W__px;height:__H__px">
<canvas id="c" width="__W__" height="__H__" style="position:absolute;left:0;top:0"></canvas>
<canvas id="o" width="__W__" height="__H__" style="position:absolute;left:0;top:0"></canvas></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const D = __DATA__;
const W = D.w, H = D.h;
const P = p => new THREE.Vector3(p[0], p[2], -p[1]);
const r = new THREE.WebGLRenderer({canvas: document.getElementById('c'), antialias: true});
r.setPixelRatio(1); r.setSize(W, H, false);
const s = new THREE.Scene(); s.background = new THREE.Color(0x0d1b2e);
s.add(new THREE.HemisphereLight(0xdfeaff, 0x1a2436, .85));
const sun = new THREE.DirectionalLight(0xffffff, .75); s.add(sun);
const fill = new THREE.DirectionalLight(0x9fc3ff, .3); s.add(fill);
const box = new THREE.Box3();
D.meshes.forEach(m => {
  const v = m.v, pos = new Float32Array(v.length);
  for (let i = 0; i < v.length; i += 3) { pos[i] = v[i]; pos[i+1] = v[i+2]; pos[i+2] = -v[i+1]; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(m.f);
  const ng = geo.toNonIndexed(); ng.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({color: m.c, roughness: .55, metalness: 0.05, transparent: m.op < 1, opacity: m.op, side: m.op < 1 ? THREE.DoubleSide : THREE.FrontSide, depthWrite: m.op >= 1});
  const mesh = new THREE.Mesh(ng, mat); s.add(mesh);
  if (m.e) s.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({color: 0x000000, transparent: true, opacity: .35})));
  geo.computeBoundingBox(); box.union(geo.boundingBox);
});
const sph = new THREE.Sphere(); box.getBoundingSphere(sph);
const R = sph.radius;
// arrows
function arrowMat(c) { return new THREE.MeshStandardMaterial({color: c, emissive: c, emissiveIntensity: .35, roughness: .4}); }
const aw = Math.max(0.6, R / 55);
D.arrows.forEach(a => {
  const mat = arrowMat(a.c);
  if (a.twist) {
    const o = P(a.o), ax = P(a.ax).normalize();
    const u = new THREE.Vector3(1, 0, 0); if (Math.abs(u.dot(ax)) > .9) u.set(0, 0, 1);
    const e1 = u.clone().sub(ax.clone().multiplyScalar(u.dot(ax))).normalize(), e2 = ax.clone().cross(e1);
    const pts = []; const n = 40;
    for (let i = 0; i <= n; i++) { const t = (a.s0 + a.sw * i / n) * Math.PI / 180; pts.push(o.clone().add(e1.clone().multiplyScalar(a.r * Math.cos(t))).add(e2.clone().multiplyScalar(a.r * Math.sin(t)))); }
    const curve = new THREE.CatmullRomCurve3(pts);
    s.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 60, aw * .9, 10, false), mat));
    const end = pts[n], dir = pts[n].clone().sub(pts[n-1]).normalize();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(aw * 2.6, aw * 6, 20), mat);
    cone.position.copy(end.clone().add(dir.clone().multiplyScalar(aw * 2)));
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); s.add(cone);
  } else {
    const A = P(a.a), B = P(a.b), dir = B.clone().sub(A); const len = dir.length(); dir.normalize();
    const hl = Math.min(aw * 7, len * .45);
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(aw, aw, len - hl, 14), mat);
    sh.position.copy(A.clone().add(dir.clone().multiplyScalar((len - hl) / 2)));
    sh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); s.add(sh);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(aw * 2.8, hl, 20), mat);
    cone.position.copy(B.clone().sub(dir.clone().multiplyScalar(hl / 2)));
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); s.add(cone);
  }
});
// camera
let cam;
if (D.cam) {
  cam = new THREE.PerspectiveCamera(D.cam.fov, W / H, 1, 5000);
  cam.position.fromArray(D.cam.pos); cam.lookAt(new THREE.Vector3().fromArray(D.cam.at));
} else {
  const fov = 30; cam = new THREE.PerspectiveCamera(fov, W / H, 0.5, 5000);
  const c = D.focus ? P(D.focus) : sph.center;
  const az = D.az * Math.PI / 180, el = D.el * Math.PI / 180;
  const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  const vf = fov * Math.PI / 360, hf = Math.atan(Math.tan(vf) * W / H);
  const dist = R / Math.sin(Math.min(vf, hf)) / D.zoom * 1.02;
  cam.position.copy(c.clone().add(dir.multiplyScalar(dist))); cam.lookAt(c);
}
sun.position.copy(cam.position.clone().add(new THREE.Vector3(R * 2, R * 4, R)));
fill.position.copy(cam.position.clone().add(new THREE.Vector3(-R * 3, R, -R)));
// ground
if (D.ground === 'bed') {
  const bed = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.MeshBasicMaterial({color: 0x16304f}));
  bed.rotation.x = -Math.PI / 2; bed.position.y = -0.05; s.add(bed);
  const g = new THREE.GridHelper(220, 22, 0x2a4a73, 0x1f3a5f); g.position.y = .02; s.add(g);
} else if (D.ground === 'table') {
  const size = R * 8, y = box.min.y - 0.05;
  const t = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({color: 0x13243b}));
  t.rotation.x = -Math.PI / 2; t.position.set(sph.center.x, y, sph.center.z); s.add(t);
  const step = R > 40 ? 10 : 5;
  const g = new THREE.GridHelper(Math.round(size / step) * step, Math.round(size / step), 0x223d60, 0x1b3150);
  g.position.set(sph.center.x, y + .03, sph.center.z); s.add(g);
}
r.render(s, cam);
// labels
const o = document.getElementById('o').getContext('2d');
const fs = W < 700 ? 19 : 22;
o.font = `700 ${fs}px -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
D.labels.forEach(l => {
  const v = P(l.p).project(cam);
  const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H;
  const tw = o.measureText(l.t).width, bw = tw + 20, bh = fs + 14;
  let lx = x + l.dx, ly = y + l.dy;
  let bx = lx - bw / 2, by = ly - bh / 2;
  bx = Math.max(6, Math.min(W - bw - 6, bx)); by = Math.max(6, Math.min(H - bh - 6, by));
  const cx = bx + bw / 2, cy = by + bh / 2;
  o.strokeStyle = l.c; o.lineWidth = 2.5; o.globalAlpha = .9;
  o.beginPath(); o.moveTo(x, y);
  const ex = Math.max(bx, Math.min(bx + bw, x)), ey = Math.abs(cx - x) > bw / 2 ? cy : (y < by ? by : by + bh);
  o.lineTo(Math.abs(cx - x) > bw / 2 ? (x < bx ? bx : bx + bw) : ex, ey); o.stroke();
  o.globalAlpha = 1; o.fillStyle = l.c; o.beginPath(); o.arc(x, y, 4.5, 0, 7); o.fill();
  o.fillStyle = 'rgba(10,20,36,.92)'; o.beginPath();
  if (o.roundRect) o.roundRect(bx, by, bw, bh, 8); else o.rect(bx, by, bw, bh); o.fill();
  o.strokeStyle = l.c; o.lineWidth = 2; o.stroke();
  o.fillStyle = l.c; o.textBaseline = 'middle'; o.fillText(l.t, bx + 10, cy + 1);
});
document.title = 'done';
</script></body></html>"""

with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
    for name, sc in scenes.items():
        if only and name not in only:
            continue
        pg = b.new_page(viewport={'width': sc['w'], 'height': sc['h']})
        pg.on('pageerror', lambda e: print('page error', e))
        html = PAGE.replace('__W__', str(sc['w'])).replace('__H__', str(sc['h'])).replace('__DATA__', json.dumps(sc))
        path = os.path.join(OUT, name + '.render.html')
        open(path, 'w').write(html)
        pg.goto('file://' + path)
        pg.wait_for_function("document.title === 'done'", timeout=90000)
        pg.wait_for_timeout(150)
        pg.screenshot(path=os.path.join(OUT, name + '.png'), clip={'x': 0, 'y': 0, 'width': sc['w'], 'height': sc['h']})
        pg.close(); os.remove(path)
        print('rendered', name)
    b.close()

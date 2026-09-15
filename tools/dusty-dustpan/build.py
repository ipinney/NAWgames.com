"""Dusty dustpan, Rev A. Parametric: edit P, then run
    python build.py            -> dusty-dustpan-revA.stl + dusty-dustpan.html (viewer)
Units mm. Model axes: x = width, y = depth from the front lip, z = up.
Needs: pip install manifold3d trimesh numpy  (venv on Vultr: /opt/cad-venv)"""
import manifold3d as m, trimesh, numpy as np, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get('OUT', HERE)
M, CS = m.Manifold, m.CrossSection
P = dict(W=100.0, D=50.0, H=20.0, T=1.6, LIP_EDGE=0.6, RAMP_LEN=14.0, RAMP_H=5.0,
         FLANGE=6.0, FT=2.0, TAB_W=22.0, TAB_L=16.0, TAB_X=30.0, HOLE=3.0)
W,D,H,T=P['W'],P['D'],P['H'],P['T']

def box(x0,x1,y0,y1,z0,z1):
    return M.cube([x1-x0,y1-y0,z1-z0]).translate([x0,y0,z0])

def prism_yz(pts, x0, x1):
    cs = CS([pts])
    s = M.extrude(cs, x1-x0)  # vertices (a,b,c): a=y, b=z, c=x
    mesh = s.to_mesh()
    v = np.array(mesh.vert_properties)[:, :3]
    v2 = np.stack([v[:,2]+x0, v[:,0], v[:,1]], axis=1)
    tri = np.array(mesh.tri_verts)
    # axis permutation (x,y,z)<-(c,a,b) is cyclic => orientation preserved
    return M(m.Mesh(vert_properties=v2.astype(np.float32), tri_verts=tri.astype(np.uint32)))

def prism_xz(pts, y0, y1):
    cs = CS([pts])
    s = M.extrude(cs, y1-y0)  # (a=x, b=z, c=y)
    mesh = s.to_mesh()
    v = np.array(mesh.vert_properties)[:, :3]
    v2 = np.stack([v[:,0], v[:,2]+y0, v[:,1]], axis=1)
    tri = np.array(mesh.tri_verts)[:, ::-1]  # non-cyclic permutation -> flip
    return M(m.Mesh(vert_properties=v2.astype(np.float32), tri_verts=tri.astype(np.uint32)))

hw = W/2
parts = []
# floor
parts.append(box(-hw, hw, 0, D, 0, T))
# side walls
parts.append(box(-hw, -hw+T, 0, D, 0, H))
parts.append(box(hw-T, hw, 0, D, 0, H))
# back wall
parts.append(box(-hw, hw, D-T, D, 0, H))
# front ramp lip (wedge) with crumb-trap drop behind it
RL, RH, LE = P['RAMP_LEN'], P['RAMP_H'], P['LIP_EDGE']
parts.append(prism_yz([(0,0),(RL+1.2,0),(RL+1.2,RH),(RL,RH),(0,LE)], -hw+T/2, hw-T/2))
# side glue flanges, flush with wall top, 45 deg chamfer underneath
F, FT = P['FLANGE'], P['FT']
for s in (-1,1):
    x_in = s*hw
    x_out = s*(hw+F)
    xs = sorted([x_in, x_out])
    parts.append(box(xs[0], xs[1], 0, D, H-FT, H))
    tri = [(x_in, H-FT), (x_in, H-FT-F), (x_out, H-FT)]
    if s < 0: tri = tri[::-1]
    parts.append(prism_xz(tri, 0, D))
# rear glue tabs with gussets and holes
TW, TL, TX, HO = P['TAB_W'], P['TAB_L'], P['TAB_X'], P['HOLE']
holes = []
for cx in (-TX, TX):
    parts.append(box(cx-TW/2, cx+TW/2, D, D+TL, H-FT, H))
    g = [(D, H-FT), (D+TL-2, H-FT), (D, H-FT-(TL-2))]
    g = g[::-1]
    gw = 1.6
    for gx in (cx-TW/2+gw/2, cx, cx+TW/2-gw/2):
        parts.append(prism_yz(g, gx-gw/2, gx+gw/2))
    for dx in (-6, 6):
        holes.append(M.cylinder(FT+2, HO/2, HO/2, 32).translate([cx+dx, D+TL-5, H-FT-1]))

solid = parts[0]
for p in parts[1:]: solid = solid + p
for h in holes: solid = solid - h
mesh = solid.to_mesh()
v = np.array(mesh.vert_properties)[:, :3]; f = np.array(mesh.tri_verts)
tm = trimesh.Trimesh(v, f, process=True)
print('watertight', tm.is_watertight, 'volume mm3', round(tm.volume,1), 'bounds', tm.bounds.round(2).tolist())
print('grams PLA ~', round(tm.volume/1000*1.24,1))
tm.export(os.path.join(OUT, 'dusty-dustpan-revA.stl'))
data = {'v': [round(x, 2) for x in v.flatten().tolist()], 'f': f.flatten().tolist(), 'P': P}
tpl = open(os.path.join(HERE, 'viewer.tpl.html')).read()
open(os.path.join(OUT, 'dusty-dustpan.html'), 'w').write(tpl.replace('__DATA__', json.dumps(data, separators=(',', ':'))))
print('wrote', OUT)

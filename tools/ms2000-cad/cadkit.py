"""cadkit: tiny parametric CAD helpers for 3D-printable parts.

Model axes (always): x = width, y = depth (0 = front), z = up. Units mm.
Build a solid by adding/subtracting primitives, then call finish() to get
  <name>.stl, <name>.html (rotatable viewer with dimensions), <name>-check.png

    pip install manifold3d trimesh numpy matplotlib --break-system-packages
"""
import html, json, os
import numpy as np
import manifold3d as m
import trimesh

M, CS = m.Manifold, m.CrossSection
HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, 'viewer.tpl.html')


def box(x0, x1, y0, y1, z0, z1):
    """Axis-aligned block between the given coordinates."""
    return M.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0])


def cyl(x, y, z0, z1, d, segs=48):
    """Vertical cylinder (holes, posts, bosses)."""
    return M.cylinder(z1 - z0, d / 2, d / 2, segs).translate([x, y, z0])


def _remap(solid, order, flip, offset):
    mesh = solid.to_mesh()
    v = np.array(mesh.vert_properties)[:, :3]
    v2 = np.stack([v[:, order[0]], v[:, order[1]], v[:, order[2]]], axis=1) + offset
    tri = np.array(mesh.tri_verts)
    if flip:
        tri = tri[:, ::-1]
    return M(m.Mesh(vert_properties=v2.astype(np.float32), tri_verts=tri.astype(np.uint32)))


def _ccw(pts):
    """Counter-clockwise outline; clockwise outlines extrude to an empty solid."""
    a = sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, list(pts[1:]) + list(pts[:1])))
    return list(pts) if a > 0 else list(pts)[::-1]


def prism_xy(pts, z0, z1):
    """2D outline in the XY plane (top view), extruded up from z0 to z1."""
    return M.extrude(CS([_ccw(pts)]), z1 - z0).translate([0, 0, z0])


def prism_yz(pts, x0, x1):
    """2D profile of (y, z) points (side view), extruded across x0..x1. Ramps, wedges, gussets."""
    s = M.extrude(CS([_ccw(pts)]), x1 - x0)          # local (a=y, b=z, c=x)
    return _remap(s, (2, 0, 1), False, [x0, 0, 0])   # cyclic permutation keeps winding


def prism_xz(pts, y0, y1):
    """2D profile of (x, z) points (front view), extruded along y0..y1. Chamfers, channels."""
    s = M.extrude(CS([_ccw(pts)]), y1 - y0)          # local (a=x, b=z, c=y)
    return _remap(s, (0, 2, 1), True, [0, y0, 0])     # odd permutation, flip winding


def union(parts):
    out = parts[0]
    for p in parts[1:]:
        out = out + p
    return out


def dim(a, b, off, text, note=''):
    """Dimension line from point a to b (model coords), drawn offset by vector off."""
    return {'a': list(a), 'b': list(b), 'off': list(off), 'text': str(text), 'note': note}


def finish(solid, name, out_dir, title_html, specs=(), dims=(), hint='', fit_pad=1.3,
           material_density=1.24, check_png=True):
    """Export STL + viewer HTML (+ check render). Returns a stats dict.

    title_html: e.g. 'Dusty <span>dustpan</span>, Rev A' (span renders in the accent color)
    specs: [(label, value), ...] shown under the viewer, keep to 4
    hint: one line of assembly guidance, may contain an <a> link
    """
    os.makedirs(out_dir, exist_ok=True)
    mesh = solid.to_mesh()
    v = np.array(mesh.vert_properties)[:, :3]
    f = np.array(mesh.tri_verts)
    tm = trimesh.Trimesh(v, f, process=True)
    stats = {
        'watertight': bool(tm.is_watertight),
        'volume_mm3': round(float(tm.volume), 1),
        'grams_pla': round(float(tm.volume) / 1000 * material_density, 1),
        'bounds': tm.bounds.round(2).tolist(),
        'size': (tm.bounds[1] - tm.bounds[0]).round(2).tolist(),
    }
    assert stats['watertight'] and tm.volume > 0, f'bad solid: {stats}'
    stl_name = f'{name}.stl'
    tm.export(os.path.join(out_dir, stl_name))

    data = {'v': [round(x, 2) for x in v.flatten().tolist()], 'f': f.flatten().tolist(),
            'bounds': tm.bounds.tolist(), 'dims': list(dims), 'stlName': stl_name, 'fitPad': fit_pad}
    specs_html = ''.join(f'<div><dt>{html.escape(k)}</dt><dd>{html.escape(str(val))}</dd></div>' for k, val in specs)
    title_text = html.unescape(title_html.replace('<span>', '').replace('</span>', ''))
    page = open(TEMPLATE).read()
    page = (page.replace('__TITLE_TEXT__', html.escape(title_text))
                .replace('__TITLE_HTML__', title_html)
                .replace('__SPECS__', specs_html)
                .replace('__HINT__', hint)
                .replace('__DATA__', json.dumps(data, separators=(',', ':'))))
    open(os.path.join(out_dir, f'{name}.html'), 'w').write(page)

    if check_png:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        from mpl_toolkits.mplot3d.art3d import Poly3DCollection
        lo, hi = tm.bounds
        fig = plt.figure(figsize=(10, 5))
        for i, (el, az) in enumerate([(30, -60), (25, 130)]):
            ax = fig.add_subplot(1, 2, i + 1, projection='3d')
            ax.add_collection3d(Poly3DCollection(tm.triangles, facecolor='orange', edgecolor='k', linewidth=.1))
            ax.set_xlim(lo[0], hi[0]); ax.set_ylim(lo[1], hi[1]); ax.set_zlim(lo[2], hi[2])
            ax.set_box_aspect(tuple(np.maximum(hi - lo, 1)))
            ax.view_init(el, az)
        plt.savefig(os.path.join(out_dir, f'{name}-check.png'), dpi=90)
        plt.close(fig)
    print(json.dumps(stats))
    return stats

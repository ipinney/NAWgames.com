"""cadkit (trimmed): parametric CAD helpers. Axes: x = width, y = depth (0 = front), z = up. Units mm."""
import numpy as np
import manifold3d as m

M, CS = m.Manifold, m.CrossSection


def box(x0, x1, y0, y1, z0, z1):
    return M.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0])


def cyl(x, y, z0, z1, d, segs=48):
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
    """Return the outline counter-clockwise; clockwise outlines extrude to an empty solid."""
    a = sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]))
    return list(pts) if a > 0 else list(pts)[::-1]


def prism_xy(pts, z0, z1):
    return M.extrude(CS([_ccw(pts)]), z1 - z0).translate([0, 0, z0])


def prism_yz(pts, x0, x1):
    """(y, z) side profile extruded across x0..x1."""
    s = M.extrude(CS([_ccw(pts)]), x1 - x0)
    return _remap(s, (2, 0, 1), False, [x0, 0, 0])


def prism_xz(pts, y0, y1):
    """(x, z) front profile extruded along y0..y1."""
    s = M.extrude(CS([_ccw(pts)]), y1 - y0)
    return _remap(s, (0, 2, 1), True, [0, y0, 0])


def union(parts):
    out = parts[0]
    for p in parts[1:]:
        out = out + p
    return out

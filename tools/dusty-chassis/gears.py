import numpy as np
def involute_gear(z, m, pa_deg=20, backlash=0.1, n_inv=8):
    """2D spur gear outline (list of (x,y)), centered at origin."""
    pa = np.radians(pa_deg)
    rp = m*z/2; rb = rp*np.cos(pa); ra = rp + m; rf = max(rp - 1.25*m, 0.5)
    inv = lambda a: np.tan(a) - a
    # half tooth thickness angle at pitch, minus backlash
    t_half = (np.pi/(2*z)) - backlash/(2*rp)
    phi_p = inv(pa)
    pts = []
    for i in range(z):
        c = 2*np.pi*i/z
        # radii from max(rb,rf) to ra
        r0 = max(rb, rf)
        rs = np.linspace(r0, ra, n_inv)
        left, right = [], []
        for r in rs:
            a = np.arccos(min(rb/r, 1.0))
            ang = t_half + phi_p - inv(a)
            right.append((r*np.cos(c-ang), r*np.sin(c-ang)))
            left.append((r*np.cos(c+ang), r*np.sin(c+ang)))
        # root before tooth
        a0 = np.arccos(min(rb/r0,1.0)); ang0 = t_half + phi_p - inv(a0)
        pts.append((rf*np.cos(c-ang0-0.02), rf*np.sin(c-ang0-0.02)))
        pts += right
        pts += left[::-1]
        pts.append((rf*np.cos(c+ang0+0.02), rf*np.sin(c+ang0+0.02)))
    return pts, rp, ra, rf

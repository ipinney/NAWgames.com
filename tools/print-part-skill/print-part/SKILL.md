---
name: print-part
description: Design a 3D-printable part from a plain description (size, shape, lips, mounting tabs, holes) and deliver an STL plus a rotatable HTML viewer with dimension callouts. Use whenever the user wants something 3D printed, asks for an STL, a printable bracket, mount, tray, dustpan, enclosure, clip, spacer, or knob, says "make me a part", "design this for the 3D printer", "text to CAD", or wants to see a part in 3D with measurements. Also use for revising a part made earlier (change a dimension, add a hole, thicken a wall) and for parts on Nolan's Dusty robot or other kids' projects on nawgames.com.
---

# Print Part

Parametric CAD in Python (manifold3d booleans), exported as STL, shown in a dark
blueprint-style three.js viewer that spins, snaps to front/side/top, toggles
dimension lines, and downloads the STL. Worked example: `examples/dusty_dustpan.py`.

## Setup

```bash
pip install manifold3d trimesh numpy matplotlib playwright --break-system-packages
```
On the Vultr box a ready venv exists: `/opt/cad-venv/bin/python`.

## Workflow

1. **Pin down the part.** Get the numbers that matter: overall envelope, wall thickness,
   what it mates to, how it attaches (glue, screws, zip ties, press fit), print orientation.
   Pull any known constraints from the project first (footprint limits, motor or wheel sizes).
   Where a number is unknown, pick a sensible default, make it a parameter, and list it
   as an assumption in the reply.
2. **Write a part script** modeled on `examples/dusty_dustpan.py`: a `P = dict(...)` of every
   dimension at the top, then the solid from `cadkit` primitives, then `dims`, then `finish()`.
   Axes are fixed: x = width, y = depth with 0 at the front, z = up, mm.
   - `box(x0,x1,y0,y1,z0,z1)` blocks, `cyl(x,y,z0,z1,d)` posts and holes
   - `prism_xy` top-view outlines, `prism_yz` side profiles (ramps, wedges, gussets),
     `prism_xz` front profiles (chamfers, channels)
   - `union([...])`, then `solid - hole` for holes
3. **Design for printing.** Walls >= 1.6 mm (4 perimeters at 0.4 mm nozzle). Nothing
   thinner than 0.6 mm. Overhangs get a 45° chamfer or gusset so the part prints with no
   supports; cantilevered tabs need a gusset at each edge, not only the middle. Holes for
   glue keying or zip ties: 3 mm. Clearance fits: +0.3 mm per side.
4. **Run it.** `python part.py /mnt/user-data/outputs`. `finish()` asserts the mesh is
   watertight, prints size and grams of PLA, and writes `<name>.stl`, `<name>.html`,
   `<name>-check.png`. View the check PNG before showing anything.
5. **Screenshot the viewer on a phone** (Ivan reviews on mobile). Must use a high-DPI
   phone profile or sizing bugs stay hidden:
   ```python
   pg = browser.new_page(viewport={'width':390,'height':844}, device_scale_factor=3,
                         is_mobile=True, has_touch=True)
   ```
   Launch chromium with `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`.
   The part and every label should sit fully between the title and the spec panel.
   If labels crowd or clip, adjust dim offsets or `fit_pad`.
6. **Deliver** with `present_files`: the HTML first, then the STL. Reply with the key
   dimensions, print notes (grams, supports), and the assumptions to verify before printing.
   Do not paste the check PNG.

## Dimension callouts

`dim(a, b, off, text, note)`: `a`, `b` are the two measured points, `off` is the vector the
line is pushed out by (away from the body, 8 to 16 mm is typical). Label the numbers a
builder needs: overall size, body size, height, and each mating feature. 6 to 8 callouts max.
`specs` is at most 4 `(label, value)` pairs; `hint` is one line of assembly guidance.

## Viewer rules learned the hard way

These are already handled in `assets/viewer.tpl.html`; keep them if editing it.
- Canvas needs explicit CSS width and height. A canvas pinned with only `inset:0` takes
  its intrinsic size (the drawing buffer, 2-3x on phones), which pushes the model to the
  bottom-right corner.
- Fit the camera to the open area between header and footer, not the full window, and shift
  the projection center there (`projectionMatrix.elements[9]`); refit on resize, on
  footer resize, and after fonts load.
- Orbit around the bounding-box center; clamp zoom so the part can't be lost.
- The STL download is generated in the browser from the embedded mesh, so the HTML stands alone.
- Dark theme by default (Ivan's preference).

## Publishing to nawgames.com (kids' projects)

Files for a kid's project go in `/opt/nawgames/public/projects/<kid>/` on Vultr and are
linked from the project page and the card `links` in `src/app/projects/<kid>/page.js`.
Keep the part source in `/opt/nawgames/tools/<part>/` so it can be rebuilt on the server
with `/opt/cad-venv/bin/python`. Commit and push per the nawgames skill (Vercel deploys in
about a minute), then curl the URLs to confirm 200s. The Dusty dustpan lives at
`/projects/nolan/dusty-dustpan.html` with source in `tools/dusty-dustpan/`.

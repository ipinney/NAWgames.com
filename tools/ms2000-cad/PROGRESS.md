# MS-2000 CAD: progress checkpoint

Read this first every session. Update it and commit after every finished step.

## Setup
- Printer: Flashforge Adventurer 5M, 220 mm cube, 0.4 nozzle, PLA. Slicing reuses tools/dusty-chassis/orca (Flash Studio CLI in docker).
- Skill: print-part (copy in tools/print-part-skill). cadkit.py + viewer.tpl.html here are from it (cadkit has the _ccw outline fix).
- Python: /opt/cad-venv/bin/python. Screenshots: /opt/batchzero/venv/bin/python (playwright), phone 390x844 @3x.
- Rebuild all: `PY=/opt/cad-venv/bin/python ./run.sh`
- Publish: copies to /opt/nawgames/public/projects/addie/ms2000-cad/, linked from the hub page (src/app/projects/addie/mosquito-turret/page.js).
- Scope decisions (Sep 16): primary parts list only; stuffed mosquito is bought, so only a clip-on sensor pod is printed; poster board backdrop, no printed flight zone. Everything gets re-checked with calipers when parts arrive.

## Phases
- [x] 0. Workspace, skill, checkpoint file (Sep 16)
- [x] 1. Component library: components.py, make_components.py, DIMENSIONS.md, ms2000-components.html (Sep 16)
- [ ] 2. Printed parts, one at a time (script in parts/, viewer + STL + check PNG each)
  - [x] P1 base (Sep 16): parts/p1_base.py -> base shell (142x133x67, ~160 g) + floor plate (~63 g). Fit check and swept paths (pack slide-in, micro:bit lift-out, DC plug) all clear.
  - [x] P2 turntable + tilt yoke, one print (Sep 16): parts/p2_turntable.py, ~39 g. Also P3 pivot pin (same script).
    Checks: tilt servo vs yoke/head, head sweep -30..+35 vs yoke, stops engage at +40/-35 and not inside the range, whole turret pan sweep -90..+90 vs base shell and pan servo. All clear.
  - [x] P4 camera + laser head (Sep 16): parts/p4_head.py, ~11 g. HuskyLens via tab (2x M3, nut traps), screen back, top edge z 25.
    Laser axis z -25, x 0.4 (lens x), 37.9 below lens, bore toed up 1.42 deg to cross the camera line at 1524 mm (+-15 mm at 3/7 ft).
    Pinch clamp: slit on +x front 12 mm, M2 x 10 from below, screw 3 mm clear of the case.
    Left boss: pin socket 6.1 x 3.5, M2 x 12 from the pin head into a nut trap open to the inside. Top bar z 29..31.5 (53 mm bridge).
    Checks: HuskyLens envelope and laser vs head, beam path clear, head+camera+laser sweep -30..+35 vs yoke and tilt servo, stops hit at -35/+40.
  - [x] Assembly viewer (make_assembly.py -> ms2000-turret.html), all turret parts in place.
  - [x] P5 wand handle (Sep 16): parts/p5_wand.py, ~50 g, 56 x 119 x 19. Board face up at z 8..9.6 on ring bosses (M2 self-tap through the rings = wire clamps), top edge under corner lips.
    Plug/USB notch in the bay top wall; pack lead points at the micro:bit. Rails: 45 deg V (apex z 4), fits rods 9-30 mm (checked 9.5/16/25/30). Ties at y 4.5 and over the pack.
    Checks: micro:bit and pack vs wand, lift-out path, USB plug path. Prints face up on the rail bottoms.
  - [x] P6 sensor pod (Sep 16): parts/p6_pod.py -> cup (WHITE PLA, 40 mm face 0.8 thick, eye bar + line tab, ~8 g) + cap (sensor pocket, open back for wiring, 4 sewing lugs, strap slots, ~9 g).
    Light-collector idea: the dot lights the whole white cup; sensor at the back sees it. 6 mm dot fully on the face up to 17 mm off center (laser offset 15.2 at 3/7 ft).
    LEDs sit outside the cavity (checked). Cup prints face down, cap plug face down.
    Wiring: 3V + GND to sensor VIN/GND, sensor OUT -> P0, LED anodes via 220 ohm each -> P1, cathodes -> GND.
  - [x] P7 (Sep 16): parts/p7_pendulum.py -> pendulum pivot + protractor (clamps 1/4 in dowel, notches + count holes for 10/20/30), backdrop clip (5 mm foam board edge, holds dowel square), backdrop foot (print 2).
  - [x] P8 (Sep 16): parts/p8_clips.py -> plate of 8 line clips (1 mm line hole, 5 x 1.2 ribbon snaps in edgewise) + 3 rod clips for a 3/8 in dowel (RD param).
- [x] 3. Assembly: make_assembly.py (turret in place, catalog 'In turret' mode). Sweeps live in the part scripts. Exploded view not done.
- [x] 4. Print plates (Sep 16): plates.py (layout, print orientation per part) + orca/build3mf.py (Flash Studio CLI in orca-cli docker, presets from /opt/ffstudio/work/*.json) via ./plates.sh.
  Settings: 0.2 mm, 3 walls, 15% gyroid, 5 mm brim (none on pin and clips), no supports, textured PEI; plate 3 slowed walls.
  Results: P1 shell 3h01 125 g | floor + foot 1h43 64 g | yoke, wand, head, pin, pod back 3h34 77 g | WHITE pod front + clips 0h34 11 g | pendulum, clip, foot 1h26 44 g. Total ~10h 20m, ~320 g.
  3mf published; gcode stays in /opt/ffstudio/work/ms2000/out (too big for git).
- [ ] 5. Parts arrive: calipers, set basis 'cal', rebuild, reprint what changed

## Whole-setup viewer (Sep 16)
- make_setup.py -> ms2000-3d.html (template setup.tpl.html, from dusty-chassis/assembly.tpl.html): turret + backdrop (30x20 in board on 2 feet, clip, 1/4 in dowel 250 mm), pendulum pivot, stuffed-mosquito stand-in with pod 1524 mm from the lens at lens height, wand on the dowel, line, ribbon, line clips, laser beam.
- Focus buttons (Turret, default / Mosquito and wand / Whole setup); this is the main 3D link on the MS-2000 page, Bought and Laser toggles, Turret view. make_hero.py renders ms2000-hero.png for the MS-2000 page.
- make_assembly.py now only writes when run as a script (make_setup imports its ITEMS).

## Turret 3D viewer (Sep 16)
- make_turret3d.py -> ms2000-turret-3d.html (template turret.tpl.html = setup template + tappable legend highlight + Explode).
- 15 components with their own colors and explode offsets (SPEC list), laser beam stub, focus Whole turret / Head / Base. This is the main 3D link and the hero image source.

## Open numbers (see DIMENSIONS.md, basis est/tbd)
- Xia mi: mounting holes, height, micro:bit slot direction, power jack side
- 2xAAA pack size; arm switch size; servo horn; stuffed mosquito size

## P1 layout (model frame: x right, y back from front face, z up)
- Xia mi flat on 5 mm posts, left side x -60..-3, y 4..91, socket end at front; micro:bit stands at y 17.7, top z 56.6.
- Board holes from photo: 80.2 x 50.2 pitch, 3.4 inset. Board power switch stays ON; pack switch is master.
- 4xAA pack x 1..65.5, y 11.5..81.5, slides in through right-wall bay (z < 24).
- Pan servo hangs from deck underside (z 64), shaft at (0, 66), deck top z 67. Turntable max radius 38 (slot at y 24 is the limit).
- Cable hole (0,112) d14 behind the turntable. Speaker on back wall at x 36 z 40, arm switch at x -36 z 40.
- Corner posts at (+-65.5, 5.5 / 127.5), M2 up through the floor plate.

## P2 numbers (turntable local frame: origin on pan axis at disc underside; world = local + (0, 66, 72.3))
- Horn stack estimate: hub 1.3 above servo boss, plate flush with the printed face in a 2.0 pocket (layout.py).
- Tilt axis local z 39 (world 111.3). Uprights 4 thick, inner faces +-34.9, y -13..24.
- Head (P4) must fit: cheeks outer +-30.6, envelope y -14..8, z -30..32 about the axis; right cheek has the tilt horn pocket (arm points up); left cheek has a d10 boss out to x -34.4 with a 5.9 x 3.5 pin socket and M2 tap; stop finger r 6.5..10, +-8 deg, pointing straight down at tilt 0, x -34.4..-30.6.
- p2_parts.pkl carries Z0, TZ, XI, XO, C, BT for P4.
- cadkit finish now builds the trimesh with process=False (merging made false open edges on manifold output).

## Log
- Sep 16: phases 0-1 done. HuskyLens from DFRobot STEP (decimated 8k faces). Laser case is electrically positive: plastic-only holder.
- vendor/ keeps huskylens_lo.npz and the PDFs in git. Full STEP (not committed): curl -L -o vendor/sen0305_step.zip https://dfimg.dfrobot.com/wiki/22598/SEN0305_huskylens-ai-vision-sensor_stpfile_V1.0.zip
- Sep 16: P1 base done. Xia mi photo showed a vertical micro:bit socket at one end and 4 corner holes, so the carrier-plate idea was dropped; floor plate is quick to reprint if holes are off.
- index page: make_index.py (PARTS list holds status per part).
- Sep 16: P2 + P3 done. Old P3 (tilt yoke) merged into P2; P3 is now the pivot pin.
- Sep 16: P4 done. Sensor pod (P6) note: the laser dot lands +-15 mm off the camera aim at 3 and 7 ft, and the ALS-PT19 is only 7.8 x 10.6. Pod needs a light collector about 30 mm wide, or code must offset the aim by distance (HuskyLens box size).
- Sep 16: P7, P8, plates done. Design complete except caliper pass. Filament: ~320 g sliced (buy a spool; 11 g must be white).

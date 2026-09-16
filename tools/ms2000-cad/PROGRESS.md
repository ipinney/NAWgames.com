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
  - [ ] P2 pan turntable
  - [ ] P3 tilt yoke
  - [ ] P4 camera + laser head (boresight, tilt stop, all-plastic laser clamp)
  - [ ] P5 wand handle (micro:bit, 2xAAA)
  - [ ] P6 sensor pod for stuffed mosquito (ALS-PT19, 2 LEDs, line tie)
  - [ ] P7 pendulum pivot + 10/20/30 deg guide
  - [ ] P8 cable clips
- [ ] 3. Assembly: turret in place, collision check, pan/tilt sweep, exploded view; catalog "In turret" mode
- [ ] 4. Print plates (220 bed), 3mf + gcode, grams and times
- [ ] 5. Parts arrive: calipers, set basis 'cal', rebuild, reprint what changed

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

## Log
- Sep 16: phases 0-1 done. HuskyLens from DFRobot STEP (decimated 8k faces). Laser case is electrically positive: plastic-only holder.
- vendor/ keeps huskylens_lo.npz and the PDFs in git. Full STEP (not committed): curl -L -o vendor/sen0305_step.zip https://dfimg.dfrobot.com/wiki/22598/SEN0305_huskylens-ai-vision-sensor_stpfile_V1.0.zip
- Sep 16: P1 base done. Xia mi photo showed a vertical micro:bit socket at one end and 4 corner holes, so the carrier-plate idea was dropped; floor plate is quick to reprint if holes are off.
- index page: make_index.py (PARTS list holds status per part).

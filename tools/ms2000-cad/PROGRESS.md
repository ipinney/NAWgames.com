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
  - [ ] P1 base: carrier plate for Xia mi (drill on arrival), 4xAA bay, speaker grille, arm switch, pan servo pocket
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

## Log
- Sep 16: phases 0-1 done. HuskyLens from DFRobot STEP (decimated 8k faces). Laser case is electrically positive: plastic-only holder.
- vendor/ keeps huskylens_lo.npz and the PDFs in git. Full STEP (not committed): curl -L -o vendor/sen0305_step.zip https://dfimg.dfrobot.com/wiki/22598/SEN0305_huskylens-ai-vision-sensor_stpfile_V1.0.zip

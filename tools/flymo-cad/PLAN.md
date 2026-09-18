# Flying Mosquito (MS-2000 bonus): plan and progress

Site: nawgames.com/projects/addie/flying-mosquito (overview, design, build, learn, changes).
Pages read from src/app/projects/addie/flying-mosquito/data.js (phases, requirements, weights, parts, plates, plan, log, lessons).
CAD: this folder. Published to public/projects/addie/flymo-cad/ (viewers, stl/, plates/) plus flymo-hero.jpg and flymo-og.jpg.

## Start of every session
1. `cd /opt/nawgames && git status --short && git log --oneline -10`, then read this file.
2. The MS-2000 (tools/ms2000-cad, design locked Sep 16) always wins. Do not change MS-2000 files from flyer work.
3. If another session is working, research only.

## Rebuild
- `./run.sh` : every part (parts/f*.py), make_drone3d.py (runs make_assembly.py: whole-drone STL, weights.json, clash check), hero + OG images, publish.
- `./plates.sh` : plates.py (7 plates, Adventurer 5M) -> orca/build3mf.py (Flash Studio CLI in the orca-cli docker, work dir /opt/ffstudio/work/flymo) -> publish_plates.sh.
- Python: /opt/cad-venv. Hero render: /opt/batchzero/venv (playwright).

## Design (Rev A, Sep 18, 2026) - not locked
- Drone: LiteWing ESP32-S3 (Tindie $49, no battery) + positioning module (PMW3901 flow + VL53L1X ToF, $38, 8 g, under the board, arrow toward USB-C). Controlled over the drone's WiFi (CRTP over UDP) with Crazyflie cflib.
- Board outline and motor spots from the open KiCad file (LiteWing V2.6.C) -> vendor/litewing_edge.json: 100 x 100, motors at (+-42, +-42), strap slots at x = +-20.
- Frame: x right, y forward (toward the MS-2000), z up, z = 0 PCB bottom.
- F0 fit check (collars 7.0/7.2/7.4, 24 mm button hole, sensor pocket). F1 guard: fence = outline of (4 x r31 circles + square), 0.8 x 5 mm at z 6.5..11.5; collars under the PCB (z -9..-1, slit inward for motor wires); legs to z -20. F2 body: white cup (40 mm window, 0.8 face) + back (sensor on the bulkhead, XIAO on the floor, strap tunnel, USB-C slot under the tail), axis at z 24, flat bottom on the battery. F4 pad (cone cups at the foot centers). F5 control box 150 x 100 x 48 (Pi Zero 2 W, micro:bit snap-in window, 24 mm button, Anker 321, USB-C panel port right wall, switch slot left wall) + floor.
- Radio: ALS-PT19 -> XIAO ESP32-C3 (powered from the drone battery plug) -> UDP over drone WiFi -> Pi Zero 2 W -> USB -> micro:bit -> radio group 7 GO / HIT / STOP. The MS-2000 turret already reacts to these (build guide), so no turret code change. Flyer runs log on the box micro:bit.
- Weight: added load 25.9 g vs ~25 g rated (55 mm props). Lift test in December decides; fallback 65 mm props + bigger guard (MOC).
- Plates: 1 fit check 9m49s, 2 guard 32m56s, 3 window (WHITE) 8m44s, 4 body 26m2s, 5 pad 1h16m, 6 box 2h16m, 7 floor 54m. ~5h45m, ~205 g.

## Estimates to caliper on arrival (basis est in components.py)
Motor can below PCB (10), prop plane (9), module drop (12.5), battery size (48 x 25 x 9, 16 g), button hole (24), XIAO height, PCB thickness.

## Schedule
Order by Nov 13 (Tindie ships from India). Dec 1-6 check-in, calipers, stock hover, flash positioning firmware, fit check. Dec 7-13 print 2-4, weigh, lift test. Dec 14-20 position hold + pattern from laptop over the flight mat. Dec 21-Jan 3 hit pod, box prints, Pi, micro:bit relay (Addie). Jan 4-15 GO-to-landing, 20 flights. Jan 16-24 turret vs flyer (retrain HuskyLens on the flyer after MS-2000 experiments, re-teach stuffed mosquito after). Jan 25-Feb 1 freeze. Fair only if Miss Taggart allows drones.

## Open
- Ivan: approve requirements + budget (~$223 primary + ~$25 local, plus Tindie shipping) -> design lock, next MOC = MOC-001.
- Ask Miss Taggart about drones at the exhibition.
- Order by Nov 13; re-open every link first.

## Log
- Sep 18: project page + portal card (3cd0fda). Rev A CAD, 7 sliced plates, colored drone viewer, hero/OG. Site pages design/build/learn/changes from data.js.

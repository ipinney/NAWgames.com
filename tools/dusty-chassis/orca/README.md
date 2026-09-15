# Adventurer 5M plate files

Turns the five plate layouts into OrcaSlicer project files (.3mf) with the
FlashForge Adventurer 5M 0.4 nozzle, Flashforge Generic PLA, and the Dusty print
settings embedded, then re-opens each file and slices it to prove it loads.

Built with Flash Studio 1.7.9 (FlashForge's Orca-Flashforge, internal version 2.3.2;
Ubuntu 24.04 AppImage extracted to /opt/ffstudio/squashfs-root) inside the `orca-cli`
docker image built from Dockerfile. Files written by OrcaSlicer 2.4.2 are stamped
version 2.6 and Flash Studio refuses them ("Load file failed"), so build with the
FlashForge binary. OrcaSlicer 2.4.2 opens these files fine.

Flash Studio's CLI segfaults when a plate has a name, so plate names stay blank.

    python3 flatten.py      # resolve the system presets into m.json p.json f.json
    python3 build3mf.py     # plate{1..5}/*.stl -> out/dusty-plate-N-*.3mf + slice check

Settings applied (all plates): 3 walls, 5 top / 4 bottom, 20% gyroid, 5 mm outer
brim, no supports, textured PEI plate, X-Y hole compensation 0.
Plates 1 and 4: outer wall 60 mm/s, inner wall 120 mm/s, accel 5000 (outer 3000).
Per object: no brim on pinion, compound gear, roller gear; 8 mm brim on the roller.

slice-summary.json holds the slicer's time and grams for each plate.

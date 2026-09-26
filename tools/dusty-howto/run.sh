#!/bin/sh
# Rebuild the print-plan pictures. Needs the assembly from ../dusty-chassis (assemble.py OUT).
set -e
cd "$(dirname "$0")"
ASM=${1:-/tmp/dustyC}
[ -f "$ASM/assembly.pkl" ] || (cd ../dusty-chassis && /opt/cad-venv/bin/python assemble.py "$ASM")
/opt/cad-venv/bin/python make_scenes.py "$ASM/assembly.pkl" ../../public/projects/nolan/dusty-files /tmp/howto-scenes.json
/opt/batchzero/venv/bin/python render.py /tmp/howto-scenes.json ../../public/projects/nolan/dusty-files/howto

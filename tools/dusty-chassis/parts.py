"""Tessellate Pololu's STEP model (micro metal gearmotor + #1089 bracket) for the viewer.
Download first: curl -L -o parts/bracket.step https://www.pololu.com/file/0J1711/micro-metal-gearmotor-with-1089-extended-bracket.step"""
import os, numpy as np, cadquery as cq
from OCP.STEPControl import STEPControl_Reader
HERE = os.path.dirname(os.path.abspath(__file__))
r = STEPControl_Reader(); r.ReadFile(os.path.join(HERE, 'parts', 'bracket.step')); r.TransferRoots()
vs, ts = cq.Shape.cast(r.OneShape()).tessellate(0.2, 0.5)
np.savez(os.path.join(HERE, 'parts', 'motor_bracket.npz'), v=np.array([[p.x, p.y, p.z] for p in vs]), t=np.array(ts))
print('ok', len(vs))

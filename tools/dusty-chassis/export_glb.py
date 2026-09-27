# Movie model: assembly.pkl (from assemble.py) -> dusty.glb, one node per part named <system>__<part>, meters, Y up, robot front = -Z.
# Usage: /opt/cad-venv/bin/python export_glb.py OUT  then copy OUT/dusty.glb to public/projects/nolan/dusty-film/dusty-<rev>.glb
import pickle, json, numpy as np, trimesh
from trimesh.visual.material import PBRMaterial
import sys, os
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
d = pickle.load(open(os.path.join(OUT, 'assembly.pkl'), 'rb'))
G = {
 'chassis': ['base','cradle','deck','sleeve','keeper','post1','post2','post3','post4','dowel1','dowel2','dowel3','dowel4'],
 'brain': ['micro:bit','moto:bit'],
 'power': ['power bank','USB adapter and cable','foam shims','rocker switch'],
 'drive': ['N20 motors + brackets','N20 encoder boards + plugs','wheels','ball caster'],
 'sensors': ['QTR-1A sensors','whisker switch','carrier_R','carrier_L'],
 'sweeper': ['130 brush motor','pinion','compound','roller_gear','roller','axle','collar','washer','pipe-cleaner bristles'],
 'tray': ['tray'],
}
COL = {'base':(0.94,0.93,0.90),'cradle':(0.94,0.93,0.90),'deck':(0.94,0.93,0.90),'sleeve':(0.94,0.93,0.90),'keeper':(0.94,0.93,0.90),
 'micro:bit':(0.08,0.10,0.12),'moto:bit':(0.75,0.12,0.12),'power bank':(0.1,0.1,0.11),'USB adapter and cable':(0.15,0.15,0.16),'foam shims':(0.2,0.2,0.22),
 'rocker switch':(0.1,0.1,0.1),'N20 motors + brackets':(0.72,0.72,0.74),'N20 encoder boards + plugs':(0.1,0.35,0.15),'wheels':(0.08,0.08,0.08),
 'ball caster':(0.7,0.7,0.72),'QTR-1A sensors':(0.1,0.25,0.55),'whisker switch':(0.12,0.12,0.12),'130 brush motor':(0.78,0.78,0.8),
 'pipe-cleaner bristles':(0.95,0.55,0.15),'tray':(0.2,0.55,0.85)}
ORANGE=(0.96,0.62,0.18)
M = np.array([[-1,0,0],[0,0,1],[0,1,0]],float)/1000.0
sc = trimesh.Scene(); where={}
allp={**d['printed'],**d['ghosts']}
used=set()
for g,names in G.items():
    for n in names:
        if n not in allp: print('missing',n); continue
        v,f = allp[n]; used.add(n)
        v2 = np.asarray(v)@M.T
        t = trimesh.Trimesh(v2, np.asarray(f), process=False)
        c = COL.get(n, ORANGE if g in ('sweeper','sensors') else (0.94,0.93,0.90))
        metal = n in ('N20 motors + brackets','130 brush motor','ball caster','axle')
        t.visual = trimesh.visual.TextureVisuals(material=PBRMaterial(baseColorFactor=[*c,1.0],metallicFactor=0.8 if metal else 0.0,roughnessFactor=0.35 if metal else 0.55))
        node = f'{g}__{n}'.replace(':','').replace(' ','_').replace('+','')
        sc.add_geometry(t, node_name=node, geom_name=node)
        where[node]={'group':g,'label':n,'bounds':t.bounds.round(5).tolist()}
print('unused',set(allp)-used)
sc.export(os.path.join(OUT, 'dusty.glb'))
json.dump(where,open(os.path.join(OUT, 'dusty-parts.json'),'w'),indent=1)
b=sc.bounds; print('bounds m',b.round(4).tolist())

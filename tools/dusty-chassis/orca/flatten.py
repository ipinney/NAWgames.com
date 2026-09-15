import json,glob,os,sys
R='/opt/orca/squashfs-root/resources/profiles/Flashforge'
idx={}
for f in glob.glob(R+'/**/*.json',recursive=True):
    try: d=json.load(open(f))
    except Exception: continue
    if isinstance(d,dict) and 'name' in d: idx[(d.get('type'),d['name'])]=d
def flat(t,name):
    d=idx[(t,name)]; chain=[d]
    while d.get('inherits'):
        d=idx[(t,d['inherits'])]; chain.append(d)
    out={}
    for c in reversed(chain): out.update(c)
    out['name']=name; out['inherits']=''; out['from']='system'
    return out
if __name__=='__main__':
    for t,n,fn in [('machine','Flashforge Adventurer 5M 0.4 Nozzle','m.json'),('process','0.20mm Standard @Flashforge AD5M 0.4 Nozzle','p.json'),('filament','Flashforge Generic PLA','f.json')]:
        json.dump(flat(t,n),open(fn,'w'),indent=1)
    p=json.load(open('p.json')); m=json.load(open('m.json')); f=json.load(open('f.json'))
    for k in ['wall_loops','top_shell_layers','bottom_shell_layers','sparse_infill_density','sparse_infill_pattern','outer_wall_speed','default_acceleration','outer_wall_acceleration','brim_type','brim_width','brim_object_gap','seam_position']: print(k,p.get(k))
    for k in ['default_bed_type','curr_bed_type','bed_exclude_area']: print(k,m.get(k))
    for k in ['hot_plate_temp','textured_plate_temp','eng_plate_temp','cool_plate_temp','nozzle_temperature','fan_max_speed']: print(k,f.get(k))

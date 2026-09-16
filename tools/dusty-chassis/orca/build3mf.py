import json, os, subprocess, zipfile, re, glob, shutil, sys
W='/opt/ffstudio/work'
PLATES={1:('fit-check','Fit check'),2:('base','Base plate'),3:('deck-and-arms','Deck, battery sleeve and sensor arms'),4:('brush-drive','Brush drive'),5:('tray','Crumb tray')}
COMMON={'wall_loops':'3','top_shell_layers':'5','bottom_shell_layers':'4','sparse_infill_density':'20%',
        'sparse_infill_pattern':'gyroid','brim_type':'outer_only','brim_width':'5','enable_support':'0',
        'xy_hole_compensation':'0','layer_height':'0.2','initial_layer_print_height':'0.2'}
SLOW={'outer_wall_speed':'60','inner_wall_speed':'120','small_perimeter_speed':'50%',
      'default_acceleration':'5000','outer_wall_acceleration':'3000','inner_wall_acceleration':'5000',
      'sparse_infill_acceleration':'5000','internal_solid_infill_acceleration':'5000','top_surface_acceleration':'3000'}
PER_OBJ={'pinion':{'brim_type':'no_brim'},'compound_gear':{'brim_type':'no_brim'},
         'roller_gear':{'brim_type':'no_brim'},'roller':{'brim_width':'8'}}
PROJ={'curr_bed_type':'Textured PEI Plate'}

def run(args,log):
    sh=f"{W}/job.sh"
    open(sh,'w').write('#!/bin/bash\nexport LC_ALL=C HOME=/opt/ffstudio/work/home XDG_RUNTIME_DIR=/tmp/xdg\nmkdir -p $HOME /tmp/xdg; chmod 700 /tmp/xdg\ntimeout 300 "/opt/ffstudio/squashfs-root/bin/flash studio" --datadir /opt/ffstudio/work/dd '+args+'\necho EXIT $?\n')
    os.chmod(sh,0o755)
    r=subprocess.run(['docker','run','--rm','-v','/opt/ffstudio:/opt/ffstudio','-w',W,'orca-cli','./job.sh'],capture_output=True,text=True)
    open(log,'w').write(r.stdout+r.stderr)
    assert 'EXIT 0' in r.stdout, (log, r.stdout[-500:])

def rewrite(src,dst,n,slow):
    zin=zipfile.ZipFile(src); zout=zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED)
    for it in zin.infolist():
        data=zin.read(it.filename)
        if it.filename=='Metadata/project_settings.config':
            d=json.loads(data)
            ch=dict(COMMON); 
            if slow: ch.update(SLOW)
            for k,v in ch.items():
                assert k in d,k
                d[k]=v
            d.update(PROJ)
            d['different_settings_to_system']=[';'.join(sorted(ch)), '', '']
            data=json.dumps(d,indent=4).encode()
        elif it.filename=='Metadata/model_settings.config':
            s=data.decode()
            def obj(m):
                block=m.group(0)
                name=re.search(r'<metadata key="name" value="([^"]+)"',block).group(1)
                base=re.sub(r'_\d+\.stl$','',name)
                clean=re.sub(r'_(\d+)\.stl$',r' \1',name)
                block=block.replace(f'value="{name}"',f'value="{clean}"',1)
                extra=''.join(f'\n    <metadata key="{k}" value="{v}"/>' for k,v in PER_OBJ.get(base,{}).items())
                block=block.replace('<metadata key="extruder" value="1"/>','<metadata key="extruder" value="1"/>'+extra,1)
                return block
            s=re.sub(r'<object id="\d+">.*?</object>',obj,s,flags=re.S)
            # plate names crash Flash Studio 1.7.9 on load; leave blank
            data=s.encode()
        elif it.filename=='3D/3dmodel.model':
            data=data.replace(b'<metadata name="Title"></metadata>',f'<metadata name="Title">Dusty plate {n}: {PLATES[n][1]}</metadata>'.encode())
            data=data.replace(b'<metadata name="Designer"></metadata>',b'<metadata name="Designer">nawgames.com/projects/nolan/dusty</metadata>')
        zout.writestr(it,data)
    zout.close()

os.makedirs(f'{W}/out',exist_ok=True)
m,p,f=f'{W}/m.json',f'{W}/p.json',f'{W}/f.json'
summary={}
for n,(slug,title) in PLATES.items():
    stls=' '.join(sorted(glob.glob(f'plate{n}/*.stl')))
    raw=f'{W}/raw'; shutil.rmtree(raw,ignore_errors=True); os.makedirs(raw)
    run(f'--arrange 0 --orient 0 --load-settings "{m};{p}" --load-filaments "{f}" --outputdir {raw} --export-3mf p{n}.3mf {stls}', f'{W}/log_export_{n}.txt')
    final=f'{W}/out/dusty-plate-{n}-{slug}.3mf'
    rewrite(f'{raw}/p{n}.3mf',final,n,n in (1,4))
    # validate: reload the finished project and slice it with its own settings
    sl=f'{W}/slice{n}'; shutil.rmtree(sl,ignore_errors=True); os.makedirs(sl)
    run(f'--slice 0 --outputdir {sl} {final}', f'{W}/log_slice_{n}.txt')
    g=glob.glob(f'{sl}/*.gcode')
    head=open(g[0]).read() if g else ''
    def grab(pat):
        mm=re.search(pat,head); return mm.group(1) if mm else None
    summary[n]=dict(file=os.path.basename(final),gcode=[os.path.basename(x) for x in g],
        time=grab(r'; (?:estimated printing time|model printing time)[^=]*= *([^\n]+)'),
        grams=grab(r'; filament used \[g\] = *([^\n]+)'),
        brim=len(re.findall(r'(?i)brim',head[:5000])))
    print(n,summary[n],flush=True)
json.dump(summary,open(f'{W}/out/summary.json','w'),indent=1)

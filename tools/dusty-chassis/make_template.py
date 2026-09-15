"""Rebuild assembly.tpl.html from the dustpan viewer template (generic viewer -> multi-part assembly viewer).
Run from this folder: python make_template.py"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
t = open(os.path.join(HERE, '..', 'dusty-dustpan', 'viewer.tpl.html')).read()

# ---- step 1: generic single-part viewer ----
t = t.replace('<title>Dusty dustpan, Rev A</title>', '<title>__TITLE_TEXT__</title>')
t = t.replace('<header><h1>Dusty <span>dustpan</span>, Rev A</h1>', '<header><h1>__TITLE_HTML__</h1>')
a = t.index('<dl class="specs">'); b = t.index('</dl>') + 5
t = t[:a] + '<dl class="specs">__SPECS__</dl>' + t[b:]
a = t.index('<p id="hint">'); b = t.index('</p>', a) + 4
t = t[:a] + '<p id="hint">__HINT__</p>' + t[b:]
t = t.replace("l.download='dusty-dustpan-revA.stl'", "l.download=DATA.stlName")
if '#hint a{' not in t:
    t = t.replace("#hint{color:var(--dim);font-size:13px;margin-top:8px}",
                  "#hint{color:var(--dim);font-size:13px;margin-top:8px}\n#hint a{color:var(--line)}")
a = t.index('const grid = new THREE.GridHelper'); b = t.index('\n', a)
t = t[:a] + """const BB=DATA.bounds; // model coords [[minx,miny,minz],[maxx,maxy,maxz]]
const CX=(BB[0][0]+BB[1][0])/2, CY=(BB[0][1]+BB[1][1])/2, CZ=(BB[0][2]+BB[1][2])/2;
const DIAG=Math.hypot(BB[1][0]-BB[0][0],BB[1][1]-BB[0][1],BB[1][2]-BB[0][2]);
const grid = new THREE.GridHelper(Math.ceil(DIAG*2.5/10)*10,30,0x2a4a73,0x1c3150); grid.position.set(CX,BB[0][2]-.05,-CY); scene.add(grid);""" + t[b:]
a = t.index('// dimension lines'); b = t.index('// orbit controls')
t = t[:a] + """// dimension lines (DATA.dims, model coords)
const dimMat = new THREE.LineBasicMaterial({color:0x8fd3ea});
const dimGroup = new THREE.Group(); scene.add(dimGroup);
const labelsEl = document.getElementById('labels');
const labels = [];
const V = (x,y,z)=>new THREE.Vector3(x,z,-y); // model coords -> three
function dim(a,b,off,text,note){
  const A=V(...a),B=V(...b),o=V(...off);
  const A2=A.clone().add(o),B2=B.clone().add(o);
  const ext=o.clone().setLength(3);
  const pts=[A,A2.clone().add(ext),B,B2.clone().add(ext),A2,B2];
  const dir=B2.clone().sub(A2).normalize(), t=Math.max(1.5,DIAG*.02);
  const perp=o.clone().normalize().multiplyScalar(t);
  const tk=[A2.clone().add(dir.clone().multiplyScalar(t)).add(perp),A2.clone().sub(dir.clone().multiplyScalar(t)).sub(perp),
            B2.clone().add(dir.clone().multiplyScalar(t)).add(perp),B2.clone().sub(dir.clone().multiplyScalar(t)).sub(perp)];
  dimGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([...pts,...tk]),dimMat));
  const el=document.createElement('div'); el.className='dl';
  el.textContent=text; if(note){const s=document.createElement('small');s.textContent=note;el.appendChild(s);}
  labelsEl.appendChild(el);
  labels.push({el,p:A2.clone().add(B2).multiplyScalar(.5)});
}
(DATA.dims||[]).forEach(d=>dim(d.a,d.b,d.off,d.text,d.note));

""" + t[b:]
old = "const target=new THREE.Vector3(0,10,-33);   // center of the part\nconst FIT_R=78;                                // bounding sphere of part + dimension labels"
assert old in t
t = t.replace(old, "const target=V(CX,CY,CZ);                    // orbit around the part's center\nconst FIT_R=DIAG*.5*(DATA.fitPad||1.3);      // bounding sphere of part + dimension labels")
t = t.replace("const P = DATA.P;\n", "")

# ---- step 2: multi-part assembly with ghost (bought) parts ----
a = t.index('// model (x,y,z) with y = depth'); b = t.index('scene.add(new THREE.HemisphereLight')
t = t[:a] + """// model (x,y,z), y = back, z = up  ->  three (x, z, -y)
const partGroup = new THREE.Group(), ghostGroup = new THREE.Group();
scene.add(partGroup); scene.add(ghostGroup);
function addMesh(p){
  const v=p.v, pos=new Float32Array(v.length);
  for(let i=0;i<v.length;i+=3){pos[i]=v[i];pos[i+1]=v[i+2];pos[i+2]=-v[i+1];}
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setIndex(p.f);
  const ng=g.toNonIndexed(); ng.computeVertexNormals();
  const ghost=p.o<1;
  const mat=new THREE.MeshStandardMaterial({color:p.c,roughness:.55,metalness:.05,transparent:ghost,opacity:p.o,depthWrite:!ghost});
  const mesh=new THREE.Mesh(ng,mat);
  (ghost?ghostGroup:partGroup).add(mesh);
  if(!ghost){const e=new THREE.LineSegments(new THREE.EdgesGeometry(g,30),new THREE.LineBasicMaterial({color:0x000000,transparent:true,opacity:.35}));partGroup.add(e);}
}
DATA.parts.forEach(addMesh);
""" + t[b:]
t = t.replace('<button id="dims" class="on">Dimensions</button>', '<button id="ghosts" class="on">Parts</button><button id="dims" class="on">Dimensions</button>')
t = t.replace("const dimsBtn=document.getElementById('dims');", """const gBtn=document.getElementById('ghosts');
gBtn.onclick=()=>{const on=!gBtn.classList.contains('on');gBtn.classList.toggle('on',on);ghostGroup.visible=on;};
const dimsBtn=document.getElementById('dims');""")
t = t.replace("const f=DATA.f, n=f.length/3", "const f=DATA.plate.f, v=DATA.plate.v, n=f.length/3")
t = t.replace('<dl class="specs">__SPECS__</dl>', '<div id="legend">__LEGEND__</div>\n<dl class="specs">__SPECS__</dl>')
t = t.replace("#hint{color:var(--dim);font-size:13px;margin-top:8px}", """#hint{color:var(--dim);font-size:13px;margin-top:8px}
#legend{display:flex;flex-wrap:wrap;gap:4px 12px;margin:0 0 8px;font-size:13px;color:var(--dim)}
#legend span{display:inline-flex;align-items:center;gap:5px}
#legend i{width:10px;height:10px;border-radius:2px;display:inline-block}""")
t = t.replace("#hint{display:none}", "#hint{display:none}#legend{display:none}")
t = t.replace("let theta=-.75, phi=1.0", "let theta=.8, phi=1.0").replace("const views={iso:[-.75,1.0]", "const views={iso:[.8,1.0]")
assert 'DATA.v' not in t and 'DATA.parts' in t and 'theta=.8' in t
open(os.path.join(HERE, 'assembly.tpl.html'), 'w').write(t)
print('assembly.tpl.html', len(t))

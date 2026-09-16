import html, json
DF='DFRobot'; DK='DigiKey'; AF='Adafruit'; WM='Walmart'; TG='Target'
# (num, section, name, qty, role, primary, backup, note)
# primary/backup: dict(v, pn, title, unit, qty, url, stock)
P=[]
def item(sec,name,qty,role,pri,bak,note=''):
    P.append(dict(sec=sec,name=name,qty=qty,role=role,pri=pri,bak=bak,note=note))
def src(v,pn,title,unit,url,stock,qty=None,ext=None):
    return dict(v=v,pn=pn,title=title,unit=unit,url=url,stock=stock,qty=qty,ext=ext)

S1='Brains and control'
item(S1,'micro:bit V2',2,'One runs the turret, one lives in the mosquito wand. They talk by radio, and the wand one records the data.',
 src(DF,'MBT0039','micro:bit V2',22.90,'https://www.dfrobot.com/product-2125.html','In stock'),
 src(AF,'4781','BBC micro:bit v2',17.95,'https://www.adafruit.com/product/4781','In stock'),
 'Board only. Uses micro-USB for code; a cable is almost certainly on hand.')
item(S1,'Expansion board (turret)',1,'Holds the turret micro:bit. 5 V ports for the servos and speaker, a 5 V HuskyLens port, a relay that switches the laser, and an external power input.',
 src(DF,'MBT0042','Xia mi Multi-functional Expansion Board for micro:bit V2',29.90,'https://www.dfrobot.com/product-2371.html','In stock'),
 src(DF,'DFR0548','micro:Driver expansion board (8 servo, 4 motor)',11.90,'https://www.dfrobot.com/product-1738.html','In stock'),
 'Xia mi: HuskyLens port (5 V I2C), 5 V GPIO on P0 P1 P2 P8, relay and 4 motor channels, 5 to 12 V external input, MakeCode extension DFRobot/pxt-DFRobot_xia_mi_Board. Backup board: servos and motor channels confirmed; its I2C port voltage for the HuskyLens is not documented.')

S2='Camera and aiming'
item(S2,'HuskyLens AI camera',1,'Learns the fake mosquito and reports where it is on screen.',
 src(DF,'SEN0305','Gravity: HuskyLens K210 AI Camera',34.90,'https://www.dfrobot.com/product-1922.html','In stock'),
 src(DK,'1738-SEN0305-ND','DFRobot SEN0305 (HuskyLens)',54.90,'https://www.digikey.com/en/products/detail/dfrobot/SEN0305/10529331','68 in stock*'),
 'Comes with a 4-pin Gravity cable, two brackets, and M3 screws and nuts for its own mounting. MakeCode extension: DFRobot/pxt-DFRobot_HuskyLens.')
item(S2,'Micro servo',3,'Pan, tilt, and one spare.',
 src(DF,'SER0049','9g 180 degree Clutch Servo (damage-proof)',4.90,'https://www.dfrobot.com/product-2120.html','In stock',ext=14.70),
 src(AF,'169','Micro Servo, TowerPro SG92R',5.95,'https://www.adafruit.com/product/169','In stock',ext=17.85),
 'Clutch servo slips instead of stripping gears when a hand grabs the turret. 4.8 to 6 V. Price is the 3+ rate ($5.00 each for 1 or 2).')

S3='Laser and hit sensing'
item(S3,'Class 2 laser module, under 1 mW',1,'The laser. Maker-labeled Class II.',
 src(DK,'VLM-650-03-LPT-ND','Quarton VLM-650-03 LPT, 650 nm, <1 mW, 7 mm',25.03,'https://www.digikey.com/en/products/detail/quarton-inc/VLM-650-03-LPT/1010454','1,372 in stock*'),
 src(DK,'VLM-650-22 LPT','Quarton VLM-650-22 LPT, 650 nm, 0.5 to 0.9 mW, 4 mm',None,'https://www.digikey.com/en/products/detail/quarton-inc/VLM-650-22-LPT/8636974','Ships today'),
 'Quarton manuals confirm both LPT versions are Class II, under 1 mW. Not sold by Adafruit, DFRobot, or Mouser. Do not substitute a 5 mW hobby laser (Class IIIa).')
item(S3,'Laser arm switch',1,'Cuts power to the laser only. Must be on before the laser can fire at all.',
 src(DK,'Adafruit 805','Breadboard-friendly SPDT slide switch',0.95,'https://www.digikey.com/en/products/detail/adafruit-industries-llc/805/26735538','Price not shown'),
 src(AF,'805','Breadboard-friendly SPDT Slide Switch',0.95,'https://www.adafruit.com/product/805','In stock'),
 'DigiKey lists this part but did not show a price; $0.95 is Adafruit\'s price. Confirm in the cart, or add it to an Adafruit order.')
item(S3,'Light sensor',3,'One inside each mosquito body. Feels the laser dot.',
 src(DK,'1528-2748-ND','Adafruit ALS-PT19 analog light sensor breakout',2.50,'https://www.digikey.com/en/products/detail/adafruit-industries-llc/2748/5775538','321 in stock*',ext=7.50),
 src(AF,'2748','Adafruit ALS-PT19 Analog Light Sensor Breakout',2.50,'https://www.adafruit.com/product/2748','In stock',ext=7.50),
 '2.5 to 5.5 V, analog output. Cheaper backup: Adafruit 161 photocell ($0.95, needs a 10k resistor).')
item(S3,'Red LED, 5 mm',10,'Mosquito eyes that flash on a hit (2 per mosquito, plus spares).',
 src(DK,'754-1264-ND','Kingbright WP7113ID red diffused 5 mm',0.145,'https://www.digikey.com/en/products/detail/kingbright/WP7113ID/1747663','145,526 in stock*',ext=1.45),
 src(AF,'297','Super Bright Red 5mm LED (25 pack)',8.00,'https://www.adafruit.com/product/297','In stock',ext=8.00,qty=1),
 'Price is the 10-piece rate.')
item(S3,'220 ohm resistor',10,'One per LED.',
 src(DK,'220QBK-ND','Yageo CFR-25JB-52-220R, 1/4 W',0.036,'https://www.digikey.com/en/products/detail/yageo/CFR-25JB-52-220R/1295','77,901 in stock*',ext=0.36),
 src(AF,'2780','Through-Hole Resistors, 220 ohm (25 pack)',0.75,'https://www.adafruit.com/product/2780','In stock',ext=0.75,qty=1),
 'Price is the 10-piece rate.')
item(S3,'Thin 4-wire cable, 1 m',1,'Runs down the fishing line to the sensor and eyes: power, ground, sensor, LEDs.',
 src(DK,'1528-2694-ND','Adafruit 3891 silicone ribbon cable, 4 wire, 28 AWG, 1 m',1.95,'https://www.digikey.com/en/products/detail/adafruit-industries-llc/3891/9603617','16 in stock*'),
 src(AF,'3890','Silicone ribbon cable, 10 wire, 28 AWG, 1 m (peel off 4)',3.95,'https://www.adafruit.com/product/3890','In stock'),
 'Low stock at DigiKey: order early.')

S4='Sound'
item(S4,'Speaker module',1,'Laser pew, cannon boom, lock-on beep, victory sound. Volume knob.',
 src(DF,'FIT0449','Gravity: Digital Speaker Module',6.00,'https://www.dfrobot.com/product-1401.html','In stock'),
 src(AF,'2130 + 3923','PAM8302 2.5 W mono amp ($3.95) + mini oval 8 ohm speaker ($1.95)',5.90,'https://www.adafruit.com/product/2130','In stock'),
 'Plugs into the Xia mi P0 port (5 V); MakeCode plays sound on P0. Backup speaker page: adafruit.com/product/3923 (solder the wires to the amp).')

S5='Power'
item(S5,'Turret power bank, USB-C',1,'Powers the Xia mi board: servos, camera, speaker, laser. Steady 5 V, stays inside the base and charges through the side port (change MOC-004, Sep 16).',
 src(WM,'A1112','Anker 321 Power Bank (PowerCore 5K), 5,200 mAh, USB-A + USB-C',23.84,'https://www.walmart.com/ip/Anker-5K-Power-Bank-12W-USB-C-USB-A-Port/2335161189','In stock'),
 src(TG,'A-86373147','Same bank (Anker 5000mAh PowerCore 5K 12W 1A1C)',None,'https://www.target.com/p/anker-5000mah-power-bank-powercore-5k-12w-1a1c-black/-/A-86373147','Check store'),
 '97 x 45.8 x 22 mm, 118 g, 5 V up to 2.4 A. Same bank as Nolan\'s Dusty. The turret draws enough that the bank never shuts itself off; do not use its trickle mode (double press). Also sold at Micro Center Houston.')
item(S5,'USB to barrel jack cable',1,'Bank USB-A port to the power switch, then the Xia mi DC jack.',
 src(AF,'2697','USB to 2.1mm Male Barrel Jack Cable, 22AWG, 1 m',2.75,'https://www.adafruit.com/product/2697','In stock'),
 src('Newark','2697','Adafruit 2697 (same cable)',None,'https://www.newark.com/adafruit/2697/usb-to-2-1mm-male-barrel-jack/dp/77Y5319','Check stock'),
 'Center positive, 5.5/2.1 mm. Coil the extra length inside the base. A 90 degree USB-A adapter (spare from Dusty\'s pair) turns the plug so it fits in front of the bank.')
item(S5,'Power switch',1,'Main on/off. Plugs between the barrel cable and the Xia mi jack; the rocker pokes through the right wall.',
 src(AF,'1125','In-line power switch for 2.1mm barrel jack, 2 A',2.50,'https://www.adafruit.com/product/1125','In stock'),
 src('Mouser','1125','Adafruit 1125 (same switch)',2.50,'https://www.mouser.com/c/?q=adafruit%201125','Check stock'),
 'Body size is not published: measure it before printing the base.')
item(S5,'USB-C charge port',1,'Panel USB-C socket in the right wall. Its cable plugs into the bank, so a phone charger charges the turret from outside.',
 src(AF,'6069','USB C Small Round Panel Mount Extension Cable',4.50,'https://www.adafruit.com/product/6069','In stock'),
 src(AF,'4218','USB C Round Panel Mount Extension Cable, 30 cm (needs a 21.5 mm hole)',9.95,'https://www.adafruit.com/product/4218','In stock'),
 'Fits a 12 to 18 mm hole; the base has 14 mm. Also listed at DigiKey (6069). Switch off before charging: plugging in can blink the power and reset the micro:bit.')
item(S5,'micro:bit battery pack',2,'Powers the wand micro:bit, and the turret micro:bit if the board does not.',
 src(DF,'FIT0625','2xAAA battery holder with cover and switch, PH2.0',1.25,'https://www.dfrobot.com/product-1855.html','In stock',ext=2.50),
 src(AF,'4193','2xAA battery holder with on/off switch and JST PH',1.95,'https://www.adafruit.com/product/4193','In stock',ext=3.90),
 'The micro:bit battery socket is JST PH 2.0 mm. Adafruit\'s 2xAAA version (4191) is out of stock, so the backup is 2xAA.')

S6='Wiring and hardware'
item(S6,'M2 screw, nut, and standoff kit',1,'Every printed part: base, turret head, wand handle, sensor pod, and backdrop parts.',
 src(DF,'FIT0665','Metal screw, nut and mounting kit, M2, 320 pcs',12.90,'https://www.dfrobot.com/product-2023.html','In stock'),
 src(DK,'1738-FIT0665-ND','DFRobot FIT0665 (same kit)',12.90,'https://www.digikey.com/en/products/detail/dfrobot/FIT0665/12324933','321 in stock*'),
 'Prints use M2 clearance holes (2.2 mm) and M2 nut traps. Exceptions: HuskyLens uses its own M3 kit; servos use their own horn screws.')
item(S6,'Gravity 3-pin cables (10 pack)',1,'Servo, speaker, and laser leads to the board, plus spares.',
 src(DF,'FIT0031','Gravity: Analog Sensor Cable, 30 cm (10 pack)',6.00,'https://www.dfrobot.com/product-128.html','In stock'),
 src(DK,'1738-1031-ND','DFRobot FIT0031 (same cables)',6.00,'https://www.digikey.com/en/products/detail/dfrobot/FIT0031/6588453','111 in stock*'),
 '')

LOCAL=[
 ('AAA batteries','4 plus 4 spares','Grocery store'),
 ('Stuffed mosquito toy (the target)','1','Toy store or online'),
 ('Short fishing rod or 3/8" dowel, clear 10 lb line','1','Sporting goods or hardware store'),
 ('Black foam board, 20x30 in, 3/16" thick','1','Craft store'),
 ('1/4" wood dowel','1','Craft or hardware store'),
 ('Small zip ties and hook-and-loop tape','1 pack each','Hardware store'),
 ('PLA filament, any color plus a little white','About 310 g + 11 g white','On hand (check for white)'),
 ('Solder, heat-shrink tubing, hot glue','Small amounts','On hand'),
 ('Micro-USB data cables','2','Probably on hand'),
 ('90 degree USB-A adapter','1','Spare from Dusty\'s pair (backup: Walmart 709931832)'),
 ('USB-C phone charger and cable','1','On hand'),
 ('Hook-and-loop strap, 20 mm','1','Hardware store (holds the bank)'),
 ('Paper data sheets, printed','15 per test','Print at home'),
]
LOCAL_EST=30

def total(side, vendor=None):
    t=0; unknown=[]
    for it in P:
        s=it[side]
        if vendor and s['v']!=vendor: continue
        if s['unit'] is None: unknown.append(it['name']); continue
        t+= s['ext'] if s['ext'] is not None else s['unit']*(s['qty'] or it['qty'])
    return round(t,2), unknown
pDF,_=total('pri',DF); pDK,uk=total('pri',DK); pAF,_=total('pri',AF); pWM,_=total('pri',WM); pT,_=total('pri')
bT,bu=total('bak')
bAF,_=total('bak',AF); bDK,_=total('bak',DK); bDF,_=total('bak',DF)
json.dump(dict(pDF=pDF,pDK=pDK,pAF=pAF,pWM=pWM,pT=pT,bT=bT,bAF=bAF,bDK=bDK,bDF=bDF,bu=bu),open('totals.json','w'))

def money(x): return '$%.2f'%x
def price_cell(s,qty):
    if s['unit'] is None: return '<span class="tbd">at checkout</span>'
    ext = s['ext'] if s['ext'] is not None else s['unit']*(s['qty'] or qty)
    q = s['qty'] or qty
    unit = ('$%.3f'%s['unit']).rstrip('0') if s['unit']<0.1 else money(s['unit'])
    if q>1: return f'{money(ext)}<small>{q} &times; {unit}</small>'
    return money(ext)
def shorturl(u):
    return u.replace('https://www.','').replace('https://','')
def srcrow(label,s,qty,cls):
    e=html.escape
    return f'''<div class="src {cls}"><div class="tag">{label}</div>
<div class="body"><div class="top"><span class="vend v-{s["v"].lower()}">{s["v"]}</span><span class="pn">{e(s["pn"])}</span><span class="stock">{e(s["stock"])}</span></div>
<div class="title">{e(s["title"])}</div><a class="url" href="{s["url"]}">{e(shorturl(s["url"]))}</a></div>
<div class="price">{price_cell(s,qty)}</div></div>'''

secs=[]
n=0
cur=None
out=[]
for it in P:
    if it['sec']!=cur:
        if cur is not None: out.append('</section>')
        cur=it['sec']; out.append(f'<section><h2>{cur}</h2>')
    n+=1
    out.append(f'''<div class="item"><div class="ihead"><span class="num">{n:02d}</span><span class="iname">{html.escape(it["name"])}</span><span class="qty">Qty {it["qty"]}</span></div>
<div class="role">{html.escape(it["role"])}</div>
{srcrow("PRIMARY",it["pri"],it["qty"],"p")}
{srcrow("BACKUP",it["bak"],it["qty"],"b")}
{f'<div class="note">{html.escape(it["note"])}</div>' if it["note"] else ''}</div>''')
out.append('</section>')
items_html='\n'.join(out)

def cart(side,vendor):
    rows=[]
    for i,it in enumerate(P,1):
        s=it[side]
        if s['v']!=vendor: continue
        q = s['qty'] or it['qty']
        ext = None if s['unit'] is None else (s['ext'] if s['ext'] is not None else s['unit']*q)
        rows.append(f'<tr><td>{i:02d}</td><td>{html.escape(s["pn"])}</td><td>{html.escape(it["name"])}</td><td class="r">{q}</td><td class="r">{money(ext) if ext is not None else "tbd"}</td></tr>')
    return '\n'.join(rows)
local_rows='\n'.join(f'<tr><td>{html.escape(a)}</td><td>{html.escape(b)}</td><td>{html.escape(c)}</td></tr>' for a,b,c in LOCAL)

doc=open('template.html').read()
for k,v in dict(ITEMS=items_html, CART_DF=cart('pri',DF), CART_DK=cart('pri',DK), CART_AF=cart('pri',AF), CART_WM=cart('pri',WM), LOCAL=local_rows,
  PDF=money(pDF), PDK=money(pDK), PAF=money(pAF), PWM=money(pWM), PT=money(pT), PALL=money(pT+LOCAL_EST), LOCALEST=money(LOCAL_EST),
  BT=money(bT), BAF=money(bAF), BDK=money(bDK), BDF=money(bDF), NITEMS=str(len(P))).items():
    doc=doc.replace('{{'+k+'}}',v)
open('ms2000-parts-list.html','w').write(doc)
print(json.load(open('totals.json')))

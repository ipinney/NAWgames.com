"""Writes public/projects/addie/flymo-build-guide.html in the MS-2000 guide style (same CSS, lime/pink palette).
Run: python3 tools/flymo-cad/make_build_guide.py   (from /opt/nawgames)"""
import re, html, json, os

ROOT = '/opt/nawgames'
src = open(f'{ROOT}/public/projects/addie/ms2000-build-guide.html').read()
css = src[src.index('<style>'):src.index('</style>') + 8]
css = css.replace('#3A2150 0%, #1B2238 60%', '#23402A 0%, #1B2238 60%')
css = css.replace('</style>', """
  .code { margin-top: 14px; background: #0B111C; border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; overflow-x: auto; }
  .code h4 { font-size: 15px; margin-bottom: 6px; color: var(--sky); }
  .code pre { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; line-height: 1.55; color: #D6E2F0; white-space: pre; }
  .code pre .c { color: #74839B; }
  .code p { font-size: 13px; color: var(--ink-3); margin-top: 6px; }
  .pic2 { background: var(--deep); border-radius: 12px; padding: 10px; margin-top: 14px; }
  .pic2 img { display: block; width: 100%; height: auto; border-radius: 8px; }
</style>""")

W = json.load(open(f'{ROOT}/public/projects/addie/flymo-cad/weights.json'))
CAD = '/projects/addie/flymo-cad'
BASE = '/projects/addie/flying-mosquito'
G = '/projects/addie/flymo-guide'

TICK = '<span class="tick"><svg viewBox="0 0 12 12"><path d="M2 6.5 L5 9.5 L10 3" fill="none" stroke="#10160d" stroke-width="2"/></svg></span>'


def step(n, title, when, why, body, check=None, journal=None, grown=False):
    g = ' &middot; <span class="grownup">grown-up</span>' if grown else ''
    out = f'''
  <div class="step" id="step-{n}">
    <div class="step-head">
      <span class="num">{n}</span>
      <div><h2>{title}</h2><p class="when">{when}{g}</p></div>
    </div>
    <p class="why">{why}</p>
{body}'''
    if check:
        out += f'''
    <div class="checkpoint">{TICK}<div><h4>Checkpoint</h4><p>{check}</p></div></div>'''
    if journal:
        out += f'''
    <p class="journal"><b>Journal:</b> {journal}</p>'''
    return out + '\n  </div>\n'


def do(items):
    lis = ''.join(f'<li>{a}' + (f'<span class="tip">{b}</span>' if b else '') + '</li>' for a, b in items)
    return f'    <ol class="do">{lis}</ol>\n'


def explain(q, *ps):
    return f'    <div class="explain"><h4>{q}</h4>' + ''.join(f'<p>{p}</p>' for p in ps) + '</div>\n'


def gotcha(b, t):
    return f'    <div class="gotcha"><b>{b}</b> {t}</div>\n'


def code(title, text, note=''):
    t = html.escape(text)
    t = re.sub(r'(#[^\n]*|//[^\n]*)', lambda m: f'<span class="c">{m.group(1)}</span>', t)
    return f'    <div class="code"><h4>{title}</h4><pre>{t}</pre>' + (f'<p>{note}</p>' if note else '') + '</div>\n'


def chapter(k, eyebrow, title, text):
    return f'''
  <div class="chapter" id="part-{k}">
    <p class="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
'''


def pic(src, cap):
    return f'    <div class="diagram"><img src="{src}" alt="{html.escape(cap)}" loading="lazy"><p class="caption">{cap}</p></div>\n'


def blocks(title, sub, rows):
    out = f'    <div class="prog"><h4>{title}</h4><p>{sub}</p><div class="blocks">'
    for cls, text, note in rows:
        n = f'<small>{note}</small>' if note else ''
        out += f'<div class="blk {cls}">{text}{n}</div>'
    return out + '</div></div>\n'


PARTS = [
    ('LiteWing drone', '1', 'A drone whose frame is its circuit board: an ESP32-S3 computer, a motion sensor, four motor drivers and WiFi. Comes with 4 motors and 55 mm props.', 'Flies. Makes its own WiFi network that the control box and the mosquito body join.', '100 x 100 mm &middot; about 45 g &middot; no battery included'),
    ('Positioning module', '1', 'A small board that plugs in underneath: a floor camera (PMW3901) and an invisible laser range finder (VL53L1X), plus 4 colored lights.', 'Lets the drone hold still without anyone steering.', '46 x 44 mm &middot; 8 g &middot; arrow points to the USB-C port'),
    ('1S LiPo batteries', '3', 'Single-cell lithium polymer, 3.7 V, 500 to 650 mAh, 20C or more, MX2.0 plug.', 'The fuel tank. One flies, one cools, one charges.', 'CHECK THE PLUG POLARITY before the first plug-in'),
    ('XIAO ESP32-C3', '2', 'A thumbnail-size WiFi computer. One spare.', 'Lives in the body, watches the light sensor, and sends HIT over the drone WiFi.', '21 x 17.8 mm &middot; about 1.5 g'),
    ('ALS-PT19 light sensor', '2', 'A tiny light sensor on a board with 3 pins: VIN, GND, OUT. Same sensor as the MS-2000 pod. One spare.', 'Feels the red laser dot glowing in the white window.', '7.8 x 10.6 mm'),
    ('Raspberry Pi Zero 2 W', '1', 'A small Linux computer.', 'Runs the flight script, hears the HIT messages, and talks to the micro:bit.', '65 x 30 mm &middot; needs a 32 GB microSD card'),
    ('micro:bit V2', '1', 'The same little computer as the MS-2000 turret and wand.', 'Shows the status and radios GO, HIT and STOP on group 7. Saves each run.', 'Plugs into the Pi by USB'),
    ('24 mm arcade button', '1', 'A big button with a light inside.', 'Press to fly. The light means the drone is ready.', 'Adafruit 3430'),
    ('Power bank and cables', '1 set', 'Anker 321 power bank, USB cable with switch, USB-C panel port, OTG cable, micro:bit cable, jumper wires.', 'Powers the Pi. The switch is the main on/off; the panel port charges the bank.', 'Same bank as the MS-2000'),
    ('Pop-up bug habitat', '1', 'A mesh cube about 24 x 24 x 36 inches.', 'The flight zone. Front rolled open toward the turret.', 'Holds the flight mat and the pad'),
    ('Printed parts', '7 plates', 'Prop guard with legs, mosquito body, white hit window, launch pad, control box, box floor, fit check.', 'Protect the props, hold the sensor, catch the laser, start every run in the same spot.', 'About 5 h 45 min &middot; about 205 g'),
]


def pcards():
    out = '    <div class="parts">'
    for name, q, what, does, spec in PARTS:
        out += (f'<div class="pcard"><div class="pbody"><h3>{name}<small>x {q}</small></h3><p class="what">{what}</p>'
                f'<p class="does"><b>Its job:</b> {does}</p><p class="spec">{spec}</p></div></div>')
    return out + '</div>\n'


HOW_SVG = '''<svg viewBox="0 0 660 250" role="img" aria-label="Press GO on the control box, the drone takes off and flies its pattern, the laser tags the white window, the light sensor and XIAO send HIT over WiFi to the Pi, the micro:bit radios HIT to the turret, and the drone lands.">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#74839B"/></marker></defs>
  <g font-family="Fredoka, sans-serif" text-anchor="middle">
    <rect x="14" y="20" width="140" height="74" rx="10" fill="#1F2940" stroke="#9BE15D"/><text x="84" y="48" font-size="17" fill="#EEF2F8">1 Press GO</text><text x="84" y="70" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">control box</text>
    <rect x="182" y="20" width="140" height="74" rx="10" fill="#1F2940" stroke="#9BE15D"/><text x="252" y="48" font-size="17" fill="#EEF2F8">2 Take off</text><text x="252" y="70" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">Pi flies it by WiFi</text>
    <rect x="350" y="20" width="140" height="74" rx="10" fill="#1F2940" stroke="#9BE15D"/><text x="420" y="48" font-size="17" fill="#EEF2F8">3 Fly the loop</text><text x="420" y="70" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">30 s, facing turret</text>
    <rect x="508" y="20" width="140" height="74" rx="10" fill="#1F2940" stroke="#F0605E"/><text x="578" y="48" font-size="17" fill="#EEF2F8">4 Laser tag</text><text x="578" y="70" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">white window glows</text>
    <rect x="508" y="150" width="140" height="74" rx="10" fill="#1F2940" stroke="#F0609E"/><text x="578" y="178" font-size="17" fill="#EEF2F8">5 Feel it</text><text x="578" y="200" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">sensor + XIAO</text>
    <rect x="350" y="150" width="140" height="74" rx="10" fill="#1F2940" stroke="#F0609E"/><text x="420" y="178" font-size="17" fill="#EEF2F8">6 Tell the box</text><text x="420" y="200" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">WiFi to the Pi</text>
    <rect x="182" y="150" width="140" height="74" rx="10" fill="#1F2940" stroke="#F0609E"/><text x="252" y="178" font-size="17" fill="#EEF2F8">7 Radio HIT</text><text x="252" y="200" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">micro:bit, group 7</text>
    <rect x="14" y="150" width="140" height="74" rx="10" fill="#1F2940" stroke="#5DB7F0"/><text x="84" y="178" font-size="17" fill="#EEF2F8">8 Land</text><text x="84" y="200" font-size="12" fill="#A9B6CA" font-family="Nunito, sans-serif">on the pad, STOP</text>
  </g>
  <g stroke="#74839B" stroke-width="2" marker-end="url(#ar)" fill="none">
    <path d="M156 57 H178"/><path d="M324 57 H346"/><path d="M492 57 H504"/><path d="M578 96 V146"/><path d="M506 187 H494"/><path d="M348 187 H326"/><path d="M180 187 H158"/>
  </g>
</svg>'''

BODY_SVG = '''<svg viewBox="0 0 660 260" role="img" aria-label="Inside the mosquito: two thin wires from the drone battery plug to the XIAO BAT pads; the light sensor VIN to XIAO 3V3, GND to GND, OUT to A0.">
  <g font-family="Nunito, sans-serif">
    <rect x="20" y="40" width="170" height="170" rx="12" fill="#1F2940" stroke="#2B3650"/><text x="105" y="66" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" fill="#EEF2F8">Drone board</text>
    <rect x="55" y="120" width="100" height="44" rx="6" fill="#121A2B" stroke="#74839B"/><text x="105" y="140" text-anchor="middle" font-size="12" fill="#A9B6CA">battery plug</text><text x="105" y="156" text-anchor="middle" font-size="11" fill="#74839B">+ and - on the back</text>
    <rect x="260" y="60" width="160" height="150" rx="12" fill="#1F2940" stroke="#5DB7F0"/><text x="340" y="86" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" fill="#EEF2F8">XIAO ESP32-C3</text>
    <text x="272" y="118" font-size="12" fill="#A9B6CA">BAT+ (under)</text><text x="272" y="140" font-size="12" fill="#A9B6CA">BAT- (under)</text>
    <text x="408" y="118" text-anchor="end" font-size="12" fill="#A9B6CA">3V3</text><text x="408" y="148" text-anchor="end" font-size="12" fill="#A9B6CA">GND</text><text x="408" y="178" text-anchor="end" font-size="12" fill="#A9B6CA">A0 (D0)</text>
    <rect x="500" y="90" width="140" height="110" rx="12" fill="#1F2940" stroke="#9BE15D"/><text x="570" y="116" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" fill="#EEF2F8">Light sensor</text>
    <text x="512" y="146" font-size="12" fill="#A9B6CA">VIN</text><text x="512" y="166" font-size="12" fill="#A9B6CA">GND</text><text x="512" y="186" font-size="12" fill="#A9B6CA">OUT</text>
  </g>
  <g fill="none" stroke-width="3" stroke-linecap="round">
    <path d="M155 132 C210 132, 210 114, 262 114" stroke="#F0605E"/>
    <path d="M155 152 C210 152, 210 136, 262 136" stroke="#74839B"/>
    <path d="M412 114 C455 114, 460 142, 506 142" stroke="#F0605E"/>
    <path d="M412 144 C455 144, 460 162, 506 162" stroke="#74839B"/>
    <path d="M412 174 C455 174, 460 182, 506 182" stroke="#F5B642"/>
  </g>
</svg>'''

BOX_SVG = '''<svg viewBox="0 0 660 280" role="img" aria-label="Inside the control box: power bank USB-A through the switch cable to the Pi PWR port; the Pi USB port through the OTG cable to the micro:bit; the GO button switch to GPIO 17 and ground, its light to GPIO 27 and ground; the USB-C panel port charges the bank.">
  <g font-family="Nunito, sans-serif">
    <rect x="20" y="150" width="170" height="90" rx="12" fill="#1F2940" stroke="#74839B"/><text x="105" y="178" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" fill="#EEF2F8">Power bank</text><text x="105" y="200" text-anchor="middle" font-size="12" fill="#A9B6CA">USB-A out, USB-C in</text>
    <rect x="20" y="30" width="170" height="70" rx="12" fill="#1F2940" stroke="#2B3650"/><text x="105" y="58" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="15" fill="#EEF2F8">USB-C charge port</text><text x="105" y="80" text-anchor="middle" font-size="12" fill="#A9B6CA">right wall</text>
    <rect x="260" y="110" width="170" height="130" rx="12" fill="#1F2940" stroke="#5DB7F0"/><text x="345" y="136" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" fill="#EEF2F8">Pi Zero 2 W</text>
    <text x="272" y="200" font-size="12" fill="#A9B6CA">PWR port</text><text x="418" y="200" text-anchor="end" font-size="12" fill="#A9B6CA">USB port</text>
    <text x="345" y="160" text-anchor="middle" font-size="12" fill="#A9B6CA">GPIO 17, 27, GND</text>
    <rect x="490" y="160" width="150" height="80" rx="12" fill="#1F2940" stroke="#9BE15D"/><text x="565" y="190" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" fill="#EEF2F8">micro:bit</text><text x="565" y="212" text-anchor="middle" font-size="12" fill="#A9B6CA">radio group 7</text>
    <rect x="490" y="30" width="150" height="80" rx="12" fill="#1F2940" stroke="#F0609E"/><text x="565" y="60" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="16" fill="#EEF2F8">GO button</text><text x="565" y="82" text-anchor="middle" font-size="12" fill="#A9B6CA">switch + light</text>
    <text x="215" y="232" text-anchor="middle" font-size="11" fill="#F5B642">switch cable</text><text x="460" y="232" text-anchor="middle" font-size="11" fill="#5DB7F0">OTG + USB</text>
  </g>
  <g fill="none" stroke-width="3" stroke-linecap="round">
    <path d="M105 102 V146" stroke="#74839B"/>
    <path d="M190 210 C230 210, 240 196, 262 196" stroke="#F5B642"/>
    <path d="M428 196 C455 196, 465 200, 488 200" stroke="#5DB7F0"/>
    <path d="M430 150 C470 150, 470 70, 488 70" stroke="#F0609E"/>
  </g>
</svg>'''

S = []
S.append(f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>How To Build the Flying Mosquito</title>
<meta name="description" content="Step-by-step build guide for Addie's Flying Mosquito: a tiny 3D printed drone that flies by itself, carries a glowing hit window, and radios every laser hit to the MS-2000 turret.">
<meta property="og:title" content="How to build the Flying Mosquito">
<meta property="og:description" content="A self-flying drone mosquito for the MS-2000 laser turret, step by step: parts, wiring, prints, the lift experiment, and the code.">
<meta property="og:image" content="https://nawgames.com/projects/addie/flymo-og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:type" content="website"><meta property="og:site_name" content="NAW Games">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://nawgames.com/projects/addie/flymo-og.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
{css}
</head>
<body>
<div class="wrap">

  <div class="card hero">
    <span class="bug">&#129439;</span>
    <h1><span>How To Build</span>Flying <em>Mosquito</em></h1>
    <p>A tiny drone mosquito that takes off from its pad, flies around its net by itself, and radios back every time the MS-2000 laser tags its glowing white window. This guide goes from a box of parts to a working target, one step at a time.</p>
    <div class="facts">
      <span class="fact">BUILD <b>DEC 1 TO JAN 24</b></span>
      <span class="fact">TAKEOFF <b>ABOUT {W['_total_g']:.0f} G</b></span>
      <span class="fact">PRINTED PARTS <b>7 PLATES</b></span>
      <span class="fact">BRAINS <b>DRONE + PI + XIAO + MICRO:BIT</b></span>
      <span class="fact">DESIGN <b>REV A</b></span>
    </div>
    <nav class="jump">
      <a href="#safety">Safety</a><a href="#how">How it works</a><a href="#tools">Tools</a><a href="#parts">Parts</a><a href="#wiring">Wiring</a><a href="#screws">Screws</a>
      <a href="#part-1">A. Check and print</a><a href="#part-2">B. Can it fly?</a><a href="#part-3">C. Fly by itself</a><a href="#part-4">D. Hit sensor</a><a href="#part-5">E. Control box</a><a href="#part-6">F. Test</a><a href="#fix">Fixing it</a><a href="#words">Words</a>
    </nav>
  </div>

  <div class="safety" id="safety">
    <h2>Read this part first</h2>
    <ul>
      <li><b>Props spin thousands of times a minute.</b> The drone only flies with its guard on, inside the net. Hands out while the props turn.</li>
      <li><b>Takeoff only from the pad.</b> Nobody stands over the net. A long press on GO lands it right away.</li>
      <li><b>LiPo batteries are a grown-up job.</b> Charge on a hard surface with a grown-up nearby. Never crush, pierce, or short them.</li>
      <li><b>Unplug the battery after every session.</b> The mosquito's radio stays on while the battery is plugged in.</li>
      <li><b>A puffy, hot, or smelly battery is done.</b> A grown-up moves it outside on a hard surface and recycles it.</li>
      <li><b>Check the battery plug.</b> Battery brands do not all wire the plug the same way. Match + to + before the first plug-in.</li>
      <li><b>Never look into the MS-2000 laser.</b> The drone's own height laser is invisible and eye safe (Class 1).</li>
      <li><b>Soldering is a grown-up job.</b> Eye protection on. The iron is hotter than an oven.</li>
    </ul>
  </div>

  <div class="card">
    <p class="eyebrow">Who does what</p>
    <h2>Addie's jobs and grown-up jobs</h2>
    <p class="lead">Addie builds, tests, and codes the micro:bit. A grown-up handles batteries, soldering, the printer, and the Python code. Steps with a <span class="grownup">grown-up</span> tag need one right there.</p>
    <div class="jobs">
      <div class="job a"><h3>Addie</h3><ul>
        <li>Checks the parts and fills in the inventory</li>
        <li>Weighs every part and runs the Can it fly? experiment</li>
        <li>Makes the flight mat</li>
        <li>Snaps the guard, body and window together</li>
        <li>Writes the micro:bit relay in MakeCode</li>
        <li>Runs the test flights and keeps the journal</li>
      </ul></div>
      <div class="job g"><h3>Grown-up</h3><ul>
        <li>Charges and swaps the batteries</li>
        <li>Runs the 3D printer and takes parts off the bed</li>
        <li>Solders the sensor and the battery wires</li>
        <li>Sets up the Pi and the Python flight script</li>
        <li>Flashes the drone and the XIAO</li>
      </ul></div>
    </div>
  </div>

  <div class="card" id="how">
    <p class="eyebrow">The big picture</p>
    <h2>How the Flying Mosquito works</h2>
    <p class="lead">Four computers work as a team. The drone flies. The Pi in the control box tells it where to go. The XIAO in the body feels the hits. The micro:bit tells the MS-2000.</p>
    <div class="diagram">{HOW_SVG}</div>
    <div class="pair" style="margin-top:12px">
{pic(G + '/whole.jpg', 'The whole drone').rstrip()}
{pic(G + '/explode.jpg', 'Pulled apart').rstrip()}
    </div>
    <a class="link3d" href="{CAD}/flymo-drone-3d.html" target="_blank" rel="noopener">Spin it in 3D &rarr;</a>
  </div>

  <div class="card" id="tools">
    <p class="eyebrow">Get these ready</p>
    <h2>Tools you need</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Tool</th><th>For</th></tr></thead><tbody>
      <tr><td>Digital calipers</td><td>Measuring the real parts on day one</td></tr>
      <tr><td>Kitchen scale (1 g) and a jewelry scale (0.1 g) if you have one</td><td>Weighing every part and the push test</td></tr>
      <tr><td>Soldering iron, solder, heat shrink, 30 AWG wire</td><td>Sensor and battery wires <span class="grownup">grown-up</span></td></tr>
      <tr><td>Small Phillips screwdriver, M2 and M2.5 screws</td><td>The control box and the Pi</td></tr>
      <tr><td>Laptop with Chrome</td><td>Flashing the drone, MakeCode, Python</td></tr>
      <tr><td>Hot glue and CA glue</td><td>Wire strain relief, the window</td></tr>
      <tr><td>7 US nickels</td><td>Test weights, 5.000 g each</td></tr>
      <tr><td>Flashlight</td><td>Testing the hit sensor</td></tr>
      </tbody></table></div>
  </div>

  <div class="card" id="parts">
    <p class="eyebrow">What is in the boxes</p>
    <h2>Meet the parts</h2>
    <p class="lead">Full list with stores and prices on the <a href="{BASE}/build#shopping" target="_top">Build page</a>.</p>
{pcards()}  </div>

  <div class="card" id="wiring">
    <p class="eyebrow">Where every wire goes</p>
    <h2>The two wiring maps</h2>
    <h3 style="margin-top:14px">Inside the mosquito</h3>
    <div class="diagram">{BODY_SVG}</div>
    <div class="legend"><span><i style="background:#F0605E"></i>power +</span><span><i style="background:#74839B"></i>ground -</span><span><i style="background:#F5B642"></i>signal</span></div>
    <h3 style="margin-top:18px">Inside the control box</h3>
    <div class="diagram">{BOX_SVG}</div>
    <div class="legend"><span><i style="background:#F5B642"></i>USB power</span><span><i style="background:#5DB7F0"></i>USB data</span><span><i style="background:#F0609E"></i>button wires</span></div>
{gotcha('Pi pins:', 'GPIO 17 is physical pin 11, GPIO 27 is pin 13, GND is pin 9. The button switch goes to 17 and GND; the button light goes to 27 and GND.')}  </div>

  <div class="card" id="screws">
    <p class="eyebrow">Small parts</p>
    <h2>Where every screw goes</h2>
    <div class="table-wrap"><table class="screws">
      <thead><tr><th>Where</th><th>What</th><th>How many</th></tr></thead><tbody>
      <tr><td>Box floor into the corner posts</td><td>M2 x 8</td><td>4</td></tr>
      <tr><td>Pi onto its posts</td><td>M2.5 x 6</td><td>4</td></tr>
      <tr><td>GO button</td><td>its own plastic nut</td><td>1</td></tr>
      <tr><td>Guard onto the motors</td><td>press fit, no screws</td><td>4 collars</td></tr>
      <tr><td>Body onto the battery</td><td>10 mm hook-and-loop strap</td><td>1</td></tr>
      <tr><td>Window into the body</td><td>press fit, then a drop of glue once it works</td><td>1</td></tr>
      </tbody></table></div>
  </div>
''')

S.append(chapter(1, 'Part A &middot; Dec 1 to 6', 'Check and print', 'Find surprises on day one, fly the plain drone, then print the small test first.'))
S.append(step(1, 'Unbox, check, and measure', 'Day 1 &middot; about 1 hour',
  'Same as Dusty: a wrong or missing part gets found now, not on build day. Four numbers in the 3D model are guesses until we measure.',
  do([('Check every part against the shopping list. Write what arrived and what did not.', 'The drone and module ship from India, so they may come separately.'),
      ('Measure with calipers: how far the motor sticks out under the board, how high the props sit, the battery size, and how far the module hangs down once it is plugged in.', 'Write all four in the journal. They go into the 3D model.'),
      ('Weigh the drone, one battery, and the module.', 'The weight table uses 45, 16 and 8 g until now.'),
      ('Look at the battery plug and the + and - marks on the board next to it. Do they match?', 'If not, a grown-up swaps the two pins in the plug. Never force it.')]) +
  gotcha('Do not plug in a battery yet', 'until the polarity check is done.'),
  check='Every part checked in, four measurements and three weights written down.',
  journal='the date, what arrived, the numbers you measured, and anything different from the plan.', grown=True))
S.append(step(2, 'First flight with the phone app', 'Day 2 &middot; 30 minutes',
  'Prove the drone works before anything gets changed. If it will not fly now, it is the drone, not our parts.',
  do([('Charge a battery on the drone by USB-C. The FULL light comes on when it is done.', 'Or use the battery charger that came with the pack.'),
      ('Set the drone on a flat floor, plug in the battery, switch it on, and leave it still until the green light blinks fast.', 'Slow green blinking means it is calibrating. Do not touch it.'),
      ('Install the LiteWing app, join the drone WiFi, and hover for 2 minutes in an open room.', 'Low and slow. Guard is not on yet, so a grown-up flies and everyone stands back.'),
      ('Land, unplug the battery.', '')]) +
  explain('Why does it need to sit still at the start?', 'The motion sensor has to learn what "not moving" feels like. If it gets bumped while it learns, the drone thinks it is tipping and drifts.'),
  check='The plain drone hovers for 2 minutes.', grown=True))
S.append(step(3, 'Flash the drone and add the positioning module', 'Day 3 &middot; 30 minutes',
  'The positioning module needs newer firmware on the drone. Firmware is the program that lives inside the drone.',
  do([('Open the LiteWing web flasher in Chrome, plug the drone in by USB-C, and flash the positioning module firmware.', 'Battery unplugged while flashing.'),
      ('Check the drone has female headers underneath. If not, a grown-up solders four 6-pin headers on.', 'Straight up, flush to the board.'),
      ('Plug the module in underneath, arrow pointing at the USB-C port, pressing evenly on both sides.', 'No bent pins.'),
      ('Power up. The module\'s 4 lights flash once.', 'If the drone does not start, power off and check the arrow.')]),
  check='Module plugged in and its lights flash at startup.', grown=True))
S.append(step(4, 'Print the fit check', 'Day 3 &middot; 10 minutes of printing',
  'A 10 minute print tells us which motor collar size grips best before the 33 minute guard gets printed.',
  do([('Print plate 1, the fit check.', 'Any color.'),
      ('Take one motor out of the drone and slide it into each collar: 1 notch is 7.0 mm, 2 notches 7.2 mm, 3 notches 7.4 mm.', 'The right one grips firmly and does not split.'),
      ('Push the arcade button through the big hole and the light sensor into the pocket.', ''),
      ('Tell the grown-up the winning collar size. It goes into the guard model before plate 2 prints.', '')]) +
  '    <a class="link3d" href="' + CAD + '/flymo-f0-fitcheck.html" target="_blank" rel="noopener">Fit check in 3D &rarr;</a>\n',
  check='Collar size picked; button and sensor fit.', journal='which collar won and how it felt in the other two.'))
S.append(step(5, 'Print the flying parts', 'Days 4 to 6 &middot; about 1 hour 10 minutes',
  'Three small prints: the guard, the white window, and the body. Then weigh them, because every gram counts.',
  '''    <ol class="order">
      <li><b>Plate 2: prop guard and legs</b><span>Prints upside down, fence on the bed. Dark gray or black.</span><span class="t">About 33 minutes &middot; about 7 g</span></li>
      <li><b>Plate 3: hit window</b><span>Must be <span class="w">WHITE</span> PLA so the laser dot makes the face glow.</span><span class="t">About 9 minutes &middot; about 3 g</span></li>
      <li><b>Plate 4: mosquito body</b><span>Stands on its front, tail up. Dark gray or black.</span><span class="t">About 26 minutes &middot; about 5 g</span></li>
    </ol>
''' + do([('Download the .3mf plate files from the Build page and send them to the Adventurer 5M.', 'The settings are inside: 0.2 mm layers, brim, no supports.'),
      ('Peel off the brims carefully. The guard fence is thin.', ''),
      ('Weigh each part and write it in the weight table.', 'Targets: guard 6.9 g, window 2.6 g, body 5.5 g.')]) +
  pic(G + '/body.jpg', 'The body with the white window'),
  check='Three parts printed, cleaned, and weighed.', journal='the real weights next to the targets.', grown=True))

S.append(chapter(2, 'Part B &middot; Dec 7 to 13', 'The experiment: Can it fly?', 'Before building more, find out how much the drone can really carry. The answer can still change the design.'))
S.append(step(6, 'Run the Can it fly? experiment', 'Dec 7 to 13 &middot; two tests, 18 flights',
  f'Our math says the four props push about 120 g and the full drone weighs about {W["_total_g"]:.0f} g. The experiment checks if the math is right.',
  do([('Test A, the push test: strap the drone to a heavy block on a kitchen scale, zero it, and a grown-up runs the motors at 25, 50, 75 and 100% for 3 seconds each.', 'The scale reads below zero. That number is the push in grams.'),
      ('Test B, the hover test: hover 30 cm off the floor until the low-battery light, with 0, 2, 4, 5, 6 and 7 nickels taped to the middle. Three flights each.', 'The laptop logs battery voltage and motor power.'),
      ('Fill in the data sheet and draw the two graphs.', 'Minutes vs grams added, and push at each power level.'),
      ('Use the decision rules to pick: keep Rev A, go lighter, or bigger props.', '')]) +
  code('Push test (Python, grown-up)', '''import time, cflib.crtp
from cflib.crazyflie import Crazyflie
URI = "udp://192.168.43.42"          # the LiteWing address on its own WiFi
cflib.crtp.init_drivers()
cf = Crazyflie(); cf.open_link(URI); time.sleep(1)
cf.commander.send_setpoint(0, 0, 0, 0)  # unlock
for pct in (25, 50, 75, 100):
    thrust = int(10000 + (60000 - 10000) * pct / 100)
    t0 = time.time()
    while time.time() - t0 < 3:      # keep sending, or the drone stops
        cf.commander.send_setpoint(0, 0, 0, thrust); time.sleep(0.05)
    cf.commander.send_setpoint(0, 0, 0, 0); input(f"{pct}%: read the scale, press Enter")
cf.close_link()''', 'Drone strapped down, guard on, hands clear. LiteWing thrust runs from 10000 to 60000.') +
  f'    <a class="link3d" href="{BASE}/experiment" target="_top">The full experiment: math, prediction, data sheet &rarr;</a>\n',
  check='18 flights done, the push measured, the decision made.', journal='every flight time, the push numbers, the graphs, and the conclusion.', grown=True))

S.append(chapter(3, 'Part C &middot; Dec 14 to 20', 'Teach it to fly by itself', 'First from the laptop, over a flight mat, in the net.'))
S.append(step(7, 'Make the flight mat and set up the net', 'About 1 hour',
  'The floor camera sees movement by watching the floor slide by. A plain or shiny floor gives it nothing to see, and the drone drifts.',
  do([('Glue a printed high-contrast pattern (checkers, dots, or a newspaper page) onto poster board.', 'Matte paper, not shiny.'),
      ('Pop up the bug habitat. Roll the front panel up and pin it open.', 'The open side faces where the turret will sit, 3 feet away.'),
      ('Lay the mat on the habitat floor and the launch pad on top when it is printed.', 'Until then, the drone starts on the mat.')]) +
  explain('How does a floor camera know where it is?', 'It takes hundreds of tiny pictures of the floor every second. When the pattern slides left in the picture, the drone is moving right, so it pushes back. That is called optical flow. A computer mouse works the same way.'),
  check='Net up, mat down, ready to fly.'))
S.append(step(8, 'Hover by itself from the laptop', 'About 2 evenings',
  'The laptop sends "stay at 40 cm, do not move" 10 times a second, and the drone uses its floor camera and range finder to obey.',
  do([('Install Python and the Crazyflie library (cflib) on the laptop. Join the drone WiFi.', 'pip install cflib'),
      ('Guard on, battery in, drone on the mat, facing the open side of the net.', ''),
      ('Run the hover script: take off to 40 cm, hold 20 seconds, land.', 'Measure how far it drifts with a ruler taped to the mat.'),
      ('Then run the pattern script: a slow square and a figure eight at 0.2 m per second.', 'If it drifts out of the zone, the script lands it.')]) +
  code('Hover and pattern (Python, grown-up)', '''import time, cflib.crtp
from cflib.crazyflie import Crazyflie
from cflib.crazyflie.syncCrazyflie import SyncCrazyflie
URI, HEIGHT, SPEED = "udp://192.168.43.42", 0.4, 0.2   # meters, meters per second
cflib.crtp.init_drivers()

def hold(cf, vx, vy, z, seconds):
    for _ in range(int(seconds * 10)):           # 10 times a second
        cf.commander.send_hover_setpoint(vx, vy, 0, z)   # yaw rate 0: window keeps facing the turret
        time.sleep(0.1)

with SyncCrazyflie(URI, cf=Crazyflie()) as scf:
    cf = scf.cf
    cf.commander.send_setpoint(0, 0, 0, 0)       # unlock
    for i in range(1, 21):                       # climb over 2 seconds
        hold(cf, 0, 0, HEIGHT * i / 20, 0.1)
    for vx, vy in [(SPEED, 0), (0, SPEED), (-SPEED, 0), (0, -SPEED)] * 3:
        hold(cf, vx, vy, HEIGHT, 2)               # 40 cm each side
    for i in range(20, 0, -1):                   # come down slowly
        hold(cf, 0, 0, HEIGHT * i / 20, 0.1)
    cf.commander.send_stop_setpoint()''', 'Based on LiteWing\'s own position hold examples. The final version lives on the Pi (step 16).'),
  check='It takes off, flies the square inside the zone, and lands, 3 times in a row.', journal='how far it drifted each time.', grown=True))

S.append(chapter(4, 'Part D &middot; Dec 21 to Jan 3', 'The hit sensor', 'The light sensor feels the laser, and the XIAO tells the control box.'))
S.append(step(9, 'Wire the sensor and the XIAO', 'About 1 hour',
  'Three short wires from the sensor, two from the battery. Everything stays inside the body.',
  do([('Solder 3 thin wires to the light sensor: VIN, GND, OUT. Heat shrink each joint.', 'About 6 cm long.'),
      ('Solder VIN to the XIAO 3V3 pin, GND to GND, OUT to A0 (also marked D0).', 'See the wiring map.'),
      ('Solder two wires to the BAT+ and BAT- pads under the XIAO, and the other ends to the + and - pins on the back of the drone\'s battery plug.', 'Red to +. Check twice before any battery goes in.'),
      ('Press the sensor into the pocket on the body\'s front wall, face out. XIAO flat on the floor, USB-C toward the tail slot.', 'A dot of hot glue on each wire where it leaves the board.')]) +
  gotcha('Unplug the battery after every session.', 'The XIAO is wired straight to the battery, so it stays on until the battery comes out.'),
  check='Nothing shorted: with the battery in, the XIAO light comes on and nothing gets warm.', grown=True))
S.append(step(10, 'Code the XIAO: feel the hit', 'About 1 evening',
  'The XIAO learns how bright the room is, then shouts HIT when the light jumps. It waits 1 second before it can shout again, like the MS-2000.',
  code('Hit sensor (Arduino on the XIAO, grown-up)', '''#include <WiFi.h>
#include <WiFiUdp.h>
const char* SSID = "LiteWing_xxxx";   // the drone WiFi name
const char* PASS = "........";        // and password, from the LiteWing guide
const int JUMP = 150;                 // how big a jump counts as a hit: set in the flashlight test
WiFiUDP udp; long base = 0; unsigned long lastHit = 0;

void setup() {
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) delay(200);
  for (int i = 0; i < 200; i++) { base += analogRead(A0); delay(5); }
  base /= 200;                        // normal room light
}

void loop() {
  int v = analogRead(A0);
  if (v > base + JUMP && millis() - lastHit > 1000) {
    udp.beginPacket(IPAddress(192, 168, 43, 255), 5005);   // shout to everyone on the drone WiFi
    udp.print("HIT"); udp.endPacket();
    lastHit = millis();
  } else if (v < base + JUMP / 2) {
    base = (base * 31 + v) / 32;      // slowly follow the room light
  }
  delay(5);                           // 200 checks a second
}''', 'Upload with the Arduino IDE (board: XIAO_ESP32C3). The laptop can listen on port 5005 to see the HITs.') +
  do([('Flashlight test: flick a flashlight across the white window. The laptop shows HIT.', ''),
      ('Now the real laser (grown-up turns it on): point the MS-2000 laser at the window. HIT every time.', 'If it misses, make JUMP smaller. If it shouts HIT with no laser, make JUMP bigger.')]),
  check='10 laser flicks, 10 HITs, and no HIT when nothing happens for a minute.', journal='the JUMP number you picked and why.', grown=True))
S.append(step(11, 'Put the mosquito together', '30 minutes',
  'Guard, body, window, wings. Then weigh the whole thing.',
  do([('Push the guard collars up onto the motor cans from below, slits facing the middle so the motor wires pass.', 'Feet point down.'),
      ('Thread the battery strap through the tunnel in the body floor, set the body on the battery, strap it all to the drone.', 'The white window points forward.'),
      ('Plug the white window into the front of the body. Glue it only after step 10 works.', ''),
      ('Cut two small wings from clear report-cover plastic and glue them on top of the body.', 'Tiny and light, so they do not catch the prop wind.'),
      ('Weigh the whole drone with the battery.', f'Target: about {W["_total_g"]:.0f} g.')]) +
  pic(G + '/top.jpg', 'From above: guard around all four props, body in the middle'),
  check='It all fits, nothing touches a prop, and the weight is written down.'))

S.append(chapter(5, 'Part E &middot; Dec 26 to Jan 3', 'The control box', 'The big GO button, the Pi that flies the drone, and the micro:bit that talks to the turret.'))
S.append(step(12, 'Print the pad and the box', 'About 4 hours 25 minutes of printing',
  'Three bigger prints. Good for overnight.',
  '''    <ol class="order">
      <li><b>Plate 5: launch pad</b><span>Four cone cups catch the guard feet. The arrow points at the turret.</span><span class="t">About 1 hour 16 minutes &middot; about 56 g</span></li>
      <li><b>Plate 6: control box</b><span>Prints top down.</span><span class="t">About 2 hours 16 minutes &middot; about 90 g</span></li>
      <li><b>Plate 7: box floor</b><span>Pi posts and the power bank cradle.</span><span class="t">About 54 minutes &middot; about 40 g</span></li>
    </ol>
''', check='Three parts printed; the drone sits in the pad cups.', grown=True))
S.append(step(13, 'Set up the Pi', 'About 1 evening',
  'The Pi is a small Linux computer. It joins the drone WiFi like a phone would, and runs the flight script by itself when it turns on.',
  do([('Use Raspberry Pi Imager to put Raspberry Pi OS Lite on the microSD card. In the settings, type in the drone WiFi name and password, and turn on SSH.', ''),
      ('Boot the Pi, log in from the laptop, and install the library: pip install cflib pyserial gpiozero.', ''),
      ('Copy the flight script (step 16) to the Pi and set it to start at power-on.', 'A small systemd service called flymo.'),
      ('Screw the Pi onto its four posts on the box floor.', 'M2.5 x 6.')]),
  check='Power on the Pi with the drone on: the Pi joins the drone WiFi by itself.', grown=True))
S.append(step(14, 'Wire the box', 'About 1 hour',
  'Follow the control box wiring map.',
  do([('Power bank into its cradle, ports toward the right wall. USB-C panel port through the right wall, its cable into the bank.', ''),
      ('Bank USB-A into the switch cable, switch cable into the Pi PWR port. Clip the switch into the left wall slot.', ''),
      ('OTG cable into the Pi USB port, micro:bit cable into it, micro:bit snapped face up under the top window.', ''),
      ('GO button into the round hole. Jumper wires: switch to GPIO 17 and GND, light to GPIO 27 and GND.', 'Pins 11, 9 and 13.'),
      ('Screw the floor on: 4 x M2 x 8.', '')]) +
  gotcha('The button light:', 'check it lights up at the Pi\'s 3.3 V in step 16. If it is too dim, a grown-up checks the resistor note on the Adafruit page.'),
  check='Switch on: the Pi boots and the micro:bit lights up.', grown=True))
S.append(step(15, 'Code the micro:bit relay', 'Addie &middot; about 1 hour in MakeCode',
  'Whatever the Pi sends over USB, the micro:bit radios on group 7, the same words the MS-2000 wand uses. It also counts hits and saves each run.',
  blocks('Program: relay', 'MakeCode for micro:bit. Add the Datalogger extension.', [
    ('b-basic', 'on start', ''),
    ('b-radio i1', 'radio set group 7', 'same group as the MS-2000'),
    ('b-var i1', 'set hits to 0', ''),
    ('b-basic i1', 'show icon: small diamond', 'ready'),
    ('b-input gap', 'on serial received (new line)', 'the Pi sends one word per line'),
    ('b-var i1', 'set msg to serial read until new line', ''),
    ('b-radio i1', 'radio send string msg', 'the turret hears GO, HIT or STOP'),
    ('b-logic i1', 'if msg = "GO" then', ''),
    ('b-var i2', 'set hits to 0', ''),
    ('b-basic i2', 'show arrow: North', ''),
    ('b-logic i1', 'else if msg = "HIT" then', ''),
    ('b-var i2', 'change hits by 1', ''),
    ('b-basic i2', 'show number hits', ''),
    ('b-log i2', 'log data: event = "HIT", hits = hits', ''),
    ('b-logic i1', 'else if msg = "STOP" then', ''),
    ('b-basic i2', 'show icon: yes (check mark)', ''),
    ('b-log i2', 'log data: event = "RUN", hits = hits', 'one row per run'),
  ]) + '    <div class="try"><b>Try it:</b> plug the micro:bit into the laptop, type GO, HIT, HIT, STOP in the MakeCode serial window, and watch the MS-2000 turret react.</div>\n',
  check='GO, HIT and STOP from the laptop show up on the micro:bit and on the MS-2000.', journal='a screenshot of your code.'))
S.append(step(16, 'The flight script: press GO', 'About 1 evening',
  'One script on the Pi ties it all together. It waits for the button, flies the run, passes every HIT to the micro:bit, and lands.',
  code('flymo.py on the Pi (grown-up)', '''import socket, time, serial, threading
from gpiozero import Button, LED
# ... hold() and the pattern from step 8 ...
button, light = Button(17, hold_time=1.5), LED(27)
mb = serial.Serial("/dev/ttyACM0", 115200)          # the micro:bit
say = lambda word: mb.write((word + "\\n").encode())
hits = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); hits.bind(("", 5005))

def listen():                                        # HIT from the XIAO -> micro:bit
    while True:
        data, _ = hits.recvfrom(16)
        if data == b"HIT": say("HIT")
threading.Thread(target=listen, daemon=True).start()

while True:
    light.on(); button.wait_for_press(); light.off()
    if battery_volts() < 3.8: light.blink(); continue   # too low to fly a full run
    say("GO"); fly_run(seconds=30); say("STOP")         # button.when_held lands right away''', 'The full file lives in the repo with the other tools.') +
  do([('Drone on the pad, battery in, box switched on, wait for the GO light.', ''),
      ('Press GO. It takes off, flies the pattern for 30 seconds, and lands on the pad.', ''),
      ('Hold GO for 1.5 seconds during a flight: it lands right away.', 'Practice this before anything else.')]),
  check='Press GO, full run, lands in the cups. The emergency landing works.', grown=True))

S.append(chapter(6, 'Part F &middot; Jan 4 to 24', 'Test it', 'Twenty flights on its own, then the MS-2000 gets its turn. Only on days with no MS-2000 experiment.'))
S.append(step(17, 'Twenty flights in a row', 'Jan 4 to 15 &middot; about 3 evenings',
  'An engineer does not trust one good flight. Twenty in a row shows if it really works.',
  do([('Fly 20 runs. For each one, write: landed on the pad? crashed? how many flashlight hits sent and received?', 'Swap batteries between runs.'),
      ('Anything that fails twice gets a fix and a line in the history log.', 'If the fix changes a part, it needs a change order.')]),
  check='18 of 20 runs land on the pad, and every flashlight hit reaches the micro:bit.', journal='the 20 results in a table.'))
S.append(step(18, 'MS-2000 vs the Flying Mosquito', 'Jan 16 to 24 &middot; after the MS-2000 experiments are done',
  'The fun part. Can the turret hit something that flies by itself?',
  do([('Teach the MS-2000 camera the flyer: Object Tracking, learn it hovering in the net.', 'This replaces the stuffed mosquito it learned.'),
      ('Turret 3 feet from the net, laser armed by a grown-up. Run 10 flights of 30 seconds.', 'The box micro:bit sends GO, so the turret starts its run.'),
      ('Count hits and the time to the first hit, the same numbers as the MS-2000 experiment.', ''),
      ('Teach the camera the stuffed mosquito again when you are done.', 'The fair demo uses the stuffed mosquito.')]) +
  gotcha('The MS-2000 always wins:', 'no flyer tests on an MS-2000 test day, and never change the turret code for the flyer.'),
  check='10 runs recorded, and the stuffed mosquito learned again.', journal='hits per run and time to first hit, next to the MS-2000 results.'))

S.append(f'''
  <div class="card" id="fix">
    <p class="eyebrow">When it misbehaves</p>
    <h2>Fixing it</h2>
    <p class="lead">Find what you see, try the fix. Write every problem in the journal.</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>What you see</th><th>Most likely cause</th><th>What to do</th></tr></thead>
        <tbody>
          <tr><td>Drone will not connect</td><td>Wrong WiFi</td><td>Join the drone WiFi, turn off mobile data and VPN, restart the app.</td></tr>
          <tr><td>Slow green blinking forever</td><td>Still calibrating</td><td>Put it on a flat floor and do not touch it. Power cycle.</td></tr>
          <tr><td>Flips on takeoff</td><td>Prop on the wrong motor</td><td>Check each prop matches the spin mark on the board.</td></tr>
          <tr><td>Drifts in one direction</td><td>Floor camera cannot see</td><td>Use the flight mat. More contrast, matte paper, better light.</td></tr>
          <tr><td>Climbs slowly, lands itself early</td><td>Too heavy or battery tired</td><td>Weigh it. Fresh battery. See the Can it fly? decision rules.</td></tr>
          <tr><td>Wobbles, then drops</td><td>Battery voltage sag</td><td>Battery rated under 20C, or worn out. Swap it.</td></tr>
          <tr><td>HIT with no laser</td><td>JUMP too small, or room lights flicker</td><td>Make JUMP bigger. Try away from bright lamps.</td></tr>
          <tr><td>Laser hits but no HIT</td><td>JUMP too big, or XIAO not on WiFi</td><td>Make JUMP smaller. Check the XIAO joins the drone WiFi.</td></tr>
          <tr><td>micro:bit shows nothing</td><td>USB cable</td><td>Some micro-USB cables only charge. Use a data cable through the OTG cable.</td></tr>
          <tr><td>Turret ignores the runs</td><td>Radio group</td><td>Both programs say radio set group 7?</td></tr>
          <tr><td>Guard rubs a prop</td><td>Collar not all the way up</td><td>Push the collar up until it stops. Check the slit faces the middle.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="card" id="words">
    <p class="eyebrow">Words to know</p>
    <h2>Say these like a scientist</h2>
    <div class="gloss">
      <div class="gterm"><b>Thrust</b><span>The push from the props.</span></div>
      <div class="gterm"><b>Payload</b><span>The extra weight a drone carries.</span></div>
      <div class="gterm"><b>Thrust-to-weight ratio</b><span>Most push divided by weight. Needs to be over 1 to fly.</span></div>
      <div class="gterm"><b>Optical flow</b><span>Seeing movement by watching a picture slide, like a computer mouse.</span></div>
      <div class="gterm"><b>Time of flight</b><span>Measuring distance by timing a bounce of light.</span></div>
      <div class="gterm"><b>Firmware</b><span>The program that lives inside a device.</span></div>
      <div class="gterm"><b>Feedback loop</b><span>Measure, decide, fix, repeat. Hundreds of times a second.</span></div>
      <div class="gterm"><b>Protocol</b><span>The words two machines agree to use: GO, HIT, STOP.</span></div>
      <div class="gterm"><b>LiPo</b><span>Lithium polymer battery. Light and powerful, handle with care.</span></div>
      <div class="gterm"><b>Threshold</b><span>How big a change has to be before it counts. Our JUMP number.</span></div>
      <div class="gterm"><b>Press fit</b><span>Parts that hold because they are a tight squeeze, with no screws.</span></div>
      <div class="gterm"><b>Change order</b><span>The written plan and approval for changing a locked design.</span></div>
    </div>
  </div>

  <div class="card">
    <p class="eyebrow">Everything else</p>
    <h2>The other pages</h2>
    <div class="linkrow">
      <a class="primary" href="{CAD}/flymo-drone-3d.html" target="_blank" rel="noopener">Drone in 3D</a>
      <a class="secondary" href="{BASE}/build" target="_top">Shopping list and print files</a>
      <a class="secondary" href="{BASE}/experiment" target="_top">Can it fly?</a>
      <a class="secondary" href="{BASE}/learn" target="_top">How drones fly</a>
      <a class="secondary" href="{BASE}/design" target="_top">The design</a>
      <a class="secondary" href="{BASE}" target="_top">Flying Mosquito project page</a>
    </div>
  </div>
  <footer>FLYING MOSQUITO &middot; BUILD GUIDE &middot; ADDIE PINNEY &middot; MS-2000 BONUS PROJECT &middot; DESIGN REV A</footer>
</div>
</body>
</html>
''')

page = ''.join(S)
assert '\u2014' not in page
open(f'{ROOT}/public/projects/addie/flymo-build-guide.html', 'w').write(page)
print('wrote', len(page), 'bytes', page.count('class="step"'), 'steps')

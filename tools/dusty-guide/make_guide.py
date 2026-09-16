"""Build the Dusty build guide (printed-chassis version).
Reuses CSS, part-card drawings and three generic diagrams from the previous (foam board) guide.
Usage: python3 make_guide.py OLD_GUIDE.html OUT.html"""
import re, sys, math

old = open(sys.argv[1]).read()
OUT = sys.argv[2]

css = old[old.index('<style>'):old.index('</style>') + 8]
css = css.replace('</style>', """
  .pcard .pic.new svg { max-width: 190px; }
  .order { list-style: none; counter-reset: o; display: grid; gap: 10px; margin-top: 14px; }
  .order li { counter-increment: o; background: var(--paper); border-radius: 12px; padding: 12px 14px 12px 54px; position: relative; }
  .order li::before { content: counter(o); position: absolute; left: 14px; top: 12px; width: 28px; height: 28px; border-radius: 8px; background: var(--blue); color: #fff; font-family: 'Fredoka', sans-serif; font-weight: 600; display: grid; place-items: center; }
  .order b { display: block; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 17px; }
  .order span { font-size: 14.5px; color: var(--ink-2); }
  .order .t { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--ink-3); letter-spacing: .05em; display: block; margin-top: 3px; }
  .screws td:nth-child(2), .screws td:nth-child(3) { font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }
  .math { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; font-family: 'Fredoka', sans-serif; font-size: 20px; }
  .math .box { background: #fff; border: 1px solid #C6DAF2; border-radius: 10px; padding: 6px 12px; text-align: center; line-height: 1.1; }
  .math .box small { display: block; font-family: 'Nunito', sans-serif; font-size: 11.5px; color: var(--ink-3); }
  .try { margin-top: 12px; background: var(--orange-soft); border: 1px solid #F3CDB8; border-radius: 12px; padding: 13px 16px; font-size: 14.5px; color: var(--ink-2); }
  .try b { color: var(--orange); }
  .diagram svg.fit { min-width: 0; max-width: 560px; margin: 0 auto; }
  .step[id] { scroll-margin-top: 12px; }
  .link3d { display: inline-block; margin-top: 10px; font-weight: 700; color: var(--blue); text-decoration: none; font-size: 14.5px; }
</style>""")

head = old[:old.index('<style>')]
head = re.sub(r'<title>.*?</title>', '<title>How To Build Dusty (3D printed)</title>', head, flags=re.S)

tick = re.search(r'<span class="tick">.*?</span>', old, re.S).group(0)

# ---- reusable part cards ----
cards = {}
for chunk in old.split('<div class="pcard">')[1:]:
    name = re.search(r'<h3>(.*?)</h3>', chunk).group(1)
    body = chunk[:chunk.index('<div class="pcard">')] if '<div class="pcard">' in chunk else chunk
    # cut at the end of this card: its pbody closes with </div>\n      </div>
    end = body.index('</p>\n        </div>\n      </div>') + len('</p>\n        </div>\n      </div>')
    cards[name] = '<div class="pcard">' + body[:end]

def retext(card, what=None, does=None, spec=None, title=None):
    if title: card = re.sub(r'<h3>.*?</h3>', f'<h3>{title}</h3>', card)
    if what: card = re.sub(r'<p class="what">.*?</p>', f'<p class="what">{what}</p>', card, flags=re.S)
    if does: card = re.sub(r'<p class="does">.*?</p>', f'<p class="does"><b>Its job:</b> {does}</p>', card, flags=re.S)
    if spec: card = re.sub(r'<p class="spec">.*?</p>', f'<p class="spec">{spec}</p>', card, flags=re.S)
    return card

def newcard(title, svg, what, does, spec):
    return f'''<div class="pcard">
        <div class="pic new">{svg}</div>
        <div class="pbody">
          <h3>{title}</h3>
          <p class="what">{what}</p>
          <p class="does"><b>Its job:</b> {does}</p>
          <p class="spec">{spec}</p>
        </div>
      </div>'''

C = cards
C['micro:bit v2'] = retext(C['micro:bit v2'], spec='PLUGS IN FLAT &middot; LEDS FACE UP')
C['Motor driver board'] = retext(C['Motor driver board'], title='moto:bit motor board',
    what='A red board with a connector on its front edge that the micro:bit plugs into flat, a round hole for the battery plug, connectors for two motors, a STOP/RUN motor switch, and rows of pins for sensors.')
C['N20 gear motor &times;2'] = retext(C['N20 gear motor &times;2'],
    what='A small silver can with a gold gearbox and a flat-sided metal shaft. Yours have a tiny circuit board on the back and six wires.',
    does='one drives the left wheel, one the right. Only two of the six wires power the motor. The other four are for the encoder, a turn counter Dusty does not use yet.',
    spec='6 VOLTS &middot; 298:1 GEARBOX &middot; ENCODER')
C['Ball caster'] = retext(C['Ball caster'], what='A little cage holding a 3/8 inch metal ball.',
    does='the third foot at the back. The printed base already has the right height built in, so no spacers are needed.',
    spec='TWO M2 &times; 8 SCREWS')
C['Whisker switch'] = retext(C['Whisker switch'],
    what='A small black block with a springy metal arm and a little wheel on the end. Push the arm and it clicks.',
    does='the backup cliff sensor. The little wheel rolls on the table, holding the arm pushed in. Table ends, the arm drops, the switch clicks, motors stop.',
    spec='3 TABS &middot; USE C AND NO')
C['Brush motor'] = retext(C['Brush motor'], title='130 brush motor',
    what='A plain silver motor with two metal tabs and a thin shaft. It spins thousands of times a minute.',
    does='turns the brush roller through a set of printed gears that slow it down and make it stronger.',
    spec='OWN ON/OFF SWITCH &middot; GEARED DOWN 5.4 TIMES')

svg_parts = '''<svg viewBox="0 0 220 150" role="img" aria-label="Printed parts: a flat base plate, a shelf, gears and a tray">
  <rect x="18" y="70" width="120" height="62" rx="6" fill="#F0B43C" stroke="#9A6A12" stroke-width="2"/>
  <rect x="34" y="84" width="22" height="12" rx="2" fill="#E9EEF4"/><rect x="100" y="84" width="22" height="12" rx="2" fill="#E9EEF4"/>
  <rect x="30" y="22" width="98" height="40" rx="5" fill="#F0B43C" stroke="#9A6A12" stroke-width="2"/>
  <rect x="60" y="32" width="38" height="20" rx="2" fill="#E9EEF4"/>
  <g transform="translate(174 48)"><circle r="26" fill="#4AA8FF" stroke="#1F5E9C" stroke-width="2"/><circle r="10" fill="#E9EEF4"/></g>
  <g transform="translate(176 110)"><rect x="-28" y="-16" width="56" height="30" rx="4" fill="#5CC98A" stroke="#237A4C" stroke-width="2"/><rect x="-22" y="-10" width="44" height="18" fill="#E9EEF4"/></g>
</svg>'''
svg_pla = '''<svg viewBox="0 0 220 150" role="img" aria-label="A spool of plastic filament">
  <circle cx="110" cy="75" r="62" fill="#D2DCE7" stroke="#566A83" stroke-width="2.5"/>
  <circle cx="110" cy="75" r="50" fill="#F0B43C"/>
  <g stroke="#C98E1E" stroke-width="1.5" fill="none"><circle cx="110" cy="75" r="44"/><circle cx="110" cy="75" r="38"/><circle cx="110" cy="75" r="32"/></g>
  <circle cx="110" cy="75" r="24" fill="#E9EEF4" stroke="#566A83" stroke-width="2.5"/>
  <circle cx="110" cy="75" r="9" fill="#fff" stroke="#566A83" stroke-width="2"/>
  <path d="M160 75 C 185 75, 190 100, 205 118" stroke="#F0B43C" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>'''
svg_screw = '''<svg viewBox="0 0 220 150" role="img" aria-label="A small M2 screw and a nut">
  <rect x="40" y="58" width="22" height="34" rx="4" fill="#B9C4D1" stroke="#566A83" stroke-width="2"/>
  <path d="M44 75 h14 M51 68 v14" stroke="#566A83" stroke-width="2.5"/>
  <rect x="62" y="68" width="92" height="14" fill="#B9C4D1" stroke="#566A83" stroke-width="2"/>
  <path d="M70 68 l6 14 M80 68 l6 14 M90 68 l6 14 M100 68 l6 14 M110 68 l6 14 M120 68 l6 14 M130 68 l6 14 M140 68 l6 14" stroke="#566A83" stroke-width="1.3"/>
  <path d="M170 60 h26 l8 15 l-8 15 h-26 l-8 -15 z" fill="#B9C4D1" stroke="#566A83" stroke-width="2"/>
  <circle cx="183" cy="75" r="7" fill="#E9EEF4" stroke="#566A83" stroke-width="2"/>
  <text x="108" y="112" font-family="IBM Plex Mono, monospace" font-size="12" fill="#566A83" text-anchor="middle">2 mm thick, 6 to 10 mm long</text>
</svg>'''
svg_pipe = '''<svg viewBox="0 0 220 150" role="img" aria-label="Fuzzy pipe cleaners threaded through a roller">
  <rect x="40" y="62" width="140" height="26" rx="13" fill="#B48CFF" stroke="#6A45B8" stroke-width="2"/>
  <g stroke="#D95B21" stroke-width="7" stroke-linecap="round">
    <path d="M58 40 v70"/><path d="M82 34 v82"/><path d="M106 40 v70"/><path d="M130 34 v82"/><path d="M154 40 v70"/>
  </g>
</svg>'''
svg_rocker = '''<svg viewBox="0 0 220 150" role="img" aria-label="A small rocker switch">
  <rect x="70" y="38" width="80" height="56" rx="6" fill="#14202F"/>
  <path d="M80 50 L140 44 L140 88 L80 82 Z" fill="#2E3B4E" stroke="#8C9CB1" stroke-width="1.5"/>
  <text x="95" y="72" font-family="IBM Plex Mono, monospace" font-size="14" fill="#fff">I</text>
  <circle cx="127" cy="67" r="6" fill="none" stroke="#fff" stroke-width="2"/>
  <rect x="88" y="94" width="8" height="22" fill="#D8A34A"/><rect x="124" y="94" width="8" height="22" fill="#D8A34A"/>
</svg>'''
svg_bank = '''<svg viewBox="0 0 220 150" role="img" aria-label="A rounded black power bank with two ports on one end and four small lights">
  <rect x="30" y="44" width="150" height="62" rx="18" fill="#2A3340" stroke="#0E141B" stroke-width="2"/>
  <circle cx="120" cy="66" r="3" fill="#4AA8FF"/><circle cx="130" cy="70" r="3" fill="#4AA8FF"/><circle cx="140" cy="74" r="3" fill="#4AA8FF"/><circle cx="150" cy="78" r="3" fill="#4AA8FF"/>
  <rect x="180" y="58" width="10" height="12" rx="2" fill="#E9EEF4" stroke="#566A83"/><rect x="180" y="80" width="10" height="16" rx="1" fill="#E9EEF4" stroke="#566A83"/>
  <rect x="96" y="104" width="18" height="5" rx="2" fill="#566A83"/>
  <text x="110" y="136" font-family="IBM Plex Mono, monospace" font-size="11" fill="#566A83" text-anchor="middle">USB-C to charge, USB-A to power Dusty</text>
</svg>'''

svg_split = '''<svg viewBox="0 0 220 150" role="img" aria-label="A Y cable with one round plug splitting into two">
  <rect x="16" y="64" width="34" height="22" rx="6" fill="#14202F"/>
  <path d="M50 75 H100" stroke="#14202F" stroke-width="6"/>
  <path d="M100 75 C130 75, 130 40, 160 40 M100 75 C130 75, 130 110, 160 110" stroke="#14202F" stroke-width="6" fill="none"/>
  <rect x="160" y="30" width="30" height="20" rx="5" fill="#14202F"/><rect x="160" y="100" width="30" height="20" rx="5" fill="#14202F"/>
  <rect x="190" y="104" width="16" height="12" fill="#2B8A57"/>
  <text x="110" y="140" font-family="IBM Plex Mono, monospace" font-size="11" fill="#566A83" text-anchor="middle">one to the board, one to the brush</text>
</svg>'''

extra = [
    newcard('Printed parts', svg_parts,
        '19 pieces printed on a 3D printer: the base plate, the deck and its two posts, the battery sleeve and keeper bar, the brush roller and axle, three gears, a tray, and two sensor arms.',
        'hold everything in exactly the right place. Every hole, pocket and gap was measured before printing.',
        'ABOUT 101 G OF PLA'),
    newcard('PLA filament', svg_pla,
        'A spool of plastic thread, 1.75 mm thick. The printer melts it and lays it down one thin line at a time.',
        'it becomes all the printed parts. PLA is made from plants like corn and sugarcane.',
        'NOZZLE ABOUT 220&deg;C &middot; BED ABOUT 60&deg;C'),
    newcard('M2 screws and nuts', svg_screw,
        'Tiny machine screws. The M2 means the thread is 2 millimeters across. You need three lengths: 6, 8 and 10 mm.',
        'they hold the motors, caster, deck, battery sleeve and sensor arms. Most screw straight into small holes in the plastic.',
        'ABOUT 24 SCREWS &middot; 6 NUTS &middot; PHILLIPS #0'),
    newcard('Pipe cleaners', svg_pipe,
        'Fuzzy craft wire. Cut short pieces and push them through the holes in the printed roller.',
        'they are the bristles. Soft enough to bend, stiff enough to flick crumbs.',
        'CUT TO ABOUT 30 MM'),
    newcard('Rocker switch', svg_rocker,
        'A small on/off switch that snaps into the square hole on the brush motor mount.',
        'turns the brush on and off without touching the code.',
        'KCD11 SIZE &middot; 2 TABS'),
    newcard('Power bank', svg_bank,
        'A rechargeable battery about the size of a candy bar, with a USB-C port, a USB-A port, a button and four blue lights.',
        'powers everything, and charges from a phone charger while it stays inside Dusty. It holds a steady 5 volts until it is empty.',
        'ANKER 321 &middot; 5,200 MAH &middot; CHARGE BEFORE EVERY SESSION'),
    newcard('Power cable and switch', svg_split,
        'A small 90 degree USB adapter, a USB cable that ends in a round plug, an in-line on/off switch, and a short Y cable that turns one round plug into two.',
        'carries power from the bank to the moto:bit and the brush motor, with a real OFF switch you can reach.',
        '2.1 MM PLUGS &middot; GROWN-UP CONNECTS IT'),
]

order = ['micro:bit v2', 'Motor driver board', 'N20 gear motor &times;2', 'Wheels &times;2', 'Ball caster',
         'Cliff sensors &times;2', 'Whisker switch', 'Brush motor']
parts_html = '\n'.join(C[k] for k in order) + '\n' + '\n'.join(extra)

# ---- reused explainers (microcontroller, H-bridge) ----
a = old.index('<div class="explain">', old.index('<div class="parts">'))
b = old.index('<div class="step"')
reused_explain = old[a:b]
reused_explain = reused_explain.replace('put in batteries a week later', 'switch it on a week later')
reused_explain = reused_explain[:reused_explain.rindex('</div>')]  # drop the parts card's closing div
diag = {}
_steps_region = old[old.index('<div class="step">'):old.index('TROUBLESHOOTING')]
for i, chunk in enumerate(_steps_region.split('<div class="step">')[1:]):
    d = re.search(r'<div class="diagram">(.*?)</div>', chunk, re.S)
    if d: diag[i + 1] = d.group(1)
# old step 5 wiring, 8 whisker, 10 patterns
diag_wire = re.sub(r'<p class="caption">.*?</p>', '', diag[5], flags=re.S)
diag_whisk = re.sub(r'<p class="caption">.*?</p>', '', diag[8], flags=re.S)
diag_pat = re.sub(r'<p class="caption">.*?</p>', '', diag[10], flags=re.S)
diag_pat = '''<svg viewBox="0 0 640 250" role="img" aria-label="Two cleaning patterns: random bounce over the whole table on the left, Spot Clean rows inside a one foot square on the right">
        <rect x="24" y="30" width="278" height="182" rx="8" fill="#0F1420" stroke="#2B3650" stroke-width="2.5"/>
        <rect x="118" y="80" width="90" height="90" fill="none" stroke="#F5B642" stroke-width="2" stroke-dasharray="6 4"/>
        <path d="M60 70 L250 140 L70 180 L240 60 L90 195 L260 110" stroke="#F0609E" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
        <circle cx="60" cy="70" r="5" fill="#9BE15D"/>
        <text x="163" y="22" font-family="Fredoka, sans-serif" font-size="15" fill="#EEF2F8" text-anchor="middle">BUTTON A: RANDOM BOUNCE</text>
        <text x="163" y="234" font-family="IBM Plex Mono, monospace" font-size="10" fill="#A9B6CA" text-anchor="middle">WHOLE TABLE, ONLY SOMETIMES CROSSES THE SPILL</text>

        <rect x="338" y="30" width="278" height="182" rx="8" fill="#0F1420" stroke="#2B3650" stroke-width="2.5"/>
        <rect x="388" y="40" width="180" height="160" fill="none" stroke="#F5B642" stroke-width="2" stroke-dasharray="6 4"/>
        <path d="M399.0 192 L399.0 48 L421.8 48 L421.8 192 L444.6 192 L444.6 48 L467.4 48 L467.4 192 L490.2 192 L490.2 48 L513.0 48 L513.0 192 L535.8 192 L535.8 48 L558.6 48 L558.6 192" stroke="#5DB7F0" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
        <circle cx="399.0" cy="192" r="5" fill="#9BE15D"/>
        <text x="477" y="22" font-family="Fredoka, sans-serif" font-size="15" fill="#EEF2F8" text-anchor="middle">BUTTON B: SPOT CLEAN</text>
        <text x="477" y="234" font-family="IBM Plex Mono, monospace" font-size="10" fill="#A9B6CA" text-anchor="middle">8 ROWS INSIDE A 1 FT SQUARE, NOTHING MISSED</text>
      </svg>'''

# ---- new diagrams ----
def gear_path(cx, cy, teeth, r_root, r_tip):
    pts = []
    for i in range(teeth):
        a0 = 2 * math.pi * i / teeth
        st = 2 * math.pi / teeth
        for frac, r in ((0.0, r_root), (0.2, r_tip), (0.5, r_tip), (0.7, r_root)):
            a = a0 + frac * st
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + ' Z'

def gear(cx, cy, teeth, r, fill, stroke, phase=0.0):
    return (f'<g transform="rotate({phase} {cx} {cy})"><path d="{gear_path(cx, cy, teeth, r - 4, r + 3)}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/></g>'
            f'<circle cx="{cx}" cy="{cy}" r="4" fill="#fff" stroke="{stroke}" stroke-width="1.5"/>')

F = 'font-family="Fredoka, sans-serif"'
M = 'font-family="IBM Plex Mono, monospace"'

svg_gears = f'''<svg class="fit" viewBox="0 0 420 350" role="img" aria-label="Gear train in two stages. Stage one: a 12 tooth motor gear turns a 36 tooth big gear. Stage two: a 10 tooth gear on the same shaft as the big gear turns an 18 tooth roller gear.">
  <text x="10" y="22" {F} font-size="15" fill="#D95B21">Stage 1</text>
  {gear(300, 112, 36, 76, '#E8F0FA', '#2B5FA8')}
  {gear(199, 112, 12, 25, '#FCEFE8', '#D95B21', 15)}
  <text x="300" y="108" {F} font-size="16" fill="#14202F" text-anchor="middle">Big gear</text>
  <text x="300" y="128" {M} font-size="12" fill="#2B5FA8" text-anchor="middle">36 teeth</text>
  <text x="168" y="104" {F} font-size="16" fill="#14202F" text-anchor="end">Motor gear</text>
  <text x="168" y="122" {M} font-size="12" fill="#D95B21" text-anchor="end">12 teeth</text>
  <path d="M300 140 V246" stroke="#566A83" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="310" y="214" {M} font-size="12" fill="#566A83">same shaft,</text>
  <text x="310" y="229" {M} font-size="12" fill="#566A83">turn together</text>
  <text x="10" y="222" {F} font-size="15" fill="#0D8159">Stage 2</text>
  <rect x="30" y="264" width="210" height="28" rx="14" fill="#B48CFF" stroke="#6A45B8" stroke-width="1.5"/>
  <text x="100" y="283" {F} font-size="14" fill="#fff" text-anchor="middle">brush roller</text>
  {gear(240, 278, 18, 39, '#E4F3ED', '#0D8159', 5)}
  {gear(300, 278, 10, 20, '#4AA8FF', '#1F5E9C', 8)}
  <text x="330" y="274" {F} font-size="16" fill="#14202F">Small gear</text>
  <text x="330" y="292" {M} font-size="12" fill="#1F5E9C">10 teeth</text>
  <text x="240" y="338" {F} font-size="16" fill="#14202F" text-anchor="middle">Roller gear <tspan {M} font-size="12" fill="#0D8159">18 teeth</tspan></text>
</svg>'''

svg_layers = f'''<svg class="fit" viewBox="0 0 420 235" role="img" aria-label="A printer nozzle laying thin layers of melted plastic on a heated bed">
  <path d="M210 0 V40" stroke="#F0B43C" stroke-width="5"/>
  <path d="M190 40 h40 v34 l-12 14 h-16 l-12 -14 z" fill="#B9C4D1" stroke="#566A83" stroke-width="2"/>
  <path d="M205 88 h10 l-3 10 h-4 z" fill="#D8A34A" stroke="#566A83" stroke-width="1.5"/>
  <text x="244" y="56" {F} font-size="16" fill="#14202F">Nozzle, about 220&deg;C</text>
  <text x="244" y="75" {M} font-size="12" fill="#566A83">melts the plastic</text>
  <g fill="#F0B43C" stroke="#9A6A12" stroke-width="1">
    <rect x="60" y="166" width="240" height="12" rx="6"/><rect x="60" y="154" width="240" height="12" rx="6"/>
    <rect x="60" y="142" width="240" height="12" rx="6"/><rect x="60" y="130" width="240" height="12" rx="6"/>
    <rect x="60" y="118" width="150" height="12" rx="6"/>
  </g>
  <text x="60" y="110" {M} font-size="12" fill="#D95B21">new layer going down</text>
  <path d="M304 136 h10" stroke="#566A83" stroke-width="1.5"/>
  <text x="318" y="140" {M} font-size="12" fill="#566A83">each layer</text>
  <text x="318" y="156" {M} font-size="12" fill="#566A83">0.2 mm</text>
  <rect x="20" y="178" width="380" height="16" rx="4" fill="#F4C9C0"/>
  <text x="210" y="220" {M} font-size="12" fill="#566A83" text-anchor="middle">heated bed, about 60&deg;C, so the first layer sticks</text>
</svg>'''

svg_motor = f'''<svg class="fit" viewBox="0 0 420 215" role="img" aria-label="Front view of the right side: the motor bracket screws up into a pad under the base plate, and the wheel sits outside">
  <text x="200" y="28" {M} font-size="12" fill="#566A83" text-anchor="middle">base plate (printed)</text>
  <rect x="20" y="36" width="300" height="14" rx="3" fill="#F0B43C" stroke="#9A6A12" stroke-width="1.5"/>
  <rect x="236" y="50" width="52" height="26" fill="#F0B43C" stroke="#9A6A12" stroke-width="1.5"/>
  <text x="262" y="67" {M} font-size="11" fill="#6B4A0C" text-anchor="middle">PAD</text>
  <rect x="228" y="76" width="68" height="5" fill="#8E9CAC"/>
  <rect x="222" y="81" width="68" height="26" rx="4" fill="#B9C4D1" stroke="#566A83" stroke-width="1.5"/>
  <rect x="290" y="84" width="20" height="20" fill="#D8A34A" stroke="#8C6A1E" stroke-width="1.5"/>
  <rect x="310" y="91" width="16" height="6" fill="#8E9CAC"/>
  <rect x="324" y="44" width="20" height="100" rx="6" fill="#14202F"/>
  <path d="M244 106 V56 M280 106 V56" stroke="#D95B21" stroke-width="3" stroke-dasharray="4 3"/>
  <text x="210" y="96" {F} font-size="15" fill="#D95B21" text-anchor="end">M2 &times; 8 screws</text>
  <text x="210" y="114" {F} font-size="15" fill="#D95B21" text-anchor="end">go up into the pad</text>
  <path d="M10 144 H410" stroke="#566A83" stroke-width="2"/>
  <text x="20" y="164" {M} font-size="12" fill="#566A83">table</text>
  <text x="334" y="164" {M} font-size="12" fill="#566A83" text-anchor="middle">wheel</text>
  <text x="210" y="200" {M} font-size="12" fill="#566A83" text-anchor="middle">right side shown, left side is a mirror image</text>
</svg>'''

svg_arm = f'''<svg class="fit" viewBox="0 0 420 235" role="img" aria-label="Side view: the sensor arm holds the sensor 62 millimeters ahead of the wheel and 3 millimeters above the table">
  <text x="10" y="24" {M} font-size="12" fill="#566A83">FRONT</text>
  <rect x="96" y="46" width="314" height="9" rx="3" fill="#F0B43C" stroke="#9A6A12" stroke-width="1.5"/>
  <rect x="88" y="46" width="10" height="120" fill="#FF6F9A" stroke="#B23A62" stroke-width="1.5"/>
  <rect x="94" y="80" width="0" height="0"/>
  <rect x="62" y="160" width="36" height="7" fill="#FF6F9A" stroke="#B23A62" stroke-width="1.5"/>
  <rect x="68" y="167" width="24" height="4" fill="#2E8B57"/>
  <circle cx="300" cy="140" r="34" fill="#14202F"/><circle cx="300" cy="140" r="6" fill="#8E9CAC"/>
  <circle cx="392" cy="166" r="8" fill="#8E9CAC" stroke="#566A83" stroke-width="1.5"/>
  <path d="M10 174 H414" stroke="#566A83" stroke-width="2"/>
  <text x="108" y="100" {M} font-size="12" fill="#566A83">slot: slide up or down,</text>
  <text x="108" y="116" {M} font-size="12" fill="#566A83">then tighten</text>
  <text x="56" y="160" {F} font-size="15" fill="#D95B21" text-anchor="end">3 mm</text>
  <path d="M80 194 H300 M80 188 v12 M300 188 v12" stroke="#0D8159" stroke-width="2"/>
  <text x="190" y="222" {F} font-size="17" fill="#0D8159" text-anchor="middle">62 mm head start</text>
</svg>'''

def step(n, title, when, why, body):
    return f'''
  <div class="step" id="step-{n}">
    <div class="step-head">
      <span class="num">{n}</span>
      <div>
        <h2>{title}</h2>
        <p class="when">{when}</p>
      </div>
    </div>
    <p class="why">{why}</p>
{body}
  </div>'''

def done(text):
    return f'''    <div class="checkpoint">
      {tick}
      <div>
        <h4>You are done when</h4>
        <p>{text}</p>
      </div>
    </div>'''

def explain(title, *paras):
    return '    <div class="explain">\n      <h4>' + title + '</h4>\n' + ''.join(f'      <p>{p}</p>\n' for p in paras) + '    </div>'

def do(*items):
    out = []
    for it in items:
        if isinstance(it, tuple):
            out.append(f'      <li>{it[0]}<span class="tip">{it[1]}</span></li>')
        else:
            out.append(f'      <li>{it}</li>')
    return '    <ol class="do">\n' + '\n'.join(out) + '\n    </ol>'

def figure(svg, cap):
    return f'    <div class="diagram">\n      {svg}\n      <p class="caption">{cap}</p>\n    </div>'

def gotcha(text):
    return f'    <div class="gotcha">{text}</div>'

def blocks(*rows):
    out = []
    for kind, text, *rest in rows:
        small = f'<small>{rest[0]}</small>' if rest else ''
        out.append(f'      <div class="blk {kind}">{text}{small}</div>')
    return '    <div class="blocks">\n' + '\n'.join(out) + '\n    </div>'

V3D = '/projects/nolan/dusty-files/dusty-components-3d.html'
def see3d(part):
    return f'    <a class="link3d" href="{V3D}" target="_blank" rel="noopener">See it in 3D: tap &ldquo;{part}&rdquo; &rarr;</a>'

I = '<span class="ind"></span>'

steps = []
steps.append(step(1, 'Print the parts', 'Five batches, Sep 16 to the week of Sep 21 &middot; a grown-up runs the printer',
    'The parts print in five batches, and each batch unlocks the next few steps. The full plan, with a plate file for each batch, is on the <a href="/projects/nolan/dusty/build/batches" target="_top">print and build plan</a> page.',
    figure(svg_layers, 'A 3D PRINTER BUILDS A PART LIKE A STACK OF VERY THIN PANCAKES.') + '\n' +
    '''    <ol class="order">
      <li><b>Batch 1: fit check</b><span>Motor gear, washer, collar, two dowels, one post. Tests that the printer makes holes the right size before the big print.</span><span class="t">ABOUT 15 MINUTES &middot; UNLOCKS NOTHING YET, BUT SAVES THE BASE</span></li>
      <li><b>Batch 2: base plate</b><span>The base prints upside down, with the second post. A small loose block holds up the gear peg while it prints; lift it off afterward.</span><span class="t">ABOUT 1.5 HOURS &middot; UNLOCKS STEPS 2 AND 3</span></li>
      <li><b>Batch 3: deck, battery sleeve and sensor arms</b><span>Everything for the first drive, plus the arms for the sensor weekend. The battery sleeve prints standing on its end.</span><span class="t">ABOUT 1 HOUR 45 MINUTES &middot; UNLOCKS STEPS 4 TO 8</span></li>
      <li><b>Batch 4: brush drive</b><span>Motor mount, big gear, roller gear, roller and axle. The roller prints standing up, the axle lying flat side down.</span><span class="t">ABOUT 1 HOUR &middot; UNLOCKS STEP 9</span></li>
      <li><b>Batch 5: crumb tray</b><span>Last, because it sits right behind the brush.</span><span class="t">ABOUT 15 MINUTES &middot; UNLOCKS STEPS 10 AND 11</span></li>
    </ol>''' + '\n' +
    '    <p class="caption">TIMES ARE FROM THE PRINTER SOFTWARE FOR THE ADVENTURER 5M.</p>\n' +
    do(('Open the <b>.3mf plate file</b> in Orca-Flashforge (or OrcaSlicer).', 'The Adventurer 5M, the PLA settings, the brims and the slower speeds for the tiny gears are already inside the file. Slice and send.'),
       ('Wait until the bed cools before a grown-up takes each part off.', 'PLA grips a warm bed. Let it cool and the parts pop off on their own.'),
       ('Peel the brims off, and run a screw through each small hole once.', 'This clears the hole so the screw goes in smoothly later.'),
       ('Do the checks listed for each batch before printing the next one.', 'Nineteen pieces in all. Count them at the end.')) + '\n' +
    explain('What is PLA?',
        'PLA is a plastic made from plants, usually corn or sugarcane. It comes on a spool as a long thread. The printer pushes the thread into a hot nozzle, about 220&deg;C, where it melts like the glue in a hot glue gun.',
        'The nozzle draws the shape of one layer, a fifth of a millimeter thick. The bed drops a tiny bit, and it draws the next layer on top. The base plate is 28 mm tall, so that is about <b>140 layers</b>.',
        'PLA goes soft at about 60&deg;C. A car parked in the Houston sun gets hotter than that inside. <b>Never leave Dusty in the car.</b>') + '\n' +
    explain('What is a brim, and why test first?',
        'A <b>brim</b> is a thin flat ring the printer lays down around each part, like the brim of a hat. It gives the part more grip on the bed so the corners do not curl up. You peel it off afterward.',
        'Batch 1 is a <b>fit check</b>: a few tiny parts that show whether the printer makes holes the right size. Testing the risky thing first, before the long print, is what engineers do.') + '\n' +
    see3d('Base plate') + '\n' +
    done('All five batches are printed, cleaned up, and checked, and you have 19 pieces.')))

steps.append(step(2, 'Mount the motors and wheels', 'Sat Sep 19 &middot; about 45 minutes',
    'The two motors hang under the base on small printed pads. The pads put the wheels at exactly the right height, so there is nothing to measure.',
    figure(svg_motor, 'EACH BRACKET GETS TWO M2 &times; 8 SCREWS. FOUR SCREWS IN ALL.') + '\n' +
    do(('Slide each motor into a bracket.', 'The gold gearbox goes into the bracket, the shaft sticks out the far side.'),
       ('Turn the base upside down. Find the two rectangular pads near the middle.', 'Each pad has two small holes. Those are pilot holes for the screws.'),
       ('Hold a bracket on a pad with the shaft pointing outward, away from the middle. Drive in two M2 &times; 8 screws.', 'Turn until snug, then stop. Plastic threads strip if you keep going.'),
       'Do the other side the same way. Both shafts point out.',
       ('Tuck the six motor wires toward the middle of the robot.', 'Only two of the six wires run the motor. Leave the other four folded and taped for now.'),
       ('Push a wheel onto each shaft, flat side lined up with flat side.', 'Press straight on, thumb against the table. No glue.')) + '\n' +
    explain('What does M2 mean?',
        'Screws are named by how thick the thread is. <b>M2</b> means 2 millimeters across, about as thick as a strand of spaghetti. <b>M2 &times; 8</b> means 2 mm thick and 8 mm long.',
        'The holes in the plastic are a little smaller than the screw, 1.8 mm. As the screw turns, its thread cuts a matching groove in the plastic. That is called a <b>self-tapping</b> fit, and the small hole is a <b>pilot hole</b>.') + '\n' +
    explain('Two kinds of gears in one robot',
        'Inside the gold box on each drive motor is a stack of tiny metal gears. The motor spins very fast with almost no strength. The gears trade speed for strength: a <b>298:1</b> ratio means the motor turns 298 times for one turn of the wheel.',
        'You will build a gear set like this yourself in Step 9, for the brush.') + '\n' +
    gotcha('<b>Do not over-tighten.</b> If a screw suddenly spins freely, the plastic thread is stripped. Move on and tell a grown-up. A slightly longer screw or a drop of glue fixes it.') + '\n' +
    done('Both wheels spin freely, both shafts point outward, and the wheels look parallel when you sight down the front.')))

steps.append(step(3, 'Add the ball caster', 'Sat Sep 19 &middot; about 10 minutes',
    'On the foam board version this was the hardest step. On the printed base the right height is already built in.',
    do(('Find the two round posts near the back, on the underside of the base.', 'They are exactly as tall as the caster needs.'),
       'Hold the caster on the posts and drive in two M2 &times; 8 screws.',
       'Turn Dusty right side up and set it on the table.') + '\n' +
    explain('Why three feet, not four?',
        'Three points always sit flat, even on a bumpy table. That is why camera tripods have three legs. Four wheels would rock, and one would lift off whenever the table was not perfectly flat.') + '\n' +
    done('Dusty sits on two wheels and the ball without rocking, and a gentle push sends it rolling straight.')))

steps.append(step(4, 'Add the deck, the brain and the power', 'Sat Sep 19 &middot; about 1 hour',
    'The power bank rides in its own sleeve at the back, and the moto:bit and micro:bit sit on the deck above it. Keep the in-line switch OFF for this whole step.',
    do(('Set the battery sleeve on the back of the base, open end on the left, the two screw tabs toward the front.', 'The tabs and the back wall line up with four holes in the base.'),
       ('Turn the base over and drive four M2 &times; 8 screws up through the base into the sleeve.', 'Two into the front tabs, two into the back wall. The tray has to be out for this.'),
       ('Stick a strip of foam tape along the rib in the middle of the sleeve floor.', 'Sticky side on the sleeve, never on the power bank.'),
       ('Slide the charged power bank into the sleeve, ports facing out the left side, all the way to the closed end.', 'Its button should show through the window in the back wall.'),
       ('Push the keeper bar in through the slot in the back wall until its head sits flat.', 'It crosses under the USB ports so the bank cannot slide out. Pull it out by the head when you need the bank out.'),
       ('Push the two posts into the holes near the front of the base.', 'The pegs on the bottom of each post drop into the base.'),
       ('Stick a second strip of foam tape under the deck, right over the bank.', 'It squeezes the bank gently so it cannot rattle.'),
       ('Set the deck on the posts and the sleeve, and drive four M2 &times; 8 screws down.', 'Two into the posts, two into the back wall of the sleeve.'),
       ('Slide the moto:bit onto the deck between the two side guides, connector edge toward the front, until it touches the stop at the back.', 'The deck has a nose that sticks out in front to hold the front of the board.'),
       ('Loop two zip ties through the slots beside the guides and over the board. Snug, not crushing.', ''),
       ('Slide the micro:bit into the connector on the front of the moto:bit, LEDs and buttons facing up.', 'It lies flat and sticks out over the brush, like a little roof. The gold stripes go in. If it will not go, flip it over rather than pushing harder.'),
       ('A grown-up connects the power: the 90 degree adapter into the bank&rsquo;s USB-A port, turned so the cable runs toward the front. Then the USB to round-plug cable, the in-line switch, and the Y splitter, with one end into the moto:bit.', 'Stick the switch to the edge of the deck with mounting tape where you can reach it. The second splitter end is for the brush motor in Step 9.'),
       ('Flip the switch ON, then tap the button on the power bank once. The micro:bit should light up.', 'Nothing? Check every plug. Then check the bank is charged: pull the keeper bar, slide the bank out and press its button to see the lights.')) + '\n' +
    reused_explain + '\n' +
    explain('Why a power bank',
        'A power bank holds a steady 5 volts until it is empty. AA batteries start near 6 volts and fade as they run down, which would make Dusty slower as the day goes on. Speed is exactly what the experiment measures, so a steady supply keeps the test fair. It also charges from a phone charger without taking anything apart.') + '\n' +
    explain('How to charge Dusty',
        'Switch Dusty off. Plug a USB-C phone charger into the port that shows on Dusty&rsquo;s left side. The bank&rsquo;s lights are hidden under the deck, so leave it about three hours, or slide it out and press the button to check. Always charge on a hard surface with a grown-up nearby.') + '\n' +
    see3d('Battery sleeve') + '\n' +
    done('Switch on plus one tap lights the micro:bit, the bank does not slide or rattle, and Dusty still sits flat with everything on board.')))

steps.append(step(5, 'Wire the motors and make it drive', 'Sun Sep 20 &middot; about 1 hour',
    'First code of the project. Forward, backward, spin. No sensors yet.',
    figure(diag_wire, 'LEFT MOTOR TO THE LEFT CONNECTOR, RIGHT MOTOR TO THE RIGHT. WRITE IT DOWN.') + '\n' +
    do('Switch the battery off.',
       ('Find the two motor wires on each motor.', 'Check the label on the motor&rsquo;s little board or the product page. A grown-up helps with this one.'),
       ('Connect the left motor to the moto:bit LEFT MOTOR pins, and the right motor to RIGHT MOTOR.', 'The board marks which pin is red and which is black.'),
       ('Slide the moto:bit switch to <b>RUN MOTORS</b>.', 'STOP MOTORS keeps the wheels still while you work, even with the battery on.'),
       ('Open MakeCode, start a new project, and add the <b>moto:bit</b> extension.', 'Extensions is at the bottom of the block list. Search for moto:bit.'),
       'Build the test program below and download it to the micro:bit.',
       ('Hold Dusty in the air, switch on, and press A.', 'In the air, not on the table. It does not know about edges yet.')) + '\n' +
    blocks(('start', 'on start', 'Runs once when Dusty switches on'),
           ('act', f'{I}turn motors ON', 'The moto:bit keeps the motors off until you say so'),
           ('start', 'on button A pressed'),
           ('act', f'{I}set LEFT motor to FORWARD at 40'),
           ('act', f'{I}set RIGHT motor to FORWARD at 40'),
           ('logic', f'{I}pause 2000 ms', 'Two seconds'),
           ('act', f'{I}set LEFT motor to FORWARD at 0'),
           ('act', f'{I}set RIGHT motor to FORWARD at 0')) + '\n' +
    explain('What does 40% speed actually mean?',
        'The board switches the power fully on and fully off hundreds of times every second. On 40% of the time, the motor acts like it is getting 40% of the power. This is called <b>PWM</b>, short for pulse width modulation. A dimmer switch works the same way.',
        'At 40%, Dusty drives about 7 centimeters per second. Changing that number is the experiment.') + '\n' +
    gotcha('<b>A wheel spins the wrong way?</b> Do not rewire it. Use the <b>invert LEFT motor</b> block (or RIGHT) in on start. Fixed in code, it can never come loose.') + '\n' +
    done('On the floor, pressing A drives Dusty forward in a straight line for two seconds. That finishes the first weekend.')))

steps.append(step(6, 'Mount the sensor arms', 'Sat Sep 26 &middot; about 45 minutes',
    'The two pink arms carry the cliff sensors out in front of the wheels. That head start is what lets Dusty stop in time.',
    figure(svg_arm, 'THE SENSOR SEES THE EDGE 62 MM BEFORE THE WHEELS GET THERE.') + '\n' +
    do(('A grown-up solders the three header pins onto each sensor.', 'Push the short ends of the pins through from the side without the two tiny bumps, so the pins point up when the sensor faces the table. Heat pin and pad together, then feed in the solder.'),
       ('Put a QTR-1A sensor face down in the foot of each arm, and hold it with an M2 &times; 6 screw and nut.', 'The two tiny bumps must look down through the window.'),
       ('Hold the right arm against the outside of the right ear at the front of the base.', 'The left arm, with the extra pad, goes on the left.'),
       'Push an M2 &times; 8 screw through the slot and the ear, and add a nut on the inside. Snug, not tight.',
       ('Set Dusty on the table. Slide each arm until the sensor is 3 mm above the table, then tighten.', 'Two US pennies stacked up are almost exactly 3 mm. Slide them under the sensor, push the arm down onto them, tighten, pull the pennies out.'),
       'Run three jumper wires from each sensor to the moto:bit: VIN to 3.3V, GND to GND, OUT to the pin. Left sensor to <b>P0</b>, right sensor to <b>P1</b>.') + '\n' +
    explain('How does a cliff sensor see?',
        'One bump is a tiny infrared light, the other is a light detector. Infrared is just past red, so your eyes cannot see it, but a phone camera can. Try it.',
        'On the table, the light bounces straight back into the detector. Past the edge, it shines into empty space and almost nothing comes back.') + '\n' +
    explain('Why 3 mm?',
        'This sensor sees best at about 3 mm and gets unreliable past 6 mm. The slot lets you set the height exactly, and set it again if an arm gets bumped.') + '\n' +
    see3d('Right sensor arm') + '\n' +
    done('Both sensors sit 3 mm above the table, both arms are tight, and the wires are plugged into P0 and P1.')))

# step 7: reuse the old "teach edges" body with small changes
t7 = _steps_region.split('<div class="step">')[7]
t7_body = t7[t7.index('<p class="why">'):t7.rindex('</div>')]
t7_body = re.sub(r'<li><b>Wire each sensor</b>.*?</li>', '<li><b>Check the sensor wires:</b> left sensor on <span class="mono">P0</span>, right sensor on <span class="mono">P1</span>.</li>', t7_body, flags=re.S)
t7_body = re.sub(r'<span class="blk-?[^"]*">', '', t7_body)
t7_body = t7_body.replace('motor A stop, motor B stop', 'set LEFT and RIGHT motors to 0').replace('motor A and B run at 40 %', 'set LEFT and RIGHT motors to FORWARD at 40')
t7_body = t7_body.replace('Weekend 2 finished', 'the sensor weekend finished')
steps.append(f'''
  <div class="step" id="step-7">
    <div class="step-head">
      <span class="num">7</span>
      <div>
        <h2>Teach Dusty about edges</h2>
        <p class="when">Sep 26 and 27 &middot; about 1.5 hours</p>
      </div>
    </div>
    {t7_body}
  </div>''')

steps.append(step(8, 'Add the whisker', 'Sun Sep 27 &middot; about 30 minutes',
    'A second way to notice the edge that works in a completely different way, so the two cannot fail for the same reason.',
    figure(diag_whisk, 'IT IS NOT LOOKING. IT IS TOUCHING. A DARK TABLE CANNOT FOOL IT.') + '\n' +
    do(('Screw the switch to the pad on the left sensor arm with two M2 &times; 10 screws and nuts.', 'Arm pointing down, little wheel toward the front.'),
       ('Set Dusty on the table. The wheel should rest on the table and push the arm in with a click.', 'No click? Loosen the arm slot and lower it a little.'),
       ('A grown-up solders two wires to the <b>C</b> and <b>NO</b> tabs. Cut the far ends off two jumper wires so the other ends still plug onto pins.', 'C is common, NO is normally open. Solder the switch before screwing it on, so the heat cannot soften the plastic arm.'),
       'Plug the wires into the moto:bit: C to GND, NO to <b>P2</b>.',
       'In on start, add <b>set pull pin P2 to up</b>. In the forever loop, add: if digital read P2 = 1, stop both motors.',
       ('Test it with both infrared sensors covered by tape.', 'Only the whisker is working now. Does Dusty still stop?')) + '\n' +
    explain('Why two of everything?',
        'The infrared sensors can be fooled by a black placemat. The whisker cannot, because it touches instead of looking. Engineers call this <b>redundancy</b>: two systems that fail for different reasons.',
        'When a judge asks &ldquo;what if the sensor is wrong?&rdquo;, this is the answer.') + '\n' +
    done('With the infrared sensors taped over, Dusty still stops at the edge using only the whisker.')))

steps.append(step(9, 'Build the brush and the gears', 'Sat Oct 3 &middot; about 2 hours',
    'Now Dusty earns its name. The brush motor spins far too fast for a brush, so three printed gears slow it down before it reaches the roller.',
    figure(svg_gears, 'THE BRUSH GEAR TRAIN, SEEN FROM THE RIGHT SIDE OF THE ROBOT.') + '\n' +
    explain('How the gears slow the brush down',
        'When two gears touch, their teeth pass each other one for one. The little motor gear has 12 teeth. The big gear has 36. So the motor gear has to go around <b>3 times</b> to push the big gear around once.',
        'The big gear has a small 10-tooth gear stuck to it, so they always turn together. That small gear drives the 18-tooth roller gear. 18 &divide; 10 is <b>1.8</b>, so it slows down again.',
        'The two slow-downs multiply:') + '\n' +
    '''    <div class="math">
      <div class="box">36 &divide; 12<small>first pair</small></div><span>&times;</span>
      <div class="box">18 &divide; 10<small>second pair</small></div><span>=</span>
      <div class="box">3 &times; 1.8 = 5.4<small>times slower</small></div>
    </div>''' + '\n' +
    explain('What do you get for going slower?',
        'Strength. Engineers call turning strength <b>torque</b>. Gearing down by 5.4 times gives the roller about 5.4 times the turning strength, minus a little lost to friction. That is what lets fuzzy bristles push through a pile of cereal without stalling.',
        'A plain 130 motor spins roughly 8,000 to 10,000 times a minute with no load. Divided by 5.4, the roller turns roughly 1,500 to 1,800 times a minute. Still fast, but now it has muscle. This is called <b>gearing down</b>.') + '\n' +
    '    <div class="try"><b>Try it:</b> once the gears are in, put a marker dot on one tooth of the motor gear and one on the roller gear. Turn the roller slowly by hand and count how many times the motor gear goes around for one turn of the roller. You should count about five and a half.</div>\n' +
    do(('Cut pipe cleaners into pieces about 30 mm long and push one through each hole in the roller.', 'Center each piece so the same length sticks out both sides.'),
       ('Snap the 130 motor into the motor mount, shaft toward the right side, and hold it with two zip ties.', ''),
       ('Push the motor gear onto the motor shaft until it lines up with the big gear.', 'A snug press fit. If it slips, a grown-up adds a tiny drop of superglue.'),
       ('Put the two dowels in the base, set the motor mount on them, and drive two M2 &times; 8 screws up from under the base.', ''),
       ('Slide the big gear onto the peg on the right side plate, big side first. Add the washer and an M2 &times; 6 screw into the end of the peg.', 'The gear must spin freely. If it drags, back the screw off a quarter turn.'),
       ('Slide the axle in from the left side plate, through the roller, and out the right side plate.', 'The flat side of the axle lines up with the flat inside the roller.'),
       ('Push the roller gear onto the right end of the axle, and the collar onto the left end.', 'Turn the roller by hand. All three gears should turn together without grinding.'),
       ('Snap the rocker switch into the square hole on the motor mount.', ''),
       ('A grown-up wires the brush: the splitter&rsquo;s second end to its screw-terminal adapter, then through the switch to the motor tabs.', 'Battery switch off while wiring.'),
       ('Switch on and check which way the roller spins.', 'The bristles at the bottom must move backward, toward the tray. Wrong way? Battery off, swap the two wires on the motor tabs.')) + '\n' +
    gotcha('<b>Fingers, hair and sleeves stay away from the gears and the brush while they spin.</b> Gears pinch. Brushes grab. Switch the brush off before touching anything near the front.') + '\n' +
    see3d('Compound gear') + '\n' +
    done('The brush switch starts the roller, all three gears turn smoothly, and the bristles at the bottom move backward toward the tray.')))

steps.append(step(10, 'Slide in the tray and test the sweep', 'Sun Oct 4 &middot; about 1 hour',
    'The tray catches what the brush flicks. It snaps in from underneath and pops back out, so you can weigh what Dusty picked up.',
    do(('Turn Dusty upside down on a towel. Set the tray in place with the ramp toward the brush, and press it down until the back clicks over the hook and the two side bumps click into the side plates.', 'To take it out: turn Dusty over, push the back wall of the tray a little toward the front so it slips off the hook, and lift.'),
       ('Set Dusty on the table and look from the side. The bristles should just touch the table.', 'Pressed hard, the brush acts like a brake. Too high, it misses crumbs. Trim the pipe cleaners to adjust.'),
       ('Still looking from the side, check the tray. The front edge should touch the table, and you should see a thin gap under the back of the tray.', 'If the front edge scrapes hard, sand it a little. A gap thinner than a crumb at the front is fine.'),
       ('Weigh 5 grams of crushed cereal on a kitchen scale.', ''),
       'Sprinkle it on the table in a strip, and let Dusty drive through it with the brush on.',
       ('Pop the tray out and weigh what is inside. Write down the number.', 'Do this three times and take the average.')) + '\n' +
    explain('How the tray keeps crumbs in',
        'The front of the tray is a ramp that climbs to a little ridge, then drops straight down. Crumbs flicked by the brush fly over the ridge, but once they land behind it they cannot roll back out. It works like a one-way door.',
        'Inside, the corners are sloped instead of square, so crumbs slide to the middle where they are easy to dump out. Along the top of the back and side walls, a small lip leans inward. A crumb that bounces up hits the lip and falls back in.') + '\n' +
    explain('Why the bottom of the tray slopes',
        'A tray lying flat on the table would rub along its whole bottom, like dragging a book across a desk. That rubbing is called friction, and the motors would waste their push fighting it. So only the thin front edge touches the table, where it scoops crumbs up the ramp. From there the bottom tilts up, and the back of the tray floats 2.5 mm above the table.',
        'The tray does not hold itself up with that front edge. It hangs from the hook at the back of the base and the two side bumps. The front edge only rests on the table, so the rubbing stays tiny. The sides are also cut down in a slope on each side of the snap bumps, which takes off plastic the tray does not need.') + '\n' +
    explain('Why weigh it?',
        'Saying &ldquo;Dusty cleans pretty well&rdquo; is an opinion. Saying &ldquo;Dusty picked up 3.8 grams out of 5, which is 76 percent&rdquo; is a measurement. Science runs on measurements.') + '\n' +
    gotcha('<b>Keep crumbs off the sensors.</b> If the brush throws crumbs forward onto a sensor, it goes blind. Check the spin direction again, and wipe the sensor faces before each test.') + '\n' +
    see3d('Crumb tray') + '\n' +
    done('You can say a real number out loud: &ldquo;Dusty picked up __ grams out of 5.&rdquo;')))

steps.append(step(11, 'Two brains, then run the experiment', 'Oct 10 and 11 &middot; the whole weekend',
    'The robot is finished. This weekend turns it into a science project, and this is what the display board is really about.',
    figure(diag_pat, 'SAME ROBOT, TWO DIFFERENT IDEAS. RACE THEM AND SEE WHICH WINS.') + '\n' +
    do('Put random bounce on button A and Spot Clean on button B.',
       ('Build Spot Clean from the blocks below.', 'Spot Clean sweeps a 1 foot square right in front of Dusty, in rows like mowing a lawn. The cliff sensors still work the whole time.'),
       ('Tape a 1 foot (30 cm) square on the table. Put Dusty at the bottom left corner, facing into the square, and press B.', 'Adjust the lane time until the front of Dusty just reaches the far tape. Adjust the turn time until each turn is square.'),
       ('Run the speed experiment at four speeds: 25, 50, 75 and 100. Twenty runs at each.', 'Put a cushion on the floor anyway.'),
       ('For every run, write down how far the sensor went past the edge before Dusty stopped, in millimeters, and whether it fell.', 'A ruler taped along the table edge makes this easy. A slow-motion phone video makes it exact.'),
       'Make the first chart: speed along the bottom, stopping distance up the side.',
       ('Experiment B, the spill race: sprinkle 5 grams of cereal inside the taped square. Press B and time Spot Clean until it stops. Weigh the tray.', 'Write down the time and the grams.'),
       ('Put the same 5 grams back in the same square. Press A and stop random bounce after the same amount of time. Weigh the tray.', 'Same time, same crumbs, same spot. Only the pattern changes.'),
       ('Do three tries of each pattern and make the second chart: grams picked up by each pattern.', ''),
       'Try three surfaces if there is time: white paper, bare wood, a black placemat.') + '\n' +
    blocks(('start', 'on button B pressed', 'Spot Clean'),
           ('var', f'{I}set lane to 0'),
           ('logic', f'{I}repeat 8 times', '8 rows, about 4 cm apart, fill the 30 cm square'),
           ('act', f'{I}{I}driveFor 4400 ms', 'One row: 30 cm at 40%. driveFor checks the cliff sensors every 40 ms'),
           ('logic', f'{I}{I}if lane is even: turn RIGHT 90, otherwise turn LEFT 90'),
           ('act', f'{I}{I}driveFor 570 ms', 'Slide over about 4 cm'),
           ('logic', f'{I}{I}turn the same way 90 again', 'Now Dusty faces back across the square, one row over'),
           ('var', f'{I}{I}change lane by 1'),
           ('act', f'{I}stop both motors', 'Done. Pop out the tray and weigh it')) + '\n' +
    explain('Why 8 rows, 4 cm apart?',
        'The brush is 52 mm wide. If the rows are 40 mm apart, each row overlaps the last one by 12 mm, so no stripe of crumbs gets missed. A foot is about 305 mm, and 305 divided by 40 is about 8 rows.',
        'At 40% Dusty drives about 70 mm every second, so one 305 mm row takes about 4.4 seconds, and a 40 mm slide takes about 0.6 seconds. Those are the starting numbers. The real table decides the final ones.') + '\n' +
    explain('What should happen?',
        'Faster means more distance to stop. Your prediction: the stopping distance grows <b>faster</b> than the speed. Double the speed and the distance more than doubles, because a faster robot has more to slow down and also covers more ground while the code reacts.',
        'Dusty has a <b>62 mm</b> head start. The math says that even at 100% it should need less than that, so it should never fall. If your chart shows the distances climbing toward 62, you can draw the line forward and predict the speed where Dusty <em>would</em> fall. That number is the one to put in big type on the board.',
        'For the spill race, a good guess is that Spot Clean wins. Random bounce spends most of its time driving where there are no crumbs. Spot Clean spends all of its time on the spill.') + '\n' +
    done('You have a filled-in data table and two charts made from your own numbers: stopping distance by speed, and grams picked up by pattern.')))

trouble = '''
  <div class="card">
    <p class="eyebrow">When it misbehaves</p>
    <h2>Fixing it</h2>
    <p class="lead">Everything here has happened to somebody. Find the symptom, try the fix.</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>What you see</th><th>Most likely cause</th><th>What to do</th></tr></thead>
        <tbody>
          <tr><td>Nothing happens at all</td><td>Power</td><td>Switch on? Tapped the power bank button? Plugs pushed fully in? Charge the power bank.</td></tr>
          <tr><td>micro:bit lights up, motors do nothing</td><td>Motors not turned on</td><td>Check the <b>turn motors ON</b> block is in on start, and the moto:bit motor switch is on.</td></tr>
          <tr><td>Drives in a curve</td><td>One motor slower</td><td>Check both wheels are pushed fully on. Then lower the faster side by a few percent in code.</td></tr>
          <tr><td>One wheel goes backward</td><td>Wires swapped</td><td>Use the invert motor block. No rewiring.</td></tr>
          <tr><td>A print lifted off the bed</td><td>First layer did not stick</td><td>Clean the bed, let it heat fully, and try again. A glue stick on the bed helps.</td></tr>
          <tr><td>A screw spins and will not tighten</td><td>Stripped plastic thread</td><td>Use the next longer screw, or a grown-up adds a drop of glue in the hole and waits.</td></tr>
          <tr><td>A part will not fit</td><td>Printed a little big</td><td>Sand or file the edge a little. Do not force it; PLA cracks.</td></tr>
          <tr><td>Refuses to move, sensors fine</td><td>Dark surface</td><td>It thinks it is at a cliff. Recalibrate on that table with button A.</td></tr>
          <tr><td>Falls off despite the sensors</td><td>Arm moved or too fast</td><td>Re-check the 3 mm height, re-tighten the arms, lower the speed.</td></tr>
          <tr><td>Gears click or skip</td><td>Big gear loose</td><td>Check the washer screw. The gear should spin freely but not wobble.</td></tr>
          <tr><td>Brush motor hums, roller does not turn</td><td>Too much drag</td><td>Bristles too long or pressing too hard. Trim the pipe cleaners. Check nothing rubs the gears.</td></tr>
          <tr><td>Motor gear slips on the shaft</td><td>Press fit too loose</td><td>A grown-up adds a tiny drop of superglue. Keep it off the other gears.</td></tr>
          <tr><td>Crumbs fly forward</td><td>Brush spins the wrong way</td><td>Switch off, swap the two wires on the brush motor tabs.</td></tr>
          <tr><td>Stops suddenly, micro:bit goes dark</td><td>Power bank empty or asleep</td><td>Tap the bank button. If nothing happens, charge it. With the brush switched off the bank can put itself to sleep, so keep the brush on while driving.</td></tr>
          <tr><td>micro:bit will not take the code</td><td>Cable</td><td>Many micro-USB cables only charge. Use one you know moves data.</td></tr>
        </tbody>
      </table>
    </div>
  </div>'''

screws = '''
  <div class="card">
    <p class="eyebrow">Hardware</p>
    <h2>Where every screw goes</h2>
    <p class="lead">Sort the screws into three piles before you start. The long ones and the short ones look almost the same.</p>
    <div class="table-wrap">
      <table class="screws">
        <thead><tr><th>Where</th><th>Screw</th><th>How many</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Motor brackets</td><td>M2 &times; 8</td><td>4</td><td>Up into the pads under the base</td></tr>
          <tr><td>Ball caster</td><td>M2 &times; 8</td><td>2</td><td>Up into the round posts</td></tr>
          <tr><td>Battery sleeve</td><td>M2 &times; 8</td><td>4</td><td>Up through the base into the sleeve</td></tr>
          <tr><td>Deck</td><td>M2 &times; 8</td><td>4</td><td>Down: two into the posts, two into the sleeve</td></tr>
          <tr><td>Brush motor mount</td><td>M2 &times; 8</td><td>2</td><td>Up from under the base</td></tr>
          <tr><td>Sensor arms</td><td>M2 &times; 8</td><td>2</td><td>Through the slot, nut on the inside</td></tr>
          <tr><td>Sensors in the arms</td><td>M2 &times; 6</td><td>2</td><td>With a nut</td></tr>
          <tr><td>Big gear washer</td><td>M2 &times; 6</td><td>1</td><td>Into the end of the gear peg</td></tr>
          <tr><td>Whisker switch</td><td>M2 &times; 10</td><td>2</td><td>With nuts</td></tr>
          <tr><td><b>Total</b></td><td></td><td><b>23</b></td><td>18 &times; 8 mm, 3 &times; 6 mm, 2 &times; 10 mm, plus 6 nuts. Buy a small M2 kit; spares get lost.</td></tr>
        </tbody>
      </table>
    </div>
  </div>'''

gloss_items = [
    ('Microcontroller', 'A tiny computer that does one job forever, using barely any power.'),
    ('H-bridge', 'Four switches that let a motor spin either direction. Inside the moto:bit.'),
    ('Infrared', 'Light just past red that eyes cannot see. TV remotes use it.'),
    ('PLA', 'A plastic made from plants. The printer melts it and builds parts in layers.'),
    ('Layer', 'One thin slice of a 3D print, 0.2 mm on Dusty. Stack them and you get a part.'),
    ('Fit check', 'Testing the part everything else depends on before making the rest.'),
    ('Pilot hole', 'A hole a bit smaller than the screw, so the screw cuts its own thread.'),
    ('Gear ratio', 'How many turns in for one turn out. The brush gears are 5.4 to 1.'),
    ('Gearing down', 'Using gears to trade speed for strength.'),
    ('Torque', 'Turning strength. What gearing down gives you more of.'),
    ('PWM', 'Flicking power on and off very fast to make a motor run slower.'),
    ('Analog', 'A measurement with a whole range of answers, not just yes or no.'),
    ('Calibration', 'Letting the robot measure its own surroundings instead of guessing in advance.'),
    ('Threshold', 'The line you draw in a measurement: above this means cliff, below means table.'),
    ('Differential drive', 'Steering by running two wheels at different speeds.'),
    ('Redundancy', 'Two systems that fail for different reasons, so one catches what the other misses.'),
]
gloss = '''
  <div class="card">
    <p class="eyebrow">Words to know</p>
    <h2>Say these like you mean them</h2>
    <p class="lead">Judges ask what words mean. Here they are in one place.</p>
    <div class="gloss">
''' + '\n'.join(f'      <div class="gterm"><b>{t}</b><span>{d}</span></div>' for t, d in gloss_items) + '''
    </div>
  </div>'''

links = '''
  <div class="card">
    <p class="eyebrow">Everything else</p>
    <h2>The other pages</h2>
    <div class="linkrow">
      <a class="primary" href="/projects/nolan/dusty-files/dusty-components-3d.html" target="_blank" rel="noopener">3D model of every part</a>
      <a class="secondary" href="/projects/nolan/dusty/build" target="_top">Print files and downloads</a>
      <a class="secondary" href="/projects/nolan/dusty-parts-list.pdf" target="_blank" rel="noopener">Parts list PDF</a>
      <a class="secondary" href="/projects/nolan/dusty" target="_top">Dusty project page</a>
    </div>
  </div>'''

hero = '''
  <div class="card hero">
    <span class="bot">&#129302;</span>
    <h1><span>How To Build</span>DUSTY</h1>
    <p>A little robot that sweeps crumbs off the table and stops itself right at the edge. This guide takes you from a pile of parts and a 3D printer to a working robot, one step at a time.</p>
    <div class="facts">
      <span class="fact">DUE <b>NOV 16</b></span>
      <span class="fact">CHASSIS <b>3D PRINTED</b></span>
      <span class="fact">SCREWS <b>23 &times; M2</b></span>
      <span class="fact">SOLDERING <b>A LITTLE</b></span>
    </div>
  </div>

  <div class="safety">
    <h2>Read this part first</h2>
    <ul>
      <li><b>A grown-up runs the 3D printer.</b> The nozzle is about 220&deg;C and the bed about 60&deg;C. Never touch either while it is printing or cooling.</li>
      <li><b>Hands off while it prints.</b> The printer moves fast and on its own, and this one has no door. Stand back and watch.</li>
      <li><b>A grown-up does the soldering.</b> The iron tip is hotter than the printer nozzle. Always put it back in its stand, and wash hands after touching solder.</li>
      <li><b>Tiny screws and nuts are choking hazards.</b> Keep them in a cup, and away from little brothers.</li>
      <li><b>Only use the cables from the parts list.</b> A plug with the wrong voltage can cook the micro:bit.</li>
      <li><b>Switch off and unplug the power bank cable before changing any wire.</b> Every single time.</li>
      <li><b>Never crush, pierce or drop the power bank.</b> It is a lithium battery. If it gets hot, swells or smells, a grown-up takes it out and puts it somewhere safe.</li>
      <li><b>Gears pinch and brushes grab.</b> Brush switch off before your fingers go near the front.</li>
      <li><b>Test on a low table first.</b> A kitchen chair is a shorter drop than a counter.</li>
    </ul>
  </div>

  <div class="card">
    <p class="eyebrow">Before you start</p>
    <h2>Tools you need</h2>
    <p class="lead">A grown-up with a 3D printer, plus a few small things.</p>
    <div class="tools">
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><rect x="8" y="6" width="44" height="44" rx="4" fill="#fff" stroke="#566A83" stroke-width="2.5"/><path d="M14 16 h32" stroke="#566A83" stroke-width="2.5"/><path d="M26 16 v10 h8 v-10" fill="#B9C4D1" stroke="#566A83" stroke-width="2"/><rect x="18" y="38" width="24" height="5" fill="#F0B43C"/></svg><b>3D printer</b><span>Grown-up runs it</span></div>
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><path d="M30 6 v30" stroke="#566A83" stroke-width="3"/><path d="M24 36 h12 v14 h-12 Z" fill="#D95B21" stroke="#566A83" stroke-width="2.5" stroke-linejoin="round"/><path d="M26 6 h8" stroke="#566A83" stroke-width="5" stroke-linecap="round"/></svg><b>Small screwdriver</b><span>Phillips #0 for M2</span></div>
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><path d="M20 50 L28 26 M40 50 L32 26" stroke="#D95B21" stroke-width="5" stroke-linecap="round"/><path d="M28 26 L30 6 L32 26" fill="#8E9CAC" stroke="#566A83" stroke-width="2"/></svg><b>Needle-nose pliers</b><span>To hold the nuts</span></div>
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><path d="M10 46 L36 20" stroke="#D95B21" stroke-width="7" stroke-linecap="round"/><path d="M36 20 L50 8" stroke="#8E9CAC" stroke-width="3" stroke-linecap="round"/></svg><b>Soldering iron</b><span>Grown-up only</span></div>
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><rect x="8" y="24" width="44" height="12" rx="2" fill="#fff" stroke="#566A83" stroke-width="2.5"/><path d="M16 24 v7 M24 24 v5 M32 24 v7 M40 24 v5 M48 24 v7" stroke="#566A83" stroke-width="2"/></svg><b>Ruler</b><span>Millimeters matter</span></div>
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><rect x="8" y="26" width="44" height="20" rx="4" fill="#fff" stroke="#566A83" stroke-width="2.5"/><rect x="20" y="16" width="20" height="10" rx="2" fill="#D2DCE7" stroke="#566A83" stroke-width="2"/><text x="30" y="41" font-family="IBM Plex Mono" font-size="10" text-anchor="middle" fill="#14202F">5.0g</text></svg><b>Kitchen scale</b><span>To weigh crumbs</span></div>
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><rect x="10" y="18" width="40" height="22" rx="4" fill="#fff" stroke="#566A83" stroke-width="2.5"/><path d="M18 29 h24" stroke="#D95B21" stroke-width="3" stroke-linecap="round"/><path d="M30 23 v12" stroke="#D95B21" stroke-width="3" stroke-linecap="round"/></svg><b>Laptop</b><span>To load the code</span></div>
      <div class="tool"><svg viewBox="0 0 60 56" aria-hidden="true"><circle cx="30" cy="28" r="18" fill="#fff" stroke="#566A83" stroke-width="2.5"/><path d="M30 16 v12 l8 6" stroke="#14202F" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg><b>Stopwatch</b><span>A phone works</span></div>
    </div>
  </div>

  <div class="card">
    <p class="eyebrow">Know your gear</p>
    <h2>Meet the parts</h2>
    <p class="lead">Lay everything out before you build anything. Find each item below so you know what you are holding. <a href="''' + V3D + '''" target="_blank" rel="noopener">Every part is also in the 3D model.</a></p>
    <div class="parts">
''' + parts_html + '''
    </div>
  </div>'''

# ---- MS-2000 look: dark theme, pink / lime / sky accents ----
import os as _os
css = open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'theme-ms2000.css.html')).read()
page = (head + css + '\n<body>\n<div class="wrap">\n' + hero + screws + '\n' + '\n'.join(steps) + trouble + gloss + links +
        '\n  <footer>DUSTY &middot; BUILD GUIDE &middot; 3D PRINTED VERSION &middot; DUE MON NOV 16, 2026</footer>\n</div>\n</body>\n</html>\n')
def _recolor(html):
    """Drawings were made for a light page; retune them for the dark MS-2000 page."""
    def svg_fix(m):
        svg = m.group(0)
        # text first: dark ink becomes light ink
        def text_fix(t):
            x = t.group(0)
            for a_, b_ in (('#14202F', '#EEF2F8'), ('#566A83', '#A9B6CA'), ('#8C9CB1', '#74839B'), ('#BBD9F2', '#CFE8FF')):
                x = x.replace(a_, b_)
            return x
        svg = re.sub(r'<text[^>]*>', text_fix, svg)
        svg = re.sub(r'<g[^>]*font-family[^>]*>', text_fix, svg)
        for a_, b_ in (('fill="#14202F"', 'fill="#2B2F3A"'), ('stroke="#14202F"', 'stroke="#A9B6CA"'),
                       ('#566A83', '#8A99B0'), ('#8C9CB1', '#74839B'), ('#E9EEF4', '#0F1420'), ('#D2DCE7', '#2B3650'),
                       ('#D95B21', '#F0609E'), ('#0D8159', '#9BE15D'), ('#2B5FA8', '#5DB7F0'), ('#C3432F', '#F0605E'),
                       ('#BBD9F2', '#CFE8FF')):
            svg = svg.replace(a_, b_)
        return svg
    html = re.sub(r'<svg.*?</svg>', svg_fix, html, flags=re.S)
    # tool icons: white bodies become card-colored
    html = re.sub(r'(<div class="tool">.*?</div>)', lambda m: m.group(1).replace('fill="#fff"', 'fill="#1F2940"'), html, flags=re.S)
    # jump links under the hero
    steps_found = re.findall(r'<div class="step" id="step-(\d+)"', html)
    if steps_found and '<div class="jump">' not in html:
        jump = '    <div class="jump">' + ''.join(f'<a href="#step-{n}">{n}</a>' for n in steps_found) + '</div>\n  </div>'
        i = html.index('<div class="facts">')
        j = html.index('</div>', html.index('</div>', i) + 1)  # end of hero
        html = html[:html.index('</div>', i) + 6] + '\n' + jump + html[j + 6:]
    return html
page = _recolor(page)
open(OUT, 'w').write(page)
print('wrote', OUT, len(page))

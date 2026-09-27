// Wiring map for the Build Guide. Positions measured off photos of the real moto:bit (27 Sep 2026),
// in mm from the connector edge (front) and the left edge, as seen from behind Dusty looking down.
// Pin map confirmed against SparkFun's pxt-moto-bit README: P0/P1/P2 analog, P8/P12/P14 digital, P15/P16 servo.

const C = {
  board: '#0b0f17', edge: '#3b4660', silk: '#cbd5e1', dim: '#64748b',
  p0: '#22d3ee', p1: '#e879f9', p2: '#a3e635', v33: '#fb923c', gnd: '#94a3b8',
  red: '#ef4444', white: '#f8fafc', pwr: '#f59e0b', off: '#475569',
};

const S = 5, OX = 215, OY = 70;
const X = (mm) => OX + S * mm;
const Y = (mm) => OY + S * mm;

// header columns: [x mm, label, color or null]
const COLS = [
  [4.2, 'P0', C.p0], [6.8, 'P1', C.p1],
  [17.1, 'P2', C.p2], [19.7, 'P8', null],
  [29.7, 'P12', null], [32.3, 'P14', null],
  [42.7, 'P15', null], [45.3, 'P16', null],
];
const ROWS = [29.5, 32.0, 34.5];

function BoardMap() {
  const pin = (x, y, fill, k) => <circle key={k} cx={X(x)} cy={Y(y)} r={3.2} fill={fill} stroke="#0b0f17" strokeWidth={1} />;
  const lead = (x1, y1, x2, y2, col, k) => (
    <path key={k} d={`M${x1},${y1} L${x2},${y2}`} stroke={col} strokeWidth={2} fill="none" opacity={0.85} />
  );
  const label = (x, y, t1, t2, col, anchor = 'start') => (
    <g>
      <text x={x} y={y} fill={col} fontSize={13} fontWeight={700} textAnchor={anchor}>{t1}</text>
      {t2 && <text x={x} y={y + 15} fill="#cbd5e1" fontSize={11} textAnchor={anchor}>{t2}</text>}
    </g>
  );
  return (
    <svg viewBox="0 0 740 560" className="w-full h-auto" role="img" aria-label="Top view of the moto:bit showing where every wire plugs in">
      <text x={370} y={22} fill={C.silk} fontSize={13} fontWeight={700} textAnchor="middle">FRONT OF DUSTY</text>
      <text x={370} y={38} fill={C.dim} fontSize={11} textAnchor="middle">the micro:bit slides into this slot, LEDs up</text>

      {/* board outline: connector 0-17, neck 17-25, body 25-76 */}
      <path d={`M${X(0)},${Y(0)} H${X(60)} V${Y(17)} H${X(46.5)} V${Y(25)} H${X(60)} V${Y(76)} H${X(0)} V${Y(25)} H${X(13.5)} V${Y(17)} H${X(0)} Z`}
        fill={C.board} stroke={C.edge} strokeWidth={2} />
      <rect x={X(0.5)} y={Y(1)} width={S * 59} height={S * 11} rx={3} fill="#1f2937" stroke={C.edge} />
      <text x={X(30)} y={Y(7.5)} fill={C.dim} fontSize={11} textAnchor="middle">micro:bit edge connector</text>
      {[19.5, 40.5].map((x) => <circle key={x} cx={X(x)} cy={Y(21.5)} r={6} fill="none" stroke={C.dim} />)}
      {[9.3, 50.7].map((x) => <circle key={x} cx={X(x)} cy={Y(71.5)} r={6} fill="none" stroke={C.dim} />)}

      {/* sensor + servo headers */}
      {[[5.5, 'SENSOR'], [18.4, 'SENSOR'], [31, 'SENSOR'], [44, 'SERVO']].map(([cx, t]) => (
        <g key={cx}>
          <rect x={X(cx - 3)} y={Y(27.8)} width={S * 6} height={S * 8.4} rx={2} fill="#111827" stroke={C.edge} />
          <text x={X(cx)} y={Y(38.4)} fill={C.dim} fontSize={8} textAnchor="middle">{t}</text>
        </g>
      ))}
      {COLS.map(([x, t, col], i) => (
        <g key={t}>
          <text x={X(x) + (i % 2 ? 1 : -1)} y={Y(26.6)} fill={col || C.dim} fontSize={9} fontWeight={700} textAnchor={i % 2 ? 'start' : 'end'}>{t}</text>
          {ROWS.map((y, i) => pin(x, y, col ? [col, C.v33, C.gnd][i] : C.off, `${t}${i}`))}
        </g>
      ))}
      {/* I2C header */}
      <rect x={X(52.5)} y={Y(27.5)} width={S * 3.5} height={S * 10.5} rx={2} fill="#111827" stroke={C.edge} />
      {[29, 31.5, 34, 36.5].map((y) => pin(54.2, y, C.off, `i2c${y}`))}
      <text x={X(54.2)} y={Y(39.6)} fill={C.dim} fontSize={9} textAnchor="middle">I2C</text>

      {/* motor ports */}
      <rect x={X(12)} y={Y(40.8)} width={S * 10} height={S * 4.6} rx={2} fill="#111827" stroke={C.edge} />
      <rect x={X(38)} y={Y(40.8)} width={S * 10} height={S * 4.6} rx={2} fill="#111827" stroke={C.edge} />
      {pin(23.5, 42, C.white, 'lm1')}{pin(23.5, 44.3, C.red, 'lm2')}
      {pin(36.5, 42, C.red, 'rm1')}{pin(36.5, 44.3, C.white, 'rm2')}
      <text x={X(17)} y={Y(49)} fill={C.silk} fontSize={9} textAnchor="middle">LEFT MOTOR</text>
      <text x={X(43)} y={Y(49)} fill={C.silk} fontSize={9} textAnchor="middle">RIGHT MOTOR</text>
      <text x={X(24.6)} y={Y(42.6)} fill={C.dim} fontSize={7}>BLACK</text>
      <text x={X(24.6)} y={Y(44.9)} fill={C.dim} fontSize={7}>RED</text>
      <text x={X(35.4)} y={Y(42.6)} fill={C.dim} fontSize={7} textAnchor="end">RED</text>
      <text x={X(35.4)} y={Y(44.9)} fill={C.dim} fontSize={7} textAnchor="end">BLACK</text>

      {/* barrel jack, qwiic, run/stop */}
      <rect x={X(-3.5)} y={Y(54.5)} width={S * 17.5} height={S * 10.5} rx={3} fill="#1f2937" stroke={C.pwr} strokeWidth={1.5} />
      <circle cx={X(-1)} cy={Y(59.7)} r={4} fill="#0b0f17" stroke={C.pwr} />
      <text x={X(6)} y={Y(51.5)} fill={C.dim} fontSize={8} textAnchor="middle">3 - 11 V</text>
      <rect x={X(55)} y={Y(50)} width={S * 5} height={S * 8} rx={2} fill="#1f2937" stroke={C.edge} />
      <text x={X(52)} y={Y(62)} fill={C.dim} fontSize={8} textAnchor="middle">Qwiic</text>
      <rect x={X(24)} y={Y(65.5)} width={S * 12} height={S * 5} rx={2} fill="#1f2937" stroke={C.silk} />
      <rect x={X(30.5)} y={Y(66.3)} width={S * 5} height={S * 3.4} rx={1} fill={C.silk} />
      <text x={X(22)} y={Y(69)} fill={C.silk} fontSize={9} textAnchor="end">STOP</text>
      <text x={X(38)} y={Y(69)} fill={C.silk} fontSize={9}>RUN</text>

      {/* callouts, left */}
      {lead(200, 145, X(4.2), Y(29.5), C.p0, 'a')}
      {label(10, 140, 'Left cliff sensor', 'P0 column, 3 wires', C.p0)}
      {lead(200, 250, X(17.1), Y(29.5), C.p2, 'b')}
      {label(10, 245, 'Whisker switch', 'P2 column, 2 wires', C.p2)}
      {lead(200, 300, X(23.5), Y(43.1), C.white, 'c')}
      {label(10, 295, 'Left motor', 'red + white wires', C.white)}
      {lead(200, 400, X(-3.5), Y(59.7), C.pwr, 'd')}
      {label(10, 395, 'Power in', 'L-shaped plug', C.pwr)}
      {/* callouts, right */}
      {lead(540, 145, X(6.8), Y(29.5), C.p1, 'e')}
      {label(548, 140, 'Right cliff sensor', 'P1 column, 3 wires', C.p1)}
      {lead(540, 300, X(36.5), Y(43.1), C.white, 'f')}
      {label(548, 295, 'Right motor', 'red + white wires', C.white)}
      {lead(540, 440, X(36), Y(68), C.silk, 'g')}
      {label(548, 435, 'Motor switch', 'RUN to drive', C.silk)}
      {label(548, 215, 'Not used', 'P8 P12 P14, servo,', C.off)}
      <text x={548} y={245} fill="#cbd5e1" fontSize={11}>I2C, Qwiic</text>

      <text x={370} y={Y(76) + 26} fill={C.silk} fontSize={13} fontWeight={700} textAnchor="middle">BACK OF DUSTY</text>
      <text x={370} y={Y(76) + 42} fill={C.dim} fontSize={11} textAnchor="middle">stand behind Dusty and look down: the board reads the right way up</text>
    </svg>
  );
}

function HeaderZoom() {
  const cols = [
    ['P0', 'Left cliff sensor', C.p0, ['OUT', 'VIN', 'GND']],
    ['P1', 'Right cliff sensor', C.p1, ['OUT', 'VIN', 'GND']],
    ['P2', 'Whisker', C.p2, ['NO', null, 'C']],
    ['P8', 'empty', null, [null, null, null]],
  ];
  const rows = [['SIGNAL', 'top row, toward the front'], ['3V3', 'middle row'], ['GND', 'bottom row, toward the back']];
  const rowCol = [null, C.v33, C.gnd];
  return (
    <svg viewBox="0 0 740 250" className="w-full h-auto" role="img" aria-label="Close-up of the first two sensor headers">
      {rows.map(([t, s], i) => (
        <g key={t}>
          <text x={10} y={78 + i * 55} fill={i ? rowCol[i] : C.silk} fontSize={14} fontWeight={700}>{t}</text>
          <text x={10} y={94 + i * 55} fill={C.dim} fontSize={10}>{s}</text>
        </g>
      ))}
      {[0, 1].map((h) => <rect key={h} x={190 + h * 270} y={40} width={220} height={175} rx={8} fill="#111827" stroke={C.edge} />)}
      {cols.map(([p, who, col, ends], i) => {
        const x = 245 + (i % 2) * 110 + Math.floor(i / 2) * 270;
        return (
          <g key={p}>
            <text x={x} y={30} fill={col || C.off} fontSize={14} fontWeight={700} textAnchor="middle">{p}</text>
            {[0, 1, 2].map((r) => {
              const y = 72 + r * 55;
              const fill = !col ? C.off : r === 0 ? col : rowCol[r];
              return (
                <g key={r}>
                  <rect x={x - 9} y={y - 9} width={18} height={18} rx={2} fill={fill} opacity={ends[r] || !col ? 1 : 0.35} />
                  {ends[r] && <text x={x + 16} y={y + 5} fill={C.silk} fontSize={12} fontWeight={700}>{ends[r]}</text>}
                </g>
              );
            })}
            <text x={x} y={240} fill={col ? '#cbd5e1' : C.dim} fontSize={11} textAnchor="middle">{who}</text>
          </g>
        );
      })}
    </svg>
  );
}

const CHAIN = [
  ['Power bank', 'USB-A port, left side'],
  ['90° USB adapter', 'points the cable forward'],
  ['USB to barrel cable', 'Adafruit 2697'],
  ['In-line switch', 'MAIN power, everything'],
  ['Y splitter', 'one plug in, two out'],
];

// [what, from, to, how, step]
export const WIRES = [
  ['Main power', 'Power bank USB-A', 'USB to barrel cable', 'Through the 90° adapter, cable pointing forward', 4],
  ['Main power', 'Barrel cable plug', 'In-line switch, in', 'Round plug into round socket', 4],
  ['Main power', 'In-line switch, out', 'Y splitter, in', 'Round plug into round socket', 4],
  ['Board power', 'Y splitter, end A', 'L-shaped plug adapter', 'Round plug into round socket', 4],
  ['Board power', 'L-shaped plug adapter', 'moto:bit barrel jack', 'Left side of the board, near the back. Cable turned forward along the deck edge', 4],
  ['Brain', 'micro:bit', 'moto:bit edge connector', 'LEDs and buttons up, gold stripes in', 4],
  ['Left wheel', 'Left motor red', 'LEFT MOTOR, hole marked RED', 'Needs a metal pin on the wire end', 5],
  ['Left wheel', 'Left motor white', 'LEFT MOTOR, hole marked BLACK', 'White goes where the board says black', 5],
  ['Right wheel', 'Right motor red', 'RIGHT MOTOR, hole marked RED', 'Needs a metal pin on the wire end', 5],
  ['Right wheel', 'Right motor white', 'RIGHT MOTOR, hole marked BLACK', 'White goes where the board says black', 5],
  ['Not connected', 'Motor blue, black, yellow, green', 'Nothing', 'Fold back and tape. Turn counter, not used yet', 5],
  ['Left sensor', 'QTR OUT', 'P0 column, top pin', 'Female jumper', 6],
  ['Left sensor', 'QTR VIN', 'P0 column, middle pin (3V3)', 'Female jumper', 6],
  ['Left sensor', 'QTR GND', 'P0 column, bottom pin (GND)', 'Female jumper', 6],
  ['Right sensor', 'QTR OUT', 'P1 column, top pin', 'Female jumper', 6],
  ['Right sensor', 'QTR VIN', 'P1 column, middle pin (3V3)', 'Female jumper', 6],
  ['Right sensor', 'QTR GND', 'P1 column, bottom pin (GND)', 'Female jumper', 6],
  ['Whisker', 'Switch NO', 'P2 column, top pin', 'Soldered, female end on the pin', 8],
  ['Whisker', 'Switch C', 'P2 column, bottom pin (GND)', 'Soldered, female end on the pin', 8],
  ['Whisker', 'Switch NC', 'Nothing', 'Leave it bare', 8],
  ['Brush power', 'Y splitter, end B', 'Screw-terminal jack', 'Round plug into round socket', 9],
  ['Brush power', 'Jack + terminal', 'Rocker switch, one tab', 'Grown-up wires it', 9],
  ['Brush power', 'Rocker switch, other tab', 'Brush motor, one tab', 'Grown-up wires it', 9],
  ['Brush power', 'Jack − terminal', 'Brush motor, other tab', 'Swap the two motor tabs if it spins the wrong way', 9],
];

const SWITCHES = [
  ['In-line switch', 'On the cable, taped to the deck edge', 'Everything: brain, wheels and brush'],
  ['STOP / RUN MOTORS', 'Back edge of the moto:bit', 'Only the two wheels. Brain stays on so you can test sensors with Dusty sitting still'],
  ['Rocker switch', 'Back of the brush motor mount', 'Only the brush'],
];

const CODE_PINS = [
  ['P0', 'analog read pin P0', 'Left cliff sensor. Big number means no table under it'],
  ['P1', 'analog read pin P1', 'Right cliff sensor'],
  ['P2', 'digital read pin P2, with set pull pin P2 to up in on start', 'Whisker. 0 means the wheel is on the table. 1 means stop'],
  ['Motors', 'moto:bit blocks: set LEFT / RIGHT motor', 'The micro:bit talks to the motor chip over two hidden wires (P19, P20). Nothing to plug in'],
];

const RULES = [
  ['Power off before touching any wire.', 'Main in-line switch off, every time.'],
  ['Sensors get 3V3, never VCC.', 'The servo header’s middle row is VCC, the full power bank voltage. A sensor wired there sends 5 volts back into a micro:bit pin and can kill it. Stay on the three SENSOR headers.'],
  ['Top row is the signal, bottom row is ground.', 'Every column on the SENSOR headers is the same: signal at the top (toward the front), 3V3 in the middle, GND at the bottom.'],
  ['Use a color for each job.', 'Orange or red jumper for 3V3, black or gray for GND, a bright color for the signal. Then a wrong wire is easy to spot.'],
  ['Black is not a motor wire on the N20.', 'Only red and white go to the motor sockets. The other four stay taped.'],
  ['Sounds can scramble the left sensor.', 'In MakeCode the micro:bit also sends sound out of pin P0. If Dusty ever plays sounds, the left sensor reading will jump around. Keep sound blocks out of the cliff program.'],
  ['A loose whisker wire stops Dusty.', 'On purpose. If a whisker wire falls off, P2 reads 1 and Dusty stops, the safe way to fail.'],
];

export function WiringMap() {
  const box = 'bg-naw-card rounded-2xl border border-white/10';
  return (
    <>
      <p className="text-white/60 text-sm mt-2">
        Every wire on Dusty, where it starts and where it plugs in. Stand behind Dusty and look down: the moto:bit in the
        picture is turned the same way as the real one.
      </p>

      <div className={`mt-4 ${box} p-3 sm:p-5`}>
        <h3 className="text-white font-bold">The moto:bit, every connection</h3>
        <div className="mt-3 rounded-xl bg-[#0d1426] p-2"><BoardMap /></div>
      </div>

      <div className={`mt-4 ${box} p-3 sm:p-5`}>
        <h3 className="text-white font-bold">The sensor pins, up close</h3>
        <p className="text-white/55 text-xs mt-1">
          Each SENSOR header is two columns of three pins. Each column belongs to one micro:bit pin.
        </p>
        <div className="mt-3 rounded-xl bg-[#0d1426] p-2"><HeaderZoom /></div>
      </div>

      <div className={`mt-4 ${box} p-5`}>
        <h3 className="text-white font-bold">Where the power goes</h3>
        <div className="mt-3 flex flex-wrap items-stretch gap-2 text-sm">
          {CHAIN.map(([t, s], i) => (
            <div key={t} className="flex items-center gap-2">
              <div className="rounded-xl border border-naw-orange/40 bg-naw-orange/10 px-3 py-2">
                <div className="text-white font-semibold">{t}</div>
                <div className="text-white/50 text-xs">{s}</div>
              </div>
              {i < CHAIN.length - 1 && <span className="text-naw-orange font-bold">→</span>}
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-naw-orange font-bold text-xs uppercase tracking-wide">Splitter end A</div>
            <div className="text-white mt-1">L-shaped plug adapter → moto:bit barrel jack</div>
            <div className="text-white/55 text-xs mt-1">Powers the micro:bit, the sensors, the whisker and both wheel motors. The L turns the cable forward along the deck edge so it does not stick out past the wheels.</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-naw-orange font-bold text-xs uppercase tracking-wide">Splitter end B</div>
            <div className="text-white mt-1">Screw-terminal jack → rocker switch → brush motor</div>
            <div className="text-white/55 text-xs mt-1">The brush never goes through the moto:bit. It only needs on or off.</div>
          </div>
        </div>
      </div>

      <div className={`mt-4 ${box} overflow-x-auto`}>
        <h3 className="text-white font-bold px-4 pt-4">Every wire</h3>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-white/45 text-xs text-left">
              <th className="px-4 py-2 font-semibold">Job</th>
              <th className="px-4 py-2 font-semibold">From</th>
              <th className="px-4 py-2 font-semibold">To</th>
              <th className="px-4 py-2 font-semibold">Notes</th>
              <th className="px-4 py-2 font-semibold">Step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {WIRES.map(([job, from, to, how, st], i) => (
              <tr key={i}>
                <td className="px-4 py-2 text-white whitespace-nowrap">{job}</td>
                <td className="px-4 py-2">{from}</td>
                <td className="px-4 py-2">{to}</td>
                <td className="px-4 py-2 text-white/55">{how}</td>
                <td className="px-4 py-2"><a href={`#step-${st}`} className="text-naw-orange font-semibold">{st}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <div className={`${box} p-5`}>
          <h3 className="text-white font-bold">Three switches</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {SWITCHES.map(([n, w, what]) => (
              <li key={n}><span className="text-white font-semibold">{n}</span> <span className="text-white/45">({w})</span> <span className="text-white/65">turns off: {what}.</span></li>
            ))}
          </ul>
        </div>
        <div className={`${box} p-5`}>
          <h3 className="text-white font-bold">Which pin the code reads</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {CODE_PINS.map(([p, blk, what]) => (
              <li key={p}><span className="text-naw-cyan font-bold font-mono">{p}</span> <span className="text-white/80 font-mono text-xs">{blk}</span> <span className="text-white/60">· {what}.</span></li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 p-5">
        <h3 className="text-white font-bold">Wiring rules</h3>
        <ul className="mt-2 space-y-2">
          {RULES.map(([b, t]) => (
            <li key={b} className="text-sm"><span className="text-white font-semibold">{b}</span> <span className="text-white/65">{t}</span></li>
          ))}
        </ul>
      </section>
    </>
  );
}

'use client';

// Original SVG art for House Flipper. A house shows its damage per room and brightens as rooms get fixed.

function isBad(house, key, fixed) {
  if (!house?.rooms) return false;
  if (fixed === 'all' || fixed?.[key]) return false;
  return house.rooms[key] && house.rooms[key] !== 'good';
}

export function HouseSVG({ house, fixed = {}, className = '', width = 260, ground = true }) {
  const h = house || { color: '#fcd34d', roofColor: '#7c2d12', rooms: {} };
  const two = !!h.twoStory;
  const roofBad = isBad(h, 'roof', fixed);
  const outBad = isBad(h, 'outside', fixed);
  const winBad = isBad(h, 'living', fixed) || isBad(h, 'bedrooms', fixed);
  const fndBad = isBad(h, 'foundation', fixed);
  const sysBad = isBad(h, 'systems', fixed);
  const kitBad = isBad(h, 'kitchen', fixed);
  const bathBad = isBad(h, 'bath', fixed);
  const anyBad = roofBad || outBad || winBad || fndBad || sysBad || kitBad || bathBad;
  const allFixed = fixed === 'all' || (!anyBad && Object.values(h.rooms || {}).some((v) => v !== 'good'));
  const wallTop = two ? 70 : 110;
  const body = outBad ? '#d6cfc4' : h.color;
  return (
    <svg viewBox="0 0 300 250" width={width} className={className} role="img" aria-label="A house">
      {ground && <ellipse cx="150" cy="232" rx="140" ry="14" fill={outBad ? '#a3a36a' : '#4ade80'} />}
      {/* yard */}
      {outBad ? (
        <g fill="#65a30d">
          {[30, 48, 250, 268, 60, 238].map((x, i) => <path key={i} d={`M${x} 232 l-6 -26 l6 10 l4 -22 l3 20 l6 -16 l-3 34z`} />)}
        </g>
      ) : (
        <g>
          {[40, 260].map((x) => <g key={x}><circle cx={x} cy="214" r="15" fill="#22c55e" /><circle cx={x - 6} cy="210" r="3" fill="#f472b6" /><circle cx={x + 5} cy="216" r="3" fill="#facc15" /></g>)}
        </g>
      )}
      {/* AC unit */}
      <g transform="translate(232 190)">
        <rect width="30" height="26" rx="3" fill={sysBad ? '#78716c' : '#e2e8f0'} stroke="#475569" strokeWidth="2" />
        <circle cx="15" cy="13" r="8" fill="none" stroke="#475569" strokeWidth="2" />
        {sysBad && <path d="M4 4 L26 22 M26 4 L4 22" stroke="#b91c1c" strokeWidth="2.5" />}
      </g>
      {/* walls */}
      <rect x="55" y={wallTop} width="180" height={226 - wallTop} fill={body} stroke="#334155" strokeWidth="3" />
      {outBad && <g fill="#fff" opacity=".55">
        <path d={`M70 ${wallTop + 30} q10 8 4 18 q-8 -4 -4 -18z`} /><path d="M200 170 q12 6 6 18 q-10 -6 -6 -18z" /><path d={`M150 ${wallTop + 12} q8 10 0 16 q-6 -8 0 -16z`} />
      </g>}
      {two && <line x1="55" y1="148" x2="235" y2="148" stroke="#334155" strokeWidth="2" opacity=".35" />}
      {/* roof */}
      <polygon points={`40,${wallTop + 2} 145,${wallTop - 62} 250,${wallTop + 2}`} fill={roofBad ? '#57534e' : h.roofColor} stroke="#1f2937" strokeWidth="3" />
      {roofBad && <g>
        <rect x="110" y={wallTop - 30} width="22" height="14" fill="#1c1917" transform={`rotate(-30 121 ${wallTop - 23})`} />
        <rect x="170" y={wallTop - 22} width="40" height="16" fill="#3b82f6" opacity=".85" transform={`rotate(31 190 ${wallTop - 14})`} />
      </g>}
      {/* chimney */}
      <rect x="190" y={wallTop - 50} width="18" height="30" fill="#b45309" stroke="#1f2937" strokeWidth="2" />
      {/* windows */}
      {(two ? [[78, 90], [190, 90], [78, 165], [190, 165]] : [[78, 140], [190, 140]]).map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="34" height="32" fill={winBad ? '#94a3b8' : '#bae6fd'} stroke="#334155" strokeWidth="3" />
          <line x1={x + 17} y1={y} x2={x + 17} y2={y + 32} stroke="#334155" strokeWidth="2" />
          <line x1={x} y1={y + 16} x2={x + 34} y2={y + 16} stroke="#334155" strokeWidth="2" />
          {winBad && (i % 2 === 0
            ? <path d={`M${x + 3} ${y + 4} l10 9 l-4 6 l12 9`} stroke="#0f172a" strokeWidth="1.5" fill="none" />
            : <g><rect x={x - 3} y={y + 8} width="40" height="7" fill="#a16207" transform={`rotate(-12 ${x + 17} ${y + 12})`} /><rect x={x - 3} y={y + 18} width="40" height="7" fill="#a16207" transform={`rotate(10 ${x + 17} ${y + 22})`} /></g>)}
          {!winBad && <rect x={x + 3} y={y + 3} width="8" height="5" fill="#fff" opacity=".7" />}
        </g>
      ))}
      {/* door */}
      <rect x="128" y="168" width="34" height="58" rx="3" fill={outBad ? '#78716c' : '#be123c'} stroke="#334155" strokeWidth="3" />
      <circle cx="155" cy="198" r="3" fill="#facc15" />
      {/* kitchen / bath drip hints */}
      {(kitBad || bathBad) && <g fill="#38bdf8"><path d="M118 205 q4 8 0 12 q-4 -4 0 -12z" /><path d="M170 212 q4 8 0 12 q-4 -4 0 -12z" /></g>}
      {/* foundation */}
      <rect x="50" y="222" width="190" height="8" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
      {fndBad && <path d="M95 222 l6 4 l-4 3 l7 4 M205 222 l-5 5 l6 2" stroke="#0f172a" strokeWidth="2.5" fill="none" />}
      {/* sparkles when fully fixed */}
      {allFixed && <g fill="#fde047">
        {[[40, 60], [270, 80], [150, 20], [255, 180], [30, 160]].map(([x, y], i) => (
          <path key={i} className="hf-bob" style={{ animationDelay: `${i * 0.3}s` }} d={`M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 3}z`} />
        ))}
      </g>}
    </svg>
  );
}

export function FoxSVG({ size = 72, mood = 'happy', className = '' }) {
  const asleep = mood === 'asleep';
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-label="Flip the Fox">
      {/* ears */}
      <polygon points="22,46 30,8 52,34" fill="#ea580c" stroke="#7c2d12" strokeWidth="3" />
      <polygon points="98,46 90,8 68,34" fill="#ea580c" stroke="#7c2d12" strokeWidth="3" />
      <polygon points="30,38 32,18 44,32" fill="#fed7aa" />
      <polygon points="90,38 88,18 76,32" fill="#fed7aa" />
      {/* head */}
      <path d="M14 58 Q20 30 60 30 Q100 30 106 58 Q104 92 60 108 Q16 92 14 58z" fill="#f97316" stroke="#7c2d12" strokeWidth="3" />
      {/* cheeks / muzzle */}
      <path d="M30 70 Q44 64 60 82 Q76 64 90 70 Q86 98 60 104 Q34 98 30 70z" fill="#fff7ed" />
      {/* hard hat */}
      <path d="M28 40 Q30 14 60 12 Q90 14 92 40z" fill="#facc15" stroke="#854d0e" strokeWidth="3" />
      <rect x="20" y="38" width="80" height="8" rx="4" fill="#eab308" stroke="#854d0e" strokeWidth="3" />
      <rect x="56" y="14" width="8" height="24" rx="3" fill="#fde047" />
      {/* eyes */}
      {asleep ? (
        <g stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round"><path d="M38 60 q6 5 12 0" /><path d="M70 60 q6 5 12 0" /></g>
      ) : (
        <g>
          <ellipse cx="44" cy="60" rx="6" ry={mood === 'wow' ? 8 : 7} fill="#1f2937" />
          <ellipse cx="76" cy="60" rx="6" ry={mood === 'wow' ? 8 : 7} fill="#1f2937" />
          <circle cx="46" cy="57" r="2" fill="#fff" /><circle cx="78" cy="57" r="2" fill="#fff" />
        </g>
      )}
      {/* nose + mouth */}
      <ellipse cx="60" cy="80" rx="6" ry="4.5" fill="#1f2937" />
      {mood === 'wow' ? <ellipse cx="60" cy="92" rx="5" ry="6" fill="#7f1d1d" />
        : asleep ? <path d="M54 92 q6 3 12 0" stroke="#1f2937" strokeWidth="2.5" fill="none" />
        : <path d="M50 88 q10 10 20 0" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {asleep && <g fill="#64748b" fontWeight="900" fontFamily="sans-serif"><text x="92" y="26" fontSize="14">z</text><text x="102" y="14" fontSize="10">z</text></g>}
    </svg>
  );
}

// Simple cartoon map of Fox Hollow.
export function TownMap({ neighborhoods, selected, onSelect, pins = [], onPin, activePin }) {
  return (
    <svg viewBox="0 0 100 80" className="w-full rounded-3xl" style={{ background: '#bbf7d0' }}>
      <path d="M0 48 Q30 40 50 50 T100 44" stroke="#60a5fa" strokeWidth="5" fill="none" opacity=".7" />
      <path d="M8 0 L30 80 M0 30 L100 22 M60 0 L56 80" stroke="#fef3c7" strokeWidth="2.6" fill="none" />
      {Object.values(neighborhoods).map((n) => (
        <g key={n.key} onClick={() => onSelect?.(n.key)} style={{ cursor: 'pointer' }}>
          <circle cx={n.x} cy={n.y} r={selected === n.key ? 13 : 11} fill={n.color} opacity={selected === n.key ? 0.55 : 0.35} stroke={selected === n.key ? '#0f172a' : 'none'} strokeWidth=".6" />
          <text x={n.x} y={n.y - 12.5} textAnchor="middle" fontSize="3.4" fontWeight="900" fill="#0f172a">{n.name}</text>
        </g>
      ))}
      {pins.map((p) => (
        <g key={p.id} onClick={() => onPin?.(p)} style={{ cursor: 'pointer' }} className="hf-drop">
          <path d={`M${p.x} ${p.y} l-2.4 -4.6 a2.8 2.8 0 1 1 4.8 0 z`} fill={activePin === p.id ? '#dc2626' : p.saved ? '#f59e0b' : '#1e293b'} stroke="#fff" strokeWidth=".5" />
        </g>
      ))}
    </svg>
  );
}

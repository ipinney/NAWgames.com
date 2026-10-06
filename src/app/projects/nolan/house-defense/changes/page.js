import { Nav, Hero, Section, meta, BASE } from '../ui';

export const metadata = meta(
  'Night Watch NW-1: changes and log',
  'Every decision, change order, fix and test result for House Defense, newest first.',
  `${BASE}/changes`
);

// Newest first. One line for every decision, change, fix or test result, the day it happens.
const LOG = [
  ['Oct 6', 'Decision', 'D15: the turret is named Night Watch NW-1.'],
  ['Oct 6', 'Decision', 'Design walk-through D1 to D14: all three animals; Pi 5 with AI camera and IR flood; Surge XL launcher; stepper aim; solar and battery power; printed housing; mounted high aiming down; software tilt limit; armed dusk to dawn with a key switch; phone FIRE page; automatic after 10 correct shots and zero wrong (R8); 14 nights before vs 14 after; $800 budget; film and class presentation. Name decided next (D15).'],
  ['Oct 6', 'Decision', 'D8: version 1 is manual fire. The turret spots and aims, a person presses fire. Going automatic is a future change order with a pass mark from the clips (rule R8).'],
  ['Oct 6', 'Decision', 'Payload: gel balls. Range: 20 to 25 feet from the turret to the crossing spot (rule R7).'],
  ['Oct 6', 'Decision', 'D5: the defense is a turret that fires a non-lethal stinging projectile. Rules R1 and R3 rewritten to match: sting but never injure, and the turret can never aim at a person.'],
  ['Oct 6', 'Decision', 'No survey needed: the house cameras already show the animals coming over. Footage becomes the before count.'],
  ['Oct 6', 'Plan', 'Draft rules R1 to R6 and design choices D1 to D7 written. Waiting for a yes at G0.'],
  ['Oct 6', 'Plan', 'Gates set: G0 Scope (now to Feb), G1 Design lock, G2 Order, G3 Build, G4 Field test, G5 Show. Build starts spring 2027.'],
  ['Oct 6', 'Decision', 'New project: defend the house against raccoons, rats and opossums. No school packet; we write our own brief.'],
];

// Change orders start at G1. Format: [number, date, title, status]
const MOCS = [];

const BADGE = {
  Decision: 'bg-naw-cyan/20 text-naw-cyan',
  Change: 'bg-naw-orange/20 text-naw-orange',
  Fix: 'bg-red-500/20 text-red-300',
  Plan: 'bg-white/10 text-white/70',
  Test: 'bg-green-500/20 text-green-300',
};

export default function ChangesPage() {
  return (
    <div className="min-h-screen">
      <Nav current="changes" />
      <Hero tag="Changes and log" title="THE LOG">
        <p className="text-white/70 mt-4">One line for everything that changes the plan, the day it happens.</p>
      </Hero>
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="Change orders" sub="These start after the design is locked at G1.">
          {MOCS.length === 0 ? (
            <div className="bg-naw-card rounded-xl border border-white/10 p-4 text-white/50 text-sm">None yet. The design is not locked.</div>
          ) : (
            <div className="space-y-2">
              {MOCS.map(([n, d, t, s]) => (
                <div key={n} className="bg-naw-card rounded-xl border border-white/10 p-4 text-sm text-white">
                  <b>{n}</b> <span className="text-white/40">{d}</span> {t} <span className="text-naw-orange">{s}</span>
                </div>
              ))}
            </div>
          )}
        </Section>
        <Section title="History">
          <div className="space-y-2">
            {LOG.map(([d, type, text], i) => (
              <div key={i} className="bg-naw-card rounded-xl border border-white/10 p-4 flex gap-3 items-start">
                <span className="text-white/40 text-xs w-12 shrink-0 pt-0.5">{d}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${BADGE[type]}`}>{type}</span>
                <span className="text-white/80 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

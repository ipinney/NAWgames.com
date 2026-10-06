import Link from 'next/link';
import { Nav, Hero, Section, Cards, meta, BASE } from './ui';

export const metadata = meta(
  "House Defense: Nolan's project",
  'Keeping raccoons, rats and opossums away from our house without hurting them. Our own project: we write the brief, set the gates and run every change through a change order.',
  BASE
);

// Gate, when, what gets done, pass mark to move on
const GATES = [
  ['G0 Scope', 'Now to Feb', 'Find out which animals come, where, when and what they want. Write the brief and the rules.', 'One-page brief with numbered rules, each with a reason. Dad says yes.'],
  ['G1 Design lock', 'Feb to Mar', 'Pick how we sense and how we scare. 3D model, parts list, budget, safety check.', 'Every part fits in the model, every link is checked, every rule has a test.'],
  ['G2 Order', 'Mar', 'One order per store. Check every part in when it arrives.', 'Everything on the list is in the bin and matches.'],
  ['G3 Build', 'Mar to Apr', 'Small test piece first, then build in batches, each with its own test.', 'Each batch passes its test before the next one starts.'],
  ['G4 Field test', 'Apr to May', 'Count visits on normal nights, then on defended nights.', 'Fewer visits, written down night by night, nobody hurt.'],
  ['G5 Show', 'May', 'Film it and explain it to family and his class.', 'Nolan explains every wire and every line.'],
];

// Draft rules. Each needs a yes from Dad at G0.
const RULES = [
  ['R1 Sting, never injure', 'A sting teaches them our yard is a bad place, the way wildlife officers chase off coyotes with paintballs. No poison, glue, shock, spikes or anything that breaks skin. Poison also hurts pets and the animals that eat a poisoned rat.'],
  ['R2 Low voltage outside', 'Water and wall power do not mix. Batteries or USB power only, nothing plugged into the wall near the yard.'],
  ['R3 It can never aim at a person', 'Animals are on the ground; faces are not. The turret physically cannot tilt above ground level, cannot point over the fence, and only fires when it is sure the target is a raccoon, opossum or rat. A key switch turns it off.'],
  ['R4 Follow the wildlife rules', 'Texas has rules about trapping and moving wild animals. A grown-up checks them before anything that catches an animal.'],
  ['R5 Explain every wire and line', 'Same as Dusty: if you cannot explain it, it is not done.'],
  ['R7 Hits at 20 to 25 feet', 'That is the distance from where the turret sits to where they come over. It must hit a raccoon-sized target there, tested on a cardboard target first.'],
  ['R8 Earn automatic', 'It fires on its own only after a run of manual nights where every clip shows it picked the right target. The number goes in the change order.'],
  ['R6 Measure, do not guess', 'Count visits before we build so we can prove it worked.'],
];

// The design choices we walk through at G0. Status changes as each one is decided.
const CHOICES = [
  ['D1 Which animal first?', 'Raccoons, opossums and rats act differently. Rats come in through small holes and need sealing, not scaring. Pick one target for version 1.', 'Open'],
  ['D2 Where are they?', 'Our outdoor cameras already show them coming over. Mark each crossing spot on a map of the yard.', 'Cameras'],
  ['D3 What are they after?', 'Food, water, shelter. Taking away the reason they come is the first defense.', 'Open'],
  ['D4 How do we know one is there?', 'Motion sensor, night camera, or a camera that can tell a raccoon from a cat.', 'Open'],
  ['D5 How do we make it leave?', 'A turret that fires a stinging, non-lethal projectile. Gel balls: enough sting, no mess, least harm if something goes wrong. Paintball only by change order.', 'Gel balls'],
  ['D8 Who pulls the trigger?', 'Version 1: the turret finds and aims, a person presses fire. Automatic only by change order, after the clips prove it never mistakes a cat, dog or person.', 'Manual first'],
  ['D6 What is the brain?', 'micro:bit (we know it from Dusty) or a Raspberry Pi (camera and animal spotting).', 'Open'],
  ['D7 Power and weather', 'It lives outside: rain, heat, nights. Battery size and a box that keeps water out.', 'Open'],
];

const PAGES = [
  [`${BASE}/plan`, 'How we run it', 'The gates, the change order process, and the Dusty lessons turned into checklists.'],
  [`${BASE}/changes`, 'Changes and log', 'One line for every decision, change and fix, newest first.'],
];

export default function HouseDefensePage() {
  return (
    <div className="min-h-screen">
      <Nav current="overview" />
      <Hero tag="Our own project" title="HOUSE DEFENSE">
        <p className="text-white text-lg sm:text-xl font-semibold mt-4 leading-snug">
          Raccoons, rats and opossums keep visiting our house. We are building a turret that spots them and stings them with a non-lethal shot so they learn to stay away.
        </p>
        <div className="mt-5 rounded-2xl border border-naw-cyan/30 bg-naw-cyan/10 p-4">
          <div className="text-naw-cyan text-xs font-semibold">The big question</div>
          <div className="text-white font-semibold mt-1">Can a machine we build make animals choose to stay away, and can we prove it with numbers?</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-naw-orange/20 text-naw-orange font-semibold px-2 py-0.5 rounded-full">Now: G0 Scope</span>
          <span className="bg-white/10 text-white/70 font-semibold px-2 py-0.5 rounded-full">Build starts spring 2027</span>
        </div>
      </Hero>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <Section title="No packet, so we write our own" sub="Dusty had a school packet and due dates. This one does not. We set our own gates, and Dad signs off before we move to the next one.">
          <div className="space-y-3">
            {GATES.map(([g, when, what, pass], i) => (
              <div key={g} className={`bg-naw-card rounded-2xl border p-4 ${i === 0 ? 'border-naw-orange/50' : 'border-white/10'}`}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-white font-bold">{g}</span>
                  <span className="text-white/40 text-xs">{when}</span>
                </div>
                <div className="text-white/70 text-sm mt-1">{what}</div>
                <div className="text-naw-cyan text-sm mt-1"><b>Pass:</b> {pass}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Rules (draft)" sub="Every rule has a reason. These become locked at G0 when Dad says yes.">
          <Cards items={RULES} accent="orange" />
        </Section>

        <Section title="Design choices to make" sub="We decide these one at a time during scoping. Each decision goes in the log.">
          <div className="space-y-2">
            {CHOICES.map(([t, d, s]) => (
              <div key={t} className="bg-naw-card rounded-xl border border-white/10 p-4 flex gap-4 items-start">
                <div className="flex-1">
                  <div className="text-white font-bold">{t}</div>
                  <div className="text-white/60 text-sm mt-1">{d}</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60 whitespace-nowrap">{s}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Pages">
          <div className="grid sm:grid-cols-2 gap-3">
            {PAGES.map(([href, t, d]) => (
              <Link key={href} href={href} className="group bg-naw-card rounded-2xl border border-naw-cyan/20 p-5 hover:border-naw-cyan/40 transition-colors">
                <h3 className="text-white font-bold text-lg group-hover:text-naw-cyan transition-colors">{t}</h3>
                <p className="text-white/60 text-sm mt-1">{d}</p>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

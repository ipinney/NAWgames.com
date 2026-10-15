'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { NEIGHBORHOODS, COST_BOOK, MONEY, SOURCES, CONDITION, money } from '@/lib/flipper/calibration';

const ADMIN_UID = 'zy8WSqtL3GUuyw89u1X1ZzENULP2';

export default function Calibration() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.uid !== ADMIN_UID) return <div className="p-10 text-white">Private.</div>;
  const th = 'text-left px-3 py-2 text-xs uppercase tracking-wide text-white/50';
  const td = 'px-3 py-2 border-t border-white/10 tabular-nums';
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white/90 text-sm">
      <Link href="/projects/addie/house-flipper" className="text-white/50 font-bold">‹ House Flipper</Link>
      <h1 className="text-2xl font-bold text-white mt-2">Fox Hollow calibration</h1>
      <p className="text-white/60 mt-1 max-w-3xl">Fox Hollow is pretend. Every price band, cost and money rule below is set from Houston 2026 data so the skills carry over to Real Deals. Listings are generated from a seed: normal sellers price a fixer at fixed-up value minus repairs minus a 5 to 11 percent markdown (roughly break-even for a flipper); one or two per neighborhood are motivated sellers who will take a price near the 70 percent rule.</p>

      <h2 className="text-lg font-bold text-white mt-6 mb-2">Neighborhoods</h2>
      <div className="overflow-x-auto rounded-lg border border-white/10"><table className="w-full">
        <thead><tr><th className={th}>Name</th><th className={th}>Modeled on</th><th className={th}>Sq ft</th><th className={th}>Built</th><th className={th}>Fixed-up $/sq ft</th><th className={th}>Fixed-up value range</th></tr></thead>
        <tbody>{Object.values(NEIGHBORHOODS).map((n) => (
          <tr key={n.key}><td className={td}>{n.name}</td><td className={td}>{n.modeledOn}</td><td className={td}>{n.sqft[0]}-{n.sqft[1]}</td><td className={td}>{n.built[0]}-{n.built[1]}</td>
            <td className={td}>{money(n.fixedPsf[0])}-{money(n.fixedPsf[1])}</td><td className={td}>{money(n.fixedPsf[0] * n.sqft[0])} to {money(n.fixedPsf[1] * n.sqft[1])}</td></tr>
        ))}</tbody>
      </table></div>

      <h2 className="text-lg font-bold text-white mt-6 mb-2">Cost book (Houston, low / mid / high)</h2>
      <div className="overflow-x-auto rounded-lg border border-white/10"><table className="w-full">
        <thead><tr><th className={th}>Fix</th><th className={th}>Unit</th><th className={th}>Low</th><th className={th}>Mid</th><th className={th}>High</th></tr></thead>
        <tbody>{Object.values(COST_BOOK).map((c) => (
          <tr key={c.name}><td className={td}>{c.name}</td><td className={td}>{c.perSqft ? 'per sq ft' : 'each'}</td><td className={td}>{money(c.low)}</td><td className={td}>{money(c.mid)}</td><td className={td}>{money(c.high)}</td></tr>
        ))}</tbody>
      </table></div>

      <h2 className="text-lg font-bold text-white mt-6 mb-2">Money rules</h2>
      <div className="overflow-x-auto rounded-lg border border-white/10"><table className="w-full"><tbody>
        {[
          ['Town Bank rate', `${MONEY.bank.rate * 100}% per year, interest only`],
          ['Points', `${MONEY.bank.points * 100}% of the loan, paid at closing`],
          ['Loan limits', `${MONEY.bank.maxLoanToCost * 100}% of purchase + fix, and ${MONEY.bank.maxLoanToArv * 100}% of ARV, whichever is lower`],
          ['Closing costs to buy', `${MONEY.buyClosingPct * 100}% of price`],
          ['Selling costs', `${MONEY.sellCostPct * 100}% of sale price (agents 5%, seller costs 1%)`],
          ['Property tax', `${MONEY.taxPctYear * 100}% of price per year`],
          ['Insurance / utilities', `${money(MONEY.insuranceYear)} per year / ${money(MONEY.utilitiesMonth)} per month`],
          ['70% rule', 'Max offer = 70% of ARV minus fix cost'],
          ['Condition grades', Object.entries(CONDITION).map(([k, v]) => `${k} ${v.label} (${v.rooms[0]}-${v.rooms[1]} rooms need work)`).join('; ')],
        ].map(([k, v]) => <tr key={k}><td className={td + ' font-semibold w-56'}>{k}</td><td className={td}>{v}</td></tr>)}
      </tbody></table></div>

      <h2 className="text-lg font-bold text-white mt-6 mb-2">Sources</h2>
      <ul className="list-disc pl-5 space-y-1">{SOURCES.map((s) => <li key={s.url}><a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ul>
    </div>
  );
}

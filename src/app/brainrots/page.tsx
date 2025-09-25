import brainrots from "@/content/data/brainrots.json";
import mutations from "@/content/data/mutations.json";
import ImageWithFallback from "@/components/ImageWithFallback";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brainrots — Income per Second by Rarity & Mutation",
  description:
    "See Brainrots income per second at 10kg baseline and mutation multipliers. Larger weights scale income linearly.",
  alternates: { canonical: "/brainrots" }
};

export const dynamic = "force-static";

export default function BrainrotsPage() {
  return (
    <main className="px-5 py-8 mx-auto max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold">Brainrots — Income per Second</h1>
      <p className="mt-2 text-white/80">Income shown at 10 kg. For estimates: income ≈ base × mutation × (weight ÷ 10). Keep the larger, mutated ones.</p>

      <div className="overflow-x-auto mt-6 card">
        <div className="px-4 pt-3 text-sm text-white/70">All brainrots (income per second in $)</div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Rarity</th>
              <th className="py-2 pr-3">$/s (Normal)</th>
              <th className="py-2 pr-3">Gold</th>
              <th className="py-2 pr-3">Diamond</th>
              <th className="py-2 pr-3">Neon</th>
              <th className="py-2 pr-3">Frozen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {brainrots.map((b, i) => (
              <tr key={b.slug} className={i % 2 === 0 ? "bg-white/[.02]" : "bg-transparent"}>
                <td className="py-3 pr-3">
                  <div className="flex flex-col items-center gap-2 min-w-[180px]">
                    <ImageWithFallback
                      src={`/brainrots/${b.slug}.webp`}
                      alt={`${b.name} image`}
                      width={128}
                      height={128}
                      className="h-24 w-24 md:h-32 md:w-32 rounded-lg object-cover border border-white/10 shadow-sm"
                    />
                    <span className="text-sm font-medium text-white/90 text-center">{b.name}</span>
                  </div>
                </td>
                <td className="py-2 pr-3"><RarityPill rarity={b.rarity} /></td>
                <td className="py-2 pr-3">{b.basePerSec != null ? `$${b.basePerSec.toLocaleString()}` : "?"}</td>
                <td className="py-2 pr-3">{b.basePerSec != null ? `$${(b.basePerSec * (mutations.brainrotIncomeMultipliers.gold as number)).toLocaleString()}` : "?"}</td>
                <td className="py-2 pr-3">{b.basePerSec != null ? `$${(b.basePerSec * (mutations.brainrotIncomeMultipliers.diamond as number)).toLocaleString()}` : "?"}</td>
                <td className="py-2 pr-3">{b.basePerSec != null ? `$${(b.basePerSec * (mutations.brainrotIncomeMultipliers.neon as number)).toLocaleString()}` : "?"}</td>
                <td className="py-2 pr-3">{b.basePerSec != null ? `$${(b.basePerSec * (mutations.brainrotIncomeMultipliers.frozen as number)).toLocaleString()}` : "?"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">How to use this page</h2>
          <ol className="mt-3 list-decimal pl-5 text-sm text-white/80 space-y-1">
            <li>Identify best income targets per rarity for your current defenses.</li>
            <li>Prefer heavier and mutated versions; sell smaller duplicates.</li>
            <li>Use the Income tool to sum your total $/s and plan upgrades.</li>
          </ol>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">FAQ</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-medium">Does weight affect income?</dt>
              <dd className="text-white/80 mt-1">Yes, approximately proportional: income scales with (weight ÷ 10).</dd>
            </div>
            <div>
              <dt className="font-medium">Do mutations stack with weight?</dt>
              <dd className="text-white/80 mt-1">Yes. Apply mutation first, then scale by weight for final estimate.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Income strategy by rarity</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><strong>Rare</strong>: Fluri Flura (~$6/s) is a solid starter pick.</li>
            <li><strong>Epic</strong>: Lava Jato (~$30/s) anchors mid‑game; ensure lanes can capture reliably.</li>
            <li><strong>Legendary</strong>: Madung (~$45/s) is great ROI; a sweet spot before Mythics.</li>
            <li><strong>Mythic</strong>: Bombardiro/Bombini (~$180/s) are major boosts once defenses allow.</li>
            <li><strong>Godly</strong>: Matteo (~$600/s) is king income; typically needs Mythic‑tier plants.</li>
            <li><strong>Secret</strong>: Garamararam (~$2,100/s) is end‑game—prioritize high weight + good mutations.</li>
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">Progression notes</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <p className="font-medium">Early (&lt; $1k/s)</p>
              <p className="text-white/80">Target Epics once plants can secure captures. Mutated Epics can beat plain Legendaries.</p>
            </div>
            <div>
              <p className="font-medium">Mid ($1k–$10k/s)</p>
              <p className="text-white/80">Time Legendary hunts with the 100‑spawn pity. Upgrade plants for Mythic consistency.</p>
            </div>
            <div>
              <p className="font-medium">Late ($10k+/s)</p>
              <p className="text-white/80">Hunt Mythics with 500‑spawn pity. Build Mythic+ lanes to unlock Godly placements.</p>
            </div>
            <div>
              <p className="font-medium">End ($50k+/s)</p>
              <p className="text-white/80">Chase Secrets with perfect weight and strong mutations; sell smaller duplicates.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 card p-5">
        <h2 className="font-semibold">Rarity legend</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
          {(["Common","Rare","Epic","Legendary","Mythic","Godly","Secret"] as const).map((r) => (
            <li key={r} className="flex items-center gap-2">
              <RarityPill rarity={r} />
              <span className="text-white/80">{legendCopy[r]}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const legendCopy: Record<string, string> = {
  Common: "Baseline spawns; low $/s, good only very early.",
  Rare: "Starter income; keep only high‑weight or mutated rolls.",
  Epic: "Core mid‑game targets; strong value when defenses are stable.",
  Legendary: "Great ROI tier before Mythics; pity helps planning.",
  Mythic: "High income spikes; requires stronger capture lanes.",
  Godly: "Top regular tier; ensure Mythic+ plants for consistency.",
  Secret: "End‑game showcase; perfect weight + mutations matter most.",
};

function RarityPill({ rarity }: { rarity: string }) {
  const styles: Record<string, string> = {
    Common: "bg-white/5 border-white/15 text-white/80",
    Rare: "bg-blue-500/15 border-blue-400/30 text-blue-200",
    Epic: "bg-violet-500/15 border-violet-400/30 text-violet-200",
    Legendary: "bg-amber-500/15 border-amber-400/30 text-amber-200",
    Mythic: "bg-pink-500/15 border-pink-400/30 text-pink-200",
    Godly: "bg-yellow-500/15 border-yellow-400/30 text-yellow-200",
    Secret: "bg-rose-500/15 border-rose-400/30 text-rose-200",
  };
  const cls = styles[rarity] ?? styles.Common;
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${cls}`}>{rarity}</span>;
}



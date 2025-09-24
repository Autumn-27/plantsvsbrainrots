import plants from "@/content/data/plants.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plants — Stats, Costs, Mutations",
  description:
    "Browse Plants vs Brainrots plant stats and seed costs. Clean, rewritten data for clarity with mutation context.",
  alternates: { canonical: "/plants" }
};

export const dynamic = "force-static";

export default function PlantsPage() {
  return (
    <main className="px-5 py-8 mx-auto max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold">Plants — Stats & Costs</h1>
      <p className="mt-2 text-white/80">Updated base damage and seed price for every plant. Values are consolidated and lightly rewritten for clarity.</p>
      <p className="mt-1 text-xs text-white/60">Note: Mutations modify base damage — Gold (2×), Diamond (3×), Neon (4.5×), Frozen (4× + ~0.3s freeze).</p>

      <div className="overflow-x-auto mt-6 card">
        <div className="px-4 pt-3 text-sm text-white/70">All plants (seed cost in $)</div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Rarity</th>
              <th className="py-2 pr-3">Seed Cost</th>
              <th className="py-2 pr-3">Base Damage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {plants.map((p, i) => (
              <tr key={p.slug} className={i % 2 === 0 ? "bg-white/[.02]" : "bg-transparent"}>
                <td className="py-2 pr-3">{p.name}</td>
                <td className="py-2 pr-3"><RarityPill rarity={p.rarity} /></td>
                <td className="py-2 pr-3">${p.seedCost.toLocaleString()}</td>
                <td className="py-2 pr-3">{p.baseDamage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">How to use this page</h2>
          <ol className="mt-3 list-decimal pl-5 text-sm text-white/80 space-y-1">
            <li>Compare seed costs vs. base damage to plan early purchases.</li>
            <li>Prioritize mutated versions when the multiplier beats the next tier.</li>
            <li>Use ROI tool to estimate time needed for target plants.</li>
          </ol>
          <div className="mt-4 text-xs text-white/70">
            Tip: a well‑rolled lower‑tier (e.g., Diamond) can outperform an unmutated higher‑tier. Check total damage, not just rarity.
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">FAQ</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-medium">Is base damage per hit or per second?</dt>
              <dd className="text-white/80 mt-1">Base damage is the starting value per plant; attack cadence may vary by plant.</dd>
            </div>
            <div>
              <dt className="font-medium">Are costs final?</dt>
              <dd className="text-white/80 mt-1">Numbers may change with patches. We keep this list consolidated and updated.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Plant strategy by rarity</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><strong>Rare</strong>: Open with <em>Cactus</em> ($200) for the best early value.</li>
            <li><strong>Epic</strong>: Build your mid‑game core with <em>Pumpkin</em> and <em>Sunflower</em>.</li>
            <li><strong>Legendary</strong>: <em>Eggplant</em> outdamages <em>Dragon Fruit</em> (≈2× for similar slot).</li>
            <li><strong>Mythic</strong>: <em>Watermelon</em> (750 dmg) is the entry to high‑tier builds.</li>
            <li><strong>Godly</strong>: <em>Carnivorous Plant</em> (2,200 dmg) anchors late‑game lanes.</li>
            <li><strong>Secret</strong>: <em>Mr. Carrot</em> (3,500) / <em>Tomatrio</em> (8,750) as ultimate goals.</li>
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">Progression strategy</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <p className="font-medium">Early game (&lt; $10k)</p>
              <p className="text-white/80">Cactus → Strawberry → save for Pumpkin. Favor strong mutations over plain tier‑ups.</p>
            </div>
            <div>
              <p className="font-medium">Mid game ($10k–$500k)</p>
              <p className="text-white/80">Focus on Epics; keep a ~70/30 split between brainrot income and plant spend.</p>
            </div>
            <div>
              <p className="font-medium">Late game ($500k+)</p>
              <p className="text-white/80">Invest into Legendary+. A Diamond Eggplant (≈1,500) can beat a normal Watermelon (750).</p>
            </div>
            <div>
              <p className="font-medium">End game ($50M+)</p>
              <p className="text-white/80">Chase Mr. Carrot / Tomatrio; target Neon/Diamond on top‑tier plants for peak lanes.</p>
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
  Common: "Entry tier; cheap filler for early lanes.",
  Rare: "Affordable starters; useful when rolled with strong mutations.",
  Epic: "Core mid‑game picks; reliable value for price.",
  Legendary: "Strong step‑up; pairs well with mutation spikes.",
  Mythic: "High power; expect higher costs and better scaling.",
  Godly: "Premium power picks for late game defenses.",
  Secret: "Top‑end and limited; target when economy is stable.",
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



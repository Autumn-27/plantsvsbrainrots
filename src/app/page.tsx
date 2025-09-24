import Link from "next/link";
import changelog from "@/content/data/changelog.json";

export default function Home() {
  type ChangeEntry = { date: string; title: string; highlights?: string[] };
  const changes = changelog as unknown as ChangeEntry[];
  return (
    <main className="min-h-screen px-5 py-10 md:px-8 lg:px-12">
      <section className="mx-auto max-w-6xl grid items-center gap-8 md:grid-cols-2 surface p-6 md:p-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-300">
            Plants vs Brainrots — Wiki, Tools, Trading, Calculators, Stock
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80">
            Plant defensive units to stop waves of meme‑inspired brainrots. Capture defeated enemies to earn passive cash, fuse plants for power spikes, and progress through rarity tiers and rebirth bonuses.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/plants" className="btn-primary">Explore Plants</Link>
            <Link href="/income" className="btn-ghost">Income Calculator</Link>
            <Link href="/game" className="btn-ghost">Game Overview</Link>
            <a href="https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots" target="_blank" rel="noopener noreferrer" className="btn-ghost">Play on Roblox</a>
            <a href="https://discord.com/invite/jtkxMvhCau" target="_blank" rel="noopener noreferrer" className="btn-ghost">Discord</a>
          </div>
        </div>
        <div className="relative">
          <div className="card p-2">
            <img src="/image.webp" alt="Plants vs Brainrots illustration" className="rounded-lg w-full h-auto" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Wiki: Plants" href="/plants" desc="Stats, costs, and mutation multipliers with quick filters." />
        <Card title="Wiki: Brainrots" href="/brainrots" desc="Income per second and rarity tiers at a glance." />
        <Card title="Codes" href="/codes" desc="Verified working codes with last updated timestamps." />
        <Card title="Changelog" href="/changelog" desc="Latest patches summarized with practical impact." />
        <Card title="Tools: Income" href="/income" desc="Sum up total $/s by mutation and weight." />
        <Card title="Tools: ROI" href="/roi" desc="Estimate time to afford upgrades based on current income." />
      </section>

      {/* Game Intro blocks (rewritten for originality & SEO) */}
      <section className="mx-auto max-w-6xl mt-14 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold">What is Plants vs Brainrots?</h2>
          <p className="mt-3 text-white/80">
            Plants vs Brainrots is a fast-paced strategy tower defense. You purchase seeds, place plants by lanes, and stop waves of meme-inspired enemies called brainrots. Defeated brainrots can be placed on platforms to generate passive income, letting you scale into stronger defenses.
          </p>

          <h3 className="mt-8 font-semibold">Core Features</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li className="rounded-md border border-white/10 p-4 bg-transparent">
              <p className="font-medium">Strategic Plant Placement</p>
              <p className="mt-1 text-sm text-white/80">Each plant has distinct damage patterns and costs — choose the right mix per lane.</p>
            </li>
            <li className="rounded-md border border-white/10 p-4 bg-transparent">
              <p className="font-medium">Passive Income System</p>
              <p className="mt-1 text-sm text-white/80">Captured brainrots earn $/s. Balance economy vs. defense for smoother progression.</p>
            </li>
            <li className="rounded-md border border-white/10 p-4 bg-transparent">
              <p className="font-medium">Rarity & Mutations</p>
              <p className="mt-1 text-sm text-white/80">Rarities from Common to Secret, with multipliers like Gold, Diamond, Neon, Frozen.</p>
            </li>
            <li className="rounded-md border border-white/10 p-4 bg-transparent">
              <p className="font-medium">Fusion & Rebirth</p>
              <p className="mt-1 text-sm text-white/80">Limited-time fusion creates stronger plants; rebirth grants permanent boosts.</p>
            </li>
          </ul>

          <h3 className="mt-8 font-semibold">Quick Start</h3>
          <ol className="mt-3 list-decimal pl-5 text-white/80 space-y-1">
            <li>Buy seeds and plant by lanes to stabilize early waves.</li>
            <li>Place captured brainrots on platforms to earn $/s.</li>
            <li>Prioritize high-multiplier mutations when upgrading.</li>
            <li>Use Income/ROI tools to plan purchases and milestones.</li>
          </ol>
        </div>

        <aside>
          <div className="card p-5">
            <h3 className="font-semibold">Beginner FAQ</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="font-medium">How do I start?</dt>
                <dd className="text-white/80 mt-1">Buy seeds, plant by lanes, and place captured brainrots for $/s.</dd>
              </div>
              <div>
                <dt className="font-medium">Best early strategy?</dt>
                <dd className="text-white/80 mt-1">Stabilize with cheaper plants; save for a strong backline with good multipliers.</dd>
              </div>
              <div>
                <dt className="font-medium">Fusion & rebirth?</dt>
                <dd className="text-white/80 mt-1">Fuse during limited windows for power spikes; rebirth for permanent boosts.</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <Link href="/plants" className="btn-ghost">Plants Wiki</Link>
              <Link href="/income" className="btn-ghost">Income Tool</Link>
            </div>
          </div>
        </aside>
      </section>

      {/* Latest updates preview */}
      <section className="mx-auto max-w-6xl mt-14">
        <h2 className="text-2xl font-semibold">Latest Updates</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {changes.slice(0, 3).map((c) => (
            <li key={c.date} className="card p-4">
              <p className="text-sm text-white/60">{c.date}</p>
              <h3 className="mt-1 font-semibold">{c.title}</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-1">
                {(c.highlights || []).slice(0, 3).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <Link href="/changelog" className="mt-3 inline-block text-sm underline">View all</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="block card p-5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/80">{desc}</p>
    </Link>
  );
}

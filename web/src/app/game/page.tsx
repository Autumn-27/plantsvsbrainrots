import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Overview — What is Plants vs Brainrots?",
  description:
    "Learn what Plants vs Brainrots is about: strategy tower defense, plant fusion, rarity tiers, rebirth progression, and meme-inspired enemies.",
  alternates: { canonical: "/game" }
};

export default function GamePage() {
  return (
    <main className="px-5 py-10 mx-auto max-w-5xl">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Plants vs Brainrots — Game Overview</h1>
        <p className="mt-3 text-white/80">
          A modern strategy tower defense on Roblox that blends classic lane defense with meme-inspired enemies and a unique income system.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">What is Plants vs Brainrots?</h2>
        <p className="mt-2 text-white/80">
          Plants vs Brainrots reimagines lane-based defense with internet culture flair. You purchase seeds, place plants to stop waves, and convert defeated brainrots into passive income. Combine progression, light humor, and strategic placement for a fast, satisfying loop.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Core Features</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          <li className="card p-4">
            <h3 className="font-medium">Strategic Plant Placement</h3>
            <p className="mt-1 text-sm text-white/80">Buy seeds and position plants by lane. Each plant has distinct damage profiles to counter different brainrots.</p>
          </li>
          <li className="card p-4">
            <h3 className="font-medium">Income Generation System</h3>
            <p className="mt-1 text-sm text-white/80">Defeated brainrots join your base and produce $/s. Balance defenses with economic growth.</p>
          </li>
          <li className="card p-4">
            <h3 className="font-medium">Plant Fusion</h3>
            <p className="mt-1 text-sm text-white/80">Fuse specific plants to create powerful variants when events or machines are available.</p>
          </li>
          <li className="card p-4">
            <h3 className="font-medium">Rarity & Mutations</h3>
            <p className="mt-1 text-sm text-white/80">Multiple rarity tiers and damage/income multipliers like Gold, Diamond, Neon, and Frozen.</p>
          </li>
          <li className="card p-4">
            <h3 className="font-medium">Rebirth Progression</h3>
            <p className="mt-1 text-sm text-white/80">Reset for permanent boosts (money, luck) once you hit key milestones.</p>
          </li>
          <li className="card p-4">
            <h3 className="font-medium">Meme-Inspired Enemies</h3>
            <p className="mt-1 text-sm text-white/80">Lighthearted brainrots based on internet culture keep the experience fun and fresh.</p>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Beginner FAQ</h2>
        <div className="mt-4 grid gap-3">
          <Faq q="How do I start?" a="Buy seeds, plant by lanes, and let plants auto-defend. Place captured brainrots on platforms to earn $/s and fund upgrades." />
          <Faq q="Best early strategy?" a="Use affordable plants to stabilize front lanes while saving for a strong backline. Prioritize mutated upgrades with higher multipliers." />
          <Faq q="How does fusion work?" a="When available, combine specific plants (or identical ones) at the fuse machine to unlock stronger versions for limited windows." />
          <Faq q="When to rebirth?" a="Rebirth once requirements are met and progression slows. The permanent boosts compound long-term gains." />
          <Faq q="Free to play?" a="Yes. Premium items accelerate progress but aren’t required to enjoy or progress through core content." />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Explore Data & Tools</h2>
        <ul className="mt-3 list-disc pl-5 text-white/80">
          <li><Link className="underline" href="/plants">Plants stats and costs</Link></li>
          <li><Link className="underline" href="/brainrots">Brainrots income by rarity and mutation</Link></li>
          <li><Link className="underline" href="/income">Income per second calculator</Link></li>
          <li><Link className="underline" href="/roi">Time-to-afford estimator</Link></li>
          <li><Link className="underline" href="/codes">Latest working codes</Link></li>
          <li><Link className="underline" href="/changelog">Recent updates</Link></li>
        </ul>
      </section>
    </main>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="card p-4">
      <p className="font-medium">{q}</p>
      <p className="mt-1 text-sm text-white/80">{a}</p>
    </div>
  );
}



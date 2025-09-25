"use client";
import { useMemo, useState } from "react";
import brainrots from "@/content/data/brainrots.json";
import mutations from "@/content/data/mutations.json";

type Entry = { slug: string; mutation: keyof typeof mutations.brainrotIncomeMultipliers; weightKg: number };

export default function IncomeToolPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const totalPerSec = useMemo(() => {
    const mult = mutations.brainrotIncomeMultipliers as Record<string, number>;
    return entries.reduce((sum, e) => {
      const b = brainrots.find((x) => x.slug === e.slug);
      if (!b || b.basePerSec == null) return sum;
      const m = mult[e.mutation] ?? 1;
      const weightFactor = e.weightKg / 10;
      return sum + b.basePerSec * m * weightFactor;
    }, 0);
  }, [entries]);

  return (
    <main className="px-5 py-8 mx-auto max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold">Income per Second Calculator</h1>
      <p className="mt-2 text-white/80">Estimate total $/s by adding your brainrots, mutation, and weight. Uses baseline values and a linear weight rule.</p>

      <section className="mt-4 card p-4">
        <h2 className="font-semibold">How to use</h2>
        <ol className="mt-2 list-decimal pl-5 text-sm text-white/80 space-y-1">
          <li>Click “Add Brainrot” and select the name and mutation.</li>
          <li>Enter the weight in kg (10 = baseline). Heavier means more $/s.</li>
          <li>Repeat for all owned brainrots to see a running total below.</li>
        </ol>
      </section>

      <button className="mt-4 rounded-md border px-3 py-2 text-sm" onClick={() => setEntries((v) => [...v, { slug: brainrots[0].slug, mutation: "normal", weightKg: 10 }])}>
        + Add Brainrot
      </button>

      <ul className="mt-4 space-y-3">
        {entries.map((e, idx) => (
          <li key={idx} className="card p-4 grid gap-3 sm:grid-cols-[1fr_180px_140px_auto] sm:items-end">
            <label className="text-sm block">
              <span className="block mb-1 text-white/80">Brainrot</span>
              <select
                className="w-full rounded-md px-2 py-2 text-sm"
                value={e.slug}
                onChange={(ev) => {
                  const slug = ev.target.value;
                  setEntries((v) => v.map((x, i) => (i === idx ? { ...x, slug } : x)));
                }}
              >
                {brainrots.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm block">
              <span className="block mb-1 text-white/80">Mutation</span>
              <select
                className="w-full rounded-md px-2 py-2 text-sm capitalize"
                value={e.mutation}
                onChange={(ev) => {
                  const mutation = ev.target.value as Entry["mutation"];
                  setEntries((v) => v.map((x, i) => (i === idx ? { ...x, mutation } : x)));
                }}
              >
                {Object.keys(mutations.brainrotIncomeMultipliers).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm block">
              <span className="block mb-1 text-white/80">Weight (kg)</span>
              <input
                className="w-full rounded-md px-3 py-2 text-sm"
                type="number"
                step="0.1"
                min={0}
                value={e.weightKg}
                onChange={(ev) => {
                  const weightKg = Number(ev.target.value);
                  setEntries((v) => v.map((x, i) => (i === idx ? { ...x, weightKg } : x)));
                }}
              />
            </label>

            <div className="sm:justify-self-end">
              <button
                className="btn-ghost text-sm px-3 py-2"
                onClick={() => setEntries((v) => v.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-md border p-4">
        <p className="text-sm">Total income per second</p>
        <p className="text-2xl font-semibold mt-1">${totalPerSec.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      </div>

      <section className="mt-6 card p-4">
        <h2 className="font-semibold">FAQ</h2>
        <dl className="mt-2 space-y-2 text-sm">
          <div>
            <dt className="font-medium">Why is my result different from in-game?</dt>
            <dd className="text-white/80 mt-1">This tool uses baseline values and a simple linear weight rule; in-game rounding or bonuses may cause small differences.</dd>
          </div>
          <div>
            <dt className="font-medium">Do Neon/Frozen apply differently?</dt>
            <dd className="text-white/80 mt-1">Mutations use fixed multipliers. Neon is 4.5×; Frozen is 4× (special effects may vary in-game).</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}




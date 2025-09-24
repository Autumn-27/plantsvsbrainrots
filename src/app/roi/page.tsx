"use client";
import { useMemo, useState } from "react";

export default function ROIPage() {
  const [incomePerSec, setIncomePerSec] = useState<number>(0);
  const [targetCost, setTargetCost] = useState<number>(10000);

  const seconds = useMemo(() => {
    if (incomePerSec <= 0) return Infinity;
    return targetCost / incomePerSec;
  }, [incomePerSec, targetCost]);

  return (
    <main className="px-5 py-8 mx-auto max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold">Time-to-Afford Estimator</h1>
      <p className="mt-2 text-white/80">Enter your $/s and target cost to estimate how long you’ll need to save.</p>

      <section className="mt-4 card p-4">
        <h2 className="font-semibold">How to use</h2>
        <ol className="mt-2 list-decimal pl-5 text-sm text-white/80 space-y-1">
          <li>Type your current income per second in the first field.</li>
          <li>Type the price of the item/plant you want to buy.</li>
          <li>See the estimated time below, formatted as hours/minutes/seconds.</li>
        </ol>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="block mb-1">Your income per second ($/s)</span>
          <input className="w-full border rounded-md px-3 py-2" type="number" min={0} value={incomePerSec} onChange={(e) => setIncomePerSec(Number(e.target.value))} />
        </label>
        <label className="text-sm">
          <span className="block mb-1">Target cost ($)</span>
          <input className="w-full border rounded-md px-3 py-2" type="number" min={0} value={targetCost} onChange={(e) => setTargetCost(Number(e.target.value))} />
        </label>
      </div>

      <Result seconds={seconds} />
    </main>
  );
}

function Result({ seconds }: { seconds: number }) {
  if (!isFinite(seconds)) {
    return <p className="mt-6 text-sm">Enter a positive income per second to calculate the time to afford.</p>;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return (
    <>
      <div className="mt-6 rounded-md border p-4">
        <p className="text-sm">Estimated time to afford</p>
        <p className="text-xl font-semibold mt-1">{h}h {m}m {s}s</p>
      </div>
      <section className="mt-6 card p-4">
        <h2 className="font-semibold">FAQ</h2>
        <dl className="mt-2 space-y-2 text-sm">
          <div>
            <dt className="font-medium">Does this consider offline income?</dt>
            <dd className="text-white/80 mt-1">No. It’s a simple estimator using your provided $/s at face value.</dd>
          </div>
          <div>
            <dt className="font-medium">Why doesn’t it factor discounts?</dt>
            <dd className="text-white/80 mt-1">Prices and bonuses fluctuate. Enter your best known numbers to get a close estimate.</dd>
          </div>
        </dl>
      </section>
    </>
  );
}




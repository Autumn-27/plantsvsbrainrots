import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About this unofficial Plants vs Brainrots site: goals, data sources, and contact.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <main className="px-5 py-8 mx-auto max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold">About</h1>
      <p className="mt-2 text-white/80">This is an unofficial, community‑driven reference for Plants vs Brainrots. We consolidate, rewrite, and verify information to improve clarity and usefulness.</p>
      <h2 className="mt-6 font-semibold">What we do</h2>
      <ul className="mt-2 list-disc pl-5 text-white/80 text-sm space-y-1">
        <li>Maintain concise wiki pages and practical calculators.</li>
        <li>Track changes and codes with timestamps.</li>
        <li>Prefer original wording and verification to avoid duplication.</li>
      </ul>
      <h2 className="mt-6 font-semibold">Contact</h2>
      <p className="mt-2 text-white/80 text-sm">For feedback or corrections, please open an issue on the repository or reach out via Discord.</p>
    </main>
  );
}



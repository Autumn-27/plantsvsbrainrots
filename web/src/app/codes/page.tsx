import codes from "@/content/data/codes.json";
import { CopyButton } from "@/components/CopyButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codes — Working Plants vs Brainrots Codes",
  description: "Verified working codes for Plants vs Brainrots with rewards and last updated dates.",
  alternates: { canonical: "/codes" }
};

export const dynamic = "force-static";

type CodeItem = { code: string; reward?: string; dateAdded?: string };
type CodesData = { lastUpdated: string; active: CodeItem[]; expired: CodeItem[] };

export default function CodesPage() {
  const data = codes as unknown as CodesData;
  return (
    <main className="px-5 py-8 mx-auto max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold">Plants vs Brainrots Codes</h1>
      <p className="mt-2 text-white/80">Working codes with rewards and dates. Case‑sensitive; some expire during updates. This page is kept up to date.</p>
      <p className="mt-1 text-sm text-neutral-400">Last updated: {data.lastUpdated}</p>

      <section className="mt-6 card p-4">
        <h2 className="font-semibold">How to redeem Plants vs Brainrots codes</h2>
        <ol className="mt-2 list-decimal pl-5 text-sm text-white/80 space-y-1">
          <li>Launch Plants vs Brainrots in the Roblox app.</li>
          <li>Tap Shop on the left → choose Codes.</li>
          <li>Type a working code in the pop‑up box.</li>
          <li>Press Claim to receive your rewards instantly.</li>
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Active</h2>
        <ul className="mt-2 space-y-2">
          {data.active.map((c) => (
            <li key={c.code} className="card p-3">
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono text-sm bg-white/10 px-2 py-1 rounded-md">{c.code}</code>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">{c.reward}</span>
                  <CopyButton text={c.code} />
                </div>
              </div>
              <p className="text-xs text-white/60 mt-2">Added on {c.dateAdded}</p>
            </li>
          ))}
        </ul>
      </section>

      {data.expired.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold">Expired</h2>
          <ul className="mt-2 space-y-2">
            {data.expired.map((c) => (
              <li key={c.code} className="card p-3 opacity-70">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm bg-white/10 px-2 py-1 rounded-md">{c.code}</code>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border border-white/20">Expired</span>
                  </div>
                  <span className="text-sm text-white/80">{c.reward}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}



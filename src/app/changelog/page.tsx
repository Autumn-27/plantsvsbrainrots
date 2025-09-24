import changelog from "@/content/data/changelog.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog & Updates",
  description: "Recent Plants vs Brainrots patches with concise highlights and gameplay impact.",
  alternates: { canonical: "/changelog" }
};

export const dynamic = "force-static";

export default function ChangelogPage() {
  return (
    <main className="px-5 py-8 mx-auto max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold">Changelog & Updates</h1>
      <p className="mt-2 text-white/80">Concise patch highlights with practical impact, easy to scan.</p>

      <ul className="mt-6 space-y-4">
        {changelog.map((entry) => (
          <li key={entry.date} className="rounded-md border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{entry.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{entry.date}</p>
              </div>
            </div>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              {entry.highlights.map((h: string, i: number) => (
                <li key={i} className="text-sm">{h}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}



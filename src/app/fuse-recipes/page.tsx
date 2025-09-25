"use client";
import ImageWithFallback from "@/components/ImageWithFallback";
import brainrots from "@/content/data/brainrots.json";
import plants from "@/content/data/plants.json";
import { useEffect, useMemo, useState } from "react";

type Plant = { name: string; slug: string };
type Brainrot = { name: string; slug: string };

type Recipe = {
  plantSlug: string;
  brainrotSlug: string;
  resultName: string;
  resultSlug: string;
};

// Seed initial recipes from spec; slugs must exist in datasets where applicable
const RECIPES: Recipe[] = [
  { plantSlug: "cactus", brainrotSlug: "noobini-bananini", resultName: "Noobini Cactusini", resultSlug: "noobini-cactusini" },
  { plantSlug: "strawberry", brainrotSlug: "orangutani-ananassini", resultName: "Orangutini Strawberrini", resultSlug: "orangutini-strawberrini" },
  { plantSlug: "pumpkin", brainrotSlug: "svinino-bombondino", resultName: "Svinino Pumpkinino", resultSlug: "svinino-pumpkinino" },
  { plantSlug: "sunflower", brainrotSlug: "brr-brr-patapim", resultName: "Brr Brr Sunflowerim", resultSlug: "brr-brr-sunflowerim" },
  { plantSlug: "dragon-fruit", brainrotSlug: "bananita-dolphinita", resultName: "Dragonfrutina Dolphinita", resultSlug: "dragonfrutina-dolphinita" },
  { plantSlug: "eggplant", brainrotSlug: "burbaloni-lulliloli", resultName: "Eggplantini Burbalonini", resultSlug: "eggplantini-burbalonini" },
  { plantSlug: "watermelon", brainrotSlug: "bombardiro-crocodilo", resultName: "Bombardilo Watermelondrillo", resultSlug: "bombardilo-watermelondrillo" },
  { plantSlug: "cocotank", brainrotSlug: "giraffa-celeste", resultName: "Cocotanko Giraffanto", resultSlug: "cocotanko-giraffanto" },
  { plantSlug: "carnivorous-plant", brainrotSlug: "tralalelo-tralala", resultName: "Carnivourita Tralalerita", resultSlug: "carnivourita-tralalerita" },
  { plantSlug: "mr-carrot", brainrotSlug: "los-tralaleritos", resultName: "Los Mr Carrotitos", resultSlug: "los-mr-carrotitos" },
];

export default function FuseRecipesPage() {
  const [tab, setTab] = useState<"how" | "what">("how");
  return (
    <main className="px-5 py-8 mx-auto max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold">Plants vs Brainrots Fuse Recipes List</h1>
      <p className="mt-2 text-white/80 text-sm">Find recipes by selecting inputs, or see what you can craft from what you already have.</p>

      <div className="mt-6 inline-flex rounded-md border border-white/10 overflow-hidden">
        <button onClick={() => setTab("how")} className={`px-4 py-2 text-sm ${tab === "how" ? "bg-white/10" : "hover:bg-white/5"}`}>How to Make</button>
        <button onClick={() => setTab("what")} className={`px-4 py-2 text-sm border-l border-white/10 ${tab === "what" ? "bg-white/10" : "hover:bg-white/5"}`}>What Can I Make</button>
      </div>

      {tab === "how" ? <HowToMake /> : <WhatCanIMake />}
    </main>
  );
}

function useCols() {
  const [cols, setCols] = useState(6);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2); // base
      else if (w < 768) setCols(3); // sm
      else setCols(6); // md+
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return cols;
}

function HowToMake() {
  const [resultQuery, setResultQuery] = useState("");
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const cols = useCols();
  const [visible, setVisible] = useState<number>(12);
  useEffect(() => { setVisible(cols * 2); }, [cols]);

  const resultCards = useMemo(() =>
    RECIPES.filter(r => r.resultName.toLowerCase().includes(resultQuery.toLowerCase())),
  [resultQuery]);

  const filteredRecipes = useMemo(() => {
    if (selectedResults.length === 0) return RECIPES;
    return RECIPES.filter(r => selectedResults.includes(r.resultSlug));
  }, [selectedResults]);

  return (
    <section className="mt-6">
      <div className="card p-5">
        <h2 className="font-semibold">Pick fused results</h2>
        <input value={resultQuery} onChange={(e) => setResultQuery(e.target.value)} placeholder="Search fused results..." className="mt-2 w-full rounded-md px-3 py-2 text-sm border border-white/15 bg-white/5" />
        <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {resultCards.slice(0, visible).map((r) => {
            const active = selectedResults.includes(r.resultSlug);
            return (
              <button key={r.resultSlug} onClick={() => setSelectedResults((prev) => prev.includes(r.resultSlug) ? prev.filter(s => s !== r.resultSlug) : [...prev, r.resultSlug])} className={`card p-3 text-left ${active ? "ring-2 ring-blue-300" : ""}`}>
                <div className="flex flex-col items-center gap-2">
                  <ImageWithFallback src={`/brainrots/${r.resultSlug}.webp`} alt={r.resultName} width={112} height={112} className="h-24 w-24 rounded-lg object-cover border border-white/10" />
                  <span className="text-xs text-center">{r.resultName}</span>
                </div>
              </button>
            );
          })}
        </div>
        {resultCards.length > visible && (
          <button className="mt-3 btn-ghost px-3 py-2 text-xs" onClick={() => setVisible((v) => v + cols * 2)}>Show more ({resultCards.length - visible})</button>
        )}
      </div>

      <div className="mt-6 card p-5">
        <h2 className="font-semibold">Results</h2>
        {filteredRecipes.length === 0 ? (
          <p className="mt-2 text-white/70 text-sm">No matching recipes. Select different brainrots.</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((r) => (
              <RecipeCard key={`${r.plantSlug}-${r.brainrotSlug}`} r={r} />
            ))}
          </div>
        )}
      </div>

      <TipsInfo />
    </section>
  );
}

function WhatCanIMake() {
  const [query, setQuery] = useState("");
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [selectedBrainrots, setSelectedBrainrots] = useState<string[]>([]);
  const cols = useCols();
  const [visible, setVisible] = useState<number>(12);
  useEffect(() => { setVisible(cols * 2); }, [cols]);

  const allItems = useMemo(() => {
    const pl = (plants as Plant[]).map(p => ({ kind: "plant" as const, name: p.name, slug: p.slug }));
    const br = (brainrots as Brainrot[]).map(b => ({ kind: "brainrot" as const, name: b.name, slug: b.slug }));
    return [...pl, ...br].filter(x => x.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const filteredRecipes = useMemo(() => {
    const hasFilters = selectedPlants.length > 0 || selectedBrainrots.length > 0;
    if (!hasFilters) return RECIPES;
    return RECIPES.filter(r =>
      (selectedPlants.length === 0 || selectedPlants.includes(r.plantSlug)) &&
      (selectedBrainrots.length === 0 || selectedBrainrots.includes(r.brainrotSlug))
    );
  }, [selectedPlants, selectedBrainrots]);

  return (
    <section className="mt-6">
      <div className="card p-5">
        <h2 className="font-semibold">Pick ingredients</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search plants or brainrots..." className="mt-2 w-full rounded-md px-3 py-2 text-sm border border-white/15 bg-white/5" />
        <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {allItems.slice(0, visible).map((x) => {
            const selected = x.kind === "plant" ? selectedPlants.includes(x.slug) : selectedBrainrots.includes(x.slug);
            return (
              <button
                key={`${x.kind}-${x.slug}`}
                onClick={() => {
                  if (x.kind === "plant") {
                    setSelectedPlants((prev) => prev.includes(x.slug) ? prev.filter(s => s !== x.slug) : [...prev, x.slug]);
                  } else {
                    setSelectedBrainrots((prev) => prev.includes(x.slug) ? prev.filter(s => s !== x.slug) : [...prev, x.slug]);
                  }
                }}
                className={`card p-3 text-left ${selected ? "ring-2 ring-blue-300" : ""}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageWithFallback src={`/${x.kind === "plant" ? "plants" : "brainrots"}/${x.slug}.webp`} alt={x.name} width={112} height={112} className="h-24 w-24 rounded-lg object-cover border border-white/10" />
                  <span className="text-sm text-center">{x.name}</span>
                </div>
              </button>
            );
          })}
        </div>
        {allItems.length > visible && (
          <button className="mt-3 btn-ghost px-3 py-2 text-xs" onClick={() => setVisible((v) => v + cols * 2)}>Show more ({allItems.length - visible})</button>
        )}
      </div>

      <div className="mt-6 card p-5">
        <h2 className="font-semibold">Results</h2>
        {!filteredRecipes.length ? (
          <p className="mt-2 text-white/70 text-sm">No matching recipes. Try selecting different ingredients.</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((r) => (
              <RecipeCard key={`${r.plantSlug}-${r.brainrotSlug}`} r={r} />
            ))}
          </div>
        )}
      </div>

      <TipsInfo />
    </section>
  );
}

function RecipeCard({ r }: { r: Recipe }) {
  const plant = (plants as Plant[]).find(p => p.slug === r.plantSlug);
  const brain = (brainrots as Brainrot[]).find(b => b.slug === r.brainrotSlug);
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <ImageWithFallback src={`/plants/${r.plantSlug}.webp`} alt={plant?.name || r.plantSlug} width={56} height={56} className="h-14 w-14 rounded-lg object-cover border border-white/10" />
        <span className="text-white/80">+</span>
        <ImageWithFallback src={`/brainrots/${r.brainrotSlug}.webp`} alt={brain?.name || r.brainrotSlug} width={56} height={56} className="h-14 w-14 rounded-lg object-cover border border-white/10" />
        <span className="text-white/80">=</span>
        <ImageWithFallback src={`/brainrots/${r.resultSlug}.webp`} alt={r.resultName} width={56} height={56} className="h-14 w-14 rounded-lg object-cover border border-white/10" />
      </div>
      <p className="mt-2 text-sm text-white/90"><strong>{plant?.name || r.plantSlug}</strong> + <strong>{brain?.name || r.brainrotSlug}</strong> → {r.resultName}</p>
    </div>
  );
}

function TipsInfo() {
  return (
    <div className="mt-6 card p-5">
      <h2 className="font-semibold">Fusion tips & FAQs</h2>
      <p className="mt-2 text-white/80 text-sm">
        Fusing is a reliable way to obtain special brainrots without relying purely on luck. Each plant pairs with one specific brainrot in the Fuse Machine.
      </p>
      <h3 className="mt-4 font-medium text-white">How it works</h3>
      <ol className="mt-2 list-decimal pl-5 text-sm text-white/80 space-y-1">
        <li>Place the required plant and its matching brainrot into the Fuse Machine.</li>
        <li>Start the process and wait for completion; the fused brainrot is sent to your inventory.</li>
        <li>Ensure you have inventory space before starting to avoid losing the result.</li>
      </ol>
      <h3 className="mt-4 font-medium text-white">FAQs</h3>
      <dl className="mt-2 space-y-2 text-sm">
        <div>
          <dt className="font-medium">How long does fusing take?</dt>
          <dd className="text-white/80 mt-1">Typically a few minutes under normal conditions.</dd>
        </div>
        <div>
          <dt className="font-medium">Why did my fused brainrot disappear?</dt>
          <dd className="text-white/80 mt-1">If your inventory is full at completion, the fused brainrot may be lost. Free up space first.</dd>
        </div>
        <div>
          <dt className="font-medium">Can I fuse multiple at once?</dt>
          <dd className="text-white/80 mt-1">No. With a single machine, only one fusion can run at a time.</dd>
        </div>
      </dl>
    </div>
  );
}



import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for plants-vs-brainrots.com.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <main className="px-5 py-8 mx-auto max-w-3xl text-sm leading-6">
      <h1 className="text-2xl md:text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-white/80">By accessing plants-vs-brainrots.com, you agree to the following terms.</p>
      <h2 className="mt-6 font-semibold">Use of content</h2>
      <p className="mt-1 text-white/80">This site is unofficial and provided for informational purposes only. Content may change at any time.</p>
      <h2 className="mt-6 font-semibold">No affiliation</h2>
      <p className="mt-1 text-white/80">We are not affiliated with Roblox, Yo Gurt Studio, or any related parties.</p>
      <h2 className="mt-6 font-semibold">Limitation of liability</h2>
      <p className="mt-1 text-white/80">We do our best to keep data accurate, but we provide no warranties. Use at your own risk.</p>
      <h2 className="mt-6 font-semibold">Changes</h2>
      <p className="mt-1 text-white/80">We may update these terms without notice. Continued use constitutes acceptance.</p>
    </main>
  );
}



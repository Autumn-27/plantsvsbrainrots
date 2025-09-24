import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for plants-vs-brainrots.com.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <main className="px-5 py-8 mx-auto max-w-3xl text-sm leading-6">
      <h1 className="text-2xl md:text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-white/80">We respect your privacy and strive to collect as little personal data as possible.</p>
      <h2 className="mt-6 font-semibold">Analytics</h2>
      <p className="mt-1 text-white/80">We may use lightweight analytics (e.g., Plausible/Umami) to understand aggregate usage without cookies.</p>
      <h2 className="mt-6 font-semibold">Log data</h2>
      <p className="mt-1 text-white/80">Basic server logs may be retained for debugging and security purposes.</p>
      <h2 className="mt-6 font-semibold">Third‑party links</h2>
      <p className="mt-1 text-white/80">Links to Roblox/Discord or other sites are subject to their own policies.</p>
      <h2 className="mt-6 font-semibold">Changes</h2>
      <p className="mt-1 text-white/80">We may update this policy. Continued use indicates acceptance of the latest version.</p>
      <h2 className="mt-6 font-semibold">Contact</h2>
      <p className="mt-1 text-white/80">Questions? Contact us via the methods listed on the About page.</p>
    </main>
  );
}



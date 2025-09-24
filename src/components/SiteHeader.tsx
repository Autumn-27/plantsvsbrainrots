"use client";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/plants", label: "Plants" },
  { href: "/brainrots", label: "Brainrots" },
  { href: "/codes", label: "Codes" },
  { href: "/changelog", label: "Changelog" },
  { href: "/income", label: "Income" },
  { href: "/roi", label: "ROI" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#141824]/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-white">
        Plants vs Brainrots
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-white/80 hover:text-white transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Open menu"
          className="md:hidden btn-ghost px-3 py-1"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0f1115]/95">
          <div className="max-w-6xl mx-auto px-5 py-3 grid gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 text-white/90 hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="h-px bg-white/10" />
    </header>
  );
}



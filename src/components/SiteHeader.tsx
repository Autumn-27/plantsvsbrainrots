"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserInfo, clearUserInfo, type UserInfo } from "@/lib/user";
const nav = [
  { href: "/plants", label: "Plants" },
  { href: "/brainrots", label: "Brainrots" },
  { href: "/fuse-recipes", label: "Fuse" },
  { href: "/codes", label: "Codes" },
  { href: "/changelog", label: "Changelog" },
  { href: "/income", label: "Income" },
  { href: "/roi", label: "ROI" },
  { href: "/trading", label: "Trading" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    setSessionLoading(false);
  }, []);
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
        <div className="flex items-center gap-3">
          {sessionLoading ? (
            <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
          ) : user ? (
            <div className="relative group">
              <Link href="/account" className="flex items-center">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image || "/favicon.png"}
                    alt={user.name || user.username || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              </Link>
              <div className="absolute right-0 mt-2 w-44 bg-white/95 dark:bg-gray-800 rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/account"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700 rounded-t-2xl"
                >
                  Account
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await fetch("/api/logout", { method: "POST" });
                    } catch {}
                    clearUserInfo();
                    setUser(null);
                    location.reload();
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700 rounded-b-2xl"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <button
                onClick={() => {
                  location.href = "/api/oauth/roblox/login";
                }}
                className="px-3 py-1.5 rounded-md bg-white text-black text-sm hover:bg-white/90 transition"
              >
                Sign in
              </button>
            </div>
          )}
          <button
            aria-label="Open menu"
            className="md:hidden btn-ghost px-3 py-1"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
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



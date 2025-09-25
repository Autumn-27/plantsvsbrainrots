import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plants vs Brainrots Fuse Recipes List",
  description: "Browse and discover fuse recipes. Filter by plants and brainrots to see exact or possible results.",
  alternates: { canonical: "/fuse-recipes" }
};

export default function FuseLayout({ children }: { children: React.ReactNode }) {
  return children;
}



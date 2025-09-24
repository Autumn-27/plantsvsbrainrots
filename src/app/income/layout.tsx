import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Income per Second Calculator",
  description:
    "Estimate total $/s from your brainrots using mutation multipliers and weight scaling.",
  alternates: { canonical: "/income" }
};

export default function IncomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}



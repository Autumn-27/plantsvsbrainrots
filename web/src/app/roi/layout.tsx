import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time-to-Afford Estimator",
  description: "Calculate how long it takes to afford a target purchase based on your $/s.",
  alternates: { canonical: "/roi" }
};

export default function ROILayout({ children }: { children: React.ReactNode }) {
  return children;
}



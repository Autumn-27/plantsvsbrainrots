import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Plants vs Brainrots — Wiki, Tools, Trading, Calculators, Stock",
    template: "%s | Plants vs Brainrots — Wiki, Tools, Trading, Calculators, Stock"
  },
  description:
    "Plants vs Brainrots: wiki, data, tools, trading insights, calculators, and stock dashboards. Mobile-first and SEO-friendly.",
  metadataBase: new URL("https://plants-vs-brainrots.com"),
  openGraph: {
    title: "Plants vs Brainrots — Wiki, Tools, Trading, Calculators, Stock",
    description:
      "Stats, drop tables, codes, calculators, trading info, and trackers for Plants vs Brainrots.",
    url: "https://plants-vs-brainrots.com",
    siteName: "Plants vs Brainrots",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Plants vs Brainrots — Wiki, Tools, Trading, Calculators, Stock",
    description:
      "Stats, codes, calculators, trading insights, and stock dashboards for Plants vs Brainrots.",
  },
  alternates: { canonical: "/" }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-X8CR0748D1" />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-X8CR0748D1');
          `}
        </Script>
        <Script
          src="https://sdxggrhbn.bentoblocksgame.com/api/script.js"
          strategy="afterInteractive"
          data-site-id="8"
        />
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <div className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

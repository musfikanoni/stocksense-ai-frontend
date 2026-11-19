// src/app/(defaultLayout)/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingStats from "@/components/landing/LandingStats";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingReviews from "@/components/landing/LandingReviews";
import LandingPricing from "@/components/LandingPricing";
import ContactModal from "@/components/ContactModal";
import Skeleton from "@/components/Skeleton";
import { Brand, Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "StockSense AI | Intelligent Market Insights",
  description:
    "Institutional-grade AI stock analysis for US equities. Real-time market sentiment, AI confidence scores, smart support & resistance mapping, and instant price alerts.",
  keywords: [
    "stock analysis",
    "AI trading signals",
    "stock market alerts",
    "market sentiment analysis",
    "support and resistance",
    "StockSense AI",
  ],
  openGraph: {
    title: "StockSense AI | Intelligent Market Insights",
    description:
      "Trade with precision intelligence. Real-time sentiment, AI confidence scores, and smart price alerts.",
    images: ["/landing/monitor-1.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StockSense AI | Intelligent Market Insights",
    description:
      "Trade with precision intelligence. Real-time sentiment, AI confidence scores, and smart price alerts.",
    images: ["/landing/monitor-1.png"],
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Header — client island for responsive menu and auth dropdown */}
      <LandingHeader />

      <main>
        {/* Hero Section — Server-rendered above-the-fold for instant FCP/LCP */}
        <LandingHero />

        {/* Real-time platform statistics — Server Component */}
        <LandingStats />

        {/* Feature showcase — Server Component */}
        <LandingFeatures />

        {/* Trader reviews — dynamic client island */}
        <Suspense
          fallback={
            <div className="flex justify-center gap-5 overflow-hidden py-10 px-4">
              <Skeleton className="h-52 w-80 shrink-0 rounded-2xl" />
              <Skeleton className="h-52 w-80 shrink-0 rounded-2xl hidden sm:block" />
              <Skeleton className="h-52 w-80 shrink-0 rounded-2xl hidden lg:block" />
            </div>
          }
        >
          <LandingReviews />
        </Suspense>

        {/* Subscription pricing plans — dynamic client island */}
        <section id="pricing" className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Choose Your <span className="text-gold">Plan</span>
          </h2>
          <p className="mb-8 sm:mb-10 mt-3 text-sm sm:text-base text-white/70">
            Upgrade to unlock full AI analysis
          </p>
          <Suspense
            fallback={
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
              </div>
            }
          >
            <LandingPricing />
          </Suspense>
        </section>
      </main>

      {/* Footer — Server Component */}
      <footer id="contact" className="border-t border-line bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:gap-5 px-4 sm:px-6 py-6 text-sm text-mute lg:flex-row">
          <Brand iconClass="h-7 w-auto" textClass="text-base text-white" />
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <ContactModal />
            <span className="flex items-center gap-2">
              <Icon name="mail" />
              example123@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <Icon name="phone" />
              +1234567854
            </span>
          </div>
          <p className="text-xs">&copy; 2026 StockSense AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

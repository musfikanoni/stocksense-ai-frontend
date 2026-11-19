// src/components/landing/LandingHero.tsx
// Pure Server Component — above-the-fold content pre-rendered by server for optimal LCP
import Image from "next/image";
import LandingHeroCTA from "./LandingHeroCTA";

export default function LandingHero() {
  return (
    <section id="home" className="relative overflow-hidden pb-4 pt-12 sm:pt-20 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[640px] bg-[url('/landing/wave.svg')] bg-cover bg-top opacity-70"
      />
      <div className="relative mx-auto max-w-3xl animate-fade-up px-4 sm:px-6">
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Trade With <span className="text-gold">Precision</span> Intelligence
        </h1>
        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-white/80">
          StockSense AI delivers institutional-grade AI analysis for US equities — real-time
          signals, support/resistance mapping, and price targets with confidence scoring.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">
          <LandingHeroCTA />
        </div>
      </div>
      <div className="relative mx-auto mt-10 sm:mt-14 max-w-5xl animate-fade-up px-4 sm:px-6 [animation-delay:200ms]">
        <Image
          src="/landing/monitor-1.png"
          alt="StockSense AI dashboard shown on a monitor"
          width={1024}
          height={480}
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="h-auto w-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent"
        />
      </div>
    </section>
  );
}

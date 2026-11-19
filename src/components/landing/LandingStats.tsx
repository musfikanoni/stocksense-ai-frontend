// src/components/landing/LandingStats.tsx
// Pure presentational — SSR-safe, no "use client" needed
import { LANDING_STATS } from "@/constants/landing";

export default function LandingStats() {
  return (
    <div
      className="group overflow-hidden py-8 sm:py-10 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      aria-label="Platform statistics"
    >
      <div className="flex w-max animate-marquee gap-3 sm:gap-4 group-hover:[animation-play-state:paused]">
        {[...LANDING_STATS, ...LANDING_STATS, ...LANDING_STATS, ...LANDING_STATS].map(
          ([value, label], i) => (
            <div
              key={i}
              aria-hidden={i >= LANDING_STATS.length}
              className="min-w-[170px] sm:min-w-[210px] rounded-2xl border border-line bg-gradient-to-b from-[#16130b] to-black px-4 sm:px-6 py-4 sm:py-5"
            >
              <p className="text-xl sm:text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs sm:text-sm text-mute">{label}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

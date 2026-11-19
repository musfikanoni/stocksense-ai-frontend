// src/components/landing/LandingFeatures.tsx
// Pure presentational — SSR-safe
import Image from "next/image";
import { LANDING_FEATURES } from "@/constants/landing";

function SectionTitle({ pre, gold, post }: { pre?: string; gold: string; post?: string }) {
  return (
    <h2 className="text-3xl font-bold sm:text-4xl">
      {pre} <span className="text-gold">{gold}</span> {post}
    </h2>
  );
}

export default function LandingFeatures() {
  return (
    <section id="feature" className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20 text-center">
      <SectionTitle gold="Everything" post="You Need to Win" />
      <p className="mb-8 sm:mb-10 mt-3 text-sm sm:text-base text-white/70">
        Professional tools, simplified for serious retail traders.
      </p>
      <div className="grid gap-4 sm:gap-5 text-left sm:grid-cols-2">
        {LANDING_FEATURES.map((f) => (
          <article
            key={f.title}
            className="reveal card-hover overflow-hidden rounded-2xl border border-gold/40 bg-black"
          >
            <div className="relative h-44 sm:h-52">
              <Image
                src={`/landing/${f.img}.webp`}
                alt=""
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-mute">{f.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

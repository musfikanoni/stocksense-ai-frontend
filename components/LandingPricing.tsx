"use client";
import Image from "next/image";
import Link from "next/link";
import { useGetPlansQuery } from "@/redux/api/plansApi";
import { Icon } from "./icons";
import Skeleton from "./Skeleton";

export default function LandingPricing() {
  const { data: plans = [], isLoading } = useGetPlansQuery();

  if (isLoading) {
    return (
      <div className="grid gap-5 text-left sm:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-card/40 p-8 text-center text-mute">
        <p>No plans available at the moment. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 text-left sm:grid-cols-2">
      {plans.map((p) => {
        const id = p._id ?? String(p.id);
        return (
          <div
            key={id}
            className={`reveal card-hover relative flex flex-col overflow-hidden rounded-2xl border p-6 ${
              p.highlight
                ? "border-gold/60"
                : "border-line bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]"
            }`}
          >
            {p.highlight && (
              <Image
                src="/landing/premium-bg.webp"
                alt=""
                fill
                sizes="400px"
                className="object-cover"
              />
            )}
            <div className="relative flex flex-1 flex-col">
              <h3
                className={`flex items-center gap-2 font-semibold ${
                  p.highlight ? "text-gold" : ""
                }`}
              >
                {p.highlight && <Icon name="bolt" />}
                {p.name}
              </h3>
              <p className="mt-3 border-b border-white/10 pb-4 text-3xl font-bold">
                {p.price}$
                <span className="text-sm font-normal text-mute">/month</span>
              </p>
              <ul className="my-5 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Icon
                      name="check"
                      className={`h-4 w-4 shrink-0 ${
                        p.highlight ? "text-gold" : "text-white"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={
                  p.highlight
                    ? "btn-gold block text-center"
                    : "block rounded-lg bg-white/10 py-2.5 text-center text-sm font-semibold text-mute transition hover:bg-white/15"
                }
              >
                {p.price === 0 ? "Get Started Free" : "Upgrade to " + p.name}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

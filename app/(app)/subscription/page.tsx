"use client";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Icon } from "@/components/icons";

export default function Subscription() {
  const plans = useAppSelector((s) => s.plans);
  const [current, setCurrent] = useState("Free");
  const currentPrice = plans.find((p) => p.name === current)?.price ?? 0;
  return (
    <div>
      <h1 className="mb-1 text-center text-2xl font-bold">Choose Your <span className="text-gold">Plan</span></h1>
      <p className="mb-8 text-center text-sm text-mute">Upgrade to unlock full AI analysis</p>
      <div className="stagger mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        {plans.map((p) => (
          <div key={p.id} className={`card card-hover flex flex-col ${p.highlight ? "border-gold/60" : ""}`}>
            <h2 className={`flex items-center gap-2 font-semibold ${p.highlight ? "text-gold" : ""}`}>{p.highlight && <Icon name="bolt" />}{p.name}</h2>
            <p className="mt-3 border-b border-line pb-4 text-3xl font-bold">{p.price}$<span className="text-sm font-normal text-mute">/month</span></p>
            <ul className="my-5 flex-1 space-y-2 text-sm">{p.features.map((f) => (<li key={f} className="flex items-center gap-2"><Icon name="check" className={`h-4 w-4 shrink-0 ${p.highlight ? "text-gold" : ""}`} />{f}</li>))}</ul>
            {current === p.name
              ? <button disabled className="w-full rounded-lg bg-white/10 py-2.5 text-sm font-semibold text-mute">Current Plan</button>
              : <button className="btn-gold w-full" onClick={() => setCurrent(p.name)}>{p.price > currentPrice ? `Upgrade to ${p.name}` : `Switch to ${p.name}`}</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

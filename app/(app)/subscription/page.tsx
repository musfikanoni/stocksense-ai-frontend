"use client";
import { useState } from "react";
import { useGetPlansQuery } from "@/redux/api/plansApi";
import {
  useGetBillingQuery,
  useCreateCheckoutMutation,
} from "@/redux/api/billingApi";
import { Icon } from "@/components/icons";
import Skeleton from "@/components/Skeleton";

export default function Subscription() {
  const { data: plans = [], isLoading: plansLoading } = useGetPlansQuery();
  const { data: billing } = useGetBillingQuery();
  const [checkout] = useCreateCheckoutMutation();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const currentPlan = billing?.plan.name ?? "Free";

  const handleUpgrade = async (planId: string, planName: string) => {
    setBusy(planId);
    setErr("");
    try {
      const { url } = await checkout({ planId, cycle: "Monthly" }).unwrap();
      window.location.href = url;
    } catch (e: unknown) {
      setErr((e as { data?: { message?: string } })?.data?.message ?? `Could not start checkout for ${planName}.`);
    } finally {
      setBusy(null);
    }
  };

  if (plansLoading) return <div className="space-y-4"><Skeleton className="h-10" /><div className="grid gap-5 sm:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div></div>;

  return (
    <div>
      <h1 className="mb-1 text-center text-2xl font-bold">Choose Your <span className="text-gold">Plan</span></h1>
      <p className="mb-8 text-center text-sm text-mute">Upgrade to unlock full AI analysis</p>
      {err && <p role="alert" className="mb-4 rounded-lg bg-down/15 px-4 py-2 text-center text-sm text-down">{err}</p>}
      <div className="stagger mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        {plans.map((p) => {
          const id = p._id ?? String(p.id);
          const isCurrent = p.name === currentPlan;
          return (
            <div key={id} className={`card card-hover flex flex-col ${p.highlight ? "border-gold/60" : ""}`}>
              <h2 className={`flex items-center gap-2 font-semibold ${p.highlight ? "text-gold" : ""}`}>{p.highlight && <Icon name="bolt" />}{p.name}</h2>
              <p className="mt-3 border-b border-line pb-4 text-3xl font-bold">{p.price}$<span className="text-sm font-normal text-mute">/month</span></p>
              <ul className="my-5 flex-1 space-y-2 text-sm">{p.features.map((f) => (<li key={f} className="flex items-center gap-2"><Icon name="check" className={`h-4 w-4 shrink-0 ${p.highlight ? "text-gold" : ""}`} />{f}</li>))}</ul>
              {isCurrent
                ? <button disabled className="w-full rounded-lg bg-white/10 py-2.5 text-sm font-semibold text-mute">Current Plan</button>
                : p.price === 0
                  ? <button disabled className="w-full rounded-lg bg-white/10 py-2.5 text-sm font-semibold text-mute">Free Plan</button>
                  : <button className="btn-gold w-full" disabled={busy === id} onClick={() => handleUpgrade(id, p.name)}>
                      {busy === id ? "Redirecting…" : `Upgrade to ${p.name}`}
                    </button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

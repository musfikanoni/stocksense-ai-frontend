"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useGetPlansQuery } from "@/redux/api/plansApi";
import {
  useAdminCreatePlanMutation,
  useAdminUpdatePlanMutation,
} from "@/redux/api/adminApi";
import type { Plan } from "@/redux/type";
import PlanModal from "@/components/PlanModal";
import Switch from "@/components/Switch";
import { Icon } from "@/components/icons";
import type { Plan as UiPlan } from "@/redux/type";

export default function AdminPlans() {
  const { data: plans = [], isLoading } = useGetPlansQuery();
  const [createPlan] = useAdminCreatePlanMutation();
  const [updatePlan] = useAdminUpdatePlanMutation();
  const [modal, setModal] = useState<{ plan?: Plan } | null>(null);

  const handleSave = async (p: UiPlan) => {
    try {
      if (modal?.plan) {
        await updatePlan({ id: modal.plan._id, name: p.name, price: p.price, highlight: p.highlight, features: p.features }).unwrap();
        toast.success(`Plan "${p.name}" updated successfully!`);
      } else {
        await createPlan({ name: p.name, price: p.price, highlight: p.highlight, features: p.features }).unwrap();
        toast.success(`Plan "${p.name}" created successfully!`);
      }
      setModal(null);
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not save plan.";
      toast.error(msg);
    }
  };

  const handleToggleHighlight = async (p: Plan) => {
    const id = p._id ?? String(p.id);
    try {
      await updatePlan({ id, name: p.name, price: p.price, highlight: !p.highlight, features: p.features }).unwrap();
      toast.success(`Highlight toggled for ${p.name}.`);
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not update highlight.";
      toast.error(msg);
    }
  };

  if (isLoading) return <div className="card text-center text-mute">Loading plans…</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Pricing Plan Management</h2>
      <div className="stagger grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => {
          const id = p._id ?? String(p.id);
          return (
            <section key={id} className={`card card-hover flex flex-col ${p.highlight ? "border-gold/60 shadow-[0_10px_40px_-15px_rgba(245,200,75,0.4)]" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <span className="flex items-center gap-2 text-xs text-mute">
                  Highlight
                  <Switch on={p.highlight} onChange={() => handleToggleHighlight(p)} label={`Highlight ${p.name}`} />
                </span>
              </div>
              <p className="mt-3 border-b border-line pb-4 text-3xl font-bold">{p.price}$<span className="text-sm font-normal text-mute">/month</span></p>
              <ul className="my-5 flex-1 space-y-2 text-sm">{p.features.map((f) => (<li key={f} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 shrink-0 text-gold" />{f}</li>))}</ul>
              <button className="btn-gold w-full" onClick={() => setModal({ plan: p })}>Edit Plan</button>
            </section>
          );
        })}
        <button onClick={() => setModal({})} className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gold/40 text-gold transition duration-200 hover:bg-gold/5 active:scale-[0.99]">
          <Icon name="plus" className="h-8 w-8" />Create New Plan
        </button>
      </div>
      {modal && (
        <PlanModal
          plan={modal.plan}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

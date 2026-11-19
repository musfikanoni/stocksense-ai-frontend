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

export default function AdminPlansView() {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Pricing Plan Management</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          <div className="h-96 rounded-2xl border border-line bg-panel/60 animate-pulse" />
          <div className="h-96 rounded-2xl border border-line bg-panel/60 animate-pulse" />
          <div className="h-96 rounded-2xl border border-dashed border-line/60 bg-panel/30 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Pricing Plan Management</h2>
      <div className="stagger grid items-stretch gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => {
          const id = p._id ?? String(p.id);
          return (
            <section
              key={id}
              className={`card card-hover flex flex-col p-5 sm:p-6 ${
                p.highlight ? "border-gold/60 shadow-[0_10px_40px_-15px_rgba(245,200,75,0.4)]" : ""
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{p.name}</h3>
                  {p.highlight && (
                    <span className="shrink-0 rounded bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold">
                      Highlighted
                    </span>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-mute shrink-0 cursor-pointer">
                  <span>Highlight</span>
                  <Switch
                    on={p.highlight}
                    onChange={() => handleToggleHighlight(p)}
                    label={`Highlight ${p.name}`}
                  />
                </label>
              </div>

              <p className="mt-3 border-b border-line pb-4 text-3xl font-bold">
                {p.price}$
                <span className="text-sm font-normal text-mute">/month</span>
              </p>

              <ul className="my-5 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Icon name="check" className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="btn-gold w-full mt-auto"
                onClick={() => setModal({ plan: p })}
              >
                Edit Plan
              </button>
            </section>
          );
        })}
        <button
          onClick={() => setModal({})}
          className="group flex min-h-[7rem] sm:min-h-[8rem] lg:min-h-[18rem] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gold/40 p-6 text-gold transition duration-200 hover:border-gold hover:bg-gold/5 active:scale-[0.99]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold transition duration-200 group-hover:scale-110 group-hover:bg-gold/20">
            <Icon name="plus" className="h-6 w-6" />
          </div>
          <span className="font-semibold text-sm sm:text-base">Create New Plan</span>
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

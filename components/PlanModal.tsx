"use client";
import { useEffect, useState } from "react";
import type { Plan } from "@/redux/type";
import Switch from "./Switch";
import { Icon } from "./icons";

export default function PlanModal({ plan, onSave, onClose }: { plan?: Plan; onSave: (p: Plan) => void; onClose: () => void }) {
  const [name, setName] = useState(plan?.name ?? "");
  const [price, setPrice] = useState(plan ? String(plan.price) : "");
  const [highlight, setHighlight] = useState(plan?.highlight ?? false);
  const [features, setFeatures] = useState<string[]>(plan?.features ?? []);
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const addFeature = () => {
    const t = draft.trim();
    if (t && !features.includes(t)) setFeatures([...features, t]);
    setDraft("");
  };
  const confirm = () => {
    const n = Number(price);
    if (!name.trim()) return setErr("Enter a plan name.");
    if (price.trim() === "" || Number.isNaN(n) || n < 0) return setErr("Enter a valid price.");
    const all = draft.trim() && !features.includes(draft.trim()) ? [...features, draft.trim()] : features;
    onSave({ id: plan?.id ?? Date.now(), name: name.trim(), price: n, highlight, features: all });
  };

  return (
    <div className="animate-fade-in fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={plan ? "Edit Plan" : "Create New Plan"} onClick={onClose}>
      <div className="card animate-scale-in w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="font-semibold">{plan ? "Edit Plan" : "Create New Plan"}</h2><button onClick={onClose} aria-label="Close" className="text-mute hover:text-white"><Icon name="x" /></button></div>
        <label className="block text-sm"><span className="mb-1 block text-mute">Plan Name</span><input className="input" placeholder="Enter plan name" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="block text-sm"><span className="mb-1 block text-mute">Plan Price ($)</span><input className="input" inputMode="decimal" placeholder="Enter plan price amount" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
        <div className="flex items-center justify-between text-sm"><span>Highlight</span><Switch on={highlight} onChange={() => setHighlight(!highlight)} label="Highlight plan" /></div>
        <div className="text-sm">
          <span className="mb-1 block text-mute">Plan Feature</span>
          <ul className="mb-2 space-y-1.5">
            {features.map((f) => (
              <li key={f} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5"><span>{f}</span>
                <button onClick={() => setFeatures(features.filter((x) => x !== f))} aria-label={`Remove ${f}`} className="text-mute hover:text-down"><Icon name="x" className="h-3.5 w-3.5" /></button></li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input className="input" placeholder="Explain plan feature" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
            <button type="button" onClick={addFeature} className="btn-outline shrink-0 !px-3">Add</button>
          </div>
        </div>
        {err && <p role="alert" className="text-sm text-down">{err}</p>}
        <div className="flex gap-3"><button className="btn-outline flex-1" onClick={onClose}>Cancel</button><button className="btn-gold flex-1" onClick={confirm}>Confirm</button></div>
      </div>
    </div>
  );
}
